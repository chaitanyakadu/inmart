export interface SocketMessage {
  messageType: ESockerMessageType;
  info?: string;
  sessionToken?: string;
}
export enum ESockerMessageType {
  // CONNECT = "connect",
  DISCONNECT = "disconnect",
  SERVER_MESSAGE = "server-message",
  STATUS = "status",
  MONITOR_LOGS = "monitor-logs",
}

export interface UserHistory {
  customerName?: string;
  customerCountry?: string;
  medicineName?: string;
  medicineCategory?: string;
  details?: string;
  status?: string;
  createdAt?: string;
}

export interface SocketResponse {
  type: "status" | "monitor-log";
  data: any;
}
