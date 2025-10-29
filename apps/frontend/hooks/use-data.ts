import {
  getServiceStatus,
  getUserCredit,
  getUserData,
  getUserDetails,
  getUserFilters,
  getUserHistory,
  getUserSession,
} from "@/lib/get-data";
import { ProfileGetUserData, UserCreditsData } from "@repo/types/backend";
import { UserDetails } from "@repo/types/web";
import { useEffect, useState } from "react";
import { SocketResponse, UserHistory } from "@repo/types/socket";

export function useUserDetails() {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const result = await getUserDetails();

        if (!result.success || !result.data) {
          throw Error("Error occured while fetching User data!");
        }

        setUserDetails(result.data);
        setLoading(false);
      } catch (error) {
        console.warn(error);
      }
    })();
  }, []);

  return [userDetails, loading];
}

export function useServiceStatus() {
  const [serviceStatus, setServiceStatus] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const result = await getServiceStatus();

        if (!result.success || !result.data) {
          throw Error("Error occured while fetching User Credit!");
        }

        setServiceStatus(result.data.status === "active" ? true : false);
        setLoading(false);
      } catch (error) {
        console.warn(error);
      }
    })();
  }, []);

  return [serviceStatus, loading];
}

export function useUserCredit() {
  const [userCredits, setUserCredits] = useState<UserCreditsData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const result = await getUserCredit();

        if (!result.success || !result.data) {
          throw Error("Error occured while fetching User Credit!");
        }

        setUserCredits(result.data);
        setLoading(false);
      } catch (error) {
        console.warn(error);
      }
    })();
  }, []);

  return [userCredits, loading];
}

export function useUserHistory() {
  const [userHistory, setUserHistory] = useState<Array<UserHistory> | null>(
    null
  );
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const result = await getUserHistory();

        if (!result.success || !result.data) {
          throw Error("Error occured while fetching User History!");
        }

        setUserHistory(result.data);
        setLoading(false);
      } catch (error) {
        console.warn(error);
      }
    })();
  }, []);

  return [userHistory, loading];
}

export function useUserData() {
  const [userData, setUserData] = useState<ProfileGetUserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const result = await getUserData();

        if (!result.success || !result.data) {
          throw Error("Error occured while fetching User data!");
        }

        setUserData(result.data);
        setLoading(false);
      } catch (error) {
        console.warn(error);
      }
    })();
  }, []);

  return [userData, loading];
}

export function useUserSession() {
  const [userSession, setUserSession] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const result = await getUserSession();

        if (!result.success || !result.data) {
          throw Error("Error occured while fetching User Session!");
        }
        setUserSession(result.data);
        setLoading(false);
      } catch (error) {
        console.warn(error);
      }
    })();
  }, []);

  return [userSession, loading];
}

export function useUserFilters() {
  const [userFilters, setUserFilters] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    (async () => {
      try {
        const result = await getUserFilters();

        if (!result.success || !result.data) {
          throw Error("Error occured while fetching User Filters!");
        }

        setUserFilters(result.data);
        setLoading(false);
      } catch (error) {
        console.warn(error);
      }
    })();
  }, []);

  return [userFilters, loading];
}

export function useSocket() {
  const SOCKET_URL =
    process.env.NEXT_PUBLIC_SOCKET_URL || "ws://localhost:8080";
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [status, setStatus] = useState<boolean>(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    (async () => {
      const ws = new WebSocket(`${SOCKET_URL}`);

      ws.onopen = () => {
        setSocket(ws);
        console.log("Connected to WebSocket server");
      };

      ws.onmessage = (event) => {
        const response: SocketResponse = JSON.parse(event.data);
        if (response.type === "status") {
          setStatus(response.data === "online");
        } else {
          setMessages((prev): any => [...prev, response.data]);
        }
      };

      ws.onclose = () => {
        console.log("WebSocket closed");
        setStatus(false);
      };

      return () => ws.close();
    })();
  }, []);

  return [messages, socket, status, setStatus];
}
