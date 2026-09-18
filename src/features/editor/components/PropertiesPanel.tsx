"use client";

import React, { useState } from "react";
import {
  SlidersHorizontal,
  Type,
  Table as TableIcon,
  Columns,
  Rows,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  Trash2,
  X,
} from "lucide-react";
import { useEditorState, getPageLayoutRows } from "../hooks/useEditorState";
import {
  TextBlock,
  TableBlock,
  BlockTypographyStyle,
  FONT_FAMILY_MAP,
  AVAILABLE_FONTS,
  DEFAULT_TABLE_COLUMNS,
  DEFAULT_BORDER_STYLE_OPTIONS,
  TableStyleSettings,
} from "../types";

interface PropertiesPanelProps {
  onClose?: () => void;
  className?: string;
}

export function PropertiesPanel({ onClose, className = "" }: PropertiesPanelProps) {
  const pages = useEditorState((s) => s.pages);
  const activePage = useEditorState((s) => s.activePage);
  const selectedBlockId = useEditorState((s) => s.selectedBlockId);
  const setSelectedBlockId = useEditorState((s) => s.setSelectedBlockId);
  const selectedCell = useEditorState((s) => s.selectedCell);
  const setSelectedCell = useEditorState((s) => s.setSelectedCell);
  const selectedRowId = useEditorState((s) => s.selectedRowId);
  const updateBlockStyle = useEditorState((s) => s.updateBlockStyle);
  const updateTableCellStyle = useEditorState((s) => s.updateTableCellStyle);
  const addElement = useEditorState((s) => s.addElement);

  const addPageRow = useEditorState((s) => s.addPageRow);
  const deletePageRow = useEditorState((s) => s.deletePageRow);
  const addPageColumn = useEditorState((s) => s.addPageColumn);
  const deletePageColumn = useEditorState((s) => s.deletePageColumn);

  // Find active or first text/table block on current page
  const currentPageObj = pages.find((p) => p.pageNumber === activePage) || pages[0];
  const currentBlocks = currentPageObj?.blocks || [];
  const selectedBlock = currentBlocks.find(
    (b) => b.id === selectedBlockId && (b.type === "text" || b.type === "table")
  ) as (TextBlock | TableBlock) | undefined;
  const firstBlock = currentBlocks.find((b) => b.type === "text" || b.type === "table") as
    | (TextBlock | TableBlock)
    | undefined;
  const activeBlock = selectedBlock || firstBlock;

  // Active table block (either directly selected, or containing the selected cell, or first table on page)
  const activeTable = (
    selectedBlock?.type === "table"
      ? selectedBlock
      : currentBlocks.find((b) => b.type === "table")
  ) as TableBlock | undefined;

  const currentTableWidth =
    activeTable?.tableWidth !== undefined ? String(activeTable.tableWidth) : "100%";
  const currentBorderStyle =
    activeTable?.borderStyle || "1px solid #E5E7EB";
  const currentPadding =
    activeTable?.padding !== undefined ? activeTable.padding : 8;
  const currentRowSpacing =
    activeTable?.rowSpacing !== undefined ? activeTable.rowSpacing : 0;

  const handleTableSettingChange = (settings: Partial<TableStyleSettings>) => {
    if (!activeTable) return;
    if (selectedBlockId !== activeTable.id && !selectedCell) {
      setSelectedBlockId(activeTable.id);
    }
    updateBlockStyle(activePage, activeTable.id, settings);
  };

  // Check if a specific table cell is selected on the active block
  const isTableActive = activeBlock?.type === "table";
  const tableBlock = isTableActive ? (activeBlock as TableBlock) : null;
  const isCellActive =
    isTableActive &&
    selectedCell !== null &&
    tableBlock !== null &&
    selectedCell.blockId === tableBlock.id;

  const targetRow = isCellActive
    ? tableBlock?.rows.find((r) => r.id === selectedCell.rowId)
    : null;
  const columns =
    tableBlock?.columns && tableBlock.columns.length > 0
      ? tableBlock.columns
      : DEFAULT_TABLE_COLUMNS;
  const targetCol = isCellActive
    ? columns.find((c) => c.id === selectedCell.columnKey)
    : null;
  const cellStyle = (isCellActive && targetRow?.cellStyles?.[selectedCell.columnKey]) || null;

  // Active styling values (cell override > block style > default)
  const currentFontFamily =
    cellStyle?.fontFamily || activeBlock?.fontFamily || "Inter";
  const currentFontSize =
    cellStyle?.fontSize ?? activeBlock?.fontSize ?? 14;
  const currentFontWeight =
    cellStyle?.fontWeight || activeBlock?.fontWeight || "400";
  const currentColor =
    cellStyle?.color || activeBlock?.color || "#1F2937";
  const currentAlign =
    cellStyle?.align ||
    (isCellActive
      ? selectedCell.columnKey === "qty" || selectedCell.columnKey === "unitPrice"
        ? "center"
        : selectedCell.columnKey === "amount"
        ? "right"
        : activeBlock?.align || "left"
      : activeBlock?.align || "left");

  const handleStyleChange = (style: Partial<BlockTypographyStyle>) => {
    if (!activeBlock) return;

    if (selectedBlockId !== activeBlock.id) {
      setSelectedBlockId(activeBlock.id);
    }

    if (isCellActive && selectedCell) {
      updateTableCellStyle(
        activePage,
        activeBlock.id,
        selectedCell.rowId,
        selectedCell.columnKey,
        style
      );
    } else {
      updateBlockStyle(activePage, activeBlock.id, style);
    }
  };

  // Page Grid (Row & Column) Information
  const layoutRows = getPageLayoutRows(currentPageObj);
  const activeGridRow = layoutRows.find((r) => r.id === selectedRowId) || layoutRows[0];
  const activeGridRowIndex = activeGridRow
    ? layoutRows.findIndex((r) => r.id === activeGridRow.id) + 1
    : 1;
  const activeGridColCount = activeGridRow ? activeGridRow.columns.length : 1;

  const handleAddPageColumn = () => {
    addPageColumn(activePage, activeGridRow?.id);
  };

  const handleDeletePageColumn = () => {
    deletePageColumn(activePage, activeGridRow?.id);
  };

  const handleAddPageRow = () => {
    addPageRow(activePage);
  };

  const handleDeletePageRow = () => {
    deletePageRow(activePage, activeGridRow?.id);
  };

  return (
    <aside
      id="properties-panel"
      className={`w-full xl:w-80 2xl:w-[380px] 3xl:w-[440px] bg-white rounded-lg border border-slate-200/90 shadow-sm flex flex-col shrink-0 overflow-y-auto select-none p-4 sm:p-5 2xl:p-6 space-y-5 2xl:space-y-6 transition-all duration-200 ${className}`}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-2 2xl:pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 2xl:w-5 2xl:h-5 text-slate-700 shrink-0" />
          <h2 className="text-sm 2xl:text-base font-bold text-slate-900">Properties & Data</h2>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Properties Panel"
            className="xl:hidden p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Text Settings Section */}
      <div className="space-y-3 2xl:space-y-4">
        {/* Tab Header */}
        <div className="flex items-center gap-2 border-b-2 border-blue-600 pb-1 2xl:pb-1.5 w-fit text-blue-600 font-bold text-xs 2xl:text-sm">
          <Type className="w-4 h-4 2xl:w-4.5 2xl:h-4.5" />
          <span>Text Settings</span>
        </div>

        {/* Scope Indicator Banner */}
        {activeBlock && (
          isCellActive && targetRow && targetCol ? (
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-blue-50/90 border border-blue-200 text-xs text-blue-950">
              <span className="font-semibold truncate">
                Cell: Row {tableBlock.rows.findIndex((r) => r.id === targetRow.id) + 1} • {targetCol.label}
              </span>
              <button
                type="button"
                onClick={() => setSelectedCell(null)}
                className="text-[11px] text-blue-600 hover:text-blue-800 underline ml-2 cursor-pointer shrink-0 font-semibold"
              >
                Style Table
              </button>
            </div>
          ) : isTableActive && tableBlock ? (
            <div className="flex items-center justify-between px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-700">
              <span className="font-semibold truncate">
                Target: Entire Table ({tableBlock.title})
              </span>
              <span className="text-[10px] text-slate-400">Click a cell to style</span>
            </div>
          ) : (
            <div className="px-2.5 py-1.5 rounded-md bg-slate-50 border border-slate-200 text-xs text-slate-700 font-semibold truncate">
              Target: Text Block
            </div>
          )
        )}

        {activeBlock ? (
          <>
            {/* Form Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 2xl:gap-4 pt-1">
              {/* Font Family */}
              <div className="space-y-1 2xl:space-y-1.5">
                <label className="text-[11px] 2xl:text-xs font-medium text-slate-600 block">
                  Font Family
                </label>
                <div className="relative">
                  <select
                    value={currentFontFamily}
                    onChange={(e) => handleStyleChange({ fontFamily: e.target.value })}
                    style={{ fontFamily: FONT_FAMILY_MAP[currentFontFamily] || "inherit" }}
                    className="w-full appearance-none pl-2.5 pr-7 py-1.5 2xl:py-2 border border-slate-200 rounded-md text-xs 2xl:text-sm font-medium text-slate-800 bg-white shadow-2xs hover:border-slate-300 focus:border-blue-500 outline-none cursor-pointer"
                  >
                    {AVAILABLE_FONTS.map((font) => (
                      <option
                        key={font}
                        value={font}
                        style={{ fontFamily: FONT_FAMILY_MAP[font] || "inherit" }}
                      >
                        {font}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Font Size */}
              <div className="space-y-1 2xl:space-y-1.5">
                <label className="text-[11px] 2xl:text-xs font-medium text-slate-600 block">
                  Font Size
                </label>
                <div className="flex items-center border border-slate-200 rounded-md px-2.5 2xl:px-3 py-1.5 2xl:py-2 bg-white shadow-2xs focus-within:border-blue-500">
                  <input
                    type="number"
                    value={currentFontSize}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      handleStyleChange({ fontSize: isNaN(val) ? 14 : val });
                    }}
                    className="w-full text-xs 2xl:text-sm font-medium text-slate-800 outline-none bg-transparent"
                  />
                  <span className="text-[11px] 2xl:text-xs text-slate-400 font-medium ml-1">
                    px
                  </span>
                </div>
              </div>

              {/* Font Weight */}
              <div className="space-y-1 2xl:space-y-1.5">
                <label className="text-[11px] 2xl:text-xs font-medium text-slate-600 block">
                  Font Weight
                </label>
                <div className="relative">
                  <select
                    value={currentFontWeight}
                    onChange={(e) => handleStyleChange({ fontWeight: e.target.value })}
                    style={{ fontWeight: currentFontWeight }}
                    className="w-full appearance-none pl-2.5 pr-7 py-1.5 2xl:py-2 border border-slate-200 rounded-md text-xs 2xl:text-sm font-medium text-slate-800 bg-white shadow-2xs hover:border-slate-300 focus:border-blue-500 outline-none cursor-pointer"
                  >
                    <option value="300" style={{ fontWeight: 300 }}>Light (300)</option>
                    <option value="400" style={{ fontWeight: 400 }}>Regular (400)</option>
                    <option value="500" style={{ fontWeight: 500 }}>Medium (500)</option>
                    <option value="600" style={{ fontWeight: 600 }}>SemiBold (600)</option>
                    <option value="700" style={{ fontWeight: 700 }}>Bold (700)</option>
                    <option value="800" style={{ fontWeight: 800 }}>ExtraBold (800)</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Text Color */}
              <div className="space-y-1 2xl:space-y-1.5">
                <label className="text-[11px] 2xl:text-xs font-medium text-slate-600 block">
                  Text Color
                </label>
                <div className="flex items-center gap-2 border border-slate-200 rounded-md px-2 2xl:px-2.5 py-1.5 2xl:py-2 bg-white shadow-2xs focus-within:border-blue-500 relative cursor-pointer">
                  <input
                    type="color"
                    value={currentColor.startsWith("#") ? currentColor : "#1F2937"}
                    onChange={(e) => handleStyleChange({ color: e.target.value })}
                    className="w-4 h-4 2xl:w-4.5 2xl:h-4.5 rounded-xs border border-slate-300 shrink-0 cursor-pointer p-0 bg-transparent"
                  />
                  <input
                    type="text"
                    value={currentColor}
                    onChange={(e) => handleStyleChange({ color: e.target.value })}
                    className="w-full text-xs 2xl:text-sm font-medium text-slate-800 outline-none bg-transparent"
                    placeholder="#1F2937"
                  />
                </div>
              </div>
            </div>

            {/* Alignment Controls */}
            <div className="space-y-1.5 2xl:space-y-2 pt-1">
              <label className="text-[11px] 2xl:text-xs font-medium text-slate-600 block">
                Alignment
              </label>
              <div className="flex items-center gap-1.5 2xl:gap-2">
                <button
                  type="button"
                  onClick={() => handleStyleChange({ align: "left" })}
                  className={`p-1.5 2xl:p-2 rounded-md border flex items-center justify-center transition cursor-pointer ${
                    currentAlign === "left"
                      ? "border-blue-200 bg-blue-50 text-blue-600 shadow-xs"
                      : "border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <AlignLeft className="w-4 h-4 2xl:w-4.5 2xl:h-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleStyleChange({ align: "center" })}
                  className={`p-1.5 2xl:p-2 rounded-md border flex items-center justify-center transition cursor-pointer ${
                    currentAlign === "center"
                      ? "border-blue-200 bg-blue-50 text-blue-600 shadow-xs"
                      : "border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <AlignCenter className="w-4 h-4 2xl:w-4.5 2xl:h-4.5" />
                </button>
                <button
                  type="button"
                  onClick={() => handleStyleChange({ align: "right" })}
                  className={`p-1.5 2xl:p-2 rounded-md border flex items-center justify-center transition cursor-pointer ${
                    currentAlign === "right"
                      ? "border-blue-200 bg-blue-50 text-blue-600 shadow-xs"
                      : "border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50"
                  }`}
                >
                  <AlignRight className="w-4 h-4 2xl:w-4.5 2xl:h-4.5" />
                </button>
              </div>
            </div>
          </>
        ) : (
          <div className="py-4 px-3 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-center space-y-2">
            <p className="text-xs text-slate-500">
              No text or table element on this page yet. Click below to add one and customize its fonts.
            </p>
            <button
              type="button"
              onClick={() => addElement("text")}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition cursor-pointer shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Text Block</span>
            </button>
          </div>
        )}
      </div>

      {/* Table Settings Section */}
      <div className="space-y-3 2xl:space-y-4 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-xs 2xl:text-sm">
          <TableIcon className="w-4 h-4 2xl:w-4.5 2xl:h-4.5 text-slate-700" />
          <span>Table Settings</span>
        </div>

        {activeTable ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 2xl:gap-4">
            {/* Width */}
            <div className="space-y-1 2xl:space-y-1.5">
              <label className="text-[11px] 2xl:text-xs font-medium text-slate-600 block">
                Width
              </label>
              <div className="flex items-center border border-slate-200 rounded-md px-2.5 2xl:px-3 py-1.5 2xl:py-2 bg-white shadow-2xs focus-within:border-blue-500">
                <input
                  type="text"
                  value={currentTableWidth}
                  onChange={(e) => handleTableSettingChange({ tableWidth: e.target.value })}
                  placeholder="100%"
                  className="w-full text-xs 2xl:text-sm font-medium text-slate-800 outline-none bg-transparent"
                />
              </div>
            </div>

            {/* Borders */}
            <div className="space-y-1 2xl:space-y-1.5">
              <label className="text-[11px] 2xl:text-xs font-medium text-slate-600 block">
                Borders
              </label>
              <div className="relative">
                <select
                  value={currentBorderStyle}
                  onChange={(e) => handleTableSettingChange({ borderStyle: e.target.value })}
                  className="w-full appearance-none pl-2.5 pr-7 py-1.5 2xl:py-2 border border-slate-200 rounded-md text-xs 2xl:text-sm font-medium text-slate-800 bg-white shadow-2xs hover:border-slate-300 focus:border-blue-500 outline-none cursor-pointer truncate"
                >
                  {DEFAULT_BORDER_STYLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Padding */}
            <div className="space-y-1 2xl:space-y-1.5">
              <label className="text-[11px] 2xl:text-xs font-medium text-slate-600 block">
                Padding
              </label>
              <div className="flex items-center border border-slate-200 rounded-md px-2.5 2xl:px-3 py-1.5 2xl:py-2 bg-white shadow-2xs focus-within:border-blue-500">
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={currentPadding}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    handleTableSettingChange({ padding: isNaN(val) ? 0 : val });
                  }}
                  className="w-full text-xs 2xl:text-sm font-medium text-slate-800 outline-none bg-transparent"
                />
                <span className="text-[11px] 2xl:text-xs text-slate-400 font-medium ml-1">
                  px
                </span>
              </div>
            </div>

            {/* Row Spacing */}
            <div className="space-y-1 2xl:space-y-1.5">
              <label className="text-[11px] 2xl:text-xs font-medium text-slate-600 block">
                Row Spacing
              </label>
              <div className="flex items-center border border-slate-200 rounded-md px-2.5 2xl:px-3 py-1.5 2xl:py-2 bg-white shadow-2xs focus-within:border-blue-500">
                <input
                  type="number"
                  min={0}
                  max={40}
                  value={currentRowSpacing}
                  onChange={(e) => {
                    const val = parseInt(e.target.value, 10);
                    handleTableSettingChange({ rowSpacing: isNaN(val) ? 0 : val });
                  }}
                  className="w-full text-xs 2xl:text-sm font-medium text-slate-800 outline-none bg-transparent"
                />
                <span className="text-[11px] 2xl:text-xs text-slate-400 font-medium ml-1">
                  px
                </span>
              </div>
            </div>
          </div>
        ) : (
          <div className="py-3 px-3 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-center">
            <p className="text-xs text-slate-500">
              No table found on this page. Add a table to customize its settings.
            </p>
          </div>
        )}
      </div>

      {/* Page Column Management */}
      <div className="space-y-2 2xl:space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs 2xl:text-sm">
            <Columns className="w-4 h-4 2xl:w-4.5 2xl:h-4.5 text-blue-600" />
            <span>Column Management</span>
          </div>
          <span className="text-[10px] 2xl:text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            Row {activeGridRowIndex}: {activeGridColCount} Col{activeGridColCount > 1 ? "s" : ""}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 2xl:gap-3">
          <button
            type="button"
            onClick={handleAddPageColumn}
            className="flex items-center justify-center gap-1.5 py-2 2xl:py-2.5 px-2 rounded-md border border-slate-200 bg-white text-xs 2xl:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-slate-500" />
            <span>Add Column</span>
          </button>

          <button
            type="button"
            onClick={handleDeletePageColumn}
            disabled={activeGridColCount <= 1}
            className="flex items-center justify-center gap-1.5 py-2 2xl:py-2.5 px-2 rounded-md border border-slate-200 bg-white text-xs 2xl:text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-slate-500" />
            <span>Delete Column</span>
          </button>
        </div>
      </div>

      {/* Page Row Management */}
      <div className="space-y-2 2xl:space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-slate-800 font-bold text-xs 2xl:text-sm">
            <Rows className="w-4 h-4 2xl:w-4.5 2xl:h-4.5 text-slate-700" />
            <span>Row Management</span>
          </div>
          <span className="text-[10px] 2xl:text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
            Page {activePage}: {layoutRows.length} Row{layoutRows.length > 1 ? "s" : ""}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 2xl:gap-3">
          <button
            type="button"
            onClick={handleAddPageRow}
            className="flex items-center justify-center gap-1.5 py-2 2xl:py-2.5 px-2 rounded-md border border-slate-200 bg-white text-xs 2xl:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-slate-500" />
            <span>Add Row</span>
          </button>

          <button
            type="button"
            onClick={handleDeletePageRow}
            disabled={layoutRows.length <= 1}
            className="flex items-center justify-center gap-1.5 py-2 2xl:py-2.5 px-2 rounded-md border border-slate-200 bg-white text-xs 2xl:text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-slate-500" />
            <span>Delete Row</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
