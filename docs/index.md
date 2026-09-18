# Visual Document Editor Technical Documentation

Welcome to the central technical documentation hub for the **Visual Document Editor (PoC)**. This documentation provides a comprehensive architectural and feature reference for developers and AI agents, adhering to the Feature-Driven Modular Architecture under `src/features/`.

---

## Application Architecture & Layout Blueprint

The editor interface is structured into distinct functional zones designed for fluid document authoring, dynamic block layout, standard A4 pagination, and multi-template management:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Top Application Header: Logo | Project Name | Undo/Redo | Preview | Save | Download PDF          │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Multi-Template Tab Bar: [Template-1 ✕] [Template-2 ✕] [+] (New Tabs Default to Tabloid)          │
├───────────────────┬──────────────────────────────────────────────┬───────────────────────────────┤
│ Left Toolbox      │ Center Document Canvas                       │ Right Properties Panel        │
│ (Dark Theme)      │ (Tabloid/A4/Letter/Legal Sheet on Slate)     │ (Typography & Layout Grid)    │
│                   │                                              │                               │
│ • Components:     │ • Viewport Controls:                         │ • Typography Settings:        │
│   - Select        │   - Paper Size (Tabloid/A4/Letter/Legal)     │   - Font Family / Size / Wt   │
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
| **[Editor Feature Guide](./editor.md)** | `src/features/editor/` | Component Toolbox, Dynamic Canvas Blocks, Multi-Paper Size Engine (**Tabloid / Ledger Default**, A4, Letter, Legal) with Table Row Splitting, Inline & Cell Typography, Dynamic Header & Divider Grid Rows, Image & Shape Blocks, Interactive Column Drag-Resizing, and Canvas-Driven ↕ Row Margin Resizing. |
| **[Templates Feature Guide](./templates.md)** | `src/features/templates/` | Multi-template tab synchronization (new tabs default to Tabloid), distinct per-template LocalStorage slots (`doc_template_data_<id>`) preserving paper size and layout, legacy template auto-migration, and Saved Templates Panel. |
| **[Export Feature Guide](./export.md)** | `src/features/export/` | Client-side PDF generation via `html2canvas` and `jspdf`, multi-paper format pagination, visual styling fidelity, and download pipelines. |

---

## Core Engineering & Architectural Principles

1. **Feature-Driven Modular Architecture:**
   - **Feature State:** Domain logic and state stores reside in `src/features/<feature-name>/hooks/` (e.g. `useEditorState.ts`, `useTemplatesState.ts`).
   - **Global Layout State:** Shared UI chrome state belongs in `src/hooks/` (`useNavbar.ts`, `useTabBar.ts`, `useMounted.ts`).
   - **Pure Presentation Components:** UI components focus on presentation and receive handlers/props or select scoped state slices.

2. **Multi-Paper Size Architecture & Bi-Directional Auto-Pagination:**
   - Supports **Tabloid / Ledger** (`11 × 17 in` / `1056 × 1632 px`, Default), **A4** (`210 × 297 mm` / `794 × 1123 px`), **Letter (US)** (`8.5 × 11 in` / `816 × 1056 px`), and **Legal (US)** (`8.5 × 14 in` / `816 × 1344 px`).
   - Dynamic bi-directional pagination engine automatically splits tables and layout blocks across pages when overflowing based on the selected paper's height budget, and seamlessly merges them back when switching to taller formats or deleting content.

3. **Fully Dynamic Grid-Based Header System:**
   - All header elements (Company Logo, Company Name, Tagline, Document Title, and Divider Line) are built with modular `PageGridRow` and `PageGridColumn` structures rather than hardcoded markup.
   - Users can drag column boundaries to change widths, drag row margin handles to adjust vertical spacing, and edit all text, logo assets, or divider lines directly.

4. **Canvas-Driven ↕ Row Margin Adjustments:**
   - Every grid row features interactive drag-and-drop margin handles on the canvas for fluid top and bottom vertical spacing adjustment (`0px` to `300px`).
   - Row toolbars are positioned absolutely (`0px` in normal layout flow) with zero inner row padding, allowing rows to sit tightly together with zero unwanted space when margins are set to `0px`.

5. **Interactive Column Border Resizing:**
   - Grid rows support fluid percentage column widths with drag-to-resize divider handles between adjacent columns.
   - Real-time drag calculation ensures adjacent columns shift seamlessly while respecting an 8% minimum width bound.

6. **Clean Idle Display & Progressive Disclosure:**
   - Unselected and unhovered documents render clean and natural (like a final printed document).
   - In-table action buttons (`+ Add Row`, `+ Add Column`), drag handles, row headers, and divider lines are progressively disclosed on hover and pinned on active selection.

7. **Strict TypeScript & Zero Warnings:**
   - `noImplicitAny: true` is enforced across the entire codebase.
   - **Zero `any` types** and zero ESLint warnings across components, hooks, and types.

8. **Per-Template Storage Isolation & Auto-Migration:**
   - Each template maintains its own distinct `localStorage` slot (`doc_template_data_${templateId}`).
   - Editing one template's design, pages, or metadata never pollutes or overwrites another template.
   - Built-in migration automatically upgrades legacy template snapshots with modern header and divider row configurations.

9. **SSR Hydration Safety:**
   - Uses `useMounted()` guards in page and canvas entry points to prevent Next.js server-side singleton state divergence.

10. **Responsive Layout Discipline:**
    - The workspace layout uses flexbox and viewport height constraints (`h-screen`, `h-[100dvh]`, `overflow-hidden` at the root with independent scrolling in the workspace and sidebars).
    - Component dimensions scale seamlessly across standard breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`, `3xl`).