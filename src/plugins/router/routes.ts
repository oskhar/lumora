export const routes = [
  { path: '/', redirect: '/dashboard' },
  {
    path: '/',
    component: () => import('@/layouts/default.vue'),
    children: [
      { path: 'inventory', component: () => import('@/pages/commerce/inventory.vue') },
      { path: 'products', component: () => import('@/pages/commerce/products.vue') },
      { path: 'products/add', component: () => import('@/pages/commerce/product-form.vue') },
      { path: 'products/:id/edit', component: () => import('@/pages/commerce/product-form.vue') },
      { path: 'products/:id', component: () => import('@/pages/commerce/product-detail.vue') },
      { path: 'categories', component: () => import('@/pages/commerce/categories.vue') },
      { path: 'orders', component: () => import('@/pages/commerce/orders.vue') },
      { path: 'orders/:id', component: () => import('@/pages/commerce/order-detail.vue') },
      { path: 'customers', component: () => import('@/pages/commerce/customers.vue') },
      { path: 'customers/:id', component: () => import('@/pages/commerce/customer-detail.vue') },
      { path: 'settings/store', component: () => import('@/pages/commerce/settings.vue') },
      { path: 'settings/payments', component: () => import('@/pages/commerce/settings.vue') },
      { path: 'settings/locations', component: () => import('@/pages/commerce/settings.vue') },
      { path: 'shop/products', component: () => import('@/pages/shop/catalog.vue'), meta: { customer: true } },
      { path: 'shop/products/:id', component: () => import('@/pages/commerce/product-detail.vue'), meta: { customer: true } },
      { path: 'shop/cart', component: () => import('@/pages/shop/cart.vue'), meta: { customer: true } },
      { path: 'shop/checkout', component: () => import('@/pages/shop/checkout.vue'), meta: { customer: true } },
      { path: 'shop/orders/:id', component: () => import('@/pages/commerce/order-detail.vue'), meta: { customer: true } },
      { path: 'learn/courses', component: () => import('@/pages/learn/courses.vue'), meta: { customer: true } },
      { path: 'learn/my-courses', component: () => import('@/pages/learn/courses.vue'), meta: { customer: true } },
      { path: 'learn/courses/:id', component: () => import('@/pages/learn/course-detail.vue'), meta: { customer: true } },
      { path: 'learn/ratings', component: () => import('@/pages/learn/ratings.vue'), meta: { customer: true } },
      { path: 'booking', component: () => import('@/pages/learn/booking.vue'), meta: { customer: true } },
      {
        path: 'analytics',
        component: () => import('@/pages/analytics.vue'),
      },
      {
        path: 'dashboard',
        component: () => import('@/pages/dashboard.vue'),
      },
      {
        path: 'account-settings',
        component: () => import('@/pages/account-settings.vue'),
      },
      {
        path: 'typography',
        component: () => import('@/pages/typography.vue'),
      },
      {
        path: 'icons',
        component: () => import('@/pages/icons.vue'),
      },
      {
        path: 'cards',
        component: () => import('@/pages/cards.vue'),
      },
      {
        path: 'tables',
        component: () => import('@/pages/tables.vue'),
      },
      {
        path: 'form-layouts',
        component: () => import('@/pages/form-layouts.vue'),
      },
    ],
  },
  {
    path: '/',
    component: () => import('@/layouts/blank.vue'),
    children: [
      {
        path: 'login',
        component: () => import('@/pages/login.vue'),
      },
      {
        path: 'register',
        component: () => import('@/pages/register.vue'),
      },
      {
        path: '/:pathMatch(.*)*',
        component: () => import('@/pages/[...error].vue'),
      },
    ],
  },
]
