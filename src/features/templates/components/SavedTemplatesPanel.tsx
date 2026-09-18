"use client";

import React, { useState } from "react";
import { Folder, Save, FileText, Trash2, CheckCircle2 } from "lucide-react";
import { useTemplatesState } from "../hooks/useTemplatesState";
import { useEditorState } from "@/features/editor/hooks/useEditorState";
import { SavedTemplateItem } from "../types";

export function SavedTemplatesPanel() {
  const templates = useTemplatesState((s) => s.templates);
  const activeTemplateId = useTemplatesState((s) => s.activeTemplateId);
  const selectTemplate = useTemplatesState((s) => s.selectTemplate);
  const deleteTemplate = useTemplatesState((s) => s.deleteTemplate);
  const saveCurrentTemplate = useTemplatesState((s) => s.saveCurrentTemplate);
  const getTemplateData = useTemplatesState((s) => s.getTemplateData);
  const saveTemplateData = useTemplatesState((s) => s.saveTemplateData);

  const metadata = useEditorState((s) => s.metadata);
  const pages = useEditorState((s) => s.pages);
  const paperSize = useEditorState((s) => s.paperSize);
  const loadTemplate = useEditorState((s) => s.loadTemplate);

  const [notification, setNotification] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setNotification(msg);
    setTimeout(() => {
      setNotification(null);
    }, 3000);
  };

  const handleSaveCurrentAsTemplate = () => {
    const activeTemplate = templates.find((t) => t.id === activeTemplateId);
    saveCurrentTemplate({ metadata, pages, paperSize });
    showNotification(`Saved "${activeTemplate?.name || 'Current Template'}" to LocalStorage!`);
  };

  const handleOpenTemplate = (template: SavedTemplateItem) => {
    // Save current active template before switching
    saveTemplateData(activeTemplateId, { metadata, pages, paperSize });

    // Select and load target template
    selectTemplate(template.id);
    const templateData = getTemplateData(template.id);
    loadTemplate(templateData, template.id);

    showNotification(`Opened "${template.name}"`);

    // Scroll to canvas
    const canvasSheet = document.getElementById("document-sheet");
    if (canvasSheet) {
      canvasSheet.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleDeleteTemplate = (id: string, name: string) => {
    const nextActiveId = deleteTemplate(id);
    if (id === activeTemplateId) {
      const nextData = getTemplateData(nextActiveId);
      loadTemplate(nextData, nextActiveId);
    }
    showNotification(`Deleted "${name}"`);
  };

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
                All saved templates in LocalStorage ({templates.length} total). Create new templates using + in TabBar.
              </p>
            </div>
          </div>

          {/* Save Current as Template Button */}
          <div className="flex items-center gap-2">
            {notification && (
              <div className="flex items-center gap-1 text-xs text-emerald-600 font-semibold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{notification}</span>
              </div>
            )}
            <button
              type="button"
              onClick={handleSaveCurrentAsTemplate}
              className="flex items-center justify-center gap-1.5 px-3.5 sm:px-4 py-2 sm:py-2.5 rounded-lg border border-blue-500 text-blue-600 bg-white hover:bg-blue-50/70 hover:border-blue-600 text-xs font-semibold transition shadow-2xs w-full sm:w-auto cursor-pointer"
            >
              <Save className="w-3.5 h-3.5 text-blue-600" />
              <span>Save as Current Template</span>
            </button>
          </div>
        </div>

        {/* Template Cards List */}
        <div className="space-y-2">
          {templates.map((template) => {
            const isActive = template.id === activeTemplateId;
            return (
              <div
                key={template.id}
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
                    onClick={() => handleOpenTemplate(template)}
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
                    onClick={() => handleDeleteTemplate(template.id, template.name)}
                    aria-label={`Delete ${template.name}`}
                    className="p-1.5 rounded-md text-slate-400 hover:text-red-600 hover:bg-red-50 transition cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
