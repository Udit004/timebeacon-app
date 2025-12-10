import { create } from "zustand";

type UIState = {
    filter: "all" | "upcoming" | "completed";
    selFilter: (f: UIState["filter"]) => void;
    isModalOpen: boolean;
    openModal: () => void;
    closeModal: () => void;
};

export const userUIStore = create<UIState>((set) => ({
    filter: "all",
    selFilter: (f) => set({ filter: f }),
    isModalOpen: false,
    openModal: () => set({ isModalOpen: true}),
    closeModal: () => set({ isModalOpen: false}),
}));