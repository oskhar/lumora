<script setup lang="ts">
import { statusLabel, statusOptions } from "@/utils/ui"
import { productImage } from "@/utils/media"
import { useDemoStore, money, statusColor } from '@/stores/demo'
const store = useDemoStore(); const route = useRoute()
const product = computed(() => store.products.find(item => item.id === Number(route.params.id)))
const customerView = computed(() => route.path.startsWith('/shop'))
const visible = computed(() => product.value && (!customerView.value || product.value.status === 'Active'))
const inCart = computed(() => store.data.cart.find(line => line.productId === product.value?.id)?.quantity ?? 0)
const remaining = computed(() => Math.max(0, (product.value?.stock ?? 0) - inCart.value))
const canAdd = computed(() => Number.isInteger(Number(quantity.value)) && Number(quantity.value) > 0 && Number(quantity.value) <= remaining.value)
const quantity = ref(1); const message = ref(''); const success = ref(false)
watch(() => route.params.id, () => { quantity.value = 1; message.value = '' })
function add() { if (!product.value) return; success.value = store.addToCart(product.value.id, Number(quantity.value)); message.value = success.value ? 'Produk berhasil ditambahkan ke keranjang.' : 'Masukkan jumlah yang masih tersedia di stok.' }
</script>
<template>
  <PageHeader :title="visible ? product?.name ?? 'Produk' : 'Product not found'" :eyebrow="customerView ? 'STORE' : 'COMMERCE'" :back="customerView ? '/shop/products' : '/products'" description="Lihat rincian produk, harga, dan ketersediaan sebelum melanjutkan.">
    <VBtn v-if="!customerView && product" :to="`/products/${product.id}/edit`" prepend-icon="ri-edit-line">Edit produk</VBtn><VBtn v-if="customerView" to="/shop/cart" variant="outlined" prepend-icon="ri-shopping-cart-line">Cart ({{ store.cartCount }})</VBtn>
  </PageHeader>
  <VAlert v-if="!customerView && route.query.saved" type="info" variant="tonal" class="mb-5" role="status">Produk berhasil disimpan. <RouterLink to="/products">Lihat semua produk</RouterLink></VAlert>
  <VAlert v-if="!visible" type="warning">Produk ini tidak tersedia. Kembali ke katalog untuk memilih produk lain.</VAlert>
  <VRow v-else-if="product"><VCol cols="12" md="6"><VCard class="pa-5"><ProductArt :icon="product.icon" :image="productImage(product)" :alt="product.name" large /></VCard></VCol><VCol cols="12" md="6"><VCard><VCardText class="form-stack"><div class="d-flex gap-2"><VChip color="primary" variant="tonal">{{ store.data.categories.find(c => c.id === product?.categoryId)?.name }}</VChip><VChip :color="statusColor(product.status)">{{ statusLabel(product.status) }}</VChip></div><h3 class="text-h3">{{ money(product.price) }}</h3><p class="text-body-1" style="line-height: 1.8; white-space: pre-line">{{ product.description || 'Deskripsi produk belum ditambahkan.' }}</p><VDivider /><dl class="detail-list"><div><dt>SKU</dt><dd>{{ product.sku }}</dd></div><div><dt>Ketersediaan</dt><dd>{{ product.stock ? `${product.stock} unit` : 'Stok habis' }}</dd></div><div><dt>Pengiriman</dt><dd>Standard delivery · {{ money(20000) }}</dd></div></dl><template v-if="customerView"><VTextField v-model.number="quantity" label="Jumlah barang" type="number" min="1" :max="remaining" step="1" :hint="inCart ? inCart + ' barang sudah di keranjang. Maksimal tambahan ' + remaining + ' barang.' : 'Masukkan jumlah antara 1 dan ' + product.stock + '.'" persistent-hint /><VBtn :disabled="!canAdd" size="large" prepend-icon="ri-shopping-cart-line" @click="add">{{ product.stock ? 'Tambah ke keranjang' : 'Stok habis' }}</VBtn><VAlert v-if="message" :type="success ? 'info' : 'warning'" variant="tonal">{{ message }} <RouterLink v-if="success" to="/shop/cart">Lihat keranjang</RouterLink></VAlert></template><VBtn v-else-if="product.status === 'Active'" :to="`/shop/products/${product.id}`" variant="tonal">Lihat di toko</VBtn></VCardText></VCard></VCol></VRow>
</template>
