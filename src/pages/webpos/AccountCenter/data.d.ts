import jsonpatch from 'fast-json-patch';
import { CategoriesTreeItem as categoryParams } from '../../items/categories/data.d';
import { TableListItem as ItemParams } from '../../items/items/data.d';
import { TableListItem as BundleParams } from '../../items/bundles/data.d';
import { TableListItem as PaymentModesParams } from '../../settings/payment-modes-list/data.d';
import { TableListItem as LocationsParams } from '../../settings/locations-list/data.d';
import { TableListItem as UsersParams } from '../../account/users-list/data.d';
//import { GeneralProfile as GeneralProfileParams } from '../../settings/company_settings/data.d';

export interface TagType {
  key: string;
  label: string;
}

export interface GeographicType {
  province: {
    label: string;
    key: string;
  };
  city: {
    label: string;
    key: string;
  };
}

export interface NoticeType {
  id: string;
  title: string;
  logo: string;
  description: string;
  updatedAt: string;
  member: string;
  href: string;
  memberLink: string;
}

export interface CurrentUser {
  name: string;
  avatar: string;
  userid: string;
  notice: NoticeType[];
  email: string;
  signature: string;
  title: string;
  group: string;
  tags: TagType[];
  notifyCount: number;
  unreadCount: number;
  country: string;
  geographic: GeographicType;
  address: string;
  phone: string;
}

export interface Member {
  avatar: string;
  name: string;
  id: string;
}
export interface OrderParams {
  id: number;
  branchId: number;
  orderId: number;
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
  jsonpatchOperation?: jsonpatch.Operation[];
}

export interface OrderItemsParams {
  id: number;
  branchId: number;
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
  jsonpatchOperation?: jsonpatch.Operation[];
}

export interface InvoiceParams {
  invoiceId: number;
  branchId: number;
  totalInclGst: number;
  gstAmount: number;
  balanceInclGst: number;
  changeInclGst: number;
  startDateTime: Date;
  endDateTime: Date;
  isPaid: boolean;
  note: string;
  startUserId: number;
  startUserName: string;
  currentStartUserName: string;
  endUserId: number;
  endUserName: string;
  currentEndUserName: string;
  order: OrderItemsParams;
  orderId: number;
  payments: PaymentsParams[];
  priceCutInclGst?: number;
  discountRate?: number;
  jsonpatchOperation?: jsonpatch.Operation[];
}

export interface PaymentsParams {
  id: number;
  branchId: number;
  orderId: number;
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
  body: any;
}

export interface currentPOSData {
  categoriesList: categoryParams[];
  itemsList: ItemParams[];
  bundlesList: BundleParams[];
  paymentModesList: PaymentModesParams[];
  locationsList: LocationsParams[];
  usersList: UsersParams[];
  //generalProfile: Partial<GeneralProfileParams>;
  generalProfile: Partial<any>;
  MPMAttributes: Partial<MPMPosPayParams>;
  currentOrder: Partial<OrderParams>;
  currentOrderItems: OrderItemsParams[];
  currentOrderOneItem: Partial<OrderItemsParams>;
  currentInvoice: InvoiceParams[];
  currentPayments: PaymentsParams[];
}

export interface MPMPosPayParams {
  merchant_id: number;
  config_id: number;
  reference_id: string;
  grand_total: number;
  signature: string;
  random_str: string;
  refData1?: string;
  refData2?: string;
  terminal_id?: string;
}

export interface MPMPosPayResParams {
  reference_id?: string;
  message: string;
  status: boolean;
}

export interface MPMRefundParams {
  merchant_id: number;
  terminal_id?: string;
  config_id: number;
  reference_id: string;
  signature: string;
  random_str: string;
  refund_amount: number;
  refund_password: number;
  refund_reason?: string;
}

export interface MPMTransactionParams {
  merchant_id: number;
  terminal_id?: string;
  config_id: number;
  reference_id: string;
  signature: string;
  random_str: string;
}

export interface MPMGetChannelSummaryParams {
  merchant_id: number;
  terminal_id?: string;
  config_id: number;
  signature: string;
  random_str: string;
  start_date: Date;
  end_date: Date;
}
