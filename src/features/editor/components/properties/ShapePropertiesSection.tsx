"use client";

import React from "react";
import { Shapes } from "lucide-react";
import { ShapePropertiesSectionProps } from "../../types";

export function ShapePropertiesSection({
  shapeBlock,
  activePage,
  onUpdateShape,
}: ShapePropertiesSectionProps) {
  return (
    <div className="space-y-3 2xl:space-y-4 pb-3 border-b border-slate-100">
      <div className="flex items-center gap-2 border-b-2 border-blue-600 pb-1 2xl:pb-1.5 w-fit text-blue-600 font-bold text-xs 2xl:text-sm">
        <Shapes className="w-4 h-4 2xl:w-4.5 2xl:h-4.5" />
        <span>Divider Settings</span>
      </div>

      {/* Color & Thickness Grid */}
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-600 block">Color</label>
          <div className="flex items-center gap-1.5 border border-slate-200 rounded-md px-2 py-1 bg-white focus-within:border-blue-500">
            <input
              type="color"
              value={shapeBlock.color || "#3b82f6"}
              onChange={(e) => onUpdateShape({ color: e.target.value })}
              className="w-4 h-4 rounded-xs border border-slate-300 shrink-0 cursor-pointer p-0 bg-transparent"
            />
            <input
              type="text"
              value={shapeBlock.color || "#3b82f6"}
              onChange={(e) => onUpdateShape({ color: e.target.value })}
              className="w-full text-xs font-medium text-slate-800 outline-none bg-transparent"
            />
          </div>
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-600 block">Thickness</label>
          <div className="flex items-center border border-slate-200 rounded-md px-2 py-1 bg-white focus-within:border-blue-500">
            <input
              type="number"
              min={1}
              max={20}
              value={shapeBlock.height ?? 2}
              onChange={(e) => {
                const val = parseInt(e.target.value, 10);
                onUpdateShape({
                  height: isNaN(val) ? 2 : val,
                });
              }}
              className="w-full text-xs font-medium text-slate-800 outline-none bg-transparent"
            />
            <span className="text-[10px] text-slate-400 font-medium">px</span>
          </div>
        </div>
      </div>
    </div>
  );
}
