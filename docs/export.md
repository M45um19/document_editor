# Feature Guide: PDF Export Engine

## Overview
The Export feature (`src/features/export/`) is responsible for converting the active visual document canvas into high-fidelity, downloadable static PDF files directly on the client side without requiring a remote rendering server or browser print dialogs.

---

## Export Trigger & User Flow

```
User clicks [ Download PDF ] in Header or Preview Modal
                  │
                  ▼
┌──────────────────────────────────────────────┐
│ Set isExporting = true                       │
│ Query clean document sheets across all pages │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ Capture via html2canvas-pro                  │
│ • Full modern CSS color support (lab/oklab)  │
│ • Transfer Next.js Google font variables     │
│ • 2x High-DPI resolution                     │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ Generate multi-page jsPDF instance           │
│ Match Tabloid / A4 / Letter / Legal format   │
│ Append pages sequentially with zero chrome   │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ Direct file download: [Document_Title].pdf   │
│ Set isExporting = false                      │
└──────────────────────────────────────────────┘
```

---

## Component & Service Architecture

```text
src/
├── components/layout/
│   └── Header.tsx                       # Contains the [ Download PDF ] action button
├── features/preview/
│   ├── components/
│   │   ├── CleanDocumentSheet.tsx       # Pristine multi-page sheet renderer with 100% canvas visual parity
│   │   └── DocumentPreviewModal.tsx     # Full document preview modal (All Pages / Single Page views)
└── features/export/
    └── services/
        └── pdfExportService.ts          # Core multi-page html2canvas-pro capture & jsPDF compiler
```

---

## Technical Requirements & Implementation Details

### 1. Direct File Download (Zero System Print Modals)
* Clicking **Download PDF** generates a standard `.pdf` Blob and triggers an automatic browser file download using `jsPDF.save("filename.pdf")`.
* No browser print dialogs, system print modals, or landscape/portrait prompts are displayed.

### 2. Clean Document Sheet Targeting & Offscreen Container
* The export service captures `CleanDocumentSheet` elements representing all pages of the document, completely free from any editor UI chrome (e.g., in-table row drag handles, add/delete buttons, active cell selection rings, or margin resize handles).
* An offscreen `#clean-export-root` container is mounted at `top: 0px, left: 0px, zIndex: -9999` in `src/app/page.tsx`, ensuring valid positive coordinates for cross-browser canvas rasterization in Mozilla Firefox, Chrome, Safari, and Edge.

### 3. Modern Color & CSS Engine (`html2canvas-pro`)
* Uses `html2canvas-pro` to natively parse Tailwind CSS v4 color formats (`oklab()`, `lab()`, `oklch()`, `color-mix()`) without throwing unsupported color function errors.
* `onclone` handler copies root font classes (`--font-inter`, `--font-roboto`, `--font-outfit`, `--font-playfair`, `--font-merriweather`, `--font-fira`) from `document.documentElement` to the cloned document.

### 4. 100% Visual Parity with Canvas & Preview
* **Typography & Cell Customizations:** Respects individual table cell overrides (`row.cellStyles?.[colId]`) including `fontFamily`, `fontSize`, `fontWeight`, `color`, and `textAlign`.
* **Images & SVG Logos:** Renders the exact 4-tile geometric SVG logo (or uploaded image asset) with custom width, height, and border radius.
* **Shapes & Dividers:** Renders the exact multi-stop blue gradient line.

### 5. Multi-Paper Format Dimensions & Multi-Page Pagination
* Target physical document dimensions matching the active paper format:
  * **Tabloid / Ledger:** `11 × 17 in` (`279.4 × 431.8 mm` / `792pt × 1224pt`) — Default
  * **A4:** `210 × 297 mm` (`595.28pt × 841.89pt`)
  * **Letter (US):** `8.5 × 11 in` (`215.9 × 279.4 mm` / `612pt × 792pt`)
  * **Legal (US):** `8.5 × 14 in` (`215.9 × 355.6 mm` / `612pt × 1008pt`)
* When a document contains multiple pages:
  * Iterates across all document page containers sequentially (`Page 1`, `Page 2`...).
  * Captures each page at 2x High-DPI scale.
  * Appends pages sequentially using `pdf.addPage()`.

### 6. File Naming Convention
* Standard format:
  ```text
  [Sanitized_Document_Title].pdf
  ```
* Example: For a project named `"Quotation Invoice V1"`, the resulting file downloads as:
  `Quotation_Invoice_V1.pdf`

---

## Edge Cases & Reliability Checklist

1. **Mozilla Firefox Compatibility:** Offscreen elements use valid coordinate bounds (`top: 0, left: 0, zIndex: -9999`) and `scrollX: 0, scrollY: 0` to prevent viewport offsets and rendering exceptions.
2. **Tailwind v4 Color Space:** Fully supported via `html2canvas-pro` for all palettes and shadow layers.
3. **Download Feedback:** While `isExporting` is active, displays a spinning loader on the `[ Download PDF ]` button and temporarily disables clicks to prevent duplicate downloads.