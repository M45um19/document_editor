import { DocumentStateSnapshot } from "@/features/editor/types";

export interface SavedTemplateItem {
  id: string;
  name: string;
  savedAt: string;
  data?: DocumentStateSnapshot;
}
