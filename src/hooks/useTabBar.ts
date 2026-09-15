"use client";

import { create } from "zustand";

export interface TemplateTab {
  id: string;
  name: string;
}

export interface TabBarStoreState {
  tabs: TemplateTab[];
  activeTabId: string;
  tabCounter: number;

  selectTab: (id: string) => void;
  addTab: () => void;
  closeTab: (id: string) => void;
}

export const useTabBar = create<TabBarStoreState>((set) => ({
  tabs: [
    { id: "new-template", name: "New-Template" },
    { id: "template-1", name: "Template-1" },
  ],
  activeTabId: "new-template",
  tabCounter: 2,

  selectTab: (id) => {
    set({ activeTabId: id });
  },

  addTab: () => {
    set((state) => {
      const newCounter = state.tabCounter + 1;
      const newId = `template-${newCounter}`;
      const newName = `Template-${newCounter}`;
      return {
        tabs: [...state.tabs, { id: newId, name: newName }],
        activeTabId: newId,
        tabCounter: newCounter,
      };
    });
  },

  closeTab: (id) => {
    set((state) => {
      if (state.tabs.length === 1) {
        const newCounter = state.tabCounter + 1;
        const freshId = `template-${newCounter}`;
        return {
          tabs: [{ id: freshId, name: "New-Template" }],
          activeTabId: freshId,
          tabCounter: newCounter,
        };
      }

      const newTabs = state.tabs.filter((t) => t.id !== id);
      let nextActiveId = state.activeTabId;

      if (state.activeTabId === id) {
        const closedIndex = state.tabs.findIndex((t) => t.id === id);
        const nextIndex = Math.max(0, closedIndex - 1);
        nextActiveId = newTabs[nextIndex]?.id || newTabs[0].id;
      }

      return {
        tabs: newTabs,
        activeTabId: nextActiveId,
      };
    });
  },
}));
