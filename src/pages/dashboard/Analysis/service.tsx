import request from 'umi-request';
import { getAuthHeader, getToken } from '@/utils/authority';
import qs from 'qs';
import { DataParams } from './data.d';

const getAuth = ()=> {
  const gposToken = getToken();
  const authHeader = gposToken !== null ? getAuthHeader(gposToken) : {};
  return authHeader
}
const INVOICE_SUMMARY = '/server/api/reports/dashboard/invoicesummary?';
const DAILY_PAYMENTS = '/server/api/reports/SalesByDateReport?';
const HOURLY_PAYMENTS = '/server/api/reports/SalesByHourReport?';
const WEEKLY_PAYMENTS = '/server/api/reports/weeklyPayments?';
const MONTHLY_PAYMENTS = '/server/api/reports/SalesByMonthReport?';
const YEARLY_PAYMENTS = '/server/api/reports/yearlyPayments?';
const PAYMENTS_BY_MODE = '/server/api/reports/PaymentsByMode?';
const CATEGORY_SALES = '/server/api/reports/SalesByCategoryReport?';
const TOP10_SOLD_ITEMS = '/server/api/reports/SalesByItemReport?';

export async function fetchInvoiceSummary(params: DataParams) {
}

export async function fetchDailyPayments(params: DataParams) {
  return request(`${DAILY_PAYMENTS}${qs.stringify(params)}`, {
    ...getAuth(),
  });
}

export async function fetchHourlyPayments(params: DataParams) {
  return request(`${HOURLY_PAYMENTS}${qs.stringify(params)}`, {
    ...getAuth(),
  });
}

export async function fetchWeeklyPayments(params: DataParams) {
  return request(`${WEEKLY_PAYMENTS}${qs.stringify(params)}`, {
    ...getAuth(),
  });
}

export async function fetchMonthlyPayments(params: DataParams) {
  return request(`${MONTHLY_PAYMENTS}${qs.stringify(params)}`, {
    ...getAuth(),
  });
}

export async function fetchYearlyPayments(params: DataParams) {
  return request(`${YEARLY_PAYMENTS}${qs.stringify(params)}`, {
    ...getAuth(),
  });
}

export async function fetchPaymentsByMode(params: DataParams) {
  return request(`${PAYMENTS_BY_MODE}${qs.stringify(params)}`, {
    ...getAuth(),
  });
}

export async function fetchCategorySales(params: DataParams) {
  return request(`${CATEGORY_SALES}${qs.stringify(params)}`, {
    ...getAuth(),
  });
}

export async function fetchTop10SoldItems(params: DataParams) {
  return request(`${TOP10_SOLD_ITEMS}${qs.stringify(params)}`, {
    ...getAuth(),
  });
}