// Enum for ETriggerFor (assumed based on default value in Prisma model)
export type ETriggerFor =
  | "Purchase and Message"
  | "Purchase Only"
  | "Message Only";

export type ETriggerType = "Mail";

// Interface for the Filter data used in redis.publish
export interface FilterData {
  needWhatsappActive: boolean;
  pointWhatsappActive: number;
  needMobVerified: boolean;
  pointMobVerified: number;
  needEmailVerified: boolean;
  pointEmailVerified: number;
  needBuyerReply: boolean;
  pointBuyerReply: number;
  needBuyerRequirement: boolean;
  pointBuyerRequirement: number;
  needBuyerCalls: boolean;
  pointBuyerCalls: number;
  needSec: boolean;
  pointSec: number;

  minPointsForPurchase: number;
  allowMessaging: boolean;
  email: string;
  fullName: string;
  company_name: string;

  allowCountries: string[];
  allowCategories: string[];
  restrictMedicines: any;
  allowOnlyMedicines: any;

  triggerOn: ETriggerFor;
  triggerType: ETriggerType;

  title: string;
  maxLeads: number;

  cookies: string; // im_iss and ImeshVisitor are required
  aiInstructions: string | null;
  glusrId: string;
  totalMessages: number;
  mobNumber: string;
  ipAddress: string | null;
  sessionToken: string;
}

export const FilterDataWeb = {
  boolAndPoints: [
    {
      id: "whatsappActive",
      title: "Whatsapp Active",
      isTrue: true,
      points: 20,
      typeSystem: ["boolean", "number"],
      reflectTo: ["needWhatsappActive", "pointWhatsappActive"],
    },
    {
      id: "mobVerified",
      title: "Mob Verified",
      isTrue: true,
      points: 20,
      typeSystem: ["boolean", "number"],
      reflectTo: ["needMobVerified", "pointMobVerified"],
    },
    {
      id: "emailVerified",
      title: "Email Verified",
      isTrue: true,
      points: 20,
      typeSystem: ["boolean", "number"],
      reflectTo: ["needEmailVerified", "pointEmailVerified"],
    },
    {
      id: "buyerReply",
      title: "Buyer Reply",
      isTrue: true,
      points: 20,
      typeSystem: ["boolean", "number"],
      reflectTo: ["needBuyerReply", "pointBuyerReply"],
    },
    {
      id: "buyerRequirement",
      title: "Buyer Requirement",
      isTrue: false,
      points: 20,
      typeSystem: ["boolean", "number"],
      reflectTo: ["needBuyerRequirement", "pointBuyerRequirement"],
    },
    {
      id: "buyerCalls",
      title: "Buyer Calls",
      isTrue: false,
      points: 20,
      typeSystem: ["boolean", "number"],
      reflectTo: ["needBuyerCalls", "pointBuyerCalls"],
    },
    {
      id: "sec",
      title: "Seconds",
      isTrue: true,
      points: 100,
      typeSystem: ["boolean", "number"],
      reflectTo: ["needSec", "pointSec"],
    },
  ],
  keyValue: [
    {
      id: "minPointsForPurchase",
      title: "Minimum Points Required",
      placeholder: "Minimum Points for Purchase",
      value: 140,
      typeSystem: "number",
      reflectTo: "minPointsForPurchase",
    },
    // {
    //   id: "aiInstructions",
    //   title: "AI Instructions",
    //   placeholder: "",
    //   value: "Some instructions",
    //   typeSystem: "string",
    //   reflectTo: "aiInstructions",
    // },
    // {
    //   id: "allowMessaging",
    //   title: "Allow Messaging",
    //   placeholder: "",
    //   value: true,
    //   typeSystem: "boolean",
    //   reflectTo: "allowMessaging",
    // },
    {
      id: "totalMessages",
      title: "Total Messages",
      placeholder: "Number of total messages the customer should receive",
      value: 1,
      typeSystem: "number",
      reflectTo: "totalMessages",
    },
    {
      id: "email",
      title: "Email Address",
      placeholder: "Email address where you want to receive the notification",
      value: "",
      typeSystem: "string",
      reflectTo: "emailAdrr",
    },
    {
      id: "fullName",
      title: "Full Name",
      placeholder: "The name will be used during conversations with customer",
      value: "",
      typeSystem: "string",
      reflectTo: "fullName",
    },
    {
      id: "companyName",
      title: "Company Name",
      placeholder: "Enter your company name..",
      value: "",
      typeSystem: "string",
      reflectTo: "companyName",
    },
  ],
  list: [
    {
      id: "allowCountries",
      title: "Allow Countries",
      placeholder: "Example USA",
      type: "allow",
      metadata: "",
      value: [],
      typeSystem: "Array of string",
      reflectTo: "allowCountries",
    },
    // {
    //   id: "allowCategories",
    //   title: "Allow Categories",
    //   placeholder: "Example Anti Infective Tablet",
    //   type: "allow",
    //   metadata: "",
    //   value: [],
    //   typeSystem: "Array of string",
    //   reflectTo: "allowCategories",
    // },
    {
      id: "restrictMedicines",
      title: "Restrict Medicines",
      placeholder: "Example bapam",
      type: "regex",
      metadata: "",
      value: [],
      typeSystem: "Array of regex",
      reflectTo: "restrictMedicines",
    },
    {
      id: "allowOnlyMedicines",
      title: "Allow OnlyMedicines",
      placeholder: "Example Adderaii",
      type: "regex",
      metadata: "",
      value: [],
      typeSystem: "Array of regex",
      reflectTo: "allowOnlyMedicines",
    },
  ],
  enumsType: [
    {
      id: "triggerOn",
      title: "Trigger On",
      value: "Purchase and Message",
      options: ["Purchase and Message"],
      typeSystem: "ETriggerFor",
      reflectTo: "triggerOn",
    },
    {
      id: "triggerType",
      title: "Trigger Type",
      value: "Mail",
      options: ["Mail"],
      typeSystem: "ETriggerType",
      reflectTo: "triggerType",
    },
  ],
  metaData: [
    {
      id: "title",
      title: "Title",
      value: "Example",
      typeSystem: "string",
      reflectTo: "title",
    },
    {
      id: "maxLeads",
      title: "Maximum leads",
      value: 1,
      typeSystem: "number",
      reflectTo: "maxLeads",
    },
  ],
};

export const FilterData = {
  // boolAndPoints
  whatsappActive: {
    isTrue: FilterDataWeb.boolAndPoints![0]!.isTrue,
    points: FilterDataWeb.boolAndPoints![0]!.points,
  },
  mobVerified: {
    isTrue: FilterDataWeb.boolAndPoints![1]!.isTrue,
    points: FilterDataWeb.boolAndPoints![1]!.points,
  },
  emailVerified: {
    isTrue: FilterDataWeb.boolAndPoints![2]!.isTrue,
    points: FilterDataWeb.boolAndPoints![2]!.points,
  },
  buyerReply: {
    isTrue: FilterDataWeb.boolAndPoints![3]!.isTrue,
    points: FilterDataWeb.boolAndPoints![3]!.points,
  },
  buyerRequirement: {
    isTrue: FilterDataWeb.boolAndPoints![4]!.isTrue,
    points: FilterDataWeb.boolAndPoints![4]!.points,
  },
  buyerCalls: {
    isTrue: FilterDataWeb.boolAndPoints![5]!.isTrue,
    points: FilterDataWeb.boolAndPoints![5]!.points,
  },
  sec: {
    isTrue: FilterDataWeb.boolAndPoints![6]!.isTrue,
    points: FilterDataWeb.boolAndPoints![6]!.points,
  },

  // keyValue
  minPointsForPurchase: Number(FilterDataWeb.keyValue![0]!.value),
  totalMessages: Number(FilterDataWeb.keyValue![1]!.value),
  email: FilterDataWeb.keyValue![2]!.value,
  fullName: FilterDataWeb.keyValue![3]!.value,
  companyName: FilterDataWeb.keyValue![4]!.value,

  // list
  allowCountries: FilterDataWeb.list![0]!.value,
  // allowCategories: FilterDataWeb.list![1]!.value,
  restrictMedicines: FilterDataWeb.list![1]!.value,
  allowOnlyMedicines: FilterDataWeb.list![2]!.value,

  // enumsType
  // @ts-ignore
  triggerOn: FilterDataWeb.enumsType![0]!.value,
  // @ts-ignore
  triggerType: FilterDataWeb.enumsType![1]!.value,

  // metaData
  title: FilterDataWeb.metaData![0]!.value,
  maxLeads: Number(FilterDataWeb.metaData![1]!.value),
};

export interface PurchaseHandler {
  success: boolean; // error occured
  madePurchase: boolean;
}

export interface MessageHandler {
  success: boolean; // error occured
  msgSend: boolean;
  triggerNotification: boolean;
}

export interface InterestedHandler {
  success: boolean; // error occured
  interested: boolean;
}

export type ESubscription = "Free" | "Premium" | "Infinity";

export function convertToRegex(arr: Array<string>): Array<RegExp> {
  return arr.map((r: string) => new RegExp(r, "gim"));
}
