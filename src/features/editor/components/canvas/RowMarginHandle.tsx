"use client";

import React from "react";
import { useDraggable } from "@dnd-kit/core";
import { RowMarginHandleProps } from "../../types";

export function RowMarginHandle({
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
