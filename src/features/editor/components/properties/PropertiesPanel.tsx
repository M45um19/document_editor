"use client";

import React from "react";
import {
  SlidersHorizontal,
  Plus,
  Trash2,
  X,
  Columns,
  Rows,
} from "lucide-react";
import { useEditorState } from "../../hooks/useEditorState";
import { getPageLayoutRows } from "../../utils/paginationUtils";
import {
  TextBlock,
  TableBlock,
  ImageBlock,
  ShapeBlock,
  BlockTypographyStyle,
  PropertiesPanelProps,
} from "../../types";
import { ImagePropertiesSection } from "./ImagePropertiesSection";
import { ShapePropertiesSection } from "./ShapePropertiesSection";
import { TextPropertiesSection } from "./TextPropertiesSection";
import { TablePropertiesSection } from "./TablePropertiesSection";

export function PropertiesPanel({ onClose, className = "" }: PropertiesPanelProps) {
  const pages = useEditorState((s) => s.pages);
  const activePage = useEditorState((s) => s.activePage);
  const selectedBlockId = useEditorState((s) => s.selectedBlockId);
  const setSelectedBlockId = useEditorState((s) => s.setSelectedBlockId);
  const selectedCell = useEditorState((s) => s.selectedCell);
  const selectedRowId = useEditorState((s) => s.selectedRowId);
  const updateBlockStyle = useEditorState((s) => s.updateBlockStyle);
  const updateImageBlock = useEditorState((s) => s.updateImageBlock);
  const updateShapeBlock = useEditorState((s) => s.updateShapeBlock);
  const updateTableCellStyle = useEditorState((s) => s.updateTableCellStyle);
  const addElement = useEditorState((s) => s.addElement);

  const addPageRow = useEditorState((s) => s.addPageRow);
  const deletePageRow = useEditorState((s) => s.deletePageRow);
  const addPageColumn = useEditorState((s) => s.addPageColumn);
  const deletePageColumn = useEditorState((s) => s.deletePageColumn);

  const currentPageObj = pages.find((p) => p.pageNumber === activePage) || pages[0];
  const currentBlocks = currentPageObj?.blocks || [];

  const selectedAnyBlock = currentBlocks.find((b) => b.id === selectedBlockId);
  const selectedImageBlock =
    selectedAnyBlock?.type === "image" ? (selectedAnyBlock as ImageBlock) : undefined;
  const selectedShapeBlock =
    selectedAnyBlock?.type === "shape" ? (selectedAnyBlock as ShapeBlock) : undefined;

  const selectedTextOrTableBlock = currentBlocks.find(
    (b) => b.id === selectedBlockId && (b.type === "text" || b.type === "table")
  ) as (TextBlock | TableBlock) | undefined;
  const firstTextOrTableBlock = currentBlocks.find(
    (b) => b.type === "text" || b.type === "table"
  ) as (TextBlock | TableBlock) | undefined;
  const activeBlock = selectedTextOrTableBlock || firstTextOrTableBlock;

  const activeTable = (
    selectedTextOrTableBlock?.type === "table"
      ? selectedTextOrTableBlock
      : currentBlocks.find((b) => b.type === "table")
  ) as TableBlock | undefined;

  const handleStyleChange = (style: Partial<BlockTypographyStyle>) => {
    if (!activeBlock) return;
    if (selectedBlockId !== activeBlock.id) {
      setSelectedBlockId(activeBlock.id);
    }
    updateBlockStyle(activePage, activeBlock.id, style);
  };

  const handleTableCellStyleChange = (
    rowId: number,
    columnKey: string,
    style: Partial<BlockTypographyStyle>
  ) => {
    if (!activeBlock) return;
    if (selectedBlockId !== activeBlock.id) {
      setSelectedBlockId(activeBlock.id);
    }
    updateTableCellStyle(activePage, activeBlock.id, rowId, columnKey, style);
  };

  const handleTableSettingChange = (settings: Parameters<typeof updateBlockStyle>[2]) => {
    if (!activeTable) return;
    if (selectedBlockId !== activeTable.id && !selectedCell) {
      setSelectedBlockId(activeTable.id);
    }
    updateBlockStyle(activePage, activeTable.id, settings);
  };

  const layoutRows = getPageLayoutRows(currentPageObj);
  const activeGridRow = layoutRows.find((r) => r.id === selectedRowId) || layoutRows[0];
  const activeGridColCount = activeGridRow ? activeGridRow.columns.length : 1;

  return (
    <aside
      id="properties-panel"
      className={`w-full xl:w-80 2xl:w-[380px] 3xl:w-[440px] bg-white rounded-lg border border-slate-200/90 shadow-sm flex flex-col shrink-0 overflow-y-auto select-none p-4 sm:p-5 2xl:p-6 space-y-5 2xl:space-y-6 transition-all duration-200 ${className}`}
    >
      {/* Panel Header */}
      <div className="flex items-center justify-between pb-2 2xl:pb-3 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 2xl:w-5 2xl:h-5 text-slate-700 shrink-0" />
          <h2 className="text-sm 2xl:text-base font-bold text-slate-900">Properties & Data</h2>
        </div>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Close Properties Panel"
            className="xl:hidden p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Image / Logo Settings Section */}
      {selectedImageBlock && (
        <ImagePropertiesSection
          imageBlock={selectedImageBlock}
          activePage={activePage}
          onUpdateImage={(updates) =>
            updateImageBlock(activePage, selectedImageBlock.id, updates)
          }
        />
      )}

      {/* Shape / Divider Settings Section */}
      {selectedShapeBlock && (
        <ShapePropertiesSection
          shapeBlock={selectedShapeBlock}
          activePage={activePage}
          onUpdateShape={(updates) =>
            updateShapeBlock(activePage, selectedShapeBlock.id, updates)
          }
        />
      )}

      {/* Text Settings Section */}
      {activeBlock ? (
        <TextPropertiesSection
          selectedBlock={activeBlock}
          activePage={activePage}
          selectedCell={selectedCell}
          onUpdateStyle={handleStyleChange}
          onUpdateTableCellStyle={handleTableCellStyleChange}
        />
      ) : (
        <div className="py-4 px-3 bg-slate-50 rounded-lg border border-dashed border-slate-200 text-center space-y-2">
          <p className="text-xs text-slate-500">
            No text or table element on this page yet. Click below to add one and customize its fonts.
          </p>
          <button
            type="button"
            onClick={() => addElement("text")}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-blue-600 text-white text-xs font-semibold hover:bg-blue-700 transition cursor-pointer shadow-2xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Text Block</span>
          </button>
        </div>
      )}

      {/* Table Settings Section */}
      {activeTable && (
        <TablePropertiesSection
          tableBlock={activeTable}
          activePage={activePage}
          onUpdateSettings={handleTableSettingChange}
          onAddRow={() => {}}
          onDeleteRow={() => {}}
          onAddColumn={() => {}}
          onDeleteColumn={() => {}}
        />
      )}

      {/* Column Management */}
      <div className="space-y-2 2xl:space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-xs 2xl:text-sm">
          <Columns className="w-4 h-4 2xl:w-4.5 2xl:h-4.5 text-blue-600" />
          <span>Column Management</span>
        </div>

        <div className="grid grid-cols-2 gap-2 2xl:gap-3">
          <button
            type="button"
            onClick={() => addPageColumn(activePage, activeGridRow?.id)}
            className="flex items-center justify-center gap-1.5 py-2 2xl:py-2.5 px-2 rounded-md border border-slate-200 bg-white text-xs 2xl:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-slate-500" />
            <span>Add Column</span>
          </button>

          <button
            type="button"
            onClick={() => deletePageColumn(activePage, activeGridRow?.id)}
            disabled={activeGridColCount <= 1}
            className="flex items-center justify-center gap-1.5 py-2 2xl:py-2.5 px-2 rounded-md border border-slate-200 bg-white text-xs 2xl:text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-slate-500" />
            <span>Delete Column</span>
          </button>
        </div>
      </div>

      {/* Row Management */}
      <div className="space-y-2 2xl:space-y-3 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2 text-slate-800 font-bold text-xs 2xl:text-sm">
          <Rows className="w-4 h-4 2xl:w-4.5 2xl:h-4.5 text-slate-700" />
          <span>Row Management</span>
        </div>

        <div className="grid grid-cols-2 gap-2 2xl:gap-3">
          <button
            type="button"
            onClick={() => addPageRow(activePage)}
            className="flex items-center justify-center gap-1.5 py-2 2xl:py-2.5 px-2 rounded-md border border-slate-200 bg-white text-xs 2xl:text-sm font-semibold text-slate-700 hover:bg-slate-50 transition shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-slate-500" />
            <span>Add Row</span>
          </button>

          <button
            type="button"
            onClick={() => deletePageRow(activePage, activeGridRow?.id)}
            disabled={layoutRows.length <= 1}
            className="flex items-center justify-center gap-1.5 py-2 2xl:py-2.5 px-2 rounded-md border border-slate-200 bg-white text-xs 2xl:text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed transition shadow-2xs cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5 2xl:w-4 2xl:h-4 text-slate-500" />
            <span>Delete Row</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
