import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

type updateDatatype = {
    title?: string;
    body?: string;
    remindAt?: Date;
    status?: "PENDING" | "COMPLETED" | "CANCELLED";
};

export async function PUT (req: Request, { params }:{ params : { id: string }}) {
    try {
        const { id } = await params;
        const body = await req.json();
        
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
        
        console.log("Reminder updated successfully:", updateReminder);
        return NextResponse.json(updateReminder);
    } catch (error) {
        console.error("Error updating reminder:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}


export async function DELETE (req: Request, { params }: { params: { id: string}}) {
    try {
        const { id } = await params;
        const deleteReminder = await prisma.reminder.delete({
            where: { id },
        });
        console.log("Reminder deleted successfully:", deleteReminder);
        return NextResponse.json({
            message: "Reminder deleted successfully"
        })
    } catch (error) {
        console.error("Error deleting reminder:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}