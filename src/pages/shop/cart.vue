<script setup lang="ts">
import { productImage } from '@/utils/media'
import { useDemoStore, money } from '@/stores/demo'
const store = useDemoStore()
const invalid = computed(() => store.cartItems.some(line => line.quantity > line.product.stock || line.product.status !== 'Active'))
const removed = ref<{ productId: number; quantity: number; name: string } | null>(null)
const snackOpen = ref(false)
const message = ref('')
function changeQuantity(id: number, change: number) {
  const line = store.data.cart.find(item => item.productId === id)
  const product = store.products.find(item => item.id === id)
  if (line && product && line.quantity + change >= 1 && line.quantity + change <= product.stock) line.quantity += change
}
function remove(id: number) {
  const line = store.cartItems.find(item => item.productId === id)
  if (!line) return
  removed.value = { productId: id, quantity: line.quantity, name: line.product.name }
  store.data.cart = store.data.cart.filter(item => item.productId !== id)
  message.value = line.product.name + ' dihapus dari keranjang.'
  snackOpen.value = true
}
function undo() {
  if (!removed.value) return
  if (!store.addToCart(removed.value.productId, removed.value.quantity)) { message.value = 'Barang tidak dapat dipulihkan karena stok berubah.'; removed.value = null; return }
  removed.value = null; snackOpen.value = false
}
</script>
<template>
  <PageHeader title="Keranjang belanja" eyebrow="BELANJA" description="Atur jumlah barang, lalu periksa total sebelum checkout." back="/shop/products" />
  <ShoppingSteps :step="1" />
  <VCard v-if="!store.cartItems.length" class="text-center pa-10"><VIcon icon="ri-shopping-cart-line" size="52" color="primary" /><h3 class="text-h5 mt-4 mb-2">Keranjang Anda masih kosong</h3><p class="mb-5">Temukan produk di katalog, lalu tekan Tambah ke keranjang.</p><VBtn to="/shop/products">Lihat katalog produk</VBtn></VCard>
  <VRow v-else>
    <VCol cols="12" md="8"><VCard title="Barang pilihan Anda"><VCardText>
      <div v-for="line in store.cartItems" :key="line.productId" class="cart-item">
        <VAvatar :image="productImage(line.product)" rounded size="72" color="primary" variant="tonal"><VIcon v-if="!productImage(line.product)" :icon="line.product.icon" size="28" /></VAvatar>
        <div class="cart-item-info"><RouterLink :to="'/shop/products/' + line.productId" class="font-weight-medium">{{ line.product.name }}</RouterLink><p class="text-body-2 mt-1">{{ money(line.product.price) }} / barang</p><p class="text-body-2 text-medium-emphasis mt-1">Stok tersedia: {{ line.product.stock }}</p></div>
        <div class="cart-item-controls">
          <div class="quantity-control"><IconBtn :disabled="line.quantity <= 1" :aria-label="'Kurangi jumlah ' + line.product.name" @click="changeQuantity(line.productId, -1)"><VIcon icon="ri-subtract-line" /></IconBtn><output :aria-label="'Jumlah ' + line.product.name" aria-live="polite">{{ line.quantity }}</output><IconBtn :disabled="line.quantity >= line.product.stock || line.product.status !== 'Active'" :aria-label="'Tambah jumlah ' + line.product.name" @click="changeQuantity(line.productId, 1)"><VIcon icon="ri-add-line" /></IconBtn></div>
          <p class="font-weight-medium text-body-2 mt-2">{{ money(line.product.price * line.quantity) }}</p>
          <VBtn variant="text" size="small" color="secondary" prepend-icon="ri-delete-bin-line" @click="remove(line.productId)">Hapus barang</VBtn>
        </div>
        <VAlert v-if="line.product.stock < line.quantity || line.product.status !== 'Active'" type="warning" variant="tonal" class="cart-item-warning">Barang ini tidak tersedia dalam jumlah tersebut. Kurangi jumlah atau hapus dari keranjang.</VAlert>
      </div>
    </VCardText></VCard></VCol>
    <VCol cols="12" md="4"><VCard title="Ringkasan belanja"><VCardText class="form-stack"><dl class="detail-list"><div><dt>Subtotal ({{ store.cartCount }} barang)</dt><dd>{{ money(store.cartTotal) }}</dd></div><div><dt>Ongkir standar</dt><dd>{{ money(20000) }}</dd></div><div class="font-weight-bold"><dt>Total</dt><dd>{{ money(store.cartTotal + 20000) }}</dd></div></dl><VAlert v-if="invalid" type="warning" variant="tonal">Perbaiki barang yang ditandai sebelum melanjutkan.</VAlert><VBtn to="/shop/checkout" size="large" :disabled="invalid" append-icon="ri-arrow-right-line">Lanjut ke checkout</VBtn><p class="text-body-2 text-medium-emphasis">Isi alamat dan pilih pembayaran di langkah berikutnya. Belum ada pesanan yang dibuat.</p></VCardText></VCard></VCol>
  </VRow>
  <VSnackbar v-model="snackOpen" :timeout="7000">{{ message }}<template #actions><VBtn v-if="removed" variant="text" @click="undo">Urungkan</VBtn><VBtn variant="text" @click="snackOpen = false">Tutup</VBtn></template></VSnackbar>
</template>
<style scoped>
.cart-item { display: flex; flex-wrap: wrap; align-items: start; gap: 16px; padding-block: 20px; }
.cart-item + .cart-item { border-block-start: 1px solid rgba(var(--v-border-color), .1); }
.cart-item-info { flex: 1 1 180px; min-inline-size: 0; }
.cart-item-controls { text-align: end; }
.quantity-control { display: inline-flex; align-items: center; border: 1px solid rgba(var(--v-border-color), .16); border-radius: 8px; }
.quantity-control output { min-inline-size: 32px; text-align: center; }
.cart-item-warning { flex-basis: 100%; }
@media(max-width: 599px) { .cart-item-info { flex: 1 1 calc(100% - 90px); } .cart-item-controls { display: flex; align-items: center; flex-wrap: wrap; gap: 10px; inline-size: 100%; text-align: start; } }
</style>
