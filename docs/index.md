# Visual Document Editor Technical Documentation

Welcome to the central technical documentation hub for the **Visual Document Editor (PoC)**. This documentation provides a comprehensive architectural and feature reference for developers and AI agents, aligning with the domain structure under `src/features/`.

---

## Application Architecture & Layout Blueprint

The editor interface is structured into distinct functional zones designed for fluid document authoring and template management:

```
┌──────────────────────────────────────────────────────────────────────────────────────────────────┐
│ Top Application Header: Logo | Project Name Input | Undo/Redo | Preview | Save | Download PDF    │
├──────────────────────────────────────────────────────────────────────────────────────────────────┤
│ Multi-Template Tab Bar: [New-Template ✕] [Template-1 ✕] [+]                                       │
├───────────────────┬──────────────────────────────────────────────┬───────────────────────────────┤
│ Left Toolbox      │ Center Document Canvas                       │ Right Properties Panel        │
│ (Dark Theme)      │ (White Sheet on Slate Canvas)                │ (Text & Table Settings)       │
│                   │                                              │                               │
│ • Components:     │ • Viewport Controls (Zoom, Fullscreen)       │ • Text Settings:              │
│   - Select        │ • Company Branding & Header                  │   - Font Family / Size / Wt   │
│   - Text Block    │ • Issuer, Client, No/Date Metadata           │   - Color Swatch / Alignment  │
│   - Simple Table  │ • Quotation Items Table (Drag & Drop rows)   │ • Table Settings:             │
│   - Image         │ • Inline Table Controls (+ Add Col / + Row)  │   - Width / Borders / Padding │
│   - Shape         │ • Visual Footer Graphic                      │ • Column/Row Add & Delete     │
│ • Quick Actions   │                                              │                               │
│ • Pages Manager   │                                              │                               │
├───────────────────┴──────────────────────────────────────────────┴───────────────────────────────┤
│ Bottom Section: Saved Templates Panel (Full width under Canvas + Properties)                     │
│ • "Save Current as Template" CTA                                                                │
│ • Template Cards (Title, Saved Timestamp, "Open" Action, Overflow Menu)                          │
└──────────────────────────────────────────────────────────────────────────────────────────────────┘
```

---

## Feature-Specific Guides

| Guide | Target Feature Folder | Key Responsibilities |
| :--- | :--- | :--- |
| **[Editor Feature Guide](./editor.md)** | `src/features/editor/` | Header, TabBar, Component Toolbox, Interactive Canvas Sheet, `@dnd-kit` table reordering, and the Properties & Data Panel. |
| **[Templates Feature Guide](./templates.md)** | `src/features/templates/` | Multi-template tab state, LocalStorage persistence lifecycle, `template1` key auto-save/hydrate rules, and Saved Template Cards. |
| **[Export Feature Guide](./export.md)** | `src/features/export/` | Client-side PDF generation via `html2canvas` and `jspdf`, multi-page pagination, visual styling fidelity, and download pipelines. |

---

## Core Engineering & Quality Standards

1. **Strict TypeScript:**
   - `noImplicitAny: true` is enforced across the entire codebase.
   - **Zero `any` types** allowed across components, hooks, utilities, and Zustand state stores.
2. **Feature Symmetry:**
   - Every domain folder under `src/features/[name]` must maintain its dedicated architectural specification in `docs/[name].md`.
3. **State Management via Zustand:**
   - All document state mutations (text edits, row additions/reordering, styling changes, tab switches) must be dispatched through centralized feature stores.
   - Use fine-grained Zustand selectors to prevent unnecessary re-renders of the canvas or properties panel.
4. **Responsive Layout Discipline:**
   - The workspace layout uses flexbox and viewport height constraints (`h-screen`, `overflow-hidden` at the root with independent scrolling in the workspace and sidebars).
   - Component dimensions scale across standard breakpoints (`sm`, `md`, `lg`, `xl`, `2xl`, `3xl`).