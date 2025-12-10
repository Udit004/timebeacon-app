"use client";

import { useEffect, useState } from "react";
import { pusherClient } from "@/lib/pusher";

export interface Notification {
  reminderId: string;
  message: string;
  timestamp: string;
  type: "scheduled" | "completed" | "error";
}

export const usePusherNotification = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    // Subscribe to reminders channel
    const channel = pusherClient.subscribe("reminders");

    // Listen for scheduled event
    channel.bind("reminder-scheduled", (data: any) => {
      setNotifications((prev) => [
        ...prev,
        { ...data, type: "scheduled" },
      ]);
      console.log("📅 Reminder scheduled:", data);
    });

    // Listen for completed event
    channel.bind("reminder-completed", (data: any) => {
      setNotifications((prev) => [
        ...prev,
        { ...data, type: "completed" },
      ]);
      console.log("✅ Reminder completed:", data);
    });

    // Listen for error event
    channel.bind("reminder-error", (data: any) => {
      setNotifications((prev) => [
        ...prev,
        { ...data, type: "error" },
      ]);
      console.log("❌ Reminder error:", data);
    });

    return () => {
      channel.unbind_all();
      pusherClient.unsubscribe("reminders");
    };
  }, []);

  return { notifications };
};