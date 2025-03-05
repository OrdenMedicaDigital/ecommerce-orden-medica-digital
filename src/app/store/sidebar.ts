"use client"
import { create } from "zustand";

interface Sidebar {
    open: boolean;
    toggle: () => void;
    isMobile: boolean;
    setIsMobile: (isMobile: boolean) => void;
}

export const useSidebarStore = create<Sidebar>((set) => ({
    open: false,
    toggle: () => set((state) => ({ open: !state.open })),
    isMobile: false,
    setIsMobile: (isMobile: boolean) => set({ isMobile})
}));