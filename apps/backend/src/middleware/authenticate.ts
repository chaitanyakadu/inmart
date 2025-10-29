import { NextFunction, Request, Response } from "express";
import { redis } from "../server.js";
import { prisma } from "@repo/postgres_db/prisma";

export async function authenticate(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<any> {
  try {
    const cookieHeader = req.headers.cookie || null;

    if (!cookieHeader) {
      res.locals.isAuthenticated = false;
      return next();
    }

    const cookies = Object.fromEntries(
      cookieHeader.split("; ").map((c) => c.split("="))
    );

    const sessionToken = cookies["session-token"];
    if (!sessionToken) {
      res.locals.isAuthenticated = false;
      return next();
    }

    // Check Redis
    const cachedSession = await redis.get(`session-token-${sessionToken}`);
    if (cachedSession) {
      const session = JSON.parse(cachedSession);
      if (session.expires > new Date()) {
        await redis.expire(`session-token-${sessionToken}`, 1200);
        res.locals.isAuthenticated = true;
        res.locals.userId = session.userId;
        return next(); // stop here
      }
    }

    // Check Database
    const sessionInfo = await prisma.session.findUnique({
      where: { sessionToken },
    });

    if (sessionInfo && sessionInfo.expires > new Date()) {
      await redis.expire(`session-token-${sessionToken}`, 1200);
      res.locals.isAuthenticated = true;
      res.locals.userId = sessionInfo.userId;
      res.locals.sessionToken = sessionToken;
      return next();
    }

    // If no session found
    res.locals.isAuthenticated = false;
    return next();
  } catch (error) {
    console.warn(error);
    res.locals.isAuthenticated = false;
    return next();
  }
}
