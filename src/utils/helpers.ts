import type { AppRouter } from "@/AppInitializer";
import { toast } from "@/components/compound/Sonner";
import type { BaseApiErrorResponse } from "@/types/baseApi";
import type { ClassValue } from "clsx";
import clsx from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const showErrorToasts = (err: BaseApiErrorResponse | any, limit?: number) => {
  if (Array.isArray(err.message)) {
    const messages = limit ? err.message.slice(0, limit) : err.message;
    messages.forEach((msg: string) => {
      toast.error(msg);
    });
  } else {
    toast.error(err.message || err.error || "Unknown error");
  }
};

export const showValidationErrors = (errors: Record<string, string>, limit: number = 1, showOnlyMessage:boolean = true) => {
  const messages: { field: string; message: string }[] = [];
  // toast.info(JSON.stringify(errors))
  for (const [field, message] of Object.entries(errors)) {
    if (message && typeof message === "string") {
      messages.push({
        field,
        message,
      });
    }
  }

  // const collectMessages = (err: any, path: string = "") => {
  //   // Skip if err is null or undefined
  //   if (!err) return;

  //   // Skip if ref contains a DOM element (check if it's an HTMLElement)
  //   if (err.ref && err.ref instanceof HTMLElement) return;

  //   if (err.message && typeof err.message === "string") {
  //     messages.push({
  //       field: path,
  //       message: err.message,
  //     });
  //     return; // Stop recursing once we find a message
  //   }

  //   if (typeof err === "object") {
  //     for (const [key, value] of Object.entries(err)) {
  //       // Skip the 'ref' and 'type' keys as they're not field paths
  //       if (key === "ref" || key === "type") continue;

  //       const newPath = path ? `${path}.${key}` : key;
  //       collectMessages(value, newPath);
  //     }
  //   }
  // };

  // collectMessages(errors);

  const limitedMessages = limit ? messages.slice(0, limit) : messages;

  limitedMessages.forEach(({ field, message }) => {
    const formattedField = field
      .split(".")
      .map((part) => part.replace(/([A-Z])/g, " $1").trim())
      .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
      .join(" > ");

    if (showOnlyMessage ){
      toast.error(message)
    }else{
      toast.error(`${formattedField}: ${message}`);
    }
  });
};

export const objectToSearchParams = (obj?: Record<string, any>): string => {
  if (!obj || typeof obj !== "object") return "";

  return new URLSearchParams(
    Object.entries(obj)
      .filter(([_, v]) => v !== undefined && v !== null && v !== "" && !(typeof v === "number" && isNaN(v)))
      .map(([k, v]) => [k, String(v)])
  ).toString();
};

export const toCommaSeparated = (values: string[]): string => {
  return values.filter(Boolean).join(", ");
};

export const getFileExtension = (file: File) => {
  if (!file) return "File not found";
  const extension = file.name.split(".").pop()?.toUpperCase();
  return extension;
};

// return image | video | pdf | document | other
export const getFileType = (text: string)=>{
  if (!text || typeof text !== "string") return "other";

  // If input looks like a mime type (e.g. "image/png"), use that
  // if (text.includes("/")) {
  //   const [type] = text.split("/");
  //   if (type === "image") return "image";
  //   if (type === "video") return "video";
  //   if (type === "application" || type === "text") return "document";
  //   return "other";
  // }

  const ext = text.split(".").pop()?.toLowerCase() || "";

  if(ext === 'pdf'){
    return "pdf"
  }

  const imageExts = new Set(["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg", "heic", "tiff"]);
  const videoExts = new Set(["mp4", "mov", "avi", "mkv", "webm", "flv", "wmv", "3gp", "mpeg"]);
  const docExts = new Set(["doc", "docx", "xls", "xlsx", "ppt", "pptx", "txt", "rtf", "odt", "csv"]);

  if (imageExts.has(ext)) return "image";
  if (videoExts.has(ext)) return "video";
  if (docExts.has(ext)) return "document";
  return "other";
}

// return mimetype (image/png , application/pdf etc)
export const getMimeType = (text: string) => {
  if (!text || typeof text !== "string") {
    return "application/octet-stream";
  }

  // If already a mime type like "image/png"
  if (text.includes("/") && !text.includes(".")) {
    return text.toLowerCase();
  }

  // Extract extension from filename / URL
  const ext = text.split("?")[0].split("#")[0].split(".").pop()?.toLowerCase();

  if (!ext) return "application/octet-stream";

  const mimeMap: Record<string, string> = {
    // Images
    jpg: "image/jpeg",
    jpeg: "image/jpeg",
    png: "image/png",
    gif: "image/gif",
    webp: "image/webp",
    bmp: "image/bmp",
    svg: "image/svg+xml",
    heic: "image/heic",
    tiff: "image/tiff",

    // Videos
    mp4: "video/mp4",
    mov: "video/quicktime",
    avi: "video/x-msvideo",
    mkv: "video/x-matroska",
    webm: "video/webm",
    flv: "video/x-flv",
    wmv: "video/x-ms-wmv",
    mpeg: "video/mpeg",
    "3gp": "video/3gpp",

    // Documents
    pdf: "application/pdf",
    doc: "application/msword",
    docx: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    xls: "application/vnd.ms-excel",
    xlsx: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    ppt: "application/vnd.ms-powerpoint",
    pptx: "application/vnd.openxmlformats-officedocument.presentationml.presentation",
    txt: "text/plain",
    rtf: "application/rtf",
    odt: "application/vnd.oasis.opendocument.text",
    csv: "text/csv",
    json: "application/json",
  };

  return mimeMap[ext] || "application/octet-stream"; // default fallback
};

export function sendBack(router: AppRouter, fallBackRoute?: string) {
  router.history.canGoBack()
    ? router.history.back()
    : router.navigate({
        to: fallBackRoute,
      });
}

export const getResponsiveGridLayoutClass = (length: number) => {
  if (length === 1) return "grid-cols-1";
  if (length === 2) return "grid-cols-2";
  if (length === 3) return "grid-cols-3";
  if (length === 4) return "grid-cols-2";
  return "grid-cols-3";
};

export function formatCurrencyINR(amount: number | null | undefined): string | undefined {
  if (amount == null || typeof amount !== "number" || isNaN(amount)) {
    return undefined;
  }

  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 2,
    minimumFractionDigits: 0,
  }).format(amount);
}

export function formatPhoneNumber(phone: string) {
  if (phone === undefined) return "--";
  let digits = phone?.replace(/\D/g, "");

  if (digits.length < 10) return "Invalid phone number";

  const last10 = digits.slice(-10);
  const prefix = digits.slice(0, -10);

  const match = phone.match(/^(\D*\d{1,5})\D*\d{10}$/);
  const displayPrefix = match ? match[1].replace(/\s+/, "") : prefix;

  return (displayPrefix ? displayPrefix + " " : "") + `${last10.slice(0, 5)} ${last10.slice(5)}`;
}

export function prettyNumber(value: number | null | undefined): string | undefined {
  if (value == null || typeof value !== "number" || isNaN(value)) {
    return undefined;
  }

  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 2,
  }).format(value);
}
