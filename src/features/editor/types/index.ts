export interface BlockTypographyStyle {
  fontFamily?: string;
  fontSize?: number;
  fontWeight?: string;
  color?: string;
  align?: "left" | "center" | "right";
}

export interface TableColumn {
  id: string;
  label: string;
  align?: "left" | "center" | "right";
  width?: string;
  type?: "text" | "number" | "currency" | "calculated";
}

export interface TableRowItem {
  id: number;
  item: string;
  qty: number;
  unitPrice: string;
  amount: string;
  cellStyles?: Record<string, BlockTypographyStyle>;
  [key: string]: string | number | undefined | Record<string, BlockTypographyStyle>;
}

export interface SelectedCellLocation {
  blockId: string;
  rowId: number;
  columnKey: string;
}

export const DEFAULT_TABLE_COLUMNS: TableColumn[] = [
  { id: "item", label: "Item Detail", align: "left" },
  { id: "qty", label: "Qty", align: "center", width: "w-16 sm:w-20" },
  { id: "unitPrice", label: "Unit Price", align: "center", width: "w-24 sm:w-28" },
  { id: "amount", label: "Amount", align: "right", width: "w-24 sm:w-28", type: "calculated" },
];

export interface TableBlock extends BlockTypographyStyle {
  id: string;
  type: "table";
  title: string;
  columns?: TableColumn[];
  rows: TableRowItem[];
}

export interface TextBlock extends BlockTypographyStyle {
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

export interface PageGridColumn {
  id: string;
  blocks: CanvasBlock[];
  width?: number; // percentage width of the row (e.g. 20 for 20%)
}

export interface PageGridRow {
  id: string;
  columns: PageGridColumn[];
}

export interface CanvasPage {
  pageNumber: number;
  layoutRows?: PageGridRow[];
  blocks: CanvasBlock[];
}

export type ToolType = "select" | "text" | "table" | "image" | "shape";
export type ActiveToolType = ToolType;

export interface DocumentStateSnapshot {
  metadata: DocumentMetadata;
  pages: CanvasPage[];
}

export const FONT_FAMILY_MAP: Record<string, string> = {
  "Inter": "var(--font-inter), 'Inter', sans-serif",
  "Roboto": "var(--font-roboto), 'Roboto', sans-serif",
  "Outfit": "var(--font-outfit), 'Outfit', sans-serif",
  "Playfair Display": "var(--font-playfair), 'Playfair Display', Georgia, serif",
  "Merriweather": "var(--font-merriweather), 'Merriweather', Georgia, serif",
  "Fira Code": "var(--font-fira), 'Fira Code', monospace",
  "Arial": "Arial, Helvetica, sans-serif",
  "Georgia": "Georgia, serif",
  "Courier New": "'Courier New', Courier, monospace",
};

export const AVAILABLE_FONTS = [
  "Inter",
  "Roboto",
  "Outfit",
  "Playfair Display",
  "Merriweather",
  "Fira Code",
  "Arial",
  "Georgia",
  "Courier New",
] as const;

