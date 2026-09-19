# Feature Guide: Template Manager & Persistence

## Overview
The Templates feature (`src/features/templates/`) manages template persistence, multi-template tab synchronization, and distinct per-template LocalStorage slots. It ensures each template maintains its own independent design, pages, layout rows, blocks, and metadata across browser sessions, while providing automatic migration for legacy template payloads.

---

## Visual Structure & Components

```text
src/
├── components/layout/
│   └── TabBar.tsx                     # Multi-template tab strip (Pure presentational)
└── features/templates/
    ├── components/
    │   ├── panel/
    │   │   └── SavedTemplatesPanel.tsx    # Bottom panel orchestrator for saved templates
    │   ├── cards/
    │   │   └── TemplateCard.tsx           # Individual template card item with status & actions
    │   └── index.ts                   # Central barrel export for templates components
    ├── hooks/
    │   └── useTemplatesState.ts       # Central Zustand store for template lifecycle & active tab sync
    ├── utils/
    │   └── templateUtils.ts           # Pure initial data constants and LocalStorage persistence helpers
    └── types/
        └── index.ts                   # Centralized domain types, template contracts, and component props
```

---

## Component Specifications

### 1. Multi-Template Tab Bar (`src/components/layout/TabBar.tsx`)
Positioned immediately below the main application header (`bg-[#eef2f7]`):

* **Tab Representation:**
  * Each tab represents a saved template from the user's template library.
  * Displays a document icon (`FileText`), template title (e.g. `"Template-1"`, `"Template-2"`), and a close button (`X`).
  * **Active Tab:** Rendered in white (`bg-white`), highlighted with `text-blue-600`, with a bottom white blend line connecting seamlessly to the workspace.
  * **Inactive Tabs:** Rendered with muted slate typography and subtle hover effects.
* **Tab Creation & Operations:**
  * **Add Tab (`+` Button):** The **exclusive** entry point for creating new templates. Clicking `+` generates a new template initialized with default **Tabloid / Ledger** paper size, allocates its separate `localStorage` slot, and focuses it immediately.
  * **Switch Tab:** Clicking any tab auto-saves the current template (including its active `paperSize`) and loads the selected template's independent design and paper format into the canvas.
  * **Close Tab (`X`):** Deletes the template and its storage slot, focusing an adjacent template.

---

### 2. Saved Templates Panel (`src/features/templates/components/panel/SavedTemplatesPanel.tsx`)
Full-width container positioned at the bottom of the scrollable workspace:

* **Header Section:**
  * **Icon & Title:** Folder icon (`Folder`) inside a blue rounded box + `"Saved Templates"` heading.
  * **Subtitle:** Displays total templates count and creation hint.
  * **Save CTA:** `[Save as Current Template]` button styled with clean outlined styling (`border border-blue-500 text-blue-600 bg-white hover:bg-blue-50/70`, `py-2 sm:py-2.5 px-3.5 sm:px-4`, and `<Save />` icon). Clicking this saves the active document state (metadata, pages, and paper format) to its dedicated storage slot.
* **Template Card Items (`src/features/templates/components/cards/TemplateCard.tsx`):**
  * **Document Icon & Details:** Blue square badge with `FileText`, template title, active badge indicator, and formatted timestamp (`Saved on YYYY-MM-DD | HH:MM AM/PM`).
  * **Actions:**
    * `[ Open / Current ]` Button: Loads the template's independent data into the editor canvas and scrolls smoothly to the canvas.
    * `[ Trash2 ]` Delete Button: Deletes the template and clears its `localStorage` slot.

---

## Storage Architecture & Lifecycle

Each template is completely isolated in `localStorage` to ensure independent editing:

```
┌────────────────────────────────────────────────────────────────┐
│ Master Templates List: "document_editor_templates_list"         │
│ Contains: [{ id: "template-1", name: "Template-1" }, ...]      │
│ Active ID: "template-1"                                        │
└────────────────────────────────────────────────────────────────┘
                 │                               │
                 ▼                               ▼
┌────────────────────────────────┐ ┌────────────────────────────────┐
│ Key: "doc_template_data_template-1" │ │ Key: "doc_template_data_template-2" │
│ DocumentStateSnapshot (JSON)   │ │ DocumentStateSnapshot (JSON)   │
│ (Metadata, PaperSize, Pages)   │ │ (Metadata, PaperSize, Pages)   │
└────────────────────────────────┘ └────────────────────────────────┘
```

### Step-by-Step Lifecycle Rules

1. **Application Mount & Auto-Migration:**
   - The system checks `localStorage` for `document_editor_templates_list`.
   - The active template's dedicated payload is read from `doc_template_data_${activeTemplateId}`.
   - `getTemplateData` verifies that Page 1 contains the modern `page-row-header` and `page-row-divider` grid rows. If missing (legacy snapshot), it automatically migrates the structure before loading into the editor canvas.
   - Restores the saved `paperSize` (defaults to `"tabloid"` if unspecified).

2. **Template Creation via `+` in `TabBar`:**
   - Auto-saves current active template.
   - Generates a new ID (e.g. `template-2`) and writes the initial default document structure (`INITIAL_TEMPLATE_DATA`, defaulting to `paperSize: "tabloid"`) into `doc_template_data_template-2`.
   - Appends to templates list, sets as active, and populates the canvas.

3. **Switching Templates:**
   - Auto-saves the current template's latest canvas state and `paperSize` to `doc_template_data_${activeTemplateId}`.
   - Sets the new active ID and loads `doc_template_data_${targetId}` into the editor store.

4. **Saving via "Save as Current Template":**
   - Explicitly captures the canvas snapshot (including `paperSize`) to `doc_template_data_${activeTemplateId}` and updates the `savedAt` timestamp in the master list.

---

## Data Contracts

```typescript
export interface SavedTemplateItem {
  id: string;
  name: string;
  savedAt: string;
  data?: DocumentStateSnapshot;
}

export interface TemplatesStoreState {
  templates: SavedTemplateItem[];
  activeTemplateId: string;
  tabCounter: number;

  selectTemplate: (id: string) => void;
  createTemplate: () => { newTemplate: SavedTemplateItem; data: DocumentStateSnapshot };
  deleteTemplate: (id: string) => string;
  saveCurrentTemplate: (data: DocumentStateSnapshot) => SavedTemplateItem;
  getTemplateData: (id: string) => DocumentStateSnapshot;
  saveTemplateData: (id: string, data: DocumentStateSnapshot) => void;
}
```