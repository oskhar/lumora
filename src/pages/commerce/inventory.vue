<script setup lang="ts">
import { useDemoStore } from '@/stores/demo'
import { movementReasonLabel, validateStockMovement, type StockMovement } from '@/utils/inventory'
const store = useDemoStore()
const route = useRoute()
const tab = ref('balance')
const open = ref(false)
const saved = ref('')
const error = ref('')
const detail = ref<StockMovement | null>(null)
const form = reactive({ productId: null as number | null, direction: 'in' as StockMovement['direction'], quantity: 1, reason: 'receipt' as StockMovement['reason'], reference: '', notes: '' })
const selected = computed(() => store.products.find(p => p.id === form.productId))
const resulting = computed(() => (selected.value?.stock ?? 0) + (form.direction === 'in' ? 1 : -1) * Number(form.quantity))
const validation = computed(() => {
  if (!selected.value) return 'Pilih produk terlebih dahulu.'
  try { validateStockMovement(form.direction, Number(form.quantity), selected.value.stock); return '' }
  catch (cause) { return cause instanceof Error ? cause.message : 'Periksa jumlah barang.' }
})
const reasons = computed(() => (form.direction === 'in' ? ['receipt', 'return', 'adjustment'] : ['usage', 'damage', 'adjustment']).map(reason => ({ title: movementReasonLabel(reason as StockMovement['reason']), value: reason })))
const category = (id: number) => store.data.categories.find(c => c.id === id)?.name ?? 'Tanpa kategori'
const balanceRows = computed(() => store.products.map(p => ({ ...p, category: category(p.categoryId), availability: p.stock === 0 ? 'Habis' : p.stock < 10 ? 'Menipis' : 'Tersedia' })))
const movementRows = computed(() => [...store.data.inventoryMovements].reverse().map(m => ({ ...m, name: store.products.find(p => p.id === m.productId)?.name ?? 'Produk diarsipkan', sku: store.products.find(p => p.id === m.productId)?.sku ?? '—', directionLabel: m.direction === 'in' ? 'Masuk' : 'Keluar', reasonLabel: movementReasonLabel(m.reason), date: new Date(m.createdAt).toLocaleString('id-ID') })))
const focusProduct = computed(() => store.products.find(p => p.id === Number(route.query.product)))
const total = computed(() => store.products.reduce((sum, p) => sum + p.stock, 0))
const low = computed(() => store.products.filter(p => p.stock > 0 && p.stock < 10).length)
const empty = computed(() => store.products.filter(p => p.stock === 0).length)
const headers = [{ title: 'Produk', key: 'name' }, { title: 'SKU', key: 'sku' }, { title: 'Kategori', key: 'category' }, { title: 'Saldo (unit)', key: 'stock' }, { title: 'Ketersediaan', key: 'availability' }, { title: 'Catat pergerakan', key: 'actions', sortable: false }]
const historyHeaders = [{ title: 'Waktu', key: 'date' }, { title: 'Produk', key: 'name' }, { title: 'Jenis', key: 'directionLabel' }, { title: 'Jumlah (unit)', key: 'quantity' }, { title: 'Alasan', key: 'reasonLabel' }, { title: 'Referensi', key: 'reference' }, { title: 'Detail', key: 'actions', sortable: false }]
function show(direction: StockMovement['direction'], productId?: number) {
  Object.assign(form, { productId: productId ?? focusProduct.value?.id ?? null, direction, quantity: 1, reason: direction === 'in' ? 'receipt' : 'usage', reference: '', notes: '' })
  error.value = ''; open.value = true
}
function save() {
  if (validation.value || !form.productId) return
  error.value = ''
  try {
    const movement = store.recordStock({ ...form, productId: form.productId, quantity: Number(form.quantity) })
    saved.value = `${movement.reference}: ${movement.quantity} unit ${form.direction === 'in' ? 'masuk' : 'keluar'} untuk ${selected.value?.name}. Saldo sekarang ${selected.value?.stock} unit.`
    open.value = false
  } catch (cause) { error.value = cause instanceof Error ? cause.message : 'Pergerakan belum tersimpan.' }
}
</script>
<template>
  <PageHeader title="Pengelolaan stok" eyebrow="COMMERCE" description="Satu tempat untuk stok masuk, stok keluar, dan jejak transaksi barang.">
    <VBtn variant="outlined" prepend-icon="ri-subtract-line" @click="show('out')">Stok keluar</VBtn>
    <VBtn prepend-icon="ri-add-line" @click="show('in')">Stok masuk</VBtn>
  </PageHeader>
  <VAlert v-if="saved" type="info" variant="tonal" closable class="mb-5" @click:close="saved = ''">{{ saved }}</VAlert>
  <VAlert v-if="focusProduct" variant="tonal" color="primary" class="mb-5">Produk yang Anda buka: <strong>{{ focusProduct.name }}</strong> · {{ focusProduct.stock }} unit. Gunakan tombol stok masuk/keluar untuk produk ini.</VAlert>
  <VRow class="mb-3"><VCol cols="12" sm="4"><VCard class="pa-5"><p class="text-body-2 text-medium-emphasis">Total unit tersedia</p><p class="text-h4 mt-2">{{ total }}</p></VCard></VCol><VCol cols="6" sm="4"><VCard class="pa-5"><p class="text-body-2 text-medium-emphasis">Produk menipis (&lt;10)</p><p class="text-h4 mt-2">{{ low }}</p></VCard></VCol><VCol cols="6" sm="4"><VCard class="pa-5"><p class="text-body-2 text-medium-emphasis">Produk habis</p><p class="text-h4 mt-2">{{ empty }}</p></VCard></VCol></VRow>
  <VAlert variant="tonal" color="primary" class="mb-5">Saldo = seluruh stok masuk − seluruh stok keluar. Checkout otomatis mencatat penjualan; pembatalan mengembalikan stok terkait satu kali. Catatan tidak dihapus atau diedit: gunakan penyesuaian dengan alasan yang jelas untuk koreksi.</VAlert>
  <VTabs v-model="tab" class="mb-4" aria-label="Tampilan persediaan"><VTab value="balance">Saldo per produk</VTab><VTab value="history">Riwayat pergerakan</VTab></VTabs>
  <ExplorerTable v-if="tab === 'balance'" :items="balanceRows" :headers="headers" search-label="Cari produk atau SKU" :filters="[{ key: 'category', label: 'Kategori', options: store.data.categories.map(c => c.name) }, { key: 'availability', label: 'Ketersediaan', options: ['Tersedia', 'Menipis', 'Habis'] }]">
    <template #item.name="{ item }"><RouterLink :to="`/products/${item.id}`">{{ item.name }}</RouterLink></template>
    <template #item.stock="{ item }"><strong>{{ item.stock }}</strong></template>
    <template #item.availability="{ item }"><VChip size="small" :color="item.stock < 10 ? 'warning' : 'primary'">{{ item.availability }}</VChip></template>
    <template #item.actions="{ item }"><IconBtn :aria-label="`Stok masuk ${item.name}`" @click="show('in', item.id)"><VIcon icon="ri-add-circle-line" /><VTooltip activator="parent">Catat stok masuk</VTooltip></IconBtn><IconBtn :disabled="item.stock === 0" :aria-label="`Stok keluar ${item.name}${item.stock === 0 ? ' (stok habis)' : ''}`" @click="show('out', item.id)"><VIcon icon="ri-indeterminate-circle-line" /><VTooltip activator="parent">Catat stok keluar</VTooltip></IconBtn></template>
  </ExplorerTable>
  <ExplorerTable v-else :items="movementRows" :headers="historyHeaders" search-label="Cari produk, SKU, atau referensi" :filters="[{ key: 'directionLabel', label: 'Jenis pergerakan', options: ['Masuk', 'Keluar'] }, { key: 'reasonLabel', label: 'Alasan', options: [...new Set(movementRows.map(m => m.reasonLabel))] }]">
    <template #item.directionLabel="{ item }"><VChip size="small" :color="item.direction === 'in' ? 'primary' : 'secondary'">{{ item.directionLabel }}</VChip></template>
    <template #item.quantity="{ item }"><strong>{{ item.direction === 'in' ? '+' : '−' }}{{ item.quantity }}</strong></template>
    <template #item.reference="{ item }"><RouterLink v-if="item.orderId" :to="`/orders/${item.orderId}`">{{ item.reference }}</RouterLink><span v-else>{{ item.reference }}</span></template>
    <template #item.actions="{ item }"><IconBtn :aria-label="`Detail pergerakan ${item.reference}`" @click="detail = item"><VIcon icon="ri-eye-line" /><VTooltip activator="parent">Lihat catatan</VTooltip></IconBtn></template>
  </ExplorerTable>
  <VDialog v-model="open" max-width="580" :aria-label="form.direction === 'in' ? 'Catat stok masuk' : 'Catat stok keluar'"><VCard tag="form" :title="form.direction === 'in' ? 'Catat stok masuk' : 'Catat stok keluar'" @submit.prevent="save"><VCardText class="form-stack">
    <p class="text-body-2 text-medium-emphasis">{{ form.direction === 'in' ? 'Gunakan untuk penerimaan barang, retur, atau koreksi penambahan.' : 'Gunakan untuk pemakaian, barang rusak, atau koreksi pengurangan. Penjualan dari checkout sudah dicatat otomatis; jangan dicatat dua kali.' }}</p>
    <VAutocomplete v-model="form.productId" :items="store.products.map(p => ({ title: `${p.name} · ${p.sku}`, value: p.id }))" label="Produk" placeholder="Cari nama atau SKU" :clearable="true" />
    <VTextField v-model.number="form.quantity" label="Jumlah unit" type="number" min="1" step="1" :error-messages="selected && validation ? validation : undefined" />
    <VSelect v-model="form.reason" :items="reasons" label="Alasan pergerakan" />
    <VTextField v-model="form.reference" label="Nomor referensi (opsional)" maxlength="100" hint="Contoh: PO-2026-001. Jika kosong, nomor dibuat otomatis." persistent-hint />
    <VTextarea v-model="form.notes" label="Catatan (opsional)" rows="2" maxlength="1000" placeholder="Jelaskan sumber barang atau alasan koreksi." />
    <VAlert v-if="selected" :color="validation ? 'warning' : 'primary'" variant="tonal" aria-live="polite">Saldo saat ini <strong>{{ selected.stock }}</strong> unit → setelah disimpan <strong>{{ Number.isSafeInteger(resulting) ? resulting : '—' }}</strong> unit.</VAlert>
    <p class="text-caption">Catatan akan masuk ke riwayat dan tidak dapat diedit. Periksa produk, jumlah, dan alasan sebelum menyimpan.</p>
    <VAlert v-if="error" type="error" variant="tonal" role="alert">{{ error }}</VAlert>
  </VCardText><VCardActions class="pa-5 flex-wrap gap-2"><VSpacer /><VBtn @click="open = false">Batal</VBtn><VBtn type="submit" variant="flat" :disabled="!!validation" data-testid="save-stock">Simpan stok {{ form.direction === 'in' ? 'masuk' : 'keluar' }}</VBtn></VCardActions></VCard></VDialog>
  <VDialog :model-value="!!detail" max-width="500" aria-label="Detail pergerakan stok" @update:model-value="detail = null"><VCard v-if="detail" title="Detail pergerakan"><VCardText class="form-stack"><p>{{ detail.reference }} · {{ new Date(detail.createdAt).toLocaleString('id-ID') }}</p><p>{{ store.products.find(p => p.id === detail?.productId)?.name }} · {{ detail.quantity }} unit {{ detail.direction === 'in' ? 'masuk' : 'keluar' }}</p><p>{{ movementReasonLabel(detail.reason) }}</p><p style="white-space: pre-wrap; overflow-wrap: anywhere">{{ detail.notes || 'Tidak ada catatan tambahan.' }}</p><VBtn v-if="detail.orderId" :to="`/orders/${detail.orderId}`" variant="tonal" @click="detail = null">Lihat pesanan terkait</VBtn></VCardText><VCardActions class="pa-4"><VSpacer /><VBtn @click="detail = null">Tutup</VBtn></VCardActions></VCard></VDialog>
</template>
