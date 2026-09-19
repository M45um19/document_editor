"use client";

import React from "react";
import { FileSpreadsheet } from "lucide-react";
import {
  CanvasBlock,
  TableBlock,
  TextBlock,
  ImageBlock,
  ShapeBlock,
  DEFAULT_TABLE_COLUMNS,
  FONT_FAMILY_MAP,
  PAPER_SIZES,
} from "@/features/editor/types";
import { getPageLayoutRows } from "@/features/editor/utils/paginationUtils";
import { CleanDocumentSheetProps } from "../../types";

export function CleanDocumentSheet({
  page,
  pageIndex,
  totalPages,
  metadata,
  paperSize,
  id,
  className = "",
}: CleanDocumentSheetProps) {
  const paperConfig = PAPER_SIZES[paperSize] || PAPER_SIZES.a4;

  const renderBlock = (block: CanvasBlock) => {
    switch (block.type) {
      case "table": {
        const tableBlock = block as TableBlock;
        const fontFamily = tableBlock.fontFamily || "Inter";
        const fontSize = tableBlock.fontSize ? `${tableBlock.fontSize}px` : "14px";
        const color = tableBlock.color || "#1f2937";
        const columns =
          tableBlock.columns && tableBlock.columns.length > 0
            ? tableBlock.columns
            : DEFAULT_TABLE_COLUMNS;
        const borderStyle = tableBlock.borderStyle || "1px solid #E5E7EB";
        const cellPadding = tableBlock.padding !== undefined ? tableBlock.padding : 8;
        const rowSpacing = tableBlock.rowSpacing !== undefined ? tableBlock.rowSpacing : 0;
        const hasRowSpacing = rowSpacing > 0;
        const isNoBorder = borderStyle === "none";

        const rawWidth = tableBlock.tableWidth ?? "100%";
        let formattedTableWidth = "100%";
        if (typeof rawWidth === "number") {
          formattedTableWidth = `${rawWidth}%`;
        } else if (typeof rawWidth === "string") {
          const trimmed = rawWidth.trim();
          if (!trimmed) {
            formattedTableWidth = "100%";
          } else if (
            trimmed.endsWith("%") ||
            trimmed.endsWith("px") ||
            trimmed.endsWith("rem") ||
            trimmed.endsWith("em") ||
            trimmed.endsWith("vw")
          ) {
            formattedTableWidth = trimmed;
          } else {
            const num = Number(trimmed);
            if (!isNaN(num)) {
              formattedTableWidth = num <= 100 ? `${num}%` : `${num}px`;
            } else {
              formattedTableWidth = trimmed;
            }
          }
        }

        const tableAlign = tableBlock.align || "left";
        const alignStyle =
          tableAlign === "center"
            ? "justify-center"
            : tableAlign === "right"
            ? "justify-end"
            : "justify-start";

        return (
          <div key={tableBlock.id} className="w-full space-y-2 p-1 sm:p-2">
            {tableBlock.title && (
              <div className="flex items-center gap-1.5 sm:gap-2">
                <div className="w-6 h-6 sm:w-7 sm:h-7 rounded-lg bg-blue-600 flex items-center justify-center text-white shrink-0 shadow-xs">
                  <FileSpreadsheet className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-800 tracking-tight">
                  {tableBlock.title}
                </span>
              </div>
            )}
            <div className={`w-full overflow-x-auto rounded-lg flex ${alignStyle}`}>
              <table
                style={{
                  fontFamily: FONT_FAMILY_MAP[fontFamily] || "var(--font-inter), Inter, sans-serif",
                  fontSize,
                  color,
                  borderCollapse: hasRowSpacing ? "separate" : "collapse",
                  borderSpacing: hasRowSpacing ? `0 ${rowSpacing}px` : undefined,
                  width: formattedTableWidth,
                  maxWidth: "100%",
                }}
                className="w-full text-left"
              >
                <thead>
                  <tr
                    style={{
                      borderBottom: isNoBorder ? "none" : borderStyle,
                      borderTop: isNoBorder ? "none" : borderStyle,
                      backgroundColor: "#f8fafc",
                    }}
                    className="text-xs uppercase font-semibold text-slate-600 tracking-wider"
                  >
                    <th className="w-8 py-2.5 px-2 text-center text-slate-400">#</th>
                    {columns.map((col) => (
                      <th
                        key={col.id}
                        style={{
                          textAlign: col.align || "left",
                          paddingTop: `${cellPadding}px`,
                          paddingBottom: `${cellPadding}px`,
                          paddingLeft: `${Math.max(4, Math.round(cellPadding * 0.9))}px`,
                          paddingRight: `${Math.max(4, Math.round(cellPadding * 0.9))}px`,
                          borderBottom: isNoBorder ? "none" : borderStyle,
                        }}
                      >
                        {col.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="text-xs sm:text-sm divide-y divide-slate-100">
                  {tableBlock.rows.map((row, idx) => {
                    return (
                      <tr
                        key={row.id}
                        style={{
                          borderBottom: !hasRowSpacing && !isNoBorder ? borderStyle : undefined,
                        }}
                        className={hasRowSpacing ? "bg-white shadow-2xs rounded-lg" : ""}
                      >
                        <td
                          style={{
                            paddingTop: `${cellPadding}px`,
                            paddingBottom: `${cellPadding}px`,
                            paddingLeft: `${Math.max(4, Math.round(cellPadding * 0.75))}px`,
                            paddingRight: `${Math.max(4, Math.round(cellPadding * 0.75))}px`,
                            borderBottom: !hasRowSpacing && !isNoBorder ? borderStyle : undefined,
                            ...(hasRowSpacing && !isNoBorder
                              ? {
                                  borderTop: borderStyle,
                                  borderBottom: borderStyle,
                                  borderLeft: borderStyle,
                                }
                              : {}),
                          }}
                          className={`text-center font-bold text-slate-500 text-xs ${
                            hasRowSpacing ? "rounded-l-lg" : ""
                          }`}
                        >
                          {idx + 1}
                        </td>
                        {columns.map((col, colIdx) => {
                          const isLastCol = colIdx === columns.length - 1;
                          const cellStyleObj = row.cellStyles?.[col.id];
                          const cellFontFamily =
                            cellStyleObj?.fontFamily || tableBlock.fontFamily || "Inter";
                          const cellFontSize = cellStyleObj?.fontSize
                            ? `${cellStyleObj.fontSize}px`
                            : tableBlock.fontSize
                            ? `${tableBlock.fontSize}px`
                            : "14px";
                          const cellFontWeight =
                            cellStyleObj?.fontWeight ||
                            tableBlock.fontWeight ||
                            (col.id === "amount" ? "600" : "400");
                          const cellColor =
                            cellStyleObj?.color ||
                            tableBlock.color ||
                            (col.id === "amount" ? "#0f172a" : "#334155");
                          const cellAlign =
                            cellStyleObj?.align ||
                            col.align ||
                            (col.id === "qty" || col.id === "unitPrice"
                              ? "center"
                              : col.id === "amount"
                              ? "right"
                              : "left");

                          const val =
                            col.id === "item"
                              ? row.item
                              : col.id === "qty"
                              ? row.qty
                              : col.id === "unitPrice"
                              ? row.unitPrice
                              : col.id === "amount"
                              ? row.amount
                              : row[col.id] ?? "-";

                          return (
                            <td
                              key={col.id}
                              style={{
                                fontFamily:
                                  FONT_FAMILY_MAP[cellFontFamily] ||
                                  "var(--font-inter), Inter, sans-serif",
                                fontSize: cellFontSize,
                                fontWeight: cellFontWeight,
                                color: cellColor,
                                textAlign: cellAlign,
                                paddingTop: `${cellPadding}px`,
                                paddingBottom: `${cellPadding}px`,
                                paddingLeft: `${Math.max(4, Math.round(cellPadding * 0.9))}px`,
                                paddingRight: `${Math.max(4, Math.round(cellPadding * 0.9))}px`,
                                borderBottom: !hasRowSpacing && !isNoBorder ? borderStyle : undefined,
                                ...(hasRowSpacing && !isNoBorder
                                  ? {
                                      borderTop: borderStyle,
                                      borderBottom: borderStyle,
                                      ...(isLastCol ? { borderRight: borderStyle } : {}),
                                    }
                                  : {}),
                              }}
                              className={hasRowSpacing && isLastCol ? "rounded-r-lg" : ""}
                            >
                              {String(val ?? "")}
                            </td>
                          );
                        })}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        );
      }

      case "text": {
        const textBlock = block as TextBlock;
        const fontFamily = textBlock.fontFamily || "Inter";
        const fontSize = textBlock.fontSize ? `${textBlock.fontSize}px` : "14px";
        const fontWeight = textBlock.fontWeight || "400";
        const color = textBlock.color || "#1f2937";
        const textAlign = textBlock.align || "left";

        return (
          <div
            key={textBlock.id}
            style={{
              fontFamily: FONT_FAMILY_MAP[fontFamily] || "var(--font-inter), Inter, sans-serif",
              fontSize,
              fontWeight,
              color,
              textAlign,
              lineHeight: 1.25,
            }}
            className="whitespace-pre-wrap leading-snug p-0"
          >
            {textBlock.content || "\u00A0"}
          </div>
        );
      }

      case "image": {
        const imageBlock = block as ImageBlock;
        const widthVal = imageBlock.width ?? (imageBlock.isLogoPreset ? 42 : "100%");
        const heightVal = imageBlock.height ?? (imageBlock.isLogoPreset ? 42 : "auto");
        const alignVal = imageBlock.align || "left";
        const borderRadiusVal =
          imageBlock.borderRadius !== undefined ? `${imageBlock.borderRadius}px` : "8px";

        const alignClass =
          alignVal === "center"
            ? "flex justify-center items-center"
            : alignVal === "right"
            ? "flex justify-end items-center"
            : "flex justify-start items-center";

        return (
          <div key={imageBlock.id} className={`w-full p-0 bg-transparent ${alignClass}`}>
            {imageBlock.url ? (
              <img
                src={imageBlock.url}
                alt={imageBlock.caption || "Document Image"}
                style={{
                  width: typeof widthVal === "number" ? `${widthVal}px` : widthVal,
                  height: typeof heightVal === "number" ? `${heightVal}px` : heightVal,
                  borderRadius: borderRadiusVal,
                  objectFit: "contain",
                }}
                className="max-w-full shadow-2xs"
              />
            ) : imageBlock.isLogoPreset ? (
              <svg
                width={typeof widthVal === "number" ? widthVal : 42}
                height={typeof heightVal === "number" ? heightVal : 42}
                viewBox="0 0 42 42"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{
                  width: typeof widthVal === "number" ? `${widthVal}px` : widthVal,
                  height: typeof heightVal === "number" ? `${heightVal}px` : heightVal,
                  borderRadius: borderRadiusVal,
                }}
                className="shrink-0 drop-shadow-2xs select-none"
              >
                <rect x="1" y="1" width="18" height="18" rx="4.5" fill="#60A5FA" fillOpacity="0.8" />
                <rect x="21" y="1" width="18" height="18" rx="4.5" fill="#1D4ED8" />
                <rect x="26" y="6" width="8" height="8" rx="2" fill="#FFFFFF" />
                <rect x="1" y="21" width="18" height="18" rx="4.5" fill="#2563EB" />
                <rect x="21" y="21" width="18" height="18" rx="4.5" fill="#93C5FD" />
              </svg>
            ) : null}
          </div>
        );
      }

      case "shape": {
        const shapeBlock = block as ShapeBlock;
        const dividerColor = shapeBlock.color || "#3b82f6";
        const dividerHeight = shapeBlock.height ? `${shapeBlock.height}px` : "1.5px";
        const dividerWidth = shapeBlock.width || "100%";

        return (
          <div key={shapeBlock.id} className="w-full py-1 px-0 bg-transparent">
            <div
              style={{
                height: dividerHeight,
                background: `linear-gradient(90deg, #60A5FA 0%, ${dividerColor} 20%, ${dividerColor} 100%)`,
                width: dividerWidth,
              }}
              className="rounded-full shadow-2xs"
            />
          </div>
        );
      }

      default:
        return null;
    }
  };

  return (
    <div
      id={id}
      style={{
        width: `${paperConfig.widthPx}px`,
        maxWidth: `${paperConfig.widthPx}px`,
        minHeight: `${paperConfig.minHeightPx}px`,
      }}
      className={`clean-document-sheet bg-white p-6 sm:p-8 md:p-12 flex flex-col justify-between transition-all print:shadow-none print:border-none print:m-0 print:p-8 ${className}`}
    >
      <div className="space-y-4 sm:space-y-6 w-full flex-1">
        {/* Page Grid Rows Container */}
        <div className="flex flex-col w-full">
          {getPageLayoutRows(page).map((row) => {
            const colCount = Math.max(1, row.columns.length);
            const marginTop = row.marginTop ?? 0;
            const marginBottom = row.marginBottom ?? 16;

            return (
              <div
                key={row.id}
                style={{
                  marginTop: `${marginTop}px`,
                  marginBottom: `${marginBottom}px`,
                }}
                className="w-full py-0"
              >
                <div className="flex items-stretch w-full">
                  {row.columns.map((col) => {
                    const widthPercent =
                      col.width ?? Math.round((100 / colCount) * 10) / 10;

                    return (
                      <div
                        key={col.id}
                        style={{
                          width: `${widthPercent}%`,
                          flex: `0 0 ${widthPercent}%`,
                        }}
                        className="flex flex-col gap-0.5 min-w-0 relative shrink-0 px-1 sm:px-1.5"
                      >
                        {col.blocks.map((b) => renderBlock(b))}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Canvas Footer */}
      <div className="pt-6 sm:pt-8 flex items-center sm:items-end justify-between gap-3 sm:gap-0 border-t border-slate-100 mt-auto">
        <p className="text-[11px] sm:text-xs text-slate-400 text-center sm:text-left">
          Page {page.pageNumber} of {totalPages}
        </p>

        {/* 3-Bar Geometric Graphic */}
        <div className="flex items-end gap-1">
          <div className="w-2.5 sm:w-3 h-3 sm:h-3.5 bg-sky-200 -skew-x-12 rounded-xs" />
          <div className="w-2.5 sm:w-3 h-5 sm:h-6 bg-sky-400 -skew-x-12 rounded-xs" />
          <div className="w-2.5 sm:w-3 h-7 sm:h-9 bg-blue-600 -skew-x-12 rounded-xs" />
        </div>
      </div>
    </div>
  );
}
