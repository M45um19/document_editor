import { CanvasPage, DocumentMetadata, PaperSize } from "@/features/editor/types";

export interface ExportPdfOptions {
  fileName?: string;
  paperSize?: PaperSize;
  pages?: CanvasPage[];
  metadata?: DocumentMetadata;
  elementId?: string;
}

export interface PaperFormatConfig {
  format: string | [number, number];
  orientation: "portrait" | "landscape";
}
