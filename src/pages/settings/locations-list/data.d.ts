import { Dispatch } from "react";

export interface LocationInterface {
  dispatch?: Dispatch;
  visible?: boolean;
  visibleOfNewUser?:boolean;
  visibleOfSelectBranch?:boolean;
  submitting?: boolean;
  submittingOfChangeAllNames?: boolean;
  submittingOfChangeAllRoles?: boolean;
  loadingOfSwitch?: boolean;
  location?: LocalPropsInterface;
  submittingOfSwitch?: boolean;
  submittingEditLocation?: boolean;
  loadingOfCreateLocation?: boolean;
}

export interface EditNameModelInterface{
  fromPage?: string,
  allLocations?: any[];
  selectedBranchId?: number;
  visible?: boolean;
  loading?: boolean;
  dispatch: Dispatch,
  currentLocationId?: number;
  currentLocationInfo?: object;
  loadingOfCreate?: boolean;
  onCancelButtonClick?: ()=> void
}

export interface SelectBranchInterface {
  dispatch: Dispatch,
  currentBranchName: string,
  allLocations?: any[] | undefined, 
  allBranchInformation?: any[] | undefined, 
  allRoles?: any[] | undefined, 
  selectedBranchId?: number | undefined,
  submittingOfNewUser?: boolean;
  visible: boolean,
  selectedBranchIndex?: number | undefined, 
  currentUserId?: string | undefined, 
  setSelectedBranchId?: (string)=>void,
  dispatchFunction?: (name: string, parm: boolean)=>void,
  onOkButtonClick?: ()=>void,
  onCancelButtonClick?: ()=>void,
  setCurrentBranchName?: ()=>void,
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

export interface ProtablePropsInterface {
  url: string;
  repository_url: string;
  labels_url: string;
  comments_url: string;
  events_url: string;
  html_url: string;
  id: number;
  node_id: string;
  number: number;
  title: string;
  user: User;
  labels: Label[];
  state: string;
  locked: boolean;
  assignee?: any;
  assignees: any[];
  milestone?: any;
  comments: number;
  created_at: string;
  updated_at: string;
  closed_at?: any;
  author_association: string;
  body: string;
}
