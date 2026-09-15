"use client";

import { create } from "zustand";
import {
  TableRowItem,
  CanvasBlock,
  DocumentMetadata,
  CanvasPage,
  ToolType,
  DocumentStateSnapshot,
} from "../types";

export interface EditorStoreState {
  activeTemplateId: string;
  metadata: DocumentMetadata;
  pages: CanvasPage[];
  activePage: number;
  activeTool: ToolType;
  zoomLevel: string;
  isFullscreen: boolean;
  lastSavedAt: string | null;
  saveMessage: string | null;

  // Template management
  setActiveTemplateId: (id: string) => void;
  saveCurrentTemplate: (name?: string) => void;
  loadTemplate: (snapshot: DocumentStateSnapshot, templateId?: string) => void;
  resetToDefault: () => void;

  // Viewport & Tools Actions
  setActiveTool: (tool: ToolType) => void;
  setZoomLevel: (zoom: string) => void;
  toggleFullscreen: () => void;
  setActivePage: (pageNumber: number) => void;
  addPage: () => void;
  deletePage: (pageNumber: number) => void;

  // Component insertion with auto-pagination
  addElement: (type: "text" | "table" | "image" | "shape") => void;
  removeElement: (pageNumber: number, blockId: string) => void;

  // Content updates
  setMetadata: (updates: Partial<DocumentMetadata>) => void;
  updateTextBlock: (pageNumber: number, blockId: string, content: string) => void;
  updateTableRow: (
    pageNumber: number,
    blockId: string,
    rowId: number,
    field: keyof TableRowItem,
    value: string | number
  ) => void;
  addTableRow: (pageNumber: number, blockId: string) => void;
  deleteTableRow: (pageNumber: number, blockId: string, rowId?: number) => void;
}

export const INITIAL_METADATA: DocumentMetadata = {
  companyName: "Your Company",
  companyTagline: "Better Documents, Better Business",
  documentTitle: "VISUAL DOCUMENT",
  issuerDetails: "Issuer Details",
  clientDetails: "Client Details",
  documentNumber: "C-2026-061",
  documentDate: "2026-09-14",
};

export const INITIAL_TABLE_ROWS: TableRowItem[] = [
  { id: 1, item: "Product A", qty: 2, unitPrice: "$10.00", amount: "$20.00" },
  { id: 2, item: "Product B", qty: 3, unitPrice: "$10.00", amount: "$45.00" },
  { id: 3, item: "Product B", qty: 1, unitPrice: "$15.00", amount: "$45.00" },
  { id: 4, item: "Product C", qty: 1, unitPrice: "$50.00", amount: "$50.00" },
  { id: 5, item: "Product D", qty: 5, unitPrice: "$8.00", amount: "$40.00" },
];

export const INITIAL_BLOCKS: CanvasBlock[] = [
  {
    id: "initial-table-1",
    type: "table",
    title: "QUOTATION ITEMS",
    rows: INITIAL_TABLE_ROWS,
  },
];

// Estimated height weight per block type
const getBlockWeight = (block: CanvasBlock): number => {
  switch (block.type) {
    case "table":
      return Math.max(3, 1 + Math.ceil(block.rows.length / 2));
    case "image":
      return 2.5;
    case "text":
      return 1;
    case "shape":
      return 0.8;
    default:
      return 1;
  }
};

// Max capacity units per page sheet before auto-pagination
const MAX_PAGE_CAPACITY = 5.5;

const autoSaveToStorage = (templateId: string, metadata: DocumentMetadata, pages: CanvasPage[]) => {
  if (typeof window !== "undefined" && templateId) {
    try {
      const snapshot: DocumentStateSnapshot = { metadata, pages };
      localStorage.setItem(`doc_template_data_${templateId}`, JSON.stringify(snapshot));
    } catch (e) {
      console.error("Failed to auto-save to localStorage", e);
    }
  }
};

export const useEditorState = create<EditorStoreState>((set, get) => ({
  activeTemplateId: "template-1",
  metadata: INITIAL_METADATA,
  pages: [{ pageNumber: 1, blocks: INITIAL_BLOCKS }],
  activePage: 1,
  activeTool: "select",
  zoomLevel: "100%",
  isFullscreen: false,
  lastSavedAt: null,
  saveMessage: null,

  setActiveTemplateId: (activeTemplateId) => {
    set({ activeTemplateId });
  },

  setActiveTool: (activeTool) => {
    set({ activeTool });
    if (activeTool !== "select") {
      get().addElement(activeTool);
    }
  },

  setZoomLevel: (zoomLevel) => set({ zoomLevel }),
  toggleFullscreen: () => set((s) => ({ isFullscreen: !s.isFullscreen })),
  setActivePage: (activePage) => set({ activePage }),

  addPage: () => {
    set((state) => {
      const nextPageNum = state.pages.length + 1;
      const updatedPages = [...state.pages, { pageNumber: nextPageNum, blocks: [] }];
      autoSaveToStorage(state.activeTemplateId, state.metadata, updatedPages);
      return {
        pages: updatedPages,
        activePage: nextPageNum,
      };
    });
  },

  deletePage: (pageNumber) => {
    set((state) => {
      if (state.pages.length <= 1) return state;
      const remainingPages = state.pages
        .filter((p) => p.pageNumber !== pageNumber)
        .map((p, idx) => ({ ...p, pageNumber: idx + 1 }));
      const newActive = Math.min(state.activePage, remainingPages.length);
      autoSaveToStorage(state.activeTemplateId, state.metadata, remainingPages);
      return {
        pages: remainingPages,
        activePage: newActive,
      };
    });
  },

  saveCurrentTemplate: () => {
    const now = new Date();
    const formatted = `${now.toISOString().split("T")[0]} | ${now.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    })}`;

    const activeId = get().activeTemplateId;
    const snapshot: DocumentStateSnapshot = {
      metadata: get().metadata,
      pages: get().pages,
    };

    if (typeof window !== "undefined") {
      try {
        localStorage.setItem(`doc_template_data_${activeId}`, JSON.stringify(snapshot));
      } catch (e) {
        console.error("Failed to save template to localStorage", e);
      }
    }

    set({
      lastSavedAt: formatted,
      saveMessage: "Template saved to LocalStorage!",
    });

    setTimeout(() => {
      set({ saveMessage: null });
    }, 3000);
  },

  loadTemplate: (snapshot, templateId) => {
    if (!snapshot || !snapshot.pages || snapshot.pages.length === 0) return;
    set((state) => ({
      activeTemplateId: templateId || state.activeTemplateId,
      metadata: snapshot.metadata || INITIAL_METADATA,
      pages: snapshot.pages,
      activePage: 1,
      saveMessage: "Template loaded successfully!",
    }));
    setTimeout(() => {
      set({ saveMessage: null });
    }, 3000);
  },

  resetToDefault: () => {
    set((state) => {
      autoSaveToStorage(state.activeTemplateId, INITIAL_METADATA, [{ pageNumber: 1, blocks: INITIAL_BLOCKS }]);
      return {
        metadata: INITIAL_METADATA,
        pages: [{ pageNumber: 1, blocks: INITIAL_BLOCKS }],
        activePage: 1,
        saveMessage: "Reset to default template",
      };
    });
    setTimeout(() => {
      set({ saveMessage: null });
    }, 3000);
  },

  addElement: (type) => {
    set((state) => {
      const activeIdx = state.pages.findIndex((p) => p.pageNumber === state.activePage);
      const targetIdx = activeIdx >= 0 ? activeIdx : 0;
      const currentPage = state.pages[targetIdx];

      // Generate new block
      let newBlock: CanvasBlock;
      const blockId = `block-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

      if (type === "text") {
        newBlock = {
          id: blockId,
          type: "text",
          content: "Click to edit this new text block. You can write document notes, terms, or descriptions.",
          variant: "paragraph",
        };
      } else if (type === "table") {
        newBlock = {
          id: blockId,
          type: "table",
          title: "ADDITIONAL ITEMS",
          rows: [
            { id: 1, item: "New Item A", qty: 1, unitPrice: "$25.00", amount: "$25.00" },
            { id: 2, item: "New Item B", qty: 2, unitPrice: "$15.00", amount: "$30.00" },
          ],
        };
      } else if (type === "image") {
        newBlock = {
          id: blockId,
          type: "image",
          caption: "Uploaded Diagram / Reference Asset",
        };
      } else {
        newBlock = {
          id: blockId,
          type: "shape",
          shapeType: "divider",
        };
      }

      // Calculate current page weight
      const currentWeight = currentPage.blocks.reduce((acc, b) => acc + getBlockWeight(b), 0);
      const newWeight = getBlockWeight(newBlock);

      let updatedPages: CanvasPage[];
      let nextActivePage = state.activePage;

      // Auto-paginate if current page exceeds capacity
      if (currentWeight + newWeight > MAX_PAGE_CAPACITY) {
        const nextPageNum = state.pages.length + 1;
        const newPage: CanvasPage = {
          pageNumber: nextPageNum,
          blocks: [newBlock],
        };
        updatedPages = [...state.pages, newPage];
        nextActivePage = nextPageNum;
      } else {
        // Append to current page
        updatedPages = state.pages.map((page, idx) => {
          if (idx === targetIdx) {
            return {
              ...page,
              blocks: [...page.blocks, newBlock],
            };
          }
          return page;
        });
      }

      autoSaveToStorage(state.activeTemplateId, state.metadata, updatedPages);

      return {
        pages: updatedPages,
        activePage: nextActivePage,
        activeTool: "select",
      };
    });
  },

  removeElement: (pageNumber, blockId) => {
    set((state) => {
      const updatedPages = state.pages.map((p) => {
        if (p.pageNumber === pageNumber) {
          return {
            ...p,
            blocks: p.blocks.filter((b) => b.id !== blockId),
          };
        }
        return p;
      });
      autoSaveToStorage(state.activeTemplateId, state.metadata, updatedPages);
      return { pages: updatedPages };
    });
  },

  setMetadata: (updates) => {
    set((state) => {
      const updatedMetadata = { ...state.metadata, ...updates };
      autoSaveToStorage(state.activeTemplateId, updatedMetadata, state.pages);
      return { metadata: updatedMetadata };
    });
  },

  updateTextBlock: (pageNumber, blockId, content) => {
    set((state) => {
      const updatedPages = state.pages.map((p) => {
        if (p.pageNumber === pageNumber) {
          return {
            ...p,
            blocks: p.blocks.map((b) => {
              if (b.id === blockId && b.type === "text") {
                return { ...b, content };
              }
              return b;
            }),
          };
        }
        return p;
      });
      autoSaveToStorage(state.activeTemplateId, state.metadata, updatedPages);
      return { pages: updatedPages };
    });
  },

  updateTableRow: (pageNumber, blockId, rowId, field, value) => {
    set((state) => {
      const updatedPages = state.pages.map((p) => {
        if (p.pageNumber === pageNumber) {
          return {
            ...p,
            blocks: p.blocks.map((b) => {
              if (b.id === blockId && b.type === "table") {
                const rows = b.rows.map((row) => {
                  if (row.id === rowId) {
                    const updatedRow = { ...row, [field]: value };
                    if (field === "qty" || field === "unitPrice") {
                      const numericQty = Number(updatedRow.qty) || 0;
                      const numericPrice =
                        typeof updatedRow.unitPrice === "string"
                          ? parseFloat(updatedRow.unitPrice.replace(/[^0-9.-]+/g, "")) || 0
                          : Number(updatedRow.unitPrice) || 0;
                      updatedRow.amount = `$${(numericQty * numericPrice).toFixed(2)}`;
                    }
                    return updatedRow;
                  }
                  return row;
                });
                return { ...b, rows };
              }
              return b;
            }),
          };
        }
        return p;
      });
      autoSaveToStorage(state.activeTemplateId, state.metadata, updatedPages);
      return { pages: updatedPages };
    });
  },

  addTableRow: (pageNumber, blockId) => {
    set((state) => {
      const updatedPages = state.pages.map((p) => {
        if (p.pageNumber === pageNumber) {
          return {
            ...p,
            blocks: p.blocks.map((b) => {
              if (b.id === blockId && b.type === "table") {
                const nextId =
                  b.rows.length > 0 ? Math.max(...b.rows.map((r) => r.id)) + 1 : 1;
                const newRow: TableRowItem = {
                  id: nextId,
                  item: `Product ${String.fromCharCode(64 + (nextId > 26 ? 1 : nextId))}`,
                  qty: 1,
                  unitPrice: "$10.00",
                  amount: "$10.00",
                };
                return { ...b, rows: [...b.rows, newRow] };
              }
              return b;
            }),
          };
        }
        return p;
      });
      autoSaveToStorage(state.activeTemplateId, state.metadata, updatedPages);
      return { pages: updatedPages };
    });
  },

  deleteTableRow: (pageNumber, blockId, rowId) => {
    set((state) => {
      const updatedPages = state.pages.map((p) => {
        if (p.pageNumber === pageNumber) {
          return {
            ...p,
            blocks: p.blocks.map((b) => {
              if (b.id === blockId && b.type === "table") {
                if (b.rows.length <= 1) return b;
                const targetId = rowId ?? b.rows[b.rows.length - 1].id;
                return { ...b, rows: b.rows.filter((r) => r.id !== targetId) };
              }
              return b;
            }),
          };
        }
        return p;
      });
      autoSaveToStorage(state.activeTemplateId, state.metadata, updatedPages);
      return { pages: updatedPages };
    });
  },
}));
