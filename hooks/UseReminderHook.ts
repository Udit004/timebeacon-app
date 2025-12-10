import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createReminderService, getAllReminders } from "@/services/reminderService";
import type { ReminderType, CreateReminderInput } from "@/types/reminderType";
import { Reminder } from "@prisma/client";

//* hook to fetch all reminders 
export const useGetReminders = () => {
    return useQuery({
        queryKey: ["reminders"],
        queryFn: getAllReminders,
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchInterval: 1000 * 60 * 1, //1 minute
        refetchIntervalInBackground: true, // continue refetching even when tab is inactive
    });
}


//* hook to create a new reminder
export const useCreateReminder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: createReminderService,
        onSuccess: (newReminder: ReminderType) => {
            queryClient.setQueryData(
                ["reminders"],
                (oldData: ReminderType[] | undefined) => {
                    return oldData ? [...oldData, newReminder] : [newReminder];
                }
            );

            queryClient.invalidateQueries({ queryKey: ["reminders"] });
        },
        onError: (error) => {
            console.error("Error in useCreateReminder mutation:", error);
        },
    });
};