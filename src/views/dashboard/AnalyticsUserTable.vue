<script setup lang="ts">
import avatar1 from '@images/avatars/avatar-1.png'
import avatar2 from '@images/avatars/avatar-2.png'
import avatar3 from '@images/avatars/avatar-3.png'
import avatar4 from '@images/avatars/avatar-4.png'
import avatar5 from '@images/avatars/avatar-5.png'
import avatar6 from '@images/avatars/avatar-6.png'
import avatar7 from '@images/avatars/avatar-7.png'
import avatar8 from '@images/avatars/avatar-8.png'

const headers = [
  { title: 'Pengguna', key: 'fullName' },
  { title: 'Email', key: 'email' },
  { title: 'Peran', key: 'role' },
  { title: 'Paket', key: 'currentPlan' },
  { title: 'Status', key: 'status' },
]

const userData = [
  {
    id: 1,
    fullName: 'Galasasen Slixby',
    company: 'Yotz PVT LTD',
    role: 'editor',
    username: 'gslixby0',
    country: 'El Salvador',
    contact: '(479) 232-9151',
    email: 'gslixby0@abc.net.au',
    currentPlan: 'enterprise',
    status: 'inactive',
    avatar: avatar1,
  },
  {
    id: 2,
    fullName: 'Halsey Redmore',
    company: 'Skinder PVT LTD',
    role: 'author',
    username: 'hredmore1',
    country: 'Albania',
    contact: '(472) 607-9137',
    email: 'hredmore1@imgur.com',
    currentPlan: 'team',
    status: 'pending',
    avatar: avatar2,
  },
  {
    id: 3,
    fullName: 'Marjory Sicely',
    company: 'Oozz PVT LTD',
    role: 'maintainer',
    username: 'msicely2',
    country: 'Russia',
    contact: '(321) 264-4599',
    email: 'msicely2@who.int',
    currentPlan: 'enterprise',
    status: 'active',
    avatar: avatar3,
  },
  {
    id: 4,
    fullName: 'Cyrill Risby',
    company: 'Oozz PVT LTD',
    role: 'Admin',
    username: 'crisby3',
    country: 'China',
    contact: '(923) 690-6806',
    email: 'crisby3@wordpress.com',
    currentPlan: 'team',
    status: 'inactive',
    avatar: avatar4,
  },
  {
    id: 5,
    fullName: 'Maggy Hurran',
    company: 'Aimbo PVT LTD',
    role: 'subscriber',
    username: 'mhurran4',
    country: 'Pakistan',
    contact: '(669) 914-1078',
    email: 'mhurran4@yahoo.co.jp',
    currentPlan: 'enterprise',
    status: 'pending',
    avatar: avatar5,
  },
  {
    id: 6,
    fullName: 'Silvain Halstead',
    company: 'Jaxbean PVT LTD',
    role: 'author',
    username: 'shalstead5',
    country: 'China',
    contact: '(958) 973-3093',
    email: 'shalstead5@shinystat.com',
    currentPlan: 'company',
    status: 'active',
    avatar: avatar6,
  },
  {
    id: 7,
    fullName: 'Breena Gallemore',
    company: 'Jazzy PVT LTD',
    role: 'subscriber',
    username: 'bgallemore6',
    country: 'Canada',
    contact: '(825) 977-8152',
    email: 'bgallemore6@boston.com',
    currentPlan: 'company',
    status: 'pending',
    avatar: avatar7,
  },
  {
    id: 8,
    fullName: 'Kathryne Liger',
    company: 'Pixoboo PVT LTD',
    role: 'author',
    username: 'kliger7',
    country: 'France',
    contact: '(187) 440-0934',
    email: 'kliger7@vinaora.com',
    currentPlan: 'enterprise',
    status: 'pending',
    avatar: avatar8,
  },
  { id: 9, fullName: 'Aditya Pranata', username: 'aditya.pranata', company: 'Lumina Studio', role: 'admin', country: 'Indonesia', email: 'aditya.pranata@example.com', currentPlan: 'team', status: 'active', avatar: avatar1 },
  { id: 10, fullName: 'Nadia Putri', username: 'nadia.putri', company: 'Northstar Labs', role: 'editor', country: 'Indonesia', email: 'nadia.putri@example.com', currentPlan: 'enterprise', status: 'active', avatar: avatar2 },
  { id: 11, fullName: 'Daniel Hayes', username: 'daniel.hayes', company: 'Harbor Digital', role: 'maintainer', country: 'Australia', email: 'daniel.hayes@example.com', currentPlan: 'company', status: 'pending', avatar: avatar3 },
  { id: 12, fullName: 'Sofia Laurent', username: 'sofia.laurent', company: 'Atelier Labs', role: 'author', country: 'France', email: 'sofia.laurent@example.com', currentPlan: 'team', status: 'inactive', avatar: avatar4 },
  { id: 13, fullName: 'Raka Wijaya', username: 'raka.wijaya', company: 'Orbit Studio', role: 'subscriber', country: 'Indonesia', email: 'raka.wijaya@example.com', currentPlan: 'team', status: 'active', avatar: avatar5 },
  { id: 14, fullName: 'Amelia Chen', username: 'amelia.chen', company: 'Forma Design', role: 'editor', country: 'Singapore', email: 'amelia.chen@example.com', currentPlan: 'company', status: 'pending', avatar: avatar6 },
  { id: 15, fullName: 'Oliver Grant', username: 'oliver.grant', company: 'Northstar Labs', role: 'maintainer', country: 'United Kingdom', email: 'oliver.grant@example.com', currentPlan: 'enterprise', status: 'active', avatar: avatar7 },
  { id: 16, fullName: 'Maya Santoso', username: 'maya.santoso', company: 'Lumina Studio', role: 'author', country: 'Indonesia', email: 'maya.santoso@example.com', currentPlan: 'company', status: 'inactive', avatar: avatar8 },
]

const search = ref('')
const roleFilter = ref<string | null>(null)
const statusFilter = ref<string | null>(null)
const filtersOpen = ref(false)
const draftRole = ref<string | null>(null)
const draftStatus = ref<string | null>(null)
const activeFilterCount = computed(() => Number(!!roleFilter.value) + Number(!!statusFilter.value))
const page = ref(1)
const itemsPerPage = ref(5)
const sortBy = ref<{ key: string; order: 'asc' | 'desc' }[]>([{ key: 'fullName', order: 'asc' }])

const roles = [...new Set(userData.map(user => user.role.toLowerCase()))]
  .sort().map(value => ({ title: value.charAt(0).toUpperCase() + value.slice(1), value }))
const statuses = [
  { title: 'Active', value: 'active' },
  { title: 'Pending', value: 'pending' },
  { title: 'Inactive', value: 'inactive' },
]
const hasFilters = computed(() => !!(search.value?.trim() || roleFilter.value || statusFilter.value))
const filteredUsers = computed(() => {
  const query = (search.value ?? '').trim().toLowerCase()
  return userData.filter(user =>
    (!roleFilter.value || user.role.toLowerCase() === roleFilter.value)
    && (!statusFilter.value || user.status === statusFilter.value)
    && (!query || [user.fullName, user.username, user.email, user.company, user.country, user.role, user.currentPlan]
      .some(value => value.toLowerCase().includes(query))),
  )
})
const pageCount = computed(() => Math.max(1, Math.ceil(filteredUsers.value.length / itemsPerPage.value)))
const rangeStart = computed(() => filteredUsers.value.length ? (page.value - 1) * itemsPerPage.value + 1 : 0)
const rangeEnd = computed(() => Math.min(page.value * itemsPerPage.value, filteredUsers.value.length))
watch([search, roleFilter, statusFilter, itemsPerPage], () => { page.value = 1 })

function resetFilters() {
  search.value = ''
  roleFilter.value = null
  statusFilter.value = null
}
function openFilters() {
  draftRole.value = roleFilter.value
  draftStatus.value = statusFilter.value
  filtersOpen.value = true
}
function applyFilters() {
  roleFilter.value = draftRole.value
  statusFilter.value = draftStatus.value
  filtersOpen.value = false
}
function statusColor(status: string) {
  return ({ active: 'primary', pending: 'warning', inactive: 'secondary' })[status] ?? 'secondary'
}
</script>

<template>
  <VCard class="directory-card">
    <VCardItem class="pb-2">
      <template #title>
        <div class="d-flex align-center gap-3 flex-wrap">
          <span>Daftar pengguna</span>
          <VChip color="primary" size="small" variant="tonal">{{ userData.length }} users</VChip>
        </div>
      </template>
      <template #subtitle>Pencarian dan filter berlaku untuk semua data, termasuk halaman lain.</template>
    </VCardItem>

    <VCardText class="pb-4">
      <div class="directory-toolbar">
        <VTextField
          v-model="search"
          label="Cari pengguna"
          placeholder="Nama, email, atau perusahaan…"
          prepend-inner-icon="ri-search-line"
          clearable
          data-testid="user-search"
        />
        <VBtn variant="outlined" color="primary" prepend-icon="ri-filter-3-line" data-testid="open-filters" aria-haspopup="dialog" @click="openFilters">
          Filter
          <VChip v-if="activeFilterCount" size="x-small" color="primary" class="ms-2" :aria-label="`${activeFilterCount} active filters`">{{ activeFilterCount }}</VChip>
        </VBtn>
        <VBtn variant="text" color="secondary" :disabled="!hasFilters" prepend-icon="ri-restart-line" @click="resetFilters">
          Reset
        </VBtn>
      </div>
    </VCardText>

    <p class="d-sm-none text-caption px-5 mb-3">
      <VIcon icon="ri-drag-move-2-line" size="16" class="me-1" />
      Swipe the table to see more columns.
    </p>

    <VDataTable
      v-model:page="page"
      v-model:items-per-page="itemsPerPage"
      :headers="headers"
      :items="filteredUsers"
      v-model:sort-by="sortBy"
      item-value="id"
      class="directory-table"
      aria-label="Team member directory"
    >
      <template #item.fullName="{ item }">
        <div class="d-flex align-center gap-3 py-3">
          <VAvatar :image="item.avatar" :alt="item.fullName" size="38" />
          <div>
            <div class="text-body-1 font-weight-medium">{{ item.fullName }}</div>
            <span class="text-caption">@{{ item.username }}</span>
          </div>
        </div>
      </template>
      <template #item.email="{ item }">
        <a :href="'mailto:' + item.email" class="directory-email">{{ item.email }}</a>
      </template>
      <template #item.role="{ item }">
        <span class="text-capitalize">{{ item.role }}</span>
      </template>
      <template #item.currentPlan="{ item }">
        <span class="text-capitalize">{{ item.currentPlan }}</span>
      </template>
      <template #item.status="{ item }">
        <VChip :color="statusColor(item.status)" variant="tonal" size="small" class="text-capitalize">
          <VIcon start size="14" :icon="item.status === 'active' ? 'ri-checkbox-circle-line' : item.status === 'pending' ? 'ri-time-line' : 'ri-pause-circle-line'" />
          {{ item.status }}
        </VChip>
      </template>
      <template #no-data>
        <div class="py-10 text-center" role="status">
          <VIcon icon="ri-search-line" size="36" color="secondary" class="mb-3" />
          <h3 class="text-h6 mb-2">Pengguna tidak ditemukan</h3>
          <p class="text-body-2 text-medium-emphasis mb-4">Coba kata kunci lain atau ubah filter.</p>
          <VBtn v-if="hasFilters" variant="tonal" @click="resetFilters">Hapus pencarian & filter</VBtn>
        </div>
      </template>
      <template #bottom>
        <div class="directory-footer">
          <div class="d-flex align-center gap-3 flex-wrap">
            <span class="text-body-2 text-medium-emphasis">Baris per halaman</span>
            <VSelect v-model="itemsPerPage" :items="[5, 10, 25]" aria-label="Baris per halaman" class="page-size-select" />
            <span class="text-body-2 text-medium-emphasis" role="status" aria-live="polite" data-testid="result-range">
              {{ rangeStart }}–{{ rangeEnd }} of {{ filteredUsers.length }}
            </span>
          </div>
          <VPagination v-model="page" :length="pageCount" :total-visible="3" :disabled="!filteredUsers.length" size="small" aria-label="User directory pages" />
        </div>
      </template>
    </VDataTable>

    <VDialog v-model="filtersOpen" max-width="480" aria-labelledby="user-filter-title">
      <VCard tag="form" @submit.prevent="applyFilters">
        <VCardItem>
          <VCardTitle id="user-filter-title">Filter pengguna</VCardTitle>
          <VCardSubtitle>Pilih kriteria, lalu terapkan untuk memperbarui tabel.</VCardSubtitle>
          <template #append>
            <IconBtn aria-label="Tutup filter" @click="filtersOpen = false"><VIcon icon="ri-close-line" /></IconBtn>
          </template>
        </VCardItem>
        <VCardText class="d-flex flex-column gap-5 pt-4">
          <VSelect v-model="draftRole" :items="roles" label="Peran" placeholder="Semua peran" clearable data-testid="role-filter" />
          <VSelect v-model="draftStatus" :items="statuses" label="Status" placeholder="Semua status" clearable data-testid="status-filter" />
        </VCardText>
        <VCardActions class="px-5 pb-5 flex-wrap gap-2">
          <VBtn variant="text" color="secondary" @click="draftRole = null; draftStatus = null">Reset filter</VBtn>
          <VSpacer />
          <VBtn variant="text" color="secondary" @click="filtersOpen = false">Batal</VBtn>
          <VBtn type="submit" variant="flat" data-testid="apply-filters">Terapkan</VBtn>
        </VCardActions>
      </VCard>
    </VDialog>
  </VCard>
</template>

<style lang="scss" scoped>
.directory-card :deep(.v-card-subtitle) {
  white-space: normal;
}

.directory-toolbar {
  display: grid;
  grid-template-columns: minmax(220px, 1fr) auto auto;
  gap: 16px;
  align-items: center;
  margin-block-start: 16px;
}
.directory-table :deep(th) {
  background: rgb(var(--v-theme-background));
  font-size: 12px;
  font-weight: 600 !important;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
}
.directory-table :deep(td) {
  white-space: nowrap;
}
.directory-table :deep(tbody tr:hover) {
  background: rgba(var(--v-theme-primary), 0.035);
}
.directory-email {
  color: inherit;
  text-decoration: none;
}
.directory-email:hover,
.directory-email:focus-visible {
  color: rgb(var(--v-theme-primary));
  text-decoration: underline;
}
.directory-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-block-start: 1px solid rgba(var(--v-border-color), var(--v-border-opacity));
  padding: 16px 20px;
}
.page-size-select {
  flex: 0 0 78px;
}
@media (max-width: 959px) {
  .directory-toolbar {
    grid-template-columns: minmax(0, 1fr) auto auto;
  }
}
@media (max-width: 599px) {
  .directory-toolbar {
    grid-template-columns: 1fr auto;
  }
  .directory-toolbar > :first-child {
    grid-column: 1 / -1;
  }
  .directory-footer {
    justify-content: center;
  }
}
</style>
