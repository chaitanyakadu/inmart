import { NextFunction, Request, Response } from "express";
import { redis, totalErrors } from "../server.js";
import { prisma } from "@repo/postgres_db/prisma";
import { Result } from "@repo/types/backend";

export async function onlyAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const cookie = req.headers.cookie;

    if (cookie) {
      for (const element of cookie.split("; ")) {
        const key = element.split("=")[0];
        let value = element.split("=")[1];
        value = value?.trim();
        if (value?.includes(";")) value = value.slice(0, -1);

        if (key === "session-token") {
          // cache-hit?
          {
            const sessionInfo = await redis.get(`session-token-${value}`);
            if (sessionInfo) {
              const session = JSON.parse(sessionInfo);
              if (session.expires > new Date()) {
                await redis.expire(`session-token-${value}`, 10);
                res.locals.isAuthenticated = true;
                res.locals.userId = session.userId;
                return next();
              }
            }
          }

          // check the database
          {
            const sessionInfo = await prisma.session.findUnique({
              where: {
                sessionToken: value,
              },
              select: {
                sessionToken: true,
                expires: true,
                userId: true,
              },
            });

            if (
              sessionInfo &&
              sessionInfo?.expires &&
              sessionInfo?.expires > new Date()
            ) {
              await redis.set(
                `session-token-${value}`,
                JSON.stringify(sessionInfo),
                "EX",
                1200
              );
              res.locals.sessionToken = value;
              res.locals.userId = sessionInfo.userId;
              return next();
            }
          }
        }
      }
    }

    totalErrors.inc();
    return res.status(401).json(
      new Result({
        success: false,
        redirectUrl: "/auth/login",
      })
    );
  } catch (error: any) {
    console.warn(error);
    totalErrors.inc();
    return res.status(500).json(
      new Result({
        success: false,
      })
    );
  }
}
