import axios from "axios";
import {
  ChatBotParams,
  MessageData,
} from "@repo/types/backend";
import { UserHistory } from "@repo/types/socket";
import { FilterData, MessageHandler } from "@repo/types/database";
import chatBot from "../functions/chatbot.js";

export default async function handleMessages(
  filterData: FilterData,
  customerGlusrId: string,
  userHistory: UserHistory
): Promise<MessageHandler> {
  try {
    const chatDetails: MessageData = await axios({
      method: "POST",
      url: "https://seller.indiamart.com/lmsreact/getConversationDetail",
      headers: {
        cookie: filterData.cookies,
      },
      data: {
        glid: customerGlusrId,
        end: 5,
      },
    }).then((res) => {
      return res.data.response.result[res.data.response.result.length - 1];
    });

    const chatBotParams: ChatBotParams = {
      chatBotVarient: "stable",
      chatDetails,
    };
    const reply = await chatBot(chatBotParams, filterData);
    await axios({
      url: "https://seller.indiamart.com/lmsreact/sendMessage",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-requested-with": "XMLHttpRequest",
        referer: "https://seller.indiamart.com/messagecentre?h1",
        origin: "https://seller.indiamart.com",
        "user-agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        cookie: filterData.cookies,
      },
      data: {
        subject: "Message Centre",
        msg: reply,
        qid: chatDetails.msg_query_id,
        recv_id: customerGlusrId,
        IIL_RFQ_SOURCE_ID: 27,
        qtype: "B",
        ref_id: chatDetails.msg_ref_id,
        prod_name: chatDetails.msg_prod_name,
        attachments: "",
        IIL_message: "",
        price: "",
        payment: "",
        delivery: "",
        taxes: "",
        filepath: "",
        contactYear: "",
        sender_ip: filterData.ipAddress,
        quotation_data: {},
        send_code: 5,
        suggestive_reply_position: 0,
        meta_template_id: "",
        prod_share_id: "",
        prod_share_array: "",
        media_id: [],
        media_attribute: {},
        is_backend_xmpp: 1,
      },
    });
    userHistory.status = userHistory.status
      ? "Purchased and Messaged"
      : "Messaged";
    return {
      success: true,
      msgSend: true,
      triggerNotification: true,
    };

  } catch (error) {
    console.warn(error);
    return {
      success: true,
      msgSend: true,
      triggerNotification: false,
    };
  }
}
