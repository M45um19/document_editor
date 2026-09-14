"use client";

import React from "react";
import { FileText, Undo2, Redo2, Eye, Save, Download } from "lucide-react";

export function Header() {
  return (
    <header className="h-16 2xl:h-20 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 2xl:px-12 flex items-center justify-between z-20 shrink-0 transition-all duration-200">
      {/* Left Section: Logo, Title, Project Name, History */}
      <div className="flex items-center gap-4 2xl:gap-6">
        {/* App Logo */}
        <div className="w-9 h-9 2xl:w-11 2xl:h-11 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 shrink-0">
          <FileText className="w-5 h-5 2xl:w-6 2xl:h-6" />
        </div>

        {/* Title */}
        <h1 className="text-base md:text-lg 2xl:text-xl font-bold text-slate-900 tracking-tight whitespace-nowrap">
          Document Editor <span className="font-semibold text-slate-700">(PoC)</span>
        </h1>

        {/* Project Name Field */}
        <div className="hidden sm:flex flex-col justify-center bg-slate-50 border border-slate-200 rounded-md px-3 py-1 2xl:px-4 2xl:py-1.5 min-w-[180px] 2xl:min-w-[220px]">
          <span className="text-[10px] 2xl:text-xs font-medium text-slate-400 uppercase tracking-wide leading-tight">
            Project Name
          </span>
          <input
            type="text"
            defaultValue="Document Project V1"
            className="text-xs 2xl:text-sm font-semibold text-slate-800 bg-transparent outline-none focus:text-blue-600"
          />
        </div>

        {/* Undo / Redo */}
        <div className="flex items-center gap-1 2xl:gap-2 ml-1 text-slate-500">
          <button
            type="button"
            aria-label="Undo"
            className="p-1.5 2xl:p-2 rounded hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <Undo2 className="w-4 h-4 2xl:w-5 2xl:h-5" />
          </button>
          <button
            type="button"
            aria-label="Redo"
            className="p-1.5 2xl:p-2 rounded hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <Redo2 className="w-4 h-4 2xl:w-5 2xl:h-5" />
          </button>
        </div>
      </div>

      {/* Right Section: Action Buttons */}
      <div className="flex items-center gap-2.5 2xl:gap-3.5">
        {/* Preview Button */}
        <button
          type="button"
          className="flex items-center gap-1.5 2xl:gap-2 px-3.5 2xl:px-4.5 py-1.5 2xl:py-2 rounded-lg border border-slate-200 bg-white text-xs 2xl:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
        >
          <Eye className="w-3.5 h-3.5 2xl:w-4.5 2xl:h-4.5 text-slate-500" />
          <span>Preview</span>
        </button>

        {/* Save Button */}
        <button
          type="button"
          className="flex items-center gap-1.5 2xl:gap-2 px-3.5 2xl:px-4.5 py-1.5 2xl:py-2 rounded-lg border border-blue-200 bg-blue-50/50 text-xs 2xl:text-sm font-semibold text-blue-600 hover:bg-blue-100/60 transition shadow-xs"
        >
          <Save className="w-3.5 h-3.5 2xl:w-4.5 2xl:h-4.5 text-blue-600" />
          <span>Save</span>
        </button>

        {/* Download PDF Button */}
        <button
          type="button"
          className="flex items-center gap-1.5 2xl:gap-2 px-4 2xl:px-5 py-1.5 2xl:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs 2xl:text-sm font-semibold text-white transition shadow-sm shadow-blue-600/20"
        >
          <Download className="w-3.5 h-3.5 2xl:w-4.5 2xl:h-4.5 text-white" />
          <span>Download PDF</span>
        </button>
      </div>
    </header>
  );
}
