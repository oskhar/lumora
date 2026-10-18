<script setup lang="ts" generic="T extends { id: number }">
import type { Slots, ComputedRef } from 'vue'
const props = defineProps<{
  items: T[]
  headers: { title: string; key: string; sortable?: boolean }[]
  filters?: { key: string; label: string; options: (string | { title: string; value: string })[] }[]
  title?: string
  searchLabel?: string
}>()
const search = ref('')
const page = ref(1)
const pageSize = ref(5)
const open = ref(false)
const applied = ref<Record<string, string | null>>({})
const draft = ref<Record<string, string | null>>({})
const count = computed(() => Object.values(applied.value).filter(Boolean).length)
const filtered = computed(() => props.items.filter(item => {
  const values = item as Record<string, unknown>
  return (!search.value?.trim() || Object.values(values).some(value => typeof value !== 'object' && String(value).toLowerCase().includes(search.value.trim().toLowerCase())))
    && Object.entries(applied.value).every(([key, value]) => !value || String(values[key]) === value)
}))
watch([search, applied], () => { page.value = 1 }, { deep: true })
const slots: Slots = useSlots()
const cellSlots: ComputedRef<string[]> = computed(() => Object.keys(slots).filter(name => name.startsWith('item.')))
function showFilters() { draft.value = { ...applied.value }; open.value = true }
function apply() { applied.value = { ...draft.value }; open.value = false }
function filterText(filter: NonNullable<typeof props.filters>[number]) {
  const option = filter.options.find(option => typeof option === 'string' ? option === applied.value[filter.key] : option.value === applied.value[filter.key])
  return typeof option === 'string' ? option : option?.title ?? applied.value[filter.key]
}
</script>
<template>
  <VCard>
    <VCardItem v-if="title" :title="title" />
    <VCardText class="d-flex align-center flex-wrap gap-3">
      <VTextField v-model="search" :label="searchLabel || 'Cari data dalam tabel'" placeholder="Ketik kata kunci…" prepend-inner-icon="ri-search-line" clearable class="explorer-search" />
      <VBtn v-if="filters?.length" variant="outlined" prepend-icon="ri-filter-3-line" @click="showFilters">Filter <span v-if="count" class="ms-2">({{ count }} aktif)</span></VBtn>
      <VBtn v-if="count || search" variant="text" color="secondary" @click="search = ''; applied = {}">Hapus pencarian & filter</VBtn>
      <slot name="toolbar" />
    </VCardText>
    <div class="px-5 pb-4 d-flex align-center flex-wrap gap-2">
      <span class="text-body-2 text-medium-emphasis" role="status" aria-live="polite">Menampilkan {{ filtered.length }} dari {{ items.length }} data</span>
      <template v-for="filter in filters" :key="filter.key"><VChip v-if="applied[filter.key]" size="small" closable color="primary" :aria-label="'Hapus filter ' + filter.label" @click:close="applied[filter.key] = null">{{ filter.label }}: {{ filterText(filter) }}</VChip></template>
    </div>
    <VDataTable v-model:page="page" v-model:items-per-page="pageSize" :headers="headers" :items="filtered" :items-per-page-options="[5, 10, 25]" items-per-page-text="Baris per halaman" page-text="{0}–{1} dari {2}" item-value="id" class="explorer-table">
      <template v-for="name in cellSlots" #[name]="scope"><slot :name="name" v-bind="scope || {}" /></template>
      <template #no-data><div class="pa-8 text-center"><VIcon icon="ri-search-line" size="32" class="mb-2" /><h3 class="text-h6 mb-2">Tidak ada data yang sesuai</h3><p class="mb-4">Coba kata kunci lain atau hapus filter yang sedang aktif.</p><VBtn variant="tonal" @click="search = ''; applied = {}">Tampilkan semua data</VBtn></div></template>
    </VDataTable>
    <VDialog v-model="open" max-width="460" aria-label="Atur filter tabel">
      <VCard tag="form" title="Atur filter" subtitle="Pilih kriteria, lalu tekan Terapkan filter. Pencarian Anda tetap dipertahankan." @submit.prevent="apply">
        <VCardText class="d-flex flex-column gap-5 pt-4"><VSelect v-for="filter in filters" :key="filter.key" v-model="draft[filter.key]" :items="filter.options" :label="filter.label" clearable /></VCardText>
        <VCardActions class="pa-4 flex-wrap gap-2"><VBtn color="secondary" @click="draft = {}">Kosongkan pilihan</VBtn><VSpacer /><VBtn color="secondary" @click="open = false">Batal</VBtn><VBtn type="submit" variant="flat">Terapkan filter</VBtn></VCardActions>
      </VCard>
    </VDialog>
  </VCard>
</template>
<style scoped>
.explorer-search { flex: 1 1 220px; }
.explorer-table :deep(th) { background: rgb(var(--v-theme-background)); font-size: 12px; text-transform: uppercase; white-space: nowrap; }
.explorer-table :deep(td) { white-space: nowrap; }
.explorer-table :deep(.v-data-table-footer) { flex-wrap: wrap; gap: 8px; }
</style>
