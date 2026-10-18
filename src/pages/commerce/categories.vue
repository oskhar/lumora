<script setup lang="ts">
import { useDemoStore, type Category } from '@/stores/demo'
const store = useDemoStore(); const deleting = ref<{ id: number; name: string } | null>(null); const deleteOpen = computed({ get: () => !!deleting.value, set: value => { if (!value) deleting.value = null } }); const notice = ref(''); const open = ref(false); const error = ref(''); const form = reactive({ id: 0, name: '', description: '' })
const rows = computed(() => store.data.categories.map(category => ({ ...category, products: store.data.products.filter(product => product.categoryId === category.id).length })))
function edit(category?: Category) { Object.assign(form, category ?? { id: 0, name: '', description: '' }); error.value = ''; open.value = true }
function save() {
  if (!form.name.trim()) { error.value = 'Isi nama kategori terlebih dahulu.'; return }
  if (store.data.categories.some(item => item.id !== form.id && item.name.toLowerCase() === form.name.trim().toLowerCase())) { error.value = 'Nama kategori ini sudah digunakan.'; return }
  const existing = store.data.categories.find(item => item.id === form.id)
  if (existing) Object.assign(existing, { ...form, name: form.name.trim() })
  else store.data.categories.push({ ...form, id: store.nextId(store.data.categories), name: form.name.trim() })
  notice.value = 'Kategori berhasil disimpan.'; open.value = false
}
function remove(id: number) { if (!store.data.products.some(product => product.categoryId === id)) store.data.categories = store.data.categories.filter(category => category.id !== id) }
</script>
<template>
  <PageHeader title="Kategori produk" eyebrow="COMMERCE" description="Atur kategori agar produk mudah ditemukan. Klik ikon pensil untuk mengedit kategori."><VBtn prepend-icon="ri-add-line" @click="edit()">Tambah kategori</VBtn></PageHeader>
  <VAlert v-if="notice" type="info" variant="tonal" closable class="mb-4" @click:close="notice = ''">{{ notice }}</VAlert>
  <ExplorerTable search-label="Cari nama kategori" :items="rows" :headers="[{ title: 'Kategori', key: 'name' }, { title: 'Deskripsi', key: 'description' }, { title: 'Produk', key: 'products' }, { title: 'Aksi', key: 'actions', sortable: false }]">
    <template #item.actions="{ item }"><div class="d-flex gap-1"><IconBtn :aria-label="'Edit kategori ' + item.name" @click="edit(item)"><VIcon icon="ri-pencil-line" /><VTooltip activator="parent">Edit kategori</VTooltip></IconBtn><span class="d-inline-flex" tabindex="0"><IconBtn color="error" :disabled="!!item.products" :aria-label="'Hapus kategori ' + item.name" @click="deleting = item"><VIcon icon="ri-delete-bin-line" /></IconBtn><VTooltip activator="parent">{{ item.products ? 'Pindahkan ' + item.products + ' produk ke kategori lain sebelum menghapus.' : 'Hapus kategori' }}</VTooltip></span></div>
</template>
  </ExplorerTable><p class="text-caption mt-3">Kategori yang masih berisi produk tidak bisa dihapus. Pindahkan produk ke kategori lain terlebih dahulu.</p>
  <VDialog v-model="open" max-width="500" aria-label="Form kategori"><VCard tag="form" :title="form.id ? 'Edit kategori' : 'Tambah kategori'" @submit.prevent="save"><VCardText class="form-stack"><VTextField v-model="form.name" label="Nama" required maxlength="80" /><VTextarea v-model="form.description" label="Deskripsi" rows="3" maxlength="500" /><VAlert v-if="error" type="error" variant="tonal">{{ error }}</VAlert></VCardText><VCardActions class="pa-4"><VSpacer /><VBtn @click="open = false">Batal</VBtn><VBtn variant="flat" type="submit">Simpan kategori</VBtn></VCardActions></VCard></VDialog>
  <VDialog v-model="deleteOpen" max-width="460" aria-label="Hapus kategori"><VCard title="Hapus kategori?"><VCardText>Kategori <strong>{{ deleting?.name }}</strong> akan dihapus. Produk tidak ikut dihapus.</VCardText><VCardActions class="pa-5"><VSpacer /><VBtn variant="outlined" @click="deleting = null">Batal</VBtn><VBtn variant="flat" color="error" @click="deleting && remove(deleting.id); deleting = null">Hapus kategori</VBtn></VCardActions></VCard></VDialog>
</template>
