import express, { Request, Response } from "express";

const Router = express.Router();

Router.get("/", async (req: Request, res: Response): Promise<any> => {
  res.status(200).send("Yet to implement!")
});

export default Router;