import { prisma } from "@repo/postgres_db/prisma";
import { CustomError, Result } from "@repo/types/backend";
import express, { Request, Response } from "express";
import {
  totalErrors
} from "../server.js";

const Router = express.Router();

Router.get("/", async (_: Request, res: Response): Promise<any> => {
  try {
    const { userId } = res.locals;

    if (!userId) {
      throw new CustomError(
        "Passed authentication and userId is missing.",
        "Server Error!"
      );
    }

    const sessions = await prisma.session.findMany({
      where: {
        userId,
      },
      select: {
        sessionToken: true,
        device: true,
        createdAt: true,
      },
    });

    return res.status(200).json(
      new Result({
        success: true,
        data: {
          sessions,
        },
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
});

Router.delete("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const { sessionToken } = req.body;

    if (!sessionToken) {
      
      throw new CustomError(
        "Session token is missing.",
        "Missing Credentials!"
      );
    }
    await prisma.session.delete({
      where: {
        sessionToken,
      },
    });

    return res.status(200).json(
      new Result({
        success: true,
        info: "Successfully removed the session!",
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
});

export default Router;
