import dateFormat from "dateformat";
import moment from 'moment';

// 基础时间
export const myDate = new Date();

export const year = myDate.getFullYear() // 获取当前年份
export const month = myDate.getMonth() // 获取当前月份（注意需要+1）

//计算本月有多少天
const getSpecial31 = () =>{
    let special31 = 0
    if(month===1 ||month===3 ||month===5 ||month===7 ||month===9 ||month===11 ||month===12) {
        special31 = 1
    } else if (month===2) {
        if(year % 4 === 0){
            special31 = -2
        } else{
            special31= -1
        }
    } else {
        special31 = 0
    }
    return special31
}

export const monthDay = myDate.getDate() // 获取当前日期
export const weekDay =myDate.getDay() // 获取当前星期

export const today = myDate.getTime() // 获取当前时间（毫秒）

export const yesterday = myDate.getTime() - 24*60*60*1000
export const tomorrow = myDate.getTime() + 24*60*60*1000

export const weeksDays = ['Mon','Tues','Wed','Thur','Fri','Sat','Sun']
export const monthsNames = ['Jan','Feb','Mar','Apr','May','Jun', 'Jul', "Aug", "Sep", "Oct", "Nov", "Dec"]
export const monthsNames2 = ['Jan','Feb','Mar','Apr','May','Jun', 'Jul', "Aug", "Sep", "Oct", "Nov", "Dec",
'Jan','Feb','Mar','Apr','May','Jun', 'Jul', "Aug", "Sep", "Oct", "Nov", "Dec"]

// 默认
export const defaultStart = today - 2*365*24*60*60*1000
export const defaultEnd = today - 24*60*60*1000

// 本周起止时间
var first = myDate.getDate() - myDate.getDay(); // First day is the day of the month - the day of the week
var last = first + 6; // last day is the first day + 6

var oneDaySeconds = 24*60*60*1000

export const thisWeekStart = today - (myDate.getDay() -1)* oneDaySeconds
export const thisWeekEnd= today - (myDate.getDay() -1)* oneDaySeconds + 6*oneDaySeconds
export const thisMon =  today - (myDate.getDay()-1) * oneDaySeconds- 0*24*60*60*1000
export const thisTues =  today - (myDate.getDay()-1) * oneDaySeconds+ 1*24*60*60*1000
export const thisWed =  today - (myDate.getDay()-1) * oneDaySeconds+ 2*24*60*60*1000
export const thisThur =  today - (myDate.getDay()-1) * oneDaySeconds+ 3*24*60*60*1000
export const thisFri =  today - (myDate.getDay()-1) * oneDaySeconds+ 4*24*60*60*1000
export const thisSat =  today - (myDate.getDay()-1) * oneDaySeconds+ 5*24*60*60*1000
export const thisSun =  today - (myDate.getDay()-1) * oneDaySeconds+ 6*24*60*60*1000


const indexDay =()=> {
    return Math.ceil(( new Date() - new Date(new Date().getFullYear().toString()))/(24*60*60*1000))+1;;
}

// 上周的起止时间
export const lastWeekStart = today - (myDate.getDay()-1) * oneDaySeconds- 7*24*60*60*1000
export const lastWeekEnd = today - (myDate.getDay()-1) * oneDaySeconds- 1*24*60*60*1000


export const lastMon =  today - (myDate.getDay()-1) * oneDaySeconds- 7*24*60*60*1000
export const lastTues =  today - (myDate.getDay()-1) * oneDaySeconds- 6*24*60*60*1000
export const lastWed =  today - (myDate.getDay()-1) * oneDaySeconds- 5*24*60*60*1000
export const lastThur =  today - (myDate.getDay()-1) * oneDaySeconds- 4*24*60*60*1000
export const lastFri =  today - (myDate.getDay()-1) * oneDaySeconds- 3*24*60*60*1000
export const lastSat =  today - (myDate.getDay()-1) * oneDaySeconds- 2*24*60*60*1000
export const lastSun =  today - (myDate.getDay()-1) * oneDaySeconds- 1*24*60*60*1000



const myFormatOfThisWeek1 = "yyyy-mm-d"
export const thisWeekDaysFormated = [
    dateFormat(thisMon, myFormatOfThisWeek1),
    dateFormat(thisTues, myFormatOfThisWeek1),
    dateFormat(thisWed, myFormatOfThisWeek1),
    dateFormat(thisThur, myFormatOfThisWeek1),
    dateFormat(thisFri, myFormatOfThisWeek1),
    dateFormat(thisSat, myFormatOfThisWeek1),
    dateFormat(thisSun, myFormatOfThisWeek1),
]

const myFormatOfThisWeek2 = "yyyy-mm-dd"
export const thisWeekDaysFormated2 = [
    dateFormat(thisMon, myFormatOfThisWeek2),
    dateFormat(thisTues, myFormatOfThisWeek2),
    dateFormat(thisWed, myFormatOfThisWeek2),
    dateFormat(thisThur, myFormatOfThisWeek2),
    dateFormat(thisFri, myFormatOfThisWeek2),
    dateFormat(thisSat, myFormatOfThisWeek2),
    dateFormat(thisSun, myFormatOfThisWeek2),
]

const myFormatOfThisWeek3 = "dd/mmm"
export const thisWeekDaysFormated3 = [
    dateFormat(thisMon, myFormatOfThisWeek3),
    dateFormat(thisTues, myFormatOfThisWeek3),
    dateFormat(thisWed, myFormatOfThisWeek3),
    dateFormat(thisThur, myFormatOfThisWeek3),
    dateFormat(thisFri, myFormatOfThisWeek3),
    dateFormat(thisSat, myFormatOfThisWeek3),
    dateFormat(thisSun, myFormatOfThisWeek3),
]

export const lastWeekDaysFormated = [
    dateFormat(lastMon, "yyyy-mm-d"),
    dateFormat(lastTues, "yyyy-mm-d"),
    dateFormat(lastWed, "yyyy-mm-d"),
    dateFormat(lastThur, "yyyy-mm-d"),
    dateFormat(lastFri, "yyyy-mm-d"),
    dateFormat(lastSat, "yyyy-mm-d"),
    dateFormat(lastSun, "yyyy-mm-d"),
]

const myFormat2="dd/mmm"
export const lastWeekDaysFormated2 = [
    dateFormat(lastMon, myFormat2),
    dateFormat(lastTues, myFormat2),
    dateFormat(lastWed, myFormat2),
    dateFormat(lastThur, myFormat2),
    dateFormat(lastFri, myFormat2),
    dateFormat(lastSat, myFormat2),
    dateFormat(lastSun, myFormat2),
]

const myFormatOfLastWeek = "yyyy-mm-dd"
export const lastWeekDaysFormated1 = [
    dateFormat(lastMon, myFormatOfLastWeek),
    dateFormat(lastTues, myFormatOfLastWeek),
    dateFormat(lastWed, myFormatOfLastWeek),
    dateFormat(lastThur, myFormatOfLastWeek),
    dateFormat(lastFri, myFormatOfLastWeek),
    dateFormat(lastSat, myFormatOfLastWeek),
    dateFormat(lastSun, myFormatOfLastWeek),
]

export const clearFromNow = (myDate.getDate()-1) * oneDaySeconds

// 上个月的起止时间
export const lastMonthStart = today - (myDate.getDate()-1) * oneDaySeconds - 31* oneDaySeconds 
export const lastMonthEnd = today - (myDate.getDate()-1) * oneDaySeconds - 2* oneDaySeconds 

// 上个月的起止时间(Moment.js版本)
export const lastMonthStartMoment =  moment().subtract(myDate.getDate()-1, 'days').subtract(1, 'month')
export const lastMonthEndMoment = moment().subtract(myDate.getDate()-1, 'days').subtract(1, 'days')

// 本月的起止时间
export const thisMonthStart = today - (myDate.getDate()-1) * oneDaySeconds
export const thisMonthEnd = today - (myDate.getDate()) * oneDaySeconds + 30* oneDaySeconds

// 本月的起止时间(Moment.js版本)
export const thisMonthStartMoment = moment().subtract(myDate.getDate()-1, 'days')
export const thisMonthEndMoment = moment().subtract(myDate.getDate(), 'days').add(1, 'month')

// 上十二个月的起止时间
export const last12MonthStart = today - clearFromNow - oneDaySeconds - 365*oneDaySeconds
export const last12MonthEnd = today - clearFromNow - oneDaySeconds

// 今年的起止时间
export const thisYearStart = today - (indexDay()-1)* oneDaySeconds // 微调过，待定
export const thisYearEnd = today - indexDay()* oneDaySeconds + 366*oneDaySeconds// 微调过，待定

// 去年的起止时间
export const lastYearStart = today - (indexDay()-1-1)* oneDaySeconds - 365*oneDaySeconds // 微调过，待定
export const lastYearEnd = today - (indexDay()-1)* oneDaySeconds + 0*oneDaySeconds // 微调过，待定

// 上三个月的起止时间
export const lastThreeMonthStart = today - (myDate.getDate()+1) * oneDaySeconds - 3*30* oneDaySeconds 
export const lastThreeMonthEnd = today - (myDate.getDate()) * oneDaySeconds

// 上三个月的起止时间(Moment.js版本)
export const lastThreeMonthStartMoment = moment().subtract(myDate.getDate()+1, 'days').subtract(90, 'days')
export const lastThreeMonthEndMoment = moment().subtract(myDate.getDate()+1, 'days')
