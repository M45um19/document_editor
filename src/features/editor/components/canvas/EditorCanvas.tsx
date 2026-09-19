"use client";

import React, { useState } from "react";
import {
  ChevronDown,
  Maximize2,
} from "lucide-react";
import { useMounted } from "@/hooks/useMounted";
import { useEditorState } from "../../hooks/useEditorState";
import { isMatchingTableBlock } from "../../utils/paginationUtils";
import {
  PaperSize,
  PAPER_SIZES,
} from "../../types";
import {
  DndContext,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragMoveEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { CanvasPageSheet } from "./CanvasPageSheet";

export function EditorCanvas() {
  const isMounted = useMounted();
  const metadata = useEditorState((s) => s.metadata);
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

  const addPageRow = useEditorState((s) => s.addPageRow);
  const deletePageRow = useEditorState((s) => s.deletePageRow);
  const addPageColumn = useEditorState((s) => s.addPageColumn);
  const deletePageColumn = useEditorState((s) => s.deletePageColumn);
  const deletePage = useEditorState((s) => s.deletePage);
  const updateRowMargins = useEditorState((s) => s.updateRowMargins);
  const updateRowColumnWidths = useEditorState((s) => s.updateRowColumnWidths);
  const reorderTableRows = useEditorState((s) => s.reorderTableRows);

  const [resizingMarginInfo, setResizingMarginInfo] = useState<{
    rowId: string;
    edge: "top" | "bottom";
    initialMargin: number;
    value: number;
  } | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 3,
      },
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const data = event.active.data.current;
    if (data?.type === "row-margin") {
      setResizingMarginInfo({
        rowId: data.rowId,
        edge: data.edge,
        initialMargin: data.initialMargin,
        value: data.initialMargin,
      });
    }
  };

  const handleDragMove = (event: DragMoveEvent) => {
    const data = event.active.data.current;
    if (data?.type === "row-margin") {
      const deltaY = event.delta.y;
      const isTop = data.edge === "top";
      const change = isTop ? -deltaY : deltaY;
      const newMargin = Math.max(0, Math.min(300, Math.round(data.initialMargin + change)));

      setResizingMarginInfo((prev) =>
        prev
          ? {
              ...prev,
              value: newMargin,
            }
          : null
      );
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const data = event.active.data.current;
    const over = event.over;

    if (data?.type === "row-margin") {
      if (resizingMarginInfo) {
        updateRowMargins(activePage, resizingMarginInfo.rowId, {
          [resizingMarginInfo.edge === "top" ? "marginTop" : "marginBottom"]:
            resizingMarginInfo.value,
        });
      }
      setResizingMarginInfo(null);
    }

    if (data?.type === "table-row" && over) {
      const activeData = data;
      const overData = over.data.current;

      if (overData?.type === "table-row" && activeData.blockId && activeData.rowId !== overData.rowId) {
        const { blockId, pageNum } = activeData;
        const page = pages.find((p) => p.pageNumber === pageNum) || pages[0];

        if (page) {
          page.layoutRows?.forEach((row) => {
            row.columns.forEach((col) => {
              const tableBlock = col.blocks.find(
                (b) => b.type === "table" && (b.id === blockId || isMatchingTableBlock(b, blockId))
              );
              if (tableBlock && tableBlock.type === "table") {
                const sourceIdx = tableBlock.rows.findIndex((r) => r.id === activeData.rowId);
                const targetIdx = tableBlock.rows.findIndex((r) => r.id === overData.rowId);

                if (sourceIdx !== -1 && targetIdx !== -1 && sourceIdx !== targetIdx) {
                  reorderTableRows(pageNum, blockId, sourceIdx, targetIdx);
                }
              }
            });
          });
        }
      }
    }
  };

  const handleMarginResizeMouseDown = (
    e: React.MouseEvent,
    rowId: string,
    edge: "top" | "bottom",
    initialMargin: number
  ) => {
    e.preventDefault();
    e.stopPropagation();

    const startY = e.clientY;
    setResizingMarginInfo({
      rowId,
      edge,
      initialMargin,
      value: initialMargin,
    });

    const previousCursor = document.body.style.cursor;
    const previousUserSelect = document.body.style.userSelect;
    document.body.style.cursor = "row-resize";
    document.body.style.userSelect = "none";

    const onMouseMove = (moveEvent: MouseEvent) => {
      const deltaY = moveEvent.clientY - startY;
      const isTop = edge === "top";
      const change = isTop ? -deltaY : deltaY;
      const newMargin = Math.max(0, Math.min(300, Math.round(initialMargin + change)));

      setResizingMarginInfo({
        rowId,
        edge,
        initialMargin,
        value: newMargin,
      });

      updateRowMargins(activePage, rowId, {
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
  const currentPaperConfig = PAPER_SIZES[paperSize] || PAPER_SIZES.a4;

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
            Prev
          </button>
          <span className="text-xs font-bold text-slate-700">
            Page {activePage} of {pages.length}
          </span>
          <button
            type="button"
            disabled={activePage >= pages.length}
            onClick={() => setActivePage(activePage + 1)}
            aria-label="Next page"
            className="px-2 py-1 rounded bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition cursor-pointer"
          >
            Next
          </button>
        </div>

        {/* Paper Size Selector */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <select
              value={paperSize}
              onChange={(e) => setPaperSize(e.target.value as PaperSize)}
              className="appearance-none flex items-center gap-1.5 pl-2.5 pr-6 sm:pl-3 sm:pr-7 py-1 sm:py-1.5 bg-white border border-slate-200 rounded-md text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer outline-none"
            >
              {Object.values(PAPER_SIZES).map((config) => (
                <option key={config.id} value={config.id}>
                  {config.shortLabel}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

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

      {/* Main Document Canvas Sheet */}
      <DndContext
        sensors={sensors}
        onDragStart={handleDragStart}
        onDragMove={handleDragMove}
        onDragEnd={handleDragEnd}
      >
        <CanvasPageSheet
          page={currentPage}
          pageIndex={activePage - 1}
          totalPages={pages.length}
          metadata={metadata}
          paperSize={paperSize}
          activePage={activePage}
          selectedBlockId={selectedBlockId}
          selectedCell={selectedCell}
          selectedRowId={selectedRowId}
          selectedColumnId={selectedColumnId}
          resizingRowId={resizingMarginInfo?.rowId || null}
          resizingEdge={resizingMarginInfo?.edge || null}
          onSelectPage={setActivePage}
          onSelectBlock={setSelectedBlockId}
          onSelectCell={setSelectedCell}
          onSelectRow={setSelectedRowId}
          onSelectColumn={setSelectedColumnId}
          onAddPageRow={addPageRow}
          onDeletePageRow={deletePageRow}
          onAddPageColumn={addPageColumn}
          onDeletePageColumn={deletePageColumn}
          onDeletePage={deletePage}
          onUpdateColumnWidths={updateRowColumnWidths}
          onStartRowMarginResize={handleMarginResizeMouseDown}
        />
      </DndContext>
    </div>
  );
}
