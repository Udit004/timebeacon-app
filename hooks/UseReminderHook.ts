import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createReminderService, deleteReminderService, getAllReminders, updateReminderService } from "@/services/reminderService";
import type { CreateReminderInput, ReminderType } from "@/types/reminderType";


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


//* update a reminder by id
export const useUpdateReminder = () => {
    const queryClient = useQueryClient();
    
    return useMutation({
        mutationFn: ({ id, updateData }: { id: string; updateData: Partial<CreateReminderInput> }) => 
            updateReminderService(id, updateData),  // server ko updated data bhejo
        
        onSuccess: (updatedReminder: ReminderType) => {
            // Cache ko update karo
            queryClient.setQueryData(
                ["reminders"],
                (oldData: ReminderType[] | undefined) => {
                    return oldData 
                        ? oldData.map((reminder) => 
                            reminder.id === updatedReminder.id 
                                ? updatedReminder      // Updated wala replace karo
                                : reminder             // Baaki same rakho
                        )
                        : [updatedReminder];
                }
            );
            
            // Server se fresh data
            queryClient.invalidateQueries({ queryKey: ["reminders"] });
        },
        
        onError: (error) => {
            console.error("Error in useUpdateReminder mutation:", error);
        },
    });
};



//* hook to delete a reminder by id

export const useDeleteReminder = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: deleteReminderService,
        onSuccess: (_, id: string) => {
            queryClient.setQueryData(
                ["reminders"],
                (oldData: ReminderType[] | undefined) => {
                    return oldData ? oldData.filter((reminder) => reminder.id !== id) : [];
                }
            )
            queryClient.invalidateQueries({ queryKey: ["reminders"] });
        },

        onError: (error) => {
            console.error("Error in useDeleteReminder mutation:", error);
        }
    })
}