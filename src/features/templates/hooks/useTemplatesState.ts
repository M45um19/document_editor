"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { SavedTemplateItem, TemplatesStoreState } from "../types";
import { DocumentStateSnapshot } from "@/features/editor/types";
import {
  INITIAL_TEMPLATE_DATA,
  DEFAULT_TEMPLATES_LIST,
  getFormattedTemplateDate,
  getLocalStorageTemplateData,
  setLocalStorageTemplateData,
  removeLocalStorageTemplateData,
} from "../utils/templateUtils";

export const useTemplatesState = create<TemplatesStoreState>()(
  persist(
    (set, get) => ({
      templates: DEFAULT_TEMPLATES_LIST,
      activeTemplateId: "template-1",
      tabCounter: 1,

      selectTemplate: (id) => {
        set({ activeTemplateId: id });
      },

      createTemplate: () => {
        const nextCounter = get().tabCounter + 1;
        const newId = `template-${nextCounter}`;
        const newName = `Template-${nextCounter}`;
        const formattedDate = getFormattedTemplateDate();

        const freshData: DocumentStateSnapshot = {
          metadata: {
            ...INITIAL_TEMPLATE_DATA.metadata,
            documentTitle: `VISUAL DOCUMENT ${nextCounter}`,
            documentNumber: `C-2026-06${nextCounter}`,
          },
          paperSize: "a4",
          pages: JSON.parse(JSON.stringify(INITIAL_TEMPLATE_DATA.pages)),
        };

        // Save new template data to its dedicated localStorage key
        setLocalStorageTemplateData(newId, freshData);

        const newTemplate: SavedTemplateItem = {
          id: newId,
          name: newName,
          savedAt: formattedDate,
        };

        set((state) => ({
          templates: [...state.templates, newTemplate],
          activeTemplateId: newId,
          tabCounter: nextCounter,
        }));

        return { newTemplate, data: freshData };
      },

      deleteTemplate: (id) => {
        const { templates, activeTemplateId, tabCounter } = get();

        // Remove dedicated localStorage slot
        removeLocalStorageTemplateData(id);

        if (templates.length <= 1) {
          const freshId = "template-1";
          const freshData = INITIAL_TEMPLATE_DATA;
          setLocalStorageTemplateData(freshId, freshData);
          const resetTemplate: SavedTemplateItem = {
            id: freshId,
            name: "Template-1",
            savedAt: "Fresh",
          };
          set({
            templates: [resetTemplate],
            activeTemplateId: freshId,
            tabCounter: Math.max(1, tabCounter),
          });
          return freshId;
        }

        const remaining = templates.filter((t) => t.id !== id);
        let nextActive = activeTemplateId;
        if (activeTemplateId === id) {
          const closedIndex = templates.findIndex((t) => t.id === id);
          const nextIndex = Math.max(0, closedIndex - 1);
          nextActive = remaining[nextIndex]?.id || remaining[0].id;
        }

        set({
          templates: remaining,
          activeTemplateId: nextActive,
        });

        return nextActive;
      },

      saveCurrentTemplate: (data) => {
        const activeId = get().activeTemplateId;
        const formattedDate = getFormattedTemplateDate();

        // Save data to its distinct localStorage place
        setLocalStorageTemplateData(activeId, data);

        let updatedTemplate: SavedTemplateItem | null = null;

        set((state) => {
          const updated = state.templates.map((t) => {
            if (t.id === activeId) {
              const res = { ...t, savedAt: formattedDate };
              updatedTemplate = res;
              return res;
            }
            return t;
          });
          return { templates: updated };
        });

        return (
          updatedTemplate || {
            id: activeId,
            name: "Current Template",
            savedAt: formattedDate,
          }
        );
      },

      getTemplateData: (id) => {
        return getLocalStorageTemplateData(id);
      },

      saveTemplateData: (id, data) => {
        setLocalStorageTemplateData(id, data);
      },
    }),
    {
      name: "document_editor_templates_list",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        templates: state.templates,
        activeTemplateId: state.activeTemplateId,
        tabCounter: state.tabCounter,
      }),
    }
  )
);
