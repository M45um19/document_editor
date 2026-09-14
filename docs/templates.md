# Feature Guide: Template Manager & Persistence

## Objective
Manage templates, state tabs, and automatic local storage persistence as specified in the assignment flow.

---

## Automatic Storage Flow Rules

1. **First-Time Boot:**
   * Check `localStorage` for the key `"template1"`.
   * If not found, initialize the Zustand store with the hardcoded **Default Template**.

2. **Modification & Saving:**
   * When the user modifies elements and clicks `[ Save ]` or `[+ Save Current as Template]`, serialize the current canvas tree into JSON.
   * Persist this JSON under the `localStorage` key `"template1"`.

3. **Subsequent Reopens:**
   * On application mount, automatically detect `"template1"` in `localStorage`.
   * Hydrate the canvas state with `"template1"`, bypassing the default template entirely.

---

## Bottom Panel UI Specs
* Display saved template cards with timestamps (creation/last modified).
* Provide an `[ Open ]` button to instantly hydrate the workspace canvas.