import { DocumentStateSnapshot } from "@/features/editor/types";

export interface SavedTemplateItem {
  id: string;
  name: string;
  savedAt: string;
  data?: DocumentStateSnapshot;
}

export interface TemplatesStoreState {
  templates: SavedTemplateItem[];
  activeTemplateId: string;
  tabCounter: number;

  selectTemplate: (id: string) => void;
  createTemplate: () => { newTemplate: SavedTemplateItem; data: DocumentStateSnapshot };
  deleteTemplate: (id: string) => string;
  saveCurrentTemplate: (data: DocumentStateSnapshot) => SavedTemplateItem;
  getTemplateData: (id: string) => DocumentStateSnapshot;
  saveTemplateData: (id: string, data: DocumentStateSnapshot) => void;
}

export interface TemplateCardProps {
  template: SavedTemplateItem;
  isActive: boolean;
  onOpen: (template: SavedTemplateItem) => void;
  onDelete: (id: string, name: string) => void;
}

export interface SavedTemplatesPanelProps {
  className?: string;
}
