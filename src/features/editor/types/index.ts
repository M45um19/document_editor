export interface TableRowItem {
  id: number;
  item: string;
  qty: number;
  unitPrice: string;
  amount: string;
}

export interface TableBlock {
  id: string;
  type: "table";
  title: string;
  rows: TableRowItem[];
}

export interface TextBlock {
  id: string;
  type: "text";
  content: string;
  variant?: "heading" | "paragraph" | "callout";
}

export interface ImageBlock {
  id: string;
  type: "image";
  url?: string;
  caption: string;
}

export interface ShapeBlock {
  id: string;
  type: "shape";
  shapeType: "divider" | "banner" | "badge";
  color?: string;
}

export type CanvasBlock = TableBlock | TextBlock | ImageBlock | ShapeBlock;

export interface TextStyleSettings {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  color: string;
  align: "left" | "center" | "right";
}

export interface TableStyleSettings {
  width: number;
  borderStyle: string;
  padding: number;
  rowSpacing: number;
}

export interface DocumentMetadata {
  projectName?: string;
  companyName: string;
  companyTagline: string;
  documentTitle: string;
  issuerDetails: string;
  clientDetails: string;
  documentNumber: string;
  documentDate: string;
}

export interface CanvasPage {
  pageNumber: number;
  blocks: CanvasBlock[];
}

export type ToolType = "select" | "text" | "table" | "image" | "shape";
export type ActiveToolType = ToolType;

export interface DocumentStateSnapshot {
  metadata: DocumentMetadata;
  pages: CanvasPage[];
}
