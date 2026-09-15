"use client";

import React from "react";
import {
  ChevronDown,
  Maximize2,
  Plus,
  Trash2,
  GripVertical,
  FileSpreadsheet,
  Type,
  ImageIcon,
  Shapes,
  X,
  FileText,
} from "lucide-react";
import { useMounted } from "@/hooks/useMounted";
import { useEditorState } from "../hooks/useEditorState";
import {
  TableBlock,
  TextBlock,
  ImageBlock,
  ShapeBlock,
  CanvasBlock,
} from "../types";

export function EditorCanvas() {
  const isMounted = useMounted();
  const metadata = useEditorState((s) => s.metadata);
  const setMetadata = useEditorState((s) => s.setMetadata);
  const pages = useEditorState((s) => s.pages);
  const activePage = useEditorState((s) => s.activePage);
  const setActivePage = useEditorState((s) => s.setActivePage);
  const zoomLevel = useEditorState((s) => s.zoomLevel);
  const setZoomLevel = useEditorState((s) => s.setZoomLevel);
  const toggleFullscreen = useEditorState((s) => s.toggleFullscreen);

  const updateTextBlock = useEditorState((s) => s.updateTextBlock);
  const updateTableRow = useEditorState((s) => s.updateTableRow);
  const addTableRow = useEditorState((s) => s.addTableRow);
  const deleteTableRow = useEditorState((s) => s.deleteTableRow);
  const removeElement = useEditorState((s) => s.removeElement);
  const addElement = useEditorState((s) => s.addElement);

  if (!isMounted) {
    return (
      <div className="w-full flex flex-col min-w-0">
        <div className="w-full flex items-center justify-between sm:justify-end gap-2 mb-2.5 px-1">
          <div className="h-6 w-32 bg-slate-200/60 rounded-md" />
        </div>
        <div className="w-full bg-white rounded-xl shadow-sm border border-slate-200/90 p-4 sm:p-6 md:p-8 lg:p-12 min-h-[580px] sm:min-h-[680px]" />
      </div>
    );
  }

  const currentPage = pages.find((p) => p.pageNumber === activePage) || pages[0];

  const renderBlock = (block: CanvasBlock, pageNum: number) => {
    switch (block.type) {
      case "table": {
        const tableBlock = block as TableBlock;
        return (
          <div
            key={tableBlock.id}
            className="border border-slate-200/80 rounded-xl p-3 sm:p-4 md:p-5 bg-white space-y-3 sm:space-y-3.5 relative group shadow-2xs"
          >
            {/* Table Header Controls */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <h3 className="text-xs sm:text-sm md:text-base font-bold text-slate-800 tracking-wide uppercase truncate">
                  {tableBlock.title}
                </h3>
              </div>

              <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
                <button
                  type="button"
                  onClick={() => addTableRow(pageNum, tableBlock.id)}
                  className="flex items-center gap-1 px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-lg bg-blue-50/70 border border-blue-200 text-blue-600 hover:bg-blue-100 text-xs sm:text-sm font-semibold transition cursor-pointer"
                >
                  <Plus className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                  <span>Add Row</span>
                </button>
                <button
                  type="button"
                  onClick={() => removeElement(pageNum, tableBlock.id)}
                  aria-label="Delete table section"
                  className="p-1 sm:p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </button>
              </div>
            </div>

            {/* Table Container with Horizontal Scroll */}
            <div className="overflow-x-auto w-full -mx-1 px-1">
              <table className="min-w-[500px] w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-slate-700 text-xs sm:text-sm font-bold border-y border-slate-200/80">
                    <th className="py-2.5 sm:py-3 px-1 w-8 text-center" />
                    <th className="py-2.5 sm:py-3 px-2 sm:px-3 w-10 sm:w-12 text-center">#</th>
                    <th className="py-2.5 sm:py-3 px-2 sm:px-3">Item Detail</th>
                    <th className="py-2.5 sm:py-3 px-2 sm:px-3 w-16 sm:w-20 text-center">Qty</th>
                    <th className="py-2.5 sm:py-3 px-2 sm:px-3 w-24 sm:w-28 text-center">Unit Price</th>
                    <th className="py-2.5 sm:py-3 px-2 sm:px-3 w-24 sm:w-28 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-xs sm:text-sm divide-y divide-slate-100">
                  {tableBlock.rows.map((row, index) => (
                    <tr key={row.id} className="group/row hover:bg-slate-50/50 transition">
                      {/* Drag Handle */}
                      <td className="py-2 sm:py-2.5 px-1 text-center text-slate-300 group-hover/row:text-slate-500 cursor-grab">
                        <GripVertical className="w-3.5 h-3.5 sm:w-4 sm:h-4 mx-auto" />
                      </td>

                      {/* Row Index */}
                      <td className="py-2 sm:py-2.5 px-2 sm:px-3 text-center font-bold text-slate-700">
                        {index + 1}
                      </td>

                      {/* Item Detail Input */}
                      <td className="py-2 sm:py-2.5 px-2 sm:px-3">
                        <input
                          type="text"
                          value={row.item}
                          onChange={(e) =>
                            updateTableRow(pageNum, tableBlock.id, row.id, "item", e.target.value)
                          }
                          className="bg-blue-50/60 border border-blue-100 rounded-md px-2.5 sm:px-3 py-1 sm:py-1.5 font-medium text-slate-800 w-full text-xs sm:text-sm outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </td>

                      {/* Quantity Input */}
                      <td className="py-2 sm:py-2.5 px-2 sm:px-3 text-center">
                        <input
                          type="number"
                          value={row.qty}
                          onChange={(e) =>
                            updateTableRow(
                              pageNum,
                              tableBlock.id,
                              row.id,
                              "qty",
                              Number(e.target.value) || 0
                            )
                          }
                          className="bg-blue-50/60 border border-blue-100 rounded-md px-2 sm:px-2.5 py-1 sm:py-1.5 font-medium text-slate-800 text-center text-xs sm:text-sm outline-none focus:ring-1 focus:ring-blue-500 w-14 sm:w-16 mx-auto"
                        />
                      </td>

                      {/* Unit Price Input */}
                      <td className="py-2 sm:py-2.5 px-2 sm:px-3 text-center font-medium text-slate-700 text-xs sm:text-sm">
                        <input
                          type="text"
                          value={row.unitPrice}
                          onChange={(e) =>
                            updateTableRow(
                              pageNum,
                              tableBlock.id,
                              row.id,
                              "unitPrice",
                              e.target.value
                            )
                          }
                          className="bg-transparent text-center font-medium text-slate-700 text-xs sm:text-sm outline-none border-b border-transparent hover:border-slate-300 focus:border-blue-500 w-16 sm:w-20"
                        />
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

            {/* Bottom table actions */}
            <div className="pt-1 sm:pt-2 flex items-center justify-between">
              <button
                type="button"
                onClick={() => addTableRow(pageNum, tableBlock.id)}
                className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg bg-blue-50/70 border border-blue-200 text-blue-600 hover:bg-blue-100 text-xs sm:text-sm font-semibold transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Row</span>
              </button>

              <button
                type="button"
                onClick={() => deleteTableRow(pageNum, tableBlock.id)}
                className="text-xs text-slate-400 hover:text-red-500 transition px-2 py-1 cursor-pointer"
              >
                Delete Last Row
              </button>
            </div>
          </div>
        );
      }

      case "text": {
        const textBlock = block as TextBlock;
        return (
          <div
            key={textBlock.id}
            className="border border-slate-200/80 rounded-xl p-3.5 sm:p-4 bg-slate-50/50 hover:bg-white transition relative group shadow-2xs"
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <Type className="w-3.5 h-3.5 text-blue-600" />
                <span>Text Block</span>
              </div>
              <button
                type="button"
                onClick={() => removeElement(pageNum, textBlock.id)}
                className="text-slate-400 hover:text-red-500 p-1 rounded transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <textarea
              value={textBlock.content}
              onChange={(e) => updateTextBlock(pageNum, textBlock.id, e.target.value)}
              rows={2}
              className="w-full text-xs sm:text-sm text-slate-800 bg-transparent outline-none border border-transparent focus:border-blue-300 focus:bg-white rounded-md p-1.5 resize-none leading-relaxed"
              placeholder="Type your notes or document description..."
            />
          </div>
        );
      }

      case "image": {
        const imageBlock = block as ImageBlock;
        return (
          <div
            key={imageBlock.id}
            className="border border-slate-200/80 rounded-xl p-4 bg-white relative group shadow-2xs space-y-3"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <ImageIcon className="w-3.5 h-3.5 text-emerald-600" />
                <span>Image / Illustration</span>
              </div>
              <button
                type="button"
                onClick={() => removeElement(pageNum, imageBlock.id)}
                className="text-slate-400 hover:text-red-500 p-1 rounded transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="w-full h-32 sm:h-40 rounded-lg bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50/40 border border-dashed border-slate-300 flex flex-col items-center justify-center text-slate-400 gap-2">
              <ImageIcon className="w-8 h-8 text-slate-300" />
              <span className="text-xs font-medium text-slate-500">
                {imageBlock.caption || "Image Asset Placeholder"}
              </span>
            </div>
          </div>
        );
      }

      case "shape": {
        const shapeBlock = block as ShapeBlock;
        return (
          <div
            key={shapeBlock.id}
            className="border border-slate-200/80 rounded-xl p-3 bg-white relative group shadow-2xs space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 text-slate-500 text-xs font-semibold uppercase tracking-wider">
                <Shapes className="w-3.5 h-3.5 text-amber-500" />
                <span>Decorative Divider</span>
              </div>
              <button
                type="button"
                onClick={() => removeElement(pageNum, shapeBlock.id)}
                className="text-slate-400 hover:text-red-500 p-1 rounded transition cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <div className="w-full h-2.5 rounded-full bg-gradient-to-r from-blue-600 via-sky-400 to-indigo-500 shadow-xs" />
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div className="w-full flex flex-col select-none min-w-0">
      {/* Viewport Top Bar Controls */}
      <div className="w-full flex items-center justify-between sm:justify-end gap-2 mb-2.5 px-1">
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            disabled={activePage <= 1}
            onClick={() => setActivePage(activePage - 1)}
            aria-label="Previous page"
            className="px-2 py-1 rounded bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition"
          >
            ←
          </button>
          <span className="text-xs font-semibold text-slate-700 bg-white border border-slate-200 px-2.5 py-1 rounded-md shadow-2xs">
            Page {currentPage.pageNumber} of {pages.length}
          </span>
          <button
            type="button"
            disabled={activePage >= pages.length}
            onClick={() => setActivePage(activePage + 1)}
            aria-label="Next page"
            className="px-2 py-1 rounded bg-white border border-slate-200 text-xs font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed shadow-2xs transition"
          >
            →
          </button>
        </div>

        <div className="flex items-center gap-2">
          {/* Zoom Selector */}
          <div className="relative">
            <select
              value={zoomLevel}
              onChange={(e) => setZoomLevel(e.target.value)}
              className="appearance-none flex items-center gap-1.5 pl-2.5 pr-6 sm:pl-3 sm:pr-7 py-1 sm:py-1.5 bg-white border border-slate-200 rounded-md text-xs font-semibold text-slate-700 shadow-2xs hover:bg-slate-50 cursor-pointer outline-none"
            >
              <option value="75%">75%</option>
              <option value="100%">100%</option>
              <option value="125%">125%</option>
              <option value="150%">150%</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          {/* Fullscreen Button */}
          <button
            type="button"
            onClick={toggleFullscreen}
            aria-label="Expand viewport"
            className="p-1 sm:p-1.5 bg-white border border-slate-200 rounded-md text-slate-600 hover:text-slate-900 shadow-2xs hover:bg-slate-50 transition cursor-pointer"
          >
            <Maximize2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>

      {/* Main Document Canvas Sheet */}
      <div
        id="document-sheet"
        className="w-full bg-white rounded-xl shadow-sm border border-slate-200/90 p-4 sm:p-6 md:p-8 lg:p-12 min-h-[580px] sm:min-h-[680px] flex flex-col justify-between transition-all space-y-6"
      >
        <div className="space-y-6 sm:space-y-8">
          {/* Page 1 Header (Company branding & metadata) */}
          {currentPage.pageNumber === 1 ? (
            <>
              {/* Document Header */}
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-0">
                {/* Company Info */}
                <div className="flex items-start gap-3 sm:gap-3.5">
                  <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-lg bg-blue-600 flex items-center justify-center relative overflow-hidden shadow-xs shrink-0">
                    <div className="w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white/25 rounded absolute -top-1 -right-1" />
                    <div className="w-4 h-4 sm:w-5 sm:h-5 bg-white rounded-sm" />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={metadata.companyName}
                      onChange={(e) => setMetadata({ companyName: e.target.value })}
                      className="text-lg sm:text-xl md:text-2xl font-bold text-slate-900 tracking-tight leading-none bg-transparent outline-none border-b border-transparent hover:border-slate-200 focus:border-blue-500 w-full"
                    />
                    <input
                      type="text"
                      value={metadata.companyTagline}
                      onChange={(e) => setMetadata({ companyTagline: e.target.value })}
                      className="text-xs sm:text-sm text-slate-400 font-normal mt-1 sm:mt-1.5 bg-transparent outline-none border-b border-transparent hover:border-slate-200 focus:border-blue-500 w-full"
                    />
                  </div>
                </div>

                {/* Document Title */}
                <div>
                  <input
                    type="text"
                    value={metadata.documentTitle}
                    onChange={(e) => setMetadata({ documentTitle: e.target.value })}
                    className="text-lg sm:text-2xl md:text-3xl font-black tracking-wider text-slate-900 uppercase bg-transparent outline-none border-b border-transparent hover:border-slate-200 focus:border-blue-500 sm:text-right"
                  />
                </div>
              </div>

              {/* Issuer / Client / Metadata Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 pt-2 border-t sm:border-t-0 border-slate-100">
                {/* Issuer Info */}
                <div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 block tracking-wider uppercase">
                    ISSUER/
                  </span>
                  <input
                    type="text"
                    value={metadata.issuerDetails}
                    onChange={(e) => setMetadata({ issuerDetails: e.target.value })}
                    className="text-xs sm:text-sm md:text-base font-semibold text-slate-800 mt-0.5 bg-transparent outline-none border-b border-transparent hover:border-slate-200 focus:border-blue-500 w-full"
                  />
                </div>

                {/* Client Info */}
                <div>
                  <span className="text-[10px] sm:text-xs font-bold text-slate-400 block sm:hidden tracking-wider uppercase">
                    CLIENT/
                  </span>
                  <input
                    type="text"
                    value={metadata.clientDetails}
                    onChange={(e) => setMetadata({ clientDetails: e.target.value })}
                    className="text-xs sm:text-sm md:text-base font-semibold text-slate-800 mt-0.5 sm:mt-4 bg-transparent outline-none border-b border-transparent hover:border-slate-200 focus:border-blue-500 w-full"
                  />
                </div>

                {/* Number & Date */}
                <div className="sm:text-right space-y-0.5">
                  <div className="flex items-center sm:justify-end gap-1">
                    <span className="text-xs sm:text-sm font-bold text-slate-800">No/Date:</span>
                    <input
                      type="text"
                      value={metadata.documentNumber}
                      onChange={(e) => setMetadata({ documentNumber: e.target.value })}
                      className="text-xs sm:text-sm text-slate-600 font-medium bg-transparent outline-none border-b border-transparent hover:border-slate-200 focus:border-blue-500 w-24 sm:text-right"
                    />
                  </div>
                  <input
                    type="text"
                    value={metadata.documentDate}
                    onChange={(e) => setMetadata({ documentDate: e.target.value })}
                    className="text-xs sm:text-sm text-slate-600 font-medium bg-transparent outline-none border-b border-transparent hover:border-slate-200 focus:border-blue-500 sm:text-right w-24"
                  />
                </div>
              </div>
            </>
          ) : (
            /* Subsequent Page Compact Header */
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded bg-blue-600 flex items-center justify-center text-white text-[10px] font-bold">
                  {currentPage.pageNumber}
                </div>
                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  {metadata.companyName} — Continuation Sheet
                </span>
              </div>
              <span className="text-xs font-medium text-slate-400">
                Ref: {metadata.documentNumber}
              </span>
            </div>
          )}

          {/* Dynamic Blocks Container */}
          <div className="space-y-4">
            {currentPage.blocks.length > 0 ? (
              currentPage.blocks.map((block) => renderBlock(block, currentPage.pageNumber))
            ) : (
              <div className="py-12 border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center p-6 space-y-3 bg-slate-50/40">
                <FileText className="w-8 h-8 text-slate-300" />
                <div className="space-y-1">
                  <p className="text-xs sm:text-sm font-semibold text-slate-600">
                    This page is currently empty
                  </p>
                  <p className="text-[11px] sm:text-xs text-slate-400">
                    Click Text Block, Simple Table, Image, or Shape from the left Toolbox to add elements.
                  </p>
                </div>
                <div className="flex items-center gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => addElement("table")}
                    className="px-3 py-1.5 rounded-lg bg-blue-50 text-blue-600 text-xs font-semibold hover:bg-blue-100 transition cursor-pointer"
                  >
                    + Add Table
                  </button>
                  <button
                    type="button"
                    onClick={() => addElement("text")}
                    className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition cursor-pointer"
                  >
                    + Add Text
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Canvas Footer */}
        <div className="pt-6 sm:pt-8 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-3 sm:gap-0 border-t border-slate-100 mt-6 sm:mt-8">
          <p className="text-[11px] sm:text-xs text-slate-400 italic text-center sm:text-left">
            Page {currentPage.pageNumber} of {pages.length} — Full PDF layout rendered on export.
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
