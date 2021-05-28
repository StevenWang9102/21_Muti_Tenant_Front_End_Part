import jsonpatch from 'fast-json-patch';
import { TableListItem as UsersParams } from '@/pages/account/users-list/data.d';

export interface OrderParams {
  id: number;
  branchId: number;
  startDateTime: Date;
  endDateTime: Date;
  totalInclGst: number;
  gstAmount: number;
  priceCutInclGst: number;
  discountRate: number;
  locationId: number;
  locationName: string;
  currentLocationName: string;
  startUserId: number;
  startUserName: string;
  currentStartUserName: string;
  endUserId: number;
  endUserName: string;
  currentEndUserName: string;
  staffId: number;
  therapistName: string;
  currentTherapistName: string;
  isInvoiced: boolean;
  note: string;
  orderItems: OrderItemsParams[];
  onPageButtonClick: (any)=> void;
}

export interface OrderItemsParams {
  id: number;
  orderId: number;
  itemId: number;
  itemName: string;
  quantity: number;
  normalPriceInclGst: number;
  commitPriceInclGst: number;
  costExclGst: number;
  gstRate: number;
  isBundle: boolean;
  isBundled: boolean;
  note?: string;
  orderBundleItems: OrderItemsParams[];
}

export interface SearchTableListParams {
  startDate?: string;
  keyword?: string;
  isInactive?: boolean;
  status? : any;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  ordersList: OrderParams[];
  currentOrder: OrderParams;
  usersList: UsersParams[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  id: string;
  jsonpatchOperation?: jsonpatch.Operation[];
  sorter: string;
  status: string;
  pageSize: number;
  currentPage: number;
}
