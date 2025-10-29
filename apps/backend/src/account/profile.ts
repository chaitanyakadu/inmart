import express, { Request, Response } from "express";
import { CustomError, Result } from "@repo/types/backend";
import { prisma } from "@repo/postgres_db/prisma";
import axios from "axios";
import { getUserCookie } from "../endpoints.js";
import { UserDetails } from "@repo/types/web";
import { platform } from "os";
import { totalErrors } from "../server.js";

const Router = express.Router();

Router.get("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = res.locals;
    if (!userId) {
      throw new CustomError(
        "Passed authentication and userId is missing.",
        "Server Error!"
      );
    }

    const userData = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        firstName: true,
        lastName: true,
        email: true,
        contact: true,
      },
    });

    return res.status(200).json(
      new Result({
        success: true,
        data: {
          "First Name": userData?.firstName,
          "Last Name": userData?.lastName,
          Email: userData?.email,
          Contact: userData?.contact,
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

Router.put("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const { userId } = res.locals;
    const { "First Name": firstName, "Last Name": lastName } = req.body;

    if (!userId || !firstName || !lastName) {
      throw new CustomError(
        "Kindly provide all the required parameters.",
        "Invalid credentials!"
      );
    }

    const userData = await prisma.user.update({
      where: {
        id: userId,
      },
      data: {
        firstName,
        lastName,
      },
    });

    return res.status(200).json(
      new Result({
        success: true,
        data: {
          userData,
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

export default Router;

Router.get(
  "/userDetails",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const cookie = getUserCookie(req);

      const result = await axios({
        url: "https://seller.indiamart.com/miscreact/ajaxrequest/seller/UserDetails/?sourcescreen=BusinessProfile",
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.6",
          "cache-control": "no-cache",
          "content-type": "application/json",
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
          cookie,
          Referer: "https://seller.indiamart.com/companyprofile/manageprofile/",
        },
        method: "POST",
      });

      const userDetails: UserDetails = {
        firstName: result.data.ceo_fname,
        lastName: result.data.ceo_lname,
        glid: result.data.glid,
        country: result.data.country,
        companyName: result.data.company_name,
        phoneNumber: result.data.glusr_usr_ph_mobile,
        image: result.data.image,
      };

      return res.status(200).json(
        new Result({
          success: true,
          data: userDetails,
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
);
