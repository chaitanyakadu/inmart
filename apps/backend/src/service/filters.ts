import { prisma } from "@repo/postgres_db/prisma";
import { CustomError, Result } from "@repo/types/backend";
import express, { Request, Response } from "express";
import { totalErrors } from "../server.js";

const Router = express.Router();

Router.get("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = res.locals;

    const filterData = await prisma.filter.findMany({
      where: {
        userId,
      },
      omit: {
        userId,
      },
    });

    return res.status(200).json(
      new Result({
        success: true,
        data: filterData,
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

Router.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    let {
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
    } = req.body;

    const { userId } = res.locals;

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
      !userId
    ) {
      
      throw new CustomError("Credentials are mising.", "Missing Credentials");
    }

    try {
      await prisma.filter.create({
        data: {
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
        },
      });
    } catch (error) {
      return res.status(200).json(
        new Result({
          success: false,
          info: "Kindly enter a unique title.",
        })
      );
    }

    return res.status(200).json(
      new Result({
        success: true,
        info: "New filter added successfully!",
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

Router.put("/", async (req: Request, res: Response): Promise<any> => {
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
    } = req.body;

    const { userId } = res.locals;

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
      !userId
    ) {
      
      throw new CustomError("Credentials are mising.", "Missing Credentials");
    }

    await prisma.filter.update({
      where: {
        title,
      },
      data: {
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
      },
    });

    return res.status(200).json(
      new Result({
        success: false,
        info: "Filter updated successfully!",
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
    const { title } = req.body;

    if (!title) {
      
      throw new CustomError("Credentials are mising.", "Missing Credentials");
    }

    await prisma.filter.delete({
      where: {
        title,
      },
    });

    return res.status(200).json(
      new Result({
        success: false,
        info: "Filter deleted successfully!",
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
