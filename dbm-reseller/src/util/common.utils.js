import { message } from "antd";
import { t } from "i18next";
import axiosInstance from "./axiosInstance";
import { getMediaPath } from "../lib";
import moment from "moment";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  QuestionCircleOutlined,
  SyncOutlined,
} from "@ant-design/icons";

export const CURRENCIES_COUNTRY = {
  INR: "IN",
  USD: "US",
  BRL: "BR",
  MYR: "MY",
  AED: "AE",
  AUD: "AU",
  CAD: "CA",
  EUR: "FR",
  GBP: "GB",
  MXN: "MX",
  SGD: "SG",
  THB: "TH",
  IDR: "ID",
  ZAR: "ZA",
};

export const CURRENCIES_SYMBOL = {
  INR: "₹",
  USD: "$",
  BRL: "R$",
  MYR: "RM",
  AED: "د.إ",
  AUD: "A$",
  CAD: "CA$",
  EUR: "€",
  GBP: "£",
  MXN: "$",
  SGD: "S$",
  THB: "฿",
  IDR: "Rp",
  ZAR: "R",
};

export const ORDER_STATUS = [
  {
    label: "Processing",
    color: "processing",
    value: "processing",
    icon: SyncOutlined,
  },
  {
    label: "Pending Payment",
    color: "warning",
    value: "pending-payment",
    icon: ExclamationCircleOutlined,
  },
  {
    label: "Failed",
    color: "error",
    value: "failed",
    icon: QuestionCircleOutlined,
  },
  {
    label: "On-Hold",
    color: "warning",
    value: "on-hold",
    icon: ExclamationCircleOutlined,
  },
  {
    label: "Completed",
    color: "success",
    value: "completed",
    icon: CheckCircleOutlined,
  },
  {
    label: "Cancelled",
    color: "error",
    value: "cancelled",
    icon: QuestionCircleOutlined,
  },
  {
    label: "Refunded",
    color: "default",
    value: "refunded",
    icon: QuestionCircleOutlined,
  },
];

export function currencyAmount(amount, currency, convert = true) {
  if (typeof amount !== "number") {
    amount = parseFloat(amount) || 0; // Ensure amount is a number, default to 0 if invalid
  }

  if (currency) {
    return `${currency.symbol ?? ""}${(convert
      ? amount * currency.rate
      : amount
    ).toFixed(2)}${!currency.symbol ? " " + currency.code : ""}`;
  } else {
    return `${amount.toFixed(2)}`;
  }
}

export function getBase64(img, callback) {
  const reader = new FileReader();
  reader.addEventListener("load", () => callback(reader.result));
  reader.readAsDataURL(img);
}

export function beforeUpload(file) {
  const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
  if (!isJpgOrPng) {
    message.error(t("youcanonlyuploadJPG/PNGfile!"));
  }
  const isLt2M = file.size / 1024 / 1024 < 2;
  if (!isLt2M) {
    message.error(t("Imagemustsmallerthan2MB!"));
  }
  return isJpgOrPng && isLt2M;
}

export async function customRequest(options) {
  try {
    const { file, onSuccess, onError } = options;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("type", "image");

    const { data } = await axiosInstance.post("app/upload-image", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
      onUploadProgress: (progressEvent) => {
        const percent = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Upload progress: ${percent}%`);
      },
    });

    if (data.status) {
      onSuccess(data);
    } else {
      onError(new Error(data.message));
    }
  } catch (error) {
    message.error(t("uploadfailed!"));
  }
}

export function formatDate(date, format = "DD MMM YYYY, h:mm A") {
  return moment(date).format(format);
}
export const getPaymentGatewayImage = (gateway) => {
  return getMediaPath(`media/payment-gateway/${gateway}.png`);
};
