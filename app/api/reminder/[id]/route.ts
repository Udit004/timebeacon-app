import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type updateDatatype = {
    title?: string;
    body?: string;
    remindAt?: Date;
    status?: "PENDING" | "COMPLETED" | "CANCELLED";
};

export async function PUT(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        const body = await req.json();

        // ✅ Step 1: Check if reminder exists पहले
        const existingReminder = await prisma.reminder.findUnique({
            where: { id },
        });

        // ✅ Step 2: अगर exist नहीं करता तो 404 return करो
        if (!existingReminder) {
            return NextResponse.json(
                { error: "Reminder not found", reminderId: id },
                { status: 404 }  // ➕ Important!
            );
        }

        // Handle both full update and status-only update
        const updateData: updateDatatype = {};

        if (body.status) {
            updateData.status = body.status;
        }

        if (body.title) {
            updateData.title = body.title;
        }

        if (body.remindAt) {
            updateData.remindAt = new Date(body.remindAt);
        }

        if (body.body || body.note) {
            updateData.body = body.body || body.note;
        }

        // Check if there's anything to update
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json(
                { error: "No fields to update" },
                { status: 400 }
            );
        }

        const updateReminder = await prisma.reminder.update({
            where: { id },
            data: updateData,
        });

        console.log("✅ Reminder updated successfully:", updateReminder);
        return NextResponse.json(updateReminder);
    } catch (error) {
        console.error("❌ Error updating reminder:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}


export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    try {
        const { id } = await params;
        
        // ✅ Simply delete (no soft delete needed for local)
        const deleteReminder = await prisma.reminder.delete({
            where: { id },
        });
        
        console.log("🗑️ Reminder deleted successfully:", deleteReminder);
        return NextResponse.json({
            message: "Reminder deleted successfully",
            deletedReminder: deleteReminder
        });
    } catch (error) {
        console.error("❌ Error deleting reminder:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}