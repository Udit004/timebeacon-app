import { Reminder } from "@prisma/client";

export type ReminderType = {
    id: string;
    title: string;
    body: string;
    remindAt: string;
    status: "pending" | "completed" | "canceled";
    createdAt: string;
    updatedAt: string;
};

export type CreateReminderInput = {
    title: string;
    body: string;
    remindAt: string;
};

export type ReminderResponse = ReminderType[] | null;