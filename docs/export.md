# Feature Guide: PDF Export Engine

## Overview
The Export feature (`src/features/export/`) is responsible for converting the active visual document canvas into high-fidelity, downloadable static PDF files directly on the client side without requiring a remote rendering server.

---

## Export Trigger & User Flow

```
User clicks [ Download PDF ] in Header
                  │
                  ▼
┌──────────────────────────────────────────────┐
│ Set exportLoading = true                     │
│ Target canvas DOM element: #document-sheet   │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ Clone node & apply print-specific styling    │
│ Render via html2canvas (Scale: 2x / High DPI)│
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ Generate jsPDF instance (A4 format)          │
│ Add image page(s) and compute pagination     │
└──────────────────────┬───────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────┐
│ Save & download: [Project_Name]_[Date].pdf   │
│ Set exportLoading = false                    │
└──────────────────────────────────────────────┘
```

---

## Component & Service Architecture

```text
src/
├── components/layout/
│   └── Header.tsx                       # Contains the [ Download PDF ] action button
└── features/export/
    ├── services/
    │   └── pdfExportService.ts          # Core canvas capture, pagination & PDF compilation engine
    ├── hooks/
    │   └── usePdfExport.ts              # UI hook providing triggerExport(), isExporting state
    └── types/
        └── export.types.ts              # PDF configuration parameters and metadata interfaces
```

---

## Technical Requirements & Implementation Details

### 1. Canvas Targeting & DOM Selection
* The document canvas sheet in `src/features/editor/components/EditorCanvas.tsx` is marked with a distinct ID:
  ```tsx
  <div id="document-sheet" className="w-full max-w-[794px] min-h-[1123px] bg-white rounded-lg shadow-sm ...">
    {/* Full document layout across A4 pages */}
  </div>
  ```
* The export service captures the target element while temporarily stripping out non-printable editor UI chrome (e.g., in-table row/column management buttons, active cell selection halos, or hover indicators).

### 2. High-DPI Resolution & Scale
* When invoking `html2canvas`, enforce a scale multiplier (minimum `scale: 2` or `window.devicePixelRatio >= 2`) to ensure crisp text and sharp lines in the resulting PDF.
* Maintain exact CSS box-model fidelity, including borders (`1px solid #E5E7EB`), background fills (`bg-blue-50/70`), and SVG logo marks.

### 3. Multi-Paper Format Dimensions & Multi-Page Pagination
* Target physical document dimensions matching the active paper format:
  * **Tabloid / Ledger:** `11 × 17 in` (`279 × 432 mm` / `792pt × 1224pt`) — Default
  * **A4:** `210 × 297 mm` (`595.28pt × 841.89pt`)
  * **Letter (US):** `8.5 × 11 in` (`216 × 279 mm` / `612pt × 792pt`)
  * **Legal (US):** `8.5 × 14 in` (`216 × 356 mm` / `612pt × 1008pt`)
* When a document contains multiple pages (with split tables and continuation sheets):
  * Iterate across all document page containers (`Page 1`, `Page 2`...).
  * Capture each page at precise paper proportions.
  * Append pages sequentially using `doc.addPage()`.

### 4. File Naming Convention
* Standard format:
  ```text
  [Sanitized_Project_Name]_[YYYY-MM-DD].pdf
  ```
* Example: For a project named `"Document Project V1"` on `2026-09-17`, the resulting file will download as:
  `Document_Project_V1_2026-09-17.pdf`

---

## PDF Export Configuration Schema

```typescript
export interface PdfExportOptions {
  fileName?: string;
  format?: 'tabloid' | 'a4' | 'letter' | 'legal';
  orientation?: 'portrait' | 'landscape';
  scale?: number;
  quality?: number; // 0.1 to 1.0 (for JPEG/PNG compression)
  margin?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
  };
}

export interface ExportState {
  isExporting: boolean;
  progress: number; // 0 - 100%
  error: string | null;
}
```

---

## Edge Cases & Reliability Checklist

1. **Custom Web Fonts:** Ensure Google Fonts (Inter, Roboto, Outfit, Playfair Display, Merriweather, Fira Code) are fully loaded before triggering canvas capture to prevent system font fallback.
2. **Color Profile Accuracy:** Verify that modern CSS colors render consistently in sRGB canvas color space.
3. **Download Feedback:** While `isExporting` is active, display a loading spinner on the `[ Download PDF ]` header button and temporarily disable clicks to prevent duplicate downloads.