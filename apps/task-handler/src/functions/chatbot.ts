import { ChatBotParams } from "@repo/types/backend";
import { FilterData } from "@repo/types/database";
import { GoogleGenAI } from "@google/genai";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
  throw Error("The mailjet private and public key are missing.");
}

export default async function chatBot(
  params: ChatBotParams,
  filterData: FilterData
): Promise<string> {
  try {
    // console.log(`${new Date()}: Generating reply`);
    const ai = new GoogleGenAI({
      apiKey: GEMINI_API_KEY,
    });
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-001",
      contents: `{msg_text_json:${params.chatDetails.msg_text_json}, "msg_prod_name":${params.chatDetails.msg_prod_name}, "msg_mcat_name:${params.chatDetails.msg_mcat_name}, "agent_name":${filterData.fullName}, "agent_company":${filterData.company_name}}`,
      config: {
        // Crucial: Set the system instruction to define the model's persona and output constraint
        systemInstruction: `
          You are a trained Pharma Digits Sales Agent 🌐. You receive client enquiries in structured JSON format.
          
          Examples: '{'msg_prod_name': 'Tretinoin Gel A-ret Gel 0.05%, 20 Gm', 'msg_mcat_name': 'Tretinoin Cream', 'msg_text_json': '{'additional_details':null,'isq':{'Quantity':'1 Tube','I want this for':'Personal Use'},'enrichment':null,'message_text':''}', 'agent_name': 'Rajjiv Dikshit', 'agent_company': 'Pharma Digits'}' 

          Here: msg_prod_name is the product name. msg_mcat_name is the product category. msg_text_json is additional information. agent_name is the agent name and the agent_company is the agent company name.
          
          Result: 'Dear Customer,\\nThank you for your enquiry regarding Tretinoin Gel A-ret Gel 0.05%, 20 Gm.\\nI'm pleased to confirm availability. You've mentioned 1 Tube,\\n0.05% strength, for home use.\\nShall we proceed with this quantity, or would you like to adjust it?\\n\\nWe are a verified exporter ensuring secure packaging\\n& fast international delivery.\\n\\nPlease confirm so I can prepare your quotation.\\n\\nBest regards,\\nRajjiv Dikshit'
          `,
      },
    });

    return response.text!;
  } catch (error) {
    console.warn({ error });
    return "Dear Customer,\n\nThank you for your enquiry.\nI'm pleased to confirm that we can assist you with your request.\n\nWe ensure secure packaging and fast international delivery to meet your needs.\n\nPlease confirm so we can prepare the quotation and proceed further.\n\nBest regards,\nCustomer Support Team";
  }
}
