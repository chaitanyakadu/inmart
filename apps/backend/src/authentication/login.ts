import axios from "axios";
import express, { Request, Response } from "express";
import { google } from "googleapis";
import { CustomError, Result } from "@repo/types/backend";
import { prisma } from "@repo/postgres_db/prisma";
import {
  totalErrors
} from "../server.js";

const Router = express.Router();

Router.get("/", async (_: Request, res: Response): Promise<any> => {
  try {
    const { isAuthenticated } = res.locals;

    if (isAuthenticated) {
      return res.status(200).json(
        new Result({
          success: false,
          info: "Already logged in!",
          redirectUrl: "/profile",
        })
      );
    }

    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;

    if (!GOOGLE_CLIENT_ID || !GOOGLE_REDIRECT_URI || !GOOGLE_CLIENT_SECRET) {
      
      throw new CustomError(
        "The google authentication credentials are missing.",
        "Missing Credentials!"
      );
    }

    const oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI
    );
    const scopes: Array<string> = ["email", "profile"];

    const url = oauth2Client.generateAuthUrl({
      access_type: "offline",
      scope: scopes,
    });
    res.status(200).json(
      new Result({
        success: true,
        redirectUrl: url,
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

Router.get("/callback", async (req: Request, res: Response): Promise<any> => {
  try {
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const GOOGLE_REDIRECT_URI = process.env.GOOGLE_REDIRECT_URI;
    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";

    if (!GOOGLE_CLIENT_ID || !GOOGLE_REDIRECT_URI || !GOOGLE_CLIENT_SECRET) {
      
      throw new CustomError(
        "The google authentication credentials are missing.",
        "Missing Credentials!"
      );
    }

    const oauth2Client = new google.auth.OAuth2(
      GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET,
      GOOGLE_REDIRECT_URI
    );

    let code: any = req.query;
    if (!code) {
      
      throw new CustomError(
        "The 'code' is not present in the query.",
        "Missing Credentials!"
      );
    }

    const { tokens } = await oauth2Client.getToken(code);
    const { access_token } = tokens;

    const { data: profile } = await axios.get(
      "https://www.googleapis.com/oauth2/v2/userinfo",
      {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }
    );

    const userInfo = await prisma.user.findUnique({
      where: {
        email: profile.email,
      },
    });

    if (userInfo && userInfo.cookie) {
      let expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 2);

      const sessionsArr = await prisma.session.findMany({
        where: { userId: userInfo.id },
      });

      if (sessionsArr.length > 2) {
        await prisma.session.delete({
          where: {
            sessionToken: sessionsArr[1]?.sessionToken,
          },
        });
      }

      const session = await prisma.session.create({
        data: {
          userId: userInfo.id,
          expires: expiresAt,
          device: req.headers["sec-ch-ua-platform"]![0] || "unknown",
        },
      });

      const loginData = JSON.parse(userInfo.cookie);

      const rawDataCookie = Object.entries(loginData.DataCookie)
        .map(([k, v]) => `${k}=${v ?? ""}`)
        .join("|");

      res.cookie("ImeshVisitor", rawDataCookie, {
        httpOnly: false,
        domain: process.env.DOMAIN || "localhost",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      // plain values
      res.cookie("access", loginData.access, {
        httpOnly: false,
        domain: process.env.DOMAIN || "localhost",
        sameSite: "lax",
      });
      res.cookie("glid", loginData.glid, {
        httpOnly: false,
        domain: process.env.DOMAIN || "localhost",
        sameSite: "lax",
      });

      // im_iss as encoded "t=<jwt>"
      const rawImIss = `t=${loginData.im_iss.t}`;
      res.cookie("im_iss", rawImIss, {
        httpOnly: false,
        domain: process.env.DOMAIN || "localhost",
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000,
      });

      res.cookie("session-token", session.sessionToken, {
        sameSite: "lax",
        domain: process.env.DOMAIN || "localhost",
        secure: false,
      });

      return res.redirect(`${FRONTEND_URL}/profile`);
    }

    const session = await createNewAccount(req, profile);

    if (!session.success) {
      throw new CustomError("Prisma transaction failed!", "Server Error!");
    }
    res.cookie("session-token", session.sessionToken, {
      sameSite: "lax",
      domain: process.env.DOMAIN || "localhost",
      secure: false,
    });

    // if (userInfo.cookie && userInfo.cookieExp > new Date()) {
    //   return res.redirect(`${FRONTEND_URL}/profile`);
    // } else {
    return res.redirect(`${FRONTEND_URL}/auth/connect-account`);
    // }
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

async function createNewAccount(
  req: Request,
  profile: any
): Promise<{ success: boolean; sessionToken?: string }> {
  try {
    const session = await prisma.$transaction(async (tx: any) => {
      const userInfo = await tx.user.create({
        data: {
          firstName: profile.given_name,
          lastName: profile.family_name,
          image: profile.picture,
          email: profile.email,
          verifiedEmail: profile.verified_email,
        },
      });

      let expiresAt = new Date();
      expiresAt.setMonth(expiresAt.getMonth() + 2);

      const session = await tx.session.create({
        data: {
          userId: userInfo.id,
          expires: expiresAt,
          device: req.headers["sec-ch-ua-platform"] || "unknown",
        },
      });

      return session;
    });

    return {
      success: true,
      sessionToken: session.sessionToken,
    };
  } catch (error: any) {
    console.warn(error);
    totalErrors.inc();
    return {
      success: false,
    };
  }
}

export default Router;
