export default {

  // ---------------------------------------- Super Admin ---------------------------------------
  'GET /api/menus/superAdmin': [
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
          name: 'Company List',
          path: '/tenants/tenants-list',
          component: './tenants/tenants-list',
        },
        {
          name: 'Company Application List',
          path: '/tenants/tenant-application-list',
          component: './tenants/tenant-application-list',
        },
        {
          name: 'Company Application Form',
          path: '/tenants/tenant-application-form',
          component: './tenants/tenant-application-form',
        },
        {
          name: 'Tenant Application Profile',
          path: '/tenants/tenant-profile',
          component: './tenants/tenant-profile',
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
      name: 'Users',
      icon: 'user',
      path: '/account',
      routes: [
        {
          name: 'Users List',
          path: '/account/users-list',
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
          path: '/account/member-list',
          component: './account/member-list',
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
      name: 'Settings',
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
      name: 'Report',
      icon: 'setting',
      path: '/report',
      routes: [
        {
          name: 'Sales Report',
          path: '/report/sales-report',
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
          component: './report/category-report',
        },
      ],
    },

    {
      name: 'Payment Setting',
      icon: 'setting',
      path: '/settings',
      routes: [
        {
          name: 'Payment Modes',
          path: '/settings/payment-modes-list',
          component: './settings/payment-modes-list',
        },
        {
          name: 'Branch Payment Modes',
          path: '/settings/payment-modes-list-for-branch',
          component: './settings/payment-modes-list-for-branch',
        },
        {
          name: 'Addons Settings',
          path: '/settings/addons-settings',
          component: './settings/addons-settings',
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
      name: 'Printer Setting',
      icon: 'user',
      path: '/syetem-setting',
      routes: [
        {
          name: 'Member List',
          path: '/syetem-setting/printers',
          component: './syetem-setting/printers',
        },
      ],
    },
  ],

  // ---------------------------------- Tenant Admin ----------------------------------
  'GET /api/menus/tenantAdmin': [
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
          name: 'Company Application List',
          path: '/tenants/tenant-application-list',
          component: './tenants/tenant-application-list',
        },
        {
          name: 'Company Application Form',
          path: '/tenants/tenant-application-form',
          component: './tenants/tenant-application-form',
        },
        {
          name: 'Company Application Profile',
          path: '/tenants/tenant-profile',
          component: './tenants/tenant-profile',
        },
      ],
    },
    {
      path: '/webpos',
      name: 'WebPOS',
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
          ],
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
      name: 'Users',
      icon: 'user',
      path: '/account',
      routes: [
        {
          name: 'Users List',
          path: '/account/users-list',
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
          path: '/account/member-list',
          component: './account/member-list',
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
      name: 'Settings',
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
      path: '/settings',
      routes: [
        {
          name: 'Payment Modes',
          path: '/settings/payment-modes-list',
          component: './settings/payment-modes-list',
        },
        {
          name: 'Branch Payment Modes',
          path: '/settings/payment-modes-list-for-branch',
          component: './settings/payment-modes-list-for-branch',
        },
        {
          name: 'Addons Settings',
          path: '/settings/addons-settings',
          component: './settings/addons-settings',
        },
      ],
    },

    {
      name: 'Report',
      icon: 'setting',
      path: '/report',
      routes: [
        {
          name: 'Sales Report',
          path: '/report/sales-report',
          component: './report/sales-report',
        },
        {
          name: 'Payment Report ',
          path: '/report/payment-report',
          component: './report/payment-report',
        },
        {
          name: 'Category Report ',
          path: '/report/category-report',
          component: './report/category-report',
        },
      ],
    },


    {
      name: 'System Authority',
      icon: 'block',
      path: '/system-authority',
      routes: [
        {
          name: 'Role Authority',
          path: '/system-authority/role-authority',
          component: './system-authority/role-authority',
        },
      ],
    },


    {
      name: 'Printer Setting',
      icon: 'user',
      path: '/syetem-setting',
      routes: [
        {
          name: 'Member List',
          path: '/syetem-setting/printers',
          component: './syetem-setting/printers',
        },
      ],
    },
  ],
  // --------------------------------- 用户级别 --------------------------------------
  'GET /api/menus/user': [
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
      path: '/account',
      routes: [
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
      path: '/webpos',
      name: 'WebPOS',
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
          path: '/webpos/pos',
          name: 'POS',
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
          ],
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
      name: 'Printer Setting',
      icon: 'user',
      path: '/syetem-setting',
      routes: [
        {
          name: 'Member List',
          path: '/syetem-setting/printers',
          component: './syetem-setting/printers',
        },
      ],
    },
  ]
}