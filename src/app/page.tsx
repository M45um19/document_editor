"use client";

import React from "react";
import { Header } from "@/components/layout/Header";
import { TabBar } from "@/components/layout/TabBar";
import { ComponentToolbox } from "@/features/editor/components/ComponentToolbox";
import { EditorCanvas } from "@/features/editor/components/EditorCanvas";
import { PropertiesPanel } from "@/features/editor/components/PropertiesPanel";
import { SavedTemplatesPanel } from "@/features/templates/components/SavedTemplatesPanel";

export default function DocumentEditorPage() {
  return (
    <div className="h-screen w-screen flex flex-col bg-[#f0f4f9] overflow-hidden">
      {/* Top Application Header */}
      <Header />

      {/* Multi-Template Tab Bar */}
      <TabBar />

      {/* Main Workspace */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Sidebar: Components & Pages (Full Height) */}
        <ComponentToolbox />

        {/* Scrollable Workspace: Canvas + Properties (Equal Height) followed by Saved Templates */}
        <main className="flex-1 overflow-y-auto min-w-0 bg-[#f0f4f9] flex flex-col">
          {/* Upper Section: Middle Bar (EditorCanvas) & Right Bar (PropertiesPanel) side-by-side with equal height */}
          <div className="flex items-stretch min-w-0 border-b border-slate-200/80 bg-[#f0f4f9]">
            {/* Middle Bar: Document Canvas */}
            <div className="flex-1 px-4 sm:px-6 md:px-8 pt-2.5 pb-6 flex flex-col items-center min-w-0">
              <EditorCanvas />
            </div>

            {/* Right Bar: Properties & Data Settings (Same Height as Editor Canvas) */}
            <PropertiesPanel />
          </div>

          {/* Bottom Section: Saved Templates Panel (Starts after Editor Canvas & Properties Panel finish, spanning full width of both) */}
          <div className="px-4 sm:px-6 md:px-8 py-6">
            <SavedTemplatesPanel />
          </div>
        </main>
      </div>
    </div>
  );
}
