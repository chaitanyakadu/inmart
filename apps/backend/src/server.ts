import express, { Response } from "express";
import dotenv from "dotenv";
import cors from "cors";
import {
  authenticate_delete,
  authenticate_logout,
  authenticate_session,
  authentication_login,
  middleware_authenticate,
  middleware_only_authenticated,
  account_notification,
  account_profile,
  service_connect,
  service_filters,
  service_remove,
  service_statistics,
  service,
} from "./endpoints.js";
import { Redis } from "ioredis";
import client from "prom-client";
import path from "path";

dotenv.config({
  path: path.resolve(path.dirname("../../../"), ".env"),
});

const totalRequests = new client.Counter({
  name: "total_requests",
  help: "total_number_of_requests_handled_by_backend ",
});

export const totalErrors = new client.Counter({
  name: "total_errors",
  help: "total_number_of_errors ",
});

const REDIS_HOST: string = process.env.REDIS_HOST || "localhost";

export const redis = await new Redis({
  host: REDIS_HOST,
  port: 6379,
});

const app = express();

const FrontEndUrl = process.env.FRONTEND_URL || "http://localhost:3000";

// todo - configure cors params
app.use(
  cors({
    origin: [FrontEndUrl],
    credentials: true,
  })
);

app.use(express.json());
const register = client.register;
app.get("/metrics", async (req, res) => {
  try {
    res.set("Content-Type", register.contentType);
    res.end(await register.metrics());
  } catch (ex: any) {
    totalErrors.inc();
    res.status(500).end(ex.message);
  }
});

app.use((req, res, next) => {
  totalRequests.inc();
  next();
});

app.get("/health", (_, res: Response) => {
  res.status(200).json({
    service: "India Mart Automation Backend Service",
    status: "Healthy",
  });
});

app.use("/auth/login", middleware_authenticate, authentication_login);
app.use("/auth/logout", middleware_authenticate, authenticate_logout);

app.use(middleware_only_authenticated);
app.use("/auth/session", authenticate_session);
app.use("/auth/delete", authenticate_delete);

app.use("/api/profile", account_profile);
app.use("/api/notifications", account_notification);
app.use("/api/connect", service_connect);
app.use("/api/filters", service_filters);
app.use("/api/remove", service_remove);
app.use("/api/statistics", service_statistics);
app.use("/api/service", service);

app.use((_, res: Response) => {
  totalErrors.inc();
  res.status(404).send("Not Found");
});

const PORT: number = Number(process.env.BACKEND_PORT) || 4000;
const HOSTNAME: string = process.env.BACKEND_HOSTNAME || "localhost";
app.listen(PORT, () => {
  console.log(
    `Backend is listening at port ${PORT} and the host name is ${HOSTNAME}!`
  );
});
