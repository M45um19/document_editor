"use client";

import React from "react";
import {
  MousePointer2,
  Type,
  Table as TableIcon,
  Image as ImageIcon,
  Shapes,
  Plus,
  X,
} from "lucide-react";

interface ComponentToolboxProps {
  onClose?: () => void;
  className?: string;
}

export function ComponentToolbox({ onClose, className = "" }: ComponentToolboxProps) {
  return (
    <aside
      className={`w-64 sm:w-60 lg:w-60 xl:w-64 2xl:w-72 3xl:w-80 bg-[#081225] text-slate-300 flex flex-col justify-between shrink-0 p-3.5 sm:p-4 2xl:p-5 select-none border-r border-slate-800 transition-all duration-200 overflow-y-auto ${className}`}
    >
      {/* Top Section: Header with mobile close button, Components list, and quick actions */}
      <div className="space-y-4 2xl:space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2.5 2xl:mb-3.5 px-1">
            <h2 className="text-xs 2xl:text-sm font-bold text-slate-200 uppercase tracking-wider">
              Components
            </h2>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Toolbox Drawer"
                className="lg:hidden p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800/80 transition"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <nav className="space-y-1 2xl:space-y-1.5">
            {/* Active: Select */}
            <button
              type="button"
              className="w-full flex items-center gap-2.5 2xl:gap-3 px-3 2xl:px-4 py-2 2xl:py-2.5 rounded-lg bg-blue-600 text-white text-xs 2xl:text-sm font-medium transition shadow-sm"
            >
              <MousePointer2 className="w-4 h-4 2xl:w-4.5 2xl:h-4.5 fill-white shrink-0" />
              <span>Select</span>
            </button>

            {/* Text Block */}
            <button
              type="button"
              className="w-full flex items-center gap-2.5 2xl:gap-3 px-3 2xl:px-4 py-2 2xl:py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 text-xs 2xl:text-sm font-medium transition"
            >
              <Type className="w-4 h-4 2xl:w-4.5 2xl:h-4.5 text-slate-400 shrink-0" />
              <span>Text Block</span>
            </button>

            {/* Simple Table */}
            <button
              type="button"
              className="w-full flex items-center gap-2.5 2xl:gap-3 px-3 2xl:px-4 py-2 2xl:py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 text-xs 2xl:text-sm font-medium transition"
            >
              <TableIcon className="w-4 h-4 2xl:w-4.5 2xl:h-4.5 text-slate-400 shrink-0" />
              <span>Simple Table</span>
            </button>

            {/* Image */}
            <button
              type="button"
              className="w-full flex items-center gap-2.5 2xl:gap-3 px-3 2xl:px-4 py-2 2xl:py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 text-xs 2xl:text-sm font-medium transition"
            >
              <ImageIcon className="w-4 h-4 2xl:w-4.5 2xl:h-4.5 text-slate-400 shrink-0" />
              <span>Image</span>
            </button>

            {/* Shape */}
            <button
              type="button"
              className="w-full flex items-center gap-2.5 2xl:gap-3 px-3 2xl:px-4 py-2 2xl:py-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/60 text-xs 2xl:text-sm font-medium transition"
            >
              <Shapes className="w-4 h-4 2xl:w-4.5 2xl:h-4.5 text-slate-400 shrink-0" />
              <span>Shape</span>
            </button>
          </nav>
        </div>

        {/* Quick Add Buttons */}
        <div className="space-y-2 2xl:space-y-2.5 pt-1">
          <button
            type="button"
            className="w-full py-2 2xl:py-2.5 px-3 2xl:px-4 rounded-lg border border-slate-700/80 bg-slate-900/40 hover:bg-slate-800/70 text-slate-200 text-xs 2xl:text-sm font-medium flex items-center justify-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-slate-400 shrink-0" />
            <span>Add Simple Table</span>
          </button>

          <button
            type="button"
            className="w-full py-2 2xl:py-2.5 px-3 2xl:px-4 rounded-lg border border-slate-700/80 bg-slate-900/40 hover:bg-slate-800/70 text-slate-200 text-xs 2xl:text-sm font-medium flex items-center justify-center gap-1.5 transition"
          >
            <Plus className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-slate-400 shrink-0" />
            <span>Add New Text Line</span>
          </button>
        </div>
      </div>

      {/* Bottom Section: Pages */}
      <div className="pt-4 2xl:pt-6 border-t border-slate-800/80 space-y-2.5 2xl:space-y-3.5 mt-4">
        <h2 className="text-xs 2xl:text-sm font-bold text-slate-200 uppercase tracking-wider px-1">
          Pages
        </h2>

        {/* Page Thumbnail */}
        <div className="relative group cursor-pointer">
          <div className="w-full aspect-[4/3] bg-white rounded-lg p-2 2xl:p-3 border-2 border-blue-500 shadow-md flex flex-col justify-between overflow-hidden">
            {/* Mini document content sketch */}
            <div className="space-y-1 2xl:space-y-1.5">
              <div className="flex justify-between items-center">
                <div className="w-3 h-3 2xl:w-4 2xl:h-4 rounded-xs bg-blue-500/70" />
                <div className="w-10 2xl:w-14 h-1 2xl:h-1.5 bg-slate-400 rounded-full" />
              </div>
              <div className="w-full h-0.5 2xl:h-1 bg-slate-200 my-1" />
              <div className="space-y-0.5 2xl:space-y-1">
                <div className="w-full h-1 2xl:h-1.5 bg-blue-100 rounded-xs" />
                <div className="w-full h-1 2xl:h-1.5 bg-blue-100 rounded-xs" />
                <div className="w-full h-1 2xl:h-1.5 bg-blue-100 rounded-xs" />
              </div>
            </div>

            {/* Page Number Badge */}
            <div className="w-4 h-4 2xl:w-5 2xl:h-5 rounded bg-blue-600 text-white text-[9px] 2xl:text-xs font-bold flex items-center justify-center shadow-xs">
              1
            </div>
          </div>
        </div>

        {/* Add Page Button */}
        <button
          type="button"
          className="w-full py-2 2xl:py-2.5 rounded-lg border border-slate-700/80 bg-slate-900/40 hover:bg-slate-800/70 text-slate-300 text-xs 2xl:text-sm font-medium flex items-center justify-center gap-1.5 transition"
        >
          <Plus className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-slate-400 shrink-0" />
          <span>Add Page</span>
        </button>
      </div>
    </aside>
  );
}

