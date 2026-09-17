# Visual Document Editor Technical Documentation

Welcome to the central technical documentation hub for the **Visual Document Editor (PoC)**. This documentation provides a comprehensive architectural and feature reference for developers and AI agents, adhering to the Feature-Driven Modular Architecture under `src/features/`.

---

## Application Architecture & Layout Blueprint

The editor interface is structured into distinct functional zones designed for fluid document authoring, dynamic block layout, standard A4 pagination, and multi-template management:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Top Application Header: Logo | Project Name | Undo/Redo | Preview | Save | Download PDF          │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Multi-Template Tab Bar: [Template-1 ✕] [Template-2 ✕] [+]                                        │
├───────────────────┬──────────────────────────────────────────────┬───────────────────────────────┤
│ Left Toolbox      │ Center Document Canvas                       │ Right Properties Panel        │
│ (Dark Theme)      │ (A4 White Sheet on Slate Canvas)             │ (Typography & Layout Grid)    │
│                   │                                              │                               │
│ • Components:     │ • Viewport Controls (A4 Badge, Zoom, Full)   │ • Context Typography:         │
│   - Select        │ • Company Branding & Header                  │   - Target: Block / Cell      │
│   - Text Block    │ • 3-Column Metadata Grid (Issuer, Client...) │   - Font Family / Size / Wt   │
│   - Simple Table  │ • Page Grid Rows & Drag-Resizable Columns    │   - Color Picker / Alignment  │
│   - Image Block   │ • Clean Idle View vs. Hover/Select Controls  │ • Table Settings:             │
│   - Shape Block   │ • Dynamic Blocks (Table, Text, Image, Shape) │   - Width / Borders / Padding │
│ • Quick Actions   │ • Multi-Page Continuation & Row Splitting    │ • Page Grid Management:       │
│ • Pages Manager   │ • Visual Footer Graphic                      │   - Row / Column Add & Delete │
├───────────────────┴──────────────────────────────────────────────┴───────────────────────────────┤
│ Bottom Section: Saved Templates Panel (Full width under Canvas + Properties)                     │
│ • "Save as Current Template" Outlined CTA                                                        │
│ • Template Cards (Title, Active Badge, Saved Timestamp, "Open / Current" Action, Delete Action) │
│ └────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Feature-Specific Guides

| Guide | Target Feature Folder | Key Responsibilities |
| :--- | :--- | :--- |
| **[Editor Feature Guide](./editor.md)** | `src/features/editor/` | Component Toolbox, Dynamic Canvas Blocks, Multi-Page A4 Engine with Table Row Splitting, Inline & Cell Typography, Page Grid Layout Management, and Interactive Column Drag-Resizing. |
| **[Templates Feature Guide](./templates.md)** | `src/features/templates/` | Multi-template tab synchronization, distinct per-template LocalStorage slots (`doc_template_data_<id>`), and Saved Templates Panel. |
| **[Export Feature Guide](./export.md)** | `src/features/export/` | Client-side PDF generation via `html2canvas` and `jspdf`, multi-page pagination, visual styling fidelity, and download pipelines. |

---

## Core Engineering & Architectural Principles

1. **Feature-Driven Modular Architecture:**
   - **Feature State:** Domain logic and state stores reside in `src/features/<feature-name>/hooks/` (e.g. `useEditorState.ts`, `useTemplatesState.ts`).
   - **Global Layout State:** Shared UI chrome state belongs in `src/hooks/` (`useNavbar.ts`, `useTabBar.ts`, `useMounted.ts`).
   - **Pure Presentation Components:** UI components focus on presentation and receive handlers/props or select scoped state slices.

2. **Standard A4 Layout & Bi-Directional Auto-Pagination:**
   - Document sheets render in standard A4 dimensions (`210mm × 297mm` / `max-w-[794px] min-h-[1123px]`).
   - Dynamic pagination automatically splits tables and layout blocks across pages when overflowing, and seamlessly pulls them back when content shrinks.

3. **Interactive Column Border Resizing:**
   - Grid rows support fluid percentage column widths with drag-to-resize divider handles between adjacent columns.
   - Real-time drag calculation ensures adjacent columns shift seamlessly while respecting an 8% minimum width bound.

4. **Clean Idle Display & Progressive Disclosure:**
   - Unselected and unhovered documents render clean and natural (like a final printed document).
   - In-table action buttons (`+ Add Row`, `+ Add Column`), drag handles, row headers, and divider lines are progressively disclosed on hover and pinned on active selection.

5. **Strict TypeScript & Zero Warnings:**
   - `noImplicitAny: true` is enforced across the entire codebase.
   - **Zero `any` types** and zero ESLint warnings across components, hooks, and types.

6. **Per-Template Storage Isolation:**
   - Each template maintains its own distinct `localStorage` slot (`doc_template_data_${templateId}`).
   - Editing one template's design, pages, or metadata never pollutes or overwrites another template.
   - New templates are created exclusively via the `+` button in `TabBar.tsx`.

7. **SSR Hydration Safety:**
   - Uses `useMounted()` guards in page and canvas entry points to prevent Next.js server-side singleton state divergence.

8. **Responsive Layout Discipline:**
   - The workspace layout uses flexbox and viewport height constraints (`h-screen`, `h-[100dvh]`, `overflow-hidden` at the root with independent scrolling in the workspace and sidebars).
   - Component dimensions scale seamlessly across standard breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`, `3xl`).