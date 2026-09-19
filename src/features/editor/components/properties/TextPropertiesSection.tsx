"use client";

import React from "react";
import {
  Type,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
} from "lucide-react";
import {
  FONT_FAMILY_MAP,
  AVAILABLE_FONTS,
  TextPropertiesSectionProps,
} from "../../types";

export function TextPropertiesSection({
  selectedBlock,
  activePage,
  selectedCell,
  onUpdateStyle,
  onUpdateTableCellStyle,
}: TextPropertiesSectionProps) {
  const isTable = selectedBlock.type === "table";
  const isCellActive =
    isTable &&
    selectedCell !== null &&
    selectedCell.blockId === selectedBlock.id;

  const targetRow = isCellActive
    ? selectedBlock.rows.find((r) => r.id === selectedCell.rowId)
    : null;
  const cellStyle = (isCellActive && targetRow?.cellStyles?.[selectedCell.columnKey]) || null;

  const currentFontFamily =
    cellStyle?.fontFamily || selectedBlock.fontFamily || "Inter";
  const currentFontSize =
    cellStyle?.fontSize ?? selectedBlock.fontSize ?? 14;
  const currentFontWeight =
    cellStyle?.fontWeight || selectedBlock.fontWeight || "400";
  const currentColor =
    cellStyle?.color || selectedBlock.color || "#1F2937";
  const currentAlign =
    cellStyle?.align ||
    (isCellActive
      ? selectedCell.columnKey === "qty" || selectedCell.columnKey === "unitPrice"
        ? "center"
        : selectedCell.columnKey === "amount"
        ? "right"
        : selectedBlock.align || "left"
      : selectedBlock.align || "left");

  const handleStyleChange = (style: Parameters<typeof onUpdateStyle>[0]) => {
    if (isCellActive && selectedCell) {
      onUpdateTableCellStyle(
        selectedCell.rowId,
        selectedCell.columnKey,
        style
      );
    } else {
      onUpdateStyle(style);
    }
  };

  return (
    <div className="space-y-3 2xl:space-y-4">
      {/* Tab Header */}
      <div className="flex items-center gap-2 border-b-2 border-blue-600 pb-1 2xl:pb-1.5 w-fit text-blue-600 font-bold text-xs 2xl:text-sm">
        <Type className="w-4 h-4 2xl:w-4.5 2xl:h-4.5" />
        <span>Text Settings</span>
      </div>

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
    </div>
  );
}
