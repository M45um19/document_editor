"use client";

import { create } from "zustand";

export interface NavbarStoreState {
  isToolboxOpen: boolean;
  toggleToolbox: () => void;
  setToolboxOpen: (isOpen: boolean) => void;
  scrollToProperties: () => void;
}

export const useNavbar = create<NavbarStoreState>((set) => ({
  isToolboxOpen: false,

  toggleToolbox: () => set((state) => ({ isToolboxOpen: !state.isToolboxOpen })),

  setToolboxOpen: (isToolboxOpen) => set({ isToolboxOpen }),

  scrollToProperties: () => {
    if (typeof document !== "undefined") {
      const el = document.getElementById("properties-panel");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  },
}));
