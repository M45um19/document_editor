"use client";

import { create } from "zustand";
import { arrayMove } from "@dnd-kit/sortable";
import {
  TableRowItem,
  CanvasBlock,
  DocumentMetadata,
  CanvasPage,
  ToolType,
  DocumentStateSnapshot,
  BlockTypographyStyle,
  TableColumn,
  SelectedCellLocation,
  PageGridRow,
  PageGridColumn,
  DEFAULT_TABLE_COLUMNS,
  TableBlock,
  ImageBlock,
  ShapeBlock,
  TableStyleSettings,
  BlockUpdatePayload,
  PaperSize,
  PAPER_SIZES,
  EditorStoreState,
} from "../types";
import {
  INITIAL_METADATA,
  INITIAL_TABLE_ROWS,
  INITIAL_PAGE_ROWS,
  INITIAL_BLOCKS,
  extractAllBlocksFromRows,
  getPageLayoutRows,
  getPageCapacity,
  getTableOverheadHeight,
  getTableRowHeight,
  getBlockHeight,
  getBlockWeight,
  getColumnHeight,
  getColumnWeight,
  getRowHeight,
  getRowWeight,
  isMatchingTableBlock,
  reflowPages,
} from "../utils/paginationUtils";

export {
  INITIAL_METADATA,
  INITIAL_TABLE_ROWS,
  INITIAL_PAGE_ROWS,
  INITIAL_BLOCKS,
  extractAllBlocksFromRows,
  getPageLayoutRows,
  getPageCapacity,
  getTableOverheadHeight,
  getTableRowHeight,
  getBlockHeight,
  getBlockWeight,
  getColumnHeight,
  getColumnWeight,
  getRowHeight,
  getRowWeight,
  isMatchingTableBlock,
  reflowPages,
};

const autoSaveToStorage = (
  templateId: string,
  metadata: DocumentMetadata,
  pages: CanvasPage[],
  paperSize?: PaperSize
) => {
  if (typeof window !== "undefined" && templateId) {
    try {
      const effectivePaperSize =
        paperSize ||
        (typeof useEditorState !== "undefined" && useEditorState.getState
          ? useEditorState.getState().paperSize
          : "tabloid") ||
        "tabloid";
      const snapshot: DocumentStateSnapshot = {
        metadata,
        pages,
        paperSize: effectivePaperSize,
      };
      localStorage.setItem(`doc_template_data_${templateId}`, JSON.stringify(snapshot));
    } catch (e) {
      console.error("Failed to auto-save to localStorage", e);
    }
  }
};

export const useEditorState = create<EditorStoreState>((set, get) => ({
  activeTemplateId: "template-1",
  selectedBlockId: null,
  selectedCell: null,
  selectedRowId: "page-row-header",
  selectedColumnId: "col-header-company",
  metadata: INITIAL_METADATA,
  paperSize: "tabloid",
  pages: [
    {
      pageNumber: 1,
      layoutRows: INITIAL_PAGE_ROWS,
      blocks: INITIAL_BLOCKS,
    },
  ],
  activePage: 1,
  activeTool: "select",
  zoomLevel: "100%",
  isFullscreen: false,
  lastSavedAt: null,
  saveMessage: null,

  setActiveTemplateId: (activeTemplateId) => {
    set({ activeTemplateId });
  },

  setSelectedBlockId: (selectedBlockId) => {
    set((state) => ({
      selectedBlockId,
      selectedCell:
        state.selectedCell && state.selectedCell.blockId === selectedBlockId
          ? state.selectedCell
          : null,
    }));
  },

  setSelectedCell: (selectedCell) => {
    set((state) => ({
      selectedCell,
      selectedBlockId: selectedCell ? selectedCell.blockId : state.selectedBlockId,
    }));
  },

  setSelectedRowId: (selectedRowId) => {
    set({ selectedRowId });
  },

  setSelectedColumnId: (selectedColumnId) => {
    set({ selectedColumnId });
  },

  setActiveTool: (activeTool) => {
    set({ activeTool });
    if (activeTool !== "select") {
      get().addElement(activeTool);
    }
  },

  setZoomLevel: (zoomLevel) => set({ zoomLevel }),
  setPaperSize: (paperSize: PaperSize) => {
    set((state) => {
      const reflowed = reflowPages(state.pages, paperSize);
      autoSaveToStorage(state.activeTemplateId, state.metadata, reflowed, paperSize);
      return {
        paperSize,
        pages: reflowed,
        activePage: Math.min(state.activePage, reflowed.length),
      };
    });
  },
  toggleFullscreen: () => set((s) => ({ isFullscreen: !s.isFullscreen })),
  setActivePage: (pageNumber) => set({ activePage: pageNumber }),

  addPage: () => {
    set((state) => {
      const nextPageNum = state.pages.length + 1;
      const newRowId = `row-${Date.now()}-1`;
      const newColId = `col-${Date.now()}-1`;
      const newRow: PageGridRow = {
        id: newRowId,
        columns: [{ id: newColId, blocks: [] }],
        pageBreakBefore: true,
        marginTop: 0,
        marginBottom: 12,
        paddingTop: 0,
        paddingBottom: 0,
      };
      const newPage: CanvasPage = {
        pageNumber: nextPageNum,
        layoutRows: [newRow],
        blocks: [],
      };
      const updatedPages = [...state.pages, newPage];
      const reflowed = reflowPages(updatedPages);
      autoSaveToStorage(state.activeTemplateId, state.metadata, reflowed);
      return {
        pages: reflowed,
        activePage: reflowed.length,
        selectedRowId: newRowId,
        selectedColumnId: newColId,
        selectedBlockId: null,
        selectedCell: null,
      };
    });
  },

  deletePage: (pageNumber) => {
    set((state) => {
      if (state.pages.length <= 1) return state;
      const remainingPages = state.pages
        .filter((p) => p.pageNumber !== pageNumber)
        .map((p, idx) => ({ ...p, pageNumber: idx + 1 }));
      const reflowed = reflowPages(remainingPages);
      const newActive = Math.min(state.activePage, reflowed.length);
      autoSaveToStorage(state.activeTemplateId, state.metadata, reflowed);
      return {
        pages: reflowed,
        activePage: newActive,
      };
    });
  },

  addPageRow: (pageNumber) => {
    set((state) => {
      const newRowId = `row-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const newColId = `col-${Date.now()}-1`;
      const newRow: PageGridRow = {
        id: newRowId,
        columns: [{ id: newColId, blocks: [] }],
        marginTop: 0,
        marginBottom: 16,
        paddingTop: 6,
        paddingBottom: 6,
      };

      const targetPageNum = pageNumber || state.activePage;
      const targetIdx = state.pages.findIndex((p) => p.pageNumber === targetPageNum);
      const pageIdx = targetIdx >= 0 ? targetIdx : state.pages.length - 1;

      const updatedPages = state.pages.map((p, idx) => {
        if (idx === pageIdx) {
          const currentRows = getPageLayoutRows(p);
          const updatedRows = [...currentRows, newRow];
          return {
            ...p,
            layoutRows: updatedRows,
            blocks: extractAllBlocksFromRows(updatedRows),
          };
        }
        return p;
      });

      const reflowed = reflowPages(updatedPages);
      autoSaveToStorage(state.activeTemplateId, state.metadata, reflowed);
      return {
        pages: reflowed,
        activePage: Math.min(state.activePage, reflowed.length),
        selectedRowId: newRowId,
        selectedColumnId: newColId,
      };
    });
  },

  deletePageRow: (pageNumber, rowId) => {
    set((state) => {
      const targetId = rowId || state.selectedRowId;
      if (!targetId) return state;

      let totalRows = 0;
      state.pages.forEach((p) => {
        totalRows += getPageLayoutRows(p).length;
      });
      if (totalRows <= 1) return state;

      const updatedPages = state.pages.map((p) => {
        const currentRows = getPageLayoutRows(p);
        const updatedRows = currentRows.filter((r) => r.id !== targetId);
        return {
          ...p,
          layoutRows: updatedRows,
          blocks: extractAllBlocksFromRows(updatedRows),
        };
      });

      const reflowed = reflowPages(updatedPages);
      autoSaveToStorage(state.activeTemplateId, state.metadata, reflowed);
      return {
        pages: reflowed,
        activePage: Math.min(state.activePage, reflowed.length),
        selectedRowId: null,
        selectedColumnId: null,
      };
    });
  },

  addPageColumn: (pageNumber, rowId) => {
    set((state) => {
      const targetRowId = rowId || state.selectedRowId;
      const newColId = `col-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

      const updatedPages = state.pages.map((p) => {
        const currentRows = getPageLayoutRows(p);
        const updatedRows = currentRows.map((r) => {
          if (r.id === targetRowId || (!targetRowId && currentRows[0]?.id === r.id)) {
            const newTotalCount = r.columns.length + 1;
            const equalWidth = Math.round((100 / newTotalCount) * 10) / 10;
            const existingRebalanced = r.columns.map((c) => ({ ...c, width: equalWidth }));
            const newCol: PageGridColumn = { id: newColId, blocks: [], width: equalWidth };
            return {
              ...r,
              columns: [...existingRebalanced, newCol],
            };
          }
          return r;
        });
        return {
          ...p,
          layoutRows: updatedRows,
          blocks: extractAllBlocksFromRows(updatedRows),
        };
      });

      const reflowed = reflowPages(updatedPages);
      autoSaveToStorage(state.activeTemplateId, state.metadata, reflowed);
      return {
        pages: reflowed,
        activePage: Math.min(state.activePage, reflowed.length),
        selectedColumnId: newColId,
      };
    });
  },

  deletePageColumn: (pageNumber, rowId, columnId) => {
    set((state) => {
      const targetRowId = rowId || state.selectedRowId;

      const updatedPages = state.pages.map((p) => {
        const currentRows = getPageLayoutRows(p);
        const updatedRows = currentRows.map((r) => {
          if (r.id === targetRowId || (!targetRowId && currentRows[0]?.id === r.id)) {
            if (r.columns.length <= 1) return r;
            const targetColId =
              columnId || state.selectedColumnId || r.columns[r.columns.length - 1].id;
            const remaining = r.columns.filter((c) => c.id !== targetColId);
            const totalWidth = remaining.reduce((sum, c) => sum + (c.width || 0), 0);
            const rebalanced = remaining.map((c) => ({
              ...c,
              width:
                totalWidth > 0
                  ? Math.round(((c.width || 100 / remaining.length) / totalWidth) * 1000) / 10
                  : Math.round((100 / remaining.length) * 10) / 10,
            }));
            return {
              ...r,
              columns: rebalanced,
            };
          }
          return r;
        });
        return {
          ...p,
          layoutRows: updatedRows,
          blocks: extractAllBlocksFromRows(updatedRows),
        };
      });

      const reflowed = reflowPages(updatedPages);
      autoSaveToStorage(state.activeTemplateId, state.metadata, reflowed);
      return { pages: reflowed, activePage: Math.min(state.activePage, reflowed.length) };
    });
  },

  updateRowColumnWidths: (pageNumber, rowId, columnWidths) => {
    set((state) => {
      const widthMap = new Map(columnWidths.map((cw) => [cw.id, cw.width]));
      const updatedPages = state.pages.map((p) => {
        const currentRows = getPageLayoutRows(p);
        const updatedRows = currentRows.map((r) => {
          if (r.id === rowId) {
            const updatedCols = r.columns.map((col) => {
              if (widthMap.has(col.id)) {
                return { ...col, width: widthMap.get(col.id) };
              }
              return col;
            });
            return { ...r, columns: updatedCols };
          }
          return r;
        });
        return {
          ...p,
          layoutRows: updatedRows,
          blocks: extractAllBlocksFromRows(updatedRows),
        };
      });
      autoSaveToStorage(state.activeTemplateId, state.metadata, updatedPages);
      return { pages: updatedPages };
    });
  },

  updateRowMargins: (pageNumber, rowId, margins) => {
    set((state) => {
      const updatedPages = state.pages.map((p) => {
        const currentRows = getPageLayoutRows(p);
        const updatedRows = currentRows.map((r) => {
          if (r.id === rowId) {
            return {
              ...r,
              marginTop: margins.marginTop !== undefined ? margins.marginTop : (r.marginTop ?? 0),
              marginBottom: margins.marginBottom !== undefined ? margins.marginBottom : (r.marginBottom ?? 16),
            };
          }
          return r;
        });
        return {
          ...p,
          layoutRows: updatedRows,
          blocks: extractAllBlocksFromRows(updatedRows),
        };
      });
      const reflowed = reflowPages(updatedPages);
      autoSaveToStorage(state.activeTemplateId, state.metadata, reflowed);
      return { pages: reflowed, activePage: Math.min(state.activePage, reflowed.length) };
    });
  },

  updateRowPadding: (pageNumber, rowId, padding) => {
    set((state) => {
      const updatedPages = state.pages.map((p) => {
        const currentRows = getPageLayoutRows(p);
        const updatedRows = currentRows.map((r) => {
          if (r.id === rowId) {
            return {
              ...r,
              paddingTop: padding.paddingTop !== undefined ? padding.paddingTop : (r.paddingTop ?? 6),
              paddingBottom: padding.paddingBottom !== undefined ? padding.paddingBottom : (r.paddingBottom ?? 6),
            };
          }
          return r;
        });
        return {
          ...p,
          layoutRows: updatedRows,
          blocks: extractAllBlocksFromRows(updatedRows),
        };
      });
      const reflowed = reflowPages(updatedPages);
      autoSaveToStorage(state.activeTemplateId, state.metadata, reflowed);
      return { pages: reflowed, activePage: Math.min(state.activePage, reflowed.length) };
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
      paperSize: get().paperSize,
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
    const targetPaperSize = snapshot.paperSize || "tabloid";
    let pagesToLoad = snapshot.pages;
    const page1 = pagesToLoad[0];
    const rows = getPageLayoutRows(page1);
    const hasHeaderRow = rows.some(
      (r) => r.id === "page-row-header" || r.columns?.some((c) => c.id === "col-header-company")
    );
    if (!hasHeaderRow) {
      const updatedPage1: CanvasPage = {
        ...page1,
        layoutRows: [INITIAL_PAGE_ROWS[0], INITIAL_PAGE_ROWS[1], ...rows],
        blocks: extractAllBlocksFromRows([INITIAL_PAGE_ROWS[0], INITIAL_PAGE_ROWS[1], ...rows]),
      };
      pagesToLoad = [updatedPage1, ...pagesToLoad.slice(1)];
    }

    const reflowed = reflowPages(pagesToLoad, targetPaperSize);
    set((state) => ({
      activeTemplateId: templateId || state.activeTemplateId,
      metadata: snapshot.metadata || INITIAL_METADATA,
      paperSize: targetPaperSize,
      pages: reflowed,
      activePage: 1,
      selectedBlockId: null,
      selectedCell: null,
      selectedRowId: null,
      selectedColumnId: null,
      saveMessage: "Template loaded successfully!",
    }));
    setTimeout(() => {
      set({ saveMessage: null });
    }, 3000);
  },

  resetToDefault: () => {
    set((state) => {
      const defaultPages: CanvasPage[] = [
        {
          pageNumber: 1,
          layoutRows: INITIAL_PAGE_ROWS,
          blocks: INITIAL_BLOCKS,
        },
      ];
      autoSaveToStorage(state.activeTemplateId, INITIAL_METADATA, defaultPages, "tabloid");
      return {
        metadata: INITIAL_METADATA,
        paperSize: "tabloid",
        pages: defaultPages,
        activePage: 1,
        selectedBlockId: null,
        selectedCell: null,
        selectedRowId: "page-row-header",
        selectedColumnId: "col-header-company",
        saveMessage: "Reset to default template",
      };
    });
    setTimeout(() => {
      set({ saveMessage: null });
    }, 3000);
  },

  addElementToColumn: (pageNumber, rowId, columnId, type) => {
    const blockId = `block-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    let newBlock: CanvasBlock;

    if (type === "text") {
      newBlock = {
        id: blockId,
        type: "text",
        content: "Click to edit this text block. You can customize font family, size, weight, and color.",
        variant: "paragraph",
        fontFamily: "Inter",
        fontSize: 14,
        fontWeight: "400",
        color: "#1f2937",
        align: "left",
      };
    } else if (type === "table") {
      newBlock = {
        id: blockId,
        type: "table",
        title: "ADDITIONAL ITEMS",
        columns: DEFAULT_TABLE_COLUMNS,
        rows: [
          { id: 1, item: "New Item A", qty: 1, unitPrice: "$25.00", amount: "$25.00" },
          { id: 2, item: "New Item B", qty: 2, unitPrice: "$15.00", amount: "$30.00" },
        ],
        fontFamily: "Inter",
        fontSize: 14,
        fontWeight: "400",
        color: "#1f2937",
        align: "left",
        tableWidth: "100%",
        borderStyle: "1px solid #E5E7EB",
        padding: 8,
        rowSpacing: 0,
      };
    } else if (type === "image") {
      newBlock = {
        id: blockId,
        type: "image",
        caption: "Document Image Asset",
        width: 120,
        height: "auto",
        align: "left",
        borderRadius: 8,
      };
    } else {
      newBlock = {
        id: blockId,
        type: "shape",
        shapeType: "divider",
        color: "#3b82f6",
        height: 2,
        width: "100%",
      };
    }

    set((state) => {
      const updatedPages = state.pages.map((p) => {
        const currentRows = getPageLayoutRows(p);
        const updatedRows = currentRows.map((r) => {
          if (r.id === rowId) {
            const updatedCols = r.columns.map((c) => {
              if (c.id === columnId) {
                return {
                  ...c,
                  blocks: [...c.blocks, newBlock],
                };
              }
              return c;
            });
            return { ...r, columns: updatedCols };
          }
          return r;
        });
        return {
          ...p,
          layoutRows: updatedRows,
          blocks: extractAllBlocksFromRows(updatedRows),
        };
      });
      const reflowed = reflowPages(updatedPages);
      autoSaveToStorage(state.activeTemplateId, state.metadata, reflowed);
      return {
        pages: reflowed,
        activePage: Math.min(state.activePage, reflowed.length),
        selectedBlockId: blockId,
        selectedRowId: rowId,
        selectedColumnId: columnId,
        activeTool: "select",
      };
    });
  },

  addElement: (type) => {
    set((state) => {
      const activeIdx = state.pages.findIndex((p) => p.pageNumber === state.activePage);
      const targetIdx = activeIdx >= 0 ? activeIdx : 0;
      const currentPage = state.pages[targetIdx] || state.pages[0];
      const currentRows = getPageLayoutRows(currentPage);

      let targetRow =
        currentRows.find((r) => r.id === state.selectedRowId) ||
        currentRows[currentRows.length - 1];
      if (!targetRow) {
        const newRowId = `row-${Date.now()}-1`;
        const newColId = `col-${Date.now()}-1`;
        targetRow = { id: newRowId, columns: [{ id: newColId, blocks: [] }] };
        currentRows.push(targetRow);
      }

      let targetCol =
        targetRow.columns.find((c) => c.id === state.selectedColumnId) ||
        targetRow.columns[0];
      if (!targetCol) {
        const newColId = `col-${Date.now()}-1`;
        targetCol = { id: newColId, blocks: [] };
        targetRow.columns.push(targetCol);
      }

      let newBlock: CanvasBlock;
      const blockId = `block-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

      if (type === "text") {
        newBlock = {
          id: blockId,
          type: "text",
          content: "Click to edit this text block. You can customize font family, size, weight, and color.",
          variant: "paragraph",
          fontFamily: "Inter",
          fontSize: 14,
          fontWeight: "400",
          color: "#1f2937",
          align: "left",
        };
      } else if (type === "table") {
        newBlock = {
          id: blockId,
          type: "table",
          title: "ADDITIONAL ITEMS",
          columns: DEFAULT_TABLE_COLUMNS,
          rows: [
            { id: 1, item: "New Item A", qty: 1, unitPrice: "$25.00", amount: "$25.00" },
            { id: 2, item: "New Item B", qty: 2, unitPrice: "$15.00", amount: "$30.00" },
          ],
          fontFamily: "Inter",
          fontSize: 14,
          fontWeight: "400",
          color: "#1f2937",
          align: "left",
          tableWidth: "100%",
          borderStyle: "1px solid #E5E7EB",
          padding: 8,
          rowSpacing: 0,
        };
      } else if (type === "image") {
        newBlock = {
          id: blockId,
          type: "image",
          caption: "Document Image Asset",
          width: 120,
          height: "auto",
          align: "left",
          borderRadius: 8,
        };
      } else {
        newBlock = {
          id: blockId,
          type: "shape",
          shapeType: "divider",
          color: "#3b82f6",
          height: 2,
          width: "100%",
        };
      }

      const updatedRows = currentRows.map((r) => {
        if (r.id === targetRow.id) {
          const updatedCols = r.columns.map((c) => {
            if (c.id === targetCol.id) {
              return {
                ...c,
                blocks: [...c.blocks, newBlock],
              };
            }
            return c;
          });
          return { ...r, columns: updatedCols };
        }
        return r;
      });

      const updatedPages = state.pages.map((page, idx) => {
        if (idx === targetIdx) {
          return {
            ...page,
            layoutRows: updatedRows,
            blocks: extractAllBlocksFromRows(updatedRows),
          };
        }
        return page;
      });

      const reflowed = reflowPages(updatedPages);
      autoSaveToStorage(state.activeTemplateId, state.metadata, reflowed);

      return {
        pages: reflowed,
        activePage: Math.min(state.activePage, reflowed.length),
        activeTool: "select",
        selectedBlockId: type === "text" || type === "table" ? blockId : state.selectedBlockId,
        selectedRowId: targetRow.id,
        selectedColumnId: targetCol.id,
        selectedCell: null,
      };
    });
  },

  removeElement: (pageNumber, blockId) => {
    set((state) => {
      const updatedPages = state.pages.map((p) => {
        const currentRows = getPageLayoutRows(p);
        const updatedRows = currentRows.map((r) => ({
          ...r,
          columns: r.columns.map((c) => ({
            ...c,
            blocks: c.blocks.filter((b) => b.id !== blockId && !isMatchingTableBlock(b, blockId)),
          })),
        }));
        return {
          ...p,
          layoutRows: updatedRows,
          blocks: extractAllBlocksFromRows(updatedRows),
        };
      });
      const reflowed = reflowPages(updatedPages);
      autoSaveToStorage(state.activeTemplateId, state.metadata, reflowed);
      return {
        pages: reflowed,
        activePage: Math.min(state.activePage, reflowed.length),
        selectedBlockId: state.selectedBlockId === blockId ? null : state.selectedBlockId,
        selectedCell:
          state.selectedCell && state.selectedCell.blockId === blockId ? null : state.selectedCell,
      };
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
        const currentRows = getPageLayoutRows(p);
        const updatedRows = currentRows.map((r) => ({
          ...r,
          columns: r.columns.map((c) => ({
            ...c,
            blocks: c.blocks.map((b) => {
              if (b.id === blockId && b.type === "text") {
                return { ...b, content };
              }
              return b;
            }),
          })),
        }));
        return {
          ...p,
          layoutRows: updatedRows,
          blocks: extractAllBlocksFromRows(updatedRows),
        };
      });
      const reflowed = reflowPages(updatedPages);
      autoSaveToStorage(state.activeTemplateId, state.metadata, reflowed);
      return { pages: reflowed, activePage: Math.min(state.activePage, reflowed.length) };
    });
  },

  updateBlockStyle: (pageNumber, blockId, style) => {
    set((state) => {
      const updatedPages = state.pages.map((p) => {
        const currentRows = getPageLayoutRows(p);
        const updatedRows = currentRows.map((r) => ({
          ...r,
          columns: r.columns.map((c) => ({
            ...c,
            blocks: c.blocks.map((b) => {
              if (b.id === blockId || isMatchingTableBlock(b, blockId)) {
                return { ...b, ...style } as CanvasBlock;
              }
              return b;
            }),
          })),
        }));
        return {
          ...p,
          layoutRows: updatedRows,
          blocks: extractAllBlocksFromRows(updatedRows),
        };
      });
      const reflowed = reflowPages(updatedPages);
      autoSaveToStorage(state.activeTemplateId, state.metadata, reflowed);
      return { pages: reflowed, activePage: Math.min(state.activePage, reflowed.length) };
    });
  },

  updateTextBlockStyle: (pageNumber, blockId, style) => {
    get().updateBlockStyle(pageNumber, blockId, style);
  },

  updateImageBlock: (pageNumber, blockId, updates) => {
    get().updateBlockStyle(pageNumber, blockId, updates);
  },

  updateShapeBlock: (pageNumber, blockId, updates) => {
    get().updateBlockStyle(pageNumber, blockId, updates);
  },

  updateTableSettings: (pageNumber, blockId, settings) => {
    get().updateBlockStyle(pageNumber, blockId, settings);
  },

  updateTableCellStyle: (pageNumber, blockId, rowId, columnKey, style) => {
    set((state) => {
      const updatedPages = state.pages.map((p) => {
        const currentRows = getPageLayoutRows(p);
        const updatedRows = currentRows.map((r) => ({
          ...r,
          columns: r.columns.map((c) => ({
            ...c,
            blocks: c.blocks.map((b) => {
              if (b.type === "table" && (b.id === blockId || isMatchingTableBlock(b, blockId))) {
                const rows = b.rows.map((row) => {
                  if (row.id === rowId) {
                    const currentCellStyles = row.cellStyles || {};
                    const currentStyle = currentCellStyles[columnKey] || {};
                    return {
                      ...row,
                      cellStyles: {
                        ...currentCellStyles,
                        [columnKey]: {
                          ...currentStyle,
                          ...style,
                        },
                      },
                    };
                  }
                  return row;
                });
                return { ...b, rows };
              }
              return b;
            }),
          })),
        }));
        return {
          ...p,
          layoutRows: updatedRows,
          blocks: extractAllBlocksFromRows(updatedRows),
        };
      });
      autoSaveToStorage(state.activeTemplateId, state.metadata, updatedPages);
      return { pages: updatedPages };
    });
  },

  updateTableRow: (pageNumber, blockId, rowId, field, value) => {
    set((state) => {
      const updatedPages = state.pages.map((p) => {
        const currentRows = getPageLayoutRows(p);
        const updatedRows = currentRows.map((r) => ({
          ...r,
          columns: r.columns.map((c) => ({
            ...c,
            blocks: c.blocks.map((b) => {
              if (b.type === "table" && (b.id === blockId || isMatchingTableBlock(b, blockId))) {
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
          })),
        }));
        return {
          ...p,
          layoutRows: updatedRows,
          blocks: extractAllBlocksFromRows(updatedRows),
        };
      });
      autoSaveToStorage(state.activeTemplateId, state.metadata, updatedPages);
      return { pages: updatedPages };
    });
  },

  addTableRow: (pageNumber, blockId) => {
    set((state) => {
      let maxExistingId = 0;
      state.pages.forEach((p) => {
        getPageLayoutRows(p).forEach((r) => {
          r.columns.forEach((c) => {
            c.blocks.forEach((b) => {
              if (b.type === "table" && isMatchingTableBlock(b, blockId)) {
                b.rows.forEach((row) => {
                  if (row.id > maxExistingId) maxExistingId = row.id;
                });
              }
            });
          });
        });
      });

      const nextId = maxExistingId + 1;
      const newRow: TableRowItem = {
        id: nextId,
        item: `Product ${String.fromCharCode(65 + ((nextId - 1) % 26))}`,
        qty: 1,
        unitPrice: "$10.00",
        amount: "$10.00",
      };

      const updatedPages = state.pages.map((p) => {
        const currentRows = getPageLayoutRows(p);
        const updatedRows = currentRows.map((r) => ({
          ...r,
          columns: r.columns.map((c) => ({
            ...c,
            blocks: c.blocks.map((b) => {
              if (b.type === "table" && isMatchingTableBlock(b, blockId)) {
                const existingCols = b.columns || DEFAULT_TABLE_COLUMNS;
                existingCols.forEach((col) => {
                  if (newRow[col.id] === undefined) {
                    newRow[col.id] = "-";
                  }
                });
                return { ...b, rows: [...b.rows, newRow] };
              }
              return b;
            }),
          })),
        }));
        return {
          ...p,
          layoutRows: updatedRows,
          blocks: extractAllBlocksFromRows(updatedRows),
        };
      });

      const reflowed = reflowPages(updatedPages);
      autoSaveToStorage(state.activeTemplateId, state.metadata, reflowed);

      // If adding this row caused a new page to be created, focus the new page so the user sees it
      const targetPageNum = reflowed.length > state.pages.length ? reflowed.length : state.activePage;

      return {
        pages: reflowed,
        activePage: Math.min(targetPageNum, reflowed.length),
      };
    });
  },

  deleteTableRow: (pageNumber, blockId, rowId) => {
    set((state) => {
      const updatedPages = state.pages.map((p) => {
        const currentRows = getPageLayoutRows(p);
        const updatedRows = currentRows.map((r) => ({
          ...r,
          columns: r.columns.map((c) => ({
            ...c,
            blocks: c.blocks.map((b) => {
              if (b.type === "table" && isMatchingTableBlock(b, blockId)) {
                if (b.rows.length <= 1) return b;
                const targetId = rowId ?? b.rows[b.rows.length - 1].id;
                return { ...b, rows: b.rows.filter((row) => row.id !== targetId) };
              }
              return b;
            }),
          })),
        }));
        return {
          ...p,
          layoutRows: updatedRows,
          blocks: extractAllBlocksFromRows(updatedRows),
        };
      });
      const reflowed = reflowPages(updatedPages);
      autoSaveToStorage(state.activeTemplateId, state.metadata, reflowed);
      return { pages: reflowed, activePage: Math.min(state.activePage, reflowed.length) };
    });
  },

  reorderTableRows: (pageNumber, blockId, sourceIndex, destinationIndex) => {
    set((state) => {
      if (sourceIndex === destinationIndex) return state;

      const updatedPages = state.pages.map((p) => {
        const currentRows = getPageLayoutRows(p);
        const updatedRows = currentRows.map((r) => ({
          ...r,
          columns: r.columns.map((c) => ({
            ...c,
            blocks: c.blocks.map((b) => {
              if (b.type === "table" && (b.id === blockId || isMatchingTableBlock(b, blockId))) {
                if (
                  sourceIndex < 0 ||
                  sourceIndex >= b.rows.length ||
                  destinationIndex < 0 ||
                  destinationIndex >= b.rows.length
                ) {
                  return b;
                }
                const newRows = arrayMove(b.rows, sourceIndex, destinationIndex);
                return { ...b, rows: newRows };
              }
              return b;
            }),
          })),
        }));
        return {
          ...p,
          layoutRows: updatedRows,
          blocks: extractAllBlocksFromRows(updatedRows),
        };
      });

      const reflowed = reflowPages(updatedPages);
      autoSaveToStorage(state.activeTemplateId, state.metadata, reflowed);
      return { pages: reflowed };
    });
  },

  addTableColumn: (pageNumber, blockId) => {
    set((state) => {
      const newColId = `col_${Date.now()}`;
      const updatedPages = state.pages.map((p) => {
        const currentRows = getPageLayoutRows(p);
        const updatedRows = currentRows.map((r) => ({
          ...r,
          columns: r.columns.map((c) => ({
            ...c,
            blocks: c.blocks.map((b) => {
              if (b.type === "table" && isMatchingTableBlock(b, blockId)) {
                const existingCols =
                  b.columns && b.columns.length > 0 ? b.columns : [...DEFAULT_TABLE_COLUMNS];
                const newColIndex = existingCols.length + 1;
                const newColumn: TableColumn = {
                  id: newColId,
                  label: `Column ${newColIndex}`,
                  align: "left",
                };
                const updatedColumns = [...existingCols, newColumn];
                const rows = b.rows.map((row) => ({
                  ...row,
                  [newColId]: "-",
                }));
                return { ...b, columns: updatedColumns, rows };
              }
              return b;
            }),
          })),
        }));
        return {
          ...p,
          layoutRows: updatedRows,
          blocks: extractAllBlocksFromRows(updatedRows),
        };
      });
      const reflowed = reflowPages(updatedPages);
      autoSaveToStorage(state.activeTemplateId, state.metadata, reflowed);
      return { pages: reflowed, activePage: Math.min(state.activePage, reflowed.length) };
    });
  },

  deleteTableColumn: (pageNumber, blockId, columnId) => {
    set((state) => {
      const updatedPages = state.pages.map((p) => {
        const currentRows = getPageLayoutRows(p);
        const updatedRows = currentRows.map((r) => ({
          ...r,
          columns: r.columns.map((c) => ({
            ...c,
            blocks: c.blocks.map((b) => {
              if (b.type === "table" && isMatchingTableBlock(b, blockId)) {
                const existingCols =
                  b.columns && b.columns.length > 0 ? b.columns : [...DEFAULT_TABLE_COLUMNS];
                if (existingCols.length <= 1) return b;
                const targetColId = columnId || existingCols[existingCols.length - 1].id;
                const updatedColumns = existingCols.filter((col) => col.id !== targetColId);
                const rows = b.rows.map((row) => {
                  const newRow = { ...row };
                  delete newRow[targetColId];
                  if (newRow.cellStyles && newRow.cellStyles[targetColId]) {
                    const newStyles = { ...newRow.cellStyles };
                    delete newStyles[targetColId];
                    newRow.cellStyles = newStyles;
                  }
                  return newRow;
                });
                return { ...b, columns: updatedColumns, rows };
              }
              return b;
            }),
          })),
        }));
        return {
          ...p,
          layoutRows: updatedRows,
          blocks: extractAllBlocksFromRows(updatedRows),
        };
      });
      const reflowed = reflowPages(updatedPages);
      autoSaveToStorage(state.activeTemplateId, state.metadata, reflowed);
      return { pages: reflowed, activePage: Math.min(state.activePage, reflowed.length) };
    });
  },

  updateTableTitle: (pageNumber, blockId, title) => {
    set((state) => {
      const updatedPages = state.pages.map((p) => {
        const currentRows = getPageLayoutRows(p);
        const updatedRows = currentRows.map((r) => ({
          ...r,
          columns: r.columns.map((c) => ({
            ...c,
            blocks: c.blocks.map((b) => {
              if (b.type === "table" && isMatchingTableBlock(b, blockId)) {
                return { ...b, title };
              }
              return b;
            }),
          })),
        }));
        return {
          ...p,
          layoutRows: updatedRows,
          blocks: extractAllBlocksFromRows(updatedRows),
        };
      });
      const reflowed = reflowPages(updatedPages);
      autoSaveToStorage(state.activeTemplateId, state.metadata, reflowed);
      return { pages: reflowed, activePage: Math.min(state.activePage, reflowed.length) };
    });
  },

  updateTableColumnLabel: (pageNumber, blockId, columnId, label) => {
    set((state) => {
      const updatedPages = state.pages.map((p) => {
        const currentRows = getPageLayoutRows(p);
        const updatedRows = currentRows.map((r) => ({
          ...r,
          columns: r.columns.map((c) => ({
            ...c,
            blocks: c.blocks.map((b) => {
              if (b.type === "table" && isMatchingTableBlock(b, blockId)) {
                const existingCols =
                  b.columns && b.columns.length > 0 ? b.columns : [...DEFAULT_TABLE_COLUMNS];
                const updatedColumns = existingCols.map((col) => {
                  if (col.id === columnId) {
                    return { ...col, label };
                  }
                  return col;
                });
                return { ...b, columns: updatedColumns };
              }
              return b;
            }),
          })),
        }));
        return {
          ...p,
          layoutRows: updatedRows,
          blocks: extractAllBlocksFromRows(updatedRows),
        };
      });
      const reflowed = reflowPages(updatedPages);
      autoSaveToStorage(state.activeTemplateId, state.metadata, reflowed);
      return { pages: reflowed, activePage: Math.min(state.activePage, reflowed.length) };
    });
  },
}));
