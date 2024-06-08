const path = {
    PUBLIC: '/',
    HOME: '',
    ALL: '*',
    LOGIN: 'login',
    PRODUCTS: ':category',
    BLOGS: 'blogs',
    OUR_SERVICES: 'services',
    FAQ: 'faqs',
    DETAIL_PRODUCT__CATEGORY__PID__TITLE: ':category/:pid/:title',
    FINAL_REGISTER: 'finalregister/:status',
    RESET_PASSWORD: 'reset-password/:token',


    // Admin
    ADMIN: 'admin',
    DASHBOARD: 'dashboard',

    MANAGE_USER: "manage-user",
    MANAGE_ORDER: "manage-order",

    MANAGE_PRODUCTS: "manage-products",
    CREATE_PRODUCTS: "create-products",

    MANAGE_CATEGORY: "manage-category",
    CREATE_CATEGORY: "create-category",

    MANAGE_COUPON: 'manage-coupon',
    CREATE_COUPON: "create-coupon",

    MANAGE_BRAND: "manage-brand",
    CREATE_BRAND: "create-brand",

    // Members
    MEMBER: "member",
    PERSONAL: "personal",
    MY_CART: "my-cart",
    HISTORY: "buy-history",
    WISHLIST: "wishlist",
}

export default path