import dateFormat from 'dateformat'
import {
  today, yesterday, thisWeekStart, 
  thisWeekEnd, thisMonthStart,
  thisMonthEnd, lastWeekStart, 
  lastWeekEnd, lastMonthStart, lastMonthEnd,
  lastMonthStartMoment, lastMonthEndMoment, 
  thisMonthStartMoment, thisMonthEndMoment,
  lastThreeMonthStart, lastThreeMonthEnd, 
  tomorrow, thisYearStart, thisYearEnd,
  last12MonthStart, last12MonthEnd, 
  lastYearStart, lastYearEnd
} from './dates';


export const setRequestTime = (type, startTime, endTime) => {

  console.log(type);

  let timeRange = ['', '', '', '']
  let myFormate1 = "yyyy-mm-dd"
  let myFormate2 = "yyyy-mm-dd"


  if (type === 'Branch_Date_Search') {
    timeRange[0] = dateFormat(startTime, myFormate1)
    timeRange[1] = dateFormat(endTime, myFormate1)
  }

  if (type === 'Only_Date_Search') {   
    timeRange[0] = dateFormat(startTime, myFormate1)
    timeRange[1] = dateFormat(endTime, myFormate1)
  }

  if (type === 'Today') {
    timeRange[0] = dateFormat(today, myFormate1)
    timeRange[1] = dateFormat(tomorrow, myFormate1)
  }

  if (type === 'Yesterday') {
    timeRange[0] = dateFormat(yesterday, myFormate1)
    timeRange[1] = dateFormat(today, myFormate1)
  }

  if (type === 'This Week') {
    timeRange[0] = dateFormat(thisWeekStart, myFormate1)
    timeRange[1] = dateFormat(thisWeekEnd, myFormate1)
  }

  if (type === 'This Month') {
    timeRange[0] = dateFormat(thisMonthStartMoment, myFormate1)
    timeRange[1] = dateFormat(thisMonthEndMoment, myFormate1)
  }

  if (type === 'This Year') {
    timeRange[0] = dateFormat(thisYearStart, myFormate1)
    timeRange[1] = dateFormat(thisYearEnd, myFormate1)
  }

  if (type === 'Last 12 Month') {
    timeRange[0] = dateFormat(last12MonthStart, myFormate1)
    timeRange[1] = dateFormat(last12MonthEnd, myFormate1)
  }

  if (type === 'Last Week') {
    timeRange[0] = dateFormat(lastWeekStart, myFormate1)
    timeRange[1] = dateFormat(lastWeekEnd, myFormate1)
  }

  if (type === 'Last Month') {
    timeRange[0] = dateFormat(lastMonthStartMoment, myFormate1)
    timeRange[1] = dateFormat(lastMonthEndMoment, myFormate1)
  }

  if (type === 'Last Three Month') {
    timeRange[0] = dateFormat(lastThreeMonthStart, myFormate1)
    timeRange[1] = dateFormat(lastThreeMonthEnd, myFormate1)
  }

  if (type === 'Compared With Last Year') {
    timeRange[0] = dateFormat(lastYearStart, myFormate1)
    timeRange[1] = dateFormat(lastYearEnd, myFormate1)
    timeRange[2] = dateFormat(thisYearStart, myFormate1)
    timeRange[3] = dateFormat(thisYearEnd, myFormate1)
  }

  return timeRange
}