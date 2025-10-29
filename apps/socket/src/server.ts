import WebSocket, { WebSocketServer } from "ws";
import { Redis } from "ioredis";
import { SocketMessage, SocketResponse } from "@repo/types/socket";
import { CustomError } from "@repo/types/backend";
import { prisma } from "@repo/postgres_db/prisma";
import dotenv from "dotenv";
import client from "prom-client";
import http from "node:http";
import path from "path";

dotenv.config({
  path: path.resolve(path.dirname("../../../"), ".env"),
});

const activeConnections = new client.Gauge({
  name: "active_connections",
  help: "active_connections",
});

const register = client.register;

const REDIS_HOST: string = process.env.REDIS_HOST || "localhost";

const redis = await new Redis({
  host: REDIS_HOST,
  port: 6379,
});
const redisForUpdates = redis.duplicate();
const usersMap = new Map<string, WebSocket>();

const wss = new WebSocketServer({
  port: 8080,
});

enum ESockerMessageType {
  // CONNECT = "connect",
  DISCONNECT = "disconnect",
  SERVER_MESSAGE = "server-message",
  STATUS = "status",
  MONITOR_LOGS = "monitor-logs",
}

wss.on("connection", (ws: WebSocket) => {
  activeConnections.inc();

  ws.on("error", console.error);

  ws.on("message", async (message) => {
    try {
      const data: SocketMessage = JSON.parse(message.toString("utf-8"));

      switch (data.messageType) {
        case ESockerMessageType.MONITOR_LOGS: {
          usersMap.set(`live-updates-${data.sessionToken}`, ws);
          // console.log(`${new Date()}: New service:-${data.sessionToken}`);
          break;
        }
        case ESockerMessageType.STATUS: {
          const status = await redis.get(`user-task-${data.sessionToken}`);
          if (status) {
            const response: SocketResponse = {
              type: "status",
              data: "online",
            };
            ws.send(JSON.stringify(response));
          } else {
            const response: SocketResponse = {
              type: "status",
              data: "offline",
            };
            ws.send(JSON.stringify(response));
          }
          break;
        }
        case ESockerMessageType.DISCONNECT: {
          usersMap.delete(`live-updates-${data.sessionToken}`);
          const response: SocketResponse = {
            type: "status",
            data: "offline",
          };
          ws.send(JSON.stringify(response));
          break;
        }
        case ESockerMessageType.SERVER_MESSAGE: {
          const user = usersMap.get(`live-updates-${data.sessionToken}`);

          if (user && data.info) {
            user.send(data.info);
          }
          break;
        }
        default: {
          throw new CustomError(
            "Invalid message type.",
            "Invalid Credentials!"
          );
        }
      }
    } catch (error) {
      console.warn(error);
    }
  });

  ws.on("close", async () => {
    for (const element of usersMap) {
      if (element[1] === ws) {
        const sessionToken =
          element[0].split("-")[element[0].split("-").length - 1];
        await redis.set(`user-task-leads-${sessionToken}`, 0);
        // console.log(`${new Date()}: Deleting element:- ${element[0]}`);
        usersMap.delete(element[0]);
      }
    }
    const response: SocketResponse = {
      type: "status",
      data: "offline",
    };
    activeConnections.dec();
    ws.send(JSON.stringify(response));
  });
});

await redisForUpdates.subscribe("live-updates");

redisForUpdates.on("message", async (_, message) => {
  try {
    const data = JSON.parse(message);
    const ws = usersMap.get(`live-updates-${data.sessionToken}`);

    if (ws) {
      data.userHistory = {
        customerName: data.userHistory.customerName || "",
        customerCountry: data.userHistory.customerCountry || "",
        medicineName: data.userHistory.medicineName || "",
        medicineCategory: data.userHistory.medicineCategory || "",
        details: data.userHistory.details || "",
        status: data.userHistory.status || "",
        createdAt: new Date().toISOString(),
      };

      const response: SocketResponse = {
        type: "monitor-log",
        data: data.userHistory,
      };

      ws.send(JSON.stringify(response));

      const sessionToken: string = data.sessionToken;
      const sessionData = await prisma.session.findUnique({
        where: {
          sessionToken,
        },
        select: {
          userId: true,
        },
      });

      if (!sessionData || !sessionData.userId)
        throw new CustomError("Userid not found.", "Server Error!");

      await prisma.userHistory.create({
        data: {
          userId: sessionData?.userId,
          customerName: data.userHistory.customerName,
          customerCountry: data.userHistory.customerCountry,
          medicineName: data.userHistory.medicineName,
          medicineCategory: data.userHistory.medicineCategory,
          details: data.userHistory.details,
          status: data.userHistory.status,
          createdAt: data.userHistory.createdAt,
        },
      });

      const leads = await redis.get(`user-task-leads-${sessionToken}`);
      if (!leads || Number(leads) < 1) {
        ws.close();
      }
    } else {
      console.warn({ usersMap, data });
      throw new CustomError("User websocket not found.", "Server Error!");
    }
  } catch (error) {
    console.warn(error);
  }
});

const server = http.createServer();

server.on("request", async (_, res) => {
  res.writeHead(200, { "Content-Type": register.contentType });
  res.end(await register.metrics());
});

const PORT = 8081;
server.listen(PORT, () =>
  console.log(`Listening prometheus metrics for socket on port ${PORT}`)
);
