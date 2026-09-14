"use client";

import React from "react";
import { FileText, X, Plus } from "lucide-react";

export function TabBar() {
  return (
    <div className="bg-[#eef2f7] border-b border-slate-200 px-0 flex items-end gap-1.5 shrink-0 overflow-x-auto select-none pt-1.5">
      {/* Active Tab: New-Template */}
      <div className="flex items-center gap-3 bg-white px-8 sm:px-10 py-2.5 rounded-t-md text-xs sm:text-sm font-semibold text-blue-600 border border-slate-200 border-b-white shadow-xs relative top-[1px] ml-0">
        <FileText className="w-4 h-4 text-blue-600 shrink-0" />
        <span className="px-2 whitespace-nowrap">New-Template</span>
        <button
          type="button"
          aria-label="Close tab"
          className="ml-2 text-slate-400 hover:text-slate-600 rounded p-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Inactive Tab: Template-1 */}
      <div className="flex items-center gap-3 px-8 sm:px-10 py-2.5 text-xs sm:text-sm font-medium text-slate-600 hover:text-slate-900 rounded-t-md transition">
        <FileText className="w-4 h-4 text-slate-500 shrink-0" />
        <span className="px-2 whitespace-nowrap">Template-1</span>
        <button
          type="button"
          aria-label="Close tab"
          className="ml-2 text-slate-400 hover:text-slate-600 rounded p-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Add Tab Button */}
      <button
        type="button"
        aria-label="Add new template tab"
        className="w-8 h-8 flex items-center justify-center rounded hover:bg-slate-200/70 text-slate-600 transition mb-1 ml-1.5"
      >
        <Plus className="w-4 h-4" />
      </button>
    </div>
  );
}
