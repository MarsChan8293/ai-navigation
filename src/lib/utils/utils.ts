import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { ScreenshotService } from "@/lib/services/screenshot";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export class AjaxResponse<T> {
  success: boolean;
  data: T | null;
  message: string;
  code: number = 200;

  constructor(
    success: boolean,
    data: T | null,
    message: string = "",
    code: number = 200
  ) {
    this.success = success;
    this.data = data;
    this.message = message;
    this.code = code;
  }

  static ok<T>(data: T): AjaxResponse<T> {
    return new AjaxResponse<T>(true, data, "", 200);
  }

  static fail<T>(message: string, code: number = 500): AjaxResponse<T> {
    return new AjaxResponse<T>(false, null, message, code);
  }
}

export async function fetchMetadata(url: string) {
  try {
    const result = await ScreenshotService.captureScreenshot(url);
    return result;
  } catch (error) {
    console.error("Metadata fetch error:", error);
    throw error;
  }
}
