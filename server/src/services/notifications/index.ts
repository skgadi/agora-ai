import { GSK_SEND_NOTIFICATION_TO_CLIENT } from "../library/types/data-transfer-protocls.js";

export const notifyError = (notifyTo: any, message: string, title?: string) => {
  const payLoad: GSK_SEND_NOTIFICATION_TO_CLIENT = {
    type: "GSK_SEND_NOTIFICATION_TO_CLIENT",
    payload: {
      type: "negative",
      message: message,
      title: title || "Error",
    },
  };
  notifyTo.emit("notify-client", payLoad);
};

export const notifySuccess = (
  notifyTo: any,
  message: string,
  title?: string
) => {
  const payLoad: GSK_SEND_NOTIFICATION_TO_CLIENT = {
    type: "GSK_SEND_NOTIFICATION_TO_CLIENT",
    payload: {
      type: "positive",
      message: message,
      title: title || "Success",
    },
  };
  notifyTo.emit("notify-client", payLoad);
};

export const notifyInfo = (notifyTo: any, message: string, title?: string) => {
  const payLoad: GSK_SEND_NOTIFICATION_TO_CLIENT = {
    type: "GSK_SEND_NOTIFICATION_TO_CLIENT",
    payload: {
      type: "info",
      message: message,
      title: title || "Info",
    },
  };
  notifyTo.emit("notify-client", payLoad);
};

export const notifyWarning = (
  notifyTo: any,
  message: string,
  title?: string
) => {
  const payLoad: GSK_SEND_NOTIFICATION_TO_CLIENT = {
    type: "GSK_SEND_NOTIFICATION_TO_CLIENT",
    payload: {
      type: "warning",
      message: message,
      title: title || "Warning",
    },
  };
  notifyTo.emit("notify-client", payLoad);
};
