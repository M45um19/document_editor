# Feature Guide: Template Manager & Persistence

## Overview
The Templates feature (`src/features/templates/`) manages template persistence, multi-template tab sessions, and automatic LocalStorage hydration. It ensures that user modifications are saved reliably and can be reopened instantly across sessions.

---

## Visual Structure & Components

```text
src/
├── components/layout/
│   └── TabBar.tsx                     # Multi-template tab strip
└── features/templates/
    └── components/
        └── SavedTemplatesPanel.tsx    # Bottom panel displaying saved template library
```

---

## Component Specifications

### 1. Multi-Template Tab Bar (`src/components/layout/TabBar.tsx`)
Positioned below the main navigation header:

* **Tab Representation:**
  * Each open tab displays a document icon (`FileText`), the template title (e.g. `"New-Template"`, `"Template-1"`), and a close button (`X`).
  * **Active Tab:** Rendered in white (`bg-white`), highlighted with `text-blue-600`, with a bottom white blend line connecting to the workspace.
  * **Inactive Tabs:** Rendered with muted slate typography and subtle hover effects.
* **Tab Operations:**
  * **Switch Tab:** Clicking an inactive tab switches the active editor context to that template.
  * **Close Tab:** Clicking `X` removes the tab from the active session. If only one tab remains, closing resets to a blank document.
  * **Add Tab (`+` Button):** Creates a fresh template tab and immediately sets it as active.

---

### 2. Saved Templates Panel (`src/features/templates/components/SavedTemplatesPanel.tsx`)
Spans the full width of the main scrollable workspace beneath the Editor Canvas and Properties Panel (`rounded-xl bg-white border border-slate-200/90 p-5`).

* **Header Section:**
  * **Icon & Title:** Folder icon (`Folder`) inside a blue rounded box + `"Saved Templates"` heading.
  * **Subtitle:** `"Access and manage your saved templates."`
  * **Save CTA:** `[+ Save Current as Template]` button (`border-blue-500 text-blue-600 bg-white hover:bg-blue-50/60`). Clicking this serializes the active canvas and stores it as a new template entry.
* **Template Card Item:**
  * **Document Icon & Details:** Blue square icon with `FileText`, template title (e.g., `"Template-1"`), and formatted timestamp (e.g., `Saved on 2026-09-14 | 10:32 AM`).
  * **Actions:**
    * `[ Open ]` Button: Hydrates the canvas and editor store with this template's saved state.
    * `[ ⋮ ]` More Options (`MoreVertical`): Opens context menu for Rename, Duplicate, or Delete.

---

## Automatic Storage Flow & Hydration Lifecycle

```
[ App Initialization / Mount ]
            │
            ▼
┌──────────────────────────────────────────────┐
│ Check localStorage.getItem("template1")     │
└──────────────────────┬───────────────────────┘
                       │
          ┌────────────┴────────────┐
          │                         │
      (Found)                  (Not Found)
          │                         │
          ▼                         ▼
┌──────────────────┐      ┌─────────────────────────────┐
│ Parse JSON &     │      │ Hydrate Zustand store with  │
│ Hydrate Canvas   │      │ hardcoded Default Template  │
└──────────────────┘      └─────────────────────────────┘
```

### Step-by-Step Lifecycle Rules

1. **Application Mount (First Boot vs. Returning User):**
   * On initial load, the system inspects `localStorage` for the key `"template1"`.
   * **If `"template1"` exists:** Parse the JSON payload and hydrate the Zustand `editorStore`. The user immediately sees their previously saved state.
   * **If `"template1"` is missing:** Populate the store with the default Proof-of-Concept document (Company header, issuer/client metadata, 5 quotation line items).

2. **Saving State (`Save` or `Save Current as Template`):**
   * Triggered by:
     * Header `[ Save ]` button.
     * Bottom panel `[+ Save Current as Template]` button.
     * Keyboard shortcut (`Ctrl+S` / `Cmd+S`).
   * **Action:**
     * Serializes document metadata, table rows, and typography/table styling into the standardized JSON schema.
     * Writes to `localStorage.setItem("template1", JSON.stringify(payload))`.
     * Updates the `updatedAt` ISO timestamp and refreshes the template card in `SavedTemplatesPanel`.

3. **Hydration / Opening a Saved Template:**
   * Clicking `[ Open ]` on any template card reads its payload and replaces active canvas state in the store.

---

## JSON Storage Schema Contract

```typescript
export interface StoredTemplate {
  id: string;                         // Unique ID (e.g., "template1", "tpl_1726396320")
  name: string;                       // Display name (e.g., "Template-1")
  createdAt: string;                  // ISO 8601 string
  updatedAt: string;                  // ISO 8601 string
  version: number;                    // Schema version for future migrations (e.g., 1)
  data: {
    metadata: {
      projectName: string;
      issuerDetails: string;
      clientDetails: string;
      documentNumber: string;
      documentDate: string;
    };
    textStyles: {
      fontFamily: string;
      fontSize: number;
      fontWeight: string;
      color: string;
      align: string;
    };
    tableStyles: {
      width: number;
      borderStyle: string;
      padding: number;
      rowSpacing: number;
    };
    tableRows: Array<{
      id: string | number;
      item: string;
      qty: number;
      unitPrice: number;
      amount: number;
    }>;
  };
}
```

---

## Error Handling & Fallbacks

* **JSON Parse Failures:** If `localStorage` data is corrupted or invalid, catch the error gracefully, log a warning in development, and fallback to the hardcoded default template without crashing the UI.
* **Storage Quota Exceeded:** Wrap write operations in a `try...catch` block to handle browser `QuotaExceededError` scenarios and notify the user if local storage is full.