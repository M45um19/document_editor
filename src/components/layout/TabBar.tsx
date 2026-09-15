"use client";

import React from "react";
import { FileText, X, Plus } from "lucide-react";
import { TemplateTab } from "@/hooks/useTabBar";

export type { TemplateTab };

interface TabBarProps {
  tabs: TemplateTab[];
  activeTabId: string;
  onSelectTab: (id: string) => void;
  onAddTab: () => void;
  onCloseTab: (id: string) => void;
}

export function TabBar({
  tabs,
  activeTabId,
  onSelectTab,
  onAddTab,
  onCloseTab,
}: TabBarProps) {
  return (
    <div className="w-full h-10 sm:h-11 2xl:h-12 bg-[#eef2f7] border-b border-slate-200 px-2 sm:px-3 flex items-end shrink-0 select-none overflow-x-auto scrollbar-none">
      <div className="flex items-end gap-1 sm:gap-1.5 min-w-0">
        {tabs.map((tab) => {
          const isActive = tab.id === activeTabId;
          return (
            <div
              key={tab.id}
              onClick={() => onSelectTab(tab.id)}
              className={`flex items-center gap-1.5 sm:gap-2.5 px-3 sm:px-6 2xl:px-8 h-8 sm:h-9 2xl:h-10 rounded-t-md text-xs sm:text-sm font-semibold transition shrink-0 cursor-pointer ${
                isActive
                  ? "bg-white text-blue-600 border border-slate-200 border-b-white shadow-xs relative top-[1px]"
                  : "text-slate-600 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              <FileText
                className={`w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 ${
                  isActive ? "text-blue-600" : "text-slate-500"
                }`}
              />
              <span className="px-1 whitespace-nowrap max-w-[120px] sm:max-w-none truncate">
                {tab.name}
              </span>
              <button
                type="button"
                aria-label={`Close ${tab.name}`}
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(tab.id);
                }}
                className={`ml-1 rounded p-0.5 transition ${
                  isActive
                    ? "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-300/60"
                }`}
              >
                <X className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
              </button>
            </div>
          );
        })}

        {/* Add Tab Button */}
        <button
          type="button"
          onClick={onAddTab}
          aria-label="Add new template tab"
          className="h-7 w-7 sm:h-8 sm:w-8 flex items-center justify-center rounded-md hover:bg-slate-200/70 text-slate-600 transition mb-0.5 ml-1 shrink-0 cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
        </button>
      </div>
    </div>
  );
}
