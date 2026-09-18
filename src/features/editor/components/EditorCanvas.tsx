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
  Upload,
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
  PaperSize,
  PAPER_SIZES,
} from "../types";
import {
  DndContext,
  useDraggable,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragMoveEvent,
  DragEndEvent,
} from "@dnd-kit/core";

interface RowMarginHandleProps {
  rowId: string;
  edge: "top" | "bottom";
  currentMargin: number;
  isRowSelected: boolean;
  isBeingResized: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}

function RowMarginHandle({
  rowId,
  edge,
  currentMargin,
  isRowSelected,
  isBeingResized,
  onMouseDown,
}: RowMarginHandleProps) {
  const { attributes, listeners, setNodeRef } = useDraggable({
    id: `row-margin-${edge}-${rowId}`,
    data: {
      type: "row-margin",
      rowId,
      edge,
      initialMargin: currentMargin,
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      onMouseDown={onMouseDown}
      onClick={(e) => e.stopPropagation()}
      title={`Drag up or down to adjust row ${edge} margin (${currentMargin}px)`}
      className={`absolute left-0 right-0 h-4.5 z-30 cursor-row-resize flex items-center justify-center group/margin-handle select-none transition-opacity ${
        edge === "top" ? "-top-2.5" : "-bottom-2.5"
      } ${
        isRowSelected || isBeingResized
          ? "opacity-100"
          : "opacity-0 group-hover/gridrow:opacity-100"
      }`}
    >
      {/* Horizontal Guideline */}
      <div
        className={`w-full transition-all rounded-full ${
          isBeingResized
            ? "bg-blue-600 h-[2.5px] shadow-xs"
            : "bg-slate-300/80 h-[1.5px] group-hover/margin-handle:bg-blue-500 group-hover/margin-handle:h-[2px]"
        }`}
      />

      {/* Interactive Center Handle Pill */}
      <div
        className={`absolute px-2 py-0.5 rounded-full text-[9px] font-bold flex items-center gap-1.5 transition-all shadow-xs border whitespace-nowrap ${
          isBeingResized
            ? "bg-blue-600 text-white border-blue-700 scale-105 shadow-md z-40"
            : "bg-white text-slate-600 border-slate-200 group-hover/margin-handle:border-blue-400 group-hover/margin-handle:text-blue-600 group-hover/margin-handle:shadow-xs"
        }`}
      >
        <span className="text-[10px] leading-none">↕</span>
        <span>
          {edge === "top" ? "Top" : "Bottom"} Margin: {currentMargin}px
        </span>
      </div>
    </div>
  );
}



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
      textareaRef.current.style.height = `${Math.max(14, textareaRef.current.scrollHeight)}px`;
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
      style={{
        lineHeight: 1.25,
        ...style,
      }}
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
  const paperSize = useEditorState((s) => s.paperSize);
  const setPaperSize = useEditorState((s) => s.setPaperSize);
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
  const updateImageBlock = useEditorState((s) => s.updateImageBlock);
  const updateShapeBlock = useEditorState((s) => s.updateShapeBlock);
  const updateTableRow = useEditorState((s) => s.updateTableRow);
  const addTableRow = useEditorState((s) => s.addTableRow);
  const deleteTableRow = useEditorState((s) => s.deleteTableRow);
  const addTableColumn = useEditorState((s) => s.addTableColumn);
  const deleteTableColumn = useEditorState((s) => s.deleteTableColumn);
  const updateTableTitle = useEditorState((s) => s.updateTableTitle);
  const updateTableColumnLabel = useEditorState((s) => s.updateTableColumnLabel);

  const addPageRow = useEditorState((s) => s.addPageRow);
  const deletePageRow = useEditorState((s) => s.deletePageRow);
  const addPageColumn = useEditorState((s) => s.addPageColumn);
  const deletePageColumn = useEditorState((s) => s.deletePageColumn);
  const updateRowColumnWidths = useEditorState((s) => s.updateRowColumnWidths);
  const updateRowMargins = useEditorState((s) => s.updateRowMargins);
  const addElementToColumn = useEditorState((s) => s.addElementToColumn);
  const removeElement = useEditorState((s) => s.removeElement);

  const rowRefs = React.useRef<Record<string, HTMLDivElement | null>>({});
  const [resizingInfo, setResizingInfo] = React.useState<{
    rowId: string;
    colIdx: number;
    leftWidth: number;
    rightWidth: number;
  } | null>(null);

  const [resizingMarginInfo, setResizingMarginInfo] = React.useState<{
    rowId: string;
    edge: "top" | "bottom";
    value: number;
  } | null>(null);

  const pointerSensor = useSensor(PointerSensor, {
    activationConstraint: {
      distance: 1,
    },
  });
  const sensors = useSensors(pointerSensor);

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current;
    if (data?.type === "row-margin") {
      setResizingMarginInfo({
        rowId: data.rowId,
        edge: data.edge,
        value: data.initialMargin,
      });
    }
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const data = event.active.data.current;
    if (data?.type === "row-margin") {
      const { rowId, edge, initialMargin } = data;
      const newMargin = Math.max(0, Math.min(300, Math.round(initialMargin + event.delta.y)));
      setResizingMarginInfo({
        rowId,
        edge,
        value: newMargin,
      });
      updateRowMargins(activePage, rowId, {
        [edge === "top" ? "marginTop" : "marginBottom"]: newMargin,
      });
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const data = event.active.data.current;
    if (data?.type === "row-margin") {
      const { rowId, edge, initialMargin } = data;
      const finalMargin = Math.max(0, Math.min(300, Math.round(initialMargin + event.delta.y)));
      updateRowMargins(activePage, rowId, {
        [edge === "top" ? "marginTop" : "marginBottom"]: finalMargin,
      });
      setResizingMarginInfo(null);
    }
  };

  const handleMarginResizeMouseDown = (
    e: React.MouseEvent,
    row: PageGridRow,
    edge: "top" | "bottom",
    pageNum: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const initialMargin =
      edge === "top" ? (row.marginTop ?? 0) : (row.marginBottom ?? 16);
    const startY = e.clientY;

    setResizingMarginInfo({
      rowId: row.id,
      edge,
      value: initialMargin,
    });

    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY;
      let newMargin = Math.max(0, Math.min(300, initialMargin + deltaY));
      newMargin = Math.round(newMargin);

      setResizingMarginInfo({
        rowId: row.id,
        edge,
        value: newMargin,
      });

      updateRowMargins(pageNum, row.id, {
        [edge === "top" ? "marginTop" : "marginBottom"]: newMargin,
      });
    };

    const onMouseUp = () => {
      document.body.style.cursor = previousCursor;
      document.body.style.userSelect = previousUserSelect;
      setResizingMarginInfo(null);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);
  };



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

        // Table formatting options
        const rawWidth = tableBlock.tableWidth ?? "100%";
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

        const borderStyle = tableBlock.borderStyle || "1px solid #E5E7EB";
        const isNoBorder = borderStyle === "none";
        const cellPadding = tableBlock.padding !== undefined ? tableBlock.padding : 8;
        const rowSpacing = tableBlock.rowSpacing !== undefined ? tableBlock.rowSpacing : 0;
        const hasRowSpacing = rowSpacing > 0;

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
                <input
                  type="text"
                  value={tableBlock.title ?? ""}
                  onClick={(e) => e.stopPropagation()}
                  onChange={(e) =>
                    updateTableTitle(pageNum, tableBlock.id, e.target.value)
                  }
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

            {/* Table Container with Horizontal Scroll & Alignment */}
            <div
              className="overflow-x-auto w-full -mx-1 px-1 flex"
              style={{
                justifyContent:
                  tableBlock.align === "center"
                    ? "center"
                    : tableBlock.align === "right"
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
                          onChange={(e) =>
                            updateTableColumnLabel(
                              pageNum,
                              tableBlock.id,
                              col.id,
                              e.target.value
                            )
                          }
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
                  {tableBlock.rows.map((row, index) => (
                    <tr
                      key={row.id}
                      style={{
                        borderBottom: !hasRowSpacing && !isNoBorder ? borderStyle : undefined,
                      }}
                      className={`group/row hover:bg-slate-50/50 transition ${
                        hasRowSpacing ? "bg-white shadow-2xs rounded-lg" : ""
                      }`}
                    >
                      {/* Drag Handle */}
                      <td
                        style={{
                          paddingTop: `${cellPadding}px`,
                          paddingBottom: `${cellPadding}px`,
                          paddingLeft: `${Math.max(2, Math.round(cellPadding * 0.5))}px`,
                          paddingRight: `${Math.max(2, Math.round(cellPadding * 0.5))}px`,
                          borderBottom: !hasRowSpacing && !isNoBorder ? borderStyle : undefined,
                          ...(hasRowSpacing && !isNoBorder
                            ? {
                                borderTop: borderStyle,
                                borderBottom: borderStyle,
                                borderLeft: borderStyle,
                              }
                            : {}),
                        }}
                        className={`text-center text-slate-300 group-hover/row:text-slate-500 cursor-grab transition-opacity ${
                          isSelected
                            ? "opacity-100"
                            : "opacity-0 group-hover/table:opacity-100"
                        } ${hasRowSpacing ? "rounded-l-lg" : ""}`}
                      >
                        <GripVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4 mx-auto" />
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
                        className="text-center font-bold text-slate-700"
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
                                    pageNum,
                                    tableBlock.id,
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
                                    pageNum,
                                    tableBlock.id,
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
                              style={{
                                ...cellStyle,
                                paddingTop: `${cellPadding}px`,
                                paddingBottom: `${cellPadding}px`,
                                paddingLeft: `${Math.max(4, Math.round(cellPadding * 0.9))}px`,
                                paddingRight: `${Math.max(4, Math.round(cellPadding * 0.9))}px`,
                                ...commonCellBorder,
                              }}
                              className={`text-right cursor-pointer rounded-md transition-all ${
                                isSelectedCell
                                  ? "ring-2 ring-blue-500/40 bg-blue-50/60 font-semibold"
                                  : "hover:bg-slate-100/60"
                              } ${hasRowSpacing && isLastCol ? "rounded-r-lg" : ""}`}
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
                                  pageNum,
                                  tableBlock.id,
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
                ? "border border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/15 rounded-xl p-2 sm:p-2.5 shadow-xs"
                : "border border-transparent hover:border-slate-200/80 rounded p-0 bg-transparent"
            }`}
          >
            {/* Header toolbar only visible when selected */}
            {isSelected ? (
              <div className="flex items-center justify-between mb-1">
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
                className="opacity-0 group-hover/text:opacity-100 absolute -top-1 right-0 text-slate-400 hover:text-red-500 p-0.5 rounded bg-white/90 shadow-2xs border border-slate-200 transition cursor-pointer z-10"
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
              className={`w-full bg-transparent outline-none resize-none leading-snug transition-all ${
                isSelected
                  ? "border border-blue-200 focus:border-blue-400 focus:bg-white rounded-md p-1"
                  : "border-0 p-0 hover:border-0 rounded"
              }`}
              placeholder={isSelected ? "Type your notes or document description..." : "Enter text..."}
            />
          </div>
        );
      }

      case "image": {
        const imageBlock = block as ImageBlock;
        const isSelected = selectedBlockId === imageBlock.id;
        const widthVal = imageBlock.width ?? (imageBlock.isLogoPreset ? 42 : "100%");
        const heightVal = imageBlock.height ?? (imageBlock.isLogoPreset ? 42 : "auto");
        const alignVal = imageBlock.align || "left";
        const borderRadiusVal =
          imageBlock.borderRadius !== undefined ? `${imageBlock.borderRadius}px` : "8px";

        const alignClass =
          alignVal === "center"
            ? "flex justify-center items-center"
            : alignVal === "right"
            ? "flex justify-end items-center"
            : "flex justify-start items-center";

        const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
          const file = e.target.files?.[0];
          if (file) {
            const reader = new FileReader();
            reader.onload = () => {
              if (typeof reader.result === "string") {
                updateImageBlock(pageNum, imageBlock.id, {
                  url: reader.result,
                  isLogoPreset: false,
                });
              }
            };
            reader.readAsDataURL(file);
          }
        };

        return (
          <div
            key={imageBlock.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedBlockId(imageBlock.id);
            }}
            className={`transition-all relative group/img cursor-pointer ${
              isSelected
                ? "border border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/15 rounded-xl p-2 shadow-xs"
                : "border border-transparent hover:border-slate-200/80 rounded p-0 bg-transparent"
            }`}
          >
            {/* Header toolbar when selected */}
            {isSelected ? (
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-slate-700 text-xs font-semibold uppercase tracking-wider shrink-0">
                  <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
                  <span>{imageBlock.isLogoPreset ? "Logo Block" : "Image Asset"}</span>
                </div>

                <div className="flex items-center gap-1 shrink-0">
                  <label className="flex items-center gap-1 text-[10px] font-semibold text-slate-600 hover:text-blue-600 bg-white hover:bg-blue-50 border border-slate-200 rounded px-2 py-0.5 transition cursor-pointer shadow-2xs">
                    <Upload className="w-3 h-3" />
                    <span>Upload</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="hidden"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeElement(pageNum, imageBlock.id);
                    }}
                    aria-label="Delete image block"
                    className="text-slate-400 hover:text-red-500 p-1 rounded transition cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ) : (
              /* Unselected hover delete button */
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeElement(pageNum, imageBlock.id);
                }}
                aria-label="Delete image block"
                className="opacity-0 group-hover/img:opacity-100 absolute -top-1 right-0 text-slate-400 hover:text-red-500 p-0.5 rounded bg-white/90 shadow-2xs border border-slate-200 transition cursor-pointer z-10"
              >
                <X className="w-3 h-3" />
              </button>
            )}

            {/* Image Content Container */}
            <div className={`w-full ${alignClass}`}>
              {imageBlock.url ? (
                <img
                  src={imageBlock.url}
                  alt={imageBlock.caption || "Document Image"}
                  style={{
                    width: typeof widthVal === "number" ? `${widthVal}px` : widthVal,
                    height: typeof heightVal === "number" ? `${heightVal}px` : heightVal,
                    borderRadius: borderRadiusVal,
                    objectFit: "contain",
                  }}
                  className="max-w-full transition-all shadow-2xs"
                />
              ) : imageBlock.isLogoPreset ? (
                /* Precise geometric 4-tile blue logo icon matching the design */
                <svg
                  width={typeof widthVal === "number" ? widthVal : 42}
                  height={typeof heightVal === "number" ? heightVal : 42}
                  viewBox="0 0 42 42"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{
                    width: typeof widthVal === "number" ? `${widthVal}px` : widthVal,
                    height: typeof heightVal === "number" ? `${heightVal}px` : heightVal,
                    borderRadius: borderRadiusVal,
                  }}
                  className="shrink-0 drop-shadow-2xs select-none"
                >
                  <rect x="1" y="1" width="18" height="18" rx="4.5" fill="#60A5FA" fillOpacity="0.8" />
                  <rect x="21" y="1" width="18" height="18" rx="4.5" fill="#1D4ED8" />
                  <rect x="26" y="6" width="8" height="8" rx="2" fill="#FFFFFF" />
                  <rect x="1" y="21" width="18" height="18" rx="4.5" fill="#2563EB" />
                  <rect x="21" y="21" width="18" height="18" rx="4.5" fill="#93C5FD" />
                </svg>
              ) : (
                /* Default Image placeholder */
                <label className="w-full h-28 sm:h-36 rounded-lg bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50/40 border border-dashed border-slate-300 hover:border-blue-400 flex flex-col items-center justify-center text-slate-400 gap-1.5 cursor-pointer transition">
                  <ImageIcon className="w-7 h-7 text-slate-300" />
                  <span className="text-xs font-medium text-slate-500">
                    {imageBlock.caption || "Click to Upload Image"}
                  </span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>
          </div>
        );
      }

      case "shape": {
        const shapeBlock = block as ShapeBlock;
        const isSelected = selectedBlockId === shapeBlock.id;
        const dividerColor = shapeBlock.color || "#3b82f6";
        const dividerHeight = shapeBlock.height ? `${shapeBlock.height}px` : "1.5px";
        const dividerWidth = shapeBlock.width || "100%";

        return (
          <div
            key={shapeBlock.id}
            onClick={(e) => {
              e.stopPropagation();
              setSelectedBlockId(shapeBlock.id);
            }}
            className={`transition-all relative group/shape cursor-pointer ${
              isSelected
                ? "border border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/15 rounded-lg p-2 shadow-xs"
                : "border-0 p-0 bg-transparent"
            }`}
          >
            {isSelected && (
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-1.5 text-slate-700 text-xs font-semibold uppercase tracking-wider">
                  <Shapes className="w-3.5 h-3.5 text-blue-600" />
                  <span>Decorative Divider</span>
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeElement(pageNum, shapeBlock.id);
                  }}
                  aria-label="Delete shape block"
                  className="text-slate-400 hover:text-red-500 p-1 rounded transition cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            )}
            {!isSelected && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  removeElement(pageNum, shapeBlock.id);
                }}
                aria-label="Delete shape block"
                className="opacity-0 group-hover/shape:opacity-100 absolute -top-3 right-0 text-slate-400 hover:text-red-500 p-0.5 rounded bg-white/90 shadow-2xs border border-slate-200 transition cursor-pointer z-10"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
            <div
              style={{
                height: dividerHeight,
                background: `linear-gradient(90deg, #60A5FA 0%, ${dividerColor} 20%, ${dividerColor} 100%)`,
                width: dividerWidth,
              }}
              className="rounded-full shadow-2xs"
            />
          </div>
        );
      }

      default:
        return null;
    }
  };

  const currentPaperConfig = PAPER_SIZES[paperSize] || PAPER_SIZES.tabloid;

  return (
    <div className="w-full flex flex-col select-none min-w-0">
      {/* Viewport Top Bar Controls */}
      <div
        style={{ maxWidth: `${currentPaperConfig.widthPx}px` }}
        className="w-full flex items-center justify-between gap-2 mb-2.5 px-1 mx-auto transition-all duration-200"
      >
        <div className="flex items-center gap-1.5 sm:gap-2">
          <button
            type="button"
            disabled={activePage <= 1}
            onClick={() => setActivePage(activePage - 1)}
            aria-label="Previous page"
            className="px-2 py-1 rounded bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition cursor-pointer"
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
            className="px-2 py-1 rounded bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition cursor-pointer"
          >
            →
          </button>

          {/* Paper Size Switcher Dropdown */}
          <div className="relative inline-flex items-center">
            <select
              value={paperSize}
              onChange={(e) => setPaperSize(e.target.value as PaperSize)}
              aria-label="Select paper size"
              className="appearance-none flex items-center gap-1 pl-2.5 pr-6 sm:pr-7 py-1 bg-white border border-slate-200 rounded-md text-[11px] sm:text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 hover:border-slate-300 transition cursor-pointer outline-none"
            >
              {Object.values(PAPER_SIZES).map((ps) => (
                <option key={ps.id} value={ps.id}>
                  {ps.shortLabel}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
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

      {/* Main Document Canvas Sheet (Dynamic Dimensions: A4 / Letter / Legal) */}
      <div
        id="document-sheet"
        style={{
          maxWidth: `${currentPaperConfig.widthPx}px`,
          minHeight: `${currentPaperConfig.minHeightPx}px`,
        }}
        onClick={() => {
          setSelectedBlockId(null);
          setSelectedCell(null);
          setSelectedRowId(null);
          setSelectedColumnId(null);
        }}
        className="w-full mx-auto bg-white rounded-xl shadow-md border border-slate-200/90 p-6 sm:p-8 md:p-12 flex flex-col justify-between transition-all duration-200 space-y-6 relative"
      >
        <div className="space-y-6 sm:space-y-8">
          {/* Subsequent Page Compact Header */}
          {currentPage.pageNumber > 1 && (
            <div className="flex items-center justify-between pb-3 border-b border-slate-200 mb-2">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                  {currentPage.pageNumber}
                </div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {metadata.companyName || "Document"} — Continuation Sheet
                </span>
              </div>
              <span className="text-xs font-medium text-slate-400">
                Ref: {metadata.documentNumber || "Page " + currentPage.pageNumber}
              </span>
            </div>
          )}

          {/* Dynamic Page Layout Grid Container */}
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragMove={handleDragMove}
            onDragEnd={handleDragEnd}
          >
            <div className="flex flex-col w-full">
              {getPageLayoutRows(currentPage).map((row, rowIdx) => {
                const isRowSelected = selectedRowId === row.id;
                const colCount = Math.max(1, row.columns.length);

                const isResizingTop =
                  resizingMarginInfo?.rowId === row.id && resizingMarginInfo.edge === "top";
                const isResizingBottom =
                  resizingMarginInfo?.rowId === row.id && resizingMarginInfo.edge === "bottom";

                const effectiveMarginTop = isResizingTop
                  ? resizingMarginInfo.value
                  : (row.marginTop ?? 0);
                const effectiveMarginBottom = isResizingBottom
                  ? resizingMarginInfo.value
                  : (row.marginBottom ?? 16);

                return (
                  <div
                    key={row.id}
                    style={{
                      marginTop: `${effectiveMarginTop}px`,
                      marginBottom: `${effectiveMarginBottom}px`,
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRowId(row.id);
                      if (row.columns[0]) {
                        setSelectedColumnId(row.columns[0].id);
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
                        handleMarginResizeMouseDown(
                          e,
                          row,
                          "top",
                          currentPage.pageNumber
                        )
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

                    {/* Row Header Helper Toolbar (Floating overlay above the row, occupying 0px height in document flow) */}
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
                            setSelectedRowId(row.id);
                            addPageColumn(currentPage.pageNumber, row.id);
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
                              deletePageColumn(currentPage.pageNumber, row.id);
                            }}
                            className="text-[10px] font-medium text-slate-400 hover:text-red-600 px-1 py-0.5 transition cursor-pointer"
                          >
                            Del Col
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
                            className="text-slate-400 hover:text-red-600 p-0.5 rounded transition cursor-pointer"
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
                            className={`flex flex-col gap-0.5 min-w-0 relative shrink-0 px-1 sm:px-1.5 transition-[width] duration-75 ${
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
                        handleMarginResizeMouseDown(
                          e,
                          row,
                          "bottom",
                          currentPage.pageNumber
                        )
                      }
                    />
                  </div>
                );
              })}
            </div>
          </DndContext>

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
