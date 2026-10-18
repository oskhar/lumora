<script lang="ts" setup>
import VerticalNavSectionTitle from '@layouts/components/VerticalNavSectionTitle.vue'
import VerticalNavLink from '@layouts/components/VerticalNavLink.vue'
import VerticalNavGroup from '@layouts/components/VerticalNavGroup.vue'
import { adminMenu, customerMenu } from '@/navigation'
const route = useRoute()
const customer = computed(() => !!route.meta.customer)
const groups = computed(() => customer.value ? customerMenu : adminMenu)
</script>
<template>
  <li class="workspace-picker px-3 py-3">
    <VBtn block variant="tonal" class="justify-start" aria-label="Ganti mode tampilan" prepend-icon="ri-layout-left-line">
      <span class="nav-item-title">{{ customer ? 'Mode pelanggan' : 'Mode admin' }}</span>
      <VMenu activator="parent" location="bottom start">
        <VList aria-label="Pilih mode tampilan">
          <VListItem to="/dashboard" prepend-icon="ri-dashboard-line" title="Mode admin" subtitle="Kelola produk, pesanan, dan toko" />
          <VListItem to="/shop/products" prepend-icon="ri-store-2-line" title="Mode pelanggan" subtitle="Belanja, belajar, dan booking" />
        </VList>
      </VMenu>
    </VBtn>
  </li>
  <VerticalNavSectionTitle :item="{ heading: customer ? 'Menu pelanggan' : 'Menu admin' }" />
  <VerticalNavGroup v-for="group in groups" :key="group.title" :item="group">
    <VerticalNavLink v-for="link in group.children" :key="link.to" :item="link" />
  </VerticalNavGroup>
  <VerticalNavSectionTitle :item="{ heading: 'Akun' }" />
  <VerticalNavLink :item="{ title: 'Pengaturan akun', icon: 'ri-user-settings-line', to: '/account-settings' }" />
  <VerticalNavLink :item="{ title: customer ? 'Mode admin' : 'Buka tampilan pelanggan', icon: customer ? 'ri-dashboard-line' : 'ri-external-link-line', to: customer ? '/dashboard' : '/shop/products' }" />
</template>
