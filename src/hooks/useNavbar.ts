"use client";

import { create } from "zustand";

export interface NavbarStoreState {
  isToolboxOpen: boolean;
  toggleToolbox: () => void;
  setToolboxOpen: (isOpen: boolean) => void;
  scrollToProperties: () => void;
  isPreviewOpen: boolean;
  openPreview: () => void;
  closePreview: () => void;
  togglePreview: () => void;
}

export const useNavbar = create<NavbarStoreState>((set) => ({
  isToolboxOpen: false,
  isPreviewOpen: false,

  toggleToolbox: () => set((state) => ({ isToolboxOpen: !state.isToolboxOpen })),
  setToolboxOpen: (isToolboxOpen) => set({ isToolboxOpen }),

  openPreview: () => set({ isPreviewOpen: true }),
  closePreview: () => set({ isPreviewOpen: false }),
  togglePreview: () => set((state) => ({ isPreviewOpen: !state.isPreviewOpen })),

  scrollToProperties: () => {
    if (typeof document !== "undefined") {
      const el = document.getElementById("properties-panel");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  },
}));
