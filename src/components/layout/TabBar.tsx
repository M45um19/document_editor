"use client";

import React from "react";
import { FileText, X, Plus } from "lucide-react";

export function TabBar() {
  return (
    <div className="bg-[#eef2f7] border-b border-slate-200 px-2 sm:px-4 flex items-end gap-1 sm:gap-1.5 shrink-0 overflow-x-auto select-none pt-1.5 scrollbar-none">
      {/* Active Tab: New-Template */}
      <div className="flex items-center gap-2 sm:gap-3 bg-white px-3 sm:px-8 2xl:px-10 py-1.5 sm:py-2.5 rounded-t-md text-xs sm:text-sm font-semibold text-blue-600 border border-slate-200 border-b-white shadow-xs relative top-[1px] shrink-0">
        <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
        <span className="px-1 sm:px-2 whitespace-nowrap max-w-[100px] sm:max-w-none truncate">
          New-Template
        </span>
        <button
          type="button"
          aria-label="Close tab"
          className="ml-1 sm:ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded p-0.5 sm:p-1 transition"
        >
          <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>

      {/* Inactive Tab: Template-1 */}
      <div className="flex items-center gap-2 sm:gap-3 px-3 sm:px-8 2xl:px-10 py-1.5 sm:py-2.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 rounded-t-md transition shrink-0 cursor-pointer">
        <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-500 shrink-0" />
        <span className="px-1 sm:px-2 whitespace-nowrap max-w-[100px] sm:max-w-none truncate">
          Template-1
        </span>
        <button
          type="button"
          aria-label="Close tab"
          className="ml-1 sm:ml-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200/50 rounded p-0.5 sm:p-1 transition"
        >
          <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
        </button>
      </div>

      {/* Add Tab Button */}
      <button
        type="button"
        aria-label="Add new template tab"
        className="w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center rounded hover:bg-slate-200/70 text-slate-600 transition mb-0.5 sm:mb-1 ml-1 shrink-0"
      >
        <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
      </button>
    </div>
  );
}

