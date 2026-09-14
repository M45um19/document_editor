# Feature Guide: Visual Editor & Canvas

## Overview
The editor handles the interactive canvas sheet, left component toolbox, and right properties panel.

---

## Key Components & Responsibilities

### 1. Component Toolbox (Left Sidebar)
* Houses insertion buttons for Text Blocks, Simple Tables, Images, and Shapes.
* Quick-action shortcuts: `[+ Add Simple Table]` and `[+ Add New Text Line]`.
* Multi-page thumbnail manager and `[+ Add Page]` creator.

### 2. Visual Canvas (Center Sheet)
* Renders active layout elements (Company logo, Issuer/Client metadata, Line-item tables).
* Inline controls: `+ Add Row` and `+ Add Column`.
* **Row Reordering:** Powered by `@dnd-kit` using vertical drag handles (`⋮⋮`).

### 3. Properties Panel (Right Sidebar)
* **Text Settings:** Font family, size, weight, color, and alignment.
* **Table Settings:** Custom widths, borders, cell padding, and row spacing.
* Explicit buttons for row/column deletion and addition.

---

## ⚡ Performance Rules
* Prevent full-canvas re-renders when modifying minor node properties or rearranging table rows. Use fine-grained Zustand selectors.