import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { inngest } from "@/lib/inngest";

export async function POST(req: Request) {
    try {
        const { title, body: note, remindAt } = await req.json();

        if (!title || !remindAt) {
            return NextResponse.json(
                { error: "title and remindAt are required" },
                { status: 400 }
            );
        }

        // remindAt is already in UTC ISO format from frontend
        const reminder = await prisma.reminder.create({
            data: {
                title,
                body: note,
                remindAt: new Date(remindAt), // Store UTC in database
            }
        });

        console.log("Reminder created:", {
            id: reminder.id,
            remindAt: reminder.remindAt.toISOString()
        });

        // Send Inngest event with UTC time
        await inngest.send({
            name: "reminder/created",
            data: {
                id: reminder.id,
                remindAt: reminder.remindAt.toISOString(), // UTC ISO string
            }
        });

        return NextResponse.json(reminder);
    } catch (error) {
        console.error("Error creating reminder:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}

export async function GET() {
    try {
        const reminders = await prisma.reminder.findMany({
            orderBy: { remindAt: "asc" },
        });

        return NextResponse.json(reminders);
    } catch (error) {
        console.error("Error fetching reminders:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}