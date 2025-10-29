import axios from "axios";
import { GetDataResponse } from "@repo/types/web";

export async function getUserDetails(): Promise<GetDataResponse> {
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  return await axios({
    url: `${BACKEND_URL}/api/profile/userDetails`,
    method: "GET",
    withCredentials: true,
  })
    .then((res) => {
      const data = res.data;
      if (!data.success) {
        return {
          success: false,
          data: null,
        };
      }

      return {
        success: true,
        data: data.data,
      };
    })
    .catch((error) => {
      console.warn(error);
      return {
        success: false,
        data: null,
      };
    });
}

export async function getServiceStatus(): Promise<GetDataResponse> {
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";

  return await axios({
    url: `${BACKEND_URL}/api/service/status`,
    method: "GET",
    withCredentials: true,
  })
    .then((res) => {
      const data = res.data;
      if (!data.success) {
        return {
          success: false,
          data: undefined,
        };
      }
      return {
        success: true,
        data: data.data,
      };
    })
    .catch((error) => {
      console.warn(error);
      return {
        success: false,
        data: undefined,
      };
    });
}

export async function getUserCredit(): Promise<GetDataResponse> {
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  return await axios({
    url: `${BACKEND_URL}/api/statistics/get_user_credit`,
    method: "GET",
    withCredentials: true,
  })
    .then((res) => {
      const data = res.data;
      if (!data.success) {
        return {
          success: false,
          data: null,
        };
      }

      const userCredit = data.data;
      return {
        success: true,
        data: userCredit,
      };
    })
    .catch((error) => {
      console.warn(error);
      return {
        success: false,
        data: null,
      };
    });
}

export async function getUserHistory(): Promise<GetDataResponse> {
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  return await axios({
    url: `${BACKEND_URL}/api/statistics/user-history`,
    method: "GET",
    withCredentials: true,
  })
    .then((res) => {
      const data = res.data;
      if (!data.success) {
        return {
          success: false,
          data: null,
        };
      }

      const userHistory = data.data;
      return {
        success: true,
        data: userHistory,
      };
    })
    .catch((error) => {
      console.warn(error);
      return {
        success: false,
        data: null,
      };
    });
}

export async function getUserData(): Promise<GetDataResponse> {
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  return await axios({
    url: `${BACKEND_URL}/api/profile`,
    method: "GET",
    withCredentials: true,
  })
    .then((res) => {
      const data = res.data;
      if (!data.success) {
        return {
          success: false,
          data: null,
        };
      }

      return {
        success: true,
        data: data.data,
      };
    })
    .catch((error) => {
      console.warn(error);
      return {
        success: false,
        data: null,
      };
    });
}

export async function getUserSession(): Promise<GetDataResponse> {
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  return await axios({
    url: `${BACKEND_URL}/auth/session`,
    method: "GET",
    withCredentials: true,
  })
    .then((res) => {
      const data = res.data;
      if (!data.success) {
        return {
          success: false,
          data: null,
        };
      }

      return {
        success: true,
        data: data.data.sessions,
      };
    })
    .catch((error) => {
      console.warn(error);
      return {
        success: false,
        data: null,
      };
    });
}

export async function getUserFilters(): Promise<GetDataResponse> {
  const BACKEND_URL =
    process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:4000";
  return await axios({
    url: `${BACKEND_URL}/api/filters`,
    method: "GET",
    withCredentials: true,
  })
    .then((res) => {
      const data = res.data;
      if (!data.success) {
        return {
          success: false,
          data: null,
        };
      }

      return {
        success: true,
        data: data.data,
      };
    })
    .catch((error) => {
      console.warn(error);
      return {
        success: false,
        data: null,
      };
    });
}

export function getUserCookie(): string {
  if (document) {
    return document?.cookie
      .split("; ")
      .filter(
        (v) =>
          v.split("=")[0] === "ImeshVisitor" || v.split("=")[0] === "im_iss"
      )
      .join("; ");
  } else {
    throw Error("Document not found.");
  }
}

export function getCookieValue(key: string): string | undefined {
  if (document) {
    return document?.cookie
      .split("; ")
      .find((v) => v.split("=")[0] === key)
      ?.split("=")[1];
  } else {
    throw Error("Document not found.");
  }
}
