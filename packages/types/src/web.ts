import { ProfileGetUserData } from "./backend.js";

export enum TopDialogParamsTheme {
  ERROR = "Error",
  MESSAGE = "Message",
  WARNING = "Warning",
}

export const dialogParams: TopDialogParams = {
  theme: TopDialogParamsTheme.WARNING,
  timer: 8,
  title: "Error Occured",
  message:
    "Lorem ipsum dolor sit amet consectetur adipisicing elit. Dolores dolor, qui repudiandae optio omnis quia id explicabo incidunt blanditiis eos laboriosam rem, odio maiores?",
};

export const submitButtonParams: CustomButtonParams = {
  label: "Submit",
  onClickHandler: () => {
    window.location.href = "/profile";
  },
  isPrimary: false,
  icon: null,
};

export interface NeedIconParams {
  src: string;
  alt: string;
}

export interface CustomButtonParams {
  label: string;
  icon: NeedIconParams | null;
  isPrimary: boolean;
  onClickHandler: () => void;
}

export interface TopDialogParams {
  theme: TopDialogParamsTheme;
  title: string;
  message: string;
  timer: number;
}

export enum ServiceStatus {
  RUNNING = "Service is up!",
  STOPPED = "Service is down!",
}

export interface RowCustomerData {
  name: string;
  country: string;
  flag: string;
}

export enum RowInfoStatus {
  PURCHASED = "Purchased",
  MESSAGED = "Messaged",
  PURCHASED_AND_MESSAGED = "Purchase & Messaged",
}

export interface RowInfo {
  id: number;
  aiSummary: string | null;
  customerData: RowCustomerData;
  medicine: string;
  category: string;
  details: string;
  time: Date;
  status: RowInfoStatus;
}

export const sampleRowInfo: RowInfo[] = [
  {
    id: 1,
    aiSummary: "Customer is interested in herbal supplements.",
    customerData: { name: "Alice Johnson", country: "USA", flag: "🇺🇸" },
    medicine: "Vitamin C",
    category: "Drugs",
    details: "Purchased 2 bottles of Vitamin C tablets.",
    time: new Date("2025-09-10T10:15:00"),
    status: RowInfoStatus.PURCHASED,
  },
  {
    id: 2,
    aiSummary: "Asked about availability in Europe.",
    customerData: { name: "Carlos Mendes", country: "Portugal", flag: "🇵🇹" },
    medicine: "Ibuprofen",
    category: "Drugs",
    details: "Sent message about stock and shipping options.",
    time: new Date("2025-09-10T11:30:00"),
    status: RowInfoStatus.MESSAGED,
  },
  {
    id: 3,
    aiSummary: "Strong interest in bulk orders for pharmacy.",
    customerData: { name: "Mei Lin", country: "China", flag: "🇨🇳" },
    medicine: "Paracetamol",
    category: "Drugs",
    details: "Purchased 100 packs and received follow-up message.",
    time: new Date("2025-09-10T13:00:00"),
    status: RowInfoStatus.PURCHASED_AND_MESSAGED,
  },
  {
    id: 4,
    aiSummary: "Requested invoice for corporate hospital purchase.",
    customerData: { name: "David Müller", country: "Germany", flag: "🇩🇪" },
    medicine: "Amoxicillin",
    category: "Drugs",
    details: "Order placed for hospital stock (200 packs).",
    time: new Date("2025-09-10T14:20:00"),
    status: RowInfoStatus.PURCHASED,
  },
  {
    id: 5,
    aiSummary: "Looking for wholesale discounts on painkillers.",
    customerData: { name: "Priya Sharma", country: "India", flag: "🇮🇳" },
    medicine: "Diclofenac",
    category: "Drugs",
    details: "Sent inquiry about bulk purchase pricing.",
    time: new Date("2025-09-10T15:45:00"),
    status: RowInfoStatus.MESSAGED,
  },
  {
    id: 6,
    aiSummary: "Frequent customer, happy with supplements.",
    customerData: { name: "James Smith", country: "UK", flag: "🇬🇧" },
    medicine: "Omega-3 Fish Oil",
    category: "Drugs",
    details: "Purchased subscription pack and received confirmation.",
    time: new Date("2025-09-11T09:10:00"),
    status: RowInfoStatus.PURCHASED_AND_MESSAGED,
  },
  {
    id: 7,
    aiSummary: "Interested in organic and plant-based medicines.",
    customerData: { name: "Sofia Rossi", country: "Italy", flag: "🇮🇹" },
    medicine: "Aloe Vera Extract",
    category: "Drugs",
    details: "Purchased organic supplement pack.",
    time: new Date("2025-09-11T11:05:00"),
    status: RowInfoStatus.PURCHASED,
  },
  {
    id: 8,
    aiSummary: "Wants to distribute in North Africa region.",
    customerData: { name: "Ahmed Hassan", country: "Egypt", flag: "🇪🇬" },
    medicine: "Insulin",
    category: "Drugs",
    details: "Sent inquiry about distribution partnership.",
    time: new Date("2025-09-11T12:20:00"),
    status: RowInfoStatus.MESSAGED,
  },
  {
    id: 9,
    aiSummary: "Exploring long-term business opportunity.",
    customerData: { name: "Hiro Tanaka", country: "Japan", flag: "🇯🇵" },
    medicine: "Multivitamin",
    category: "Drugs",
    details: "Purchased starter kit and exchanged multiple emails.",
    time: new Date("2025-09-11T13:40:00"),
    status: RowInfoStatus.PURCHASED_AND_MESSAGED,
  },
  {
    id: 10,
    aiSummary: "Asked about return policy for defective medicines.",
    customerData: { name: "Maria Lopez", country: "Spain", flag: "🇪🇸" },
    medicine: "Antihistamine",
    category: "Drugs",
    details: "Sent message about defective batch replacement.",
    time: new Date("2025-09-11T15:00:00"),
    status: RowInfoStatus.MESSAGED,
  },
  {
    id: 11,
    aiSummary: "Requested custom packaging for pharmacy chain.",
    customerData: { name: "Lucas Silva", country: "Brazil", flag: "🇧🇷" },
    medicine: "Metformin",
    category: "Drugs",
    details: "Purchased samples with branded packaging.",
    time: new Date("2025-09-12T09:30:00"),
    status: RowInfoStatus.PURCHASED,
  },
  {
    id: 12,
    aiSummary: "Satisfied with service, likely to reorder monthly.",
    customerData: { name: "Emma Brown", country: "Australia", flag: "🇦🇺" },
    medicine: "Calcium Supplements",
    category: "Drugs",
    details: "Purchased family pack and received follow-up.",
    time: new Date("2025-09-12T10:50:00"),
    status: RowInfoStatus.PURCHASED_AND_MESSAGED,
  },
];

export interface OverlayCardParams {
  title: string;
  description: string;
  handleClick: boolean;
}

export enum ConnectAccountState {
  SUBMIT_PHONE_Number,
  SUBMIT_OTP,
}

export interface UserDetails {
  firstName: string;
  lastName: string;
  country: string;
  companyName: string;
  glid: string;
  image: string;
  phoneNumber: string;
}

export interface GetUserDetailsResponse {
  success: boolean;
  userDetails: UserDetails | null;
}

export interface GetUserDataResponse {
  success: boolean;
  userData: ProfileGetUserData | null;
}

export interface GetUserSettingsResponse {
  success: boolean;
  userSettings: any | null;
}

export interface GetUserFiltersResponse {
  success: boolean;
  userFilters: any | null;
}

export interface GetUserHistoryResponse {
  success: boolean;
  userHistory: any | null;
}

export interface GetUserPaymentResponse {
  success: boolean;
  userPayment: any | null;
}

export interface GetUserCreditResponse {
  success: boolean;
  userCredit: any | null;
}

export interface PointsFieldsParams {
  id: string;
  label: string;
  select: boolean;
  points: number;
}

export interface OptionFieldsParams {
  id: string;
  label: string;
  options: Array<any>;
}

export interface AllowListFieldsParams {
  id: string;
  title: string;
  placeholder: string;
  value: Array<string>;
}

export interface RegexListFieldsParams {
  id: string;
  title: string;
  placeholder: string;
  value: Array<RegExp>;
}

export interface StringValueFieldsParams {
  id: string;
  title: string;
  placeholder: string;
  value: string;
}

export interface ChatRadialStackedElement {
  label: string;
  color: string;
  value: number;
}

export interface ChatRadialStackedMetadata {
  title: string;
  period: string;
  type: string; // example - leads, visitors,..
}

export interface ChatRadialStackedParams {
  metadata: ChatRadialStackedMetadata;
  elements: Array<ChatRadialStackedElement>;
}

export interface GetDataResponse {
  success: boolean;
  data: any;
}

export interface SessionResponse {
  device: string;
  createdAt: string;
}

// Frontend

export interface TextInputWithLabelParam {
  label: string;
  type: "email" | "text" | "number";
  id: string;
  placeholder: string;
  value: string | number;
}

export interface BoolAndPointsInputParam {
  label: string;
  id: string;
  placeholder: string;
  isTrue: number;
  points: number;
}

export const FilterDataWeb = {
  boolAndPoints: {
    whatsappActive: {
      id: "whatsappActive",
      title: "Whatsapp Active",
      isTrue: true,
      points: 20,
      typeSystem: ["boolean", "number"],
      reflectTo: ["needWhatsappActive", "pointWhatsappActive"],
    },
    mobVerified: {
      id: "mobVerified",
      title: "Mob Verified",
      isTrue: true,
      points: 20,
      typeSystem: ["boolean", "number"],
      reflectTo: ["needMobVerified", "pointMobVerified"],
    },
    emailVerified: {
      id: "emailVerified",
      title: "Email Verified",
      isTrue: true,
      points: 20,
      typeSystem: ["boolean", "number"],
      reflectTo: ["needEmailVerified", "pointEmailVerified"],
    },
    buyerReply: {
      id: "buyerReply",
      title: "Buyer Reply",
      isTrue: true,
      points: 20,
      typeSystem: ["boolean", "number"],
      reflectTo: ["needBuyerReply", "pointBuyerReply"],
    },
    buyerRequirement: {
      id: "buyerRequirement",
      title: "Buyer Requirement",
      isTrue: false,
      points: 20,
      typeSystem: ["boolean", "number"],
      reflectTo: ["needBuyerRequirement", "pointBuyerRequirement"],
    },
    buyerCalls: {
      id: "buyerCalls",
      title: "Buyer Calls",
      isTrue: false,
      points: 20,
      typeSystem: ["boolean", "number"],
      reflectTo: ["needBuyerCalls", "pointBuyerCalls"],
    },
    sec: {
      id: "sec",
      title: "Seconds",
      isTrue: true,
      points: 100,
      typeSystem: ["boolean", "number"],
      reflectTo: ["needSec", "pointSec"],
    },
  },
  keyValue: {
    minPointsForPurchase: {
      id: "minPointsForPurchase",
      title: "Minimum Points Required",
      placeholder: "Minimum Points for Purchase",
      value: 140,
      typeSystem: "number",
      reflectTo: "minPointsForPurchase",
    },
    // "aiInstructions":{
    //   id: "aiInstructions",
    //   title: "AI Instructions",
    //   placeholder: "",
    //   value: "Some instructions",
    //   typeSystem: "string",
    //   reflectTo: "aiInstructions",
    // },
    // "allowMessaging":{
    //   id: "allowMessaging",
    //   title: "Allow Messaging",
    //   placeholder: "",
    //   value: true,
    //   typeSystem: "boolean",
    //   reflectTo: "allowMessaging",
    // },
    totalMessages: {
      id: "totalMessages",
      title: "Total Messages",
      placeholder: "Number of total messages the customer should receive",
      value: 1,
      typeSystem: "number",
      reflectTo: "totalMessages",
    },
    email: {
      id: "email",
      title: "Email Address",
      placeholder: "Email address where you want to receive the notification",
      value: "",
      typeSystem: "text",
      reflectTo: "emailAdrr",
    },
    fullName: {
      id: "fullName",
      title: "Full Name",
      placeholder: "The name will be used during conversations with customer",
      value: "",
      typeSystem: "text",
      reflectTo: "fullName",
    },
    companyName: {
      id: "companyName",
      title: "Company Name",
      placeholder: "Enter your company name..",
      value: "",
      typeSystem: "text",
      reflectTo: "companyName",
    },
  },
  list: {
    allowCountries: {
      id: "allowCountries",
      title: "Allow Countries",
      placeholder: "Example USA",
      type: "allow",
      metadata: "",
      value: [],
      typeSystem: "Array of string",
      reflectTo: "allowCountries",
    },
    // "allowCategories":{
    //   id: "allowCategories",
    //   title: "Allow Categories",
    //   placeholder: "Example Anti Infective Tablet",
    //   type: "allow",
    //   metadata: "",
    //   value: [],
    //   typeSystem: "Array of string",
    //   reflectTo: "allowCategories",
    // },
    restrictMedicines: {
      id: "restrictMedicines",
      title: "Restrict Medicines",
      placeholder: "Example bapam",
      type: "regex",
      metadata: "",
      value: [],
      typeSystem: "Array of regex",
      reflectTo: "restrictMedicines",
    },
    allowOnlyMedicines: {
      id: "allowOnlyMedicines",
      title: "Allow OnlyMedicines",
      placeholder: "Example Adderaii",
      type: "regex",
      metadata: "",
      value: [],
      typeSystem: "Array of regex",
      reflectTo: "allowOnlyMedicines",
    },
  },
  enumsType: {
    triggerOn: {
      id: "triggerOn",
      title: "Trigger On",
      value: "Purchase and Message",
      options: ["Purchase and Message"],
      typeSystem: "ETriggerFor",
      reflectTo: "triggerOn",
    },
    triggerType: {
      id: "triggerType",
      title: "Trigger Type",
      value: "Mail",
      options: ["Mail"],
      typeSystem: "ETriggerType",
      reflectTo: "triggerType",
    },
  },
  metaData: {
    title: {
      id: "title",
      title: "Title",
      value: "Example",
      typeSystem: "string",
      reflectTo: "title",
    },
    maxLeads: {
      id: "maxLeads",
      title: "Maximum leads",
      value: 1,
      typeSystem: "number",
      reflectTo: "maxLeads",
    },
  },
};

export const FilterDataState = {
  // boolAndPoints
  boolAndPoints: {
    whatsappActive: {
      id: "whatsappActive",
      placeholder: "Need verified whatsapp?",
      label: "Whatsapp verified",
      isTrue: true,
      points: 20,
    },
    mobVerified: {
      id: "mobVerified",
      placeholder: "Need verified mobile number?",
      label: "Mobile Verified",
      isTrue: true,
      points: 20,
    },
    emailVerified: {
      id: "emailVerified",
      placeholder: "Need verified email?",
      label: "Email Verified",
      isTrue: false,
      points: 20,
    },
    buyerReply: {
      id: "buyerReply",
      placeholder: "Need buyer with replies(>0)?",
      label: "Buyer Replies",
      isTrue: true,
      points: 20,
    },
    buyerRequirement: {
      id: "buyerRequirement",
      placeholder: "Need buyer with requirements(>0)?",
      label: "Buyer Requirement",
      isTrue: false,
      points: 20,
    },
    buyerCalls: {
      id: "buyerCalls",
      placeholder: "Need buyer with calls(>0)?",
      label: "Buyer Calls",
      isTrue: false,
      points: 20,
    },
    sec: {
      id: "sec",
      placeholder: "Newly posted by the buyer(<1min ago)?",
      label: "Newly Posted(<1min ago)",
      isTrue: true,
      points: 100,
    },
  },

  // keyValue
  keyValue: {
    minPointsForPurchase: {
      id: "minPointsForPurchase",
      placeholder: "Minimum points required for success?",
      label: "Minimum Points",
      type: "number",
      value: 140,
    },
    // totalMessages: {
    //   id: "totalMessages",
    //   placeholder: "Total number of messages to send.",
    //   label: "Total Messages",
    //   type:"number",
    //   value: 1,
    // },
    email: {
      id: "email",
      placeholder: "Email to receive realtime notification.",
      label: "Email",
      type: "email",
      value: "",
    },
    fullName: {
      id: "fullName",
      placeholder: "Agent's name used while messaging customer.",
      label: "Agent Name",
      type: "text",
      value: "",
    },
    companyName: {
      id: "companyName",
      placeholder: "Companies name used while messaging customer.",
      label: "Company Name",
      type: "text",
      value: "",
    },
  },

  // list
  list: {
    allowCountries: {
      id: "allowCountries",
      placeholder: "Allowed countries list.",
      label: "Allow Countries",
      value: [],
    },
    // allowCategories: {
    // id: "allowCategories",
    // placeholder: "Allowed categories list.",
    // label: "Allow Categories",
    // value: []
    // },
    restrictMedicines: {
      id: "restrictMedicines",
      placeholder: "Restricted medicines list.",
      label: "Restrict Medicines",
      value: [],
    },
    allowOnlyMedicines: {
      id: "allowOnlyMedicines",
      placeholder: "Allow only medicines list.",
      label: "Allow Only Medicines",
      value: [],
    },
  },

  // enumsType
  enumType: {
    // @ts-ignore
    triggerOn: {
      id: "triggerOn",
      placeholder: "Notification trigger on?",
      label: "Trigger On",
      options: ["Purchase and Message"],
      value: "Purchase and Message",
    },
    // @ts-ignore
    triggerType: {
      id: "triggerType",
      placeholder: "Notification trigger type?",
      label: "Trigger Type",
      options: ["Mail"],
      value: "Mail",
    },
  },

  // metaData
  metaData: {
    title: {
      id: "title",
      placeholder: "Title",
      label: "Title",
      value: "Sample",
      type: "text",
    },
    maxLeads: {
      id: "maxLeads",
      placeholder: "Maximum mumber of leads to handle?",
      label: "Maximum Leads",
      value: 1,
      type: "number",
    },
  },
};
