# Visual Document Editor (PoC)

An interactive, high-performance visual document editor and template management system built with Next.js (App Router), Tailwind CSS v4, and Zustand. Engineered for fluid document authoring, real-time typography styling, bi-directional multi-page pagination, drag-and-drop layout controls, and direct high-DPI PDF exports.

---

## Key Features

- **Standard A4 Default & Multi-Paper Engine:**
  - Standard **A4** default (`210 × 297 mm` / `794 × 1123 px`), with seamless switching between **Tabloid / Ledger** (`11 × 17 in`), **Letter (US)** (`8.5 × 11 in`), and **Legal (US)** (`8.5 × 14 in`).
  - Bi-directional auto-pagination engine that dynamically splits table rows across continuation pages and re-merges them automatically on content deletion or format changes.
- **Multi-Level Undo & Redo History System:**
  - Full history timeline traversal with `past` and `future` snapshot stacks.
  - Global keyboard shortcuts: `Ctrl+Z` / `Cmd+Z` (Undo), `Ctrl+Y` / `Ctrl+Shift+Z` / `Cmd+Shift+Z` (Redo).
  - Smart 800ms debounce grouping for smooth, continuous text input without micro-undo fragmentation.
- **Full In-Table Inline & Cell Editing:**
  - Direct canvas editing for all table cells: Item name, Quantity, Unit Price, Amount, and custom columns.
  - Real-time automatic recalculation of the Amount column (`qty × unitPrice`) with support for custom manual overrides.
  - Drag-and-drop table row reordering via `@dnd-kit/core` & `@dnd-kit/sortable`.
- **Instant Real-Time Auto-Expanding Text Blocks:**
  - Synchronous pre-paint auto-resizing (`useIsomorphicLayoutEffect`) that instantly expands or contracts text bounding boxes when typing, pasting, or altering font size / family / weight with zero clipping.
  - Decoupled from height transitions and connected to `document.fonts.ready` for pixel-accurate Google Fonts rendering.
- **Intelligent Component Insertion:**
  - Adding tables, text blocks, images, or divider shapes automatically generates dedicated 100%-width rows without distorting header or metadata columns.
- **Visual Drag & Drop Layout Controls:**
  - Canvas-driven interactive ↕ top/bottom row margin resizing (`0px` to `300px`) with live guideline overlays.
  - Draggable column border resizing with real-time percentage width redistribution and an 8% minimum width bound.
- **Print-Accurate Document Preview Modal:**
  - Full-screen modal displaying pristine, multi-page document views with zero editor chrome.
  - Supports both **All Pages** (continuous scroll) and **Single Page** view modes.
- **Direct Client-Side PDF Export:**
  - High-resolution multi-page PDF generation via `html2canvas-pro` and `jsPDF`.
  - 100% visual parity with canvas typography, cell styles, SVG logos, and divider gradients with zero system print popups.
- **Multi-Template Management & Storage Isolation:**
  - Tab-based template switcher with per-template LocalStorage slots (`doc_template_data_${templateId}`), preventing cross-template data pollution.
  - Saved Templates panel with template cards, active badges, timestamps, and auto-migration for legacy templates.

---

## Detailed Tech Stack

| Category | Technology / Package | Purpose & Usage |
| :--- | :--- | :--- |
| **Core Framework** | Next.js 16 (App Router) | Application routing, server/client boundaries, Turbopack, and SSR safety. |
| **Language** | TypeScript (Strict Mode) | Strict type checking (`noImplicitAny: true`). Zero `any` types across the codebase. |
| **State Management** | Zustand | Central reactive store managing canvas nodes, active tabs, undo/redo stacks, and template hydration. |
| **Styling** | Tailwind CSS v4 | Utility-first styling with modern color spaces (`oklab`, `color-mix`) and CSS variables. |
| **Drag & Drop** | `@dnd-kit/core`, `@dnd-kit/sortable` | Vertical drag handles (`⋮⋮`) for table row reordering and canvas element manipulation. |
| **PDF Generation** | `html2canvas-pro` & `jspdf` | High-resolution multi-page client-side PDF export with modern CSS color support. |
| **Validation** | Zod | Runtime schema validation for forms, state contracts, and environment variables. |
| **Icons & Primitives** | Lucide React | Clean, accessible vector icons across navigation, toolbars, and controls. |

---

## How to Run Locally

Follow these step-by-step instructions to get the project running on your local machine.

### 1. Prerequisites

Make sure you have the following installed on your system:
- **Node.js**: `v18.18.0` or higher (Node `v20.x` or `v22.x` recommended)
- **Package Manager**: `npm` (comes with Node.js), `pnpm`, `yarn`, or `bun`

Verify your Node and npm versions:
```bash
node -v
npm -v
```

---

### 2. Clone the Repository

```bash
git clone https://github.com/M45um19/document_editor.git
cd document_editor
```

---

### 3. Install Dependencies

Install all required project dependencies:
```bash
npm install
```
*(Or `pnpm install`, `yarn install`, `bun install` if using an alternative package manager)*

---

### 4. Start the Development Server

Launch the Next.js local development server:
```bash
npm run dev
```

Once started, open your browser and navigate to:
```
http://localhost:3000
```

The application will reload automatically when you modify files.

---

### 5. Production Build & Local Preview

To test the optimized production build locally:

```bash
# 1. Create an optimized production build
npm run build

# 2. Start the production server
npm start
```

Then visit `http://localhost:3000` to preview the production build.

---

### Available Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts the local development server with Turbopack on `http://localhost:3000`. |
| `npm run build` | Compiles and builds the Next.js application for production. |
| `npm run start` | Runs the compiled production build locally. |
| `npm run lint` | Runs ESLint to check for code quality and style issues. |
| `npx tsc --noEmit` | Runs the TypeScript compiler to verify type safety across the entire codebase. |

---

## Project Architecture & Folder Structure

This repository follows a strict **Feature-Driven Modular Architecture** where each domain under `src/features/` encapsulates its own UI components, state hooks, services, and types.

```text
src/
├── app/                  # ROUTING LAYER (Next.js App Router: page.tsx, layout.tsx, globals.css)
├── components/           # GLOBAL PURE UI (Shared presentation primitives: Header.tsx, TabBar.tsx)
├── features/             # THE CORE DOMAIN (Business boundaries isolated cleanly by feature)
│   ├── editor/           # Canvas, drag-and-drop, row margins, column resizing, and property controls
│   │   ├── components/   # blocks/, canvas/, properties/, toolbox/, common/, index.ts
│   │   ├── hooks/        # useEditorState.ts (Zustand state store, undo/redo, actions)
│   │   ├── utils/        # paginationUtils.ts (Pure reflow math, row height, table splitting)
│   │   └── types/        # Domain types (CanvasBlock, PageGridRow, PaperSize, FONT_FAMILY_MAP)
│   ├── templates/        # Template management, persistence, tab bar synchronization, and cards
│   │   ├── components/   # panel/SavedTemplatesPanel.tsx, cards/TemplateCard.tsx, index.ts
│   │   ├── hooks/        # useTemplatesState.ts (LocalStorage slots, active tab sync)
│   │   ├── utils/        # templateUtils.ts (Initial data, storage helpers, auto-migration)
│   │   └── types/        # SavedTemplateItem, TemplatesStoreState, TemplateCardProps
│   ├── preview/          # High-fidelity document preview and clean presentation
│   │   ├── components/   # sheet/CleanDocumentSheet.tsx, modal/DocumentPreviewModal.tsx, index.ts
│   │   └── types/        # CleanDocumentSheetProps, PreviewMode, DocumentPreviewModalProps
│   └── export/           # High-DPI PDF generation and direct download pipeline
│       ├── services/     # pdfExportService.ts (html2canvas-pro + jsPDF multi-page compiler)
│       ├── utils/        # exportUtils.ts (PAPER_FORMAT_MAP, file name sanitization)
│       ├── types/        # ExportPdfOptions, PaperFormatConfig
│       └── index.ts      # Feature barrel export
├── hooks/                # GLOBAL UI HOOKS (useNavbar.ts for drawers/modals, useMounted.ts for SSR safety)
└── types/                # Core shared TypeScript interfaces and paper configuration schemas

docs/                     # DOCUMENTATION HUB (Detailed architectural and feature guides)
├── index.md              # Documentation Index & Architecture Blueprint
├── editor.md             # Matches features/editor/ (Canvas, Dnd-kit, Styling, Grid Rows)
├── templates.md          # Matches features/templates/ (LocalStorage isolation & tab sync)
└── export.md             # Matches features/export/ & features/preview/ (Direct PDF export engine)
```

---

## Detailed Features Breakdown

### 1. Visual Editor (`src/features/editor/`)
The core document authoring and interactive layout workspace.
- **Components (`components/`):** `CanvasTextBlock.tsx`, `CanvasTableBlock.tsx`, `CanvasImageBlock.tsx`, `CanvasShapeBlock.tsx`, `SortableTableRow.tsx`, `EditorCanvas.tsx`, `CanvasPageSheet.tsx`, `RowMarginHandle.tsx`, `PropertiesPanel.tsx`, `ComponentToolbox.tsx`, `AutoExpandingTextarea.tsx`.
- **State Management (`hooks/useEditorState.ts`):** Reactive Zustand store managing canvas modifications, block properties, undo/redo history stacks (`past`, `future`), and template loading.
- **Pure Utilities (`utils/paginationUtils.ts`):** Pure calculation engine for bi-directional auto-pagination (`reflowPages`), table row splitting across pages, pixel capacity budgets, and text wrap estimation.

### 2. Multi-Template Management (`src/features/templates/`)
Handles template lifecycle, tab bar synchronization, and persistent storage.
- **Per-Template Storage Isolation:** Each template saves to its own distinct `localStorage` slot (`doc_template_data_${templateId}`), preventing data collision.
- **Template Operations:** Create new templates (defaults to A4), switch between tabs with auto-save, and manage templates from the Saved Templates panel.

### 3. Document Preview (`src/features/preview/`)
Provides a clean, print-accurate representation of the document.
- **CleanDocumentSheet:** Renders pristine sheets identical to the canvas in typography, cell styles, SVG logos, and divider gradients, with **zero editor UI chrome**.
- **DocumentPreviewModal:** Full-screen modal overlay offering **All Pages** (continuous scroll) and **Single Page** view modes with direct PDF download.

### 4. PDF Export Engine (`src/features/export/`)
Generates high-resolution multi-page PDF files entirely on the client side.
- **html2canvas-pro & jsPDF Pipeline:** Natively parses Tailwind CSS v4 color formats, transfers custom Google Fonts, captures pages at 2x High-DPI scale, and compiles multi-page PDFs matching the target paper dimensions (A4, Tabloid, Letter, Legal) with direct browser downloads.

### 5. Shared Layout & Global Hooks (`src/components/layout/` & `src/hooks/`)
- **Header.tsx:** Top navigation bar with inline project title editing, undo/redo buttons, preview modal trigger, animated emerald save confirmation badge, and direct PDF export.
- **TabBar.tsx:** Multi-template tab switcher with '+' add tab button.
- **useNavbar.ts:** Global UI state store for mobile drawers and modal visibility.
- **useMounted.ts:** Client-side mount hook preventing Next.js SSR hydration mismatch.