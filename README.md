# Visual Document Editor (PoC)

An interactive visual document editor and template management system built with Next.js (App Router), engineered for high performance, modular architecture, and strict type safety.

## Detailed Tech Stack

| Category | Technology / Package | Purpose & Usage |
| :--- | :--- | :--- |
| **Core Framework** | Next.js 14+ (App Router) | Handles application routing, layouts, SSR/SSG boundaries, and server integration. |
| **Language** | TypeScript (Strict Mode) | Strict type checking (`noImplicitAny: true`). Zero `any` types allowed across the codebase. |
| **State Management** | Zustand | Centralized reactive store managing canvas nodes, active tabs, undo/redo stacks, and template hydration. |
| **Styling** | Tailwind CSS | Utility-first styling aligned with modern UI design systems. |
| **Drag & Drop** | `@dnd-kit/core`, `@dnd-kit/sortable` | Vertical drag handles (`⋮⋮`) for table row reordering and canvas element manipulation. |
| **PDF Generation** | `html2canvas-pro` & `jspdf` | High-resolution multi-page client-side PDF export with modern color space (oklab/lab/oklch) support. |
| **Validation** | Zod | Runtime schema validation for forms, state contracts, and environment variables. |
| **Icons & Primitives** | Lucide React | Clean, accessible vector icons across navigation and toolbars. |

## Key Features

- **Multi-Paper Engine:** Switch seamlessly between **Tabloid / Ledger** (Default, 11 × 17 in), **A4** (210 × 297 mm), **Letter** (8.5 × 11 in), and **Legal** (8.5 × 14 in) with bi-directional auto-pagination and table row splitting.
- **Visual Drag & Drop Controls:**
  - Drag-and-drop table row reordering via `@dnd-kit/core` & `@dnd-kit/sortable`.
  - Canvas-driven interactive ↕ top/bottom row margin resizing (`0px` to `300px`).
  - Draggable column border resizing with real-time percentage width redistribution.
- **Document Preview Modal:** Full-screen print-accurate document viewer supporting both All Pages (continuous) and Single Page views.
- **Direct PDF Export:** Client-side high-DPI multi-page `.pdf` file generation and download with 100% canvas visual parity (zero system print popups).
- **Multi-Template Management:** Tab-based template switcher with per-template LocalStorage isolation.

## Project Architecture & Folder Structure

This repository follows a strict **Feature-Driven Modular Architecture** where each domain under `src/features/` encapsulates its own UI components, state hooks, services, and types.

```text
src/
├── app/                  # ROUTING LAYER (Next.js App Router: page.tsx, layout.tsx, globals.css)
├── components/           # GLOBAL PURE UI (Shared presentation primitives: Header.tsx, TabBar.tsx)
├── features/             # THE CORE DOMAIN (Business boundaries isolated cleanly by feature)
│   ├── editor/           # Canvas, drag-and-drop, row margins, column resizing, and property controls
│   │   ├── components/   # ComponentToolbox.tsx, EditorCanvas.tsx, PropertiesPanel.tsx
│   │   ├── hooks/        # useEditorState.ts (Pagination, reflowPages, row margins, column widths)
│   │   └── types/        # Domain types (CanvasBlock, PageGridRow, PaperSize, FONT_FAMILY_MAP)
│   ├── templates/        # Template management, persistence, tab bar synchronization, and cards
│   │   ├── components/   # SavedTemplatesPanel.tsx (Template cards, timestamp tracking, save CTA)
│   │   └── hooks/        # useTemplatesState.ts (LocalStorage slots, active tab sync, auto-migration)
│   ├── preview/          # High-fidelity document preview and clean presentation
│   │   └── components/   # CleanDocumentSheet.tsx (Pristine renderer), DocumentPreviewModal.tsx
│   └── export/           # High-DPI PDF generation and direct download pipeline
│       └── services/     # pdfExportService.ts (html2canvas-pro + jsPDF multi-page compiler)
├── hooks/                # GLOBAL UI HOOKS (useNavbar.ts for drawers/modals, useMounted.ts for SSR safety)
└── types/                # Core shared TypeScript interfaces and paper configuration schemas

docs/                     # DOCUMENTATION HUB (Detailed guides for Developers & AI Agents)
├── index.md              # Documentation Index & Architecture Blueprint
├── editor.md             # Matches features/editor/ (Canvas, Dnd-kit, Styling, Grid Rows)
├── templates.md          # Matches features/templates/ (LocalStorage isolation & tab sync)
└── export.md             # Matches features/export/ & features/preview/ (Direct PDF export engine)
```

---

## Detailed Features Breakdown

### 1. Visual Editor (`src/features/editor/`)
The core document authoring and interactive layout workspace.

* **Components (`components/`):**
  * `EditorCanvas.tsx`: The central document canvas. Implements bi-directional pagination across multi-page sheets, `@dnd-kit` table row drag-and-drop reordering, draggable column border width resizing, canvas-driven ↕ top/bottom row margin handles (`0px` to `300px`), paper size switching, and zoom controls.
  * `ComponentToolbox.tsx`: Dark-themed left sidebar providing component insertion tools (Text Blocks, Data Tables, Image Blocks, Geometric Divider Shapes), quick-add buttons, and sequential page thumbnail navigation.
  * `PropertiesPanel.tsx`: Right sidebar for real-time styling: Google Fonts picker, font sizes, weights, colors, text alignment, table borders, cell paddings, row spacings, cell-level overrides, image upload/logo settings, and dynamic grid row/column controls.
* **State Management (`hooks/useEditorState.ts`):**
  * Central Zustand store managing canvas pages, grid rows, blocks, paper sizes, active selection, and auto-saving.
  * Houses the **Bi-directional Pagination & Reflow Engine (`reflowPages`)**, which calculates physical paper height capacities and splits overflowing tables into continuation sheets across pages.
* **Domain Types (`types/index.ts`):**
  * Defines interfaces for `CanvasBlock`, `TableBlock`, `TextBlock`, `ImageBlock`, `ShapeBlock`, `PageGridRow`, `PageGridColumn`, `PaperSize`, `PAPER_SIZES`, `FONT_FAMILY_MAP`, and `DEFAULT_TABLE_COLUMNS`.

---

### 2. Multi-Template Management (`src/features/templates/`)
Handles template lifecycle, tab bar synchronization, and persistent storage.

* **Components (`components/`):**
  * `SavedTemplatesPanel.tsx`: Bottom workspace panel displaying saved template cards with live metadata, active status badges, formatted save timestamps, "Open / Current" switch actions, delete actions, and "Save as Current Template" button.
* **State Management (`hooks/useTemplatesState.ts`):**
  * Manages active template IDs and tab synchronization.
  * Enforces **Per-Template Storage Isolation**: Each template saves to its own distinct `localStorage` slot (`doc_template_data_${templateId}`), preventing data collision.
  * Automatically applies default **Tabloid / Ledger** paper format to newly created templates.
  * Auto-migrates legacy template snapshots to the modern grid row header structure.

---

### 3. Document Preview (`src/features/preview/`)
Provides a clean, print-accurate representation of the document.

* **Components (`components/`):**
  * `CleanDocumentSheet.tsx`: Renders the document sheet in a pristine state—identical to the canvas in typography, custom cell styles, SVG logos, and divider gradients, but with **zero editor UI chrome** (no drag handles, margin resize pills, cell outlines, or delete buttons).
  * `DocumentPreviewModal.tsx`: Full-screen modal overlay offering **All Pages** (continuous scroll) and **Single Page** (with page switcher) view modes and direct PDF download action.

---

### 4. PDF Export Engine (`src/features/export/`)
Generates high-resolution multi-page PDF files entirely on the client side.

* **Services (`services/pdfExportService.ts`):**
  * Uses `html2canvas-pro` to seamlessly parse modern Tailwind CSS v4 color spaces (`oklab()`, `lab()`, `oklch()`, `color-mix()`) without rendering errors.
  * Copies root font CSS variables (`--font-inter`, `--font-roboto`, `--font-outfit`, `--font-playfair`, etc.) to the export engine to preserve custom typography.
  * Compiles multi-page PDF documents matching the exact paper dimensions (Tabloid, A4, Letter, Legal) with `jsPDF`.
  * Triggers an automatic direct `.pdf` file download without opening browser print dialogs or modals.

---

### 5. Shared Layout & Global Hooks (`src/components/layout/` & `src/hooks/`)
* `Header.tsx`: Top navigation bar with inline project title editing, undo/redo buttons, Preview modal trigger, animated emerald Save confirmation badge, and direct Download PDF button.
* `TabBar.tsx`: Presentational multi-template tab switcher with '+' add tab button.
* `useNavbar.ts`: Global UI state store for mobile toolbox drawers and modal visibility.
* `useMounted.ts`: Client-side mount hook preventing Next.js SSR hydration mismatch.


## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```