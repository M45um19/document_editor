"use client";

import React, { useState } from "react";
import { Folder, Save, CheckCircle2 } from "lucide-react";
import { useTemplatesState } from "../../hooks/useTemplatesState";
import { useEditorState } from "@/features/editor/hooks/useEditorState";
import { SavedTemplateItem, SavedTemplatesPanelProps } from "../../types";
import { TemplateCard } from "../cards/TemplateCard";

export function SavedTemplatesPanel({ className = "" }: SavedTemplatesPanelProps = {}) {
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
    <div className={`w-full bg-white rounded-xl border border-slate-200/90 p-4 sm:p-5 shadow-xs select-none ${className}`}>
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
              <TemplateCard
                key={template.id}
                template={template}
                isActive={isActive}
                onOpen={handleOpenTemplate}
                onDelete={handleDeleteTemplate}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
