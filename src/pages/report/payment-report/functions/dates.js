import dateFormat from "dateformat";



// 基础时间
export const myDate = new Date();
export const year = myDate.getFullYear() 
export const month = myDate.getMonth() 
export const today = myDate.getTime() // 毫秒形式
export const yesterday = myDate.getTime() - 24*60*60*1000

// 默认
export const defaultStart = today - 2*365*24*60*60*1000
export const defaultEnd = today - 24*60*60*1000

// 本周起止时间
var first = myDate.getDate() - myDate.getDay(); // First day is the day of the month - the day of the week
var last = first + 6; // last day is the first day + 6

export const thisWeekStart = `${year}-${month+1}-${first+1}`
export const thisWeekEnd= `${year}-${month+1}-${last+1}`

// 上周的起止时间
export const lastWeekStart = today - (myDate.getDay()-1) * 24*60*60*1000 - 7*24*60*60*1000
export const lastWeekEnd = today - (myDate.getDay()-1) * 24*60*60*1000 - 1*24*60*60*1000


// 上个月的起止时间
export const lastMonthStart = month===1? `${year-1}-${12}-${1}`: `${year}-${month}-${1}`
export const lastMonthEnd = month===1? `${year-1}-${12}-${30}`: `${year}-${month}-${30}`


// 本月的起止时间
export const thisMonthStart = month===1? `${year-1}-${12}-${1}`: `${year}-${month+1}-${1}`
export const thisMonthEnd = month===1? `${year-1}-${12}-${30}`: `${year}-${month+1}-${30}`

