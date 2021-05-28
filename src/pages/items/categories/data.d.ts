import jsonpatch from 'fast-json-patch';

export interface CategoriesTreeItem {
  id: number;
  name: string;
  description?: string;
  moniker?: string;
  note?: string;
  color?: string;
  isInactive: boolean;
  parentCategoryId?: number;
  parentCategory?: CategoriesTreeItem;
}

export interface CategoriesTreeData {
  list: CategoriesTreeItem[];
}

export interface CategoriesTreeParams {
  id: string;
  jsonpatchOperation?: jsonpatch.Operation[];
}
