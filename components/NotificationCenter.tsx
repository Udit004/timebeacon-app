"use client";

import { usePusherNotification, Notification } from "@/hooks/usePusherNotification";
import { playSound } from "@/lib/soundPlayer";
import { X, Bell } from "lucide-react";
import { useState, useEffect } from "react";

export default function NotificationCenter() {
  const { notifications } = usePusherNotification();
  const [visibleNotifications, setVisibleNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);

  useEffect(() => {
    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1];
      setVisibleNotifications((prev) => [...prev, latestNotification]);
      setUnreadCount((prev) => prev + 1);

      // Play sound based on notification type
      if (soundEnabled) {
        switch (latestNotification.type) {
          case "scheduled":
            playSound("notification", 0.5);
            break;
          case "completed":
            playSound("completed", 0.6);
            break;
          case "error":
            playSound("error", 0.7);
            break;
        }
      }

      // Auto remove after 5 seconds
      const timer = setTimeout(() => {
        setVisibleNotifications((prev) =>
          prev.filter((n) => n.reminderId !== latestNotification.reminderId)
        );
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [notifications, soundEnabled]);

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case "scheduled":
        return "bg-blue-50 border-blue-300 text-blue-800";
      case "completed":
        return "bg-green-50 border-green-300 text-green-800";
      case "error":
        return "bg-red-50 border-red-300 text-red-800";
      default:
        return "bg-gray-50 border-gray-300 text-gray-800";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "scheduled":
        return "📅";
      case "completed":
        return "✅";
      case "error":
        return "❌";
      default:
        return "ℹ️";
    }
  };

  const dismissNotification = (reminderId: string) => {
    setVisibleNotifications((prev) =>
      prev.filter((n) => n.reminderId !== reminderId)
    );
  };

  return (
    <>
      {/* Sound Toggle Button */}
      <div className="fixed bottom-4 right-4 z-40">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`rounded-full p-3 shadow-lg transition-all ${
            soundEnabled
              ? "bg-blue-600 hover:bg-blue-700 text-white"
              : "bg-gray-300 hover:bg-gray-400 text-gray-700"
          }`}
          title={soundEnabled ? "Sound on" : "Sound off"}
        >
          {soundEnabled ? (
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.26 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
            </svg>
          ) : (
            <svg
              className="w-6 h-6"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M16.6915026,12.4744748 L21.0151688,17.1589742 C21.8009023,18.0337086 21.8009023,19.3561709 21.0151688,20.2309052 C20.2294353,21.1056397 18.9838956,21.1056397 18.1981621,20.2309052 L13.874496,15.5464058 L9.54783243,20.2309052 C8.76209888,21.1056397 7.51655915,21.1056397 6.73082561,20.2309052 C5.94509206,19.3561709 5.94509206,18.0337086 6.73082561,17.1589742 L11.0574917,12.4744748 L6.73082561,7.79007544 C5.94509206,6.91533105 5.94509206,5.59286875 6.73082561,4.71812436 C7.51655915,3.84337997 8.76209888,3.84337997 9.54783243,4.71812436 L13.874496,9.40262378 L18.1981621,4.71812436 C18.9838956,3.84337997 20.2294353,3.84337997 21.0151688,4.71812436 C21.8009023,5.59286875 21.8009023,6.91533105 21.0151688,7.79007544 L16.6915026,12.4744748 Z" />
            </svg>
          )}
        </button>
      </div>

      {/* Notification Toast Container */}
      <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
        {visibleNotifications.map((notification) => (
          <div
            key={`${notification.reminderId}-${notification.timestamp}`}
            className={`border rounded-lg p-4 shadow-lg animate-slide-in ${getNotificationStyle(
              notification.type
            )}`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3 flex-1">
                <span className="text-xl mt-1">
                  {getNotificationIcon(notification.type)}
                </span>
                <div className="flex-1">
                  <p className="font-semibold text-sm">{notification.message}</p>
                  <p className="text-xs opacity-70 mt-1">
                    {new Date(notification.timestamp).toLocaleTimeString(
                      "en-IN",
                      {
                        timeZone: "Asia/Kolkata",
                      }
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => dismissNotification(notification.reminderId)}
                className="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Unread Badge */}
      {unreadCount > 0 && (
        <div className="fixed top-4 left-4 z-40">
          <div className="flex items-center gap-2 bg-white rounded-lg shadow-lg p-3">
            <Bell className="w-5 h-5 text-blue-600" />
            <span className="text-sm font-semibold text-gray-800">
              {unreadCount} notification{unreadCount !== 1 ? "s" : ""}
            </span>
            <button
              onClick={() => {
                setUnreadCount(0);
              }}
              className="text-xs text-blue-600 hover:text-blue-800 ml-2"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </>
  );
}