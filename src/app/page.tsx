"use client";

import React, { useState } from "react";
import { Header } from "@/components/layout/Header";
import { TabBar } from "@/components/layout/TabBar";
import { ComponentToolbox } from "@/features/editor/components/ComponentToolbox";
import { EditorCanvas } from "@/features/editor/components/EditorCanvas";
import { PropertiesPanel } from "@/features/editor/components/PropertiesPanel";
import { SavedTemplatesPanel } from "@/features/templates/components/SavedTemplatesPanel";

export default function DocumentEditorPage() {
  const [isToolboxOpen, setIsToolboxOpen] = useState(false);

  const scrollToProperties = () => {
    const el = document.getElementById("properties-panel");
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-[#f0f4f9] overflow-hidden">
      {/* Top Application Header */}
      <Header
        onToggleToolbox={() => setIsToolboxOpen((prev) => !prev)}
        onToggleProperties={scrollToProperties}
      />

      {/* Multi-Template Tab Bar */}
      <TabBar />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden min-h-0 relative">
        {/* Desktop Left Sidebar: Components & Pages (Full Height) */}
        <div className="hidden lg:flex shrink-0">
          <ComponentToolbox />
        </div>

        {/* Mobile Left Sidebar Drawer with Backdrop */}
        {isToolboxOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
              onClick={() => setIsToolboxOpen(false)}
            />

            {/* Slide-out Drawer */}
            <div className="relative z-10 h-full flex flex-col shadow-2xl">
              <ComponentToolbox onClose={() => setIsToolboxOpen(false)} />
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
            <PropertiesPanel />
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

