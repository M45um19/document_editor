"use client";

import React from "react";
import {
  ChevronDown,
  Maximize2,
  Plus,
  Trash2,
  GripVertical,
  FileSpreadsheet,
} from "lucide-react";

export function EditorCanvas() {
  const tableData = [
    { id: 1, item: "Product A", qty: 2, unitPrice: "$10.00", amount: "$20.00" },
    { id: 2, item: "Product B", qty: 3, unitPrice: "$10.00", amount: "$45.00" },
    { id: 3, item: "Product B", qty: 1, unitPrice: "$15.00", amount: "$45.00" },
    { id: 4, item: "Product C", qty: 1, unitPrice: "$50.00", amount: "$50.00" },
    { id: 5, item: "Product D", qty: 5, unitPrice: "$8.00", amount: "$40.00" },
  ];

  return (
    <div className="w-full flex flex-col select-none min-w-0">
      {/* Viewport Top Bar Controls */}
      <div className="w-full flex items-center justify-between sm:justify-end gap-2 mb-2 px-1">
        <span className="text-xs font-semibold text-slate-500 sm:hidden">
          Canvas (A4 Sheet)
        </span>
        
        <div className="flex items-center gap-2">
          {/* Zoom Selector */}
          <div className="flex items-center gap-1.5 px-2.5 sm:px-3 py-1 sm:py-1.5 bg-white border border-slate-200 rounded-md text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer">
            <span>100%</span>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </div>

          {/* Fullscreen Button */}
          <button
            type="button"
            aria-label="Expand viewport"
            className="p-1 sm:p-1.5 bg-white border border-slate-200 rounded-md text-slate-600 hover:text-slate-900 shadow-2xs hover:bg-slate-50 transition"
          >
            <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Main Document Canvas Sheet */}
      <div className="w-full bg-white rounded-lg shadow-sm border border-slate-200/90 p-4 sm:p-6 md:p-8 lg:p-12 min-h-[520px] sm:min-h-[640px] flex flex-col justify-between transition-all">
        <div className="space-y-6 sm:space-y-8">
          {/* Document Header */}
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-0">
            {/* Company Info */}
            <div className="flex items-start gap-3 sm:gap-3.5">
              {/* Geometric Logo */}
              <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-blue-600 flex items-center justify-center relative overflow-hidden shadow-xs shrink-0">
                <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white/25 rounded absolute -top-1 -right-1" />
                <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-sm" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-none">
                  Your Company
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1 sm:mt-1.5">
                  Better Documents, Better Business
                </p>
              </div>
            </div>

            {/* Document Title */}
            <div>
              <h1 className="text-lg sm:text-2xl md:text-3xl font-black tracking-wider text-slate-900 uppercase">
                VISUAL DOCUMENT
              </h1>
            </div>
          </div>

          {/* Issuer / Client / Metadata Details */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2 border-t sm:border-t-0 border-slate-100">
            {/* Issuer Info */}
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 block tracking-wider uppercase">
                ISSUER/
              </span>
              <p className="text-xs sm:text-sm md:text-base font-semibold text-slate-800 mt-0.5">
                Issuer Details
              </p>
            </div>

            {/* Client Info */}
            <div>
              <span className="text-[10px] sm:text-xs font-bold text-slate-400 block sm:hidden tracking-wider uppercase">
                CLIENT/
              </span>
              <p className="text-xs sm:text-sm md:text-base font-semibold text-slate-800 mt-0.5 sm:mt-4">
                Client Details
              </p>
            </div>

            {/* Number & Date */}
            <div className="sm:text-right space-y-0.5">
              <p className="text-xs sm:text-sm text-slate-800">
                <span className="font-bold">No/Date:</span>{" "}
                <span className="text-slate-600">C-2026-061</span>
              </p>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">2026-09-14</p>
            </div>
          </div>

          {/* Quotation Items Table Section */}
          <div className="border border-slate-100 rounded-lg p-2.5 sm:p-4 md:p-5 bg-white space-y-3 sm:space-y-3.5">
            {/* Table Header Controls */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded bg-blue-600 flex items-center justify-center text-white shrink-0">
                  <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-800 tracking-wide uppercase truncate">
                  QUOTATION ITEMS
                </h3>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  type="button"
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded bg-blue-50/70 border border-blue-200 text-blue-600 hover:bg-blue-100 text-xs sm:text-sm font-semibold transition"
                >
                  <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Add Column</span>
                </button>
                <button
                  type="button"
                  aria-label="Delete table"
                  className="p-1 sm:p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-slate-100 transition"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            {/* Table Container with Horizontal Scroll for Mobile */}
            <div className="overflow-x-auto w-full -mx-1 px-1">
              <table className="min-w-[500px] w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 text-slate-700 text-xs sm:text-sm font-bold border-y border-slate-200/70">
                    <th className="py-2.5 sm:py-3 px-1 w-8 text-center" />
                    <th className="py-2.5 sm:py-3 px-2 sm:px-3 w-10 sm:w-12 text-center">#</th>
                    <th className="py-2.5 sm:py-3 px-2 sm:px-3">Item Detail</th>
                    <th className="py-2.5 sm:py-3 px-2 sm:px-3 w-16 sm:w-20 text-center">Qty</th>
                    <th className="py-2.5 sm:py-3 px-2 sm:px-3 w-24 sm:w-28 text-center">Unit Price</th>
                    <th className="py-2.5 sm:py-3 px-2 sm:px-3 w-24 sm:w-28 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-xs sm:text-sm divide-y divide-slate-100">
                  {tableData.map((row) => (
                    <tr key={row.id} className="group hover:bg-slate-50/40 transition">
                      {/* Drag Handle */}
                      <td className="py-2 sm:py-2.5 px-1 text-center text-slate-300 group-hover:text-slate-400 cursor-grab">
                        <GripVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4 mx-auto" />
                      </td>

                      {/* Row Index */}
                      <td className="py-2 sm:py-2.5 px-2 sm:px-3 text-center font-bold text-slate-700">
                        {row.id}
                      </td>

                      {/* Item Detail Input */}
                      <td className="py-2 sm:py-2.5 px-2 sm:px-3">
                        <div className="bg-blue-50/70 border border-blue-100/80 rounded px-2.5 sm:px-3 py-1 sm:py-1.5 font-medium text-slate-800 w-full text-xs sm:text-sm truncate">
                          {row.item}
                        </div>
                      </td>

                      {/* Quantity Input */}
                      <td className="py-2 sm:py-2.5 px-2 sm:px-3 text-center">
                        <div className="bg-blue-50/70 border border-blue-100/80 rounded px-2 sm:px-2.5 py-1 sm:py-1.5 font-medium text-slate-800 text-center text-xs sm:text-sm">
                          {row.qty}
                        </div>
                      </td>

                      {/* Unit Price */}
                      <td className="py-2 sm:py-2.5 px-2 sm:px-3 text-center font-medium text-slate-700 text-xs sm:text-sm">
                        {row.unitPrice}
                      </td>

                      {/* Amount */}
                      <td className="py-2 sm:py-2.5 px-2 sm:px-3 text-right font-bold text-slate-800 text-xs sm:text-sm">
                        {row.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Row Action */}
            <div className="pt-1 sm:pt-2">
              <button
                type="button"
                className="flex items-center gap-1 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded bg-blue-50/60 border border-blue-200 text-blue-600 hover:bg-blue-100 text-xs sm:text-sm font-semibold transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Row</span>
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Footer */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-3 sm:gap-0 border-t border-slate-100 mt-6 sm:mt-8">
          <p className="text-[11px] sm:text-xs text-slate-400 italic text-center sm:text-left">
            Note: Full PDF layout rendered only upon export.
          </p>

          {/* 3-Bar Geometric Graphic */}
          <div className="flex items-end gap-1">
            <div className="w-2.5 sm:w-3 h-3 sm:h-3.5 bg-sky-200 -skew-x-12 rounded-xs" />
            <div className="w-2.5 sm:w-3 h-5 sm:h-6 bg-sky-400 -skew-x-12 rounded-xs" />
            <div className="w-2.5 sm:w-3 h-7 sm:h-9 bg-blue-600 -skew-x-12 rounded-xs" />
          </div>
        </div>
      </div>
    </div>
  );
}

