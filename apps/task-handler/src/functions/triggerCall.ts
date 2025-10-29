import Mailjet from "node-mailjet";
import { FilterData } from "@repo/types/database";
import { UserHistory } from "@repo/types/socket";
import dotenv from "dotenv";
import path from "path";

dotenv.config({
  path: path.resolve(path.dirname("../../../"), ".env"),
});

const [MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE] = [
  process.env.MJ_APIKEY_PUBLIC,
  process.env.MJ_APIKEY_PRIVATE,
];

if (!MJ_APIKEY_PUBLIC || !MJ_APIKEY_PRIVATE) {
  throw Error("The mailjet private and public key are missing.");
}

// @ts-ignore
const mailjet = Mailjet.apiConnect(MJ_APIKEY_PUBLIC, MJ_APIKEY_PRIVATE);

export async function triggerCall(
  filterData: FilterData,
  textPart: string,
  htmlPart: string,
  userHistory: UserHistory
) {
  let subject = "Task is executed!";
  switch (filterData.triggerOn) {
    case "Message Only": {
      subject = "Successfully messaged the customer!";
      break;
    }
    case "Purchase Only": {
      subject = "Successfully purchased a medicine!";
      break;
    }
    case "Purchase and Message": {
      subject = "Successfully purchased and messaged the customer!";
      break;
    }
  }
  await mailjet
    .post("send", { version: "v3.1" })
    .request({
      Messages: [
        {
          From: {
            Email: "medicoseenterprises@gmail.com",
            Name: "Chaitanya Kadu",
          },
          To: [
            {
              Email: filterData.email,
              Name: filterData.fullName,
            },
          ],
          Subject: subject,
          TextPart: textPart,
          HTMLPart: htmlPart,
        },
      ],
    })
    .catch((err: any) => {
      console.warn(err.statusCode);
    });
}

// curl 'https://graph.facebook.com/<API_VERSION>/<WHATSAPP_BUSINESS_PHONE_NUMBER_ID>/messages' \
// -H 'Content-Type: application/json' \
// -H 'Authorization: Bearer <ACCESS_TOKEN>' \
// -d '
// {
//   "messaging_product": "whatsapp",
//   "recipient_type": "individual",
//   "to": "<WHATSAPP_USER_PHONE_NUMBER>",
//   "type": "text",
//   "text": {
//     "preview_url": <ENABLE_LINK_PREVIEW>,
//     "body": "<BODY_TEXT>"
//   }
// }'

// // Download the helper library from https://www.twilio.com/docs/node/install
// const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

// // Find your Account SID and Auth Token at twilio.com/console
// // and set the environment variables. See http://twil.io/secure
// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const client = twilio(accountSid, authToken);

// async function createCall() {
//   const call = await client.calls.create({
//     from: "+15017122661",
//     to: "+14155551212",
//     url: "http://demo.twilio.com/docs/voice.xml",
//   });

//   console.log(call.sid);
// }

// createCall();
