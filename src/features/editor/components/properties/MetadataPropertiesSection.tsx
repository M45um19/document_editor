"use client";

import React from "react";
import { FileText } from "lucide-react";
import { MetadataPropertiesSectionProps } from "../../types";

export function MetadataPropertiesSection({
  metadata,
  onUpdateMetadata,
}: MetadataPropertiesSectionProps) {
  return (
    <div className="space-y-3 2xl:space-y-4 pt-2 border-t border-slate-100">
      <div className="flex items-center gap-2 text-slate-800 font-bold text-xs 2xl:text-sm">
        <FileText className="w-4 h-4 2xl:w-4.5 2xl:h-4.5 text-blue-600" />
        <span>Document Metadata</span>
      </div>

      <div className="space-y-2">
        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-600 block">
            Company Name
          </label>
          <input
            type="text"
            value={metadata.companyName}
            onChange={(e) => onUpdateMetadata({ companyName: e.target.value })}
            className="w-full text-xs font-medium text-slate-800 border border-slate-200 rounded-md px-2.5 py-1.5 outline-none focus:border-blue-500 bg-white"
          />
        </div>

        <div className="space-y-1">
          <label className="text-[11px] font-medium text-slate-600 block">
            Document Title
          </label>
          <input
            type="text"
            value={metadata.documentTitle}
            onChange={(e) => onUpdateMetadata({ documentTitle: e.target.value })}
            className="w-full text-xs font-medium text-slate-800 border border-slate-200 rounded-md px-2.5 py-1.5 outline-none focus:border-blue-500 bg-white"
          />
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-600 block">
              Doc #
            </label>
            <input
              type="text"
              value={metadata.documentNumber}
              onChange={(e) => onUpdateMetadata({ documentNumber: e.target.value })}
              className="w-full text-xs font-medium text-slate-800 border border-slate-200 rounded-md px-2.5 py-1.5 outline-none focus:border-blue-500 bg-white"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[11px] font-medium text-slate-600 block">
              Date
            </label>
            <input
              type="date"
              value={metadata.documentDate}
              onChange={(e) => onUpdateMetadata({ documentDate: e.target.value })}
              className="w-full text-xs font-medium text-slate-800 border border-slate-200 rounded-md px-2.5 py-1.5 outline-none focus:border-blue-500 bg-white"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
