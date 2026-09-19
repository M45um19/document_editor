"use client";

import React from "react";
import { Image as ImageIcon, Upload, X } from "lucide-react";
import { CanvasImageBlockProps } from "../../types";

export function CanvasImageBlock({
  block,
  pageNum,
  rowId,
  columnId,
  isSelected,
  onSelect,
  onUpdateImage,
  onDeleteBlock,
}: CanvasImageBlockProps) {
  const widthVal = block.width ?? (block.isLogoPreset ? 42 : "100%");
  const heightVal = block.height ?? (block.isLogoPreset ? 42 : "auto");
  const alignVal = block.align || "left";
  const borderRadiusVal =
    block.borderRadius !== undefined ? `${block.borderRadius}px` : "8px";

  const alignClass =
    alignVal === "center"
      ? "flex justify-center items-center"
      : alignVal === "right"
      ? "flex justify-end items-center"
      : "flex justify-start items-center";

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === "string") {
          onUpdateImage({
            url: reader.result,
            isLogoPreset: false,
          });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      className={`transition-all relative group/img cursor-pointer ${
        isSelected
          ? "border border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/15 rounded-xl p-2 shadow-xs"
          : "border border-transparent hover:border-slate-200/80 rounded p-0 bg-transparent"
      }`}
    >
      {/* Header toolbar when selected */}
      {isSelected ? (
        <div className="flex items-center justify-between mb-1.5">
          <div className="flex items-center gap-1.5 text-slate-700 text-xs font-semibold uppercase tracking-wider shrink-0">
            <ImageIcon className="w-3.5 h-3.5 text-blue-600" />
            <span>{block.isLogoPreset ? "Logo Block" : "Image Asset"}</span>
          </div>

          <div className="flex items-center gap-1 shrink-0">
            <label className="flex items-center gap-1 text-[10px] font-semibold text-slate-600 hover:text-blue-600 bg-white hover:bg-blue-50 border border-slate-200 rounded px-2 py-0.5 transition cursor-pointer shadow-2xs">
              <Upload className="w-3 h-3" />
              <span>Upload</span>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </label>
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onDeleteBlock();
              }}
              aria-label="Delete image block"
              className="text-slate-400 hover:text-red-500 p-1 rounded transition cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      ) : (
        /* Unselected hover delete button */
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onDeleteBlock();
          }}
          aria-label="Delete image block"
          className="opacity-0 group-hover/img:opacity-100 absolute -top-1 right-0 text-slate-400 hover:text-red-500 p-0.5 rounded bg-white/90 shadow-2xs border border-slate-200 transition cursor-pointer z-10"
        >
          <X className="w-3 h-3" />
        </button>
      )}

      {/* Image Content Container */}
      <div className={`w-full ${alignClass}`}>
        {block.url ? (
          <img
            src={block.url}
            alt={block.caption || "Document Image"}
            style={{
              width: typeof widthVal === "number" ? `${widthVal}px` : widthVal,
              height: typeof heightVal === "number" ? `${heightVal}px` : heightVal,
              borderRadius: borderRadiusVal,
              objectFit: "contain",
            }}
            className="max-w-full transition-all shadow-2xs"
          />
        ) : block.isLogoPreset ? (
          /* Precise geometric 4-tile blue logo icon matching the design */
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
        ) : (
          /* Default Image placeholder */
          <label className="w-full h-28 sm:h-36 rounded-lg bg-gradient-to-br from-slate-100 via-slate-50 to-blue-50/40 border border-dashed border-slate-300 hover:border-blue-400 flex flex-col items-center justify-center text-slate-400 gap-1.5 cursor-pointer transition">
            <ImageIcon className="w-7 h-7 text-slate-300" />
            <span className="text-xs font-medium text-slate-500">
              {block.caption || "Click to Upload Image"}
            </span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        )}
      </div>
    </div>
  );
}
