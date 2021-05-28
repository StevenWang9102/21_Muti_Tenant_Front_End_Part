import { Dispatch } from "react";

export interface BranchSettingInterface {
  allBranchInfo?: any[];
  OneBranchInfo?: any[];
  visibleOfEdit?: boolean;
  warningMessage?: any;
}

interface EditNameModelInterface {
  fromPage?: string,
  dispatch: Dispatch,
  allBranchInfo?: any[] | undefined, 
  visible?: boolean,
  checkStatus?: boolean,
  loadingOfSwitch?: boolean,
  onOkButtonClick?: ()=>void,
  onCancelButtonClick?: ()=>void,
  setActiveKey?: (string)=>void,
  singleRecord?: any,
  currentShortName?:string,
  currentLegalName?:string,
  currentTradingName?:string,
  warningMessage?:string,
  setShortName?:(string)=>void,
  setLegalName?:(string)=>void,
  setTradinglName?:(string)=>void,
}

export interface SingleLineRecordInterface {
  id?: number,
  key: string;
  legalName: string;
  shortName: string;
  tag?: Array;
  tradingName: string;
  tags: Array,
  isInactive: boolean,
}

export interface EditTagsModelInterface {
  dispatch: Dispatch,
  allBranchInfo?: any[] | undefined, 
  singleRecord: SingleLineRecordInterface | any,
  visible: boolean,
  key?: string,
  legalName?: string,
  tradingName?: string,
  shortName?: string,
  tags?: Array,
  currentPage: string,
  size?:string,
  onOkButtonClick: ()=>void,
  onCancelButtonClick: ()=>void,
  requestOnRadioButtonChange?: ()=>void,
}

// export interface EditNameModelInterface {
//   fromPage?: string,
//   dispatch: Dispatch,
//   allBranchInfo?: any[] | undefined, 
//   singleRecord?: SingleLineRecordInterface | any,
//   visible?: boolean,
//   checkStatus?: boolean,
//   loadingOfSwitch?: boolean,
//   onOkButtonClick?: ()=>void,
//   onCancelButtonClick?: ()=>void,
  
//   currentShortName?:string,
//   currentLegalName?:string,
//   currentTradingName?:string,
//   setShortName?:(string)=>void,
//   setLegalName?:(string)=>void,
//   setTradinglName?:(string)=>void,
// }

export interface dataInterface {
  shortName?: string,
  tradingName?: string, 
}

export interface payloadInterface {
  branchId?: string,
  role?: string,
  value?: object,
  status?: object,
}


