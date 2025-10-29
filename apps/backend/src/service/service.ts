import { CustomError, Result } from "@repo/types/backend";
import express, { Request, Response } from "express";
import { redis, totalErrors } from "../server.js";
import { prisma } from "@repo/postgres_db/prisma";

const Router = express.Router();

Router.put("/start", async (req: Request, res: Response): Promise<any> => {
  try {
    const {
      whatsappActive,
      mobVerified,
      emailVerified,
      buyerReply,
      buyerRequirement,
      buyerCalls,
      sec,
      allowCountries,
      allowCategories,
      restrictMedicines,
      allowOnlyMedicines,
      aiInstructions,
      totalMessages,
      triggerOn,
      triggerType,
      minPointsForPurchase,
      email,
      fullName,
      companyName,
      title,
      maxLeads,
      sessionToken,
      glusrId,
      cookies,
      mobNumber,
    } = req.body;
    const { userId } = res.locals;

    const userData = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        email: true,
      },
    });
    if (!userData) {
      
      throw new CustomError("User not found.", "Server Error!");
    }

    if (
      !whatsappActive ||
      !mobVerified ||
      !emailVerified ||
      !buyerReply ||
      !buyerRequirement ||
      !buyerCalls ||
      !sec ||
      // !allowCountries ||
      // !allowCategories ||
      // !restrictMedicines ||
      // !allowOnlyMedicines ||
      // !aiInstructions ||
      // !totalMessages ||
      !triggerOn ||
      !triggerType ||
      !minPointsForPurchase ||
      !email ||
      !fullName ||
      !companyName ||
      !title ||
      !userId ||
      !sessionToken ||
      !glusrId ||
      !cookies ||
      !mobNumber
    ) {
      
      throw new CustomError("Credentials are mising.", "Missing Credentials");
    }

    const data = JSON.stringify({
      needWhatsappActive: whatsappActive.isTrue,
      pointWhatsappActive: Number(whatsappActive.points),
      needMobVerified: mobVerified.isTrue,
      pointMobVerified: Number(mobVerified.points),
      needEmailVerified: emailVerified.isTrue,
      pointEmailVerified: Number(emailVerified.points),
      needBuyerReply: buyerReply.isTrue,
      pointBuyerReply: Number(buyerReply.points),
      needBuyerRequirement: buyerRequirement.isTrue,
      pointBuyerRequirement: Number(buyerRequirement.points),
      needBuyerCalls: buyerCalls.isTrue,
      pointBuyerCalls: Number(buyerCalls.points),
      needSec: sec.isTrue,
      pointSec: Number(sec.points),
      allowCountries,
      allowCategories,
      restrictMedicines,
      allowOnlyMedicines,
      aiInstructions,
      totalMessages: Number(totalMessages),
      triggerOn,
      triggerType,
      minPointsForPurchase: Number(minPointsForPurchase),
      userId,
      fullName,
      companyName,
      email,
      title,
      maxLeads,
      sessionToken,
      glusrId,
      cookies,
      mobNumber,
    });
    await redis.publish("add-user-tasks", data);

    return res.status(200).json(
      new Result({
        success: true,
        info: "Task started successfully!",
      })
    );
  } catch (error: any) {
    console.warn(error);
    return res.status(500).json(
      new Result({
        success: false,
      })
    );
  }
});

Router.put("/stop", async (req: Request, res: Response): Promise<any> => {
  try {
    try {
      const { userId } = res.locals;

      if (!userId) {
        
        throw new CustomError("Credentials are mising.", "Missing Credentials");
      }

      const cookieHeader = req.headers.cookie || null;

      if (!cookieHeader) {
        res.locals.isAuthenticated = false;
        return new CustomError("Credentials missing!.", "Server Error!");
      }
      const cookies = Object.fromEntries(
        cookieHeader.split("; ").map((c) => c.split("="))
      );

      const sessionToken = cookies["session-token"];

      await redis.publish("remove-user-tasks", sessionToken);

      return res.status(200).json(
        new Result({
          success: true,
          info: "Task stopped successfully!",
        })
      );
    } catch (error: any) {
      console.warn(error);
      return res.status(500).json(
        new Result({
          success: false,
        })
      );
    }
  } catch (error: any) {
    console.warn(error);
    return res.status(500).json(
      new Result({
        success: false,
      })
    );
  }
});

Router.get("/status", async (req: Request, res: Response): Promise<any> => {
  try {
    const { sessionToken } = res.locals;
    if (!sessionToken) {
      return new CustomError(
        "Credential session token is missing!.",
        "Server Error!"
      );
    }
    const status = await redis.get(`user-task-${sessionToken}`);
    if (status == "active") {
      return res.status(200).json(
        new Result({
          success: true,
          data: {
            status,
          },
        })
      );
    } else {
      return res.status(200).json(
        new Result({
          success: true,
          data: {
            status: "inactive",
          },
        })
      );
    }
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
