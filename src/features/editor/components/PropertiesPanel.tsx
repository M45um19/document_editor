"use client";

import React from "react";
import {
  SlidersHorizontal,
  Type,
  Table as TableIcon,
  Columns,
  Rows,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Plus,
  Trash2,
} from "lucide-react";

export function PropertiesPanel() {
  return (
    <aside className="w-72 sm:w-80 lg:w-84 xl:w-92 2xl:w-[380px] 3xl:w-[440px] bg-white border-l border-slate-200 flex flex-col shrink-0 overflow-y-auto select-none p-4 2xl:p-6 space-y-6 2xl:space-y-8 transition-all duration-200">
      {/* Panel Header */}
      <div className="flex items-center gap-2 pb-2 2xl:pb-3 border-b border-slate-100">
        <SlidersHorizontal className="w-4 h-4 2xl:w-5 2xl:h-5 text-slate-700" />
        <h2 className="text-sm 2xl:text-base font-bold text-slate-900">Properties & Data</h2>
      </div>

      {/* Text Settings Section */}
      <div className="space-y-3.5 2xl:space-y-4">
        {/* Tab Header */}
        <div className="flex items-center gap-2 border-b-2 border-blue-600 pb-1.5 2xl:pb-2 w-fit text-blue-600 font-bold text-xs 2xl:text-sm">
          <Type className="w-4 h-4 2xl:w-4.5 2xl:h-4.5" />
          <span>Text Settings</span>
        </div>

        {/* 2-Column Form Fields */}
        <div className="grid grid-cols-2 gap-3 2xl:gap-4 pt-1">
          {/* Font Family */}
          <div className="space-y-1 2xl:space-y-1.5">
            <label className="text-[11px] 2xl:text-xs font-medium text-slate-600 block">
              Font Family
            </label>
            <div className="flex items-center justify-between px-2.5 2xl:px-3 py-1.5 2xl:py-2 border border-slate-200 rounded-md text-xs 2xl:text-sm font-medium text-slate-800 bg-white shadow-2xs hover:border-slate-300 cursor-pointer">
              <span>Inter</span>
              <ChevronDown className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-slate-400" />
            </div>
          </div>

          {/* Font Size */}
          <div className="space-y-1 2xl:space-y-1.5">
            <label className="text-[11px] 2xl:text-xs font-medium text-slate-600 block">
              Font Size
            </label>
            <div className="flex items-center border border-slate-200 rounded-md px-2.5 2xl:px-3 py-1.5 2xl:py-2 bg-white shadow-2xs focus-within:border-blue-500">
              <input
                type="text"
                defaultValue="10"
                className="w-full text-xs 2xl:text-sm font-medium text-slate-800 outline-none"
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
            <div className="flex items-center justify-between px-2.5 2xl:px-3 py-1.5 2xl:py-2 border border-slate-200 rounded-md text-xs 2xl:text-sm font-medium text-slate-800 bg-white shadow-2xs hover:border-slate-300 cursor-pointer">
              <span>Medium</span>
              <ChevronDown className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-slate-400" />
            </div>
          </div>

          {/* Text Color */}
          <div className="space-y-1 2xl:space-y-1.5">
            <label className="text-[11px] 2xl:text-xs font-medium text-slate-600 block">
              Text Color
            </label>
            <div className="flex items-center gap-2 border border-slate-200 rounded-md px-2 2xl:px-2.5 py-1.5 2xl:py-2 bg-white shadow-2xs cursor-pointer">
              <div className="w-4 h-4 2xl:w-4.5 2xl:h-4.5 rounded-xs bg-[#1F2937] border border-slate-300 shrink-0" />
              <span className="text-xs 2xl:text-sm font-medium text-slate-800">#1F2937</span>
            </div>
          </div>
        </div>

        {/* Alignment Controls */}
        <div className="space-y-1.5 2xl:space-y-2 pt-1">
          <label className="text-[11px] 2xl:text-xs font-medium text-slate-600 block">
            Alignment
          </label>
          <div className="flex items-center gap-1.5 2xl:gap-2">
            {/* Left Align (Active) */}
            <button
              type="button"
              className="p-1.5 2xl:p-2 rounded-md border border-blue-200 bg-blue-50 text-blue-600 flex items-center justify-center shadow-xs"
            >
              <AlignLeft className="w-4 h-4 2xl:w-4.5 2xl:h-4.5" />
            </button>
            {/* Center Align */}
            <button
              type="button"
              className="p-1.5 2xl:p-2 rounded-md border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center transition shadow-2xs"
            >
              <AlignCenter className="w-4 h-4 2xl:w-4.5 2xl:h-4.5" />
            </button>
            {/* Right Align */}
            <button
              type="button"
              className="p-1.5 2xl:p-2 rounded-md border border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50 flex items-center justify-center transition shadow-2xs"
            >
              <AlignRight className="w-4 h-4 2xl:w-4.5 2xl:h-4.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Table Settings Section */}
      <div className="space-y-3.5 2xl:space-y-4 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-xs 2xl:text-sm">
          <TableIcon className="w-4 h-4 2xl:w-4.5 2xl:h-4.5 text-slate-700" />
          <span>Table Settings</span>
        </div>

        <div className="grid grid-cols-2 gap-3 2xl:gap-4">
          {/* Width */}
          <div className="space-y-1 2xl:space-y-1.5">
            <label className="text-[11px] 2xl:text-xs font-medium text-slate-600 block">
              Width
            </label>
            <div className="flex items-center border border-slate-200 rounded-md px-2.5 2xl:px-3 py-1.5 2xl:py-2 bg-white shadow-2xs focus-within:border-blue-500">
              <input
                type="text"
                defaultValue="120"
                className="w-full text-xs 2xl:text-sm font-medium text-slate-800 outline-none"
              />
              <span className="text-[11px] 2xl:text-xs text-slate-400 font-medium ml-1">
                px
              </span>
            </div>
          </div>

          {/* Borders */}
          <div className="space-y-1 2xl:space-y-1.5">
            <label className="text-[11px] 2xl:text-xs font-medium text-slate-600 block">
              Borders
            </label>
            <div className="flex items-center justify-between px-2 2xl:px-2.5 py-1.5 2xl:py-2 border border-slate-200 rounded-md text-[11px] 2xl:text-xs font-medium text-slate-800 bg-white shadow-2xs hover:border-slate-300 cursor-pointer overflow-hidden">
              <span className="truncate">1px Solid #E5E7EB</span>
              <ChevronDown className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-slate-400 shrink-0 ml-1" />
            </div>
          </div>

          {/* Padding */}
          <div className="space-y-1 2xl:space-y-1.5">
            <label className="text-[11px] 2xl:text-xs font-medium text-slate-600 block">
              Padding
            </label>
            <div className="flex items-center border border-slate-200 rounded-md px-2.5 2xl:px-3 py-1.5 2xl:py-2 bg-white shadow-2xs focus-within:border-blue-500">
              <input
                type="text"
                defaultValue="0"
                className="w-full text-xs 2xl:text-sm font-medium text-slate-800 outline-none"
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
                type="text"
                defaultValue="1"
                className="w-full text-xs 2xl:text-sm font-medium text-slate-800 outline-none"
              />
              <span className="text-[11px] 2xl:text-xs text-slate-400 font-medium ml-1">
                px
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Column Management */}
      <div className="space-y-2.5 2xl:space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-xs 2xl:text-sm">
          <Columns className="w-4 h-4 2xl:w-4.5 2xl:h-4.5 text-blue-600" />
          <span>Column Management</span>
        </div>

        <div className="grid grid-cols-2 gap-2 2xl:gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 py-2 2xl:py-2.5 px-2 rounded-md border border-slate-200 bg-white text-xs 2xl:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-slate-500" />
            <span>Add Column</span>
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-1.5 py-2 2xl:py-2.5 px-2 rounded-md border border-slate-200 bg-white text-xs 2xl:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-slate-500" />
            <span>Delete Column</span>
          </button>
        </div>
      </div>

      {/* Row Management */}
      <div className="space-y-2.5 2xl:space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-xs 2xl:text-sm">
          <Rows className="w-4 h-4 2xl:w-4.5 2xl:h-4.5 text-slate-700" />
          <span>Row Management</span>
        </div>

        <div className="grid grid-cols-2 gap-2 2xl:gap-3">
          <button
            type="button"
            className="flex items-center justify-center gap-1.5 py-2 2xl:py-2.5 px-2 rounded-md border border-slate-200 bg-white text-xs 2xl:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-slate-500" />
            <span>Add Row</span>
          </button>

          <button
            type="button"
            className="flex items-center justify-center gap-1.5 py-2 2xl:py-2.5 px-2 rounded-md border border-slate-200 bg-white text-xs 2xl:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs"
          >
            <Trash2 className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-slate-500" />
            <span>Delete Row</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
