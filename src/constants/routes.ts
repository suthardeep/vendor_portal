export const ROUTES = {
  DASHBOARD: "/dashboard",
  ORDERS: {
    ALL: `/orders/all`,
    INITIATED: "/orders/initiated",
    PAYMENT_CONFIRMED: "/orders/payment_confirmed",
    PAYMENT_ERROR: "/orders/payment_error",
    CANCELLED: "/orders/cancelled",
    PREPARING: "/orders/preparing",
    READY_TO_PICKUP: "/orders/ready_to_pickup",
    ON_THE_WAY: "/orders/on_the_way",
    DELIVERED: "/orders/delivered",
    DETAILS: (orderDetails: string) => `/orders/details/${orderDetails}`,
    CREATE_ORDER: `/orders/create`,
    REVIEW_ORDER: `/orders/create/review`,
  },
  RIDERS: {
    ALL_RIDERS: {
      ROOT: `/riders/all-riders`,
      ADD: `/riders/all-riders/add`,
      EDIT: (riderId: string) => `/riders/all-riders/edit/${riderId}`,
      DETAILS: (riderId: string) => `/riders/all-riders/details/${riderId}`,
    },
    SHIFT_MANAGEMENT: `/riders/shift-management`,
  },
  PRODUCTS: {
    GLOBAL_STORE: {
      ROOT: `/products/global-store`,
      CREATE: `/products/global-store/create`,
      EDIT: (productId: string) => `/products/global-store/edit/${productId}`,
    },
    PRODUCT_EDIT_REQUESTS: {
      LIST: `/products/product-edit-requests`,
    },
  },
  MAPS: `/maps`,
  STORES: {
    ALL_STORES: {
      ROOT: `/stores/all-stores`,
      ADD: `/stores/all-stores`,
      EDIT: (storeId: string) => `/stores/all-stores/edit/${storeId}`,
      DETAILS: (storeId: string) => `/stores/all-stores/details/${storeId}`,
      PRODUCTS: {
        ROOT: (storeId: string) => `/stores/all-stores/products/${storeId}`,
        CREATE: (storeId: string) =>
          `/stores/all-stores/products/${storeId}/create`,
        PRODUCT_DETAILS: (storeId: string, productId: string) =>
          `/stores/all-stores/products/${storeId}/${productId}`,
        EDIT: (storeId: string, productId: string) =>
          `/stores/all-stores/products/${storeId}/${productId}/edit`,
      },
      MENU: (storeId: string) => `/stores/all-stores/menu/${storeId}`,
      MANAGE_ADDONS: (storeId: string) =>
        `/stores/all-stores/manage-addons/${storeId}`,
    },
    RESTAURANTS: {
      ROOT: `/stores/restaurants`,
    },
    SUPERMARKETS: {
      ROOT: `/stores/supermarkets`,
    },
    OWNERS: {
      ROOT: `/stores/owners`,
    },
  },
  CATEGORY: {
    PARENT_CATEGORY: {
      ROOT: `/category/parent-category`,
      ADD: `/category/parent-category/add`,
      EDIT: (categoryId: string) =>
        `/category/parent-category/edit/${categoryId}`,
    },
    CHILD_CATEGORY: {
      ROOT: `/category/child-category`,
      ADD: `/category/child-category/add`,
      EDIT: (categoryId: string) =>
        `/category/child-category/edit/${categoryId}`,
    },
  },
  SETTINGS: {
    ROOT: `/settings`,
    ZONES: {
      ROOT: `/settings/zones`,
      CREATE: `/settings/zones/create`,
      EDIT: (uniqueId: string) => `/settings/zones/edit/${uniqueId}`,
      DETAILS: (uniqueId: string) => `/settings/zones/details/${uniqueId}`,
    },
    MEDIA_GALLERY: `/settings/media-gallery`,
    STAFF: {
      ROOT: `/settings/staff`,
      ADD: `/settings/staff/add`,
      EDIT: (staffId: string) => `/settings/staff/edit/${staffId}`,
    },
    ROLES_PERMISSIONS: {
      ROOT: `/settings/roles-permissions`,
      ADD: `/settings/roles-permissions/add`,
      EDIT: (roleId: string) => `/settings/roles-permissions/edit/${roleId}`,
    },
    INFO_UPDATE_REQUESTS: `/settings/info-update-requests`,
  },
  UNAUTHORIZED: "/unauthorized",
  CMS: {
    HOME_SCREEN: `/cms/home-screen`,
    BANNERS: {
      ROOT: `/cms/banners`,
      CREATE: `/cms/banners/create`,
      EDIT: (bannerId: string) => `/cms/banners/edit/${bannerId}`,
      TRANSACTIONS: `/cms/banners/transactions`,
    },
  },
  LOGIN: `/login`,
};
