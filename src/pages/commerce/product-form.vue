<script setup lang="ts">
import { useDemoStore, type Product } from '@/stores/demo'
import { statusOptions } from '@/utils/ui'
import { photoOptions, productImage } from '@/utils/media'
const store = useDemoStore()
const route = useRoute()
const router = useRouter()
const editing = computed(() => !!route.params.id)
const existing = computed(() => store.products.find(item => item.id === Number(route.params.id)))
const defaults = () => ({ name: '', sku: '', categoryId: null as number | null, price: 0, status: 'Draft' as Product['status'], description: '', icon: 'ri-shopping-bag-line', image: '' })
const form = reactive(defaults())
const baseline = ref('')
const errors = ref<Record<string, string>>({})
const dirty = computed(() => JSON.stringify(form) !== baseline.value)
watch(() => route.params.id, () => {
  const { stock: _stock, ...metadata } = existing.value ?? { stock: 0 }
  Object.assign(form, defaults(), metadata)
  if (existing.value) form.image = productImage(existing.value) ?? ''
  baseline.value = JSON.stringify(form)
  errors.value = {}
}, { immediate: true })
function save() {
  if (editing.value && !dirty.value) return
  errors.value = {}
  if (!form.name.trim()) errors.value.name = 'Isi nama produk.'
  if (!form.sku.trim()) errors.value.sku = 'Isi kode SKU.'
  else if (store.data.products.some(p => p.id !== existing.value?.id && p.sku.toLowerCase() === form.sku.trim().toLowerCase())) errors.value.sku = 'SKU ini sudah digunakan produk lain.'
  if (!store.data.categories.some(c => c.id === form.categoryId)) errors.value.category = 'Pilih kategori produk.'
  if (!Number.isFinite(Number(form.price)) || Number(form.price) < 0) errors.value.price = 'Harga harus nol atau lebih.'
  if (Object.keys(errors.value).length || !form.categoryId) return
  const product: Omit<Product, 'stock'> = { ...form, name: form.name.trim(), sku: form.sku.trim().toUpperCase(), categoryId: form.categoryId, price: Number(form.price), id: existing.value?.id ?? store.nextId(store.data.products) }
  store.saveProduct(product)
  baseline.value = JSON.stringify(form)
  router.push('/products/' + product.id + '?saved=1')
}
</script>
<template>
  <PageHeader :title="editing ? 'Edit produk' : 'Tambah produk'" eyebrow="KELOLA TOKO" back="/products" description="Lengkapi informasi produk, periksa pratinjau, lalu simpan." />
  <VAlert v-if="editing && !existing" type="warning">Produk tidak ditemukan. <RouterLink to="/products">Kembali ke daftar produk</RouterLink></VAlert>
  <form v-else @submit.prevent="save">
    <VRow>
      <VCol cols="12" md="8">
        <VCard title="1. Informasi produk" class="mb-5"><VCardText class="form-stack">
          <p class="text-body-2 text-medium-emphasis">Nama, SKU, kategori, dan harga wajib diisi. Stok dikelola terpisah melalui pergerakan barang.</p>
          <VTextField v-model="form.name" label="Nama produk" required maxlength="120" placeholder="Contoh: Studio Headphones" :error-messages="errors.name" />
          <VTextField v-model="form.sku" label="Kode produk (SKU)" required maxlength="40" hint="Kode unik untuk stok dan impor. Contoh: LM-AU-011." persistent-hint :error-messages="errors.sku" />
          <VSelect v-model="form.categoryId" :items="store.data.categories" item-title="name" item-value="id" label="Kategori produk" :error-messages="errors.category" />
          <VTextarea v-model="form.description" label="Deskripsi produk (opsional)" rows="4" maxlength="3000" placeholder="Jelaskan manfaat, bahan, ukuran, dan hal yang perlu diketahui pembeli." />
        </VCardText></VCard>
        <VCard title="2. Harga & persediaan"><VCardText><VRow>
          <VCol cols="12" sm="6"><VTextField v-model.number="form.price" label="Harga jual (Rp)" type="number" min="0" step="1" required hint="Masukkan angka tanpa titik atau Rp. Contoh: 895000." persistent-hint :error-messages="errors.price" /></VCol>
          <VCol cols="12" sm="6"><VAlert variant="tonal" color="primary"><p>Saldo stok: <strong>{{ existing?.stock ?? 0 }} unit</strong></p><p class="text-body-2 mt-2">Dihitung dari stok masuk dan keluar, bukan diubah saat mengedit produk.</p><VBtn v-if="existing" :to="`/inventory?product=${existing.id}`" variant="text" class="mt-2">Kelola stok</VBtn><p v-else class="text-body-2 mt-2">Simpan produk, lalu catat stok masuk di Pengelolaan stok.</p></VAlert></VCol>
        </VRow></VCardText></VCard>
      </VCol>
      <VCol cols="12" md="4">
        <VCard title="3. Foto & publikasi"><VCardText class="form-stack">
          <ProductArt :icon="form.icon" :image="form.image" :alt="form.name || 'Pratinjau produk'" />
          <VSelect v-model="form.image" :items="photoOptions" label="Foto contoh produk" hint="Pilih foto dummy yang paling sesuai dengan produk." persistent-hint />
          <VSelect v-model="form.status" :items="statusOptions(['Draft', 'Active'])" label="Tampilkan produk sebagai" />
          <VAlert :type="form.status === 'Active' ? 'info' : undefined" variant="tonal" color="primary">{{ form.status === 'Active' ? 'Aktif: produk akan langsung tampil di katalog pelanggan setelah disimpan.' : 'Draft: produk hanya terlihat di admin dan belum bisa dibeli.' }}</VAlert>
        </VCardText></VCard>
      </VCol>
      <VCol cols="12">
        <VAlert v-if="Object.keys(errors).length" type="error" variant="tonal" class="mb-4" role="alert">Produk belum disimpan. Periksa kolom yang ditandai.</VAlert>
        <VCard class="pa-4"><div class="d-flex align-center justify-space-between flex-wrap gap-3"><span class="text-body-2 text-medium-emphasis">{{ dirty ? 'Ada perubahan yang belum disimpan.' : 'Belum ada perubahan baru.' }}</span><div class="d-flex gap-3"><VBtn to="/products" variant="outlined">Batal</VBtn><VBtn type="submit" :disabled="editing && !dirty" prepend-icon="ri-save-line">{{ editing ? 'Simpan perubahan' : form.status === 'Active' ? 'Terbitkan produk' : 'Simpan sebagai draft' }}</VBtn></div></div></VCard>
      </VCol>
    </VRow>
  </form>
  <UnsavedChangesGuard :dirty="dirty" />
</template>
