import type React from "react";

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
  pageBreakBefore?: boolean;
}

export interface CanvasPage {
  pageNumber: number;
  layoutRows?: PageGridRow[];
  blocks: CanvasBlock[];
}

export type ToolType = "select" | "text" | "table" | "image" | "shape";
export type ActiveToolType = ToolType;

export type PaperSize = "a4" | "letter" | "legal" | "tabloid";

export interface PaperSizeConfig {
  id: PaperSize;
  name: string;
  label: string;
  shortLabel: string;
  dimensionsMm: string;
  dimensionsIn: string;
  widthPx: number;
  minHeightPx: number;
  page1Capacity: number;
  pageNCapacity: number;
}

export const PAPER_SIZES: Record<PaperSize, PaperSizeConfig> = {
  a4: {
    id: "a4",
    name: "A4",
    label: "A4 (210 × 297 mm)",
    shortLabel: "A4 • 210 × 297 mm",
    dimensionsMm: "210 × 297 mm",
    dimensionsIn: "8.27 × 11.69 in",
    widthPx: 794,
    minHeightPx: 1123,
    page1Capacity: 980,
    pageNCapacity: 960,
  },
  letter: {
    id: "letter",
    name: "Letter (US)",
    label: "Letter (8.5 × 11 in)",
    shortLabel: "Letter • 8.5 × 11 in",
    dimensionsMm: "216 × 279 mm",
    dimensionsIn: "8.5 × 11 in",
    widthPx: 816,
    minHeightPx: 1056,
    page1Capacity: 920,
    pageNCapacity: 900,
  },
  legal: {
    id: "legal",
    name: "Legal (US)",
    label: "Legal (8.5 × 14 in)",
    shortLabel: "Legal • 8.5 × 14 in",
    dimensionsMm: "216 × 356 mm",
    dimensionsIn: "8.5 × 14 in",
    widthPx: 816,
    minHeightPx: 1344,
    page1Capacity: 1200,
    pageNCapacity: 1180,
  },
  tabloid: {
    id: "tabloid",
    name: "Tabloid / Ledger",
    label: "Tabloid (11 × 17 in)",
    shortLabel: "Tabloid • 11 × 17 in",
    dimensionsMm: "279 × 432 mm",
    dimensionsIn: "11 × 17 in",
    widthPx: 1056,
    minHeightPx: 1632,
    page1Capacity: 1490,
    pageNCapacity: 1470,
  },
};

export interface DocumentStateSnapshot {
  metadata: DocumentMetadata;
  pages: CanvasPage[];
  paperSize?: PaperSize;
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

export interface EditorStoreState {
  activeTemplateId: string;
  selectedBlockId: string | null;
  selectedCell: SelectedCellLocation | null;
  selectedRowId: string | null;
  selectedColumnId: string | null;
  metadata: DocumentMetadata;
  paperSize: PaperSize;
  pages: CanvasPage[];
  activePage: number;
  activeTool: ToolType;
  zoomLevel: string;
  isFullscreen: boolean;
  lastSavedAt: string | null;
  saveMessage: string | null;

  // Template management
  setActiveTemplateId: (id: string) => void;
  saveCurrentTemplate: (name?: string) => void;
  loadTemplate: (snapshot: DocumentStateSnapshot, templateId?: string) => void;
  resetToDefault: () => void;

  // Viewport & Tools Actions
  setSelectedBlockId: (id: string | null) => void;
  setSelectedCell: (cell: SelectedCellLocation | null) => void;
  setSelectedRowId: (rowId: string | null) => void;
  setSelectedColumnId: (columnId: string | null) => void;
  setActiveTool: (tool: ToolType) => void;
  setZoomLevel: (zoom: string) => void;
  setPaperSize: (paperSize: PaperSize) => void;
  toggleFullscreen: () => void;
  setActivePage: (pageNumber: number) => void;
  addPage: () => void;
  deletePage: (pageNumber: number) => void;

  // Page Grid (Row & Column) Management
  addPageRow: (pageNumber: number) => void;
  deletePageRow: (pageNumber: number, rowId?: string) => void;
  addPageColumn: (pageNumber: number, rowId?: string) => void;
  deletePageColumn: (pageNumber: number, rowId?: string, columnId?: string) => void;
  updateRowColumnWidths: (
    pageNumber: number,
    rowId: string,
    columnWidths: { id: string; width: number }[]
  ) => void;
  updateRowMargins: (
    pageNumber: number,
    rowId: string,
    margins: { marginTop?: number; marginBottom?: number }
  ) => void;
  updateRowPadding: (
    pageNumber: number,
    rowId: string,
    padding: {
      paddingTop?: number;
      paddingBottom?: number;
    }
  ) => void;

  // Component insertion with auto-pagination
  addElement: (type: "text" | "table" | "image" | "shape") => void;
  addElementToColumn: (
    pageNumber: number,
    rowId: string,
    columnId: string,
    type: "text" | "table" | "image" | "shape"
  ) => void;
  removeElement: (pageNumber: number, blockId: string) => void;

  // Content updates
  setMetadata: (updates: Partial<DocumentMetadata>) => void;
  updateTextBlock: (pageNumber: number, blockId: string, content: string) => void;
  updateBlockStyle: (
    pageNumber: number,
    blockId: string,
    style: BlockUpdatePayload
  ) => void;
  updateImageBlock: (
    pageNumber: number,
    blockId: string,
    updates: Partial<ImageBlock>
  ) => void;
  updateShapeBlock: (
    pageNumber: number,
    blockId: string,
    updates: Partial<ShapeBlock>
  ) => void;
  updateTableSettings: (
    pageNumber: number,
    blockId: string,
    settings: Partial<TableStyleSettings>
  ) => void;
  updateTextBlockStyle: (
    pageNumber: number,
    blockId: string,
    style: Partial<BlockTypographyStyle>
  ) => void;
  updateTableCellStyle: (
    pageNumber: number,
    blockId: string,
    rowId: number,
    columnKey: string,
    style: Partial<BlockTypographyStyle>
  ) => void;
  updateTableRow: (
    pageNumber: number,
    blockId: string,
    rowId: number,
    field: string,
    value: string | number
  ) => void;
  addTableRow: (pageNumber: number, blockId: string) => void;
  deleteTableRow: (pageNumber: number, blockId: string, rowId?: number) => void;
  reorderTableRows: (
    pageNumber: number,
    blockId: string,
    sourceIndex: number,
    destinationIndex: number
  ) => void;
  addTableColumn: (pageNumber: number, blockId: string) => void;
  deleteTableColumn: (pageNumber: number, blockId: string, columnId?: string) => void;
  updateTableTitle: (pageNumber: number, blockId: string, title: string) => void;
  updateTableColumnLabel: (
    pageNumber: number,
    blockId: string,
    columnId: string,
    label: string
  ) => void;
}

export interface ComponentToolboxProps {
  onClose?: () => void;
  className?: string;
}

export interface PropertiesPanelProps {
  onClose?: () => void;
  className?: string;
}

export interface RowMarginHandleProps {
  rowId: string;
  edge: "top" | "bottom";
  currentMargin: number;
  isRowSelected: boolean;
  isBeingResized: boolean;
  onMouseDown: (e: React.MouseEvent) => void;
}

export interface AutoExpandingTextareaProps {
  value: string;
  onFocus?: () => void;
  onClick?: (e: React.MouseEvent) => void;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  style?: React.CSSProperties;
  className?: string;
  placeholder?: string;
}

export interface SortableTableRowProps {
  row: TableRowItem;
  index: number;
  columns: TableColumn[];
  pageNum: number;
  tableBlock: TableBlock;
  isSelected: boolean;
  hasRowSpacing: boolean;
  isNoBorder: boolean;
  borderStyle: string;
  cellPadding: number;
  isCellSelected: (rowId: number, colId: string) => boolean;
  getEffectiveCellStyle: (
    row: TableRowItem,
    colId: string,
    defaultAlign?: "left" | "center" | "right"
  ) => React.CSSProperties;
  handleCellFocus: (rowId: number, colId: string) => void;
  updateTableRow: (
    pageNumber: number,
    blockId: string,
    rowId: number,
    field: string,
    value: string | number
  ) => void;
}

export interface CanvasTextBlockProps {
  block: TextBlock;
  pageNum: number;
  rowId: string;
  columnId: string;
  isSelected: boolean;
  onSelect: () => void;
  onUpdateContent: (content: string) => void;
  onDeleteBlock: () => void;
}

export interface CanvasTableBlockProps {
  block: TableBlock;
  pageNum: number;
  rowId: string;
  columnId: string;
  isSelected: boolean;
  isCellSelected: (rowId: number, colId: string) => boolean;
  onSelect: () => void;
  onSelectCell: (location: SelectedCellLocation | null) => void;
  onUpdateTitle: (title: string) => void;
  onUpdateColumnLabel: (columnId: string, label: string) => void;
  onUpdateTableRow: (rowId: number, field: string, value: string | number) => void;
  onAddRow: () => void;
  onDeleteRow: (rowId?: number) => void;
  onAddColumn: () => void;
  onDeleteColumn: (columnId?: string) => void;
  onDeleteBlock: () => void;
  getEffectiveCellStyle: (
    row: TableRowItem,
    colId: string,
    defaultAlign?: "left" | "center" | "right"
  ) => React.CSSProperties;
}

export interface CanvasImageBlockProps {
  block: ImageBlock;
  pageNum: number;
  rowId: string;
  columnId: string;
  isSelected: boolean;
  onSelect: () => void;
  onUpdateImage: (updates: Partial<ImageBlock>) => void;
  onDeleteBlock: () => void;
}

export interface CanvasShapeBlockProps {
  block: ShapeBlock;
  pageNum: number;
  rowId: string;
  columnId: string;
  isSelected: boolean;
  onSelect: () => void;
  onDeleteBlock: () => void;
}

export interface CanvasPageSheetProps {
  page: CanvasPage;
  pageIndex: number;
  totalPages: number;
  metadata: DocumentMetadata;
  paperSize: PaperSize;
  activePage: number;
  selectedBlockId: string | null;
  selectedCell: SelectedCellLocation | null;
  selectedRowId: string | null;
  selectedColumnId: string | null;
  resizingRowId: string | null;
  resizingEdge: "top" | "bottom" | null;
  onSelectPage: (pageNum: number) => void;
  onSelectBlock: (id: string | null) => void;
  onSelectCell: (cell: SelectedCellLocation | null) => void;
  onSelectRow: (rowId: string | null) => void;
  onSelectColumn: (colId: string | null) => void;
  onAddPageRow: (pageNum: number) => void;
  onDeletePageRow: (pageNum: number, rowId?: string) => void;
  onAddPageColumn: (pageNum: number, rowId?: string) => void;
  onDeletePageColumn: (pageNum: number, rowId?: string, colId?: string) => void;
  onDeletePage: (pageNum: number) => void;
  onUpdateColumnWidths: (pageNum: number, rowId: string, widths: { id: string; width: number }[]) => void;
  onStartRowMarginResize: (e: React.MouseEvent, rowId: string, edge: "top" | "bottom", initialMargin: number) => void;
}

export interface TextPropertiesSectionProps {
  selectedBlock: TextBlock | TableBlock;
  activePage: number;
  selectedCell: SelectedCellLocation | null;
  onUpdateStyle: (style: Partial<BlockTypographyStyle>) => void;
  onUpdateTableCellStyle: (rowId: number, columnKey: string, style: Partial<BlockTypographyStyle>) => void;
}

export interface TablePropertiesSectionProps {
  tableBlock: TableBlock;
  activePage: number;
  onUpdateSettings: (settings: Partial<TableStyleSettings>) => void;
  onAddRow: () => void;
  onDeleteRow: () => void;
  onAddColumn: () => void;
  onDeleteColumn: () => void;
}

export interface ImagePropertiesSectionProps {
  imageBlock: ImageBlock;
  activePage: number;
  onUpdateImage: (updates: Partial<ImageBlock>) => void;
}

export interface ShapePropertiesSectionProps {
  shapeBlock: ShapeBlock;
  activePage: number;
  onUpdateShape: (updates: Partial<ShapeBlock>) => void;
}

export interface MetadataPropertiesSectionProps {
  metadata: DocumentMetadata;
  onUpdateMetadata: (updates: Partial<DocumentMetadata>) => void;
}


