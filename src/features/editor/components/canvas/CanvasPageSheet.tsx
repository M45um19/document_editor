"use client";

import React, { useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import {
  CanvasBlock,
  PageGridRow,
  TableBlock,
  TextBlock,
  ImageBlock,
  ShapeBlock,
  TableRowItem,
  PAPER_SIZES,
  CanvasPageSheetProps,
} from "../../types";
import { useEditorState } from "../../hooks/useEditorState";
import { getPageLayoutRows } from "../../utils/paginationUtils";
import { RowMarginHandle } from "./RowMarginHandle";
import { CanvasTextBlock } from "../blocks/CanvasTextBlock";
import { CanvasTableBlock } from "../blocks/CanvasTableBlock";
import { CanvasImageBlock } from "../blocks/CanvasImageBlock";
import { CanvasShapeBlock } from "../blocks/CanvasShapeBlock";

export function CanvasPageSheet({
  page,
  pageIndex,
  totalPages,
  metadata,
  paperSize,
  activePage,
  selectedBlockId,
  selectedCell,
  selectedRowId,
  selectedColumnId,
  resizingRowId,
  resizingEdge,
  onSelectPage,
  onSelectBlock,
  onSelectCell,
  onSelectRow,
  onSelectColumn,
  onAddPageRow,
  onDeletePageRow,
  onAddPageColumn,
  onDeletePageColumn,
  onDeletePage,
  onUpdateColumnWidths,
  onStartRowMarginResize,
}: CanvasPageSheetProps) {
  const rowRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const updateTextBlock = useEditorState((s) => s.updateTextBlock);
  const updateImageBlock = useEditorState((s) => s.updateImageBlock);
  const updateShapeBlock = useEditorState((s) => s.updateShapeBlock);
  const updateTableTitle = useEditorState((s) => s.updateTableTitle);
  const updateTableColumnLabel = useEditorState((s) => s.updateTableColumnLabel);
  const updateTableRow = useEditorState((s) => s.updateTableRow);
  const addTableRow = useEditorState((s) => s.addTableRow);
  const deleteTableRow = useEditorState((s) => s.deleteTableRow);
  const addTableColumn = useEditorState((s) => s.addTableColumn);
  const deleteTableColumn = useEditorState((s) => s.deleteTableColumn);
  const removeElement = useEditorState((s) => s.removeElement);
  const addElementToColumn = useEditorState((s) => s.addElementToColumn);

  const [resizingColInfo, setResizingColInfo] = useState<{
    rowId: string;
    colIdx: number;
    leftWidth: number;
    rightWidth: number;
  } | null>(null);

  const handleResizeMouseDown = (
    e: React.MouseEvent,
    row: PageGridRow,
    colIdx: number
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
    const MIN_COL_WIDTH = 8;

    setResizingColInfo({
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

      setResizingColInfo({
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

      onUpdateColumnWidths(page.pageNumber, row.id, updatedWidths);
    };

    const onMouseUp = () => {
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
      setResizingColInfo(null);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };

  const isCellSelected = (tableId: string, rowId: number, colId: string) => {
    return (
      selectedCell?.blockId === tableId &&
      selectedCell?.rowId === rowId &&
      selectedCell?.columnKey === colId
    );
  };

  const getEffectiveCellStyle = (
    tableBlock: TableBlock,
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
      fontFamily: effectiveFontFamily,
      fontSize: `${effectiveFontSize}px`,
      fontWeight: effectiveFontWeight,
      color: effectiveColor,
      textAlign: effectiveAlign as "left" | "center" | "right",
    };
  };

  const renderBlock = (block: CanvasBlock, rowId: string, colId: string) => {
    switch (block.type) {
      case "table": {
        const tableBlock = block as TableBlock;
        return (
          <CanvasTableBlock
            key={tableBlock.id}
            block={tableBlock}
            pageNum={page.pageNumber}
            rowId={rowId}
            columnId={colId}
            isSelected={selectedBlockId === tableBlock.id}
            isCellSelected={(rId, cId) => isCellSelected(tableBlock.id, rId, cId)}
            onSelect={() => onSelectBlock(tableBlock.id)}
            onSelectCell={onSelectCell}
            onUpdateTitle={(title) => updateTableTitle(page.pageNumber, tableBlock.id, title)}
            onUpdateColumnLabel={(columnId, label) =>
              updateTableColumnLabel(page.pageNumber, tableBlock.id, columnId, label)
            }
            onUpdateTableRow={(rId, field, val) =>
              updateTableRow(page.pageNumber, tableBlock.id, rId, field, val)
            }
            onAddRow={() => addTableRow(page.pageNumber, tableBlock.id)}
            onDeleteRow={(rId) => deleteTableRow(page.pageNumber, tableBlock.id, rId)}
            onAddColumn={() => addTableColumn(page.pageNumber, tableBlock.id)}
            onDeleteColumn={(colKey) => deleteTableColumn(page.pageNumber, tableBlock.id, colKey)}
            onDeleteBlock={() => removeElement(page.pageNumber, tableBlock.id)}
            getEffectiveCellStyle={(r, cId, defAlign) =>
              getEffectiveCellStyle(tableBlock, r, cId, defAlign)
            }
          />
        );
      }
      case "text": {
        const textBlock = block as TextBlock;
        return (
          <CanvasTextBlock
            key={textBlock.id}
            block={textBlock}
            pageNum={page.pageNumber}
            rowId={rowId}
            columnId={colId}
            isSelected={selectedBlockId === textBlock.id}
            onSelect={() => onSelectBlock(textBlock.id)}
            onUpdateContent={(content) =>
              updateTextBlock(page.pageNumber, textBlock.id, content)
            }
            onDeleteBlock={() => removeElement(page.pageNumber, textBlock.id)}
          />
        );
      }
      case "image": {
        const imageBlock = block as ImageBlock;
        return (
          <CanvasImageBlock
            key={imageBlock.id}
            block={imageBlock}
            pageNum={page.pageNumber}
            rowId={rowId}
            columnId={colId}
            isSelected={selectedBlockId === imageBlock.id}
            onSelect={() => onSelectBlock(imageBlock.id)}
            onUpdateImage={(updates) =>
              updateImageBlock(page.pageNumber, imageBlock.id, updates)
            }
            onDeleteBlock={() => removeElement(page.pageNumber, imageBlock.id)}
          />
        );
      }
      case "shape": {
        const shapeBlock = block as ShapeBlock;
        return (
          <CanvasShapeBlock
            key={shapeBlock.id}
            block={shapeBlock}
            pageNum={page.pageNumber}
            rowId={rowId}
            columnId={colId}
            isSelected={selectedBlockId === shapeBlock.id}
            onSelect={() => onSelectBlock(shapeBlock.id)}
            onDeleteBlock={() => removeElement(page.pageNumber, shapeBlock.id)}
          />
        );
      }
      default:
        return null;
    }
  };

  const currentPaperConfig = PAPER_SIZES[paperSize] || PAPER_SIZES.tabloid;

  return (
    <div
      id="document-sheet"
      style={{
        maxWidth: `${currentPaperConfig.widthPx}px`,
        minHeight: `${currentPaperConfig.minHeightPx}px`,
      }}
      onClick={() => {
        onSelectBlock(null);
        onSelectCell(null);
        onSelectRow(null);
        onSelectColumn(null);
      }}
      className="w-full mx-auto bg-white rounded-xl shadow-md border border-slate-200/90 p-6 sm:p-8 md:p-12 flex flex-col justify-between transition-all duration-200 relative"
    >
      <div className="space-y-4 sm:space-y-6 flex-1">
        {/* Dynamic Page Layout Grid Container */}
        <div className="flex flex-col w-full">
          {getPageLayoutRows(page).map((row, rowIdx) => {
            const isRowSelected = selectedRowId === row.id;
            const colCount = Math.max(1, row.columns.length);

            const isResizingTop = resizingRowId === row.id && resizingEdge === "top";
            const isResizingBottom = resizingRowId === row.id && resizingEdge === "bottom";

            const effectiveMarginTop = row.marginTop ?? 0;
            const effectiveMarginBottom = row.marginBottom ?? 16;

            return (
              <div
                key={row.id}
                style={{
                  marginTop: `${effectiveMarginTop}px`,
                  marginBottom: `${effectiveMarginBottom}px`,
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  onSelectRow(row.id);
                  if (row.columns[0]) {
                    onSelectColumn(row.columns[0].id);
                  }
                }}
                className={`transition-[margin] duration-75 rounded-lg relative group/gridrow py-0 ${
                  isRowSelected
                    ? "border border-blue-300/80 bg-blue-50/15 ring-1 ring-blue-400/20"
                    : "border border-transparent hover:border-slate-200/60 bg-transparent"
                }`}
              >
                {/* Top Margin Drag & Drop Resize Handle */}
                <RowMarginHandle
                  rowId={row.id}
                  edge="top"
                  currentMargin={effectiveMarginTop}
                  isRowSelected={isRowSelected}
                  isBeingResized={isResizingTop}
                  onMouseDown={(e) =>
                    onStartRowMarginResize(e, row.id, "top", effectiveMarginTop)
                  }
                />

                {/* Top Margin Active Guideline Zone */}
                {isResizingTop && (
                  <div
                    className="absolute left-0 right-0 pointer-events-none z-20 flex items-center justify-center border-b-2 border-dashed border-blue-500 bg-blue-500/10 text-blue-700 text-[10px] font-bold rounded"
                    style={{
                      height: `${effectiveMarginTop}px`,
                      top: `-${effectiveMarginTop}px`,
                    }}
                  >
                    <span className="bg-white/90 px-2 py-0.5 rounded shadow-2xs border border-blue-200">
                      Top Spacing: {effectiveMarginTop}px
                    </span>
                  </div>
                )}

                {/* Row Header Helper Toolbar */}
                <div
                  className={`absolute -top-7 left-0 right-0 z-20 items-center justify-between px-1 transition-opacity duration-150 ${
                    isRowSelected
                      ? "flex opacity-100 pointer-events-auto"
                      : "flex opacity-0 group-hover/gridrow:opacity-100 pointer-events-none group-hover/gridrow:pointer-events-auto"
                  }`}
                >
                  <div className="flex items-center gap-1.5 bg-white/95 backdrop-blur-xs px-2 py-0.5 rounded-md border border-slate-200/90 shadow-2xs">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Row {rowIdx + 1} ({colCount} Col{colCount > 1 ? "s" : ""})
                    </span>
                    {isRowSelected && (
                      <span className="text-[9px] font-bold uppercase tracking-wider text-blue-600 bg-blue-100/80 px-1.5 py-0.2 rounded">
                        Active
                      </span>
                    )}
                    <span className="text-[9px] font-medium text-slate-400">
                      ↕ {effectiveMarginTop}px / {effectiveMarginBottom}px
                    </span>
                  </div>

                  <div className="flex items-center gap-1 bg-white/95 backdrop-blur-xs p-0.5 rounded-md border border-slate-200/90 shadow-2xs">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onSelectRow(row.id);
                        onAddPageColumn(page.pageNumber, row.id);
                      }}
                      className="flex items-center gap-1 text-[10px] font-medium text-slate-600 hover:text-blue-600 hover:bg-blue-50 rounded px-1.5 py-0.5 transition cursor-pointer"
                    >
                      <Plus className="w-3 h-3" />
                      <span>Add Col</span>
                    </button>
                    {colCount > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePageColumn(page.pageNumber, row.id);
                        }}
                        className="text-[10px] font-medium text-slate-400 hover:text-red-600 px-1 py-0.5 transition cursor-pointer"
                      >
                        Del Col
                      </button>
                    )}
                    {getPageLayoutRows(page).length > 1 && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeletePageRow(page.pageNumber, row.id);
                        }}
                        aria-label="Delete grid row"
                        className="text-slate-400 hover:text-red-600 p-0.5 rounded transition cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Responsive Column Flex Container */}
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
                      resizingColInfo?.rowId === row.id &&
                      (resizingColInfo.colIdx === colIdx || resizingColInfo.colIdx + 1 === colIdx);

                    return (
                      <div
                        key={col.id}
                        style={{ width: `${effectiveWidth}%` }}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectRow(row.id);
                          onSelectColumn(col.id);
                        }}
                        className={`flex flex-col gap-0.5 min-w-0 relative shrink-0 px-1 sm:px-1.5 transition-[width] duration-75 ${
                          isColSelected && isRowSelected
                            ? "ring-1 ring-blue-400/40 bg-blue-50/10 rounded-lg"
                            : ""
                        }`}
                      >
                        {isBeingResized && (
                          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 px-1.5 py-0.5 bg-blue-600 text-white text-[9px] font-bold rounded-full shadow-xs pointer-events-none">
                            {Math.round(effectiveWidth)}%
                          </div>
                        )}

                        {col.blocks.length > 0 ? (
                          col.blocks.map((block) => renderBlock(block, row.id, col.id))
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
                                    page.pageNumber,
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
                                    page.pageNumber,
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
                                    page.pageNumber,
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
                                    page.pageNumber,
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

                        {colIdx < row.columns.length - 1 && (
                          <div
                            onMouseDown={(e) => handleResizeMouseDown(e, row, colIdx)}
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

                {/* Bottom Margin Active Guideline Zone */}
                {isResizingBottom && (
                  <div
                    className="absolute left-0 right-0 pointer-events-none z-20 flex items-center justify-center border-t-2 border-dashed border-blue-500 bg-blue-500/10 text-blue-700 text-[10px] font-bold rounded"
                    style={{
                      height: `${effectiveMarginBottom}px`,
                      bottom: `-${effectiveMarginBottom}px`,
                    }}
                  >
                    <span className="bg-white/90 px-2 py-0.5 rounded shadow-2xs border border-blue-200">
                      Bottom Spacing: {effectiveMarginBottom}px
                    </span>
                  </div>
                )}

                {/* Bottom Margin Drag & Drop Resize Handle */}
                <RowMarginHandle
                  rowId={row.id}
                  edge="bottom"
                  currentMargin={effectiveMarginBottom}
                  isRowSelected={isRowSelected}
                  isBeingResized={isResizingBottom}
                  onMouseDown={(e) =>
                    onStartRowMarginResize(e, row.id, "bottom", effectiveMarginBottom)
                  }
                />
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex justify-center">
          <button
            type="button"
            onClick={() => onAddPageRow(page.pageNumber)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-dashed border-slate-300 hover:border-blue-400 text-xs font-medium text-slate-500 hover:text-blue-600 hover:bg-blue-50/50 transition cursor-pointer opacity-75 hover:opacity-100"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Grid Row to Page</span>
          </button>
        </div>
      </div>

      {/* Canvas Footer */}
      <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-3 sm:gap-0 border-t border-slate-100 mt-auto">
        <p className="text-[11px] sm:text-xs text-slate-400 text-center sm:text-left">
          Page {page.pageNumber} of {totalPages}
        </p>

        {/* 3-Bar Geometric Graphic */}
        <div className="flex items-end gap-1">
          <div className="w-2.5 sm:w-3 h-3 sm:h-3.5 bg-sky-200 -skew-x-12 rounded-xs" />
          <div className="w-2.5 sm:w-3 h-5 sm:h-6 bg-sky-400 -skew-x-12 rounded-xs" />
          <div className="w-2.5 sm:w-3 h-7 sm:h-9 bg-blue-600 -skew-x-12 rounded-xs" />
        </div>
      </div>
    </div>
  );
}
