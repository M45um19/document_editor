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

export interface TableStyleSettings {
  tableWidth?: string | number;
  borderStyle?: string;
  padding?: number;
  rowSpacing?: number;
}

export interface BorderStyleOption {
  label: string;
  value: string;
}

export const DEFAULT_BORDER_STYLE_OPTIONS: BorderStyleOption[] = [
  { label: "1px Solid Light (#E5E7EB)", value: "1px solid #E5E7EB" },
  { label: "1px Solid Slate (#94A3B8)", value: "1px solid #94A3B8" },
  { label: "2px Solid Dark (#1E293B)", value: "2px solid #1E293B" },
  { label: "2px Solid Blue (#3B82F6)", value: "2px solid #3B82F6" },
  { label: "1px Dashed (#CBD5E1)", value: "1px dashed #CBD5E1" },
  { label: "1px Dotted (#94A3B8)", value: "1px dotted #94A3B8" },
  { label: "2px Double (#CBD5E1)", value: "2px double #CBD5E1" },
  { label: "None (Borderless)", value: "none" },
];

export interface TableBlock extends BlockTypographyStyle, TableStyleSettings {
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
  caption?: string;
  width?: number | string;
  height?: number | string;
  align?: "left" | "center" | "right";
  borderRadius?: number;
  isLogoPreset?: boolean;
}

export interface ShapeBlock {
  id: string;
  type: "shape";
  shapeType: "divider" | "banner" | "badge";
  color?: string;
  height?: number | string;
  width?: number | string;
}

export type CanvasBlock = TableBlock | TextBlock | ImageBlock | ShapeBlock;

export type BlockUpdatePayload = Partial<BlockTypographyStyle & TableStyleSettings> &
  Partial<Omit<ImageBlock, "type" | "id">> &
  Partial<Omit<ShapeBlock, "type" | "id">> & {
    [key: string]: any;
  };

export interface TextStyleSettings {
  fontFamily: string;
  fontSize: number;
  fontWeight: string;
  color: string;
  align: "left" | "center" | "right";
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
  marginTop?: number;
  marginBottom?: number;
  paddingTop?: number;
  paddingBottom?: number;
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

