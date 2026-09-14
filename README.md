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
| **PDF Generation** | `html2canvas` & `jspdf` | Client-side static PDF generation from the active canvas state. |
| **Validation** | Zod | Runtime schema validation for forms, state contracts, and environment variables. |
| **Icons & Primitives** | Lucide React | Clean, accessible vector icons across navigation and toolbars. |

## Project Architecture & Folder Structure

This repository follows a strict **Feature-Driven Modular Architecture**. 

```text
src/
├── app/                  # ROUTING LAYER (Routes, pages, layouts, and metadata definitions)
├── components/           # GLOBAL PURE UI (Shared presentation primitives: ui/ atoms, layout/)
├── config/               # ENVIRONMENT HUB (Zod runtime-verified environment configurations)
├── features/             # THE CORE DOMAIN (Business boundaries isolated cleanly by feature)
│   ├── [feature-name]/   # Standard structure for each domain feature (editor, templates, export)
│   │   ├── components/   # Local presentation UI (Dumb/Pure components receiving data via props/hooks)
│   │   ├── services/     # Unified API contracts (Both native fetch for ISR and apiClient for CSR)
│   │   ├── hooks/        # Local Server State engine (TanStack Query/Mutation implementations)
│   │   └── types/        # Domain specific TS Interfaces and Zod form schemas
│   ├── editor/           # Canvas, drag-and-drop, and property controls
│   ├── templates/        # Template management, persistence, and cards
│   └── export/           # PDF generation and download pipeline
├── hooks/                # GLOBAL UI HOOKS (Pure client-side UI actions: debouncing, resizing)
├── lib/                  # THIRD-PARTY CLIENT KERNELS (Axios interceptor, sockets, helpers)
└── middleware.ts         # EDGE SECURITY GUARD (Dynamic routing, workspace context)

docs/                     # DOCUMENTATION HUB (For Developers & AI Agents)
├── index.md              # Documentation Index & Navigation Guide
├── editor.md             # Matches features/editor/ (Canvas, Dnd-kit, Styling)
├── templates.md          # Matches features/templates/ (LocalStorage & template1 rules)
└── export.md             # Matches features/export/ (Static PDF export specs)