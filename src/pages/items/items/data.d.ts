import jsonpatch from 'fast-json-patch';
import { CategoriesTreeItem } from '../categories/data.d';

export interface TableListItem {
  id: number;
  name: string;
  description?: string;
  moniker?: string;
  priceInclGst: number;
  costExclGst?: number;
  isService: boolean;
  note?: string;
  isInactive: boolean;
  gstRate?: string;
  picturePath?: string;
  categoryId: number;
  categoryName?: string;
  endDateTime?: Date;
  startDateTime?: Date;
  isBundle: boolean;
}

export interface SearchTableListParams {
  keyword?:string;
  isService?: boolean;
  isInactive?: boolean;
  categoryId?: number;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  categoriesList: CategoriesTreeItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  sorter: string;
  status: string;
  pageSize: number;
  currentPage: number;
  body: Array;
  id : string;
  itemId: string;
  branchId: string;
  jsonpatchOperation?: jsonpatch.Operation[];
}