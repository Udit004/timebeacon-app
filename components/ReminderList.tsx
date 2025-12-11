"use client";

import { useGetReminders } from "@/hooks/UseReminderHook";
import { formatDistanceToNow, format } from "date-fns";
import { Clock, CheckCircle, AlertCircle } from "lucide-react";
import ReminderTabs from "./ReminderTabs";
import { userUIStore } from "@/store/ui.store";

export default function ReminderList() {
    const { filter } = userUIStore();
    const { data: reminders, isLoading, isError } = useGetReminders();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-40">
                <p className="text-gray-500">Loading reminders...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
                ❌ Error loading reminders
            </div>
        );
    }

    if (!reminders || reminders.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <p>No reminders yet. Create one to get started!</p>
            </div>
        );
    }

    //filter reminders based on selected filter
    const filteredReminders = reminders.filter((reminder) => {
        if (filter === "all") return true;
        if (filter === "pending") return reminder.status === "PENDING";
        if (filter === "completed") return reminder.status === "COMPLETED";
    })

    const getStatusIcon = (status: string) => {
        if (status === "COMPLETED") {
            return <CheckCircle className="w-5 h-5 text-green-500" />;
        }
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    };

    const getStatusColor = (status: string) => {
        return status === "COMPLETED"
            ? "bg-green-100 text-green-800"
            : "bg-yellow-100 text-yellow-800";
    };

    return (
        <div className="space-y-4">
            <div>
                <ReminderTabs />
            </div>
            
            <div className="grid gap-4">
                {filteredReminders.map((reminder) => {
                    // Database returns UTC, convert to IST for display
                    const reminderDate = new Date(reminder.remindAt);
                    const istDate = new Date(reminderDate.getTime() - (5.5 * 60 * 60 * 1000));
                    
                    return (
                        <div
                            key={reminder.id}
                            className="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow p-4"
                        >
                            {/* Header */}
                            <div className="flex items-start justify-between mb-3">
                                <h3 className="text-lg font-semibold text-gray-900">
                                    {reminder.title}
                                </h3>
                                <div className="flex items-center gap-2">
                                    {getStatusIcon(reminder.status)}
                                    <span
                                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                            reminder.status
                                        )}`}
                                    >
                                        {reminder.status}
                                    </span>
                                </div>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 text-sm mb-3">
                                {reminder.body || "No description"}
                            </p>

                            {/* Remind At (IST) */}
                            <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                                <Clock className="w-4 h-4" />
                                <span>
                                    {format(istDate, "MMM dd, yyyy • h:mm a")} IST
                                </span>
                            </div>

                            {/* Time Until */}
                            <div className="text-xs text-gray-400">
                                {formatDistanceToNow(reminderDate, { addSuffix: true })}
                            </div>

                            {/* Created At */}
                            <div className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-400">
                                Created {formatDistanceToNow(new Date(reminder.createdAt), { addSuffix: true })}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}