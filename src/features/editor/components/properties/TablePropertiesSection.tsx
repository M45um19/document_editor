"use client";

import React from "react";
import { Table as TableIcon, ChevronDown } from "lucide-react";
import {
  DEFAULT_BORDER_STYLE_OPTIONS,
  TablePropertiesSectionProps,
} from "../../types";

export function TablePropertiesSection({
  tableBlock,
  activePage,
  onUpdateSettings,
  onAddRow,
  onDeleteRow,
  onAddColumn,
  onDeleteColumn,
}: TablePropertiesSectionProps) {
  const currentTableWidth =
    tableBlock.tableWidth !== undefined ? String(tableBlock.tableWidth) : "100%";
  const currentBorderStyle =
    tableBlock.borderStyle || "1px solid #E5E7EB";
  const currentPadding =
    tableBlock.padding !== undefined ? tableBlock.padding : 8;
  const currentRowSpacing =
    tableBlock.rowSpacing !== undefined ? tableBlock.rowSpacing : 0;

  return (
    <div className="space-y-3 2xl:space-y-4 pt-2 border-t border-slate-100">
      <div className="flex items-center gap-2 text-slate-800 font-bold text-xs 2xl:text-sm">
        <TableIcon className="w-4 h-4 2xl:w-4.5 2xl:h-4.5 text-slate-700" />
        <span>Table Settings</span>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 2xl:gap-4">
        {/* Width */}
        <div className="space-y-1 2xl:space-y-1.5">
          <label className="text-[11px] 2xl:text-xs font-medium text-slate-600 block">
            Width
          </label>
          <div className="flex items-center border border-slate-200 rounded-md px-2.5 2xl:px-3 py-1.5 2xl:py-2 bg-white shadow-2xs focus-within:border-blue-500">
            <input
              type="text"
              value={currentTableWidth}
              onChange={(e) => onUpdateSettings({ tableWidth: e.target.value })}
              placeholder="100%"
              className="w-full text-xs 2xl:text-sm font-medium text-slate-800 outline-none bg-transparent"
            />
          </div>
        </div>

        {/* Borders */}
        <div className="space-y-1 2xl:space-y-1.5">
          <label className="text-[11px] 2xl:text-xs font-medium text-slate-600 block">
            Borders
          </label>
          <div className="relative">
            <select
              value={currentBorderStyle}
              onChange={(e) => onUpdateSettings({ borderStyle: e.target.value })}
              className="w-full appearance-none pl-2.5 pr-7 py-1.5 2xl:py-2 border border-slate-200 rounded-md text-xs 2xl:text-sm font-medium text-slate-800 bg-white shadow-2xs hover:border-slate-300 focus:border-blue-500 outline-none cursor-pointer truncate"
            >
              {DEFAULT_BORDER_STYLE_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>

        {/* Padding */}
        <div className="space-y-1 2xl:space-y-1.5">
          <label className="text-[11px] 2xl:text-xs font-medium text-slate-600 block">
            Padding
          </label>
          <div className="flex items-center border border-slate-200 rounded-md px-2.5 2xl:px-3 py-1.5 2xl:py-2 bg-white shadow-2xs focus-within:border-blue-500">
            <input
              type="number"
              min={0}
              max={40}
              value={currentPadding}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                onUpdateSettings({ padding: isNaN(val) ? 0 : val });
              }}
              className="w-full text-xs 2xl:text-sm font-medium text-slate-800 outline-none bg-transparent"
            />
            <span className="text-[11px] 2xl:text-xs text-slate-400 font-medium ml-1">
              px
            </span>
          </div>
        </div>

        {/* Row Spacing */}
        <div className="space-y-1 2xl:space-y-1.5">
          <label className="text-[11px] 2xl:text-xs font-medium text-slate-600 block">
            Row Spacing
          </label>
          <div className="flex items-center border border-slate-200 rounded-md px-2.5 2xl:px-3 py-1.5 2xl:py-2 bg-white shadow-2xs focus-within:border-blue-500">
            <input
              type="number"
              min={0}
              max={40}
              value={currentRowSpacing}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                onUpdateSettings({ rowSpacing: isNaN(val) ? 0 : val });
              }}
              className="w-full text-xs 2xl:text-sm font-medium text-slate-800 outline-none bg-transparent"
            />
            <span className="text-[11px] 2xl:text-xs text-slate-400 font-medium ml-1">
              px
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
