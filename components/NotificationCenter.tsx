"use client";

import { usePusherNotification, Notification } from "@/hooks/usePusherNotification";
import { playSound } from "@/lib/soundPlayer";
import { X, Bell, Volume2, VolumeX, CheckCircle2, Calendar, AlertCircle, Clock } from "lucide-react";
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

      // Auto remove after 6 seconds
      const timer = setTimeout(() => {
        setVisibleNotifications((prev) =>
          prev.filter((n) => n.reminderId !== latestNotification.reminderId)
        );
      }, 6000);

      return () => clearTimeout(timer);
    }
  }, [notifications, soundEnabled]);

  const getNotificationStyle = (type: string) => {
    switch (type) {
      case "scheduled":
        return "bg-gradient-to-br from-blue-500/10 via-blue-600/10 to-blue-500/10 border-blue-500/30 text-blue-200";
      case "completed":
        return "bg-gradient-to-br from-emerald-500/10 via-emerald-600/10 to-emerald-500/10 border-emerald-500/30 text-emerald-200";
      case "error":
        return "bg-gradient-to-br from-red-500/10 via-red-600/10 to-red-500/10 border-red-500/30 text-red-200";
      default:
        return "bg-gradient-to-br from-gray-500/10 via-gray-600/10 to-gray-500/10 border-gray-500/30 text-gray-200";
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "scheduled":
        return <Calendar className="w-5 h-5 text-blue-400" />;
      case "completed":
        return <CheckCircle2 className="w-5 h-5 text-emerald-400" />;
      case "error":
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      default:
        return <Bell className="w-5 h-5 text-gray-400" />;
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
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setSoundEnabled(!soundEnabled)}
          className={`group relative rounded-2xl p-4 backdrop-blur-lg shadow-lg transition-all duration-300 hover:scale-110 border ${
            soundEnabled
              ? "bg-linear-to-br from-amber-500/20 to-orange-500/20 border-amber-500/30 text-amber-300 hover:from-amber-500/30 hover:to-orange-500/30"
              : "bg-linear-to-br from-gray-500/20 to-gray-600/20 border-gray-500/30 text-gray-400 hover:from-gray-500/30 hover:to-gray-600/30"
          }`}
          title={soundEnabled ? "Sound on" : "Sound off"}
        >
          {soundEnabled ? (
            <Volume2 className="w-6 h-6" />
          ) : (
            <VolumeX className="w-6 h-6" />
          )}
          
          {/* Tooltip */}
          <span className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            {soundEnabled ? "Mute notifications" : "Unmute notifications"}
          </span>
        </button>
      </div>

      {/* Notification Toast Container */}
      <div className="fixed top-6 right-6 z-50 space-y-3 max-w-md">
        {visibleNotifications.map((notification) => (
          <div
            key={`${notification.reminderId}-${notification.timestamp}`}
            className={`backdrop-blur-xl border rounded-2xl p-5 shadow-2xl animate-slide-in relative overflow-hidden ${getNotificationStyle(
              notification.type
            )}`}
          >
            {/* Animated background gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-shimmer"></div>
            
            <div className="flex items-start justify-between gap-4 relative z-10">
              <div className="flex items-start gap-3 flex-1">
                <div className="mt-1">
                  {getNotificationIcon(notification.type)}
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-sm mb-1 leading-snug">
                    {notification.message}
                  </p>
                  <p className="text-xs opacity-60 flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    {new Date(notification.timestamp).toLocaleTimeString(
                      "en-IN",
                      {
                        timeZone: "Asia/Kolkata",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )}
                  </p>
                </div>
              </div>
              <button
                onClick={() => dismissNotification(notification.reminderId)}
                className="flex-shrink-0 text-gray-400 hover:text-white transition-colors p-1 rounded-lg hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Unread Badge */}
      {unreadCount > 0 && (
        <div className="fixed top-6 left-6 z-40 animate-fade-in">
          <div className="flex items-center gap-3 bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl rounded-2xl shadow-2xl shadow-amber-500/10 p-4 border border-amber-500/20">
            <div className="relative">
              <Bell className="w-5 h-5 text-amber-400" />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full animate-pulse"></span>
            </div>
            <div>
              <span className="text-sm font-semibold text-gray-200 block">
                {unreadCount} {unreadCount !== 1 ? "notifications" : "notification"}
              </span>
              <button
                onClick={() => {
                  setUnreadCount(0);
                }}
                className="text-xs text-amber-400 hover:text-amber-300 transition-colors font-medium"
              >
                Clear all
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}