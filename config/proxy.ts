/**
 * 在生产环境 代理是无法生效的，所以这里没有生产环境的配置
 * The agent cannot take effect in the production environment
 * so there is no configuration of the production environment
 * For details, please see
 * https://pro.ant.design/docs/deploy
 */

export default {
  dev: {
    '/server/api/': {
      target: 'http://beautiesapi.gcloud.co.nz/',
      changeOrigin: true,
      pathRewrite: {
        '^/server': '',
      },
    },

    '/server/img/': {
      target: 'http://beautiesapi.gcloud.co.nz/',
      changeOrigin: true,
      pathRewrite: {
        '^/server/img/': '',
      },
    },

    '/server/print/': {
      target: 'http://localhost:5222/print',
      changeOrigin: true,
      pathRewrite: {
        '^/server/print/': '',
      },
    },

    '/mpm/api/': {
      target: 'https://myposmate.com/',
      changeOrigin: true,
      pathRewrite: {
        '^/mpm': '',
      },
    },
  },
  test: {
    '/api/': {
      target: 'https://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
  pre: {
    '/api/': {
      target: 'http://preview.pro.ant.design',
      changeOrigin: true,
      pathRewrite: { '^': '' },
    },
  },
};

export const apiList = {
  /** 
   * host api
  */
  HOST_AUTHENTICATION_API: '/server/api/host/authentication/token',
  HOST_CANDIDATES_API: '/server/api/host/candidates',
  HOST_TENANTS_API: '/server/api/host/tenants',
  HOST_USERS_API: '/server/api/host/hostusers',

  /** 
   * items api
  */
 BRANCH_API: '/server/api/settings/branches',
 BRANCH_TRANSACTION_API: '/server/api/transactions/branches',

  /** 
   * items api
  */
  ITEMS_API: '/server/api/items',
  ITEMS_ITEMS_API: '/server/api/items/items', 
  ITEMS_BATCH_UPLOAD_API: '/server/api/items/batchUpload', 
  ITEMS_CATEGORIES_API: '/server/api/items/categories',
  ITEMS_BUNDLES_API: '/server/api/items/bundles',
  /** 
   * crm api
  */
  CRM_SERVER: '/server/api',
  CRM_ROLES_API: '/server/api/crm/roles',
  CRM_USERS_API: '/server/api/crm/users',
  CRM_USERS_GET_BRANCH_ROLE_API: '/server/api/crm/UsersForBranchRole',
  CRM_USERS_POST_DELETE_BRANCH_ROLE_API: '/server/api/crm/branches',
    /** 
   * crm api
  */
 CRM_MEMBER_API: '/server/api/crm/customers',
  /** 
   * settings api
  */
  SETTINGS_BRANCHES_API: '/server/api/settings/branches',
  SETTINGS_PAYMENT_MODES_API: '/server/api/settings/PaymentModes',
  /** 
   * report api
  */
 GET_REPORT: '/server/api/reports',
 GET_REPORT_ITEM: '/server/api/reports/items',
 GET_REPORT_CAGEGORIES: '/server/api/reports/categories',
 GET_BRANCH: '/server/api/reports/branches',
}

export const claimTypes = {
  ACCESS_BRANCH: "AccessBranch",
  ACCESS_USER: "AccessUser",
  ACCESS_ROLE: "AccessRole",
  ACCESS_USER_BRANCH_ROLE: "AccessUserBranchRole",
  ACCESS_ROLE_CLAIM: "AccessRoleClaim",
  ACCESS_CATEGORY: "AccessCategory",
  ACCESS_ITEM: "AccessItem",
  ACCESS_BRANCH_ITEM : "AccessBranchItem",
  ACCESS_ADD_ON : "AccessAddOn",
  ACCESS_LOCATION : "AccessLocation",
  ACCESS_PAYMENT_MODE : "AccessPaymentMode",
  ACCESS_BRANCH_PAYMENT_MODE : "AccessBranchPaymentMode",
  ACCESS_ORDER : "AccessOrder",
  ACCESS_INVOICE : "AccessInvoice",
  ACCESS_PAYMENT : "AccessPayment",
}

export const claimValues = {
  CREATABLE: "Creatable",
  READ_ONLY: "ReadOnly",
  UPDATABLE: "Updatable",
  DELETABLE: "Deletable",
  INACTIVATABLE_AND_REACTIVATABLE: "InactivatableAndReactivatable",
  CREATABLE_AND_DELETABLE: "CreatableAndDeletable"
}
