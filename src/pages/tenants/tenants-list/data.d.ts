export interface TenantItem {
  id : string;
  name?: HostUser;
  connectionString?: string;
  isInactive?: boolean;
  candidate?: TenantApplication;
}
/* "id": "a4141493-9158-464c-b3cb-35e0d8eaea92",
"name": "GPOS",
"connectionString": "Server=192.168.1.218\\sqlexpress;Database=MenuHub_GPOS;User Id=eznz;Password=9seqxtf7;MultipleActiveResultSets=true",
"isInactive": false,
"candidate": {
    "id": "a885163a-3d46-491a-b1fc-7b3b5357fdfe",
    "hostUser": {
        "id": "5dad1c53-da46-4509-9d50-35d8ed806d30",
        "email": "375973811@qq.com",
        "isInactive": false,
        "tenants": []
    },
    "hostUserId": "5dad1c53-da46-4509-9d50-35d8ed806d30",
    "userFirstName": "Steven",
    "userMiddleName": null,
    "userLastName": "Wang",
    "shortName": "GPOS",
    "legalName": "GPOS Ltd.",
    "tradingName": "GPOS",
    "phone": "09-6232176",
    "email": "info@gpos.co.nz",
    "address": "66B Mt Eden Rd, Mt Eden, Auckland, New Zealand",
    "gstNumber": "919-929-939",
    "note": null,
    "createdTime": "2020-06-24T11:36:30.171602+12:00",
    "isApproved": true
} */

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
  address?: string;
  isApproved?: boolean;
  userFirstName?: string;
  userMiddleName?: string;
  userLastName?: string;
  createdTime?: string;
  note?: string;
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
  data: TenantItem[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  id : string;
  name?: HostUser;
  connectionString?: string;
  sorter?: string;
  pageSize?: number;
  currentPage?: number;
}
