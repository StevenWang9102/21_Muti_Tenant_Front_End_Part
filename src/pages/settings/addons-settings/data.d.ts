import { TableListItem as PaymentModesParams } from '../../settings/payment-modes-list/data.d';
import jsonpatch from 'fast-json-patch';

export interface AddonsData {
  myPOSMateAttributes: AddonsParams[];
  paymentModesList: PaymentModesParams[];
  receiptPrinterAttributes: AddonsParams[];
}

export interface MyPOSMateAttributes {
  myPOSMateEnable: string;
  merchantAccountId: string;
  merchantId: string;
  configId: string;
  paymentModeId: string;
}

export interface ReceiptPrinterAttributes {
  receiptPrinterEnable: string;
  receiptPrinterName: string;
  receiptPrinterIpAddress: string;
}

export interface AddonsParams {
  id?: number;
  branchId?: number;
  type?: string;
  name?: string;
  value?: string;
  jsonpatchOperation?: jsonpatch.Operation[];
}