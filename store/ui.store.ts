import { create } from "zustand";
import type { ReminderType } from "@/types/reminderType";

interface UIStore {
    filter: "pending" | "completed" | "all";
    isModalOpen: boolean;
    selectedReminder: ReminderType | null; 

    setFilter: (newFilter: "pending" | "completed" | "all") => void;
    openModal: () => void;
    closeModal: () => void;
    setSelectedReminder: (reminder: ReminderType | null) => void;  // ➕ Add this
}

export const userUIStore = create<UIStore>((set) => ({
    filter: "pending",
    setFilter: (newFilter) => set({ filter: newFilter }),
    isModalOpen: false,
    selectedReminder: null, 
    
    openModal: () => set({ isModalOpen: true }),
    closeModal: () => set({ isModalOpen: false, selectedReminder: null }),  // ➕ Reset reminder too
    
    setSelectedReminder: (reminder) => set({ selectedReminder: reminder }),  // ➕ New action
}));