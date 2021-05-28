import { TableListItem as UsersParams } from '@/pages/account/users-list/data.d';

export interface OrderParams {
  id: number;
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

export interface InvoiceParams {
  id: number;
  totalInclGst: number;
  gstAmount: number;
  balanceInclGst: number;
  changeInclGst: number;
  startDateTime: Date;
  endDateTime: Date;
  isPaid: boolean;
  branchId: number;
  orderId: number;
  note: string;
  startUserId: number;
  startUserName: string;
  currentStartUserName: string;
  endUserId: number;
  endUserName: string;
  currentEndUserName: string;
  orderId: number;
  order?: OrderItemsParams;
  payments?: PaymentsParams[];
  priceCutInclGst?: number;
  discountRate?: number;
}

export interface PaymentsParams {
  id: number;
  dateTime: Date;
  amount: number;
  note: string;
  userId: number;
  userName: string;
  currentUserName: string;
  PaymentModeId: number;
  paymentModeName: string;
  currentPaymentModeName: string;
  invoiceId: number;
  invoice: InvoiceParams;
}

export interface SearchTableListParams {
  keyword?: string;
  isInactive?: boolean;
}

export interface TableListPagination {
  total: number;
  pageSize: number;
  current: number;
}

export interface TableListData {
  invoicesList: InvoiceParams[];
  currentInvoice: Partial<InvoiceParams>;
  usersList: UsersParams[];
  pagination: Partial<TableListPagination>;
}

export interface TableListParams {
  id: string;
  sorter: string;
  status: string;
  pageSize: number;
  currentPage: number;
}
