"use client";

import React, { useState, useEffect } from "react";
import {
  X,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { useNavbar } from "@/hooks/useNavbar";
import { useEditorState } from "@/features/editor/hooks/useEditorState";
import { PAPER_SIZES } from "@/features/editor/types";
import { CleanDocumentSheet } from "./CleanDocumentSheet";
import { exportDocumentToPdf } from "@/features/export/services/pdfExportService";

export function DocumentPreviewModal() {
  const isPreviewOpen = useNavbar((s) => s.isPreviewOpen);
  const closePreview = useNavbar((s) => s.closePreview);

  const pages = useEditorState((s) => s.pages);
  const metadata = useEditorState((s) => s.metadata);
  const paperSize = useEditorState((s) => s.paperSize);

  const [previewMode, setPreviewMode] = useState<"continuous" | "single">("continuous");
  const [currentPageIdx, setCurrentPageIdx] = useState(0);
  const [isExporting, setIsExporting] = useState(false);

  const paperConfig = PAPER_SIZES[paperSize] || PAPER_SIZES.tabloid;

  // Handle ESC key to close modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isPreviewOpen) {
        closePreview();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isPreviewOpen, closePreview]);

  if (!isPreviewOpen) return null;

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    try {
      await exportDocumentToPdf({
        fileName: `${metadata.documentTitle || "Document"}`,
        paperSize,
        pages,
        metadata,
      });
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex flex-col overflow-hidden animate-in fade-in duration-200">
      {/* Top Floating Control Bar */}
      <header className="h-16 bg-white/95 backdrop-blur-md border-b border-slate-200 px-4 sm:px-8 flex items-center justify-between z-30 shrink-0 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-center text-blue-600">
            <Eye className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold text-slate-900 leading-tight">
              {metadata.documentTitle || "Document Preview"}
            </h2>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="font-semibold uppercase text-blue-600 bg-blue-50 px-1.5 py-0.2 rounded text-[10px] border border-blue-200">
                {paperConfig.label}
              </span>
              <span>•</span>
              <span>
                {pages.length} {pages.length === 1 ? "Page" : "Pages"}
              </span>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Mode Switcher */}
          <div className="hidden sm:flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setPreviewMode("continuous")}
              className={`px-3 py-1.5 rounded-md transition ${
                previewMode === "continuous"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900 cursor-pointer"
              }`}
            >
              All Pages
            </button>
            <button
              type="button"
              onClick={() => setPreviewMode("single")}
              className={`px-3 py-1.5 rounded-md transition ${
                previewMode === "single"
                  ? "bg-white text-slate-900 shadow-2xs font-bold"
                  : "text-slate-600 hover:text-slate-900 cursor-pointer"
              }`}
            >
              Single Page
            </button>
          </div>

          {/* Page Selector for Single Mode */}
          {previewMode === "single" && pages.length > 1 && (
            <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 text-xs">
              <button
                type="button"
                disabled={currentPageIdx === 0}
                onClick={() => setCurrentPageIdx((p) => Math.max(0, p - 1))}
                className="p-1 hover:bg-slate-200 rounded disabled:opacity-30 cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <span className="font-bold text-slate-700 px-1">
                {currentPageIdx + 1} / {pages.length}
              </span>
              <button
                type="button"
                disabled={currentPageIdx >= pages.length - 1}
                onClick={() => setCurrentPageIdx((p) => Math.min(pages.length - 1, p + 1))}
                className="p-1 hover:bg-slate-200 rounded disabled:opacity-30 cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}


          {/* Download PDF */}
          <button
            type="button"
            disabled={isExporting}
            onClick={handleDownloadPdf}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-xs font-semibold text-white transition shadow-sm shadow-blue-600/20 cursor-pointer disabled:opacity-60"
          >
            {isExporting ? (
              <Loader2 className="w-3.5 h-3.5 text-white animate-spin" />
            ) : (
              <Download className="w-3.5 h-3.5 text-white" />
            )}
            <span>{isExporting ? "Exporting..." : "Download PDF"}</span>
          </button>

          {/* Close Button */}
          <button
            type="button"
            onClick={closePreview}
            className="h-8.5 w-8.5 flex items-center justify-center rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition cursor-pointer"
            title="Close Preview (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </header>

      {/* Main Preview Viewport */}
      <main className="flex-1 overflow-y-auto p-4 sm:p-8 md:p-12 flex flex-col items-center">
        <div id="preview-sheet-container" className="w-full max-w-5xl flex flex-col items-center gap-8">
          {previewMode === "continuous" ? (
            pages.map((p, idx) => (
              <CleanDocumentSheet
                key={p.pageNumber}
                id={`preview-page-${idx}`}
                page={p}
                pageIndex={idx}
                totalPages={pages.length}
                metadata={metadata}
                paperSize={paperSize}
                className="rounded-xl shadow-2xl border border-slate-200/80"
              />
            ))
          ) : (
            <CleanDocumentSheet
              key={pages[currentPageIdx]?.pageNumber || 1}
              id={`preview-page-${currentPageIdx}`}
              page={pages[currentPageIdx] || pages[0]}
              pageIndex={currentPageIdx}
              totalPages={pages.length}
              metadata={metadata}
              paperSize={paperSize}
              className="rounded-xl shadow-2xl border border-slate-200/80"
            />
          )}
        </div>
      </main>
    </div>
  );
}
