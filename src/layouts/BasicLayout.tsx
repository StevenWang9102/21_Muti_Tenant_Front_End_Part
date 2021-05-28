import ProLayout, {
  MenuDataItem,
  BasicLayoutProps as ProLayoutProps,
  Settings,
  DefaultFooter,
} from '@ant-design/pro-layout';
import React, { useEffect } from 'react';
import { Link, useIntl, connect, Dispatch } from 'umi';
import { Result, Button } from 'antd';
import Authorized from '@/utils/Authorized';
import RightContent from '@/components/GlobalHeader/RightContent';
import { ConnectState } from '@/models/connect';
import { getAuthorityFromRouter } from '@/utils/utils';
import logo from '../assets/logo_classic.png';
import { IsSuperAdmin, IsTenantAdmin } from '@/utils/authority';
import { useLocation } from 'react-router-dom'

import {
  GithubOutlined,
  SmileOutlined,
  SettingOutlined,
  FormOutlined,
  AccountBookOutlined,
  WechatOutlined,
  GiftOutlined,
  AppstoreOutlined,
  TeamOutlined,
  BarsOutlined,
  DashboardOutlined,
  WarningOutlined,
  UserOutlined,
  TableOutlined,
  ClusterOutlined,
  BarcodeOutlined,
  BlockOutlined,
  LaptopOutlined,
} from '@ant-design/icons';

const iconEnum = {
  smile: <SmileOutlined />,
  setting: <SettingOutlined />,
  form: <FormOutlined />,
  accountBook: <AccountBookOutlined />,
  wechat: <WechatOutlined />,
  gift: <GiftOutlined />,
  appstore: <AppstoreOutlined />,
  team: <TeamOutlined />,
  bars: <BarsOutlined />,
  dashboard: <DashboardOutlined />,
  warning: <WarningOutlined />,
  user: <UserOutlined />,
  table: <TableOutlined />,
  cluster: <ClusterOutlined />,
  barcode: <BarcodeOutlined />,
  block: <BlockOutlined />,
  laptop: <LaptopOutlined />,
}

const noMatch = (
  <Result
    status={403}
    title="403"
    subTitle="Sorry, you are not authorized to access this page."
    extra={
      <Button type="primary">
        <Link to="/user/login">Go Login</Link>
      </Button>
    }
  />
);

export interface BasicLayoutProps extends ProLayoutProps {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
  route: ProLayoutProps['route'] & {
    authority: string[];
  };
  settings: Settings;
  dispatch: Dispatch;
  currentMenu: MenuDataItem[];
}

export type BasicLayoutContext = { [K in 'location']: BasicLayoutProps[K] } & {
  breadcrumbNameMap: {
    [path: string]: MenuDataItem;
  };
};

const defaultFooterDom = (
  <DefaultFooter
    copyright="2020 GPOS All rights reserved."
    links={[
      {
        key: 'Gpos MenuHub System',
        title: 'Gpos MenuHub System',
        href: 'https://www.gposcn.com/',
        blankTarget: true,
      },
      {
        key: 'GitHub',
        title: <GithubOutlined />,
        href: 'https://github.com/',
        blankTarget: true,
      },
      {
        key: 'Ant Design',
        title: 'Ant Design',
        href: 'https://ant.design',
        blankTarget: true,
      },
    ]}
  />
);

/**
 * icon:iconEnum[item.icon]  遍历菜单中图标，转化成可展示的图标
 */
/*   const menuDataRender = menuList =>
  menuList.map(item => {
    const localItem = { ...item,icon:iconEnum[item.icon], children: item.children ? menuDataRender(item.children) : [] };
    return Authorized.check(item.authority, localItem, null);
  }); */

/**
* use Authorized check all menu item
*/

const menuDataRender = (menuList: MenuDataItem[]): MenuDataItem[] =>

  menuList.map((item) => {
    const localItem = {
      ...item,
      children: item.children ? menuDataRender(item.children) : undefined,
    };
    return Authorized.check(item.authority, localItem, null) as MenuDataItem;
  });

const BasicLayout: React.FC<BasicLayoutProps> = (props) => {
  const {
    dispatch,
    children,
    settings,
    location = {
      pathname: '/',
    },
    currentMenu,
  } = props;

  useEffect(() => {
    let authority = 'user';
    if (IsSuperAdmin())
      authority = 'superAdmin';
    else if (IsTenantAdmin())
      authority = 'tenantAdmin';

    if (dispatch) {
      dispatch({
        type: 'user/fetchCurrent',
      });
    }
  }, []);

  // 展开左边栏 
  const handleMenuCollapse = (payload: boolean): void => {
    // alert('handleMenuCollapse')
    console.log('handleMenuCollapse,payload', payload);
    
    if (dispatch) {
      dispatch({
        type: 'global/changeLayoutCollapsed',
        payload,
      });
    }
  }; 

  const authorized = getAuthorityFromRouter(props.route.routes, location.pathname || '/') || {
    authority: undefined,
  };

  const menuHeader = (logoDom, titleDom) => (
    <Link to="/">
      {logoDom}
      {titleDom}
    </Link>
  )
  const bread = (routers) => [
    // {
    //   path: '/',
    //   breadcrumbName: '首页',
    // },
    ...routers,
  ]

  const menuItem = (menuItemProps, defaultDom) => {
    if (menuItemProps.isUrl || menuItemProps.children || !menuItemProps.path) {
      return defaultDom;
    }
    return <Link to={menuItemProps.path}>{defaultDom}</Link>;
  }

  const itemRender = (route, params, routes, paths) => {
    const first = routes.indexOf(route) === 0;
    return first ? (
      <Link to={paths.join('/')}>{route.breadcrumbName}</Link>
    ) : (
        <span>{route.breadcrumbName}</span>
      );
  }
  return (
     <ProLayout
      logo={logo}
      menuHeaderRender={(logoDom, titleDom) => menuHeader(logoDom, titleDom)}
      onCollapse={handleMenuCollapse}
      menuItemRender={(menuItemProps, defaultDom) => menuItem(menuItemProps, defaultDom)}
      itemRender={(route, params, routes, paths) => itemRender(route, params, routes, paths)}
      footerRender={() => defaultFooterDom}
      menuDataRender={menuDataRender}
      rightContentRender={() => <RightContent />}
      {...props}
      {...settings}
    >
        <Authorized authority={authorized!.authority} noMatch={noMatch}>
          {children}
        </Authorized>
      </ProLayout>

  );
};

export default connect(({ global, settings, menu }: ConnectState) => ({
  collapsed: global.collapsed,
  settings,
  currentMenu: menu.currentMenu,
}))(BasicLayout);
