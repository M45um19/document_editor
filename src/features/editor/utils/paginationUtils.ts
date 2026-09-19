import {
  TableRowItem,
  CanvasBlock,
  DocumentMetadata,
  CanvasPage,
  PageGridRow,
  PageGridColumn,
  DEFAULT_TABLE_COLUMNS,
  TableBlock,
  ImageBlock,
  ShapeBlock,
  PaperSize,
  PAPER_SIZES,
} from "../types";

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

export const INITIAL_PAGE_ROWS: PageGridRow[] = [
  {
    id: "page-row-header",
    marginTop: 0,
    marginBottom: 8,
    paddingTop: 0,
    paddingBottom: 0,
    columns: [
      {
        id: "col-header-logo",
        width: 8,
        blocks: [
          {
            id: "header-logo-1",
            type: "image",
            caption: "Company Logo",
            isLogoPreset: true,
            width: 42,
            height: 42,
            align: "left",
            borderRadius: 8,
          },
        ],
      },
      {
        id: "col-header-company",
        width: 52,
        blocks: [
          {
            id: "header-company-name",
            type: "text",
            content: "Your Company",
            fontFamily: "Inter",
            fontSize: 22,
            fontWeight: "800",
            color: "#0f172a",
            align: "left",
          },
          {
            id: "header-company-tagline",
            type: "text",
            content: "Better Documents, Better Business",
            fontFamily: "Inter",
            fontSize: 12,
            fontWeight: "500",
            color: "#64748b",
            align: "left",
          },
        ],
      },
      {
        id: "col-header-title",
        width: 40,
        blocks: [
          {
            id: "header-doc-title",
            type: "text",
            content: "VISUAL DOCUMENT",
            fontFamily: "Inter",
            fontSize: 22,
            fontWeight: "900",
            color: "#0f172a",
            align: "right",
          },
        ],
      },
    ],
  },
  {
    id: "page-row-divider",
    marginTop: 0,
    marginBottom: 14,
    paddingTop: 0,
    paddingBottom: 0,
    columns: [
      {
        id: "col-divider-main",
        width: 100,
        blocks: [
          {
            id: "header-divider-1",
            type: "shape",
            shapeType: "divider",
            color: "#2563eb",
            height: 1.5,
          },
        ],
      },
    ],
  },
  {
    id: "page-row-meta",
    marginTop: 0,
    marginBottom: 16,
    paddingTop: 0,
    paddingBottom: 0,
    columns: [
      {
        id: "col-meta-issuer",
        width: 33.3,
        blocks: [
          {
            id: "meta-block-issuer",
            type: "text",
            content: "ISSUER/\nIssuer Details",
            fontFamily: "Inter",
            fontSize: 13,
            fontWeight: "700",
            color: "#0f172a",
            align: "left",
          },
        ],
      },
      {
        id: "col-meta-client",
        width: 33.3,
        blocks: [
          {
            id: "meta-block-client",
            type: "text",
            content: "Client Details",
            fontFamily: "Inter",
            fontSize: 13,
            fontWeight: "700",
            color: "#0f172a",
            align: "left",
          },
        ],
      },
      {
        id: "col-meta-nodate",
        width: 33.4,
        blocks: [
          {
            id: "meta-block-nodate",
            type: "text",
            content: "No/Date:  C-2026-061\n2026-09-14",
            fontFamily: "Inter",
            fontSize: 13,
            fontWeight: "700",
            color: "#0f172a",
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
    paddingTop: 0,
    paddingBottom: 0,
    columns: [
      {
        id: "col-table-main",
        width: 100,
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
            tableWidth: "100%",
            borderStyle: "1px solid #E5E7EB",
            padding: 8,
            rowSpacing: 0,
          },
        ],
      },
    ],
  },
];

export const extractAllBlocksFromRows = (rows: PageGridRow[]): CanvasBlock[] => {
  const blocks: CanvasBlock[] = [];
  rows.forEach((row) => {
    row.columns.forEach((col) => {
      blocks.push(...col.blocks);
    });
  });
  return blocks;
};

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

// Dynamic Page Capacity in Pixels based on Paper Size
export const getPageCapacity = (pageNumber: number, paperSize: PaperSize = "tabloid"): number => {
  const config = PAPER_SIZES[paperSize] || PAPER_SIZES.tabloid;
  return pageNumber === 1 ? config.page1Capacity : config.pageNCapacity;
};

// Table container overhead calculation in pixels (title, thead header, borders & paddings)
export const getTableOverheadHeight = (table: TableBlock): number => {
  const cellPadding = table.padding !== undefined ? table.padding : 8;
  const titleHeight = table.title ? 28 : 18;
  const theadHeight = 18 + cellPadding * 2;
  const containerPadding = 8;
  return titleHeight + theadHeight + containerPadding;
};

// Single table row rendered height calculation in pixels
export const getTableRowHeight = (table: TableBlock): number => {
  const cellPadding = table.padding !== undefined ? table.padding : 8;
  const rowSpacing = table.rowSpacing !== undefined ? table.rowSpacing : 0;
  const fontSize = table.fontSize || 14;
  const fontExtra = Math.max(0, (fontSize - 14) * 1.3);
  return Math.max(30, 18 + cellPadding * 2 + rowSpacing + fontExtra);
};

// Estimated height in pixels per block type
export const getBlockHeight = (block: CanvasBlock): number => {
  switch (block.type) {
    case "table": {
      const table = block as TableBlock;
      const rowCount = table.rows ? table.rows.length : 0;
      return getTableOverheadHeight(table) + rowCount * getTableRowHeight(table);
    }
    case "text": {
      const content = block.content || "";
      const fontSize = block.fontSize || 14;
      const explicitLines = content.split("\n");
      let totalLines = 0;
      explicitLines.forEach((line) => {
        const wrapFactor = Math.max(30, Math.floor(75 * (14 / fontSize)));
        totalLines += Math.max(1, Math.ceil(line.length / wrapFactor) || 1);
      });
      const lineHeight = Math.round(fontSize * 1.3);
      return totalLines * lineHeight + 8;
    }
    case "image": {
      const img = block as ImageBlock;
      if (img.isLogoPreset) {
        return (typeof img.height === "number" ? img.height : 42) + 8;
      }
      if (typeof img.height === "number") {
        return img.height + 12;
      }
      return img.url ? 140 : 100;
    }
    case "shape": {
      const shape = block as ShapeBlock;
      const heightVal = typeof shape.height === "number" ? shape.height : 2;
      return heightVal + 8;
    }
    default:
      return 30;
  }
};

export const getBlockWeight = getBlockHeight;

export const getColumnHeight = (col: PageGridColumn): number => {
  if (!col.blocks || col.blocks.length === 0) return 40;
  return col.blocks.reduce((sum, b) => sum + getBlockHeight(b), 0);
};

export const getColumnWeight = getColumnHeight;

export const getRowHeight = (row: PageGridRow): number => {
  const marginTop = row.marginTop !== undefined ? row.marginTop : 0;
  const marginBottom = row.marginBottom !== undefined ? row.marginBottom : 12;
  const paddingTop = row.paddingTop !== undefined ? row.paddingTop : 0;
  const paddingBottom = row.paddingBottom !== undefined ? row.paddingBottom : 0;
  const outerSpacing = marginTop + marginBottom + paddingTop + paddingBottom;

  if (!row.columns || row.columns.length === 0) return outerSpacing + 30;
  const colHeights = row.columns.map((col) => getColumnHeight(col));
  return outerSpacing + Math.max(20, ...colHeights);
};

export const getRowWeight = getRowHeight;

export const isMatchingTableBlock = (b: CanvasBlock, targetId: string): boolean => {
  if (b.type !== "table") return false;
  if (b.id === targetId) return true;
  const targetBase = targetId.replace(/-split-\d+$/, "");
  const bBase = b.id.replace(/-split-\d+$/, "");
  return targetBase === bBase;
};

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

export const reflowPages = (pages: CanvasPage[], paperSize: PaperSize = "tabloid"): CanvasPage[] => {
  if (!pages || pages.length === 0) {
    return [
      {
        pageNumber: 1,
        layoutRows: INITIAL_PAGE_ROWS,
        blocks: INITIAL_BLOCKS,
      },
    ];
  }

  const effectivePaperSize = paperSize || "tabloid";

  // 1. Collect all layout rows in continuous sequence across all pages
  const allRows: PageGridRow[] = [];
  pages.forEach((p) => {
    const rows = getPageLayoutRows(p);
    allRows.push(...rows);
  });

  // 2. Merge split tables back to accurately compute capacity
  const unifiedRows = mergeSplitTablesInRows(allRows);
  const rowsToProcess = unifiedRows.length > 0 ? unifiedRows : INITIAL_PAGE_ROWS;

  // 3. Pack rows into pages sequentially according to paper pixel budget
  const reflowedPages: CanvasPage[] = [];
  let currentPageNum = 1;
  let currentCapacity = getPageCapacity(currentPageNum, effectivePaperSize);
  let currentPageRows: PageGridRow[] = [];
  let currentHeight = 0;

  for (let i = 0; i < rowsToProcess.length; i++) {
    const row = rowsToProcess[i];

    // Explicit page break: advance to next page before placing this row
    if (row.pageBreakBefore && currentPageRows.length > 0) {
      reflowedPages.push({
        pageNumber: currentPageNum,
        layoutRows: currentPageRows,
        blocks: extractAllBlocksFromRows(currentPageRows),
      });

      currentPageNum++;
      currentCapacity = getPageCapacity(currentPageNum, effectivePaperSize);
      currentPageRows = [];
      currentHeight = 0;
    }

    const isSingleTable =
      row.columns.length === 1 &&
      row.columns[0].blocks.length === 1 &&
      row.columns[0].blocks[0].type === "table";

    if (isSingleTable) {
      let table = { ...(row.columns[0].blocks[0] as TableBlock) };
      table.rows = [...table.rows];

      const rowMargin =
        (row.marginTop !== undefined ? row.marginTop : 0) +
        (row.marginBottom !== undefined ? row.marginBottom : 16) +
        (row.paddingTop !== undefined ? row.paddingTop : 0) +
        (row.paddingBottom !== undefined ? row.paddingBottom : 0);

      while (table.rows.length > 0) {
        const tableOverhead = getTableOverheadHeight(table) + rowMargin;
        const rowHeight = getTableRowHeight(table);
        const remainingCapacity = currentCapacity - currentHeight;

        if (remainingCapacity < tableOverhead + rowHeight && currentPageRows.length > 0) {
          reflowedPages.push({
            pageNumber: currentPageNum,
            layoutRows: currentPageRows,
            blocks: extractAllBlocksFromRows(currentPageRows),
          });

          currentPageNum++;
          currentCapacity = getPageCapacity(currentPageNum, effectivePaperSize);
          currentPageRows = [];
          currentHeight = 0;
          continue;
        }

        const spaceForRows = Math.max(0, remainingCapacity - tableOverhead);
        const maxRowsThatFit = Math.max(1, Math.floor(spaceForRows / rowHeight));

        if (table.rows.length <= maxRowsThatFit) {
          const finalTableHeight = tableOverhead + table.rows.length * rowHeight;
          const placedRow: PageGridRow = {
            id: row.id,
            columns: [{ id: row.columns[0].id, blocks: [table] }],
            marginTop: row.marginTop,
            marginBottom: row.marginBottom,
            paddingTop: row.paddingTop,
            paddingBottom: row.paddingBottom,
          };
          currentPageRows.push(placedRow);
          currentHeight += finalTableHeight;
          break;
        } else {
          const rowsForThisPage = table.rows.slice(0, maxRowsThatFit);
          const rowsForNextPage = table.rows.slice(maxRowsThatFit);

          const tablePart: TableBlock = {
            ...table,
            rows: rowsForThisPage,
          };

          const placedRow: PageGridRow = {
            id: row.id,
            columns: [{ id: row.columns[0].id, blocks: [tablePart] }],
            marginTop: row.marginTop,
            marginBottom: row.marginBottom,
            paddingTop: row.paddingTop,
            paddingBottom: row.paddingBottom,
          };
          currentPageRows.push(placedRow);

          reflowedPages.push({
            pageNumber: currentPageNum,
            layoutRows: currentPageRows,
            blocks: extractAllBlocksFromRows(currentPageRows),
          });

          currentPageNum++;
          currentCapacity = getPageCapacity(currentPageNum, effectivePaperSize);
          currentPageRows = [];
          currentHeight = 0;

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
      const rowHeight = getRowHeight(row);

      if (currentHeight + rowHeight > currentCapacity && currentPageRows.length > 0) {
        reflowedPages.push({
          pageNumber: currentPageNum,
          layoutRows: currentPageRows,
          blocks: extractAllBlocksFromRows(currentPageRows),
        });

        currentPageNum++;
        currentCapacity = getPageCapacity(currentPageNum, effectivePaperSize);
        currentPageRows = [row];
        currentHeight = rowHeight;
      } else {
        currentPageRows.push(row);
        currentHeight += rowHeight;
      }
    }
  }

  if (currentPageRows.length > 0) {
    reflowedPages.push({
      pageNumber: currentPageNum,
      layoutRows: currentPageRows,
      blocks: extractAllBlocksFromRows(currentPageRows),
    });
  }

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
