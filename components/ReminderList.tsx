"use client";

import { useDeleteReminder, useGetReminders } from "@/hooks/UseReminderHook";
import { formatDistanceToNow, format } from "date-fns";
import { Clock, CheckCircle, AlertCircle, Edit2, Trash2, Calendar, Sparkles } from "lucide-react";
import ReminderTabs from "./ReminderTabs";
import { userUIStore } from "@/store/ui.store";
import { ReminderType } from "@/types/reminderType";

export default function ReminderList() {
    const { filter } = userUIStore();
    const { openModal, setSelectedReminder } = userUIStore();
    const { data: reminders, isLoading, isError } = useGetReminders();
    const { mutate: deleteReminder } = useDeleteReminder();

    if (isLoading) {
        return (
            <div className="flex flex-col justify-center items-center h-64 space-y-4">
                <div className="relative">
                    <div className="w-16 h-16 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <Clock className="w-6 h-6 text-amber-400" />
                    </div>
                </div>
                <p className="text-gray-400 font-medium animate-pulse">Loading your reminders...</p>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="m-6 bg-linear-to-r from-red-500/10 to-red-600/10 border border-red-500/30 text-red-300 px-6 py-4 rounded-2xl backdrop-blur-sm">
                <div className="flex items-center gap-3">
                    <AlertCircle className="w-6 h-6" />
                    <span className="font-medium">Error loading reminders. Please try again.</span>
                </div>
            </div>
        );
    }

    if (!reminders || reminders.length === 0) {
        return (
            <div className="text-center py-16 px-6">
                <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-linear-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 mb-6">
                    <Sparkles className="w-12 h-12 text-amber-400/60" />
                </div>
                <p className="text-gray-400 text-lg font-medium mb-2">No reminders yet</p>
                <p className="text-gray-500 text-sm">Create your first reminder to get started!</p>
            </div>
        );
    }

    //filter reminders based on selected filter
    const filteredReminders = reminders?.filter((reminder) => {
        if (filter === "all") return true;
        if (filter === "pending") return reminder.status === "PENDING";
        if (filter === "completed") return reminder.status === "COMPLETED";
        return true;
    }) || [];

    if (filteredReminders.length === 0) {
        return (
            <div className="space-y-6">
                <div>
                    <ReminderTabs />
                </div>
                <div className="text-center py-16 px-6">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-linear-to-br from-amber-500/10 to-orange-500/10 border border-amber-500/20 mb-4">
                        <Sparkles className="w-10 h-10 text-amber-400/60" />
                    </div>
                    <p className="text-gray-400 text-base font-medium">
                        No {filter === "all" ? "" : filter} reminders yet
                    </p>
                </div>
            </div>
        );
    }

    const getStatusIcon = (status: string) => {
        if (status === "COMPLETED") {
            return <CheckCircle className="w-5 h-5 text-emerald-400" />;
        }
        return <Clock className="w-5 h-5 text-amber-400" />;
    };

    const getStatusBadge = (status: string) => {
        return status === "COMPLETED"
            ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
            : "bg-amber-500/20 text-amber-300 border-amber-500/30";
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this reminder?")) {
            deleteReminder(id);
        }
    };

    const handleUpdate = (reminder: ReminderType) => {
        setSelectedReminder(reminder);
        openModal();
    };

    return (
        <div className="space-y-6 p-6">
            <div>
                <ReminderTabs />
            </div>
            
            <div className="grid gap-4">
                {filteredReminders.map((reminder, index) => {
                    const reminderDate = new Date(reminder.remindAt);
                    const istDate = new Date(reminderDate.getTime());
                    const isPast = reminderDate < new Date();
                    
                    return (
                        <div
                            key={reminder.id}
                            style={{ animationDelay: `${index * 50}ms` }}
                            className="group relative bg-linear-to-br from-gray-800/60 via-gray-800/40 to-gray-900/60 backdrop-blur-sm border border-amber-500/20 rounded-2xl p-6 hover:border-amber-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-amber-500/10 animate-fade-in"
                        >
                            {/* Status indicator line */}
                            <div className={`absolute left-0 top-0 bottom-0 w-1 rounded-l-2xl ${
                                reminder.status === "COMPLETED" ? "bg-emerald-500" : "bg-amber-500"
                            }`}></div>
                            
                            {/* Header */}
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex-1">
                                    <h3 className="text-xl font-bold text-gray-100 mb-1 group-hover:text-amber-300 transition-colors">
                                        {reminder.title}
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-relaxed">
                                        {reminder.body || "No description provided"}
                                    </p>
                                </div>
                                <div className="flex items-center gap-2 ml-4">
                                    {getStatusIcon(reminder.status)}
                                    <span
                                        className={`px-3 py-1.5 rounded-full text-xs font-semibold border ${getStatusBadge(
                                            reminder.status
                                        )}`}
                                    >
                                        {reminder.status}
                                    </span>
                                </div>
                            </div>

                            {/* Time Info */}
                            <div className="space-y-3 mb-5">
                                <div className="flex items-center gap-3 text-sm">
                                    <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/20 rounded-lg px-3 py-2">
                                        <Calendar className="w-4 h-4 text-amber-400" />
                                        <span className="text-gray-300 font-medium">
                                            {format(istDate, "MMM dd, yyyy • h:mm a")}
                                        </span>
                                    </div>
                                    {isPast && reminder.status !== "COMPLETED" && (
                                        <span className="text-red-400 text-xs font-medium px-2 py-1 bg-red-500/10 border border-red-500/20 rounded-lg">
                                            Overdue
                                        </span>
                                    )}
                                </div>
                                
                                <div className="text-xs text-gray-500">
                                    {formatDistanceToNow(reminderDate, { addSuffix: true })}
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-between items-center pt-4 border-t border-gray-700/50">
                                <div className="text-xs text-gray-500">
                                    Created {formatDistanceToNow(new Date(reminder.createdAt), { addSuffix: true })}
                                </div>
                                
                                <div className="flex gap-2">
                                    <button 
                                        onClick={() => handleUpdate(reminder)}
                                        className="group/btn flex items-center gap-2 bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 hover:border-blue-500/50 text-blue-300 px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105"
                                    >
                                        <Edit2 className="w-4 h-4" />
                                        <span className="font-medium text-sm">Edit</span>
                                    </button>
                                    
                                    <button
                                        onClick={() => handleDelete(reminder.id)}
                                        className="group/btn flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 hover:border-red-500/50 text-red-300 px-4 py-2 rounded-xl transition-all duration-200 hover:scale-105"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                        <span className="font-medium text-sm">Delete</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}