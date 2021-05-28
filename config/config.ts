// https://umijs.org/config/
import { defineConfig } from 'umi';
import defaultSettings from './defaultSettings';
import proxy from './proxy';

const { REACT_APP_ENV } = process.env;

export default defineConfig({
  hash: true,
  antd: {},
  dva: {
    hmr: true,
  },
  locale: {
    default: 'zh-CN',
    antd: true,
    baseNavigator: true,
  },

  
  routes: [
    {
      path: '/user',
      component: '../layouts/UserLayout',
      routes: [
        {
          name: 'login',
          path: '/user/login',
          component: './user/login',
        },
        {
          name: 'register result',
          icon: 'smile',
          path: '/user/register-result',
          component: './user/register-result',
        },
        {
          name: 'register',
          path: '/user/register',
          component: './user/register',
        },
      ],
    },
    {
      path: '/',
      component: '../layouts/SecurityLayout',
      routes: [
        {
          path: '/',
          component: '../layouts/BasicLayout',
          routes: [
            {
              path: '/',
              redirect: '/dashboard/workplace',
            },
            {
              path: '/dashboard',
              name: 'Dashboard',
              icon: 'dashboard',
              routes: [
                {
                  path: '/dashboard/analysis',
                  name: 'Analysis',
                  component: './dashboard/Analysis',
                },
                {
                  name: 'Workplace',
                  path: '/dashboard/workplace',
                  component: './dashboard/workplace',
                },
              ],
            },

            {
              name: 'Companies',
              icon: 'cluster',
              path: '/tenants',
              routes: [
                {
                  name: 'Company Application Form',
                  path: '/tenants/tenant-application-form',
                  component: './tenants/tenant-application-form',
                },

                {
                  name: 'Company Application Management',
                  path: '/tenants/tenant-application-list',
                  component: './tenants/tenant-application-list',
                },

                {
                  name: 'Company List',
                  path: '/tenants/tenants-list',
                  component: './tenants/tenants-list',
                },

                {
                  //name: 'Tenant Application Profile',
                  path: '/tenants/tenant-profile',
                  component: './tenants/tenant-profile',
                },
              ],
            },

            {
              name: 'Branches',
              icon: 'setting',
              path: '/settings',
              routes: [
                {
                  name: 'Branches List',
                  path: '/settings/branches-list',
                  component: './settings/branches-list',
                },
                {
                  name: 'Locations List',
                  path: '/settings/locations-list',
                  component: './settings/locations-list',
                },
              ],
            },

            {
              name: 'Payment Setting',
              icon: 'setting',
              path: '/payment-settings',
              routes: [
                {
                  name: 'Payment Modes',
                  path: '/payment-settings/payment-modes',
                  component: './settings/payment-modes-list',
                },
                {
                  name: 'Branch Payment Modes',
                  path: '/payment-settings/branch-payment-modes',
                  component: './settings/payment-modes-list-for-branch',
                },
                {
                  name: 'Addons Settings',
                  path: '/payment-settings/addons-settings',
                  component: './settings/addons-settings',
                },
              ],
            },

            {
              path: '/items',
              name: 'Items',
              icon: 'barcode',
              routes: [
                {
                  path: '/items/categories',
                  name: 'Categories List',
                  component: './items/categories',
                },
                {
                  path: '/items/library',
                  name: 'Image Library',
                  component: './items/library',
                },
                {
                  path: '/items/items',
                  name: 'Items List',
                  component: './items/items',
                },
                {
                  path: '/items/bundles',
                  name: 'Bundles List',
                  component: './items/bundles',
                },
              ],
            },

            {
              name: 'Staff',
              icon: 'user',
              path: '/account',
              routes: [
                {
                  name: 'Staff List',
                  path: '/account/staffs-list',
                  component: './account/users-list',
                },
                {
                  name: 'Roles List',
                  path: '/account/roles-list',
                  component: './account/roles-list',
                },
                {
                  name: 'Assign Roles',
                  path: '/account/assign-roles',
                  component: './account/assign-roles',
                },
                {
                  path: '/account/account-settings',
                  component: './account/account-settings',
                },
                {
                  path: '/account/change-password',
                  component: './account/change-password',
                },
              ],
            },

            {
              name: 'Member',
              icon: 'user',
              path: '/member',
              routes: [
                {
                  name: 'Member List',
                  path: '/member/member-list',
                  component: './member/member-list',
                },
              ],
            },

            {
              name: 'System Authority',
              icon: 'setting',
              path: '/system-authority',
              routes: [
                {
                  name: 'API Authority',
                  path: '/system-authority/api-authority',
                  component: './system-authority/api-authority',
                },
                {
                  name: 'Role Authority',
                  path: '/system-authority/role-authority',
                  component: './system-authority/role-authority',
                },
              ],
            },

            {
              name: 'Host Users',
              icon: 'team',
              path: '/host-users',
              routes: [
                {
                  name: 'Host Users List',
                  path: '/host-users/host-users-list',
                  component: './host-users/host-users-list',
                },
              ],
            },

            {
              name: 'Reservation',
              icon: 'user',
              path: '/reservation',
              routes: [
                {
                  name: 'Reservation List',
                  path: '/reservation/reservation-list',
                  component: './reservation',
                },
              ],
            },

            {
              name: 'WebPOS',
              path: '/webpos',
              icon: 'laptop',
              routes: [
                {
                  path: '/webpos/dev_p',
                  component: './webpos/dev_pos',
                },
                {
                  path: '/webpos/listsearchprojects',
                  component: './webpos/ListSearchProjects',
                },
                {
                  name: 'POS',
                  path: '/webpos/pos',
                  component: './webpos/AccountCenter',
                },
                {
                  name: 'Sales Trace',
                  path: '/webpos/sales_trace',
                  component: './webpos/sales_trace',
                  routes: [
                    {
                      path: '/webpos/sales_trace',
                      redirect: '/webpos/sales_trace/ordered',
                    },
                    {
                      path: '/webpos/sales_trace/ordered',
                      component: './webpos/sales_trace/ordered',
                    },
                    {
                      path: '/webpos/sales_trace/pending',
                      component: './webpos/sales_trace/pending',
                    },
                    {
                      path: '/webpos/sales_trace/finished',
                      component: './webpos/sales_trace/finished',
                    },
                    {
                      path: '/webpos/sales_trace/print_receipt',
                      exact: false,
                      component: './webpos/sales_trace/print',
                    },

                  ],
                },
              ],
            },
            
            {
              name: 'Settings',
              icon: 'user',
              path: '/system-setting',
              routes: [
                {
                  name: 'Printer & Eftpos',
                  path: '/system-setting/printers',
                  component: './system-setting/printers',
                },
                {
                  name: 'Reservation',
                  path: '/system-setting/reservation',
                  component: './system-setting/reservation',
                },
              ],
            },

            {
              name: 'Report',
              icon: 'fund',
              path: '/report',
              routes: [
                {
                  name: 'Sales Report', 
                  path: '/report/sales-report',
                  exact: false,
                  component: './report/sales-report',
                },
                {
                  name: 'Payment Report ', 
                  path: '/report/payment-report',
                  component: './report/payment-report',
                },
                {
                  name: 'Category Report', 
                  path: '/report/category-report',
                  exact: false,
                  component: './report/category-report',
                },
              ],
            },


            {
              component: './404',
            },
          ],
        },
        {
          component: './404',
        },
      ],
    },
    {
      component: './404',
    },
  ],
  targets: {
    ie: 11,
  },
  // Theme for antd: https://ant.design/docs/react/customize-theme-cn
  theme: {
    // ...darkTheme,
    'primary-color': defaultSettings.primaryColor,
  },
  // @ts-ignore
  title: false,
  ignoreMomentLocale: true,
  proxy: proxy[REACT_APP_ENV || 'dev'],
  manifest: {
    basePath: '/',
  },
});
