"use client";

import { useState } from "react";
import { useCreateReminder } from "@/hooks/UseReminderHook";
import type { CreateReminderInput } from "@/types/reminderType";

export default function AddReminderForm() {
    const [formData, setFormData] = useState<CreateReminderInput>({
        title: "",
        body: "",
        remindAt: ""
    });

    const [successMessage, setSuccessMessage] = useState("");
    const { mutate, isPending, isError, error } = useCreateReminder();

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
        
        // Input: "2025-12-10T21:51" (user wants this time in IST)
        // Force IST interpretation by appending IST offset manually
        
        // Create Date treating input as UTC first
        const dateString = formData.remindAt + ":00+05:30"; // Add IST offset
        const istDate = new Date(dateString);
        
        // Now convert to UTC
        const utcDateTime = istDate.toISOString();
        
        const dataToSend: CreateReminderInput = {
            ...formData,
            remindAt: utcDateTime
        };

        console.log("User Input (IST):", formData.remindAt);
        console.log("With IST offset:", dateString);
        console.log("Parsed Date:", istDate.toString());
        console.log("Converted to UTC:", utcDateTime);
        console.log("Verification IST:", new Date(utcDateTime).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }));

        mutate(dataToSend, {
            onSuccess: () => {
                setFormData({ title: "", body: "", remindAt: "" });
                setSuccessMessage("✅ Reminder added successfully!");
                setTimeout(() => setSuccessMessage(""), 3000);
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 border rounded max-w-md mx-auto">
            <div>
                <label className="block text-sm font-medium mb-1">Title</label>
                <input
                    type="text"
                    name="title"
                    placeholder="Reminder Title"
                    value={formData.title}
                    onChange={handleChange}
                    required
                    disabled={isPending}
                    className="w-full border px-3 py-2 rounded disabled:opacity-50"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Description</label>
                <textarea
                    name="body"
                    placeholder="Reminder Description"
                    value={formData.body}
                    onChange={handleChange}
                    disabled={isPending}
                    rows={3}
                    className="w-full border px-3 py-2 rounded disabled:opacity-50"
                />
            </div>

            <div>
                <label className="block text-sm font-medium mb-1">Date & Time</label>
                <input
                    type="datetime-local"
                    name="remindAt"
                    value={formData.remindAt}
                    onChange={handleChange}
                    required
                    disabled={isPending}
                    className="w-full border px-3 py-2 rounded disabled:opacity-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                    Select in your local time (IST)
                </p>
            </div>

            {successMessage && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded">
                    {successMessage}
                </div>
            )}

            {isError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded">
                    ❌ {error?.message || "Error creating reminder"}
                </div>
            )}

            <button
                type="submit"
                disabled={isPending}
                className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed font-medium"
            >
                {isPending ? "Adding..." : "Add Reminder"}
            </button>
        </form>
    );
}













