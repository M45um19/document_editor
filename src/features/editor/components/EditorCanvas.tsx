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
    <div className="w-full flex flex-col items-center select-none">
      {/* Viewport Top Bar Controls */}
      <div className="w-full flex items-center justify-end gap-2 mb-2">
        {/* Zoom Selector */}
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-md text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer">
          <span>100%</span>
          <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {/* Fullscreen Button */}
        <button
          type="button"
          aria-label="Expand viewport"
          className="p-1.5 bg-white border border-slate-200 rounded-md text-slate-600 hover:text-slate-900 shadow-2xs hover:bg-slate-50 transition"
        >
          <Maximize2 className="w-4 h-4" />
        </button>
      </div>

      {/* Main Document Canvas Sheet */}
      <div className="w-full bg-white rounded-lg shadow-sm border border-slate-200/90 p-6 sm:p-8 md:p-10 lg:p-12 min-h-[640px] flex flex-col justify-between">
        <div className="space-y-8">
          {/* Document Header */}
          <div className="flex items-start justify-between">
            {/* Company Info */}
            <div className="flex items-start gap-3.5">
              {/* Geometric Logo */}
              <div className="w-11 h-11 rounded-lg bg-blue-600 flex items-center justify-center relative overflow-hidden shadow-xs shrink-0">
                <div className="w-4 h-4 bg-white/25 rounded absolute -top-1 -right-1" />
                <div className="w-5 h-5 bg-white rounded-sm" />
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight leading-none">
                  Your Company
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 font-normal mt-1.5">
                  Better Documents, Better Business
                </p>
              </div>
            </div>

            {/* Document Title */}
            <div>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-black tracking-wider text-slate-900 uppercase">
                VISUAL DOCUMENT
              </h1>
            </div>
          </div>

          {/* Issuer / Client / Metadata Details */}
          <div className="grid grid-cols-3 gap-4 pt-2">
            {/* Issuer Info */}
            <div>
              <span className="text-[11px] sm:text-xs font-bold text-slate-400 block tracking-wider uppercase">
                ISSUER/
              </span>
              <p className="text-xs sm:text-sm md:text-base font-semibold text-slate-800 mt-0.5">
                Issuer Details
              </p>
            </div>

            {/* Client Info */}
            <div>
              <p className="text-xs sm:text-sm md:text-base font-semibold text-slate-800 mt-4">
                Client Details
              </p>
            </div>

            {/* Number & Date */}
            <div className="text-right space-y-0.5">
              <p className="text-xs sm:text-sm text-slate-800">
                <span className="font-bold">No/Date:</span>{" "}
                <span className="text-slate-600">C-2026-061</span>
              </p>
              <p className="text-xs sm:text-sm text-slate-600 font-medium">2026-09-14</p>
            </div>
          </div>

          {/* Quotation Items Table Section */}
          <div className="border border-slate-100 rounded-lg p-3 sm:p-5 bg-white space-y-3.5">
            {/* Table Header Controls */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center text-white">
                  <FileSpreadsheet className="w-4 h-4" />
                </div>
                <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-800 tracking-wide uppercase">
                  QUOTATION ITEMS
                </h3>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="flex items-center gap-1 px-3 py-1.5 rounded bg-blue-50/70 border border-blue-200 text-blue-600 hover:bg-blue-100 text-xs sm:text-sm font-semibold transition"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Column</span>
                </button>
                <button
                  type="button"
                  aria-label="Delete table"
                  className="p-1.5 rounded text-slate-400 hover:text-red-500 hover:bg-slate-100 transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Table Container */}
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/70 text-slate-700 text-xs sm:text-sm font-bold border-y border-slate-200/70">
                    <th className="py-3 px-2 w-10 text-center" />
                    <th className="py-3 px-3 w-12 text-center">#</th>
                    <th className="py-3 px-3">Item Detail</th>
                    <th className="py-3 px-3 w-20 text-center">Qty</th>
                    <th className="py-3 px-3 w-28 text-center">Unit Price</th>
                    <th className="py-3 px-3 w-28 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-xs sm:text-sm divide-y divide-slate-100">
                  {tableData.map((row) => (
                    <tr key={row.id} className="group hover:bg-slate-50/40 transition">
                      {/* Drag Handle */}
                      <td className="py-2.5 px-1 text-center text-slate-300 group-hover:text-slate-400 cursor-grab">
                        <GripVertical className="w-4 h-4 mx-auto" />
                      </td>

                      {/* Row Index */}
                      <td className="py-2.5 px-3 text-center font-bold text-slate-700">
                        {row.id}
                      </td>

                      {/* Item Detail Input */}
                      <td className="py-2.5 px-3">
                        <div className="bg-blue-50/70 border border-blue-100/80 rounded px-3 py-1.5 font-medium text-slate-800 w-full">
                          {row.item}
                        </div>
                      </td>

                      {/* Quantity Input */}
                      <td className="py-2.5 px-3 text-center">
                        <div className="bg-blue-50/70 border border-blue-100/80 rounded px-2.5 py-1.5 font-medium text-slate-800 text-center">
                          {row.qty}
                        </div>
                      </td>

                      {/* Unit Price */}
                      <td className="py-2.5 px-3 text-center font-medium text-slate-700">
                        {row.unitPrice}
                      </td>

                      {/* Amount */}
                      <td className="py-2.5 px-3 text-right font-bold text-slate-800">
                        {row.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Add Row Action */}
            <div className="pt-2">
              <button
                type="button"
                className="flex items-center gap-1 px-3.5 py-2 rounded bg-blue-50/60 border border-blue-200 text-blue-600 hover:bg-blue-100 text-xs sm:text-sm font-semibold transition"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Row</span>
              </button>
            </div>
          </div>
        </div>

        {/* Canvas Footer */}
        <div className="pt-8 flex items-end justify-between border-t border-slate-100 mt-8">
          <p className="text-xs text-slate-400 italic">
            Note: Full PDF layout rendered only upon export.
          </p>

          {/* 3-Bar Geometric Graphic */}
          <div className="flex items-end gap-1">
            <div className="w-3 h-3.5 bg-sky-200 -skew-x-12 rounded-xs" />
            <div className="w-3 h-6 bg-sky-400 -skew-x-12 rounded-xs" />
            <div className="w-3 h-9 bg-blue-600 -skew-x-12 rounded-xs" />
          </div>
        </div>
      </div>
    </div>
  );
}
