# Visual Document Editor Technical Documentation

Welcome to the central technical documentation hub for the **Visual Document Editor (PoC)**. This documentation provides a comprehensive architectural and feature reference for developers and AI agents, adhering to the Feature-Driven Modular Architecture under `src/features/`.

---

## Application Architecture & Layout Blueprint

The editor interface is structured into distinct functional zones designed for fluid document authoring, dynamic block layout, standard A4 pagination, and multi-template management:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Top Application Header: Logo | Project Name | Undo/Redo | Preview | Save | Download PDF          │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Multi-Template Tab Bar: [Template-1 ✕] [Template-2 ✕] [+] (New Tabs Default to A4 Standard)      │
├───────────────────┬──────────────────────────────────────────────┬───────────────────────────────┤
│ Left Toolbox      │ Center Document Canvas                       │ Right Properties Panel        │
│ (Dark Theme)      │ (A4/Tabloid/Letter/Legal Sheet on Slate)     │ (Typography & Layout Grid)    │
│                   │                                              │                               │
│ • Components:     │ • Viewport Controls:                         │ • Typography Settings:        │
│   - Select        │   - Paper Size (A4/Tabloid/Letter/Legal)     │   - Font Family / Size / Wt   │
│   - Text Block    │   - Pagination [← Page N of Total →]         │   - Color Picker / Alignment  │
│   - Simple Table  │   - Zoom (75% - 150%) / Fullscreen           │ • Image & Logo Settings:      │
│   - Image Block   │ • Dynamic Header Row (Logo, Company, Title)  │   - Preset Blue Logo / Upload │
│   - Shape Block   │ • Accent Divider Row (ShapeBlock Line)       │   - Width / Height / Align    │
│ • Quick Actions   │ • 3-Column Metadata Grid (Issuer, Client...) │ • Divider & Table Settings    │
│ • Pages Manager   │ • Page Grid Rows & Drag-Resizable Columns    │ • Page Grid Management:       │
│                   │ • Drag-and-Drop ↕ Row Margin Handles         │   - Row / Column Add & Delete │
│                   │ • Clean Idle View vs. Hover/Select Controls  │                               │
│                   │ • Dynamic Blocks (Table, Text, Image, Shape) │                               │
│                   │ • Multi-Page Continuation & Row Splitting    │                               │
│                   │ • Visual Footer Graphic                      │                               │
├───────────────────┴──────────────────────────────────────────────┴───────────────────────────────┤
│ Bottom Section: Saved Templates Panel (Full width under Canvas + Properties)                     │
│ • "Save as Current Template" Outlined CTA                                                        │
│ • Template Cards (Title, Active Badge, Saved Timestamp, "Open / Current" Action, Delete Action) │
└────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Feature-Specific Guides

| Guide | Target Feature Folder | Key Responsibilities |
| :--- | :--- | :--- |
| **[Editor Feature Guide](./editor.md)** | `src/features/editor/` | Component Toolbox, Dynamic Canvas Blocks, Multi-Paper Size Engine (**A4 Default**, Tabloid, Letter, Legal) with Table Row Splitting, Inline & Cell Typography, Real-Time Auto-Expanding Text Blocks, Multi-Level Undo/Redo, Dynamic Header & Divider Grid Rows, Image & Shape Blocks, Interactive Column Drag-Resizing, and Canvas-Driven ↕ Row Margin Resizing. |
| **[Templates Feature Guide](./templates.md)** | `src/features/templates/` | Multi-template tab synchronization (new tabs default to A4), distinct per-template LocalStorage slots (`doc_template_data_<id>`) preserving paper size and layout, legacy template auto-migration, and Saved Templates Panel. |
| **[Export Feature Guide](./export.md)** | `src/features/export/` | Client-side PDF generation via `html2canvas-pro` and `jspdf`, multi-paper format pagination (A4, Tabloid, Letter, Legal), 100% canvas-preview visual parity, and direct download pipelines without print modals. |

---

## Core Engineering & Architectural Principles

1. **Feature-Driven Modular Architecture:**
   - **Feature State:** Domain logic and state stores reside in `src/features/<feature-name>/hooks/` (e.g. `useEditorState.ts`, `useTemplatesState.ts`).
   - **Global Layout State:** Shared UI chrome state belongs in `src/hooks/` (`useNavbar.ts`, `useTabBar.ts`, `useMounted.ts`).
   - **Pure Presentation Components:** UI components focus on presentation and receive handlers/props or select scoped state slices.

2. **Multi-Paper Size Architecture & Bi-Directional Auto-Pagination:**
   - Supports **A4** (`210 × 297 mm` / `794 × 1123 px`, Default), **Tabloid / Ledger** (`11 × 17 in` / `1056 × 1632 px`), **Letter (US)** (`8.5 × 11 in` / `816 × 1056 px`), and **Legal (US)** (`8.5 × 14 in` / `816 × 1344 px`).
   - Dynamic bi-directional pagination engine automatically splits tables and layout blocks across pages when overflowing based on the selected paper's height budget, and seamlessly merges them back when switching to taller formats or deleting content.

3. **Multi-Level Undo & Redo History System:**
   - Full timeline traversal with `past` and `future` snapshot stacks in `useEditorState.ts`.
   - Global keyboard shortcuts (`Ctrl+Z` / `Cmd+Z` for Undo; `Ctrl+Y` / `Ctrl+Shift+Z` / `Cmd+Shift+Z` for Redo).
   - Smart 800ms debounce grouping on continuous text input to prevent micro-undo fragmentation.

4. **Fully Dynamic Grid-Based Header & Content Rows:**
   - All header elements (Company Logo, Company Name, Tagline, Document Title, and Divider Line) are built with modular `PageGridRow` and `PageGridColumn` structures rather than hardcoded markup.
   - Users can drag column boundaries to change widths, drag row margin handles to adjust vertical spacing, and edit all text, logo assets, or divider lines directly.

5. **Instant Real-Time Auto-Expanding Text Blocks:**
   - Text blocks use `useIsomorphicLayoutEffect` to dynamically resize bounding boxes synchronously before paint when typing, pasting, or altering font properties.
   - Font loading observers (`document.fonts.ready`) guarantee exact dimensions once custom Google Fonts download.
   - Elimination of `transition-all` on dimensions ensures zero lag or clipping during fast text authoring.

6. **Full In-Table Inline & Cell Editing:**
   - All table cells (Item name, Qty, Unit Price, Amount, and custom columns) are editable directly on the canvas.
   - Real-time automatic recalculation of the Amount column (`qty × unitPrice`) with support for custom manual overrides.

7. **Canvas-Driven ↕ Row Margin Adjustments:**
   - Every grid row features interactive drag-and-drop margin handles on the canvas for fluid top and bottom vertical spacing adjustment (`0px` to `300px`).
   - Row toolbars are positioned absolutely (`0px` in normal layout flow) with zero inner row padding, allowing rows to sit tightly together with zero unwanted space when margins are set to `0px`.

8. **Interactive Column Border Resizing:**
   - Grid rows support fluid percentage column widths with drag-to-resize divider handles between adjacent columns.
   - Real-time drag calculation ensures adjacent columns shift seamlessly while respecting an 8% minimum width bound.

9. **Strict TypeScript & Zero Warnings:**
   - `noImplicitAny: true` is enforced across the entire codebase.
   - **Zero `any` types** and zero ESLint/TypeScript compilation errors across all components, hooks, and types.

10. **Per-Template Storage Isolation & Auto-Migration:**
    - Each template maintains its own distinct `localStorage` slot (`doc_template_data_${templateId}`).
    - Editing one template's design, pages, or metadata never pollutes or overwrites another template.
    - Built-in migration automatically upgrades legacy template snapshots with modern header and divider row configurations.

11. **SSR Hydration Safety & Responsive Layout Discipline:**
    - Uses `useMounted()` guards in page and canvas entry points to prevent Next.js server-side singleton state divergence.
    - The workspace layout uses flexbox and viewport height constraints (`h-screen`, `h-[100dvh]`, `overflow-hidden` at the root with independent scrolling in the workspace and sidebars).
    - Component dimensions scale seamlessly across standard breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`, `3xl`).