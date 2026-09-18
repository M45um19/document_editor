"use client";

import React, { useEffect } from "react";
import { Header } from "@/components/layout/Header";
import { TabBar } from "@/components/layout/TabBar";
import { ComponentToolbox } from "@/features/editor/components/ComponentToolbox";
import { EditorCanvas } from "@/features/editor/components/EditorCanvas";
import { PropertiesPanel } from "@/features/editor/components/PropertiesPanel";
import { SavedTemplatesPanel } from "@/features/templates/components/SavedTemplatesPanel";
import { useNavbar } from "@/hooks/useNavbar";
import { useMounted } from "@/hooks/useMounted";
import { useEditorState } from "@/features/editor/hooks/useEditorState";
import { useTemplatesState } from "@/features/templates/hooks/useTemplatesState";

export default function DocumentEditorPage() {
  const isMounted = useMounted();

  // Navigation & Dialog Store
  const isToolboxOpen = useNavbar((s) => s.isToolboxOpen);
  const toggleToolbox = useNavbar((s) => s.toggleToolbox);
  const setToolboxOpen = useNavbar((s) => s.setToolboxOpen);
  const scrollToProperties = useNavbar((s) => s.scrollToProperties);

  // Templates Management Store (Single source of truth for saved templates & tabs)
  const templates = useTemplatesState((s) => s.templates);
  const activeTemplateId = useTemplatesState((s) => s.activeTemplateId);
  const selectTemplate = useTemplatesState((s) => s.selectTemplate);
  const createTemplate = useTemplatesState((s) => s.createTemplate);
  const deleteTemplate = useTemplatesState((s) => s.deleteTemplate);
  const getTemplateData = useTemplatesState((s) => s.getTemplateData);
  const saveTemplateData = useTemplatesState((s) => s.saveTemplateData);

  // Editor Store
  const metadata = useEditorState((s) => s.metadata);
  const pages = useEditorState((s) => s.pages);
  const paperSize = useEditorState((s) => s.paperSize);
  const loadTemplate = useEditorState((s) => s.loadTemplate);
  const saveCurrentTemplate = useEditorState((s) => s.saveCurrentTemplate);

  // Restore the active template data from its distinct localStorage slot on initial client mount
  useEffect(() => {
    if (isMounted && activeTemplateId) {
      const activeData = getTemplateData(activeTemplateId);
      loadTemplate(activeData, activeTemplateId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMounted]);

  // Handle switching tabs
  const handleSelectTab = (tabId: string) => {
    if (tabId === activeTemplateId) return;
    // Auto-save current template data to its distinct localStorage place
    saveTemplateData(activeTemplateId, { metadata, pages, paperSize });
    // Switch active template
    selectTemplate(tabId);
    // Load target template data from its distinct localStorage place
    const targetData = getTemplateData(tabId);
    loadTemplate(targetData, tabId);
  };

  // Handle creating a new template via TabBar '+' button ONLY
  const handleAddTab = () => {
    // Auto-save current template first
    saveTemplateData(activeTemplateId, { metadata, pages, paperSize });
    // Create new template with dedicated localStorage slot
    const { newTemplate, data } = createTemplate();
    // Load the fresh template into the canvas
    loadTemplate(data, newTemplate.id);
  };

  // Handle closing a template tab
  const handleCloseTab = (tabId: string) => {
    const nextActiveId = deleteTemplate(tabId);
    if (tabId === activeTemplateId) {
      const nextData = getTemplateData(nextActiveId);
      loadTemplate(nextData, nextActiveId);
    }
  };

  if (!isMounted) {
    return (
      <div className="h-screen h-[100dvh] w-screen flex flex-col bg-[#f0f4f9] overflow-hidden">
        {/* Skeleton shell for SSR safety */}
        <div className="w-full h-14 sm:h-16 lg:h-16 2xl:h-20 bg-white border-b border-slate-200 px-2.5 sm:px-5 lg:px-7 2xl:px-10 flex items-center justify-between z-20 shrink-0" />
        <div className="w-full h-10 sm:h-11 2xl:h-12 bg-[#eef2f7] border-b border-slate-200 shrink-0" />
        <div className="flex-1 flex overflow-hidden">
          <div className="hidden lg:block w-56 xl:w-64 bg-white border-r border-slate-200/90 shrink-0" />
          <div className="flex-1 bg-[#f0f4f9] p-4 sm:p-6" />
        </div>
      </div>
    );
  }

  const tabs = templates.map((t) => ({ id: t.id, name: t.name }));

  return (
    <div className="h-screen h-[100dvh] w-screen flex flex-col bg-[#f0f4f9] overflow-hidden">
      {/* Top Application Header */}
      <Header
        onToggleToolbox={toggleToolbox}
        onToggleProperties={scrollToProperties}
        onSave={saveCurrentTemplate}
      />

      {/* Multi-Template Tab Bar (Synchronized with saved templates list) */}
      <TabBar
        tabs={tabs}
        activeTabId={activeTemplateId}
        onSelectTab={handleSelectTab}
        onAddTab={handleAddTab}
        onCloseTab={handleCloseTab}
      />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* Desktop Left Sidebar: Components & Pages (Full Height) */}
        <div className="hidden lg:flex shrink-0">
          <ComponentToolbox />
        </div>

        {/* Mobile Left Sidebar Drawer with Backdrop */}
        {isToolboxOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex h-full h-[100dvh] w-full">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
              onClick={() => setToolboxOpen(false)}
            />

            {/* Slide-out Drawer */}
            <div className="relative z-10 h-full h-[100dvh] max-w-[85vw] flex flex-col shadow-2xl">
              <ComponentToolbox onClose={() => setToolboxOpen(false)} />
            </div>
          </div>
        )}

        {/* Scrollable Workspace: Canvas + Properties followed by Saved Templates */}
        <main className="flex-1 overflow-y-auto min-w-0 bg-[#f0f4f9] flex flex-col">
          {/* Upper Section: Canvas & Properties Panel */}
          <div className="flex flex-col xl:flex-row items-stretch min-w-0 border-b border-slate-200/80 bg-[#f0f4f9]">
            {/* Middle Bar: Document Canvas */}
            <div className="flex-1 px-3 sm:px-6 md:px-8 2xl:px-10 pt-2.5 pb-6 flex flex-col min-w-0">
              <EditorCanvas />
            </div>

            {/* Right Bar: Properties & Data Settings */}
            <div className="w-full xl:w-auto px-3 sm:px-6 md:px-8 xl:pl-0 xl:pr-6 2xl:pr-10 pt-2.5 pb-6 flex flex-col min-w-0">
              <PropertiesPanel />
            </div>
          </div>

          {/* Bottom Section: Saved Templates Panel */}
          <div className="px-3 sm:px-6 md:px-8 py-4 sm:py-6">
            <SavedTemplatesPanel />
          </div>
        </main>
      </div>
    </div>
  );
}
