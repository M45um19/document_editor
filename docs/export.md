# Feature Guide: PDF Export Engine

## Overview
Defines the behavior of the primary `[ Download PDF ]` action located in the top navigation header.

---

## Implementation Requirements
* **Trigger:** Clicking `[ Download PDF ]` initiates a client-side conversion of the active canvas sheet.
* **Fidelity:** The generated PDF must visually match the current canvas styling, fonts, and table dimensions without cutting off multi-page elements.
* **Libraries:** Use reliable client-side packages (e.g., `html2canvas` combined with `jspdf`, or `@react-pdf/renderer`) wrapped inside a utility service within `src/features/export/services/`.