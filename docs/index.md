# Visual Document Editor Technical Documentation

Welcome to the central technical documentation hub for the **Visual Document Editor (PoC)**. This documentation provides a comprehensive architectural and feature reference for developers and AI agents, adhering to the Feature-Driven Modular Architecture under `src/features/`.

---

## Application Architecture & Layout Blueprint

The editor interface is structured into distinct functional zones designed for fluid document authoring, dynamic block layout, and multi-template management:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Top Application Header: Logo | Project Name | Undo/Redo | Preview | Save | Download PDF          │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Multi-Template Tab Bar: [Template-1 ✕] [Template-2 ✕] [+]                                        │
├───────────────────┬──────────────────────────────────────────────┬───────────────────────────────┤
│ Left Toolbox      │ Center Document Canvas                       │ Right Properties Panel        │
│ (Dark Theme)      │ (White Sheet on Slate Canvas)                │ (Text & Table Settings)       │
│                   │                                              │                               │
│ • Components:     │ • Viewport Controls (Pagination, Zoom, Full) │ • Text Settings:              │
│   - Select        │ • Company Branding & Header                  │   - Font Family / Size / Wt   │
│   - Text Block    │ • Issuer, Client, No/Date Metadata           │   - Color Swatch / Alignment  │
│   - Simple Table  │ • Dynamic Blocks (Table, Text, Image, Shape) │ • Table Settings:             │
│   - Image Block   │ • Inline Table Controls (+ Add Row, Delete)  │   - Width / Borders / Padding │
│   - Shape Block   │ • Multi-Page Sheet Continuation Layout       │ • Column/Row Add & Delete     │
│ • Quick Actions   │ • Visual Footer Graphic                      │                               │
│ • Pages Manager   │                                              │                               │
├───────────────────┴──────────────────────────────────────────────┴───────────────────────────────┤
│ Bottom Section: Saved Templates Panel (Full width under Canvas + Properties)                     │
│ • "Save as Current Template" Outlined CTA                                                        │
│ • Template Cards (Title, Active Badge, Saved Timestamp, "Open / Current" Action, Delete Action) │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Feature-Specific Guides

| Guide | Target Feature Folder | Key Responsibilities |
| :--- | :--- | :--- |
| **[Editor Feature Guide](./editor.md)** | `src/features/editor/` | Component Toolbox, Dynamic Canvas Blocks, Auto-Pagination Engine, Inline Data Editing, and the Properties & Data Panel. |
| **[Templates Feature Guide](./templates.md)** | `src/features/templates/` | Multi-template tab synchronization, distinct per-template LocalStorage slots (`doc_template_data_<id>`), and Saved Templates Panel. |
| **[Export Feature Guide](./export.md)** | `src/features/export/` | Client-side PDF generation via `html2canvas` and `jspdf`, multi-page pagination, visual styling fidelity, and download pipelines. |

---

## Core Engineering & Architectural Principles

1. **Feature-Driven Modular Architecture:**
   - **Feature State:** Domain logic and state stores reside in `src/features/<feature-name>/hooks/` (e.g. `useEditorState.ts`, `useTemplatesState.ts`).
   - **Global Layout State:** Shared UI chrome state belongs in `src/hooks/` (`useNavbar.ts`, `useTabBar.ts`, `useMounted.ts`).
   - **Pure Presentation Components:** UI components focus on presentation and receive handlers/props or select scoped state slices.

2. **Strict TypeScript & Zero Warnings:**
   - `noImplicitAny: true` is enforced across the entire codebase.
   - **Zero `any` types** and zero ESLint warnings across components, hooks, and types.

3. **Per-Template Storage Isolation:**
   - Each template maintains its own distinct `localStorage` slot (`doc_template_data_${templateId}`).
   - Editing one template's design, pages, or metadata never pollutes or overwrites another template.
   - New templates are created exclusively via the `+` button in `TabBar.tsx`.

4. **SSR Hydration Safety:**
   - Uses `useMounted()` guards in page and canvas entry points to prevent Next.js server-side singleton state divergence.

5. **Responsive Layout Discipline:**
   - The workspace layout uses flexbox and viewport height constraints (`h-screen`, `h-[100dvh]`, `overflow-hidden` at the root with independent scrolling in the workspace and sidebars).
   - Component dimensions scale seamlessly across standard breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`, `3xl`).