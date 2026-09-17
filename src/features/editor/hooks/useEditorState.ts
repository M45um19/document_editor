"use client";

import { create } from "zustand";
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
} from "../types";

export interface EditorStoreState {
  activeTemplateId: string;
  selectedBlockId: string | null;
  selectedCell: SelectedCellLocation | null;
  selectedRowId: string | null;
  selectedColumnId: string | null;
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
  setSelectedBlockId: (id: string | null) => void;
  setSelectedCell: (cell: SelectedCellLocation | null) => void;
  setSelectedRowId: (rowId: string | null) => void;
  setSelectedColumnId: (columnId: string | null) => void;
  setActiveTool: (tool: ToolType) => void;
  setZoomLevel: (zoom: string) => void;
  toggleFullscreen: () => void;
  setActivePage: (pageNumber: number) => void;
  addPage: () => void;
  deletePage: (pageNumber: number) => void;

  // Page Grid (Row & Column) Management
  addPageRow: (pageNumber: number) => void;
  deletePageRow: (pageNumber: number, rowId?: string) => void;
  addPageColumn: (pageNumber: number, rowId?: string) => void;
  deletePageColumn: (pageNumber: number, rowId?: string, columnId?: string) => void;
  updateRowColumnWidths: (
    pageNumber: number,
    rowId: string,
    columnWidths: { id: string; width: number }[]
  ) => void;

  // Component insertion with auto-pagination
  addElement: (type: "text" | "table" | "image" | "shape") => void;
  addElementToColumn: (
    pageNumber: number,
    rowId: string,
    columnId: string,
    type: "text" | "table" | "image" | "shape"
  ) => void;
  removeElement: (pageNumber: number, blockId: string) => void;

  // Content updates
  setMetadata: (updates: Partial<DocumentMetadata>) => void;
  updateTextBlock: (pageNumber: number, blockId: string, content: string) => void;
  updateBlockStyle: (
    pageNumber: number,
    blockId: string,
    style: Partial<BlockTypographyStyle>
  ) => void;
  updateTextBlockStyle: (
    pageNumber: number,
    blockId: string,
    style: Partial<BlockTypographyStyle>
  ) => void;
  updateTableCellStyle: (
    pageNumber: number,
    blockId: string,
    rowId: number,
    columnKey: string,
    style: Partial<BlockTypographyStyle>
  ) => void;
  updateTableRow: (
    pageNumber: number,
    blockId: string,
    rowId: number,
    field: string,
    value: string | number
  ) => void;
  addTableRow: (pageNumber: number, blockId: string) => void;
  deleteTableRow: (pageNumber: number, blockId: string, rowId?: number) => void;
  addTableColumn: (pageNumber: number, blockId: string) => void;
  deleteTableColumn: (pageNumber: number, blockId: string, columnId?: string) => void;
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

export const extractAllBlocksFromRows = (rows: PageGridRow[]): CanvasBlock[] => {
  const blocks: CanvasBlock[] = [];
  rows.forEach((row) => {
    row.columns.forEach((col) => {
      blocks.push(...col.blocks);
    });
  });
  return blocks;
};

export const INITIAL_TABLE_ROWS: TableRowItem[] = [
  { id: 1, item: "Product A", qty: 2, unitPrice: "$10.00", amount: "$20.00" },
  { id: 2, item: "Product B", qty: 3, unitPrice: "$10.00", amount: "$45.00" },
  { id: 3, item: "Product B", qty: 1, unitPrice: "$15.00", amount: "$45.00" },
  { id: 4, item: "Product C", qty: 1, unitPrice: "$50.00", amount: "$50.00" },
  { id: 5, item: "Product D", qty: 5, unitPrice: "$8.00", amount: "$40.00" },
];

export const INITIAL_PAGE_ROWS: PageGridRow[] = [
  {
    id: "page-row-meta",
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
    columns: [
      {
        id: "col-table-main",
        blocks: [
          {
            id: "initial-table-1",
            type: "table",
            title: "QUOTATION ITEMS",
            columns: DEFAULT_TABLE_COLUMNS,
            rows: INITIAL_TABLE_ROWS,
            fontFamily: "Inter",
            fontSize: 14,
            fontWeight: "400",
            color: "#1F2937",
            align: "left",
          },
        ],
      },
    ],
  },
];

export const INITIAL_BLOCKS: CanvasBlock[] = extractAllBlocksFromRows(INITIAL_PAGE_ROWS);

export const getPageLayoutRows = (page: CanvasPage): PageGridRow[] => {
  if (page.layoutRows && page.layoutRows.length > 0) {
    return page.layoutRows;
  }
  if (page.blocks && page.blocks.length > 0) {
    return page.blocks.map((b, idx) => ({
      id: `row-legacy-${idx}-${b.id}`,
      columns: [
        {
          id: `col-legacy-${idx}-${b.id}`,
          blocks: [b],
        },
      ],
    }));
  }
  return [
    {
      id: `row-empty-1`,
      columns: [{ id: `col-empty-1`, blocks: [] }],
    },
  ];
};

// A4 Page Capacity Constants (in height units ~50px)
export const PAGE_1_CAPACITY = 13.0; // ~650px usable content space on Page 1
export const PAGE_N_CAPACITY = 19.0; // ~950px usable content space on Continuation Pages

export const getPageCapacity = (pageNumber: number): number => {
  return pageNumber === 1 ? PAGE_1_CAPACITY : PAGE_N_CAPACITY;
};

// Estimated height weight per block type
export const getBlockWeight = (block: CanvasBlock): number => {
  switch (block.type) {
    case "table": {
      const rowCount = block.rows ? block.rows.length : 0;
      return 2.0 + rowCount * 0.9;
    }
    case "text": {
      const content = block.content || "";
      const explicitLines = content.split("\n").length;
      const wrappedLines = Math.floor(content.length / 55);
      const totalLines = Math.max(1, explicitLines + wrappedLines);
      const fontSizeMultiplier = (block.fontSize || 14) / 14;
      return Math.max(0.8, 0.5 + totalLines * 0.45 * fontSizeMultiplier);
    }
    case "image":
      return 4.5;
    case "shape":
      return 1.0;
    default:
      return 1.0;
  }
};

export const getColumnWeight = (col: PageGridColumn): number => {
  return col.blocks.reduce((sum, b) => sum + getBlockWeight(b), 0);
};

export const getRowWeight = (row: PageGridRow): number => {
  if (!row.columns || row.columns.length === 0) return 0.8;
  const colWeights = row.columns.map((col) => getColumnWeight(col));
  return Math.max(0.8, ...colWeights);
};

// Helper: Match table blocks by base ID across split continuation fragments
const isMatchingTableBlock = (b: CanvasBlock, targetId: string): boolean => {
  if (b.type !== "table") return false;
  if (b.id === targetId) return true;
  const targetBase = targetId.replace(/-split-\d+$/, "");
  const bBase = b.id.replace(/-split-\d+$/, "");
  return targetBase === bBase;
};

// Helper: Normalize rows across pages and merge any split tables back into unified tables
const mergeSplitTablesInRows = (rows: PageGridRow[]): PageGridRow[] => {
  const mergedRows: PageGridRow[] = [];
  const tableMap = new Map<string, TableBlock>();

  rows.forEach((row) => {
    let isSplitContinuationRow = false;

    const clonedCols = row.columns.map((col) => {
      const clonedBlocks = col.blocks.map((block) => {
        if (block.type === "table") {
          const table = block as TableBlock;
          const splitMatch = table.id.match(/^(.+)-split-(\d+)$/);
          if (splitMatch) {
            const baseId = splitMatch[1];
            const existing = tableMap.get(baseId);
            if (existing) {
              // Merge rows into original table
              existing.rows = [...existing.rows, ...table.rows];
              isSplitContinuationRow = true;
            }
            return { ...table };
          } else {
            const clonedTable = { ...table, rows: [...table.rows] };
            tableMap.set(table.id, clonedTable);
            return clonedTable;
          }
        }
        return block;
      });
      return { ...col, blocks: clonedBlocks };
    });

    if (!isSplitContinuationRow) {
      mergedRows.push({ ...row, columns: clonedCols });
    }
  });

  return mergedRows;
};

// Dynamic Bi-Directional Auto-Pagination & Reflow Engine (with Table Splitting)
export const reflowPages = (pages: CanvasPage[]): CanvasPage[] => {
  if (!pages || pages.length === 0) {
    return [
      {
        pageNumber: 1,
        layoutRows: INITIAL_PAGE_ROWS,
        blocks: INITIAL_BLOCKS,
      },
    ];
  }

  // 1. Collect all layout rows in continuous sequence across all pages
  const allRows: PageGridRow[] = [];
  pages.forEach((p) => {
    const rows = getPageLayoutRows(p);
    allRows.push(...rows);
  });

  // 2. Merge split tables back to accurately compute capacity
  const unifiedRows = mergeSplitTablesInRows(allRows);
  const rowsToProcess = unifiedRows.length > 0 ? unifiedRows : INITIAL_PAGE_ROWS;

  // 3. Pack rows into A4 pages sequentially according to page budget
  const reflowedPages: CanvasPage[] = [];
  let currentPageNum = 1;
  let currentCapacity = getPageCapacity(currentPageNum);
  let currentPageRows: PageGridRow[] = [];
  let currentWeight = 0;

  for (let i = 0; i < rowsToProcess.length; i++) {
    const row = rowsToProcess[i];

    // Check if this row is a single-table row that might overflow and need row splitting
    const isSingleTable =
      row.columns.length === 1 &&
      row.columns[0].blocks.length === 1 &&
      row.columns[0].blocks[0].type === "table";

    if (isSingleTable) {
      let table = { ...(row.columns[0].blocks[0] as TableBlock) };
      table.rows = [...table.rows];

      while (table.rows.length > 0) {
        const remainingCapacity = currentCapacity - currentWeight;

        // If not enough room on this page even for header + 1 table row (approx 2.9 units),
        // and current page already has content, advance to next page
        if (remainingCapacity < 2.9 && currentPageRows.length > 0) {
          reflowedPages.push({
            pageNumber: currentPageNum,
            layoutRows: currentPageRows,
            blocks: extractAllBlocksFromRows(currentPageRows),
          });

          currentPageNum++;
          currentCapacity = getPageCapacity(currentPageNum);
          currentPageRows = [];
          currentWeight = 0;
          continue;
        }

        // Available space for table rows on this page
        const spaceForRows = Math.max(0.9, currentCapacity - currentWeight - 2.0);
        const maxRowsThatFit = Math.max(1, Math.floor(spaceForRows / 0.9));

        if (table.rows.length <= maxRowsThatFit) {
          // Entire table (or remaining portion) fits on current page!
          const finalTableWeight = 2.0 + table.rows.length * 0.9;
          const placedRow: PageGridRow = {
            id: row.id,
            columns: [{ id: row.columns[0].id, blocks: [table] }],
          };
          currentPageRows.push(placedRow);
          currentWeight += finalTableWeight;
          break; // Done with this table block
        } else {
          // Split table: place maxRowsThatFit on this page, and rest on next page
          const rowsForThisPage = table.rows.slice(0, maxRowsThatFit);
          const rowsForNextPage = table.rows.slice(maxRowsThatFit);

          const tablePart: TableBlock = {
            ...table,
            rows: rowsForThisPage,
          };

          const placedRow: PageGridRow = {
            id: row.id,
            columns: [{ id: row.columns[0].id, blocks: [tablePart] }],
          };
          currentPageRows.push(placedRow);

          // Push completed page
          reflowedPages.push({
            pageNumber: currentPageNum,
            layoutRows: currentPageRows,
            blocks: extractAllBlocksFromRows(currentPageRows),
          });

          // Advance to next continuation page
          currentPageNum++;
          currentCapacity = getPageCapacity(currentPageNum);
          currentPageRows = [];
          currentWeight = 0;

          const baseTitle = table.title.replace(/\s*\(Cont\.\)$/, "");
          const baseId = table.id.replace(/-split-\d+$/, "");

          table = {
            ...table,
            id: `${baseId}-split-${currentPageNum}`,
            title: `${baseTitle} (Cont.)`,
            rows: rowsForNextPage,
          };
        }
      }
    } else {
      // General row (multi-column or non-table blocks)
      const rowWeight = getRowWeight(row);

      // If doesn't fit on current page and current page already has content, push page
      if (currentWeight + rowWeight > currentCapacity && currentPageRows.length > 0) {
        reflowedPages.push({
          pageNumber: currentPageNum,
          layoutRows: currentPageRows,
          blocks: extractAllBlocksFromRows(currentPageRows),
        });

        currentPageNum++;
        currentCapacity = getPageCapacity(currentPageNum);
        currentPageRows = [row];
        currentWeight = rowWeight;
      } else {
        currentPageRows.push(row);
        currentWeight += rowWeight;
      }
    }
  }

  // Finalize last page
  if (currentPageRows.length > 0) {
    reflowedPages.push({
      pageNumber: currentPageNum,
      layoutRows: currentPageRows,
      blocks: extractAllBlocksFromRows(currentPageRows),
    });
  }

  // Ensure at least 1 page
  if (reflowedPages.length === 0) {
    reflowedPages.push({
      pageNumber: 1,
      layoutRows: INITIAL_PAGE_ROWS,
      blocks: INITIAL_BLOCKS,
    });
  }

  return reflowedPages.map((p, idx) => ({
    ...p,
    pageNumber: idx + 1,
  }));
};

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
  selectedBlockId: null,
  selectedCell: null,
  selectedRowId: "page-row-meta",
  selectedColumnId: "col-meta-issuer",
  metadata: INITIAL_METADATA,
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
  toggleFullscreen: () => set((s) => ({ isFullscreen: !s.isFullscreen })),
  setActivePage: (pageNumber) => set({ activePage: pageNumber }),

  addPage: () => {
    set((state) => {
      const nextPageNum = state.pages.length + 1;
      const newRowId = `row-${Date.now()}-1`;
      const newColId = `col-${Date.now()}-1`;
      const newPage: CanvasPage = {
        pageNumber: nextPageNum,
        layoutRows: [
          {
            id: newRowId,
            columns: [{ id: newColId, blocks: [] }],
          },
        ],
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
    const reflowed = reflowPages(snapshot.pages);
    set((state) => ({
      activeTemplateId: templateId || state.activeTemplateId,
      metadata: snapshot.metadata || INITIAL_METADATA,
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
      autoSaveToStorage(state.activeTemplateId, INITIAL_METADATA, defaultPages);
      return {
        metadata: INITIAL_METADATA,
        pages: defaultPages,
        activePage: 1,
        selectedBlockId: null,
        selectedCell: null,
        selectedRowId: "page-row-meta",
        selectedColumnId: "col-meta-issuer",
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
                return { ...b, ...style };
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
}));
