import { PaperSize } from "@/features/editor/types";
import { PaperFormatConfig } from "../types";

export const PAPER_FORMAT_MAP: Record<PaperSize, PaperFormatConfig> = {
  tabloid: {
    format: [279.4, 431.8], // 11 x 17 inches in mm
    orientation: "portrait",
  },
  a4: {
    format: "a4",
    orientation: "portrait",
  },
  letter: {
    format: "letter",
    orientation: "portrait",
  },
  legal: {
    format: "legal",
    orientation: "portrait",
  },
};

export function sanitizePdfFileName(rawFileName: string): string {
  const sanitized = rawFileName.replace(/[^a-zA-Z0-9_-]/g, "_");
  return `${sanitized || "Document"}.pdf`;
}
