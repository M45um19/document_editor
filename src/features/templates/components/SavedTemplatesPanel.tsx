"use client";

import React from "react";
import { Folder, Plus, FileText, MoreVertical } from "lucide-react";

export function SavedTemplatesPanel() {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs select-none">
      <div className="space-y-3.5 sm:space-y-4">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
          <div className="flex items-center gap-2.5 sm:gap-3">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-xs shrink-0">
              <Folder className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-white/20" />
            </div>
            <div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-900 leading-none">
                Saved Templates
              </h2>
              <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1">
                Access and manage your saved templates.
              </p>
            </div>
          </div>

          {/* Save Current as Template Button */}
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-lg border border-blue-500 text-blue-600 hover:bg-blue-50/60 text-xs font-semibold bg-white transition shadow-2xs w-full sm:w-auto"
          >
            <Plus className="w-3.5 h-3.5 text-blue-600" />
            <span>Save Current as Template</span>
          </button>
        </div>

        {/* Template Cards List */}
        <div className="space-y-2">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-0 p-3 rounded-lg border border-slate-200 bg-white hover:border-slate-300 transition shadow-2xs">
            {/* Left: Document Icon & Details */}
            <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
              <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white shrink-0">
                <FileText className="w-4 h-4" />
              </div>
              <div className="min-w-0">
                <h3 className="text-xs sm:text-sm font-bold text-slate-800 leading-none truncate">
                  Template-1
                </h3>
                <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1">
                  Saved on 2026-09-14 <span className="mx-1">|</span> 10:32 AM
                </p>
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <button
                type="button"
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-md border border-blue-400 text-blue-600 bg-white hover:bg-blue-50 text-xs font-semibold transition shadow-2xs"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>Open</span>
              </button>

              <button
                type="button"
                aria-label="More options"
                className="p-1 rounded text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
              >
                <MoreVertical className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

