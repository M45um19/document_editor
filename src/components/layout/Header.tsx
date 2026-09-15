"use client";

import React from "react";
import { FileText, Undo2, Redo2, Eye, Save, Download, PanelLeft, SlidersHorizontal } from "lucide-react";

interface HeaderProps {
  onToggleToolbox?: () => void;
  onToggleProperties?: () => void;
}

export function Header({ onToggleToolbox, onToggleProperties }: HeaderProps) {
  return (
    <header className="h-14 sm:h-16 2xl:h-20 bg-white border-b border-slate-200 px-3 sm:px-6 lg:px-8 2xl:px-12 flex items-center justify-between z-20 shrink-0 transition-all duration-200">
      {/* Left Section: Mobile Drawer Button, Logo, Title, Project Name, History */}
      <div className="flex items-center gap-2 sm:gap-4 2xl:gap-6 min-w-0">
        {/* Mobile Toolbox Toggle Button */}
        <button
          type="button"
          onClick={onToggleToolbox}
          aria-label="Toggle Components Toolbox"
          className="lg:hidden p-1.5 sm:p-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition shrink-0"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        {/* App Logo */}
        <div className="w-8 h-8 sm:w-9 sm:h-9 2xl:w-11 2xl:h-11 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 shrink-0">
          <FileText className="w-4 h-4 sm:w-5 sm:h-5 2xl:w-6 2xl:h-6" />
        </div>

        {/* Title */}
        <h1 className="text-sm sm:text-base md:text-lg 2xl:text-xl font-bold text-slate-900 tracking-tight whitespace-nowrap truncate">
          Document Editor <span className="font-semibold text-slate-500 hidden xs:inline">(PoC)</span>
        </h1>

        {/* Project Name Field */}
        <div className="hidden md:flex flex-col justify-center bg-slate-50 border border-slate-200 rounded-md px-2.5 sm:px-3 py-0.5 sm:py-1 2xl:px-4 2xl:py-1.5 min-w-[140px] lg:min-w-[180px] 2xl:min-w-[220px]">
          <span className="text-[9px] 2xl:text-xs font-medium text-slate-400 uppercase tracking-wide leading-tight">
            Project Name
          </span>
          <input
            type="text"
            defaultValue="Document Project V1"
            className="text-xs 2xl:text-sm font-semibold text-slate-800 bg-transparent outline-none focus:text-blue-600 truncate"
          />
        </div>

        {/* Undo / Redo */}
        <div className="hidden sm:flex items-center gap-0.5 sm:gap-1 2xl:gap-2 ml-1 text-slate-500">
          <button
            type="button"
            aria-label="Undo"
            className="p-1 sm:p-1.5 2xl:p-2 rounded hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <Undo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 2xl:w-5 2xl:h-5" />
          </button>
          <button
            type="button"
            aria-label="Redo"
            className="p-1 sm:p-1.5 2xl:p-2 rounded hover:bg-slate-100 hover:text-slate-700 transition"
          >
            <Redo2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 2xl:w-5 2xl:h-5" />
          </button>
        </div>
      </div>

      {/* Right Section: Action Buttons */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 2xl:gap-3.5 shrink-0">
        {/* Mobile Properties Quick Jump Button */}
        {onToggleProperties && (
          <button
            type="button"
            onClick={onToggleProperties}
            aria-label="Toggle Properties Panel"
            className="xl:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 text-slate-600" />
            <span className="hidden sm:inline">Properties</span>
          </button>
        )}

        {/* Preview Button */}
        <button
          type="button"
          aria-label="Preview Document"
          className="hidden sm:flex items-center gap-1.5 2xl:gap-2 px-2.5 sm:px-3.5 2xl:px-4.5 py-1.5 2xl:py-2 rounded-lg border border-slate-200 bg-white text-xs 2xl:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-xs"
        >
          <Eye className="w-3.5 h-3.5 2xl:w-4.5 2xl:h-4.5 text-slate-500" />
          <span className="hidden md:inline">Preview</span>
        </button>

        {/* Save Button */}
        <button
          type="button"
          aria-label="Save Document"
          className="flex items-center gap-1 sm:gap-1.5 2xl:gap-2 px-2.5 sm:px-3.5 2xl:px-4.5 py-1.5 2xl:py-2 rounded-lg border border-blue-200 bg-blue-50/50 text-xs 2xl:text-sm font-semibold text-blue-600 hover:bg-blue-100/60 transition shadow-xs"
        >
          <Save className="w-3.5 h-3.5 2xl:w-4.5 2xl:h-4.5 text-blue-600" />
          <span className="hidden md:inline">Save</span>
        </button>

        {/* Download PDF Button */}
        <button
          type="button"
          aria-label="Download PDF"
          className="flex items-center gap-1 sm:gap-1.5 2xl:gap-2 px-2.5 sm:px-4 2xl:px-5 py-1.5 2xl:py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-xs 2xl:text-sm font-semibold text-white transition shadow-sm shadow-blue-600/20"
        >
          <Download className="w-3.5 h-3.5 2xl:w-4.5 2xl:h-4.5 text-white" />
          <span className="hidden md:inline">Download PDF</span>
        </button>
      </div>
    </header>
  );
}

