"use client";

import React from "react";
import { FileText, Trash2 } from "lucide-react";
import { TemplateCardProps } from "../../types";

export function TemplateCard({
  template,
  isActive,
  onOpen,
  onDelete,
}: TemplateCardProps) {
  return (
    <div
      className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-0 p-3 rounded-lg border transition shadow-2xs group ${
        isActive
          ? "border-blue-300 bg-blue-50/30"
          : "border-slate-200 bg-white hover:border-slate-300"
      }`}
    >
      {/* Left: Document Icon & Details */}
      <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
        <div
          className={`w-7 h-7 rounded flex items-center justify-center text-white shrink-0 ${
            isActive ? "bg-blue-600 shadow-xs" : "bg-slate-400"
          }`}
        >
          <FileText className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h3 className="text-xs sm:text-sm font-bold text-slate-800 leading-none truncate">
              {template.name}
            </h3>
            {isActive && (
              <span className="text-[10px] font-semibold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                Active
              </span>
            )}
          </div>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1">
            Saved on {template.savedAt}
          </p>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
        <button
          type="button"
          onClick={() => onOpen(template)}
          className={`flex items-center gap-1.5 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-md text-xs font-semibold transition shadow-2xs cursor-pointer ${
            isActive
              ? "bg-blue-600 text-white hover:bg-blue-700"
              : "border border-blue-400 text-blue-600 bg-white hover:bg-blue-50"
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>{isActive ? "Current" : "Open"}</span>
        </button>

        <button
          type="button"
          onClick={() => onDelete(template.id, template.name)}
          aria-label={`Delete ${template.name}`}
          className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
