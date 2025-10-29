export function fieldDataReducer(state: any, action: any) {
  switch (action.type) {
    case "keyValue":
      state["keyValue"][action.id].value = action.value.value;
      break;

    case "boolAndPoints":
      state["boolAndPoints"][action.id].points = action.value.points;
      state["boolAndPoints"][action.id].isTrue = action.value.isTrue;
      break;

    case "enumsType":
      state["enumsType"][action.id].value = action.value.value;
      break;

    case "metaData":
      state["metaData"][action.id].value = action.value.value;
      break;

    case "list":
      state["list"][action.id].value = action.value.value;
      break;

    case "update-state":
      state = {
        ...state,
        // boolAndPoints
        boolAndPoints: {
          whatsappActive: {
            ...state["boolAndPoints"]["whatsappActive"],
            isTrue: action.value.needWhatsappActive,
            points: action.value.pointWhatsappActive,
          },
          mobVerified: {
            ...state["boolAndPoints"]["mobVerified"],
            isTrue: action.value.needMobVerified,
            points: action.value.pointMobVerified,
          },
          emailVerified: {
            ...state["boolAndPoints"]["emailVerified"],
            isTrue: action.value.needEmailVerified,
            points: action.value.pointEmailVerified,
          },
          buyerReply: {
            ...state["boolAndPoints"]["buyerReply"],
            isTrue: action.value.needBuyerReply,
            points: action.value.pointBuyerReply,
          },
          buyerRequirement: {
            ...state["boolAndPoints"]["buyerRequirement"],
            isTrue: action.value.needBuyerRequirement,
            points: action.value.pointBuyerRequirement,
          },
          buyerCalls: {
            ...state["boolAndPoints"]["buyerCalls"],
            isTrue: action.value.needBuyerCalls,
            points: action.value.pointBuyerCalls,
          },
          sec: {
            ...state["boolAndPoints"]["sec"],
            isTrue: action.value.needSec,
            points: action.value.pointSec,
          },
        },

        keyValue: {
          minPointsForPurchase: {
            ...state["keyValue"]["minPointsForPurchase"],
            value: action.value.minPointsForPurchase,
          },
          // totalMessages: {
          // ...state["keyValue"]["totalMessages"],
          //   value: action.value.totalMessages,
          // },
          email: {
            ...state["keyValue"]["email"],
            value: action.value.email,
          },
          fullName: {
            ...state["keyValue"]["fullName"],
            value: action.value.fullName,
          },
          companyName: {
            ...state["keyValue"]["companyName"],
            value: action.value.companyName,
          },
        },

        // list
        list: {
          allowCountries: {
            ...state["list"]["allowCountries"],
            value: action.value.allowCountries,
          },
          // allowCategories: {
          // ...state["list"]["allowCategories"],
          // value: action.value.allowCategories
          // },
          restrictMedicines: {
            ...state["list"]["restrictMedicines"],
            value: action.value.restrictMedicines,
          },
          allowOnlyMedicines: {
            ...state["list"]["allowOnlyMedicines"],
            value: action.value.allowOnlyMedicines,
          },
        },

        // enumsType
        enumType: {
          // @ts-ignore
          triggerOn: {
            ...state["enumType"]["triggerOn"],
            value: action.value.triggerOn,
          },
          // @ts-ignore
          triggerType: {
            ...state["enumType"]["triggerType"],
            value: action.value.triggerType,
          },
        },

        // metaData
        metaData: {
          title: {
            ...state["metaData"]["title"],
            value: action.value.title,
          },
          maxLeads: {
            ...state["metaData"]["maxLeads"],
          },
        },
      };
      // "id": "d54a362f-f62c-4803-aec6-10693974b33a",
      //       "title": "Production",

      //       "needWhatsappActive": true,
      //       "pointWhatsappActive": 20,
      //       "needMobVerified": true,
      //       "pointMobVerified": 20,
      //       "needEmailVerified": true,
      //       "pointEmailVerified": 20,
      //       "needBuyerReply": true,
      //       "pointBuyerReply": 20,
      //       "needBuyerRequirement": false,
      //       "pointBuyerRequirement": 20,
      //       "needBuyerCalls": false,
      //       "pointBuyerCalls": 20,
      //       "needSec": true,
      //       "pointSec": 100,

      //       "minPointsForPurchase": 140,
      //       "allowMessaging": true,
      //       "email": "chaitanyakadu1486@gmail.com",
      //       "fullName": "Yash Methani",
      //       "companyName": "Prime Pharma",
      //       "totalMessages": 1,
      //       "aiInstructions": "",

      //       "allowCountries": [
      //           "USA",
      //           "UK",
      //           "Australia"
      //       ],
      //       "allowCategories": [],
      //       "restrictMedicines": [
      //           "zolam",
      //           "zepam",
      //           "dog",
      //           "animal"
      //       ],
      //       "allowOnlyMedicines": [],

      //       "triggerOn": "Purchase and Message",
      //       "triggerType": "Mail",

      //       "createdAt": "2025-10-18T11:01:04.460Z",
      //       "updatedAt": "2025-10-18T11:01:04.460Z"
      break;

    default:
      console.warn("Invalid action type!");
      break;
  }
  return { ...state };
}
