"use client";

import React from "react";
import {
  MousePointer2,
  Type,
  Table as TableIcon,
  Image as ImageIcon,
  Shapes,
  Plus,
  X,
} from "lucide-react";
import { useEditorState } from "../../hooks/useEditorState";
import { ToolType, ComponentToolboxProps } from "../../types";

export function ComponentToolbox({ onClose, className = "" }: ComponentToolboxProps) {
  const activeTool = useEditorState((s) => s.activeTool);
  const setActiveTool = useEditorState((s) => s.setActiveTool);
  const addElement = useEditorState((s) => s.addElement);
  const pages = useEditorState((s) => s.pages);
  const activePage = useEditorState((s) => s.activePage);
  const setActivePage = useEditorState((s) => s.setActivePage);
  const addPage = useEditorState((s) => s.addPage);

  const tools: { id: ToolType; label: string; icon: React.ReactNode }[] = [
    {
      id: "select",
      label: "Select",
      icon: <MousePointer2 className="w-4 h-4 2xl:w-4.5 2xl:h-4.5 fill-current shrink-0" />,
    },
    {
      id: "text",
      label: "Text Block",
      icon: <Type className="w-4 h-4 2xl:w-4.5 2xl:h-4.5 text-slate-400 shrink-0" />,
    },
    {
      id: "table",
      label: "Simple Table",
      icon: <TableIcon className="w-4 h-4 2xl:w-4.5 2xl:h-4.5 text-slate-400 shrink-0" />,
    },
    {
      id: "image",
      label: "Image",
      icon: <ImageIcon className="w-4 h-4 2xl:w-4.5 2xl:h-4.5 text-slate-400 shrink-0" />,
    },
    {
      id: "shape",
      label: "Shape",
      icon: <Shapes className="w-4 h-4 2xl:w-4.5 2xl:h-4.5 text-slate-400 shrink-0" />,
    },
  ];

  const handleToolClick = (toolId: ToolType) => {
    if (toolId === "select") {
      setActiveTool("select");
    } else {
      addElement(toolId);
    }
  };

  return (
    <aside
      className={`h-full min-h-full w-72 sm:w-72 lg:w-60 xl:w-64 2xl:w-72 3xl:w-80 bg-[#081225] text-slate-300 flex flex-col justify-between shrink-0 p-3.5 sm:p-4 2xl:p-5 select-none border-r border-slate-800 transition-all duration-200 overflow-y-auto ${className}`}
    >
      {/* Top Section: Header with mobile close button, Components list, and quick actions */}
      <div className="space-y-4 2xl:space-y-6">
        <div>
          <div className="flex items-center justify-between mb-2.5 2xl:mb-3.5 px-1">
            <h2 className="text-xs 2xl:text-sm font-bold text-slate-200 uppercase tracking-wider">
              Components
            </h2>
            {onClose && (
              <button
                type="button"
                onClick={onClose}
                aria-label="Close Toolbox Drawer"
                className="lg:hidden p-1 text-slate-400 hover:text-white rounded hover:bg-slate-800/80 transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          <nav className="space-y-1 2xl:space-y-1.5">
            {tools.map((tool) => {
              const isActive = activeTool === tool.id;
              return (
                <button
                  key={tool.id}
                  type="button"
                  onClick={() => handleToolClick(tool.id)}
                  className={`w-full flex items-center gap-2.5 2xl:gap-3 px-3 2xl:px-4 py-2 2xl:py-2.5 rounded-lg text-xs 2xl:text-sm font-medium transition cursor-pointer ${
                    isActive
                      ? "bg-blue-600 text-white shadow-sm"
                      : "text-slate-300 hover:text-white hover:bg-slate-800/60"
                  }`}
                >
                  {tool.icon}
                  <span>{tool.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Add Buttons */}
        <div className="space-y-2 2xl:space-y-2.5 pt-1">
          <button
            type="button"
            onClick={() => addElement("table")}
            className="w-full py-2 2xl:py-2.5 px-3 2xl:px-4 rounded-lg border border-slate-700/80 bg-slate-900/40 hover:bg-slate-800/70 text-slate-200 text-xs 2xl:text-sm font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-slate-400 shrink-0" />
            <span>Add Simple Table</span>
          </button>

          <button
            type="button"
            onClick={() => addElement("text")}
            className="w-full py-2 2xl:py-2.5 px-3 2xl:px-4 rounded-lg border border-slate-700/80 bg-slate-900/40 hover:bg-slate-800/70 text-slate-200 text-xs 2xl:text-sm font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-slate-400 shrink-0" />
            <span>Add New Text Line</span>
          </button>
        </div>
      </div>

      {/* Bottom Section: Pages */}
      <div className="pt-4 2xl:pt-6 border-t border-slate-800/80 space-y-2.5 2xl:space-y-3.5 mt-4">
        <h2 className="text-xs 2xl:text-sm font-bold text-slate-200 uppercase tracking-wider px-1">
          Pages
        </h2>

        {/* Pages List */}
        <div className="space-y-2 max-h-48 overflow-y-auto scrollbar-none pr-0.5">
          {pages.map((page) => {
            const isSelected = activePage === page.pageNumber;
            return (
              <div
                key={page.pageNumber}
                onClick={() => setActivePage(page.pageNumber)}
                className="relative group cursor-pointer"
              >
                <div
                  className={`w-full aspect-[4/3] bg-white rounded-lg p-2 2xl:p-3 border-2 shadow-md flex flex-col justify-between overflow-hidden transition ${
                    isSelected
                      ? "border-blue-500 ring-2 ring-blue-500/20"
                      : "border-slate-700 hover:border-slate-500"
                  }`}
                >
                  {/* Mini document content sketch based on blocks */}
                  <div className="space-y-1 2xl:space-y-1.5">
                    <div className="flex justify-between items-center">
                      <div className="w-3 h-3 2xl:w-4 2xl:h-4 rounded-xs bg-blue-500/70" />
                      <div className="w-10 2xl:w-14 h-1 2xl:h-1.5 bg-slate-400 rounded-full" />
                    </div>
                    <div className="w-full h-0.5 2xl:h-1 bg-slate-200 my-1" />
                    <div className="space-y-0.5 2xl:space-y-1">
                      {page.blocks.length > 0 ? (
                        page.blocks.slice(0, 3).map((b) => (
                          <div
                            key={b.id}
                            className={`w-full h-1 2xl:h-1.5 rounded-xs ${
                              b.type === "table"
                                ? "bg-blue-200"
                                : b.type === "image"
                                ? "bg-emerald-200"
                                : b.type === "shape"
                                ? "bg-amber-200"
                                : "bg-slate-200"
                            }`}
                          />
                        ))
                      ) : (
                        <div className="w-full h-1 2xl:h-1.5 bg-slate-100 rounded-xs italic text-[7px] text-slate-300">
                          Empty Page
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Page Number Badge */}
                  <div
                    className={`w-4 h-4 2xl:w-5 2xl:h-5 rounded text-[9px] 2xl:text-xs font-bold flex items-center justify-center shadow-xs ${
                      isSelected ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-700"
                    }`}
                  >
                    {page.pageNumber}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Add Page Button */}
        <button
          type="button"
          onClick={addPage}
          className="w-full py-2 2xl:py-2.5 rounded-lg border border-slate-700/80 bg-slate-900/40 hover:bg-slate-800/70 text-slate-300 text-xs 2xl:text-sm font-medium flex items-center justify-center gap-1.5 transition cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-slate-400 shrink-0" />
          <span>Add Page</span>
        </button>
      </div>
    </aside>
  );
}
