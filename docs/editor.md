# Feature Guide: Visual Editor & Canvas

## Overview
The Editor feature (`src/features/editor/`) is the central workspace of the document application. It manages dynamic block authoring, tool selection, canvas rendering, bi-directional auto-pagination across multi-page A4 sheets, in-table and cell-level editing, inline table heading and column name customization, dynamic page grid layout management, interactive column border drag-resizing, canvas-driven top/bottom row margin resizing, and real-time styling controls via the properties sidebar.

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
    │   ├── EditorCanvas.tsx       # Center white sheet on slate canvas with A4 auto-pagination, margin & col resizers
    │   └── PropertiesPanel.tsx    # Right properties sidebar (Typography, Image/Logo, Divider, Table & Page Grid)
    ├── hooks/
    │   └── useEditorState.ts      # Central Zustand store for editor domain state, column widths & auto-persistence
    └── types/
        └── index.ts               # Domain types for blocks, tables, pages, metadata, column widths, and styling
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
  * `Image`: Inserts an image / logo block with preset icon or custom upload.
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
  * Clicking the blank document sheet clears active selection and resets canvas to clean document mode.
  * **Dynamic Page Grid Layout Rows:** All document content (including headers) is structured into modular grid rows (`layoutRows: PageGridRow[]`):
    * **Row 1 (`page-row-header`):** 3 columns housing:
      * *Column 1 (`col-header-logo`, 8% width):* ImageBlock with preset blue geometric icon or uploaded logo asset.
      * *Column 2 (`col-header-company`, 52% width):* TextBlock for `"Your Company"` (22px bold) + TextBlock for `"Better Documents, Better Business"` (12px muted).
      * *Column 3 (`col-header-title`, 40% width):* TextBlock for `"VISUAL DOCUMENT"` (22px bold, right-aligned).
    * **Row 2 (`page-row-divider`):** 1 column (100% width) housing a decorative ShapeBlock accent line (`1.5px` height, blue gradient).
    * **Row 3 (`page-row-meta`):** 3 columns housing editable `TextBlock` elements for `ISSUER/\nIssuer Details`, `Client Details`, and `No/Date: C-2026-061\n2026-09-14`.
    * **Row 4 (`page-row-table`):** 1 column housing the `QUOTATION ITEMS` data table.
    * **Continuation Rows:** Multi-column rows containing text, tables, images, or dividers.
* **Canvas-Driven ↕ Row Margin Resizing (`RowMarginHandle`):**
  * Each grid row includes interactive **Top Margin** and **Bottom Margin** drag handles on the canvas.
  * Dragging handles adjusts vertical spacing (`marginTop`, `marginBottom` from `0px` to `300px`) with live dashed guideline overlays and tooltip badges.
  * Row toolbars are positioned absolutely (`absolute -top-7`) and rows use `py-0`, ensuring that when margins are set to `0px`, rows sit tightly together with zero phantom gap.
* **Draggable Column Border Resizing:**
  * Draggable resize handles (`cursor-col-resize`) sit between adjacent column pairs.
  * Adjusting a divider line recalculates the left and right column percentage widths in real time (`handleResizeMouseDown`).
  * Enforces an `8%` minimum column width boundary to prevent column collapse.
* **Inline Editable Table Heading & Column Names:**
  * **Table Heading:** Direct inline input next to the spreadsheet icon to rename headings (e.g. `"QUOTATION ITEMS"`).
  * **Column Names:** Each `<th>` header is an inline input allowing users to customize column labels directly in place.
* **Idle vs. Hover vs. Selection Visual Modes:**
  * **Idle Mode (Unselected & Unhovered):** Pristine printed document look. Inputs are transparent and borderless. Action buttons, row headers, and column dividers remain invisible (`opacity-0 pointer-events-none`).
  * **Hover Mode:** Fades in edit buttons, row drag handles, margin resize handles, and divider lines (`group-hover:opacity-100`).
  * **Selected Mode:** Pins controls and active highlight halos (`border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/10`).

---

### 4. Properties & Data Panel (`src/features/editor/components/PropertiesPanel.tsx`)
Right sidebar (`w-full xl:w-80 2xl:w-[380px] 3xl:w-[440px]`, white background, bordered left).

* **Context-Aware Typography Settings:**
  * Target indicator displays current selection context: Text Block, Table Block, or specific Table Cell.
  * **Font Family:** Inter, Roboto, Outfit, Playfair Display, Merriweather, Fira Code, Arial, Georgia, Courier New.
  * **Font Size:** Numeric input + incremental steppers.
  * **Font Weight:** Regular (400), Medium (500), Semibold (600), Bold (700), ExtraBold (800).
  * **Text Color:** Native color picker with live hex code display.
  * **Text Alignment:** Left, Center, Right align toggles.
* **Image & Logo Settings (Contextual):**
  * Displays when an Image block or Logo preset is selected.
  * **Image Source Toggle:** Switch between Preset Blue Logo and Upload Image / Custom URL.
  * **Size Inputs:** Width and Height (supports px and % values).
  * **Size Presets:** Quick buttons for Logo (42px), 80px, Medium (140px), Full (100%).
  * **Alignment:** Left, Center, Right alignment.
* **Divider Settings (Contextual):**
  * Displays when a Shape divider block is selected.
  * **Color:** Native color picker and hex code input.
  * **Thickness / Height:** Numeric input for line thickness in pixels.
* **Table Settings:**
  * **Width:** Flexible input (`100%`, `85%`, `600px`).
  * **Borders:** Preset dropdown (`1px Solid Light`, `1px Solid Slate`, `2px Solid Dark`, `2px Solid Blue`, `1px Dashed`, `1px Dotted`, `2px Double`, `None`).
  * **Cell Padding:** Numeric input (`0px - 40px`).
  * **Row Spacing:** Numeric input (`0px - 40px`).
* **Page Grid Column & Row Management:**
  * **Column Management:** `[+ Add Column]` and `[Delete Column]` to manage columns within the active Page Grid Row. Adding or removing columns automatically normalizes percentage widths across all columns to sum to 100%.
  * **Row Management:** `[+ Add Row]` and `[Delete Row]` to add or remove layout grid rows on the active document page. (Vertical row margins are managed directly via the visual handles on the canvas).

---

## Interactive Column & Row Resizing Systems

### 1. Column Resizing Physics (`EditorCanvas.tsx`)
The grid layout allows flexible column widths using fluid percentage values:
- Each column in `PageGridColumn` carries an optional `width?: number` (percentage value, e.g. `20` for 20%).
- If not explicitly set, columns default to equal shares (`Math.round(100 / colCount * 10) / 10`).
- Dragging a divider between column $i$ and $i+1$ calculates $\Delta\% = \frac{\Delta x}{W_{px}} \times 100$ and constrains widths to $\ge 8\%$.
- Commits updated widths via `updateRowColumnWidths(pageNum, rowId, updatedWidths)`.

### 2. Row Margin Resizing Physics (`EditorCanvas.tsx`)
- Dragging top or bottom `RowMarginHandle` adjusts row spacing dynamically from `0px` to `300px`.
- Real-time mouse movement updates `marginTop` or `marginBottom` on the parent row and renders guideline height indicators.
- Commits margins via `updateRowMargins(pageNum, rowId, { marginTop, marginBottom })`.

---

## A4 Page Sheets & Bi-Directional Auto-Pagination Engine

The editor renders document pages in standard **A4 Sheet Dimensions** (`210mm × 297mm` / `max-w-[794px] min-h-[1123px]`):

* **Page 1 Capacity (`PAGE_1_CAPACITY = 13.0` height units)**: Accounts for dynamic header row, divider row, and the 3-column metadata grid.
* **Continuation Page Capacity (`PAGE_N_CAPACITY = 19.0` height units)**: Continuation pages feature a compact continuation header and expanded usable content capacity.

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
     - Table styling (`tableWidth`, `borderStyle`, `padding`, `rowSpacing`, `title`) is preserved across split continuations.
3. **Underflow & Pull-Back:**
   - When table rows or layout blocks are deleted, `mergeSplitTablesInRows` recombines all rows. If the entire table fits on Page 1, it pulls back automatically and removes trailing empty pages.
4. **Transparent Cross-Fragment Operations:**
   - All table mutation actions resolve table blocks across pages using base ID matching (`isMatchingTableBlock`).
5. **Auto-Navigation:**
   - Adding a table row that overflows to a new continuation page automatically focuses the newly created page.

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

export interface TableStyleSettings {
  tableWidth?: string | number;
  borderStyle?: string;
  padding?: number;
  rowSpacing?: number;
}

export interface BorderStyleOption {
  label: string;
  value: string;
}

export const DEFAULT_BORDER_STYLE_OPTIONS: BorderStyleOption[] = [
  { label: "1px Solid Light (#E5E7EB)", value: "1px solid #E5E7EB" },
  { label: "1px Solid Slate (#94A3B8)", value: "1px solid #94A3B8" },
  { label: "2px Solid Dark (#1E293B)", value: "2px solid #1E293B" },
  { label: "2px Solid Blue (#3B82F6)", value: "2px solid #3B82F6" },
  { label: "1px Dashed (#CBD5E1)", value: "1px dashed #CBD5E1" },
  { label: "1px Dotted (#94A3B8)", value: "1px dotted #94A3B8" },
  { label: "2px Double (#CBD5E1)", value: "2px double #CBD5E1" },
  { label: "None (Borderless)", value: "none" },
];

export interface TableBlock extends BlockTypographyStyle, TableStyleSettings {
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
  caption?: string;
  width?: number | string;
  height?: number | string;
  align?: "left" | "center" | "right";
  borderRadius?: number;
  isLogoPreset?: boolean;
}

export interface ShapeBlock {
  id: string;
  type: "shape";
  shapeType: "divider" | "banner" | "badge";
  color?: string;
  height?: number;
  width?: string;
}

export type CanvasBlock = TableBlock | TextBlock | ImageBlock | ShapeBlock;

export interface PageGridColumn {
  id: string;
  width?: number; // percentage width of the row (e.g. 20 for 20%, 33.3 for 33.3%)
  blocks: CanvasBlock[];
}

export interface PageGridRow {
  id: string;
  columns: PageGridColumn[];
  marginTop?: number;
  marginBottom?: number;
  paddingTop?: number;
  paddingBottom?: number;
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