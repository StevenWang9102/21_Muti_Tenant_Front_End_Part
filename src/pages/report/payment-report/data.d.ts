import { Dispatch } from "react";

export interface UserManagementInterface {
  allUserInformation?: any[];
  oneUserInformation?: any[];
  visible?: boolean;
  visibleOfNewUser?: boolean;
}

export interface EditNameModelInterface {
  warningMessage?: object[any];
  currentUserInfo?: object[any];
  dispatch?: Dispatch
  visible?: boolean;
  onCancelButtonClick?: ()=>void
}



export interface SingleLineRecordInterface {
  key?: any;
  fullName?: string;
  id?: string;
  code?: string;
  moniker?: string;
  email?: string;
  phone?: string;
  singleRecord?: any,
  tags?: Array,
}

export interface AddUserlInterface {
  dispatch: Dispatch,
  allUserInformation?: any[] | undefined, 
  allBranchInformation?: any[] | undefined, 
  allRoles?: any[] | undefined, 
  warningMessage?: string | undefined,
  submittingOfNewUser?: boolean;
  visible: boolean,
  currentUserId?: string | undefined, 
  selectedRoleIndex?: Array[any]
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

export interface Label {
  id: number;
  node_id: string;
  url: string;
  name: string;
  color: string;
  default: boolean;
  description: string;
}

export interface User {
  login: string;
  id: number;
  node_id: string;
  avatar_url: string;
  gravatar_id: string;
  url: string;
  html_url: string;
  followers_url: string;
  following_url: string;
  gists_url: string;
  starred_url: string;
  subscriptions_url: string;
  organizations_url: string;
  repos_url: string;
  events_url: string;
  received_events_url: string;
  type: string;
  site_admin: boolean;
}
