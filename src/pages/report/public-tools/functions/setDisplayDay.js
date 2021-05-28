import { year, month, today, yesterday, startDay, endDay} from './dates';
import { thisWeekStart, thisWeekEnd, thisMonthStart, thisMonthEnd} from './dates';
import { lastWeekStart, lastWeekEnd, lastMonthStart, lastMonthEnd} from './dates';
import { tomorrow, last12MonthStart} from './dates';
import { last12MonthEnd, thisYearStart, thisYearEnd} from './dates';
import { lastMonthStartMoment, lastMonthEndMoment} from './dates';
import { thisMonthStartMoment, thisMonthEndMoment} from './dates';
import { lastThreeMonthStart, lastThreeMonthEnd } from './dates';
import dateFormat from "dateformat";


export const setFromAndToDay = (type, startTimeOfTimePicker, endTimeOfTimePicker) => {

  let startAndEndDay = {}
  let myFormate = "dd-mm-yyyy"
  let momentFormate = 'DD MMM YYYY'

  console.log(type);

  if (type === 'Only_Date_Search') {
    startAndEndDay.start = dateFormat(startTimeOfTimePicker, myFormate)
    startAndEndDay.end = dateFormat(endTimeOfTimePicker, myFormate)
  }


  // 有分支的显示清空
  if (type === 'Branch_Date_Search') {
    startAndEndDay.start = dateFormat(startTimeOfTimePicker, myFormate)
    startAndEndDay.end = dateFormat(endTimeOfTimePicker, myFormate)
  }

  console.log(startAndEndDay);


  if (type === 'Data with All Date') {
    startAndEndDay.start = dateFormat(startTimeOfTimePicker, myFormate)
    startAndEndDay.end = dateFormat(endTimeOfTimePicker, myFormate)
  }

  if (type === 'Today') {
    startAndEndDay.start = dateFormat(today, myFormate)
    startAndEndDay.end = dateFormat(tomorrow, myFormate)
  }

  if (type === 'Yesterday') {
    startAndEndDay.start = dateFormat(yesterday, myFormate)
    startAndEndDay.end = dateFormat(today, myFormate)
  }

  if (type === 'This Week') {
    startAndEndDay.start = dateFormat(thisWeekStart, myFormate)
    startAndEndDay.end = dateFormat(thisWeekEnd, myFormate)
  }

  if (type === 'This Month') {
    startAndEndDay.start = dateFormat(thisMonthStartMoment, myFormate)
    startAndEndDay.end = dateFormat(thisMonthEndMoment, myFormate) 
  }

  if (type === 'Last Week') {
    startAndEndDay.start = dateFormat(lastWeekStart, myFormate)
    startAndEndDay.end = dateFormat(lastWeekEnd, myFormate)
  }

  if (type === 'Last Month') {
    startAndEndDay.start =  dateFormat(lastMonthStartMoment, myFormate)
    startAndEndDay.end =  dateFormat(lastMonthEndMoment, myFormate)
  }

  if (type === 'Last Three Month') {
    startAndEndDay.start = dateFormat(lastThreeMonthStart, myFormate)
    startAndEndDay.end = dateFormat(lastThreeMonthEnd, myFormate)
  }

  if (type === 'This Year') {
    startAndEndDay.start = dateFormat(thisYearStart, myFormate)
    startAndEndDay.end = dateFormat(thisYearEnd, myFormate)
  }

  if (type === 'Last 12 Month') {
    startAndEndDay.start = dateFormat(last12MonthStart, myFormate)
    startAndEndDay.end = dateFormat(last12MonthEnd, myFormate)
  }

  if (type === 'Compared With Last Year') {
    startAndEndDay.start = undefined
    startAndEndDay.end = undefined
  }

  return startAndEndDay  
}