
export interface AnalysisData {
  invoiceSummaryData: Partial<InvoiceSummaryData>;
  dailyPaymentsData: PaymentsData[];
  hourlyPaymentsData: PaymentsData[];
  weeklkPaymentsData: PaymentsData[];
  monthlyPaymentsData: PaymentsData[];
  yearlyPaymentsData: PaymentsData[];
  paymentsByModeData: PaymentsData[];
  categorySalesData: CategorySalesData[];
  top10SoldItemsBestSellingData: Top10SoldItemsData[];
  top10SoldItemsSlowSellingData: Top10SoldItemsData[];
}

export interface InvoiceSummaryData {
  totalInclGst: number;
  totalExclGst: number;
  transactionQuantity: number;
}

export interface CategorySalesData {
  categoryId: number;
  categoryName: string;
  amountInclGst: number;
  amountExclGst: number;
}

export interface PaymentsData {
  hour?: number;
  date?: string;
  month?: number;
  year?: number;
  mode?: string;
  startDate?: string;
  endDate?: string;
  totalInclGst: number;
  totalExclGst: number;
}

export interface DataParams {
  startdatetime?: string;
  enddatetime?: string;
  backwards?: boolean;
}

export interface Top10SoldItemsData {
  itemId: number;
  itemName: string;
  quantity: number;
}

export interface BarDataType {
  x: string;
  y: number;
}

export interface PieDataType {
  x: string;
  y: number;
}