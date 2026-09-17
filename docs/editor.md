# Feature Guide: Visual Editor & Canvas

## Overview
The Editor feature (`src/features/editor/`) is the central workspace of the document application. It manages dynamic block authoring, tool selection, canvas rendering, bi-directional auto-pagination across multi-page A4 sheets, in-table and cell-level editing, dynamic page grid layout management, and real-time styling controls via the properties sidebar.

---

## Visual Structure & Component Hierarchy

```text
src/
├── components/layout/
│   ├── Header.tsx                 # Top application bar (Project Title, Undo/Redo, Save, PDF CTA)
│   └── TabBar.tsx                 # Multi-template tab switcher (Pure presentational)
└── features/editor/
    ├── components/
    │   ├── ComponentToolbox.tsx   # Left dark sidebar (Tools, Quick Add, Page Thumbnails)
    │   ├── EditorCanvas.tsx       # Center white sheet on slate canvas with A4 auto-pagination
    │   └── PropertiesPanel.tsx    # Right properties sidebar (Typography, Page Grid & Table controls)
    ├── hooks/
    │   └── useEditorState.ts      # Central Zustand store for editor domain state & auto-persistence
    └── types/
        └── index.ts               # Domain types for blocks, tables, pages, metadata, and styling
```

---

## Component Specifications

### 1. Application Header (`src/components/layout/Header.tsx`)
Located at the top of the viewport (`h-14 sm:h-16 2xl:h-20`, white background, bordered bottom).

* **Mobile Toolbox Toggle:** Drawer trigger icon (`PanelLeft`) visible on mobile/tablet viewports.
* **App Logo & Title:** File icon wrapped in a blue square badge (`bg-blue-600`) + `"Document Editor (PoC)"`.
* **Project Name Field:** Inline text input (`Project Name`) with default value `"Document Project V1"`.
* **Action Buttons (Right Section):**
  * `Properties` (`SlidersHorizontal` icon, mobile only): Smoothly scrolls down to the properties panel on small screens.
  * `Preview` (`Eye` icon): Document preview trigger.
  * `Save` (`Save` icon): Calls `saveCurrentTemplate()`.
  * `Download PDF` (`Download` icon): Primary action button (`bg-blue-600 text-white`) for PDF export.

---

### 2. Component Toolbox (`src/features/editor/components/ComponentToolbox.tsx`)
Fixed left sidebar (`bg-[#081225]` dark theme, `w-52` to `w-80` responsive width, full vertical height). On mobile, rendered inside a backdrop slide-out drawer.

* **Components Section:**
  * `Select`: Activates pointer selection mode (default active tool).
  * `Text Block`: Inserts a clean editable text block into the active page.
  * `Simple Table`: Inserts an interactive data table with default columns into the active page.
  * `Image`: Inserts an image / diagram block with placeholder asset preview.
  * `Shape`: Inserts a decorative geometric gradient divider.
* **Quick Add Actions:**
  * `[+ Add Simple Table]`: Appends a new data table node to the canvas.
  * `[+ Add New Text Line]`: Appends an editable text block.
* **Pages Manager:**
  * Displays sequential page preview cards (`Page 1`, `Page 2`...).
  * Highlights active page with blue border and badge.
  * `[+ Add Page]` button to append a new blank document continuation sheet.

---

### 3. Visual Canvas (`src/features/editor/components/EditorCanvas.tsx`)
Center work area rendered on `#f0f4f9` canvas background with `useMounted()` SSR hydration protection.

* **Viewport Top Controls:**
  * A4 Status Badge: `A4 • 210 × 297 mm`.
  * Pagination navigation: `[←] Page N of Total [→]` buttons with boundary disable states.
  * Zoom dropdown selector (`75%`, `100%`, `125%`, `150%`).
  * Fullscreen maximize toggle (`Maximize2`).
* **Document Sheet Container (`#document-sheet`):**
  * Exact standard A4 dimensions (`max-w-[794px] min-h-[1123px]`).
  * **Page 1 Branding Header:** Logo mark, editable company name (`"Your Company"`), tagline, compact document title (`"VISUAL DOCUMENT"`), and accent divider line.
  * **Page Grid Layout Rows:** Document content is structured into multi-column grid rows (`layoutRows: PageGridRow[]`):
    * **Row 1 (Metadata Row):** 3 columns housing editable `TextBlock` elements for `ISSUER/\nIssuer Details`, `Client Details`, and `No/Date: C-2026-061\n2026-09-14` (right-aligned), fully customizable via row/column management and typography controls.
    * **Row 2 (Table Row):** 1 column housing the `QUOTATION ITEMS` table.
    * **Custom Continuation Rows:** Each row contains 1 or more columns (`columns: PageGridColumn[]`), and each column houses modular blocks or quick element add triggers (`+ Text`, `+ Table`, `+ Image`, `+ Divider`).
  * **Dynamic Canvas Blocks:**
    * **Table Block:** Inline column headers with customizable labels and types, editable row cells, in-table `[+ Add Row]`, `[+ Add Col]`, and `[Del Col]` controls, auto-computed `Amount` column (`qty * unitPrice`), cell-specific typography styling, and delete table action.
    * **Text Block:** Zero-padding unobtrusive display when unselected; displays active blue selection border and editor controls when focused. Supports auto-expanding multiline text and custom typography.
    * **Image Block:** Responsive media container with caption.
    * **Shape Block:** Vibrant multi-stop gradient divider line.
  * **Canvas Footer:** Page counter note + 3-bar skewed graphic.

---

### 4. Properties & Data Panel (`src/features/editor/components/PropertiesPanel.tsx`)
Right sidebar (`w-full xl:w-80 2xl:w-[380px] 3xl:w-[440px]`, white background, bordered left).

* **Context-Aware Typography Settings:**
  * Target indicator displays current selection context:
    * *Text Block*: Updates whole text block.
    * *Table Block*: Updates entire table's base typography.
    * *Table Cell*: Updates the specific clicked cell (e.g. `Table Cell: Row 2, Item Detail`).
  * **Font Family:** Inter, Roboto, Outfit, Playfair Display, Merriweather, Fira Code.
  * **Font Size:** Numeric input + `+` / `-` incremental steppers.
  * **Font Weight:** Regular (400), Medium (500), Semibold (600), Bold (700).
  * **Text Color:** Native color picker with live hex code display.
  * **Text Alignment:** Left, Center, Right align toggles.
* **Table Settings:**
  * Width, Border style (`1px Solid #E5E7EB`), Padding (`0px`), and Row Spacing (`1px`).
* **Page Grid Column & Row Management (Layout Level):**
  * **Column Management:** `[+ Add Column]` and `[Delete Column]` to manage columns within the active Page Grid Row (e.g. creating 3 columns for Issuer, Client, Date).
  * **Row Management:** `[+ Add Row]` and `[Delete Row]` to manage layout grid rows on the active document page.

---

## A4 Page Sheets & Bi-Directional Auto-Pagination Engine

The editor renders document pages in standard **A4 Sheet Dimensions** (`210mm × 297mm` / `max-w-[794px] min-h-[1123px]`):

* **Page 1 Capacity (`PAGE_1_CAPACITY = 13.0` height units)**: Accounts for company branding header, document title, and the 3-column metadata grid (`ISSUER/`, `CLIENT/`, `No/Date:`).
* **Continuation Page Capacity (`PAGE_N_CAPACITY = 19.0` height units)**: Continuation pages feature a compact header and expanded usable content capacity.

### Bi-Directional Reflow & Table Row Splitting System (`reflowPages`)

1. **Continuous Sequential Reflow:**
   - On every state modification, `reflowPages` consolidates all page layout rows, re-merges any split table fragments via `mergeSplitTablesInRows`, and calculates layout row weights.
2. **Table Row Splitting across A4 Pages:**
   - Single-table layout rows evaluate their remaining page capacity:
     $$\text{spaceForRows} = \max(0.9, \text{currentCapacity} - \text{currentWeight} - 2.0)$$
     $$\text{maxRowsThatFit} = \max(1, \lfloor\text{spaceForRows} / 0.9\rfloor)$$
   - If the table contains more rows than fit on the current page, it splits:
     - `rows.slice(0, maxRowsThatFit)` stays on the current page.
     - The remaining rows overflow to a continuation table block on the next page (`${baseId}-split-${pageNum}`).
3. **Underflow & Pull-Back:**
   - When table rows or layout blocks are deleted, `mergeSplitTablesInRows` recombines all rows. If the entire table fits on Page 1, it pulls back automatically and removes trailing empty pages.
4. **Transparent Cross-Fragment Operations:**
   - All table mutation actions (`addTableRow`, `deleteTableRow`, `updateTableRow`, `updateTableCellStyle`, `addTableColumn`, `deleteTableColumn`, `removeElement`) resolve table blocks across pages using base ID matching (`isMatchingTableBlock`), allowing users to click `+ Add Row` on any page seamlessly.
5. **Auto-Navigation:**
   - Adding a table row that overflows to a new continuation page automatically focuses the newly created page.

```typescript
// Block height weight calculations
export const getBlockWeight = (block: CanvasBlock): number => {
  switch (block.type) {
    case "table": {
      const rowCount = block.rows ? block.rows.length : 0;
      return Math.max(2.0, 2.0 + rowCount * 0.9);
    }
    case "text": {
      const content = block.content || "";
      const explicitLines = content.split("\n").length;
      const wrappedLines = Math.floor(content.length / 50);
      const totalLines = Math.max(1, explicitLines + wrappedLines);
      const fontSizeMultiplier = (block.fontSize || 14) / 14;
      return Math.max(0.8, 0.5 + totalLines * 0.4 * fontSizeMultiplier);
    }
    case "image":
      return 3.5;
    case "shape":
      return 0.8;
    default:
      return 1.0;
  }
};
```

---

## Data Types & State Contracts

```typescript
export interface BlockTypographyStyle {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  align?: "left" | "center" | "right";
}

export interface TableColumn {
  id: string;
  label: string;
  align?: "left" | "center" | "right";
  width?: string;
  type?: "text" | "number" | "currency" | "calculated";
}

export interface TableRowItem {
  id: number;
  item: string;
  qty: number;
  unitPrice: string;
  amount: string;
  cellStyles?: Record<string, BlockTypographyStyle>;
  [key: string]: string | number | undefined | Record<string, BlockTypographyStyle>;
}

export interface SelectedCellLocation {
  blockId: string;
  rowId: number;
  columnKey: string;
}

export interface TableBlock extends BlockTypographyStyle {
  id: string;
  type: "table";
  title: string;
  columns?: TableColumn[];
  rows: TableRowItem[];
}

export interface TextBlock extends BlockTypographyStyle {
  id: string;
  type: "text";
  content: string;
  variant?: "heading" | "paragraph" | "callout";
}

export interface ImageBlock {
  id: string;
  type: "image";
  url?: string;
  caption: string;
}

export interface ShapeBlock {
  id: string;
  type: "shape";
  shapeType: "divider" | "banner" | "badge";
  color?: string;
}

export type CanvasBlock = TableBlock | TextBlock | ImageBlock | ShapeBlock;

export interface PageGridColumn {
  id: string;
  width?: string; // e.g. "1fr", "2fr", "auto"
  blocks: CanvasBlock[];
}

export interface PageGridRow {
  id: string;
  columns: PageGridColumn[];
}

export interface CanvasPage {
  pageNumber: number;
  blocks: CanvasBlock[];
  layoutRows?: PageGridRow[];
}

export interface DocumentMetadata {
  projectName?: string;
  companyName: string;
  companyTagline: string;
  documentTitle: string;
  issuerDetails: string;
  clientDetails: string;
  documentNumber: string;
  documentDate: string;
}

export interface DocumentStateSnapshot {
  metadata: DocumentMetadata;
  pages: CanvasPage[];
}
```