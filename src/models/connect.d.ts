import { MenuDataItem, Settings as ProSettings } from '@ant-design/pro-layout';
import { GlobalModelState } from './global';
import { UserModelState } from './user';
import { StateType } from './login';
import { MenuModelState } from './menu'; //本次菜单

export { GlobalModelState, UserModelState, MenuModelState };//MenuModelState本次菜单

export interface Loading {
  global: boolean;
  effects: { [key: string]: boolean | undefined };
  models: {
    global?: boolean;
    menu?: boolean;
    setting?: boolean;
    user?: boolean;
    login?: boolean;
  };
}

export interface ConnectState {
  global: GlobalModelState;
  loading: Loading;
  settings: ProSettings;
  user: UserModelState;
  login: StateType;
  menu: MenuModelState;//MenuModelState本次菜单
}

export interface Route extends MenuDataItem {
  routes?: Route[];
}
