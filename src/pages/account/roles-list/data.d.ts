import { Dispatch } from "react";

export interface RoleManagementInterface {
  dispatch: Dispatch;
  submitting?: boolean;
  submittingOfChangeAllNames?: boolean;
  submittingOfChangeAllRoles?: boolean;
  submittingOfChangeFullName?: boolean;
  submittingOfNewUser?: boolean;
  roleManagementPro?: LocalPropsInterface;
}


export interface LocalPropsInterface {
  allUserInformation?: any[];
  oneUserInformation?: any[];
  OneBranchInfo?: any[];
  allBranchNames?: any[];
  allRoles: any[];
  visible?: boolean;
  visibleOfNewUser: boolean;
}


export interface SingleLineRecordInterface {
  key: string;
  rolename?: string;
  tags?: Array,
}

export interface EditTagsModelInterface {
  dispatch: Dispatch,
  allUserInformation?: any[] | undefined, 
  oneUserInformation?: any[] | undefined, 
  singleRecord: SingleLineRecordInterface | any,
  visible: boolean,
  key?: string,
  legalName?: string,
  tradingName?: string,
  shortName?: string,
  tags?: Array,
  isActiveChecked: boolean | undefined,
  isShopChecked: boolean | undefined,
  isFranchiseeChecked: boolean | undefined,
  onOkButtonClick?: ()=>void,
  onCancelButtonClick: ()=>void,
  setActiveChecked: (boolean)=>void,
  setShopChecked: (boolean)=>void,
  setFranchiseeChecked: (boolean)=>void,
  refreshAllBranchesData: ()=>void,
}

export interface EditNameModelInterface {
  dispatch: Dispatch,
  allUserInformation?: any[] | undefined, 
  oneUserInformation?: any[] | undefined, 
  singleRecord: SingleLineRecordInterface | any,
  visible: boolean,
  setVisible?: (boolean)=>void,
  currentUserInfo: {
    id: string,
    firstName: string,
    middleName: string,
    lastName:string,
    moniker:string,
    code: string,
    phone: string,
    email: string,
    isInactive: boolean,
    phoneNumber: string
  } | undefined, 
  checkStatus?: boolean,
  currentUserId?: string,
  onOkButtonClick?: ()=>void,
  onCancelButtonClick: ()=>void,
}

export interface AddUserlInterface {
  dispatch: Dispatch,
  allUserInformation?: any[] | undefined, 
  allBranchInformation?: any[] | undefined, 
  allRoles?: any[] | undefined, 
  submittingOfNewUser?: boolean;
  visible: boolean,
  currentPage?: string,
  currentRoleInfo?:{
    name: string,
    id: string,
  },
  currentUserId?: string | undefined, 
  onOkButtonClick?: ()=>void,
  onCancelButtonClick: ()=>void,
}

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


