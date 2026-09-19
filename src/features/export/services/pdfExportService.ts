import html2canvas from "html2canvas-pro";
import jsPDF from "jspdf";
import { PAPER_SIZES } from "@/features/editor/types";
import { useEditorState } from "@/features/editor/hooks/useEditorState";
import { ExportPdfOptions } from "../types";
import { PAPER_FORMAT_MAP, sanitizePdfFileName } from "../utils/exportUtils";

export async function exportDocumentToPdf(options: ExportPdfOptions = {}): Promise<void> {
  if (typeof window === "undefined") return;

  const state = useEditorState.getState();
  const currentPaperSize = options.paperSize || state.paperSize || "tabloid";
  const docMetadata = options.metadata || state.metadata;
  const rawFileName =
    options.fileName || docMetadata.documentTitle || "Document_Project";

  const paperConfig = PAPER_FORMAT_MAP[currentPaperSize] || PAPER_FORMAT_MAP.tabloid;
  const paperDimConfig = PAPER_SIZES[currentPaperSize] || PAPER_SIZES.tabloid;

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
        windowWidth: paperDimConfig.widthPx,
        onclone: (clonedDoc, clonedElement) => {
          if (document.documentElement) {
            clonedDoc.documentElement.className = document.documentElement.className;
          }
          if (document.body) {
            clonedDoc.body.className = document.body.className;
          }

          // Isolate this specific sheet in the clone: hide all sibling sheets
          const allClonedSheets = Array.from(
            clonedDoc.querySelectorAll<HTMLElement>(".clean-document-sheet")
          );
          allClonedSheets.forEach((s) => {
            if (s !== clonedElement) {
              s.style.display = "none";
            }
          });

          if (clonedElement.parentElement) {
            clonedElement.parentElement.style.position = "static";
            clonedElement.parentElement.style.top = "0";
            clonedElement.parentElement.style.left = "0";
            clonedElement.parentElement.style.margin = "0";
            clonedElement.parentElement.style.padding = "0";
            clonedElement.parentElement.style.transform = "none";
          }

          clonedElement.style.display = "flex";
          clonedElement.style.position = "relative";
          clonedElement.style.top = "0";
          clonedElement.style.left = "0";
          clonedElement.style.margin = "0";
          clonedElement.style.width = `${paperDimConfig.widthPx}px`;
          clonedElement.style.minWidth = `${paperDimConfig.widthPx}px`;
          clonedElement.style.maxWidth = `${paperDimConfig.widthPx}px`;
          clonedElement.style.minHeight = `${paperDimConfig.minHeightPx}px`;
          clonedElement.style.height = `${paperDimConfig.minHeightPx}px`;
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

    const sanitizedFileName = sanitizePdfFileName(rawFileName);
    pdf.save(sanitizedFileName);
  } catch (err) {
    console.error("PDF generation failed:", err);
  }
}
