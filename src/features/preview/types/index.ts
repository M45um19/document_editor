import { CanvasPage, DocumentMetadata, PaperSize } from "@/features/editor/types";

export interface CleanDocumentSheetProps {
  page: CanvasPage;
  pageIndex: number;
  totalPages: number;
  metadata: DocumentMetadata;
  paperSize: PaperSize;
  id?: string;
  className?: string;
}

export type PreviewMode = "continuous" | "single";

export interface DocumentPreviewModalProps {
  className?: string;
}
