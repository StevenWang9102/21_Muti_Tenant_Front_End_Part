import jsonpatch from 'fast-json-patch';

export interface TableListItem {
  id?: number;
  name: string;
  index?: number;
  moniker?: string;
  note?: string;
  isInactive?: boolean;
}

export interface SearchTableListParams {
  keyword?:string;
  isInactive?: boolean;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  list: TableListItem[];
  oneItem: Partial<TableListItem>,
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  name: string;
  id: string;
  jsonpatchOperation?: jsonpatch.Operation[];
  sorter: string;
  status: string;
  pageSize: number;
  currentPage: number;
}