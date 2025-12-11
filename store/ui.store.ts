import { create } from "zustand";

type UIState = {
    filter: "all" | "pending" | "completed";
    selFilter: (f: UIState["filter"]) => void;
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
};

export const userUIStore = create<UIState>((set) => ({
    filter: "pending",
    selFilter: (f) => set({ filter: f }),
    isModalOpen: false,
    openModal: () => set({ isModalOpen: true}),
    closeModal: () => set({ isModalOpen: false}),
}));