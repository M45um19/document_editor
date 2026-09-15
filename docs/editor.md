# Feature Guide: Visual Editor & Canvas

## Overview
The Editor feature (`src/features/editor/`) is the central interactive workspace of the document application. It encompasses top-level document controls, tool selection, canvas rendering, inline data editing, drag-and-drop table manipulation, and real-time formatting via the properties sidebar.

---

## Visual Structure & Component Hierarchy

```text
src/
├── components/layout/
│   ├── Header.tsx              # Top application bar (Project Title, Undo/Redo, CTA Buttons)
│   └── TabBar.tsx              # Multi-template tab switcher
└── features/editor/
    └── components/
        ├── ComponentToolbox.tsx # Left dark sidebar (Tool picker, Quick add, Page thumbnails)
        ├── EditorCanvas.tsx     # Center white sheet on slate background with inline editing
        └── PropertiesPanel.tsx  # Right properties sidebar (Text & Table styling controls)
```

---

## Detailed Component Specifications

### 1. Application Header (`src/components/layout/Header.tsx`)
Located at the top of the viewport (`h-16 2xl:h-20`, white background, bordered bottom).

* **App Logo & Title:**
  * Icon: File document icon wrapped in a blue square badge (`bg-blue-600`).
  * Title: `Document Editor (PoC)`.
* **Project Name Input:**
  * Displays an inline editable text field (`Project Name`) with default value `"Document Project V1"`.
  * Allows users to rename the active project; this name is used as the default filename when exporting PDFs.
* **History Controls:**
  * `Undo` (`Undo2` icon) and `Redo` (`Redo2` icon) action buttons for navigating state history.
* **Action Buttons (Right Section):**
  * `Preview` (`Eye` icon): Toggles full-screen document preview without edit chrome.
  * `Save` (`Save` icon): Saves the active document state directly to `localStorage` under key `"template1"`.
  * `Download PDF` (`Download` icon): Primary action button (`bg-blue-600 text-white`) that initiates client-side PDF export.

---

### 2. Multi-Template Tab Bar (`src/components/layout/TabBar.tsx`)
Located immediately below the header (`bg-[#eef2f7]`).

* **Tab Strip:**
  * Displays open template tabs (e.g., `"New-Template"`, `"Template-1"`).
  * **Active Tab:** White background (`bg-white`), blue text and accent border (`text-blue-600`), close icon (`X`).
  * **Inactive Tab:** Subtle slate styling with hover transition, close icon (`X`).
* **Add Tab Button:**
  * Plus icon (`Plus`) to spawn a new blank template workspace.

---

### 3. Component Toolbox (`src/features/editor/components/ComponentToolbox.tsx`)
Fixed left sidebar (`bg-[#081225]` dark theme, `w-52` to `w-80` responsive width, full vertical height).

* **Components Section:**
  * `Select`: Activates pointer selection mode (default active tool, highlighted blue).
  * `Text Block`: Tool for inserting standalone formatted text blocks.
  * `Simple Table`: Tool for inserting a new data table node.
  * `Image`: Tool for uploading or placing image elements.
  * `Shape`: Tool for inserting geometric decorative dividers or shapes.
* **Quick Add Actions:**
  * `[+ Add Simple Table]`: Immediately appends a default 5-row table to the active canvas page.
  * `[+ Add New Text Line]`: Appends a single-line editable text item.
* **Pages Manager:**
  * Renders visual page thumbnails (`aspect-[4/3]` white preview cards with page number badge).
  * Highlights active page with a blue border and badge.
  * `[+ Add Page]` button to add additional document pages.

---

### 4. Visual Canvas (`src/features/editor/components/EditorCanvas.tsx`)
Center work area rendered on `#f0f4f9` canvas background.

* **Viewport Controls:**
  * Zoom dropdown selector (`100%`, `75%`, `125%`, `150%`).
  * Fullscreen maximize toggle (`Maximize2`).
* **Document Sheet (A4-Style White Container):**
  * **Company Header:** Geometric blue logo mark, company name (`"Your Company"`), and tagline (`"Better Documents, Better Business"`). Document title (`"VISUAL DOCUMENT"`).
  * **3-Column Metadata Grid:**
    * Column 1: `ISSUER/` details.
    * Column 2: `Client Details`.
    * Column 3: `No/Date:` (e.g., `C-2026-061`, `2026-09-14`).
  * **Quotation Items Table:**
    * **Header Controls:** Spreadsheet icon, title `"QUOTATION ITEMS"`, `[+ Add Column]` button, and `[Trash2]` delete table button.
    * **Columns:**
      1. Drag Handle: `⋮⋮` (`GripVertical`) icon for drag-and-drop vertical row reordering.
      2. `#`: Auto-incrementing row index number (1, 2, 3...).
      3. `Item Detail`: Editable text cell with blue highlight on focus.
      4. `Qty`: Numeric input for quantity.
      5. `Unit Price`: Unit currency price string.
      6. `Amount`: Computed line item total (`Qty * UnitPrice`).
    * **Row Drag-and-Drop:** Powered by `@dnd-kit/sortable` with smooth reorder transitions.
    * **Add Row Action:** `[+ Add Row]` button located below the table body.
  * **Canvas Footer:**
    * Export disclaimer note (`"Note: Full PDF layout rendered only upon export."`).
    * Decorative 3-bar skewed geometric graphic.

---

### 5. Properties & Data Panel (`src/features/editor/components/PropertiesPanel.tsx`)
Right sidebar (`w-72` to `w-[440px]` responsive width, white background, bordered left). Equal in height to the canvas row.

* **Panel Header:** Sliders icon (`SlidersHorizontal`) + `"Properties & Data"`.
* **Text Settings:**
  * **Font Family:** Select dropdown (`Inter`, `Roboto`, `Outfit`, `monospace`).
  * **Font Size:** Numeric input field with `"px"` unit suffix (default: `10px`).
  * **Font Weight:** Select dropdown (`Regular`, `Medium`, `SemiBold`, `Bold`).
  * **Text Color:** Color swatch preview box + Hex color string (default: `#1F2937`).
  * **Alignment:** Segmented button group for `Left`, `Center`, and `Right` alignment.
* **Table Settings:**
  * **Width:** Numeric input with `"px"` unit (default: `120px`).
  * **Borders:** Border style and color selector (default: `1px Solid #E5E7EB`).
  * **Padding:** Cell padding input with `"px"` unit (default: `0px`).
  * **Row Spacing:** Row margin/gap input with `"px"` unit (default: `1px`).
* **Column & Row Management:**
  * **Column Management:** `[+ Add Column]` and `[Delete Column]` buttons.
  * **Row Management:** `[+ Add Row]` and `[Delete Row]` buttons.

---

## Data Types & State Contracts

```typescript
export interface TableRowItem {
  id: string | number;
  item: string;
  qty: number;
  unitPrice: number;
  amount: number;
}

export interface TextStyleSettings {
  fontFamily: string;
  fontSize: number;
  fontWeight: 'normal' | 'medium' | 'semibold' | 'bold';
  color: string;
  align: 'left' | 'center' | 'right';
}

export interface TableStyleSettings {
  width: number;
  borderStyle: string;
  padding: number;
  rowSpacing: number;
}

export interface DocumentMetadata {
  projectName: string;
  issuerDetails: string;
  clientDetails: string;
  documentNumber: string;
  documentDate: string;
}

export interface DocumentState {
  metadata: DocumentMetadata;
  textStyles: TextStyleSettings;
  tableStyles: TableStyleSettings;
  tableRows: TableRowItem[];
  zoomLevel: number;
  activeTool: 'select' | 'text' | 'table' | 'image' | 'shape';
  activePage: number;
  totalPages: number;
}
```

---

## Performance & State Guidelines

1. **Fine-Grained Selectors:** Always use atomic selectors when reading from the Zustand store:
   ```typescript
   // Good: Subscribes only to textStyles
   const textStyles = useEditorStore((state) => state.textStyles);

   // Bad: Causes full re-render on any store change
   const store = useEditorStore();
   ```
2. **Debounced Text Updates:** When binding inline text inputs (e.g. `Item Detail`, `Project Name`), debounce store writes by 150ms to maintain smooth 60fps typing.
3. **DnD Optimistic Updates:** `@dnd-kit` drag movements must reorder local array indexes instantaneously before committing final order to store history.