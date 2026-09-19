"use client";

import React from "react";
import { ImageIcon, Upload, AlignLeft, AlignCenter, AlignRight } from "lucide-react";
import { ImagePropertiesSectionProps } from "../../types";

export function ImagePropertiesSection({
  imageBlock,
  activePage,
  onUpdateImage,
}: ImagePropertiesSectionProps) {
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
    <div className="space-y-3 2xl:space-y-4 pb-3 border-b border-slate-100">
      <div className="flex items-center gap-2 border-b-2 border-blue-600 pb-1 2xl:pb-1.5 w-fit text-blue-600 font-bold text-xs 2xl:text-sm">
        <ImageIcon className="w-4 h-4 2xl:w-4.5 2xl:h-4.5" />
        <span>Image & Logo Settings</span>
      </div>

      <div className="px-2.5 py-1.5 rounded-md bg-blue-50/70 border border-blue-200 text-xs text-blue-900 font-semibold flex items-center justify-between">
        <span>
          Target: {imageBlock.isLogoPreset ? "Preset Logo Icon" : "Image Asset"}
        </span>
        <span className="text-[10px] text-blue-600 bg-white px-1.5 py-0.5 rounded border border-blue-200">
          {typeof imageBlock.width === "number"
            ? `${imageBlock.width}px`
            : imageBlock.width || "44px"}
        </span>
      </div>

      {/* Preset Logo vs Custom Upload Toggle */}
      <div className="space-y-1.5">
        <label className="text-[11px] 2xl:text-xs font-medium text-slate-600 block">
          Image Source
        </label>
        <div className="grid grid-cols-2 gap-1.5">
          <button
            type="button"
            onClick={() =>
              onUpdateImage({
                isLogoPreset: true,
                url: undefined,
              })
            }
            className={`py-1.5 px-2 rounded-md text-xs font-semibold border transition cursor-pointer text-center ${
              imageBlock.isLogoPreset && !imageBlock.url
                ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            Preset Blue Logo
          </button>
          <label
            className={`py-1.5 px-2 rounded-md text-xs font-semibold border transition cursor-pointer text-center flex items-center justify-center gap-1 ${
              imageBlock.url
                ? "bg-blue-600 text-white border-blue-600 shadow-2xs"
                : "bg-white text-slate-700 border-slate-200 hover:bg-slate-50"
            }`}
          >
            <Upload className="w-3 h-3" />
            <span>Upload Image</span>
            <input
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Image URL Input (if custom) */}
      {imageBlock.url && (
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-600 block">
            Image URL / Data
          </label>
          <input
            type="text"
            value={imageBlock.url.startsWith("data:") ? "(Uploaded image data)" : imageBlock.url}
            onChange={(e) =>
              onUpdateImage({
                url: e.target.value,
                isLogoPreset: false,
              })
            }
            placeholder="https://example.com/logo.png"
            className="w-full text-xs font-medium text-slate-800 border border-slate-200 rounded-md px-2 py-1.5 outline-none focus:border-blue-500 bg-white"
          />
        </div>
      )}

      {/* Size Controls */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-600 block">Width</label>
          <div className="flex items-center border border-slate-200 rounded-md px-2 py-1 bg-white focus-within:border-blue-500">
            <input
              type="text"
              value={imageBlock.width ?? (imageBlock.isLogoPreset ? 44 : "100%")}
              onChange={(e) => {
                const val = e.target.value;
                const num = parseInt(val, 10);
                onUpdateImage({
                  width: !isNaN(num) && String(num) === val ? num : val,
                });
              }}
              placeholder="44"
              className="w-full text-xs font-medium text-slate-800 outline-none bg-transparent"
            />
          </div>
        </div>
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-600 block">Height</label>
          <div className="flex items-center border border-slate-200 rounded-md px-2 py-1 bg-white focus-within:border-blue-500">
            <input
              type="text"
              value={imageBlock.height ?? (imageBlock.isLogoPreset ? 44 : "auto")}
              onChange={(e) => {
                const val = e.target.value;
                const num = parseInt(val, 10);
                onUpdateImage({
                  height: !isNaN(num) && String(num) === val ? num : val,
                });
              }}
              placeholder="44"
              className="w-full text-xs font-medium text-slate-800 outline-none bg-transparent"
            />
          </div>
        </div>
      </div>

      {/* Quick Size Preset Buttons */}
      <div className="space-y-1">
        <label className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block">
          Size Presets
        </label>
        <div className="grid grid-cols-4 gap-1">
          <button
            type="button"
            onClick={() =>
              onUpdateImage({
                width: 44,
                height: 44,
              })
            }
            className="py-1 px-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 transition cursor-pointer"
          >
            Logo (44)
          </button>
          <button
            type="button"
            onClick={() =>
              onUpdateImage({
                width: 80,
                height: 80,
              })
            }
            className="py-1 px-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 transition cursor-pointer"
          >
            80px
          </button>
          <button
            type="button"
            onClick={() =>
              onUpdateImage({
                width: 140,
                height: "auto",
              })
            }
            className="py-1 px-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 transition cursor-pointer"
          >
            Medium
          </button>
          <button
            type="button"
            onClick={() =>
              onUpdateImage({
                width: "100%",
                height: "auto",
              })
            }
            className="py-1 px-1 rounded bg-slate-50 hover:bg-slate-100 border border-slate-200 text-[11px] font-semibold text-slate-700 transition cursor-pointer"
          >
            Full
          </button>
        </div>
      </div>

      {/* Alignment */}
      <div className="space-y-1">
        <label className="text-[11px] font-medium text-slate-600 block">Alignment</label>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={() => onUpdateImage({ align: "left" })}
            className={`p-1.5 rounded-md border flex items-center justify-center transition cursor-pointer ${
              (imageBlock.align || "left") === "left"
                ? "border-blue-200 bg-blue-50 text-blue-600 shadow-xs"
                : "border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <AlignLeft className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onUpdateImage({ align: "center" })}
            className={`p-1.5 rounded-md border flex items-center justify-center transition cursor-pointer ${
              imageBlock.align === "center"
                ? "border-blue-200 bg-blue-50 text-blue-600 shadow-xs"
                : "border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <AlignCenter className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => onUpdateImage({ align: "right" })}
            className={`p-1.5 rounded-md border flex items-center justify-center transition cursor-pointer ${
              imageBlock.align === "right"
                ? "border-blue-200 bg-blue-50 text-blue-600 shadow-xs"
                : "border-slate-200 bg-white text-slate-500 hover:text-slate-800 hover:bg-slate-50"
            }`}
          >
            <AlignRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
