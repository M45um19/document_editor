"use client";

import React, { useState } from "react";
import {
  FileText,
  Undo2,
  Redo2,
  Eye,
  Save,
  Download,
  PanelLeft,
  SlidersHorizontal,
  Check,
  Loader2,
} from "lucide-react";
import { useNavbar } from "@/hooks/useNavbar";
import { useEditorState } from "@/features/editor/hooks/useEditorState";
import { exportDocumentToPdf } from "@/features/export/services/pdfExportService";

interface HeaderProps {
  onToggleToolbox?: () => void;
  onToggleProperties?: () => void;
  onSave?: () => void;
  onPreview?: () => void;
}

export function Header({
  onToggleToolbox,
  onToggleProperties,
  onSave,
  onPreview,
}: HeaderProps) {
  const openPreview = useNavbar((s) => s.openPreview);
  const metadata = useEditorState((s) => s.metadata);
  const setMetadata = useEditorState((s) => s.setMetadata);
  const pages = useEditorState((s) => s.pages);
  const paperSize = useEditorState((s) => s.paperSize);

  const [isSaved, setIsSaved] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const handleSave = () => {
    if (onSave) {
      onSave();
    }
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
    }, 2500);
  };

  const handlePreview = () => {
    if (onPreview) {
      onPreview();
    } else {
      openPreview();
    }
  };

  const handleDownloadPdf = async () => {
    setIsExporting(true);
    try {
      await exportDocumentToPdf({
        fileName: metadata.documentTitle || "Document_Project",
        paperSize,
        pages,
        metadata,
      });
    } catch (err) {
      console.error("Export error", err);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <header className="w-full h-14 sm:h-16 lg:h-16 2xl:h-20 bg-white border-b border-slate-200 px-2.5 sm:px-5 lg:px-7 2xl:px-10 flex items-center justify-between z-20 shrink-0 select-none transition-all duration-200">
      {/* Left Section: Mobile Toolbox Toggle, Logo, App Title, Project Name, Undo/Redo */}
      <div className="flex items-center gap-2 sm:gap-3.5 lg:gap-4 2xl:gap-6 min-w-0 h-full py-2">
        {/* Mobile Toolbox Toggle Button */}
        <button
          type="button"
          onClick={onToggleToolbox}
          aria-label="Toggle Components Toolbox"
          className="lg:hidden h-9 w-9 sm:h-10 sm:w-10 flex items-center justify-center rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition shrink-0 cursor-pointer"
        >
          <PanelLeft className="w-5 h-5" />
        </button>

        {/* App Logo */}
        <div className="h-8.5 w-8.5 sm:h-9.5 sm:w-9.5 2xl:h-12 2xl:w-12 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20 shrink-0">
          <FileText className="w-4.5 h-4.5 sm:w-5 sm:h-5 2xl:w-6 2xl:h-6" />
        </div>

        {/* Application Title */}
        <h1 className="text-sm sm:text-base md:text-lg 2xl:text-xl font-bold text-slate-900 tracking-tight whitespace-nowrap truncate">
          Document Editor <span className="font-semibold text-slate-400 hidden xs:inline text-xs sm:text-sm 2xl:text-base">(PoC)</span>
        </h1>

        {/* Project Name Field */}
        <div className="hidden sm:flex flex-col justify-center h-8.5 sm:h-9.5 2xl:h-12 bg-slate-50 border border-slate-200 rounded-lg px-2.5 sm:px-3 2xl:px-4 min-w-[130px] md:min-w-[170px] lg:min-w-[200px] 2xl:min-w-[240px]">
          <span className="text-[9px] 2xl:text-xs font-semibold text-slate-400 uppercase tracking-wider leading-none mb-0.5">
            Project Name
          </span>
          <input
            type="text"
            value={metadata.documentTitle || "Document Project V1"}
            onChange={(e) => setMetadata({ documentTitle: e.target.value })}
            className="text-xs 2xl:text-sm font-semibold text-slate-800 bg-transparent outline-none focus:text-blue-600 truncate leading-none"
            placeholder="Project Name"
          />
        </div>

        {/* Undo / Redo */}
        <div className="hidden md:flex items-center gap-1 2xl:gap-1.5 h-8.5 sm:h-9.5 2xl:h-12 text-slate-500 pl-1">
          <button
            type="button"
            disabled={true}
            suppressHydrationWarning
            aria-label="Undo"
            className="h-8.5 w-8.5 2xl:h-10 2xl:w-10 flex items-center justify-center rounded-lg transition text-slate-300 hover:text-slate-500 hover:bg-slate-100 disabled:hover:bg-transparent disabled:text-slate-300 cursor-not-allowed"
          >
            <Undo2 className="w-4 h-4 2xl:w-5 2xl:h-5" />
          </button>
          <button
            type="button"
            disabled={true}
            suppressHydrationWarning
            aria-label="Redo"
            className="h-8.5 w-8.5 2xl:h-10 2xl:w-10 flex items-center justify-center rounded-lg transition text-slate-300 hover:text-slate-500 hover:bg-slate-100 disabled:hover:bg-transparent disabled:text-slate-300 cursor-not-allowed"
          >
            <Redo2 className="w-4 h-4 2xl:w-5 2xl:h-5" />
          </button>
        </div>
      </div>

      {/* Right Section: Mobile Jump Button, Preview, Save, Download PDF */}
      <div className="flex items-center gap-1.5 sm:gap-2.5 2xl:gap-3.5 shrink-0 h-full py-2">
        {/* Mobile Properties Panel Button */}
        {onToggleProperties && (
          <button
            type="button"
            onClick={onToggleProperties}
            aria-label="Toggle Properties Panel"
            className="xl:hidden h-8.5 sm:h-9.5 flex items-center gap-1.5 px-2.5 sm:px-3 rounded-lg border border-slate-200 bg-white text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:border-slate-300 transition shadow-2xs cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-600" />
            <span className="hidden sm:inline">Properties</span>
          </button>
        )}

        {/* Preview Button */}
        <button
          type="button"
          onClick={handlePreview}
          aria-label="Preview Document"
          className="hidden sm:flex items-center gap-1.5 2xl:gap-2 h-8.5 sm:h-9.5 2xl:h-11 px-3 sm:px-3.5 2xl:px-4.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 hover:border-slate-300 text-xs 2xl:text-sm font-semibold text-slate-700 active:bg-slate-100 transition shadow-2xs cursor-pointer"
        >
          <Eye className="w-3.5 h-3.5 sm:w-4 sm:h-4 2xl:w-4.5 2xl:h-4.5 text-slate-500" />
          <span className="hidden md:inline">Preview</span>
        </button>

        {/* Save Button */}
        <button
          type="button"
          onClick={handleSave}
          aria-label="Save Document"
          className={`h-8.5 sm:h-9.5 2xl:h-11 flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3.5 2xl:px-4.5 rounded-lg border text-xs 2xl:text-sm font-semibold transition shadow-2xs cursor-pointer ${
            isSaved
              ? "border-emerald-300 bg-emerald-50 text-emerald-700 ring-2 ring-emerald-500/20 shadow-emerald-500/10"
              : "border-blue-200 bg-blue-50/60 text-blue-600 hover:bg-blue-100/70 hover:border-blue-300"
          }`}
        >
          {isSaved ? (
            <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 2xl:w-4.5 2xl:h-4.5 text-emerald-600 stroke-[2.5]" />
          ) : (
            <Save className="w-3.5 h-3.5 sm:w-4 sm:h-4 2xl:w-4.5 2xl:h-4.5 text-blue-600" />
          )}
          <span className="hidden md:inline">{isSaved ? "Saved!" : "Save"}</span>
        </button>

        {/* Download PDF Button */}
        <button
          type="button"
          disabled={isExporting}
          onClick={handleDownloadPdf}
          aria-label="Download PDF"
          className="h-8.5 sm:h-9.5 2xl:h-11 flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 2xl:px-5 rounded-lg bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-xs 2xl:text-sm font-semibold text-white transition shadow-sm shadow-blue-600/20 cursor-pointer disabled:opacity-60"
        >
          {isExporting ? (
            <Loader2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 2xl:w-4.5 2xl:h-4.5 text-white animate-spin" />
          ) : (
            <Download className="w-3.5 h-3.5 sm:w-4 sm:h-4 2xl:w-4.5 2xl:h-4.5 text-white" />
          )}
          <span className="hidden md:inline">{isExporting ? "Exporting..." : "Download PDF"}</span>
        </button>
      </div>
    </header>
  );
}
