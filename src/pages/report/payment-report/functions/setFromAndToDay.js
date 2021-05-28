import { year, month, today, yesterday, startDay, endDay} from './dates';
import { thisWeekStart, thisWeekEnd, thisMonthStart, thisMonthEnd} from './dates';
import { lastWeekStart, lastWeekEnd, lastMonthStart, lastMonthEnd} from './dates';
import { lastThreeMonthStart, lastThreeMonthEnd} from '../../public-tools/functions/dates';

import dateFormat from "dateformat";


export const setFromAndToDay = (type, startTimeOfTimePicker, endTimeOfTimePicker) => {
  console.log(type);
  console.log(startTimeOfTimePicker);
  console.log(endTimeOfTimePicker);

  let startAndEndDay = {}

  // 特定格式的月: 2020-9
  let currentYearMonth = `${year}-${month + 1}`
  let lastYearMonth = `${year - 1}-${month + 1}`

  // 特定格式：2019/01
  let startTimeFormated = startTimeOfTimePicker && startTimeOfTimePicker.replace(/\-/g, '/').slice(0, 7)
  let endTimeFormated = endTimeOfTimePicker && endTimeOfTimePicker.replace(/\-/g, '/').slice(0, 7)

  if (type === '') {
    startAndEndDay.start = dateFormat(today, "yyyy-mm-dd")
    startAndEndDay.end = dateFormat(today, "yyyy-mm-dd")
  }

  if (type === 'Last 12 Month') {
    startAndEndDay.start = currentYearMonth
    startAndEndDay.end = lastYearMonth
  }

  if (type === 'Only_Date_Search') {
    startAndEndDay.start = dateFormat(startTimeFormated, "yyyy-mm-dd")
    startAndEndDay.end = dateFormat(endTimeFormated, "yyyy-mm-dd")
  }

  if (type === 'Data with All Date') {
    startAndEndDay.start = startTimeOfTimePicker
    startAndEndDay.end = endTimeOfTimePicker
  }

  if (type === 'Today') {
    startAndEndDay.start = dateFormat(today, "yyyy-mm-dd")
    startAndEndDay.end = dateFormat(today, "yyyy-mm-dd")
  }

  if (type === 'Yesterday') {
    startAndEndDay.start = dateFormat(yesterday, "yyyy-mm-dd")
    startAndEndDay.end = dateFormat(yesterday, "yyyy-mm-dd")
  }

  if (type === 'This Week') {
    startAndEndDay.start = thisWeekStart
    startAndEndDay.end = thisWeekEnd
  }

  if (type === 'This Month') {
    startAndEndDay.start = thisMonthStart
    startAndEndDay.end = thisMonthEnd
  }

  if (type === 'Last Week') {
    startAndEndDay.start = dateFormat(lastWeekStart, "yyyy-mm-dd")
    startAndEndDay.end = dateFormat(lastWeekEnd, "yyyy-mm-dd")
  }

  if (type === 'Last Month') {
    startAndEndDay.start = lastMonthStart
    startAndEndDay.end = lastMonthEnd
  }

  if (type === 'Last Three Month') {
    startAndEndDay.start = lastThreeMonthStart
    startAndEndDay.end = lastThreeMonthEnd
  }

  return startAndEndDay  
}