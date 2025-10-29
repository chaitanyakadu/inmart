import express, { Request, Response } from "express";
import { prisma } from "@repo/postgres_db/prisma";
import { Result } from "@repo/types/backend";
import { totalErrors } from "../server.js";

const Router = express.Router();

Router.delete("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = res.locals;

    await prisma.user.delete({
      where: {
        id: userId,
      },
    });

    req.headers.cookie?.split("; ").forEach((v) => {
      const cookieName = v.split("=");
      res.clearCookie(cookieName[0]!);
    });

    return res.status(204).json(
      new Result({
        success: true,
        info: "Account deleted successfully!",
        redirectUrl: "/auth/login",
      })
    );
  } catch (error: any) {
    console.warn(error);
    totalErrors.inc();
    res.status(500).json(
      new Result({
        success: false,
      })
    );
  }
});

export default Router;
