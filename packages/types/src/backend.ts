export interface BuyLeadData {
  ADDITIONALINFO: null;
  ATTACHMENT: null;
  BLCARDDATA: ProductCard[];
  BLDATETIME: string;
  BL_BUYER_ATTRIB_TOTAL: string;
  BL_CITY_TOTAL: string;
  BL_STATE_TOTAL: string;
  BL_TOTAL: string;
  BL_TOTAL_FR: string;
  BL_TOTAL_IN: string;
  BL_TOTAL_USRCITY: string;
  BY_LEAD_TYPE: string;
  CNT: null;
  CNT_TOT_GRIDA: number;
  DATATYPE: string;
  DIST_HQ_NAME: null;
  ENRICHMENTINFO: Record<string, EnrichmentInfo[]>;
  ETO_CREDITS: string;
  ETO_ENQ_TYP: null;
  ETO_OFR_ADDITIONAL_DETAILS: OfferAdditionalDetail[];
  ETO_OFR_APPROX_ORDER_VALUE: null;
  ETO_OFR_BUYER_IS_GST_VERF: number;
  ETO_OFR_BUYER_IS_MOB_VERF: number;
  ETO_OFR_BUYER_LEADS_CNT: number;
  ETO_OFR_BUYER_PAST_SEARCH_MCAT: null;
  ETO_OFR_BUYER_PRIME_MCATS: string;
  ETO_OFR_BUYER_SELL_MCATS: null;
  ETO_OFR_DATE: string;
  ETO_OFR_DESC: string;
  ETO_OFR_DOC_PATH: null;
  ETO_OFR_EMAIL_VERIFIED: number;
  ETO_OFR_GLCAT_MCAT_NAME: string;
  ETO_OFR_ID: string;
  ETO_OFR_LARGE_IMAGE: null;
  ETO_OFR_LATITUDE: null;
  ETO_OFR_LONGITUDE: null;
  ETO_OFR_MODREFID: number;
  ETO_OFR_MODREF_TYPE: null;
  ETO_OFR_PROD_SERV: string;
  ETO_OFR_QTY: string;
  ETO_OFR_SMALL_IMAGE: null;
  ETO_OFR_TITLE: string;
  ETO_OFR_VERIFIED: string;
  ETO_REJECTED_FLAG: string;
  ETO_TDR_DOC_SALE_LASTDATE: null;
  ETO_TDR_DOC_SALE_STARTDATE: null;
  ETO_TDR_DOC_SUBMIT_BEFOREDATE: null;
  ETO_TDR_OPEN_DATE: null;
  ETO_TDR_PUBLISH_DATE: null;
  FK_GLCAT_MCAT_ID: string;
  FK_GL_CITY_ID: null;
  FK_GL_COUNTRY_ISO: string;
  FK_GL_STATE_ID: null;
  GLUSR_ADDRESS: null;
  GLUSR_CITY: null;
  GLUSR_COMPANY: null;
  GLUSR_COUNTRY: string;
  GLUSR_NAME: string;
  GLUSR_STATE: null;
  GLUSR_URL: null;
  GLUSR_USR_EMAIL: null;
  GLUSR_USR_MEMBERSINCE: string;
  GLUSR_USR_PH_AREA: null;
  GLUSR_USR_PH_COUNTRY: string;
  GLUSR_USR_PH_MOBILE: null;
  GLUSR_USR_PH_MOBILE_ALT: null;
  GLUSR_USR_PH_NUMBER: null;
  GLUSR_USR_YEAR_OF_ESTB: null;
  GL_BIZ_TYPE: null;
  GL_COUNTRY_FLAG_SMALL: string;
  GL_LEGAL_STATUS_VAL: null;
  GRID_PARAMETERS: string;
  IS_ATTACHMENT: string;
  IS_NI_AVAIL: number;
  IS_OFR_PMCAT: number;
  IS_PROFORMA_BLNI: number;
  LASTACTIONDATET: string;
  LATLONG_DISTANCE: null;
  LOGO_TYPE: Record<string, string>;
  MESSAGE_LIST1: null;
  MESSAGE_LIST2: null;
  OFFER_DATE: string;
  OFFER_DATE_IST: string;
  OFFER_FLAG: string;
  OFR_DATE: string;
  OFR_DATE_HR: string;
  PARENT_MCAT_ID: string;
  PARENT_MCAT_NAME: string;
  PRIME_MCAT_ID: number;
  PRIME_MCAT_NAME: string;
  PURCHASE_STATUS: string;
  RANKKING_DETAILS: null;
  SHORTLISTED: string;
  SHORTLIST_DATE: string;
  SHORTLIST_STATUS: string;
  TOTAL_BUYLEAD: string;
  TOTAL_DAYS_3_TO_7: string;
  TOTAL_DAYS_7_TO_10: string;
  USER_IDENTIFIER_FLAG: string;
  VIBGYOR_FLAG: string;
}

interface ProductCard {
  ACTIVITY_TYPE_ID: number;
  FK_ETO_OFR_DISPLAY_ID: number;
  FK_GLCAT_CAT_ID: number;
  FK_GLCAT_MCAT_ID: number;
  FK_PARENT_MCAT_ID: number;
  FK_PC_ITEM_DISPLAY_NAME: string | null;
  FK_PC_ITEM_NAME: string;
  PC_IMG_SMALL_100X100: string;
  PC_IMG_SMALL_600X600: string;
  PC_ITEM_IMG_ORIGINAL: string;
  PC_ITEM_IMG_SMALL: string;
  PRODUCT_PRICE: string;
}

export interface EnrichmentInfo {
  DESC: string;
  RESPONSE: string;
}

export interface OfferAdditionalDetail {
  eto_ofr_buyer_past_search_mcat: null;
  eto_ofr_buyer_prime_mcats: null;
  eto_ofr_buyer_reply_cnt: number;
  eto_ofr_buyer_sell_mcats: null;
  eto_ofr_buyer_tot_requirement: number;
  eto_ofr_buyer_tot_unq_calls_cnt: number;
  is_buyer_bussiness_add_verf: number;
  is_social_profile_active: number;
  is_whatsapp_active: null;
}

export interface BuyerContactProfile {
  bs_encrypt_key: string;
  buyer_profile_contact_detail_flag: string;
  contact_city: string | null;
  contact_last_product: string;
  contact_number_type: string;
  contact_ph_country: string;
  contact_state: string | null;
  contact_type_remarks: string;
  contacts_add_date: string; // ISO date string
  contacts_company: string | null;
  contacts_glid: string;
  contacts_mobile1: string;
  contacts_name: string;
  contacts_type: string;
  country_name: string;
  fk_glusr_usr_id: string;
  glusr_usr_logo_img_90x90: string;
  im_contact_id: string;
  is_archive: string | null;
  is_buylead: string;
  is_call: string;
  is_enq: string;
  is_starred_lead: string;
  is_txn_initiator: string;
  label_color: string;
  label_count: string;
  last_contact_date: string; // ISO date string
  last_contact_date_view: string;
  last_message: string;
  last_product_qty: string;
  message_status: string | null;
  msg_read_status: number;
  reverse_contact_status: string | null;
  show_whatsapp_icon: number;
  starred_lead_color: string | null;
  unread_message_cnt: number | null;
}

export interface MessageData {
  msg_date: string; // Format: 'DD-MM-YYYY HH:mm:ss'
  msg_query_id: string;
  msg_query_type: string;
  msg_ref_type: string;
  msg_ref_id: string;
  msg_sender_id: string;
  msg_receiver_id: string;
  msg_sub: string;
  msg_prod_name: string;
  msg_isq: string;
  msg_call_status: string;
  msg_call_duration: string;
  msg_call_caller_number: string;
  msg_call_receiver_number: string;
  msg_read_status: number;
  msg_read_date: string;
  msg_read_modid: string;
  msg_remind_date: string;
  msg_mcat_id: string;
  msg_mcat_name: string;
  message_id: string;
  msg_attach: any[]; // Can be refined if structure of attachments is known
  msg_attach1: string;
  msg_attach2: string;
  msg_attach3: string;
  msg_attach4: string;
  msg_attach5: string;
  msg_attach1_url: string;
  msg_attach2_url: string;
  msg_attach3_url: string;
  msg_attach4_url: string;
  msg_attach5_url: string;
  rating_value: string;
  rating_parameter: string;
  rating_influ_parameter: string;
  std_prod_id: string;
  msg_alignment: string;
  msg_text_json: MsgTextJson;
  message_product_img_variants: Record<string, ImageVariants>;
  show_order_now: number;
  is_edited: boolean;
  msg_modref_id: string;
  is_ask_for_review_initiated: number;
  message_status: string | null;
  show_whatsapp_icon: number;
  metadata: any; // Can be refined if metadata structure is known
  feedback: number;
  relevancy_id: string;
  associated_product_details: any; // Can be refined if structure is known
}

interface MsgTextJson {
  isq: Record<string, string>;
  enrichment: Record<string, unknown>;
  message_text: string;
  additional_details: any; // Can be refined if details structure is known
}

interface ImageVariants {
  "125x125": string;
  "250x250": string;
  "500x500": string;
  default: string;
}

export interface IResult {
  success: boolean;
  info?: string;
  data?: any;
  error?: CustomError;
  redirectUrl?: string;
}

export interface CustomErrorParams {
  title: string;
  name: string;
}

export class CustomError extends Error {
  constructor(title: string, name: string) {
    super(title);
    this.name = name;
  }
}

export class Result {
  success: boolean;
  info: string | undefined;
  data: any | undefined;
  error: CustomError | undefined;
  redirectUrl: string | undefined;

  constructor({ success = false, info, data, error, redirectUrl }: IResult) {
    this.success = success;
    this.info = info;
    this.data = data;
    this.error = error;
    this.redirectUrl = redirectUrl;
  }

  getResponse(res: Response): IResult {
    return {
      success: this.success,
      info: this.info,
      data: this.data,
      error: this.error,
      redirectUrl: this.redirectUrl,
    };
  }
}

export interface ProfileGetUserData {
  "First Name": string;
  "Last Name": string;
  Email: string;
  Contact: string;
}

export interface UserCreditsData {
  weeklyExpAlloted: string;
  weeklyExpAvai: string;
  totalExpAvai: string;
}

export type ChatBotVarient = "standard" | "stable";

export interface ChatBotParams {
  chatBotVarient: ChatBotVarient;
  chatDetails: MessageData;
}

