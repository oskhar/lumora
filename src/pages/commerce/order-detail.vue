<script setup lang="ts">
import { statusLabel, statusOptions } from "@/utils/ui"
import { useDemoStore, money, orderTotal, statusColor, type Order } from '@/stores/demo'
const store = useDemoStore(); const route = useRoute()
const order = computed(() => store.data.orders.find(item => item.id === Number(route.params.id)))
const customer = computed(() => store.data.customers.find(item => item.id === order.value?.customerId))
const customerView = computed(() => route.path.startsWith('/shop'))
const dirty = computed(() => !!order.value && (status.value !== order.value.status || payment.value !== order.value.paymentStatus))
const cancelConfirm = ref(false)
const error = ref('')
const status = ref<Order['status']>('Pending'); const payment = ref<Order['paymentStatus']>('Pending'); const saved = ref(false)
watch(order, value => { if (value) { status.value = value.status; payment.value = value.paymentStatus }; saved.value = false }, { immediate: true })
watch([status, payment], () => { saved.value = false })
function requestSave() { if (status.value === 'Cancelled' && order.value?.status !== 'Cancelled') cancelConfirm.value = true; else save() }
function save() {
  if (!order.value) return
  error.value = ''
  try { store.updateOrder(order.value.id, status.value, payment.value); saved.value = true }
  catch (cause) { error.value = cause instanceof Error ? cause.message : 'Status belum tersimpan.' }
}
</script>
<template>
  <PageHeader :title="order ? `Pesanan #LM-${order.id}` : 'Pesanan tidak ditemukan'" :eyebrow="customerView ? 'YOUR ORDER' : 'COMMERCE'" :back="customerView ? '/shop/products' : '/orders'" :description="order ? `Dibuat ${new Date(order.createdAt).toLocaleString('id-ID')}` : ''" />
  <ShoppingSteps v-if="customerView && order" :step="3" />
  <VAlert v-if="customerView && route.query.placed && order" type="info" variant="tonal" class="mb-5">Pesanan berhasil dibuat. Simpan nomor pesanan di atas untuk melihatnya kembali. <RouterLink to="/shop/products">Lanjut belanja</RouterLink></VAlert>
  <VAlert v-if="!order" type="warning">Pesanan tidak ditemukan. Kembali ke daftar untuk memilih pesanan yang tersedia.</VAlert>
  <VRow v-else><VCol cols="12" md="8"><VCard title="Produk yang dipesan" class="mb-5"><VTable><thead><tr><th>Produk</th><th>Jumlah barang</th><th>Harga</th><th>Total</th></tr></thead><tbody><tr v-for="item in order.items" :key="item.productId"><td>{{ item.name }}</td><td>{{ item.quantity }}</td><td>{{ money(item.price) }}</td><td>{{ money(item.quantity * item.price) }}</td></tr></tbody></VTable><VCardText><dl class="detail-list"><div><dt>Subtotal</dt><dd>{{ money(orderTotal(order) - order.shipping) }}</dd></div><div><dt>Pengiriman</dt><dd>{{ money(order.shipping) }}</dd></div><div class="font-weight-bold"><dt>Total</dt><dd>{{ money(orderTotal(order)) }}</dd></div></dl></VCardText></VCard><VCard title="Alamat pengiriman"><VCardText><p class="font-weight-medium mb-2">{{ customer?.name }}</p><p>{{ order.address }}</p><p class="text-medium-emphasis mt-2">{{ customer?.phone }} · {{ customer?.email }}</p></VCardText></VCard></VCol><VCol cols="12" md="4"><VCard title="Status pesanan"><VCardText class="form-stack"><div class="d-flex gap-2 flex-wrap"><VChip :color="statusColor(order.status)">{{ statusLabel(order.status) }}</VChip><VChip :color="statusColor(order.paymentStatus)">{{ statusLabel(order.paymentStatus) }}</VChip></div><p class="text-body-2">Metode pembayaran: {{ order.paymentMethod }}</p><template v-if="!customerView"><VSelect :disabled="order.status === 'Cancelled'" v-model="status" :items="statusOptions(['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled'])" label="Status pengiriman" /><VSelect v-model="payment" :items="statusOptions(['Pending', 'Paid'])" label="Status pembayaran" /><p class="text-body-2 text-medium-emphasis">{{ dirty ? 'Ada status baru yang belum disimpan.' : 'Pilih status baru untuk memperbarui pesanan.' }}</p><VBtn :disabled="!dirty" @click="requestSave">Simpan status pesanan</VBtn><VAlert v-if="error" type="error" variant="tonal">{{ error }}</VAlert><VAlert v-if="saved" variant="tonal" type="info">Status pesanan berhasil disimpan.</VAlert></template><p class="text-caption">Pesanan demo. Tidak ada pembayaran atau pengiriman sungguhan. Pembatalan mengembalikan stok yang tercatat keluar untuk pesanan ini, satu kali saja. Pesanan historis tanpa catatan stok keluar tidak menambah saldo. Refund tidak diproses dalam demo.</p></VCardText></VCard><VCard v-if="!customerView && customer" title="Pelanggan" class="mt-5"><VCardText><p class="mb-3">{{ customer.name }}</p><VBtn :to="`/customers/${customer.id}`" variant="tonal">Lihat profil pelanggan</VBtn></VCardText></VCard></VCol></VRow>
  <VDialog v-model="cancelConfirm" max-width="480" aria-label="Konfirmasi pembatalan pesanan"><VCard title="Batalkan pesanan ini?"><VCardText>Pesanan #LM-{{ order?.id }} akan ditandai Dibatalkan. Stok keluar yang terkait pesanan ini akan dikembalikan melalui catatan retur. Pembatalan tidak dapat diaktifkan kembali. Pengembalian dana tetap perlu ditangani terpisah.</VCardText><VCardActions class="pa-5"><VSpacer /><VBtn @click="cancelConfirm = false">Kembali</VBtn><VBtn variant="flat" color="error" @click="save(); cancelConfirm = false">Batalkan pesanan</VBtn></VCardActions></VCard></VDialog>
</template>
