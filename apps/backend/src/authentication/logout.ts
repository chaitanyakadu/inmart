import { prisma } from "@repo/postgres_db/prisma";
import { Result } from "@repo/types/backend";
import express, { Request, Response } from "express";

const Router = express.Router();

Router.put("/", async (req: Request, res: Response): Promise<any> => {
  const { isAuthenticated, sessionToken } = res.locals;

  if (isAuthenticated && sessionToken) {
    try {
      await prisma.session.delete({
        where: {
          sessionToken,
        },
      });

      req.headers.cookie?.split("; ").forEach((v) => {
        const cookieName = v.split("=")
        res.clearCookie(cookieName[0]!);
      });

      return res.status(200).json(
        new Result({
          success: true,
          info: "Successfully logged out",
          redirectUrl: "/auth/login",
        })
      );
    } catch (error: any) {
      console.warn(error);
      return res.status(500).json(
        new Result({
          success: false
        })
      );
    }
  } else {
    return res.status(403).json(
      new Result({
        success: false,
        info: "User is not authenticated.",
      })
    );
  }
});

export default Router;
