# Documentation Index

Welcome to the technical documentation hub for the **Visual Document Editor (PoC)**. This index directs developers and AI agents to feature-specific implementation guides, matching the exact domain boundaries inside `src/features/`.

---

## Feature-Aligned Guides

* **[Editor Feature Guide (`features/editor`)](./editor.md)**  
  Covers the interactive visual canvas, left component toolbox, multi-page selector, properties panel, and `@dnd-kit` table row reordering.

* **[Templates Feature Guide (`features/templates`)](./templates.md)**  
  Details state management, LocalStorage persistence, and the automatic `template1` saving and loading flow.

* **[Export Feature Guide (`features/export`)](./export.md)**  
  Specifications for converting active canvas states into static, downloadable PDFs.

---

## Core Engineering & Coding Standards

1. **Strict TypeScript:** `noImplicitAny: true` is enforced. **Zero `any` types** are allowed across components, services, and state stores.
2. **Feature Symmetry:** Every folder under `src/features/[name]` must have a corresponding architectural guide named `docs/[name].md`.
3. **Zustand State:** All state modifications must go through centralized feature stores to prevent UI lag.