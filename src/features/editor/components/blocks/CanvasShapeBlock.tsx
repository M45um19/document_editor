"use client";

import React from "react";
import { Shapes, X } from "lucide-react";
import { CanvasShapeBlockProps } from "../../types";

export function CanvasShapeBlock({
  block,
  pageNum,
  rowId,
  columnId,
  isSelected,
  onSelect,
  onDeleteBlock,
}: CanvasShapeBlockProps) {
  const dividerColor = block.color || "#3b82f6";
  const dividerHeight = block.height ? `${block.height}px` : "1.5px";
  const dividerWidth = block.width || "100%";

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
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
              onDeleteBlock();
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
            onDeleteBlock();
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
