export interface MenuGroup { title: string; icon: string; children: { title: string; icon: string; to: string }[] }
export const adminMenu: MenuGroup[] = [
  { title: 'Ringkasan', icon: 'ri-dashboard-line', children: [
    { title: 'Dashboard utama', icon: 'ri-home-smile-line', to: '/dashboard' },
    { title: 'Analitik', icon: 'ri-bar-chart-grouped-line', to: '/analytics' },
  ] },
  { title: 'Kelola toko', icon: 'ri-store-2-line', children: [
    { title: 'Produk', icon: 'ri-shopping-bag-line', to: '/products' },
    { title: 'Tambah produk', icon: 'ri-add-circle-line', to: '/products/add' },
    { title: 'Pengelolaan stok', icon: 'ri-archive-line', to: '/inventory' },
    { title: 'Kategori produk', icon: 'ri-price-tag-3-line', to: '/categories' },
    { title: 'Pesanan', icon: 'ri-file-list-3-line', to: '/orders' },
    { title: 'Pelanggan', icon: 'ri-group-line', to: '/customers' },
  ] },
  { title: 'Pengaturan toko', icon: 'ri-settings-3-line', children: [
    { title: 'Identitas toko', icon: 'ri-store-line', to: '/settings/store' },
    { title: 'Pembayaran', icon: 'ri-bank-card-line', to: '/settings/payments' },
    { title: 'Lokasi toko', icon: 'ri-map-pin-line', to: '/settings/locations' },
  ] },
  { title: 'Contoh komponen', icon: 'ri-layout-grid-line', children: [
    { title: 'Kartu', icon: 'ri-layout-grid-line', to: '/cards' },
    { title: 'Tipografi', icon: 'ri-text', to: '/typography' },
    { title: 'Ikon', icon: 'ri-remixicon-line', to: '/icons' },
    { title: 'Form', icon: 'ri-layout-4-line', to: '/form-layouts' },
    { title: 'Tabel', icon: 'ri-table-alt-line', to: '/tables' },
    { title: 'Masuk', icon: 'ri-login-box-line', to: '/login' },
    { title: 'Daftar akun', icon: 'ri-user-add-line', to: '/register' },
  ] },
]
export const customerMenu: MenuGroup[] = [
  { title: 'Belanja', icon: 'ri-shopping-bag-line', children: [
    { title: 'Katalog produk', icon: 'ri-store-2-line', to: '/shop/products' },
    { title: 'Keranjang', icon: 'ri-shopping-cart-line', to: '/shop/cart' },
    { title: 'Checkout', icon: 'ri-secure-payment-line', to: '/shop/checkout' },
  ] },
  { title: 'Kursus & jadwal', icon: 'ri-graduation-cap-line', children: [
    { title: 'Katalog kursus', icon: 'ri-compass-3-line', to: '/learn/courses' },
    { title: 'Kursus saya', icon: 'ri-book-open-line', to: '/learn/my-courses' },
    { title: 'Rating & ulasan', icon: 'ri-star-line', to: '/learn/ratings' },
    { title: 'Jadwal privat', icon: 'ri-calendar-line', to: '/booking' },
  ] },
]
export const pageOptions = [...adminMenu, ...customerMenu].flatMap(group => group.children.map(link => ({ title: `${group.title} · ${link.title}`, value: link.to })))
pageOptions.push({ title: 'Pengaturan akun', value: '/account-settings' })
