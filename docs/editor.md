# Feature Guide: Visual Editor & Canvas

## Overview
The Editor feature (`src/features/editor/`) is the central workspace of the document application. It manages dynamic block authoring, tool selection, canvas rendering, auto-pagination across multi-page document sheets, inline cell editing, and styling controls via the properties sidebar.

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
    │   ├── EditorCanvas.tsx       # Center white sheet on slate canvas with auto-pagination
    │   └── PropertiesPanel.tsx    # Right properties sidebar (Text & Table styling controls)
    ├── hooks/
    │   └── useEditorState.ts      # Central Zustand store for editor domain state & auto-persistence
    └── types/
        └── index.ts               # Domain types for blocks, pages, metadata, and styling
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
  * `Text Block`: Inserts a rich editable text block into the active page.
  * `Simple Table`: Inserts an interactive data table into the active page.
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
  * Pagination navigation: `[←] Page N of Total [→]` buttons with boundary disable states.
  * Zoom dropdown selector (`75%`, `100%`, `125%`, `150%`).
  * Fullscreen maximize toggle (`Maximize2`).
* **Document Sheet Container (`#document-sheet`):**
  * **Page 1 Branding Header:** Logo mark, editable company name (`"Your Company"`), tagline, and document title (`"VISUAL DOCUMENT"`).
  * **Metadata Grid (Page 1):** 3-column layout for `ISSUER/`, `CLIENT/`, and `No/Date:`.
  * **Continuation Page Header (Pages 2+):** Compact banner with company name, page badge, and reference number.
  * **Dynamic Canvas Blocks:**
    * **Table Block:** Editable rows (`Item Detail`, `Qty`, `Unit Price`, auto-computed `Amount`), `[+ Add Row]` button, and delete section action.
    * **Text Block:** Auto-expanding multiline note textarea with delete action.
    * **Image Block:** Responsive media container with caption.
    * **Shape Block:** Vibrant multi-stop gradient divider line.
  * **Canvas Footer:** Page counter note + 3-bar skewed graphic.

---

### 4. Properties & Data Panel (`src/features/editor/components/PropertiesPanel.tsx`)
Right sidebar (`w-full xl:w-80 2xl:w-[380px] 3xl:w-[440px]`, white background, bordered left).

* **Text Settings:**
  * Font Family selector (`Inter`).
  * Font Size input (`10px`).
  * Font Weight selector (`Medium`).
  * Text Color swatch preview (`#1F2937`).
  * Alignment buttons (`Left`, `Center`, `Right`).
* **Table Settings:**
  * Width (`120px`), Borders (`1px Solid #E5E7EB`), Padding (`0px`), and Row Spacing (`1px`).
* **Column & Row Management:**
  * Column Management: `[+ Add Column]` and `[Delete Column]`.
  * Row Management: `[+ Add Row]` and `[Delete Row]` wired directly to the active page's table.

---

## Automatic Pagination Engine

When users add components from the Toolbox, the editor estimates the layout capacity of the active page sheet before inserting:

```typescript
// Block weight calculations
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

const MAX_PAGE_CAPACITY = 5.5;
```

If `currentWeight + newWeight > MAX_PAGE_CAPACITY`, a new continuation page is automatically instantiated and focused, preventing visual overflows.

---

## Data Types & State Contracts

```typescript
export interface TableRowItem {
  id: number;
  item: string;
  qty: number;
  unitPrice: string;
  amount: string;
}

export interface TableBlock {
  id: string;
  type: "table";
  title: string;
  rows: TableRowItem[];
}

export interface TextBlock {
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

export interface CanvasPage {
  pageNumber: number;
  blocks: CanvasBlock[];
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