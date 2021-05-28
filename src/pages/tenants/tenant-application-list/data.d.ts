export interface TenantApplication {
  id : string;
  hostUser?: HostUser;
  hostUserId?: string;
  legalName?: number;
  tradingName?: string;
  shortName?: string;
  phone?: string;
  email?: number;
  gstNumber?: number;
  street?: string;
  suburb?: string;
  city?: string;
  country?: string;

  isApproved?: boolean;
  userFirstName?: string;
  userMiddleName?: string;
  userLastName?: string;
  createdTime?: string;
  note?: string;
  jsonpatchOperation?: jsonpatch.Operation[];
}

export interface HostUser {
  id: string,
  email: string,
  isInactive: boolean;
  tenants: string [];
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  data: TenantApplication[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  id?: number;
  isApproved?: boolean;
  legalName?: number;
  tradingName?: string;
  shortName?: string;
  sorter?: string;
  pageSize?: number;
  currentPage?: number;
}
