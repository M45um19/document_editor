"use client";

import React from "react";
import { GripVertical } from "lucide-react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { SortableTableRowProps } from "../../types";

export function SortableTableRow({
  row,
  index,
  columns,
  pageNum,
  tableBlock,
  isSelected,
  hasRowSpacing,
  isNoBorder,
  borderStyle,
  cellPadding,
  isCellSelected,
  getEffectiveCellStyle,
  handleCellFocus,
  updateTableRow,
}: SortableTableRowProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: `table-row-${tableBlock.id}-${row.id}`,
    data: {
      type: "table-row",
      blockId: tableBlock.id,
      pageNum,
      rowId: row.id,
      index,
    },
  });

  const sortableStyle: React.CSSProperties = {
    transform: CSS.Translate.toString(transform),
    transition,
    zIndex: isDragging ? 50 : undefined,
    position: isDragging ? "relative" : undefined,
    borderBottom: !hasRowSpacing && !isNoBorder ? borderStyle : undefined,
  };

  return (
    <tr
      ref={setNodeRef}
      style={sortableStyle}
      className={`group/row hover:bg-slate-50/50 transition ${
        hasRowSpacing ? "bg-white shadow-2xs rounded-lg" : ""
      } ${isDragging ? "bg-blue-50/90 shadow-md ring-2 ring-blue-400 opacity-75" : ""}`}
    >
      {/* Drag Handle */}
      <td
        {...attributes}
        {...listeners}
        style={{
          paddingTop: `${cellPadding}px`,
          paddingBottom: `${cellPadding}px`,
          paddingLeft: `${Math.max(2, Math.round(cellPadding * 0.5))}px`,
          paddingRight: `${Math.max(2, Math.round(cellPadding * 0.5))}px`,
          borderBottom: !hasRowSpacing && !isNoBorder ? borderStyle : undefined,
          touchAction: "none",
          ...(hasRowSpacing && !isNoBorder
            ? {
                borderTop: borderStyle,
                borderBottom: borderStyle,
                borderLeft: borderStyle,
              }
            : {}),
        }}
        className={`text-center text-slate-300 group-hover/row:text-slate-500 cursor-grab active:cursor-grabbing transition-opacity select-none ${
          isSelected
            ? "opacity-100"
            : "opacity-0 group-hover/table:opacity-100"
        } ${hasRowSpacing ? "rounded-l-lg" : ""}`}
        title="Drag to reorder row"
      >
        <GripVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4 mx-auto pointer-events-none" />
      </td>

      {/* Row Index */}
      <td
        style={{
          paddingTop: `${cellPadding}px`,
          paddingBottom: `${cellPadding}px`,
          paddingLeft: `${Math.max(4, Math.round(cellPadding * 0.75))}px`,
          paddingRight: `${Math.max(4, Math.round(cellPadding * 0.75))}px`,
          borderBottom: !hasRowSpacing && !isNoBorder ? borderStyle : undefined,
          ...(hasRowSpacing && !isNoBorder
            ? { borderTop: borderStyle, borderBottom: borderStyle }
            : {}),
        }}
        className="text-center font-bold text-slate-700 select-none"
      >
        {index + 1}
      </td>

      {/* Dynamic Columns Rendering */}
      {columns.map((col, colIdx) => {
        const isSelectedCell = isCellSelected(row.id, col.id);
        const cellStyle = getEffectiveCellStyle(row, col.id, col.align);
        const isLastCol = colIdx === columns.length - 1;

        const commonCellBorder = {
          borderBottom: !hasRowSpacing && !isNoBorder ? borderStyle : undefined,
          ...(hasRowSpacing && !isNoBorder
            ? {
                borderTop: borderStyle,
                borderBottom: borderStyle,
                ...(isLastCol ? { borderRight: borderStyle } : {}),
              }
            : {}),
        };

        if (col.id === "item") {
          return (
            <td
              key={col.id}
              style={{
                paddingTop: `${cellPadding}px`,
                paddingBottom: `${cellPadding}px`,
                paddingLeft: `${Math.max(4, Math.round(cellPadding * 0.9))}px`,
                paddingRight: `${Math.max(4, Math.round(cellPadding * 0.9))}px`,
                ...commonCellBorder,
              }}
              className={hasRowSpacing && isLastCol ? "rounded-r-lg" : ""}
            >
              <input
                type="text"
                value={row.item ?? ""}
                onFocus={() => handleCellFocus(row.id, col.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCellFocus(row.id, col.id);
                }}
                onChange={(e) =>
                  updateTableRow(
                    row.id,
                    "item",
                    e.target.value
                  )
                }
                style={cellStyle}
                className={`border rounded-md px-2.5 sm:px-3 py-1 w-full outline-none transition-all ${
                  isSelectedCell
                    ? "border-blue-500 ring-2 ring-blue-500/40 bg-white shadow-2xs"
                    : "border-transparent bg-transparent hover:border-slate-200 hover:bg-slate-50/50 focus:border-blue-500 focus:bg-white"
                }`}
              />
            </td>
          );
        }

        if (col.id === "qty") {
          return (
            <td
              key={col.id}
              style={{
                paddingTop: `${cellPadding}px`,
                paddingBottom: `${cellPadding}px`,
                paddingLeft: `${Math.max(4, Math.round(cellPadding * 0.9))}px`,
                paddingRight: `${Math.max(4, Math.round(cellPadding * 0.9))}px`,
                ...commonCellBorder,
              }}
              className={`text-center ${hasRowSpacing && isLastCol ? "rounded-r-lg" : ""}`}
            >
              <input
                type="number"
                value={row.qty ?? 0}
                onFocus={() => handleCellFocus(row.id, col.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCellFocus(row.id, col.id);
                }}
                onChange={(e) =>
                  updateTableRow(
                    row.id,
                    "qty",
                    Number(e.target.value) || 0
                  )
                }
                style={cellStyle}
                className={`border rounded-md px-2 sm:px-2.5 py-1 text-center outline-none w-14 sm:w-16 mx-auto transition-all ${
                  isSelectedCell
                    ? "border-blue-500 ring-2 ring-blue-500/40 bg-white shadow-2xs"
                    : "border-transparent bg-transparent hover:border-slate-200 hover:bg-slate-50/50 focus:border-blue-500 focus:bg-white"
                }`}
              />
            </td>
          );
        }

        if (col.id === "unitPrice") {
          return (
            <td
              key={col.id}
              style={{
                paddingTop: `${cellPadding}px`,
                paddingBottom: `${cellPadding}px`,
                paddingLeft: `${Math.max(4, Math.round(cellPadding * 0.9))}px`,
                paddingRight: `${Math.max(4, Math.round(cellPadding * 0.9))}px`,
                ...commonCellBorder,
              }}
              className={`text-center ${hasRowSpacing && isLastCol ? "rounded-r-lg" : ""}`}
            >
              <input
                type="text"
                value={row.unitPrice ?? ""}
                onFocus={() => handleCellFocus(row.id, col.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCellFocus(row.id, col.id);
                }}
                onChange={(e) =>
                  updateTableRow(
                    row.id,
                    "unitPrice",
                    e.target.value
                  )
                }
                style={cellStyle}
                className={`text-center outline-none border rounded-md px-2 py-1 w-16 sm:w-20 transition-all ${
                  isSelectedCell
                    ? "border-blue-500 ring-2 ring-blue-500/40 bg-white shadow-2xs"
                    : "border-transparent bg-transparent hover:border-slate-200 hover:bg-slate-50/50 focus:border-blue-500 focus:bg-white"
                }`}
              />
            </td>
          );
        }

        if (col.id === "amount") {
          return (
            <td
              key={col.id}
              style={{
                paddingTop: `${cellPadding}px`,
                paddingBottom: `${cellPadding}px`,
                paddingLeft: `${Math.max(4, Math.round(cellPadding * 0.9))}px`,
                paddingRight: `${Math.max(4, Math.round(cellPadding * 0.9))}px`,
                ...commonCellBorder,
              }}
              className={`text-right ${hasRowSpacing && isLastCol ? "rounded-r-lg" : ""}`}
            >
              <input
                type="text"
                value={row.amount ?? ""}
                onFocus={() => handleCellFocus(row.id, col.id)}
                onClick={(e) => {
                  e.stopPropagation();
                  handleCellFocus(row.id, col.id);
                }}
                onChange={(e) =>
                  updateTableRow(
                    row.id,
                    "amount",
                    e.target.value
                  )
                }
                style={cellStyle}
                className={`text-right outline-none border rounded-md px-2 py-1 w-full transition-all ${
                  isSelectedCell
                    ? "border-blue-500 ring-2 ring-blue-500/40 bg-white shadow-2xs"
                    : "border-transparent bg-transparent hover:border-slate-200 hover:bg-slate-50/50 focus:border-blue-500 focus:bg-white"
                }`}
              />
            </td>
          );
        }

        // Custom dynamic column
        const cellValue = row[col.id];
        const displayVal =
          typeof cellValue === "string" || typeof cellValue === "number"
            ? cellValue
            : "";

        return (
          <td
            key={col.id}
            style={{
              paddingTop: `${cellPadding}px`,
              paddingBottom: `${cellPadding}px`,
              paddingLeft: `${Math.max(4, Math.round(cellPadding * 0.9))}px`,
              paddingRight: `${Math.max(4, Math.round(cellPadding * 0.9))}px`,
              ...commonCellBorder,
            }}
            className={hasRowSpacing && isLastCol ? "rounded-r-lg" : ""}
          >
            <input
              type="text"
              value={displayVal}
              onFocus={() => handleCellFocus(row.id, col.id)}
              onClick={(e) => {
                e.stopPropagation();
                handleCellFocus(row.id, col.id);
              }}
              onChange={(e) =>
                updateTableRow(
                  row.id,
                  col.id,
                  e.target.value
                )
              }
              style={cellStyle}
              className={`border rounded-md px-2.5 sm:px-3 py-1 w-full outline-none transition-all ${
                isSelectedCell
                  ? "border-blue-500 ring-2 ring-blue-500/40 bg-white shadow-2xs"
                  : "border-transparent bg-transparent hover:border-slate-200 hover:bg-slate-50/50 focus:border-blue-500 focus:bg-white"
              }`}
            />
          </td>
        );
      })}
    </tr>
  );
}
