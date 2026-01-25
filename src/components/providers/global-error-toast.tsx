"use client";

import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export default function GlobalErrorToast() {
  const { toast } = useToast();

  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      toast({
        title: "错误",
        description: event.message || "发生未知错误",
        variant: "destructive",
      });
    };

    const handleRejection = (event: PromiseRejectionEvent) => {
      const reason = event.reason;
      const message =
        reason instanceof Error
          ? reason.message
          : typeof reason === "string"
            ? reason
            : "发生未知错误";
      toast({
        title: "错误",
        description: message,
        variant: "destructive",
      });
    };

    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleRejection);

    return () => {
      window.removeEventListener("error", handleError);
      window.removeEventListener("unhandledrejection", handleRejection);
    };
  }, [toast]);

  return null;
}
