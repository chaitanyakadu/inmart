import { getPurchaseableList } from "../functions/algorithm.js";
import { BuyLeadData, CustomError } from "@repo/types/backend";
import { UserHistory } from "@repo/types/socket";
import { FilterData, PurchaseHandler } from "@repo/types/database";
import axios from "axios";
import { triggerCall } from "../functions/triggerCall.js";
import { platform } from "os";

export default async function handlePurchase(
  filterData: FilterData,
  userHistory: UserHistory
): Promise<PurchaseHandler> {
  const latestMedicinesList: Array<BuyLeadData> =
    (await axios({
      url: "https://seller.indiamart.com/bltxn/default/BringFirstFoldOfBLOnRelevant/",
      headers: {
        accept: "*/*",
        "accept-language": "en-US,en;q=0.8",
        "content-type": "application/x-www-form-urlencoded",
        priority: "u=1, i",
        "sec-ch-ua": '"Not)A;Brand";v="8", "Chromium";v="138", "Brave";v="138"',
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": platform(),
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "sec-gpc": "1",
        "x-requested-with": "XMLHttpRequest",
        cookie: filterData.cookies,
      },
      method: "POST",
    }).then((res) => {
      // returning only the result data
      return res.data.DisplayList;
    })) || [];

  if (latestMedicinesList.length <= 0) {
    throw new CustomError(
      "Latest medicines list was of length 0.",
      "Server Error!"
    );
  }

  const medicine: BuyLeadData | null = getPurchaseableList(
    latestMedicinesList,
    filterData,
    userHistory
  );

  let [success, madePurchase, customerGlusrId] = [false, false, null];

  // Make a purchase
  if (medicine) {
    // console.log(`${new Date()}: Making Purchase`);
    const formData = new URLSearchParams({
      glusrId: filterData.glusrId,
      ofrid: medicine.ETO_OFR_ID,
      purchasemod: "WEB",
      count: medicine.IS_NI_AVAIL.toString(),
      tsearch_text: "latestbl_recent",
      action: "purchase",
      serial: medicine.IS_NI_AVAIL.toString(),
      responseTextArea: "0",
      bl_page_location: "page=recent#city=#mcatid=#locpref=",
      prime_mcat_id: medicine.PRIME_MCAT_ID.toString(),
      matched_mcat_id: medicine.PRIME_MCAT_ID.toString(),
      order_value_flag: "",
      is_bulk_order: "",
      ofrtitle: medicine.ETO_OFR_TITLE,
      mapped_mcat_id: medicine.PRIME_MCAT_ID.toString(),
      GRID_PARAMETERS: medicine.GRID_PARAMETERS,
      mobile_no: filterData.mobNumber,
      pref: "https://seller.indiamart.com/bltxn/?pref=relevant",
      NIClick: "1",
      grid_lead_pos: "1",
    });

    await axios({
      url: `https://seller.indiamart.com/bltxn/EtobuyReject/?offer_id=${medicine.ETO_OFR_ID}`,
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-requested-with": "XMLHttpRequest",
        referer: "https://seller.indiamart.com/bltxn/?pref=relevant",
        origin: "https://seller.indiamart.com",
        "user-agent":
          "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/115.0.0.0 Safari/537.36",
        cookie: filterData.cookies,
      },
      data: formData.toString(),
    }).then(async (res) => {
      userHistory.medicineName = medicine.ETO_OFR_TITLE;
      userHistory.medicineCategory = medicine.PARENT_MCAT_NAME;
      userHistory.status = "Purchased";
      const textPart = `Dear ${filterData.fullName},

Successfully purchased!.

Medicine: ${medicine.ETO_OFR_TITLE}
Category: ${medicine.PARENT_MCAT_NAME}
Country: ${medicine.GLUSR_COUNTRY}

Thank you for choosing Inmart.

Note: This is a system-generated email. Please do not reply directly to this message.`;

      const htmlPart = `
  <p style="font-size:16px;">Dear <strong>${filterData.fullName}</strong>,</p>

  <p>Successfully purchased!</p>

  <h3>Order Summary</h3>
  <table border="1" cellspacing="0" cellpadding="8">
    <tr><td><b>Medicine</b></td><td>${medicine.ETO_OFR_TITLE}</td></tr>
    <tr><td><b>Category</b></td><td>${medicine.PARENT_MCAT_NAME}</td></tr>
    <tr><td><b>Country</b></td><td>${medicine.GLUSR_COUNTRY}</td></tr>
  </table>

  <br/>
  <p>Thank you for choosing <strong>Inmart</strong>.</p>
  <p style="font-size:12px;color:gray;">Note: This is an automated email. Please do not reply.</p>
`;
      await triggerCall(filterData, textPart, htmlPart, userHistory);
      success = true;
      madePurchase = true;
    });

    return {
      success,
      madePurchase,
    };
  } else {
    return {
      success,
      madePurchase,
    };
  }
}
