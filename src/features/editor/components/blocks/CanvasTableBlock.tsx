"use client";

import React from "react";
import { FileSpreadsheet, Plus, Trash2 } from "lucide-react";
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import {
  TableColumn,
  DEFAULT_TABLE_COLUMNS,
  CanvasTableBlockProps,
} from "../../types";
import { SortableTableRow } from "./SortableTableRow";

export function CanvasTableBlock({
  block,
  pageNum,
  rowId,
  columnId,
  isSelected,
  isCellSelected,
  onSelect,
  onSelectCell,
  onUpdateTitle,
  onUpdateColumnLabel,
  onUpdateTableRow,
  onAddRow,
  onDeleteRow,
  onAddColumn,
  onDeleteColumn,
  onDeleteBlock,
  getEffectiveCellStyle,
}: CanvasTableBlockProps) {
  const fontFamily = block.fontFamily || "Inter";
  const color = block.color || "#1f2937";
  const columns: TableColumn[] =
    block.columns && block.columns.length > 0
      ? block.columns
      : DEFAULT_TABLE_COLUMNS;

  const handleCellFocus = (rId: number, colId: string) => {
    onSelect();
    onSelectCell({ blockId: block.id, rowId: rId, columnKey: colId });
  };

  // Table formatting options
  const rawWidth = block.tableWidth ?? "100%";
  let formattedTableWidth = "100%";
  if (typeof rawWidth === "number") {
    formattedTableWidth = `${rawWidth}%`;
  } else if (typeof rawWidth === "string") {
    const trimmed = rawWidth.trim();
    if (!trimmed) {
      formattedTableWidth = "100%";
    } else if (
      trimmed.endsWith("%") ||
      trimmed.endsWith("px") ||
      trimmed.endsWith("rem") ||
      trimmed.endsWith("em") ||
      trimmed.endsWith("vw")
    ) {
      formattedTableWidth = trimmed;
    } else {
      const num = Number(trimmed);
      if (!isNaN(num)) {
        formattedTableWidth = num <= 100 ? `${num}%` : `${num}px`;
      } else {
        formattedTableWidth = trimmed;
      }
    }
  }

  const borderStyle = block.borderStyle || "1px solid #E5E7EB";
  const isNoBorder = borderStyle === "none";
  const cellPadding = block.padding !== undefined ? block.padding : 8;
  const rowSpacing = block.rowSpacing !== undefined ? block.rowSpacing : 0;
  const hasRowSpacing = rowSpacing > 0;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`rounded-xl transition-all cursor-default relative group/table ${
        isSelected
          ? "border border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/10 p-3 sm:p-4 md:p-5 shadow-xs space-y-3 sm:space-y-3.5"
          : "border border-transparent hover:border-slate-200/80 p-1 sm:p-2 bg-transparent space-y-2"
      }`}
    >
      {/* Table Header Controls */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
          <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
            <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </div>
          <input
            type="text"
            value={block.title ?? ""}
            onClick={(e) => e.stopPropagation()}
            onChange={(e) => onUpdateTitle(e.target.value)}
            placeholder="QUOTATION ITEMS"
            className="text-xs sm:text-sm md:text-base font-bold text-slate-800 tracking-wide uppercase bg-transparent hover:bg-slate-100/80 focus:bg-white focus:ring-2 focus:ring-blue-500/30 rounded px-1.5 py-0.5 outline-none transition max-w-[180px] xs:max-w-[240px] sm:max-w-xs md:max-w-md cursor-text"
            title="Click to edit table heading"
          />
          {/* Styling summary badge - visible on hover or select */}
          <div
            className={`items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-50 border border-slate-200/90 text-[10px] text-slate-500 font-medium shadow-2xs transition-opacity ${
              isSelected
                ? "hidden xs:flex opacity-100"
                : "hidden xs:flex opacity-0 group-hover/table:opacity-100"
            }`}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0 border border-slate-300"
              style={{ backgroundColor: color }}
            />
            <span className="truncate max-w-[80px]">{fontFamily}</span>
            <span>•</span>
            <span>{formattedTableWidth}</span>
            <span>•</span>
            <span>Pad: {cellPadding}px</span>
            <span>•</span>
            <span>{columns.length} Cols</span>
          </div>
        </div>

        <div
          className={`flex items-center gap-1.5 sm:gap-2 shrink-0 transition-opacity duration-150 ${
            isSelected
              ? "opacity-100"
              : "opacity-0 group-hover/table:opacity-100 pointer-events-none group-hover/table:pointer-events-auto"
          }`}
        >
          {isSelected && (
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100/80 px-1.5 py-0.5 rounded">
              Selected
            </span>
          )}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddRow();
            }}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-blue-50/70 border border-blue-200 text-blue-600 hover:bg-blue-100 text-xs sm:text-sm font-semibold transition cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Row</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddColumn();
            }}
            className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-blue-50/70 border border-blue-200 text-blue-600 hover:bg-blue-100 text-xs sm:text-sm font-semibold transition cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Column</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteBlock();
            }}
            aria-label="Delete table section"
            className="p-1 sm:p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Table Container with Horizontal Scroll & Alignment */}
      <div
        className="overflow-x-auto w-full -mx-1 px-1 flex"
        style={{
          justifyContent:
            block.align === "center"
              ? "center"
              : block.align === "right"
              ? "flex-end"
              : "flex-start",
        }}
      >
        <table
          style={{
            width: formattedTableWidth,
            maxWidth: "100%",
            borderCollapse: hasRowSpacing ? "separate" : "collapse",
            borderSpacing: hasRowSpacing ? `0 ${rowSpacing}px` : undefined,
          }}
          className="min-w-[480px] text-left"
        >
          <thead>
            <tr
              style={{
                borderTop: isNoBorder ? "none" : borderStyle,
                borderBottom: isNoBorder ? "none" : borderStyle,
              }}
              className="bg-slate-50/80 text-slate-700 text-xs sm:text-sm font-bold"
            >
              <th
                style={{
                  paddingTop: `${cellPadding}px`,
                  paddingBottom: `${cellPadding}px`,
                  paddingLeft: `${Math.max(2, Math.round(cellPadding * 0.5))}px`,
                  paddingRight: `${Math.max(2, Math.round(cellPadding * 0.5))}px`,
                  borderBottom: isNoBorder ? "none" : borderStyle,
                }}
                className={`w-7 text-center transition-opacity ${
                  isSelected
                    ? "opacity-100"
                    : "opacity-0 group-hover/table:opacity-100"
                }`}
              />
              <th
                style={{
                  paddingTop: `${cellPadding}px`,
                  paddingBottom: `${cellPadding}px`,
                  paddingLeft: `${Math.max(4, Math.round(cellPadding * 0.75))}px`,
                  paddingRight: `${Math.max(4, Math.round(cellPadding * 0.75))}px`,
                  borderBottom: isNoBorder ? "none" : borderStyle,
                }}
                className="w-10 sm:w-12 text-center"
              >
                #
              </th>
              {columns.map((col) => (
                <th
                  key={col.id}
                  style={{
                    paddingTop: `${cellPadding}px`,
                    paddingBottom: `${cellPadding}px`,
                    paddingLeft: `${Math.max(4, Math.round(cellPadding * 0.9))}px`,
                    paddingRight: `${Math.max(4, Math.round(cellPadding * 0.9))}px`,
                    borderBottom: isNoBorder ? "none" : borderStyle,
                  }}
                  className={`${col.width || ""} ${
                    col.align === "center"
                      ? "text-center"
                      : col.align === "right"
                      ? "text-right"
                      : "text-left"
                  }`}
                >
                  <input
                    type="text"
                    value={col.label ?? ""}
                    onClick={(e) => e.stopPropagation()}
                    onChange={(e) => onUpdateColumnLabel(col.id, e.target.value)}
                    placeholder="Column"
                    className={`w-full bg-transparent font-bold text-slate-700 text-xs sm:text-sm hover:bg-slate-200/50 focus:bg-white focus:ring-2 focus:ring-blue-500/30 rounded px-1.5 py-0.5 outline-none transition cursor-text ${
                      col.align === "center"
                        ? "text-center"
                        : col.align === "right"
                        ? "text-right"
                        : "text-left"
                    }`}
                    title="Click to edit column name"
                  />
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="text-xs sm:text-sm">
            <SortableContext
              items={block.rows.map((r) => `table-row-${block.id}-${r.id}`)}
              strategy={verticalListSortingStrategy}
            >
              {block.rows.map((row, index) => (
                <SortableTableRow
                  key={row.id}
                  row={row}
                  index={index}
                  columns={columns}
                  pageNum={pageNum}
                  tableBlock={block}
                  isSelected={isSelected}
                  hasRowSpacing={hasRowSpacing}
                  isNoBorder={isNoBorder}
                  borderStyle={borderStyle}
                  cellPadding={cellPadding}
                  isCellSelected={isCellSelected}
                  getEffectiveCellStyle={getEffectiveCellStyle}
                  handleCellFocus={handleCellFocus}
                  updateTableRow={onUpdateTableRow}
                />
              ))}
            </SortableContext>
          </tbody>
        </table>
      </div>

      {/* Bottom table actions */}
      <div
        className={`pt-1 sm:pt-2 flex flex-wrap items-center justify-between gap-2 transition-opacity duration-150 ${
          isSelected
            ? "opacity-100"
            : "opacity-0 group-hover/table:opacity-100 pointer-events-none group-hover/table:pointer-events-auto"
        }`}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddRow();
            }}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg bg-blue-50/70 border border-blue-200 text-blue-600 hover:bg-blue-100 text-xs sm:text-sm font-semibold transition cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Row</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onAddColumn();
            }}
            className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg bg-blue-50/70 border border-blue-200 text-blue-600 hover:bg-blue-100 text-xs sm:text-sm font-semibold transition cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Column</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteColumn();
            }}
            className="text-xs text-slate-400 hover:text-red-500 transition px-2 py-1 cursor-pointer"
          >
            Delete Last Column
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDeleteRow();
            }}
            className="text-xs text-slate-400 hover:text-red-500 transition px-2 py-1 cursor-pointer"
          >
            Delete Last Row
          </button>
        </div>
      </div>
    </div>
  );
}
