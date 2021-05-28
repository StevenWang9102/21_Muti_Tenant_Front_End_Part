export interface TableListItem {
  id?: string;
  email?: string;
  phoneNumber?: string;
  code?: string;
  firstName?: string;
  fullName?: string;
  middleName?: string;
  lastName?: string;
  moniker?: string;
  isInactive?: boolean;
  branchRoles?: BranchRole[];
}

export interface BranchRole {
  userId?: string;
  userFullName?: string;
  branchRoleNames?: BranchRoleNames[];
}

export interface BranchRoleNames {
  branchId?: string;
  branchName?: string;
  roleId?: string;
  roleName?: string;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  data: TableListItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  userId?: string;
  userIds?: string[];
  branchId?: string;
  roleId?: string;
  value?: string;
  pageSize?: number;
  currentPage?: number;
  UserIds?: any;
  filter?: { [key: string]: any[] };
  sorter?: { [key: string]: any };
}
