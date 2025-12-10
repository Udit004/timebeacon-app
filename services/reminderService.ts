import { CreateReminderInput, ReminderType } from "@/types/reminderType";


const createReminderService = async (formData: CreateReminderInput): Promise<ReminderType> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/reminder`, {
            method: "POST",
            headers: {
                "content-type": "application/json",
            },
            body: JSON.stringify(formData),
        });

        if(!response.ok) {
            throw new Error("Failed to create reminder");
        }

        const data: ReminderType = await response.json();

        return data;
    } catch (error) {
        console.error("Error creating reminder:", error);
        throw error;
    }
}


const getAllReminders = async (): Promise<ReminderType[]> => {
    try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/api/reminder`, {
            method: "GET",
            headers: {
                "content-type": "application/json",
            },
        }); 
        if(!response.ok) {
            throw new Error("Failed to fetch reminders");
        }

        const data: ReminderType[] = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching reminders:", error);
        throw error;
    }
}

export { createReminderService, getAllReminders };