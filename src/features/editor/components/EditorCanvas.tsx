"use client";

import React from "react";
import {
  ChevronDown,
  Maximize2,
  Plus,
  Trash2,
  GripVertical,
  FileSpreadsheet,
  Type,
  ImageIcon,
  Shapes,
  X,
} from "lucide-react";
import { useMounted } from "@/hooks/useMounted";
import { useEditorState, getPageLayoutRows } from "../hooks/useEditorState";
import {
  TableBlock,
  TextBlock,
  ImageBlock,
  ShapeBlock,
  CanvasBlock,
  TableRowItem,
  TableColumn,
  PageGridRow,
  DEFAULT_TABLE_COLUMNS,
  FONT_FAMILY_MAP,
} from "../types";

interface AutoExpandingTextareaProps {
  value: string;
  onFocus?: () => void;
  onClick?: (e: React.MouseEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  style?: React.CSSProperties;
  className?: string;
  placeholder?: string;
}

function AutoExpandingTextarea({
  value,
  onFocus,
  onClick,
  onChange,
  style,
  className,
  placeholder,
}: AutoExpandingTextareaProps) {
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  const resize = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.max(22, textareaRef.current.scrollHeight)}px`;
    }
  };

  React.useEffect(() => {
    resize();
  }, [value, style?.fontSize, style?.fontFamily, style?.fontWeight]);

  return (
    <textarea
      ref={textareaRef}
      value={value}
      onFocus={onFocus}
      onClick={onClick}
      onChange={(e) => {
        onChange(e);
        resize();
      }}
      rows={1}
      style={style}
      className={className}
      placeholder={placeholder}
    />
  );
}

export function EditorCanvas() {
  const isMounted = useMounted();
  const metadata = useEditorState((s) => s.metadata);
  const setMetadata = useEditorState((s) => s.setMetadata);
  const pages = useEditorState((s) => s.pages);
  const activePage = useEditorState((s) => s.activePage);
  const setActivePage = useEditorState((s) => s.setActivePage);
  const zoomLevel = useEditorState((s) => s.zoomLevel);
  const setZoomLevel = useEditorState((s) => s.setZoomLevel);
  const toggleFullscreen = useEditorState((s) => s.toggleFullscreen);

  const selectedBlockId = useEditorState((s) => s.selectedBlockId);
  const setSelectedBlockId = useEditorState((s) => s.setSelectedBlockId);
  const selectedCell = useEditorState((s) => s.selectedCell);
  const setSelectedCell = useEditorState((s) => s.setSelectedCell);
  const selectedRowId = useEditorState((s) => s.selectedRowId);
  const setSelectedRowId = useEditorState((s) => s.setSelectedRowId);
  const selectedColumnId = useEditorState((s) => s.selectedColumnId);
  const setSelectedColumnId = useEditorState((s) => s.setSelectedColumnId);

  const updateTextBlock = useEditorState((s) => s.updateTextBlock);
  const updateTableRow = useEditorState((s) => s.updateTableRow);
  const addTableRow = useEditorState((s) => s.addTableRow);
  const deleteTableRow = useEditorState((s) => s.deleteTableRow);
  const addTableColumn = useEditorState((s) => s.addTableColumn);
  const deleteTableColumn = useEditorState((s) => s.deleteTableColumn);

  const addPageRow = useEditorState((s) => s.addPageRow);
  const deletePageRow = useEditorState((s) => s.deletePageRow);
  const addPageColumn = useEditorState((s) => s.addPageColumn);
  const deletePageColumn = useEditorState((s) => s.deletePageColumn);
  const updateRowColumnWidths = useEditorState((s) => s.updateRowColumnWidths);
  const addElementToColumn = useEditorState((s) => s.addElementToColumn);
  const removeElement = useEditorState((s) => s.removeElement);

  const rowRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const [resizingInfo, setResizingInfo] = React.useState<{
    rowId: string;
    colIdx: number;
    leftWidth: number;
    rightWidth: number;
  } | null>(null);

  const handleResizeMouseDown = (
    e: React.MouseEvent,
    row: PageGridRow,
    colIdx: number,
    pageNum: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const rowEl = rowRefs.current[row.id];
    if (!rowEl) return;

    const rowWidthPx = rowEl.getBoundingClientRect().width;
    if (rowWidthPx <= 0) return;

    const colCount = row.columns.length;
    const currentWidths = row.columns.map(
      (c) => c.width ?? Math.round((100 / colCount) * 10) / 10
    );

    const leftCol = row.columns[colIdx];
    const rightCol = row.columns[colIdx + 1];
    if (!leftCol || !rightCol) return;

    const initialLeft = currentWidths[colIdx];
    const initialRight = currentWidths[colIdx + 1];
    const combinedWidth = initialLeft + initialRight;
    const startX = e.clientX;
    const MIN_COL_WIDTH = 8; // minimum 8% width so columns don't collapse

    setResizingInfo({
      rowId: row.id,
      colIdx,
      leftWidth: initialLeft,
      rightWidth: initialRight,
    });

    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      const deltaPercent = (deltaX / rowWidthPx) * 100;

      let newLeft = initialLeft + deltaPercent;
      let newRight = initialRight - deltaPercent;

      if (newLeft < MIN_COL_WIDTH) {
        newLeft = MIN_COL_WIDTH;
        newRight = combinedWidth - MIN_COL_WIDTH;
      } else if (newRight < MIN_COL_WIDTH) {
        newRight = MIN_COL_WIDTH;
        newLeft = combinedWidth - MIN_COL_WIDTH;
      }

      newLeft = Math.round(newLeft * 10) / 10;
      newRight = Math.round((combinedWidth - newLeft) * 10) / 10;

      setResizingInfo({
        rowId: row.id,
        colIdx,
        leftWidth: newLeft,
        rightWidth: newRight,
      });

      const updatedWidths = currentWidths.map((w, i) => {
        if (i === colIdx) return { id: leftCol.id, width: newLeft };
        if (i === colIdx + 1) return { id: rightCol.id, width: newRight };
        return { id: row.columns[i].id, width: w };
      });

      updateRowColumnWidths(pageNum, row.id, updatedWidths);
    };

    const onMouseUp = () => {
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
      setResizingInfo(null);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  if (!isMounted) {
    return (
      <div className="w-full flex flex-col min-w-0">
        <div className="w-full flex items-center justify-between sm:justify-end gap-2 mb-2.5 px-1">
          <div className="h-6 w-32 bg-slate-200/60 rounded-md" />
        </div>
        <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200/90 p-4 sm:p-6 md:p-8 lg:p-12 min-h-[580px] sm:min-h-[680px]" />
      </div>
    );
  }

  const currentPage = pages.find((p) => p.pageNumber === activePage) || pages[0];

  const renderBlock = (block: CanvasBlock, pageNum: number) => {
    switch (block.type) {
      case "table": {
        const tableBlock = block as TableBlock;
        const isSelected = selectedBlockId === tableBlock.id;
        const fontFamily = tableBlock.fontFamily || "Inter";
        const fontSize = tableBlock.fontSize ? `${tableBlock.fontSize}px` : "14px";
        const color = tableBlock.color || "#1f2937";
        const columns: TableColumn[] =
          tableBlock.columns && tableBlock.columns.length > 0
            ? tableBlock.columns
            : DEFAULT_TABLE_COLUMNS;

        const isCellSelected = (rowId: number, colId: string) => {
          return (
            selectedCell?.blockId === tableBlock.id &&
            selectedCell?.rowId === rowId &&
            selectedCell?.columnKey === colId
          );
        };

        const handleCellFocus = (rowId: number, colId: string) => {
          setSelectedBlockId(tableBlock.id);
          setSelectedCell({ blockId: tableBlock.id, rowId, columnKey: colId });
        };

        const getEffectiveCellStyle = (
          row: TableRowItem,
          colId: string,
          defaultAlign?: "left" | "center" | "right"
        ) => {
          const cellStyle = row.cellStyles?.[colId] || {};
          const effectiveFontFamily = cellStyle.fontFamily || tableBlock.fontFamily || "Inter";
          const effectiveFontSize = cellStyle.fontSize ?? tableBlock.fontSize ?? 14;
          const effectiveFontWeight = cellStyle.fontWeight || tableBlock.fontWeight || "400";
          const effectiveColor = cellStyle.color || tableBlock.color || "#1f2937";
          const effectiveAlign =
            cellStyle.align ||
            defaultAlign ||
            (colId === "qty" || colId === "unitPrice"
              ? "center"
              : colId === "amount"
              ? "right"
              : tableBlock.align || "left");

          return {
            fontFamily:
              FONT_FAMILY_MAP[effectiveFontFamily] || "var(--font-inter), Inter, sans-serif",
            fontSize: `${effectiveFontSize}px`,
            fontWeight: effectiveFontWeight,
            color: effectiveColor,
            textAlign: effectiveAlign as "left" | "center" | "right",
          };
        };

        return (
          <div
            key={tableBlock.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedBlockId(tableBlock.id);
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
                <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-800 tracking-wide uppercase truncate">
                  {tableBlock.title}
                </h3>
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
                  <span>{fontSize}</span>
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
                    addTableRow(pageNum, tableBlock.id);
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
                    addTableColumn(pageNum, tableBlock.id);
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
                    removeElement(pageNum, tableBlock.id);
                  }}
                  aria-label="Delete table section"
                  className="p-1 sm:p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            {/* Table Container with Horizontal Scroll */}
            <div className="overflow-x-auto w-full -mx-1 px-1">
              <table className="min-w-[500px] w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-700 text-xs sm:text-sm font-bold border-y border-slate-200/80">
                    <th
                      className={`py-2.5 sm:py-3 px-1 w-7 text-center transition-opacity ${
                        isSelected
                          ? "opacity-100"
                          : "opacity-0 group-hover/table:opacity-100"
                      }`}
                    />
                    <th className="py-2.5 sm:py-3 px-2 sm:px-3 w-10 sm:w-12 text-center">#</th>
                    {columns.map((col) => (
                      <th
                        key={col.id}
                        className={`py-2.5 sm:py-3 px-2 sm:px-3 ${col.width || ""} ${
                          col.align === "center"
                            ? "text-center"
                            : col.align === "right"
                            ? "text-right"
                            : "text-left"
                        }`}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-xs sm:text-sm divide-y divide-slate-100">
                  {tableBlock.rows.map((row, index) => (
                    <tr key={row.id} className="group/row hover:bg-slate-50/50 transition">
                      {/* Drag Handle */}
                      <td
                        className={`py-2 sm:py-2.5 px-1 text-center text-slate-300 group-hover/row:text-slate-500 cursor-grab transition-opacity ${
                          isSelected
                            ? "opacity-100"
                            : "opacity-0 group-hover/table:opacity-100"
                        }`}
                      >
                        <GripVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4 mx-auto" />
                      </td>

                      {/* Row Index */}
                      <td className="py-2 sm:py-2.5 px-2 sm:px-3 text-center font-bold text-slate-700">
                        {index + 1}
                      </td>

                      {/* Dynamic Columns Rendering */}
                      {columns.map((col) => {
                        const isSelectedCell = isCellSelected(row.id, col.id);
                        const cellStyle = getEffectiveCellStyle(row, col.id, col.align);

                        if (col.id === "item") {
                          return (
                            <td key={col.id} className="py-2 sm:py-2.5 px-2 sm:px-3">
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
                                    pageNum,
                                    tableBlock.id,
                                    row.id,
                                    "item",
                                    e.target.value
                                  )
                                }
                                style={cellStyle}
                                className={`border rounded-md px-2.5 sm:px-3 py-1 sm:py-1.5 w-full outline-none transition-all ${
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
                            <td key={col.id} className="py-2 sm:py-2.5 px-2 sm:px-3 text-center">
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
                                    pageNum,
                                    tableBlock.id,
                                    row.id,
                                    "qty",
                                    Number(e.target.value) || 0
                                  )
                                }
                                style={cellStyle}
                                className={`border rounded-md px-2 sm:px-2.5 py-1 sm:py-1.5 text-center outline-none w-14 sm:w-16 mx-auto transition-all ${
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
                            <td key={col.id} className="py-2 sm:py-2.5 px-2 sm:px-3 text-center">
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
                                    pageNum,
                                    tableBlock.id,
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
                              onClick={(e) => {
                                e.stopPropagation();
                                handleCellFocus(row.id, col.id);
                              }}
                              style={cellStyle}
                              className={`py-2 sm:py-2.5 px-2 sm:px-3 text-right cursor-pointer rounded-md transition-all ${
                                isSelectedCell
                                  ? "ring-2 ring-blue-500/40 bg-blue-50/60 font-semibold"
                                  : "hover:bg-slate-100/60"
                              }`}
                            >
                              {row.amount}
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
                          <td key={col.id} className="py-2 sm:py-2.5 px-2 sm:px-3">
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
                                  pageNum,
                                  tableBlock.id,
                                  row.id,
                                  col.id,
                                  e.target.value
                                )
                              }
                              style={cellStyle}
                              className={`border rounded-md px-2.5 sm:px-3 py-1 sm:py-1.5 w-full outline-none transition-all ${
                                isSelectedCell
                                  ? "border-blue-500 ring-2 ring-blue-500/40 bg-white shadow-2xs"
                                  : "border-transparent bg-transparent hover:border-slate-200 hover:bg-slate-50/50 focus:border-blue-500 focus:bg-white"
                              }`}
                            />
                          </td>
                        );
                      })}
                    </tr>
                  ))}
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
                    addTableRow(pageNum, tableBlock.id);
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
                    addTableColumn(pageNum, tableBlock.id);
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
                    deleteTableColumn(pageNum, tableBlock.id);
                  }}
                  className="text-xs text-slate-400 hover:text-red-500 transition px-2 py-1 cursor-pointer"
                >
                  Delete Last Column
                </button>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteTableRow(pageNum, tableBlock.id);
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

      case "text": {
        const textBlock = block as TextBlock;
        const isSelected = selectedBlockId === textBlock.id;
        const fontFamily = textBlock.fontFamily || "Inter";
        const fontSize = textBlock.fontSize ? `${textBlock.fontSize}px` : "14px";
        const fontWeight = textBlock.fontWeight || "400";
        const color = textBlock.color || "#1f2937";
        const align = textBlock.align || "left";

        const textStyle: React.CSSProperties = {
          fontFamily: FONT_FAMILY_MAP[fontFamily] || "var(--font-inter), Inter, sans-serif",
          fontSize: fontSize,
          fontWeight: fontWeight,
          color: color,
          textAlign: align,
        };

        return (
          <div
            key={textBlock.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedBlockId(textBlock.id);
            }}
            className={`transition-all relative group/text cursor-text ${
              isSelected
                ? "border border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/15 rounded-xl p-3 sm:p-3.5 shadow-xs"
                : "border border-transparent hover:border-slate-200/80 rounded-lg p-0 sm:p-0.5 bg-transparent"
            }`}
          >
            {/* Header toolbar only visible when selected */}
            {isSelected ? (
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="flex items-center gap-1.5 text-slate-700 text-xs font-semibold uppercase tracking-wider shrink-0">
                    <Type className="w-3.5 h-3.5 text-blue-600" />
                    <span>Text Block</span>
                  </div>
                  {/* Styling summary badge */}
                  <div className="hidden xs:flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-white border border-slate-200/90 text-[10px] text-slate-500 font-medium shadow-2xs">
                    <span
                      className="w-2 h-2 rounded-full shrink-0 border border-slate-300"
                      style={{ backgroundColor: color }}
                    />
                    <span className="truncate max-w-[80px]">{fontFamily}</span>
                    <span>•</span>
                    <span>{fontSize}</span>
                  </div>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100/80 px-1.5 py-0.5 rounded">
                    Selected
                  </span>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeElement(pageNum, textBlock.id);
                    }}
                    aria-label="Delete text block"
                    className="text-slate-400 hover:text-red-500 p-1 rounded transition cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Unselected: subtle hover delete button so user can still remove if needed without full selection */
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeElement(pageNum, textBlock.id);
                }}
                aria-label="Delete text block"
                className="opacity-0 group-hover/text:opacity-100 absolute top-0 right-0 text-slate-400 hover:text-red-500 p-0.5 rounded bg-white/90 shadow-2xs border border-slate-200 transition cursor-pointer z-10"
              >
                <X className="w-3 h-3" />
              </button>
            )}

            <AutoExpandingTextarea
              value={textBlock.content}
              onFocus={() => setSelectedBlockId(textBlock.id)}
              onClick={(e) => {
                e.stopPropagation();
                setSelectedBlockId(textBlock.id);
              }}
              onChange={(e) => updateTextBlock(pageNum, textBlock.id, e.target.value)}
              style={textStyle}
              className={`w-full bg-transparent outline-none resize-none leading-relaxed transition-all ${
                isSelected
                  ? "border border-blue-200 focus:border-blue-400 focus:bg-white rounded-md p-1.5"
                  : "border-0 p-0 hover:border-0 rounded"
              }`}
              placeholder={isSelected ? "Type your notes or document description..." : "Enter text..."}
            />
          </div>
        );
      }

      case "image": {
        const imageBlock = block as ImageBlock;
        return (
          <div
            key={imageBlock.id}
            className="border border-slate-200/80 rounded-xl p-4 bg-white relative group shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>Image / Illustration</span>
              </div>
              <button
                type="button"
                onClick={() => removeElement(pageNum, imageBlock.id)}
                className="text-slate-400 hover:text-red-500 p-1 rounded transition cursor-pointer opacity-0 group-hover:opacity-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="w-full h-32 sm:h-40 rounded-lg bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50/40 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 gap-2">
              <ImageIcon className="w-8 h-8 text-slate-300" />
              <span className="text-xs font-medium text-slate-500">
                {imageBlock.caption || "Image Asset Placeholder"}
              </span>
            </div>
          </div>
        );
      }

      case "shape": {
        const shapeBlock = block as ShapeBlock;
        return (
          <div
            key={shapeBlock.id}
            className="border border-slate-200/80 rounded-xl p-3 bg-white relative group shadow-2xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <Shapes className="w-3.5 h-3.5 text-amber-500" />
                <span>Decorative Divider</span>
              </div>
              <button
                type="button"
                onClick={() => removeElement(pageNum, shapeBlock.id)}
                className="text-slate-400 hover:text-red-500 p-1 rounded transition cursor-pointer opacity-0 group-hover:opacity-100"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="w-full h-2.5 rounded-full bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-500 shadow-xs" />
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col select-none min-w-0">
      {/* Viewport Top Bar Controls */}
      <div className="w-full flex items-center justify-between gap-2 mb-2.5 px-1 max-w-[794px] mx-auto">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={activePage <= 1}
            onClick={() => setActivePage(activePage - 1)}
            aria-label="Previous page"
            className="px-2 py-1 rounded bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition"
          >
            ←
          </button>
          <span className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-2xs">
            Page {currentPage.pageNumber} of {pages.length}
          </span>
          <button
            type="button"
            disabled={activePage >= pages.length}
            onClick={() => setActivePage(activePage + 1)}
            aria-label="Next page"
            className="px-2 py-1 rounded bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition"
          >
            →
          </button>
          <span className="hidden sm:inline-flex items-center gap-1 text-[11px] font-semibold text-slate-500 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-2xs">
            A4 • 210 × 297 mm
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Selector */}
          <div className="relative">
            <select
              value={zoomLevel}
              onChange={(e) => setZoomLevel(e.target.value)}
              className="appearance-none flex items-center gap-1.5 pl-2.5 pr-6 sm:pl-3 sm:pr-7 py-1 sm:py-1.5 bg-white border border-slate-200 rounded-md text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer outline-none"
            >
              <option value="75%">75%</option>
              <option value="100%">100%</option>
              <option value="125%">125%</option>
              <option value="150%">150%</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label="Expand viewport"
            className="p-1 sm:p-1.5 bg-white border border-slate-200 rounded-md text-slate-600 hover:text-slate-900 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Main Document Canvas Sheet (A4 Dimensions: 210mm x 297mm / 794px x 1123px) */}
      <div
        id="document-sheet"
        onClick={() => {
          setSelectedBlockId(null);
          setSelectedCell(null);
          setSelectedRowId(null);
          setSelectedColumnId(null);
        }}
        className="w-full max-w-[794px] min-h-[1123px] mx-auto bg-white rounded-xl shadow-md border border-slate-200/90 p-6 sm:p-8 md:p-12 flex flex-col justify-between transition-all space-y-6 relative"
      >
        <div className="space-y-6 sm:space-y-8">
          {/* Page 1 Header (Company branding & title) */}
          {currentPage.pageNumber === 1 ? (
            <div className="space-y-3 sm:space-y-4">
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 sm:gap-0">
                {/* Company Info */}
                <div className="flex items-start gap-3 sm:gap-3.5">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-lg bg-blue-600 flex items-center justify-center relative overflow-hidden shadow-xs shrink-0">
                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white/25 rounded absolute -top-1 -right-1" />
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-sm" />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={metadata.companyName}
                      onChange={(e) => setMetadata({ companyName: e.target.value })}
                      className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-none bg-transparent outline-none border-b border-transparent hover:border-slate-200 focus:border-blue-500 w-full"
                    />
                    <input
                      type="text"
                      value={metadata.companyTagline}
                      onChange={(e) => setMetadata({ companyTagline: e.target.value })}
                      className="text-xs sm:text-sm text-slate-400 font-normal mt-1 sm:mt-1.5 bg-transparent outline-none border-b border-transparent hover:border-slate-200 focus:border-blue-500 w-full"
                    />
                  </div>
                </div>

                {/* Document Title */}
                <div>
                  <input
                    type="text"
                    value={metadata.documentTitle}
                    onChange={(e) => setMetadata({ documentTitle: e.target.value })}
                    className="text-lg sm:text-xl md:text-2xl font-black tracking-wide text-slate-900 uppercase bg-transparent outline-none border-b border-transparent hover:border-slate-200 focus:border-blue-500 sm:text-right"
                  />
                </div>
              </div>

              {/* Accent Divider Line */}
              <div className="relative border-b border-slate-200/90 pb-2 mb-2">
                <div className="absolute -bottom-[1px] left-0 w-16 sm:w-20 h-[2px] bg-blue-500 rounded-full" />
              </div>
            </div>
          ) : (
            /* Subsequent Page Compact Header */
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                  {currentPage.pageNumber}
                </div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {metadata.companyName} — Continuation Sheet
                </span>
              </div>
              <span className="text-xs font-medium text-slate-400">
                Ref: {metadata.documentNumber}
              </span>
            </div>
          )}

          {/* Dynamic Page Layout Grid Container */}
          <div className="space-y-4 sm:space-y-6">
            {getPageLayoutRows(currentPage).map((row, rowIdx) => {
              const isRowSelected = selectedRowId === row.id;
              const colCount = Math.max(1, row.columns.length);

              return (
                <div
                  key={row.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedRowId(row.id);
                    if (row.columns[0]) {
                      setSelectedColumnId(row.columns[0].id);
                    }
                  }}
                  className={`transition-all rounded-xl relative group/gridrow ${
                    isRowSelected
                      ? "p-2 sm:p-2.5 border border-blue-300/80 bg-blue-50/15 ring-1 ring-blue-400/20"
                      : "p-0 border border-transparent hover:border-slate-200/60 bg-transparent"
                  }`}
                >
                  {/* Row Header Helper Label (Visible when row is selected or on hover) */}
                  <div
                    className={`items-center justify-between mb-1.5 px-1 transition-opacity duration-150 ${
                      isRowSelected
                        ? "flex opacity-100"
                        : "flex opacity-0 group-hover/gridrow:opacity-100 pointer-events-none group-hover/gridrow:pointer-events-auto"
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Row {rowIdx + 1} ({colCount} Column{colCount > 1 ? "s" : ""})
                      </span>
                      {isRowSelected && (
                        <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100/80 px-1.5 py-0.5 rounded">
                          Active Grid Row
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedRowId(row.id);
                          addPageColumn(currentPage.pageNumber, row.id);
                        }}
                        className="flex items-center gap-1 text-[11px] font-medium text-slate-500 hover:text-blue-600 bg-white hover:bg-blue-50 border border-slate-200 rounded px-2 py-0.5 transition cursor-pointer shadow-2xs"
                      >
                        <Plus className="w-3 h-3" />
                        <span>Add Column</span>
                      </button>
                      {colCount > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePageColumn(currentPage.pageNumber, row.id);
                          }}
                          className="text-[11px] font-medium text-slate-400 hover:text-red-600 px-1.5 py-0.5 transition cursor-pointer"
                        >
                          Delete Col
                        </button>
                      )}
                      {getPageLayoutRows(currentPage).length > 1 && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            deletePageRow(currentPage.pageNumber, row.id);
                          }}
                          aria-label="Delete grid row"
                          className="text-slate-400 hover:text-red-600 p-1 rounded transition cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Responsive Column Flex Container with Percentage Widths & Draggable Resizers */}
                  <div
                    ref={(el) => {
                      rowRefs.current[row.id] = el;
                    }}
                    className="flex flex-row items-stretch w-full relative"
                  >
                    {row.columns.map((col, colIdx) => {
                      const isColSelected =
                        selectedRowId === row.id && selectedColumnId === col.id;
                      const effectiveWidth =
                        col.width ?? Math.round((100 / colCount) * 10) / 10;
                      const isBeingResized =
                        resizingInfo?.rowId === row.id &&
                        (resizingInfo.colIdx === colIdx || resizingInfo.colIdx + 1 === colIdx);

                      return (
                        <div
                          key={col.id}
                          style={{ width: `${effectiveWidth}%` }}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRowId(row.id);
                            setSelectedColumnId(col.id);
                          }}
                          className={`flex flex-col gap-2 min-w-0 relative shrink-0 px-1 sm:px-1.5 transition-[width] duration-75 ${
                            isColSelected && isRowSelected
                              ? "ring-1 ring-blue-400/40 bg-blue-50/10 rounded-lg"
                              : ""
                          }`}
                        >
                          {/* Active Resize Width Badge */}
                          {isBeingResized && (
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 px-1.5 py-0.5 bg-blue-600 text-white text-[9px] font-bold rounded-full shadow-xs pointer-events-none">
                              {Math.round(effectiveWidth)}%
                            </div>
                          )}

                          {col.blocks.length > 0 ? (
                            col.blocks.map((block) =>
                              renderBlock(block, currentPage.pageNumber)
                            )
                          ) : (
                            <div
                              className={`py-6 sm:py-8 border border-dashed rounded-xl flex flex-col items-center justify-center text-center p-2 sm:p-4 space-y-2 transition-all ${
                                isRowSelected
                                  ? "border-blue-300/80 bg-blue-50/20"
                                  : "border-slate-200/80 bg-slate-50/40 hover:border-blue-300 hover:bg-blue-50/10"
                              }`}
                            >
                              <span className="text-xs font-semibold text-slate-500">
                                Column {colIdx + 1} ({Math.round(effectiveWidth)}%)
                              </span>
                              <span className="text-[11px] text-slate-400">
                                Click to add element:
                              </span>
                              <div className="flex flex-wrap items-center justify-center gap-1.5 pt-1">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addElementToColumn(
                                      currentPage.pageNumber,
                                      row.id,
                                      col.id,
                                      "text"
                                    );
                                  }}
                                  className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition cursor-pointer shadow-2xs"
                                >
                                  + Text
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addElementToColumn(
                                      currentPage.pageNumber,
                                      row.id,
                                      col.id,
                                      "table"
                                    );
                                  }}
                                  className="px-2.5 py-1 rounded bg-blue-50 text-blue-600 border border-blue-200 text-xs font-medium hover:bg-blue-100 transition cursor-pointer shadow-2xs"
                                >
                                  + Table
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addElementToColumn(
                                      currentPage.pageNumber,
                                      row.id,
                                      col.id,
                                      "image"
                                    );
                                  }}
                                  className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition cursor-pointer shadow-2xs"
                                >
                                  + Image
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    addElementToColumn(
                                      currentPage.pageNumber,
                                      row.id,
                                      col.id,
                                      "shape"
                                    );
                                  }}
                                  className="px-2.5 py-1 rounded bg-white border border-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-50 transition cursor-pointer shadow-2xs"
                                >
                                  + Divider
                                </button>
                              </div>
                            </div>
                          )}

                          {/* Draggable Border Resize Handle between adjacent columns */}
                          {colIdx < row.columns.length - 1 && (
                            <div
                              onMouseDown={(e) =>
                                handleResizeMouseDown(
                                  e,
                                  row,
                                  colIdx,
                                  currentPage.pageNumber
                                )
                              }
                              onClick={(e) => e.stopPropagation()}
                              title="Drag border to resize column width"
                              className={`absolute -right-2 top-0 bottom-0 w-4 z-30 cursor-col-resize flex items-center justify-center group/resizer select-none transition-opacity ${
                                isRowSelected || isBeingResized
                                  ? "opacity-100"
                                  : "opacity-0 group-hover/gridrow:opacity-100"
                              }`}
                            >
                              <div
                                className={`w-[2px] h-full transition-all rounded-full ${
                                  isBeingResized
                                    ? "bg-blue-600 w-[3px] shadow-xs"
                                    : "bg-slate-300 group-hover/resizer:bg-blue-500 group-hover/resizer:w-[3px]"
                                }`}
                              />
                              <div className="opacity-0 group-hover/resizer:opacity-100 absolute -top-5 px-1.5 py-0.5 bg-slate-900 text-white text-[9px] font-semibold rounded shadow-md pointer-events-none transition-opacity whitespace-nowrap z-40">
                                ↔ Resize
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-3 flex justify-center">
            <button
              type="button"
              onClick={() => addPageRow(currentPage.pageNumber)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-dashed border-slate-300 hover:border-blue-400 text-xs font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 transition cursor-pointer opacity-75 hover:opacity-100"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Grid Row to Page</span>
            </button>
          </div>
        </div>

        {/* Canvas Footer */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-3 sm:gap-0 border-t border-slate-100 mt-6 sm:mt-8">
          <p className="text-[11px] sm:text-xs text-slate-400 italic text-center sm:text-left">
            Page {currentPage.pageNumber} of {pages.length} — Full PDF layout rendered on export.
          </p>

          {/* 3-Bar Geometric Graphic */}
          <div className="flex items-end gap-1">
            <div className="w-2.5 sm:w-3 h-3 sm:h-3.5 bg-sky-200 -skew-x-12 rounded-xs" />
            <div className="w-2.5 sm:w-3 h-5 sm:h-6 bg-sky-400 -skew-x-12 rounded-xs" />
            <div className="w-2.5 sm:w-3 h-7 sm:h-9 bg-blue-600 -skew-x-12 rounded-xs" />
          </div>
        </div>
      </div>
    </div>
  );
}
