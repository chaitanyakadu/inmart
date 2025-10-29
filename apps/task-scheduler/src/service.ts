import { FilterData } from "@repo/types/database";
import { CronJob } from "cron";
import { Redis } from "ioredis";
import client from "prom-client";
import http from "node:http";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(path.dirname("../../../"), ".env"),
});

const CRON_TIME: string = process.env.CRON_TIME || "*/2 * * * * *";
const REDIS_HOST: string = process.env.REDIS_HOST || "localhost";

const activeConnection = new client.Gauge({
  name: "active_service",
  help: "number_of_active_sevices",
});

const activeWorkers = new client.Gauge({
  name: "active_workers",
  help: "number_of_active_workers",
});

const idleWorkers = new client.Gauge({
  name: "idle_workers",
  help: "number_of_idle_workers",
});

const redis = await new Redis({
  host: REDIS_HOST,
  port: 6379,
});
const redisForAdd = redis.duplicate();
const redisForRemove = redis.duplicate();

const taskMap = new Map<string, FilterData>();

await redisForAdd.subscribe("add-user-tasks").catch((error) => {
  console.warn(error);
});
redisForAdd.on("message", async (_, message) => {
  const data = JSON.parse(message);
  data.maxLeads > 10 ? (data.maxLeads = 10) : null;
  data.maxLeads < 1 ? (data.maxLeads = 1) : null;
  taskMap.set(`user-task-${data.sessionToken}`, data);
  await redis.set(`user-task-${data.sessionToken}`, "active");
  await redis.set(`user-task-leads-${data.sessionToken}`, data.maxLeads);
  activeConnection.inc();
  // console.log(`${new Date()}: New Service:-${taskMap}`);
});

// subscribe to redis remove task
redisForRemove.subscribe("remove-user-tasks").catch((error) => {
  console.warn;
});
redisForRemove.on("message", async (_, message) => {
  taskMap.delete(`user-task-${message}`);
  await redis.del(`user-task-${message}`);
  activeConnection.dec();
  // console.log(`${new Date()}: Removed Service:- ${taskMap}`);
});

CronJob.from({
  cronTime: "*/4 * * * * *",
  name: "Workers health.",
  onTick: async () => {
    try {
      const activeWorkersList = await redis.smembers("active-workers");
      activeWorkers.reset();
      idleWorkers.reset();
      activeWorkersList.forEach(async (workerId) => {
        activeWorkers.inc();
        const workerStatus = await redis.get(`worker-heartbeat:${workerId}`);
        if (workerStatus) {
          const workerStatusJson = JSON.parse(workerStatus);
          if (workerStatusJson.status === "idle") {
            idleWorkers.inc();
          }
        } else {
          await redis.srem("active-workers", workerId);
        }
      });
    } catch (error) {}
  },
  start: true,
  timeZone: "Asia/Kolkata",
});

CronJob.from({
  cronTime: CRON_TIME,
  name: "Task scheduler.",
  onTick: async () => {
    // for each hashmap params execute
    for (const element of taskMap) {
      const [key, value] = element;
      const leads = await redis.get(`user-task-leads-${value.sessionToken}`);
      // console.log(`${new Date()}: Max leads are:- ${leads}`);
      if (Number(leads) < 1) {
        taskMap.delete(key);
        await redis.del(`user-task-leads-${value.sessionToken}`);
        await redis.del(key);
      } else {
        value.maxLeads = Number(leads);
      }

      try {
        if (leads) {
          // console.log(`${new Date()}: Assigning task`);
          // get workers id
          await redis.rpush(
            "task_queue",
            JSON.stringify({ value, createdAt: new Date() })
          );
        }
      } catch (error: any) {
        console.warn(error);
      }
    }
  },
  start: true,
  timeZone: "Asia/Kolkata",
});

const register = client.register;
const server = http.createServer();

server.on("request", async (_, res) => {
  res.writeHead(200, { "Content-Type": register.contentType });
  res.end(await register.metrics());
});

const PORT = 8082;
server.listen(PORT, () =>
  console.log(`Listening prometheus metrics for task scheduler on port ${PORT}`)
);
