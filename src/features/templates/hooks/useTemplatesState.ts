"use client";

import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { SavedTemplateItem } from "../types";
import { DocumentStateSnapshot } from "@/features/editor/types";

export const INITIAL_TEMPLATE_DATA: DocumentStateSnapshot = {
  metadata: {
    companyName: "Your Company",
    companyTagline: "Better Documents, Better Business",
    documentTitle: "VISUAL DOCUMENT",
    issuerDetails: "Issuer Details",
    clientDetails: "Client Details",
    documentNumber: "C-2026-061",
    documentDate: "2026-09-14",
  },
  pages: [
    {
      pageNumber: 1,
      layoutRows: [
        {
          id: "page-row-meta",
          marginTop: 0,
          marginBottom: 16,
          paddingTop: 6,
          paddingBottom: 6,
          columns: [
            {
              id: "col-meta-issuer",
              blocks: [
                {
                  id: "meta-block-issuer",
                  type: "text",
                  content: "ISSUER/\nIssuer Details",
                  fontFamily: "Inter",
                  fontSize: 13,
                  fontWeight: "600",
                  color: "#1e293b",
                  align: "left",
                },
              ],
            },
            {
              id: "col-meta-client",
              blocks: [
                {
                  id: "meta-block-client",
                  type: "text",
                  content: "Client Details",
                  fontFamily: "Inter",
                  fontSize: 13,
                  fontWeight: "600",
                  color: "#1e293b",
                  align: "left",
                },
              ],
            },
            {
              id: "col-meta-nodate",
              blocks: [
                {
                  id: "meta-block-nodate",
                  type: "text",
                  content: "No/Date:  C-2026-061\n2026-09-14",
                  fontFamily: "Inter",
                  fontSize: 13,
                  fontWeight: "600",
                  color: "#1e293b",
                  align: "right",
                },
              ],
            },
          ],
        },
        {
          id: "page-row-table",
          marginTop: 0,
          marginBottom: 16,
          paddingTop: 6,
          paddingBottom: 6,
          columns: [
            {
              id: "col-table-main",
              blocks: [
                {
                  id: "initial-table-1",
                  type: "table",
                  title: "QUOTATION ITEMS",
                  tableWidth: "100%",
                  borderStyle: "1px solid #E5E7EB",
                  padding: 8,
                  rowSpacing: 0,
                  rows: [
                    { id: 1, item: "Product A", qty: 2, unitPrice: "$10.00", amount: "$20.00" },
                    { id: 2, item: "Product B", qty: 3, unitPrice: "$10.00", amount: "$45.00" },
                    { id: 3, item: "Product B", qty: 1, unitPrice: "$15.00", amount: "$45.00" },
                    { id: 4, item: "Product C", qty: 1, unitPrice: "$50.00", amount: "$50.00" },
                    { id: 5, item: "Product D", qty: 5, unitPrice: "$8.00", amount: "$40.00" },
                  ],
                },
              ],
            },
          ],
        },
      ],
      blocks: [
        {
          id: "meta-block-issuer",
          type: "text",
          content: "ISSUER/\nIssuer Details",
          fontFamily: "Inter",
          fontSize: 13,
          fontWeight: "600",
          color: "#1e293b",
          align: "left",
        },
        {
          id: "meta-block-client",
          type: "text",
          content: "Client Details",
          fontFamily: "Inter",
          fontSize: 13,
          fontWeight: "600",
          color: "#1e293b",
          align: "left",
        },
        {
          id: "meta-block-nodate",
          type: "text",
          content: "No/Date:  C-2026-061\n2026-09-14",
          fontFamily: "Inter",
          fontSize: 13,
          fontWeight: "600",
          color: "#1e293b",
          align: "right",
        },
        {
          id: "initial-table-1",
          type: "table",
          title: "QUOTATION ITEMS",
          tableWidth: "100%",
          borderStyle: "1px solid #E5E7EB",
          padding: 8,
          rowSpacing: 0,
          rows: [
            { id: 1, item: "Product A", qty: 2, unitPrice: "$10.00", amount: "$20.00" },
            { id: 2, item: "Product B", qty: 3, unitPrice: "$10.00", amount: "$45.00" },
            { id: 3, item: "Product B", qty: 1, unitPrice: "$15.00", amount: "$45.00" },
            { id: 4, item: "Product C", qty: 1, unitPrice: "$50.00", amount: "$50.00" },
            { id: 5, item: "Product D", qty: 5, unitPrice: "$8.00", amount: "$40.00" },
          ],
        },
      ],
    },
  ],
};

const DEFAULT_TEMPLATES_LIST: SavedTemplateItem[] = [
  {
    id: "template-1",
    name: "Template-1",
    savedAt: "2026-09-15 | 10:00 AM",
  },
];

export interface TemplatesStoreState {
  templates: SavedTemplateItem[];
  activeTemplateId: string;
  tabCounter: number;

  selectTemplate: (id: string) => void;
  createTemplate: () => { newTemplate: SavedTemplateItem; data: DocumentStateSnapshot };
  deleteTemplate: (id: string) => string;
  saveCurrentTemplate: (data: DocumentStateSnapshot) => SavedTemplateItem;
  getTemplateData: (id: string) => DocumentStateSnapshot;
  saveTemplateData: (id: string, data: DocumentStateSnapshot) => void;
}

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

        const now = new Date();
        const formattedDate = `${now.toISOString().split("T")[0]} | ${now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`;

        const freshData: DocumentStateSnapshot = {
          metadata: {
            ...INITIAL_TEMPLATE_DATA.metadata,
            documentTitle: `VISUAL DOCUMENT ${nextCounter}`,
            documentNumber: `C-2026-06${nextCounter}`,
          },
          pages: JSON.parse(JSON.stringify(INITIAL_TEMPLATE_DATA.pages)),
        };

        // Save new template data to its dedicated localStorage key
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(`doc_template_data_${newId}`, JSON.stringify(freshData));
          } catch (e) {
            console.error("Failed to save new template to localStorage", e);
          }
        }

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
        if (typeof window !== "undefined") {
          try {
            localStorage.removeItem(`doc_template_data_${id}`);
          } catch (e) {
            console.error("Failed to delete template from localStorage", e);
          }
        }

        if (templates.length <= 1) {
          const freshId = "template-1";
          const freshData = INITIAL_TEMPLATE_DATA;
          if (typeof window !== "undefined") {
            try {
              localStorage.setItem(`doc_template_data_${freshId}`, JSON.stringify(freshData));
            } catch (e) {
              console.error("Failed to reset template in localStorage", e);
            }
          }
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
        const now = new Date();
        const formattedDate = `${now.toISOString().split("T")[0]} | ${now.toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        })}`;

        // Save data to its distinct localStorage place
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(`doc_template_data_${activeId}`, JSON.stringify(data));
          } catch (e) {
            console.error("Failed to save template data to localStorage", e);
          }
        }

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
        if (typeof window !== "undefined") {
          try {
            const raw = localStorage.getItem(`doc_template_data_${id}`);
            if (raw) {
              return JSON.parse(raw);
            }
          } catch (e) {
            console.error("Failed to load template data from localStorage", e);
          }
        }
        return INITIAL_TEMPLATE_DATA;
      },

      saveTemplateData: (id, data) => {
        if (typeof window !== "undefined") {
          try {
            localStorage.setItem(`doc_template_data_${id}`, JSON.stringify(data));
          } catch (e) {
            console.error("Failed to auto-save template data", e);
          }
        }
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
