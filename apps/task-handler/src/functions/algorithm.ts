import { BuyLeadData } from "@repo/types/backend";
import { FilterData } from "@repo/types/database";
import { UserHistory } from "@repo/types/socket";

export function getPurchaseableList(
  latestMedicinesList: Array<BuyLeadData>,
  filterData: FilterData,
  userHistory: UserHistory
): BuyLeadData | null {
  for (const element of latestMedicinesList) {
    let minPoints: number = filterData.minPointsForPurchase;
    let points: number = 0;

    if (
      islegalMedicine(element, filterData.restrictMedicines) &&
      isReleventCountry(element, filterData.allowCountries) &&
      isExpectedMedicine(element, filterData.allowOnlyMedicines)
    ) {
      const additionalDetails = element.ETO_OFR_ADDITIONAL_DETAILS[0] || null;
      userHistory.details += "Reasons of purchase:";
      if (
        filterData.needWhatsappActive &&
        additionalDetails?.is_whatsapp_active
      ) {
        userHistory.details += " whatsapp is active,";
        points += filterData.pointWhatsappActive;
      }
      if (
        filterData.needMobVerified &&
        element.ETO_OFR_BUYER_IS_MOB_VERF === 1
      ) {
        userHistory.details += " mobile is verified,";
        points += filterData.pointMobVerified;
      }
      if (
        filterData.needEmailVerified &&
        element.ETO_OFR_EMAIL_VERIFIED !== null
      ) {
        userHistory.details += " email is verified,";
        points += filterData.pointEmailVerified;
      }
      if (
        filterData.needBuyerReply &&
        additionalDetails &&
        additionalDetails.eto_ofr_buyer_reply_cnt >= 1
      ) {
        userHistory.details += " buyer has replies,";
        points += filterData.pointBuyerReply;
      }
      if (
        filterData.needBuyerRequirement &&
        additionalDetails &&
        additionalDetails.eto_ofr_buyer_tot_requirement >= 1
      ) {
        userHistory.details += " buyer has requirements,";
        points += filterData.pointBuyerRequirement;
      }
      if (
        filterData.needBuyerCalls &&
        additionalDetails &&
        additionalDetails.eto_ofr_buyer_tot_unq_calls_cnt >= 1
      ) {
        userHistory.details += " buyer has calls,";
        points += filterData.pointBuyerCalls;
      }
      const timeUnit = element.BLDATETIME.split(" ")[1];
      if (filterData.needSec && timeUnit === "sec") {
        userHistory.details += " order is new(<60sec).";
        points += filterData.pointSec;
      }

      userHistory.details +=
        " medicine is legal, medicine is from relevent country and medicine is valid.";

      if (points >= minPoints) {
        return element;
      } else {
        userHistory.details = "";
      }
    }
  }
  return null;
}

function islegalMedicine(
  latestMedicine: BuyLeadData,
  restrictedMeds: Array<RegExp>
): boolean {
  for (const regex of restrictedMeds) {
    latestMedicine.ETO_OFR_ADDITIONAL_DETAILS.forEach((med) => {
      if (regex.test(med.eto_ofr_buyer_prime_mcats || "")) return false;
    });
    if (regex.test(latestMedicine.ETO_OFR_TITLE)) return false;
  }
  return true;
}

function isExpectedMedicine(
  latestMedicine: BuyLeadData,
  allowOnlyMedicines: Array<RegExp>
): boolean {
  if (allowOnlyMedicines.length === 0) {
    return true;
  }

  for (const regex of allowOnlyMedicines) {
    latestMedicine.ETO_OFR_ADDITIONAL_DETAILS.forEach((med) => {
      if (regex.test(med.eto_ofr_buyer_prime_mcats || "")) return true;
    });
    if (regex.test(latestMedicine.ETO_OFR_TITLE)) return true;
  }
  return false;
}

function isReleventCountry(
  latestMedicine: BuyLeadData,
  allowCountries: Array<string>
): boolean {
  const isReleventCountry: boolean = allowCountries.includes(
    latestMedicine.GLUSR_COUNTRY
  );
  return isReleventCountry;
}
