import { v4 as uuidv4 } from "uuid";
import { CronJob } from "cron";
import { Redis } from "ioredis";
import axios from "axios";
import { UserHistory } from "@repo/types/socket";
import handlePurchase from "./task/handle-purchase.js";
import handleMessages from "./task/handle-messages.js";
import { convertToRegex } from "@repo/types/database";
import dotenv from "dotenv";
import { platform } from "os";
import path from "path";

dotenv.config({
  path: path.resolve(path.dirname("../../../"), ".env"),
});

const REDIS_HOST: string = process.env.REDIS_HOST || "localhost";
const redis = new Redis({
  host: REDIS_HOST,
  port: 6379,
  lazyConnect: true,
  connectTimeout: 5000,
});
await redis.connect();
const redisLiveUpdatePublish = redis.duplicate();

const workerId = uuidv4();
const heartBeatEx = 12;
let workerStatus = {
  status: "idle",
  workerId,
  updatedAt: new Date(),
};
await redis.sadd("active-workers", workerId);
await redis.set(
  `worker-heartbeat:${workerId}`,
  JSON.stringify(workerStatus),
  "EX",
  heartBeatEx
);

CronJob.from({
  cronTime: "*/4 * * * * *",
  name: "Worker hearbeat.",
  onTick: async () => {
    try {
      await redis.set(
        `worker-heartbeat:${workerId}`,
        JSON.stringify(workerStatus),
        "EX",
        heartBeatEx
      );
    } catch (error) {
      console.warn(error);
    }
  },
  start: true,
  timeZone: "Asia/Kolkata",
});

while (true) {
  try {
    await new Promise((res) => setTimeout(res, 1000));
    const result = await redis.blpop("task_queue", 0);

    if (!result) {
      continue;
    }

    const [, rawValue] = result;
    const { value, createdAt } = JSON.parse(rawValue);

    // @ts-ignore
    value.restrictMedicines = convertToRegex(value.restrictMedicines);
    // @ts-ignore
    value.allowOnlyMedicines = convertToRegex(value.allowOnlyMedicines);

    // ignore if the task was created before 6 seconds
    if (new Date().getTime() - new Date(createdAt).getTime() < 6000) {
      workerStatus = {
        status: "busy",
        workerId,
        updatedAt: new Date(),
      };
      // console.log(`${new Date()}: Handleing Purchase`);
      let userHistory: UserHistory = { details: "" };
      const makePurchase = await handlePurchase(value, userHistory);

      if (makePurchase.success && makePurchase.madePurchase) {
        await redis.decr(`user-task-leads-${value.sessionToken}`);
        const listData = new URLSearchParams({
          start: "1",
          end: "25",
          type: "0",
          last_contact_date: "",
        });
        value.maxLeads = Number(value.maxLeads) - 1;
        console.log(`${new Date()} Purchased!`);
        const contactList = await axios({
          url: "https://seller.indiamart.com/lmsreact/getContactList",
          headers: {
            accept: "*/*",
            "accept-language": "en-US,en;q=0.8",
            "content-type": "application/x-www-form-urlencoded",
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
            cookie: value.cookies,
          },
          method: "POST",
          data: listData,
        });

        userHistory.customerName =
          contactList.data.result[0].contacts_name || "";
        userHistory.customerCountry =
          contactList.data.result[0].country_name || "";
        const customerGlusrId = contactList.data.result[0].contacts_glid || "";

        // console.log(`${new Date()}: Handleing message`);
        const sendMessageAndTrigger = await handleMessages(
          value,
          customerGlusrId,
          userHistory
        );

        console.log(`${new Date()} Messaged!`);

        await redisLiveUpdatePublish.publish(
          "live-updates",
          JSON.stringify({
            sessionToken: value.sessionToken,
            userHistory,
          })
        );

        if (sendMessageAndTrigger.success && sendMessageAndTrigger.msgSend) {
          console.log("Successfully executed the task!");
        } else {
          console.warn({ sendMessageAndTrigger });
        }

        workerStatus = {
          status: "idle",
          workerId,
          updatedAt: new Date(),
        };
      }
    }
  } catch (error) {
    console.warn(error);
  }
}
