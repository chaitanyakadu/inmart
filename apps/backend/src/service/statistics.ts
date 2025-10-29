import { CustomError, Result, UserCreditsData } from "@repo/types/backend";
import axios from "axios";
import express, { Request, Response } from "express";
import { getUserCookie } from "../endpoints.js";
import { prisma } from "@repo/postgres_db/prisma";
import { platform } from "os";
import { totalErrors } from "../server.js";

const Router = express.Router();

Router.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    res.status(200).send("Yet to implement!");
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

Router.get(
  "/user-history",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { userId } = res.locals;
      if (!userId) {
        return new CustomError(
          "Passed authentication and userId is missing.",
          "Server Error!"
        );
      }

      const userHistory = await prisma.userHistory.findMany({
        where: {
          userId,
        },
        select: {
          customerName: true,
          customerCountry: true,
          medicineName: true,
          medicineCategory: true,
          details: true,
          status: true,
          createdAt: true,
        },
      });

      return res.status(200).json(
        new Result({
          success: true,
          data: userHistory,
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
  }
);

Router.get(
  "/get_user_credit",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const cookie = getUserCookie(req);

      const result = await axios({
        url: "https://seller.indiamart.com/bltxn/default/get_user_credit/",
        headers: {
          accept: "application/json, text/javascript, */*; q=0.01",
          "accept-language": "en-US,en;q=0.9",
          "cache-control": "no-cache",
          pragma: "no-cache",
          priority: "u=1, i",
          "sec-ch-ua":
            '"Not)A;Brand";v="8", "Chromium";v="138", "Brave";v="138"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": platform(),
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "sec-gpc": "1",
          "x-requested-with": "XMLHttpRequest",
          cookie,
          Referer: "https://seller.indiamart.com/bltxn/?pref=relevant",
        },
        method: "POST",
      });

      const data: UserCreditsData = {
        weeklyExpAlloted: result.data.weekly_exp_alloted,
        weeklyExpAvai: result.data.weekly_exp_avai,
        totalExpAvai: result.data.total_exp_avai,
      };
      res.status(200).json(
        new Result({
          success: true,
          data,
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
  }
);

export default Router;
