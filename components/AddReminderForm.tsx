"use client";

import { useState } from "react";
import { useCreateReminder, useUpdateReminder } from "@/hooks/UseReminderHook";
import type { CreateReminderInput, ReminderType } from "@/types/reminderType";
import { userUIStore } from "@/store/ui.store";

interface AddReminderFormProps {
    reminder?: ReminderType; // Optional - agar pass ho to EDIT mode
}

export default function AddReminderForm({ reminder }: AddReminderFormProps) {
    const [formData, setFormData] = useState<CreateReminderInput>(() => {
        if (reminder) {
            // Server se UTC aaya hoga, user ko IST mein dikhana hai
            // Convert UTC to IST format (datetime-local expects YYYY-MM-DDTHH:mm)
            const istDate = new Date(reminder.remindAt).toLocaleString('en-CA', {
                timeZone: 'Asia/Kolkata',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            }).replace(' ', 'T');

            return {
                title: reminder.title,
                body: reminder.body,
                remindAt: istDate
            };
        }
        return {
            title: "",
            body: "",
            remindAt: ""
        };
    });

    const [successMessage, setSuccessMessage] = useState("");
    const createMutation = useCreateReminder();
    const updateMutation = useUpdateReminder();
    const { closeModal } = userUIStore();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        if (!formData.remindAt) {
            alert("Please select a date and time");
            return;
        }
        
        // IST ko UTC mein convert karo
        const dateString = formData.remindAt + ":00+05:30";
        const istDate = new Date(dateString);
        const utcDateTime = istDate.toISOString();
        
        const dataToSend: CreateReminderInput = {
            ...formData,
            remindAt: utcDateTime
        };

        console.log("User Input (IST):", formData.remindAt);
        console.log("Converted to UTC:", utcDateTime);

        // CREATE mode
        if (!reminder) {
            createMutation.mutate(dataToSend, {
                onSuccess: () => {
                    setFormData({ title: "", body: "", remindAt: "" });
                    setSuccessMessage("✅ Reminder added successfully!");
                    setTimeout(() => {
                        setSuccessMessage("");
                        closeModal();
                    }, 2000);
                }
            });
        }
        // UPDATE mode
        else {
            updateMutation.mutate(
                {
                    id: reminder.id,
                    updateData: dataToSend
                },
                {
                    onSuccess: () => {
                        setSuccessMessage("✅ Reminder updated successfully!");
                        setTimeout(() => {
                            setSuccessMessage("");
                            closeModal();
                        }, 2000);
                    }
                }
            );
        }
    };

    // Kaunsa loading state use karein
    const isPending = createMutation.isPending || updateMutation.isPending;
    const isError = createMutation.isError || updateMutation.isError;
    const error = createMutation.error || updateMutation.error;

    return (
        <>
            {/* Backdrop overlay */}
            <div
                className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 animate-fade-in"
                onClick={closeModal}
            />

            {/* Modal container */}
            <div className="fixed inset-0 flex items-center justify-center z-50 p-4 animate-modal-slide-up">
                <div className="bg-gradient-to-br from-gray-900/95 via-gray-800/95 to-gray-900/95 backdrop-blur-xl rounded-3xl border border-amber-500/30 shadow-2xl shadow-amber-500/20 max-w-lg w-full p-8 relative">
                    {/* Decorative gradient orb */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-orange-500/20 rounded-full blur-3xl"></div>
                    
                    {/* Close button */}
                    <button
                        onClick={closeModal}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white transition-colors group"
                    >
                        <div className="bg-gray-800/50 hover:bg-red-500/20 border border-gray-700 hover:border-red-500/50 p-2 rounded-xl transition-all">
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </div>
                    </button>

                    {/* Heading - Dynamic based on mode */}
                    <div className="mb-6">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 flex items-center justify-center">
                                {reminder ? "✏️" : "➕"}
                            </div>
                            <h2 className="text-2xl font-bold text-gray-100">
                                {reminder ? "Edit Reminder" : "Create New Reminder"}
                            </h2>
                        </div>
                        <p className="text-gray-400 text-sm ml-13">
                            {reminder ? "Update your reminder details" : "Set up a new reminder to stay on track"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-300">Title</label>
                            <input
                                type="text"
                                name="title"
                                placeholder="e.g., Team meeting, Doctor appointment"
                                value={formData.title}
                                onChange={handleChange}
                                required
                                disabled={isPending}
                                className="w-full bg-gray-800/50 border border-gray-700 focus:border-amber-500/50 text-gray-100 placeholder-gray-500 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:opacity-50 transition-all"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-300">Description</label>
                            <textarea
                                name="body"
                                placeholder="Add more details about this reminder..."
                                value={formData.body}
                                onChange={handleChange}
                                disabled={isPending}
                                rows={3}
                                className="w-full bg-gray-800/50 border border-gray-700 focus:border-amber-500/50 text-gray-100 placeholder-gray-500 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:opacity-50 transition-all resize-none"
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="block text-sm font-semibold text-gray-300">Date & Time</label>
                            <input
                                type="datetime-local"
                                name="remindAt"
                                value={formData.remindAt}
                                onChange={handleChange}
                                required
                                disabled={isPending}
                                className="w-full bg-gray-800/50 border border-gray-700 focus:border-amber-500/50 text-gray-100 px-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 disabled:opacity-50 transition-all"
                            />
                            <p className="text-xs text-gray-500 flex items-center gap-1">
                                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                </svg>
                                Select in your local time (IST)
                            </p>
                        </div>

                        {successMessage && (
                            <div className="bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 px-4 py-3 rounded-xl flex items-center gap-2 animate-fade-in">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                </svg>
                                {successMessage}
                            </div>
                        )}

                        {isError && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-300 px-4 py-3 rounded-xl flex items-center gap-2 animate-fade-in">
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                </svg>
                                {error?.message || "Error processing reminder"}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 hover:from-amber-600 hover:via-orange-600 hover:to-amber-700 text-white font-bold py-4 rounded-xl border border-amber-400/50 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 hover:scale-[1.02] disabled:hover:scale-100"
                        >
                            {isPending 
                                ? (
                                    <span className="flex items-center justify-center gap-2">
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </span>
                                )
                                : reminder 
                                    ? "Update Reminder ✏️" 
                                    : "Create Reminder ➕"
                            }
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
}













