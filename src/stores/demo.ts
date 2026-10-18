import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
import { validateBookingBatch, type ReservedTime } from '@/utils/bookingAvailability'
import { migrateOpeningStock, stockBalances, validateStockMovement, type StockMovement } from '@/utils/inventory'

export interface Product {
  id: number; name: string; sku: string; categoryId: number; price: number; stock: number
  status: 'Active' | 'Draft'; description: string; icon: string; image?: string
}
export interface Category { id: number; name: string; description: string }
export interface Customer { id: number; name: string; email: string; phone: string; city: string; joined: string }
export interface OrderItem { productId: number; name: string; price: number; quantity: number }
export interface Order {
  id: number; customerId: number; items: OrderItem[]; createdAt: string; address: string
  status: 'Pending' | 'Processing' | 'Shipped' | 'Completed' | 'Cancelled'
  paymentStatus: 'Pending' | 'Paid'; shipping: number; paymentMethod: string
}
export interface Location { id: number; name: string; address: string; city: string; postalCode: string; pickup: boolean }
export interface Lesson { title: string; minutes: number; content: string }
export interface Course {
  id: number; title: string; category: string; level: string; instructor: string; price: number
  description: string; icon: string; lessons: Lesson[]
}
export interface Enrollment { courseId: number; completed: number[] }
export interface Review { id: number; courseId: number; author: string; rating: number; text: string; date: string }
export interface Booking {
  id: number; courseId: number; instructor: string; date: string; time: string; duration: number
  notes: string; status: 'Confirmed' | 'Cancelled'
}
export const money = (value: number) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value)
export const localDate = (date = new Date()) => `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
export const orderTotal = (order: Order) => order.items.reduce((sum, item) => sum + item.price * item.quantity, 0) + order.shipping
export const statusColor = (status: string) => ({ Active: 'primary', Paid: 'primary', Completed: 'primary', Confirmed: 'primary', Shipped: 'info', Processing: 'info', Pending: 'warning', Draft: 'secondary', Cancelled: 'error' })[status] ?? 'secondary'

const categories: Category[] = [
  { id: 1, name: 'Audio', description: 'Sound for work, creativity, and everyday listening.' },
  { id: 2, name: 'Workspace', description: 'Thoughtful essentials for a better desk.' },
  { id: 3, name: 'Everyday', description: 'Useful objects, made for your daily routine.' },
]
const products: Product[] = [
  { id: 1, name: 'Studio Headphones', sku: 'LM-AU-001', categoryId: 1, price: 895000, stock: 24, status: 'Active', icon: 'ri-headphone-line', description: 'Over-ear studio headphones with a comfortable padded headband, clear balanced sound, and a detachable cable. Includes a travel pouch. One-year demo warranty.' },
  { id: 2, name: 'Mechanical Keyboard', sku: 'LM-WS-002', categoryId: 2, price: 1250000, stock: 18, status: 'Active', icon: 'ri-keyboard-line', description: 'A compact wireless keyboard with tactile switches, a durable aluminum frame, and USB-C charging. Designed for focused, comfortable work.' },
  { id: 3, name: 'Portable Speaker', sku: 'LM-AU-003', categoryId: 1, price: 650000, stock: 12, status: 'Active', icon: 'ri-speaker-line', description: 'Room-filling sound in a portable design. Bluetooth connectivity, simple controls, and up to 12 hours of listening.' },
  { id: 4, name: 'Desk Light', sku: 'LM-WS-004', categoryId: 2, price: 475000, stock: 32, status: 'Active', icon: 'ri-lightbulb-line', description: 'An adjustable desk light with warm and cool settings. A weighted base and dimmable LED make it an everyday workspace essential.' },
  { id: 5, name: 'Everyday Backpack', sku: 'LM-EV-005', categoryId: 3, price: 725000, stock: 8, status: 'Active', icon: 'ri-shopping-bag-3-line', description: 'A lightweight everyday bag with a padded laptop compartment, water-resistant fabric, and thoughtfully placed pockets.' },
  { id: 6, name: 'Insulated Bottle', sku: 'LM-EV-006', categoryId: 3, price: 245000, stock: 45, status: 'Active', icon: 'ri-cup-line', description: 'Double-wall stainless steel keeps drinks at the right temperature. A leak-resistant lid and comfortable size for everyday carry.' },
  { id: 7, name: 'Wireless Mouse', sku: 'LM-WS-007', categoryId: 2, price: 385000, stock: 0, status: 'Active', icon: 'ri-mouse-line', description: 'An ergonomic wireless mouse with quiet clicks, adjustable sensitivity, and multi-device pairing.' },
  { id: 8, name: 'Studio Microphone', sku: 'LM-AU-008', categoryId: 1, price: 1550000, stock: 6, status: 'Active', icon: 'ri-mic-line', description: 'A USB studio microphone for clear calls, recording, and teaching. Includes an adjustable desktop stand and pop filter.' },
  { id: 9, name: 'Desk Clock', sku: 'LM-WS-009', categoryId: 2, price: 325000, stock: 15, status: 'Draft', icon: 'ri-time-line', description: 'A minimal desk clock with a clear face, quiet movement, and an understated finish.' },
  { id: 10, name: 'Travel Case', sku: 'LM-EV-010', categoryId: 3, price: 195000, stock: 20, status: 'Active', icon: 'ri-suitcase-line', description: 'Keep your cables and accessories organized in a compact travel case with soft internal dividers.' },
]
const customers: Customer[] = [
  { id: 1, name: 'Nadia Putri', email: 'nadia@example.com', phone: '081234567801', city: 'Jakarta', joined: '2026-08-12' },
  { id: 2, name: 'Aditya Pranata', email: 'aditya@example.com', phone: '081234567802', city: 'Bandung', joined: '2026-08-19' },
  { id: 3, name: 'Maya Santoso', email: 'maya@example.com', phone: '081234567803', city: 'Surabaya', joined: '2026-09-03' },
  { id: 4, name: 'Raka Wijaya', email: 'raka@example.com', phone: '081234567804', city: 'Yogyakarta', joined: '2026-09-21' },
  { id: 5, name: 'Amelia Chen', email: 'amelia@example.com', phone: '081234567805', city: 'Jakarta', joined: '2026-10-02' },
  { id: 6, name: 'Daniel Hayes', email: 'daniel@example.com', phone: '081234567806', city: 'Bali', joined: '2026-10-08' },
]
const orders: Order[] = products.slice(0, 6).map((product, index) => ({
  id: 1001 + index, customerId: index + 1, items: [{ productId: product.id, name: product.name, price: product.price, quantity: 1 }],
  createdAt: `2026-10-${String(10 + index).padStart(2, '0')}T10:00:00+07:00`, address: `Jl. Melati No. ${index + 1}, ${customers[index].city}`,
  status: (['Completed', 'Shipped', 'Processing', 'Pending', 'Completed', 'Cancelled'] as const)[index],
  paymentStatus: index === 3 ? 'Pending' : 'Paid', shipping: 20000, paymentMethod: 'Bank transfer (demo)',
}))
const lesson = (title: string, minutes: number, content: string): Lesson => ({ title, minutes, content })
export const courses: Course[] = [
  { id: 1, title: 'Design Foundations', category: 'Design', level: 'Beginner', instructor: 'Nadia Putri', price: 450000, icon: 'ri-pen-nib-line', description: 'Learn to build clear visual hierarchies, select type, and create layouts that help people find what they need. Practice with a small real-world interface project.', lessons: [
    lesson('Start with visual hierarchy', 18, 'Decide what the reader needs to notice first. Give the main action more visual weight through size, spacing, or contrast. Choose one primary action for a screen, then group supporting content around it. Exercise: sketch a product card with a title, price, and one clear action.'),
    lesson('Typography and spacing', 24, 'Choose a readable body font and a small, consistent type scale. Use line height around 1.5 for longer text. Build your spacing from a simple 4 or 8 unit scale. Exercise: redesign a paragraph, heading, and action using three type sizes and consistent spacing.'),
    lesson('Color and accessibility', 22, 'Use color to support structure. Check text contrast, and never rely on color alone to communicate status. Pair status colors with labels or icons. Exercise: create active, pending, and inactive states that remain understandable in grayscale.'),
    lesson('Build your first layout', 30, 'Start with the content and smallest screen. Group related information, use consistent alignment, and allow enough space between sections. Exercise: design a responsive course detail screen and explain the purpose of each section.'),
  ] },
  { id: 2, title: 'Vue & TypeScript Essentials', category: 'Development', level: 'Intermediate', instructor: 'Aditya Pranata', price: 650000, icon: 'ri-code-s-slash-line', description: 'Build maintainable interfaces with typed components, reactive state, and reusable patterns. A practical learning path for modern Vue applications.', lessons: [
    lesson('Typed components', 25, 'Define explicit prop and event types. Keep components focused on one responsibility. Prefer a small, well-named interface over passing many unrelated values. Exercise: create a typed product card with a product prop and an add-to-cart event.'),
    lesson('Reactive state', 28, 'Use ref for state that changes and computed for values derived from that state. Avoid copying derived values into another ref. Exercise: calculate a cart subtotal from quantities and prices with a computed value.'),
    lesson('Forms and validation', 26, 'Validate user input at the boundary. Show field-level errors and preserve entered values when validation fails. Treat browser validation as usability support, and validate again on your server. Exercise: build a typed product form with price and stock validation.'),
    lesson('Routing and composition', 32, 'Use route parameters for resource identity and lazy loading for page modules. Share related logic through a composable or store. Exercise: connect a product list, detail, and edit flow using one shared source of data.'),
  ] },
  { id: 3, title: 'Product Photography', category: 'Creative', level: 'Beginner', instructor: 'Maya Santoso', price: 375000, icon: 'ri-camera-lens-line', description: 'Use simple lighting and deliberate composition to make your products look their best, even with a phone camera.', lessons: [
    lesson('Work with natural light', 20, 'Place your product near a large window with indirect light. Use white card to soften shadows. Keep exposure consistent across a collection. Exercise: photograph one object at three different distances from the window.'),
    lesson('Composition and styling', 24, 'Remove distractions and choose props that explain how the object is used. Leave space for cropping. Exercise: create a clean catalog shot and a contextual lifestyle shot of the same product.'),
    lesson('Edit a consistent collection', 27, 'Correct exposure and white balance before making creative adjustments. Use a consistent crop and background across product images. Exercise: prepare three images with the same framing and tone.'),
  ] },
  { id: 4, title: 'Confident Communication', category: 'Business', level: 'All levels', instructor: 'Raka Wijaya', price: 325000, icon: 'ri-discuss-line', description: 'Structure your ideas, ask better questions, and communicate with clarity in meetings, presentations, and everyday collaboration.', lessons: [
    lesson('Structure your message', 18, 'Lead with the point your listener needs. Follow it with the evidence and the action you propose. Exercise: explain a project decision in three sentences: outcome, reason, and next step.'),
    lesson('Listen and clarify', 20, 'Ask one specific question at a time. Summarize what you heard before responding. Exercise: practice restating a complicated request in plain language and checking your understanding.'),
    lesson('Present with confidence', 25, 'Build a short narrative around the audience’s goal. Practice aloud, remove filler, and leave room for questions. Exercise: prepare a two-minute project update with one main takeaway.'),
  ] },
]

interface DemoState {
  products: Omit<Product, 'stock'>[]; categories: Category[]; customers: Customer[]; orders: Order[]
  inventoryVersion: number; inventoryMovements: StockMovement[]
  cart: { productId: number; quantity: number }[]; enrollments: Enrollment[]; reviews: Review[]; bookings: Booking[]; instructorBookings: ReservedTime[]
  settings: { name: string; email: string; phone: string; description: string; bankTransfer: boolean; cashOnDelivery: boolean; bankName: string; accountName: string; accountNumber: string }
  locations: Location[]
}
const initial: DemoState = {
  inventoryVersion: 0, inventoryMovements: [],
  products, categories, customers, orders, cart: [], enrollments: [{ courseId: 1, completed: [0] }, { courseId: 2, completed: [] }],
  reviews: [
    { id: 1, courseId: 1, author: 'Maya Santoso', rating: 5, text: 'Clear examples and practical exercises. The lesson on visual hierarchy was especially useful.', date: '2026-10-10' },
    { id: 2, courseId: 2, author: 'Raka Wijaya', rating: 4, text: 'A helpful starting point for building typed Vue components and organizing reactive state.', date: '2026-10-12' },
  ], bookings: [],
  instructorBookings: Array.from({ length: 14 }, (_, offset) => {
    const date = new Date(); date.setDate(date.getDate() + offset)
    return courses.flatMap(course => [
      { instructor: course.instructor, date: localDate(date), time: course.id % 2 ? '10:00' : '11:00', duration: 60 },
      { instructor: course.instructor, date: localDate(date), time: `${13 + course.id % 3}:00`, duration: 60 },
    ])
  }).flat(),
  settings: { name: 'Lumora Store', email: 'hello@example.com', phone: '0215550123', description: 'Thoughtful essentials for work and everyday life.', bankTransfer: true, cashOnDelivery: true, bankName: 'Demo Bank', accountName: 'Lumora Demo', accountNumber: '0000000000' },
  locations: [{ id: 1, name: 'Jakarta Studio', address: 'Jl. Melati No. 12', city: 'Jakarta', postalCode: '12110', pickup: true }],
}
export const useDemoStore = defineStore('lumora-demo', () => {
  const data = useStorage<DemoState>('lumora-demo-v1', structuredClone(initial), undefined, { mergeDefaults: true })
  if (data.value.inventoryVersion !== 1) {
    const migrated = migrateOpeningStock(data.value.products as (Omit<Product, 'stock'> & { stock?: number })[])
    data.value = { ...data.value, products: migrated.catalog, inventoryMovements: migrated.movements, inventoryVersion: 1 }
  }
  const balances = computed(() => stockBalances(data.value.inventoryMovements))
  // Product stock is a read model, never a persisted catalog field.
  const products = computed<Product[]>(() => data.value.products.map(product => ({ ...product, stock: balances.value.get(product.id) ?? 0 })))
  const cartItems = computed(() => data.value.cart.map(line => ({ ...line, product: products.value.find(product => product.id === line.productId) })).filter((line): line is typeof line & { product: Product } => !!line.product))
  const cartTotal = computed(() => cartItems.value.reduce((sum, line) => sum + line.product.price * line.quantity, 0))
  const cartCount = computed(() => data.value.cart.reduce((sum, line) => sum + line.quantity, 0))
  const nextId = (items: { id: number }[]) => Math.max(0, ...items.map(item => item.id)) + 1

  function saveProduct(input: Omit<Product, 'stock'>) {
    if (data.value.products.some(product => product.id !== input.id && product.sku.toUpperCase() === input.sku.toUpperCase())) throw new Error('SKU sudah digunakan produk lain.')
    const { stock: _ignored, ...product } = input as Product
    const index = data.value.products.findIndex(item => item.id === product.id)
    if (index >= 0) data.value.products[index] = product
    else data.value.products.unshift(product)
  }
  function recordStock(input: Pick<StockMovement, 'productId' | 'direction' | 'quantity' | 'reason'> & Partial<Pick<StockMovement, 'reference' | 'notes'>>) {
    if (!data.value.products.some(product => product.id === input.productId)) throw new Error('Pilih produk yang tersedia.')
    const allowed = input.direction === 'in' ? ['receipt', 'return', 'adjustment'] : ['usage', 'damage', 'adjustment']
    if (!allowed.includes(input.reason)) throw new Error('Pilih alasan pergerakan stok yang sesuai.')
    validateStockMovement(input.direction, input.quantity, balances.value.get(input.productId) ?? 0)
    const id = nextId(data.value.inventoryMovements)
    const movement: StockMovement = { ...input, id, reference: input.reference?.trim() || 'STK-' + String(id).padStart(5, '0'), notes: input.notes?.trim() || '', createdAt: new Date().toISOString() }
    data.value.inventoryMovements = [...data.value.inventoryMovements, movement]
    return movement
  }
  function addToCart(productId: number, quantity = 1) {
    const product = products.value.find(item => item.id === productId)
    if (!product || product.status !== 'Active' || !Number.isInteger(quantity) || quantity < 1) return false
    const line = data.value.cart.find(item => item.productId === productId)
    if ((line?.quantity ?? 0) + quantity > product.stock) return false
    if (line) line.quantity += quantity
    else data.value.cart.push({ productId, quantity })
    return true
  }
  function checkout(customer: Omit<Customer, 'id' | 'joined'>, address: string, paymentMethod: string) {
    if (!cartItems.value.length || cartItems.value.length !== data.value.cart.length || cartItems.value.some(line => line.product.status !== 'Active' || !Number.isSafeInteger(line.quantity) || line.quantity > line.product.stock || line.quantity < 1)) throw new Error('Ada barang yang tidak tersedia. Periksa keranjang Anda.')
    let person = data.value.customers.find(item => item.email.toLowerCase() === customer.email.toLowerCase())
    if (!person) person = { ...customer, id: nextId(data.value.customers), joined: localDate() }
    const order: Order = { id: Math.max(1000, ...data.value.orders.map(item => item.id)) + 1, customerId: person.id, createdAt: new Date().toISOString(), status: 'Pending', paymentStatus: 'Pending', shipping: 20000, address, paymentMethod, items: cartItems.value.map(line => ({ productId: line.product.id, name: line.product.name, price: line.product.price, quantity: line.quantity })) }
    const firstId = nextId(data.value.inventoryMovements)
    const outgoing: StockMovement[] = order.items.map((item, index) => ({ id: firstId + index, productId: item.productId, direction: 'out', quantity: item.quantity, reason: 'sale', reference: 'LM-' + order.id, orderId: order.id, notes: 'Stok keluar otomatis dari checkout.', createdAt: order.createdAt }))
    data.value = { ...data.value, customers: data.value.customers.some(item => item.id === person.id) ? data.value.customers : [...data.value.customers, person], orders: [order, ...data.value.orders], cart: [], inventoryMovements: [...data.value.inventoryMovements, ...outgoing] }
    return order.id
  }
  function updateOrder(id: number, status: Order['status'], paymentStatus: Order['paymentStatus']) {
    const order = data.value.orders.find(item => item.id === id)
    if (!order) throw new Error('Pesanan tidak ditemukan.')
    if (order.status === 'Cancelled' && status !== 'Cancelled') throw new Error('Pesanan dibatalkan tidak dapat diaktifkan kembali. Buat pesanan baru.')
    const returns: StockMovement[] = []
    if (status === 'Cancelled' && order.status !== 'Cancelled') {
      const net = new Map<number, number>()
      for (const movement of data.value.inventoryMovements.filter(m => m.orderId === id)) net.set(movement.productId, (net.get(movement.productId) ?? 0) + (movement.direction === 'out' ? movement.quantity : -movement.quantity))
      const firstId = nextId(data.value.inventoryMovements)
      for (const [productId, quantity] of net) if (quantity > 0) returns.push({ id: firstId + returns.length, productId, quantity, direction: 'in', reason: 'return', reference: 'BATAL-LM-' + id, orderId: id, notes: 'Pengembalian stok otomatis karena pesanan dibatalkan.', createdAt: new Date().toISOString() })
    }
    data.value = { ...data.value, orders: data.value.orders.map(item => item.id === id ? { ...item, status, paymentStatus } : item), inventoryMovements: [...data.value.inventoryMovements, ...returns] }
  }
  function enroll(courseId: number) {
    if (!data.value.enrollments.some(item => item.courseId === courseId)) data.value.enrollments.push({ courseId, completed: [] })
  }
  function bookMany(bookings: Omit<Booking, 'id' | 'status'>[]) {
    for (const booking of bookings) {
      if (!courses.some(course => course.id === booking.courseId && course.instructor === booking.instructor) || !data.value.enrollments.some(item => item.courseId === booking.courseId)) throw new Error('Pilih kursus yang sudah Anda ikuti.')
    }
    validateBookingBatch(bookings, { bookings: data.value.bookings, instructorBookings: data.value.instructorBookings })
    const firstId = nextId(data.value.bookings)
    const created: Booking[] = bookings.map((booking, index) => ({ ...booking, id: firstId + index, status: 'Confirmed' }))
    data.value.bookings = [...data.value.bookings, ...created]
    return created
  }
  function book(booking: Omit<Booking, 'id' | 'status'>) { return bookMany([booking])[0] }
  return { data, products, cartItems, cartTotal, cartCount, nextId, saveProduct, recordStock, updateOrder, addToCart, checkout, enroll, book, bookMany }
})
