import { prisma } from "@repo/postgres_db/prisma";
import { CustomError, Result } from "@repo/types/backend";
import axios from "axios";
import express, { Request, Response } from "express";
import { platform } from "os";

const Router = express.Router();

const headers = {
  accept: "*/*",
  "accept-language": "en-US,en;q=0.7",
  "cache-control": "no-cache",
  "content-type": "application/json",
  pragma: "no-cache",
  priority: "u=1, i",
  "sec-ch-ua": '"Not)A;Brand";v="8", "Chromium";v="138", "Brave";v="138"',
  "sec-ch-ua-mobile": "?0",
  "sec-ch-ua-platform": platform(),
  "sec-fetch-dest": "empty",
  "sec-fetch-mode": "cors",
  "sec-fetch-site": "same-origin",
  "sec-gpc": "1",
  Referer: "https://seller.indiamart.com/",
  cookie: "",
};

const ipAddress = await axios("https://api.ipify.org?format=json").then(
  (val) => {
    return val.data.ip;
  }
);

Router.post(
  "/verify-user",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { phoneNumber } = req.body;
      const { userId } = res.locals;

      if (!phoneNumber || !userId) {
        throw new CustomError("Credentials are missing.", "Server Error!");
      }

      const userInfo = await prisma.user.findUnique({ where: { id: userId } });

      if (
        userInfo?.contact !== phoneNumber &&
        userInfo?.contact?.length &&
        userInfo?.contact?.length > 0
      ) {
        return res.status(400).json(
          new Result({
            success: false,
            data: {
              reason: "another-number",
              phoneNumber,
            },
            info: `Kindly use the already registered mobile number only(Ph no:${userInfo?.contact}).`,
          })
        );
      }

      const verifyUser = await axios({
        url: "https://seller.indiamart.com/miscreact/ajaxrequest/seller/login/verifyUser",
        headers,
        data: `{"username":${phoneNumber},"modid":"SELLERMY","glusr_usr_country":"","ip":"${ipAddress}","ph_country":"91","create_user":"1","format":"JSON","screen_name":"Sellers Form","iso":"IN","loginusing":"","originalreferer":"","email":"","glusr_usr_ip":"","referer":"","glusr_usr_countryname":"","ip_country":"","refurl":""}`,
        method: "POST",
      });

      const { glid, sessionKey } = verifyUser.data.DataCookie;
      if (!glid || !sessionKey) {
        throw new CustomError("Credentials are missing.", "Server Error!");
      }
      await axios({
        url: "https://seller.indiamart.com/miscreact/ajaxrequest/seller/login/identifySession",
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.7",
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
          cookie: `site-entry-page=referral=external; hd_ctval=ctval%3D; iploc=gcniso%3DIN%7Cgcnnm%3DIndia%7Cgctnm%3DPune%7Cgctid%3D70630%7Cgacrcy%3D10%7Cgip%3D${ipAddress}%7Cgstnm%3DMaharashtra; glbcty=Pune; pop_mthd=FL%3D0%7CDTy%3D1; LGNSTR=0%2C2%2C0%2C1%2C1%2C1%2C1%2C0; sessid=spv=2; xnHist=pv%3D0%7Cipv%3D1%7Cfpv%3D0%7Ccity%3D%7Clc_city%3Dundefined%7Ccvstate%3Dundefined%7Cpopupshown%3Dundefined%7Cinstall%3Dundefined%7Css%3Dundefined%7Cmb%3Dundefined%7Ctm%3Dundefined%7Cage%3Dundefined%7Ccount%3D0%7Ctime%3DFri%20Aug%2029%202025%2009%3A51%3A38%20GMT+0530%20%28India%20Standard%20Time%29%7Cglid%3D${glid}%7Cgname%3Dundefined%7Cgemail%3Dundefined%7CcityID%3Dundefined`,
          Referer: "https://seller.indiamart.com/",
        },
        data: { ssid: sessionKey },
        method: "POST",
      });

      const otpGenerate = await axios({
        url: "https://seller.indiamart.com/miscreact/ajaxrequest/seller/login/otpGen",
        headers: {
          ...headers,
          cookie: `ImeshVisitor=glid%3D${glid}%7CsessionKey%3D${sessionKey}`,
        },
        data: `{"mobile":${phoneNumber},"is_exist":1,"mob_country":"91","OTPResend":0,"ip_country":"IN","iso":"IN","ip":"${ipAddress}","logintype":"m"}`,
        method: "POST",
      });

      return res.status(200).json(
        new Result({
          success: true,
          data: {
            response: otpGenerate.data.Response,
            glid,
            sessionKey,
          },
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

Router.post(
  "/verify-otp",
  async (req: Request, res: Response): Promise<any> => {
    try {
      const { phoneNumber, glid, sessionKey, otp } = req.body;
      const { userId } = res.locals;

      if (!phoneNumber || !glid || !sessionKey || !otp || !userId) {
        throw new CustomError("Credentials are missing.", "Server Error!");
      }

      const verifyOtp = await axios({
        url: "https://seller.indiamart.com/miscreact/ajaxrequest/seller/login/verifyOtp",
        method: "POST",
        headers: {
          accept: "*/*",
          "accept-language": "en-US,en;q=0.6",
          "cache-control": "no-cache",
          "content-type": "application/json",
          dnt: "1",
          origin: "https://seller.indiamart.com",
          pragma: "no-cache",
          priority: "u=1, i",
          referer: "https://seller.indiamart.com/",
          "sec-ch-ua":
            '"Not)A;Brand";v="8", "Chromium";v="138", "Brave";v="138"',
          "sec-ch-ua-mobile": "?0",
          "sec-ch-ua-platform": platform(),
          "sec-fetch-dest": "empty",
          "sec-fetch-mode": "cors",
          "sec-fetch-site": "same-origin",
          "sec-gpc": "1",
          "user-agent":
            "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36",
          cookie: `site-entry-page=referral=external; hd_ctval=ctval%3D; glbcty=Pune; iploc=gcniso%3DIN%7Cgcnnm%3DIndia%7Cgctnm%3DPune%7Cgctid%3D70630%7Cgacrcy%3D10%7Cgip%3D${ipAddress}%7Cgstnm%3DMaharashtra; pop_mthd=FL%3D0%7CDTy%3D1; LGNSTR=0%2C2%2C0%2C1%2C1%2C1%2C1%2C0; empDet=; con_iso=; userDet=; sessid=spv=13; xnHist=pv%3D0%7Cipv%3D7%7Cfpv%3D0%7Ccity%3D%7Clc_city%3Dundefined%7Ccvstate%3Dundefined%7Cpopupshown%3Dundefined%7Cinstall%3Dundefined%7Css%3Dundefined%7Cmb%3Dundefined%7Ctm%3Dundefined%7Cage%3Dundefined%7Ccount%3D0%7Ctime%3DWed%20Sep%2024%202025%2022%3A37%3A02%20GMT+0530%20%28India%20Standard%20Time%29%7Cglid%3D243247988%7Cgname%3Dundefined%7Cgemail%3Dundefined%7CcityID%3Dundefined; ImeshVisitor=glid%3D${glid}%7CsessionKey%3D${sessionKey}`,
        },
        data: {
          mobile: phoneNumber,
          glid: glid,
          mob_country: "91",
          auth_key: otp,
          ip_country: "IN",
          iso: "IN",
          ip: ipAddress,
          logintype: "m",
        },
      });

      const loginData = verifyOtp.data.Response.LOGIN_DATA;
      const cookieExp = new Date().setMonth(new Date().getMonth() + 6);

      if (!loginData) {
        
        throw new CustomError(
          "Try again with valid otp.",
          "Credentials Missing!"
        );
      }

      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          contact: phoneNumber,
          cookie: JSON.stringify(loginData),
          cookieExp: `${cookieExp}`,
        },
      });

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

      return res.status(200).json(
        new Result({
          success: true,
          data: {
            data: verifyOtp.data.Response,
            uniqueId: verifyOtp.data.unique_id,
            request: verifyOtp.status,
          },
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
