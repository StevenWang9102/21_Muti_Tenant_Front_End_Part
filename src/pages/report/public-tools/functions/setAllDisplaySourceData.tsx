import { sourceDataFilter } from './sourceDataFilter'
import { setFromAndToDay } from './setDisplayDay'


export const setAllDisplaySourceData = (
  fromPage: string,
  souceLocal: any,
  setSourceData: (any) => void,
  searchType: string,
  startTimeOfTimePicker: any,
  endTimeOfTimePicker: any,
  setDisplayTime: (array) => void,
  currentBranchName: string,
  setCurrentBranchTitle: (string) => void,
) => {

  // 数据源
  const length = souceLocal && souceLocal.length;
  const sourceData = sourceDataFilter(searchType, length, souceLocal, startTimeOfTimePicker, endTimeOfTimePicker, true, fromPage);

  console.log("sourceData491 =",  sourceData);
  setSourceData(sourceData);

  // 显示时间
  let days = setFromAndToDay(searchType, startTimeOfTimePicker, endTimeOfTimePicker);
  console.log("计算出的days =", days);

  setDisplayTime(days);

  // 显示标题
  setCurrentBranchTitle(currentBranchName)

  console.log("searchType =", searchType);
  console.log("startTimeOfTimePicker=", startTimeOfTimePicker);
  console.log('startTimeOfTimePicker', endTimeOfTimePicker);
}