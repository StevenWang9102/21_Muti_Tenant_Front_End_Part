import dateFormat from 'dateformat';
import {
  today,
  yesterday,
  thisWeekStart,
  thisWeekEnd,
  thisMonthStart,
  thisMonthEnd,
  lastWeekStart,
  lastWeekEnd,
  lastMonthStart,
  lastMonthEnd,
} from './dates';
import { lastThreeMonthStart, lastThreeMonthEnd } from '../../public-tools/functions/dates';


export const setRequestTime = (type, startTime, endTime) => {
  let timeRange = ['', ''];
  if (type === 'Branch_Date_Search') {
    timeRange = [startTime.replace(/\//g, '-'), endTime.replace(/\//g, '-')];
  }

  if (type === 'Only_Date_Search') {
    timeRange = [startTime.replace(/\//g, '-'), endTime.replace(/\//g, '-')];
  }

  if (type === 'Today') {
    timeRange[0] = dateFormat(today, 'yyyy-mm-dd');
  }

  if (type === 'Yesterday') {
    timeRange[0] = dateFormat(yesterday, 'yyyy-mm-dd');
  }

  if (type === 'This Week') {
    timeRange = [thisWeekStart, thisWeekEnd];
  }

  if (type === 'This Month') {
    timeRange = [thisMonthStart, thisMonthEnd];
  }

  if (type === 'Last Week') {
    timeRange = [dateFormat(lastWeekStart, 'yyyy-mm-dd'), dateFormat(lastWeekEnd, 'yyyy-mm-dd')];
  }

  if (type === 'Last Month') {
    timeRange = [lastMonthStart, lastMonthEnd];
  }

  if (type === 'Last Three Month') {
    timeRange = [lastThreeMonthStart, lastThreeMonthEnd];
  }

  return timeRange;
};
