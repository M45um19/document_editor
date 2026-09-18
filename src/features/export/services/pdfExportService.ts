import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { CanvasPage, DocumentMetadata, PaperSize, PAPER_SIZES } from "@/features/editor/types";
import { useEditorState } from "@/features/editor/hooks/useEditorState";

export interface ExportPdfOptions {
  fileName?: string;
  paperSize?: PaperSize;
  pages?: CanvasPage[];
  metadata?: DocumentMetadata;
  elementId?: string;
}

const PAPER_FORMAT_MAP: Record<
  PaperSize,
  { format: string | [number, number]; orientation: "portrait" | "landscape" }
> = {
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

export async function exportDocumentToPdf(options: ExportPdfOptions = {}): Promise<void> {
  if (typeof window === "undefined") return;

  const state = useEditorState.getState();
  const currentPaperSize = options.paperSize || state.paperSize || "tabloid";
  const docMetadata = options.metadata || state.metadata;
  const docPages = options.pages || state.pages;
  const rawFileName =
    options.fileName || docMetadata.documentTitle || "Document_Project";

  const paperConfig = PAPER_FORMAT_MAP[currentPaperSize] || PAPER_FORMAT_MAP.tabloid;

  // 1. Locate all clean document sheets in DOM (prefer offscreen export root)
  const exportRoot = document.getElementById("clean-export-root");
  let sheetsToCapture: HTMLElement[] = [];

  if (exportRoot) {
    const rootSheets = Array.from(
      exportRoot.querySelectorAll<HTMLElement>(".clean-document-sheet")
    );
    if (rootSheets.length > 0) {
      sheetsToCapture = rootSheets;
    }
  }

  if (sheetsToCapture.length === 0) {
    const allClean = Array.from(
      document.querySelectorAll<HTMLElement>(".clean-document-sheet")
    );
    if (allClean.length > 0) {
      sheetsToCapture = allClean;
    }
  }

  if (sheetsToCapture.length === 0 && options.elementId) {
    const el = document.getElementById(options.elementId);
    if (el) sheetsToCapture = [el];
  }

  if (sheetsToCapture.length === 0) {
    const fallback = document.getElementById("document-sheet");
    if (fallback) sheetsToCapture = [fallback];
  }

  if (sheetsToCapture.length === 0) {
    console.error("No document sheets found to export to PDF.");
    return;
  }

  try {
    const pdf = new jsPDF({
      orientation: paperConfig.orientation,
      unit: "mm",
      format: paperConfig.format,
      compress: true,
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    for (let i = 0; i < sheetsToCapture.length; i++) {
      const sheet = sheetsToCapture[i];

      const canvas = await html2canvas(sheet, {
        scale: 2, // High-DPI 2x resolution
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
        scrollX: 0,
        scrollY: 0,
        windowWidth: sheet.scrollWidth || sheet.offsetWidth,
        windowHeight: sheet.scrollHeight || sheet.offsetHeight,
        onclone: (clonedDoc, clonedElement) => {
          if (document.documentElement) {
            clonedDoc.documentElement.className = document.documentElement.className;
          }
          if (document.body) {
            clonedDoc.body.className = document.body.className;
          }
          clonedElement.style.position = "static";
          clonedElement.style.top = "0";
          clonedElement.style.left = "0";
          clonedElement.style.margin = "0";
          clonedElement.style.boxShadow = "none";
          clonedElement.style.transform = "none";
          clonedElement.style.visibility = "visible";
          clonedElement.style.opacity = "1";
        },
      });

      const imgData = canvas.toDataURL("image/jpeg", 0.95);

      if (i > 0) {
        pdf.addPage(paperConfig.format, paperConfig.orientation);
      }

      pdf.addImage(imgData, "JPEG", 0, 0, pageWidth, pageHeight);
    }

    const sanitizedFileName = `${rawFileName.replace(/[^a-zA-Z0-9_-]/g, "_")}.pdf`;
    pdf.save(sanitizedFileName);
  } catch (err) {
    console.error("PDF generation failed:", err);
  }
}
