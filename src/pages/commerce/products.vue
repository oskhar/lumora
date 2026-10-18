<script setup lang="ts">
import { statusLabel, statusOptions } from "@/utils/ui"
import { productImage } from "@/utils/media"
import { useDemoStore, money, statusColor, type Product } from '@/stores/demo'
const store = useDemoStore()
const message = ref('')
const error = ref('')
const importOpen = ref(false)
const file = ref<File | null>(null)
const importing = ref(false)
const preview = ref<Omit<Product, 'stock'>[] | null>(null)
const updatedCount = computed(() => preview.value?.filter(p => store.data.products.some(existing => existing.sku.toUpperCase() === p.sku)).length ?? 0)
watch(file, () => { preview.value = null; error.value = '' })
const rows = computed(() => store.products.map(product => ({ ...product, category: store.data.categories.find(category => category.id === product.categoryId)?.name ?? 'Uncategorized' })))
const headers = [{ title: 'Produk', key: 'name' }, { title: 'SKU', key: 'sku' }, { title: 'Kategori', key: 'category' }, { title: 'Harga', key: 'price' }, { title: 'Stok', key: 'stock' }, { title: 'Status', key: 'status' }, { title: 'Aksi', key: 'actions', sortable: false }]
function exportProducts() {
  const blob = new Blob([JSON.stringify(store.data.products, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a'); link.href = url; link.download = 'lumora-products.json'; link.click()
  setTimeout(() => URL.revokeObjectURL(url), 1000)
  message.value = 'File JSON produk sudah diunduh. File ini dapat diimpor kembali setelah diperbarui.'
}
async function importProducts() {
  error.value = ''
  if (!file.value) { error.value = 'Pilih file JSON terlebih dahulu.'; return }
  if (file.value.size > 1_000_000) { error.value = 'Ukuran file maksimal 1 MB.'; return }
  importing.value = true
  try {
    const input: unknown = JSON.parse(await file.value.text())
    if (!Array.isArray(input) || !input.length || input.length > 500) throw new Error('Gunakan array JSON dengan 1–500 produk.')
    const parsed: Omit<Product, 'stock'>[] = input.map((entry: unknown, index: number) => {
      if (!entry || typeof entry !== 'object') throw new Error(`Baris ${index + 1}: data produk tidak valid.`)
      const p = entry as Record<string, unknown>
      if (typeof p.name !== 'string' || !p.name.trim() || typeof p.sku !== 'string' || !p.sku.trim()
        || typeof p.price !== 'number' || !Number.isFinite(p.price) || p.price < 0
        || !store.data.categories.some(category => category.id === p.categoryId)
        || !['Active', 'Draft'].includes(String(p.status))) throw new Error(`Baris ${index + 1}: periksa nama, SKU, categoryId, harga, dan status (Active atau Draft).`)
      return { id: 0, name: p.name.trim(), sku: p.sku.trim().toUpperCase(), categoryId: p.categoryId as number, price: p.price, status: p.status as Product['status'], description: typeof p.description === 'string' ? p.description : '', icon: 'ri-shopping-bag-line' }
    })
    if (new Set(parsed.map(p => p.sku)).size !== parsed.length) throw new Error('Ada SKU yang sama di dalam file. Gunakan satu SKU unik untuk setiap produk.')
    preview.value = parsed
  } catch (cause) { error.value = cause instanceof Error ? cause.message : 'Format file bukan JSON yang valid.' }
  finally { importing.value = false }
}
function confirmImport() {
  if (!preview.value) return
  const merged = structuredClone(toRaw(store.data.products))
  for (const product of preview.value) {
    const existing = merged.find(p => p.sku.toUpperCase() === product.sku)
    if (existing) Object.assign(existing, { ...product, id: existing.id, icon: existing.icon, image: existing.image })
    else merged.push({ ...product, id: store.nextId(merged) })
  }
  message.value = preview.value.length + ' produk berhasil diimpor: ' + updatedCount.value + ' diperbarui, ' + (preview.value.length - updatedCount.value) + ' ditambahkan.'
  store.data.products = merged
  importOpen.value = false
  preview.value = null
  file.value = null
}

</script>
<template>
  <PageHeader title="Produk" eyebrow="COMMERCE" description="Kelola katalog produk. Saldo stok dihitung dari pergerakan barang pada halaman Pengelolaan stok.">
    <VBtn variant="outlined" prepend-icon="ri-download-line" @click="exportProducts">Ekspor JSON</VBtn>
    <VBtn variant="outlined" prepend-icon="ri-upload-line" @click="importOpen = true; error = ''; preview = null">Impor JSON</VBtn>
    <VBtn to="/products/add" prepend-icon="ri-add-line">Tambah produk</VBtn>
  </PageHeader>
  <VAlert v-if="message" type="info" variant="tonal" closable class="mb-5" @click:close="message = ''">{{ message }}</VAlert>
  <ExplorerTable search-label="Cari nama produk atau SKU" :items="rows" :headers="headers" :filters="[{ key: 'status', label: 'Status', options: statusOptions(['Active', 'Draft']) }, { key: 'category', label: 'Kategori', options: store.data.categories.map(c => c.name) }]">
    <template #item.name="{ item }"><RouterLink :to="`/products/${item.id}`" class="d-flex align-center gap-3 py-3"><VAvatar :image="productImage(item)" color="primary" variant="tonal" rounded><VIcon v-if="!productImage(item)" :icon="item.icon" /></VAvatar><span class="font-weight-medium">{{ item.name }}</span></RouterLink></template>
    <template #item.price="{ item }">{{ money(item.price) }}</template>
    <template #item.stock="{ item }"><RouterLink :to="`/inventory?product=${item.id}`" :class="item.stock < 10 ? 'text-warning' : ''">{{ item.stock }} unit</RouterLink></template>
    <template #item.status="{ item }"><VChip :color="statusColor(item.status)" size="small">{{ statusLabel(item.status) }}</VChip></template>
    <template #item.actions="{ item }"><IconBtn :to="`/products/${item.id}/edit`" :aria-label="`Edit produk ${item.name}`"><VIcon icon="ri-pencil-line" /><VTooltip activator="parent" location="top">Edit produk</VTooltip></IconBtn></template>
  </ExplorerTable>
  <VDialog v-model="importOpen" max-width="540" aria-label="Impor produk"><VCard title="Impor produk">
    <VCardText><p class="mb-4">1. Unduh daftar melalui Ekspor JSON, lalu edit file tersebut. 2. Pilih file di bawah dan periksa isinya. 3. Tinjau ringkasan sebelum menekan Impor.</p><p class="text-caption mb-4">Kolom wajib: name, sku, categoryId, price, status (Active/Draft). SKU yang sama akan diperbarui; SKU baru akan ditambahkan. Maksimal 500 produk dan 1 MB. Impor tidak mengubah stok; kolom stock dari file lama diabaikan. Produk baru memiliki saldo 0 sampai stok masuk dicatat.</p><VFileInput v-model="file" accept=".json,application/json" label="Pilih file produk (.json)" /><VAlert v-if="preview" type="info" variant="tonal" class="mt-4"><strong>{{ preview.length }} produk siap diimpor.</strong><p class="mt-2">{{ updatedCount }} produk akan diperbarui dan {{ preview.length - updatedCount }} produk akan ditambahkan. Belum ada data yang berubah.</p></VAlert><VAlert v-if="error" type="error" variant="tonal" class="mt-4" role="alert">{{ error }}</VAlert></VCardText>
    <VCardActions class="pa-4"><VSpacer /><VBtn @click="importOpen = false">Batal</VBtn><VBtn v-if="!preview" variant="flat" :loading="importing" :disabled="!file" @click="importProducts">Periksa file</VBtn><VBtn v-else variant="flat" @click="confirmImport">Impor {{ preview.length }} produk</VBtn></VCardActions>
  </VCard></VDialog>
</template>
