"use client";

import { useEffect } from "react";
import { markAllNotificationsReadAction } from "@/lib/actions/influencer";

export function MarkRead() {
  useEffect(() => {
    markAllNotificationsReadAction().catch(() => {});
  }, []);
  return null;
}
