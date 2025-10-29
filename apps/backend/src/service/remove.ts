import { Result } from "@repo/types/backend";
import express, { Request, Response } from "express";
import { totalErrors } from "../server.js";

const Router = express.Router();

Router.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    res.status(200).send("Yet to implement!")
  } catch (error: any) {
    console.warn(error);
    totalErrors.inc();
    return res.status(500).json(
      new Result({
        success: false
      })
    );
  }
});

export default Router;
