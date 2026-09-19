"use client";

import React from "react";
import { Type, X } from "lucide-react";
import { FONT_FAMILY_MAP, CanvasTextBlockProps } from "../../types";
import { AutoExpandingTextarea } from "../common/AutoExpandingTextarea";

export function CanvasTextBlock({
  block,
  pageNum,
  rowId,
  columnId,
  isSelected,
  onSelect,
  onUpdateContent,
  onDeleteBlock,
}: CanvasTextBlockProps) {
  const fontFamily = block.fontFamily || "Inter";
  const fontSize = block.fontSize ? `${block.fontSize}px` : "14px";
  const fontWeight = block.fontWeight || "400";
  const color = block.color || "#1f2937";
  const align = block.align || "left";

  const textStyle: React.CSSProperties = {
    fontFamily: FONT_FAMILY_MAP[fontFamily] || "var(--font-inter), Inter, sans-serif",
    fontSize: fontSize,
    fontWeight: fontWeight,
    color: color,
    textAlign: align,
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
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
                onDeleteBlock();
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
            onDeleteBlock();
          }}
          aria-label="Delete text block"
          className="opacity-0 group-hover/text:opacity-100 absolute -top-1 right-0 text-slate-400 hover:text-red-500 p-0.5 rounded bg-white/90 shadow-2xs border border-slate-200 transition cursor-pointer z-10"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      <AutoExpandingTextarea
        value={block.content}
        onFocus={onSelect}
        onClick={(e) => {
          e.stopPropagation();
          onSelect();
        }}
        onChange={(e) => onUpdateContent(e.target.value)}
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
