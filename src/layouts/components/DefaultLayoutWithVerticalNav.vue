<script lang="ts" setup>
import NavItems from '@/layouts/components/NavItems.vue'
import logo from '@images/logo.svg?raw'
import VerticalNavLayout from '@layouts/components/VerticalNavLayout.vue'
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import { pageOptions } from '@/navigation'

const router = useRouter()
const selectedPage = ref<string | null>(null)
const pages = pageOptions
function navigate(path: string | null) {
  if (path) {
    router.push(path)
    selectedPage.value = null
  }
}
</script>

<template>
  <VerticalNavLayout>
    <template #navbar="{ toggleVerticalOverlayNavActive, isNavCollapsed, toggleNavCollapsed }">
      <div class="d-flex h-100 align-center gap-2">
        <IconBtn class="ms-n3 d-lg-none" aria-label="Buka navigasi" @click="toggleVerticalOverlayNavActive(true)">
          <VIcon icon="ri-menu-line" />
        </IconBtn>
        <IconBtn
          class="d-none d-lg-inline-flex"
          :aria-label="isNavCollapsed ? 'Lebarkan sidebar' : 'Ringkas sidebar'"
          :aria-expanded="!isNavCollapsed"
          aria-controls="lumora-sidebar"
          :title="isNavCollapsed ? 'Lebarkan sidebar' : 'Ringkas sidebar'"
          @click="toggleNavCollapsed"
        >
          <VIcon :icon="isNavCollapsed ? 'ri-menu-unfold-line' : 'ri-menu-fold-line'" />
        </IconBtn>
        <VAutocomplete
          v-model="selectedPage"
          :items="pages"
          aria-label="Cari halaman"
          :placeholder="$vuetify.display.smAndDown ? 'Cari…' : 'Cari halaman…'"
          prepend-inner-icon="ri-search-line"
          variant="plain"
          hide-details
          clearable
          class="page-search"
          @update:model-value="navigate"
        />
        <VSpacer />
        <NavbarThemeSwitcher class="me-2" />
        <UserProfile />
      </div>
    </template>
    <template #vertical-nav-header="{ toggleIsOverlayNavActive }">
      <RouterLink to="/" class="app-logo app-title-wrapper" aria-label="Lumora home">
        <div class="d-flex" v-html="logo" />
        <h1 class="font-weight-medium leading-normal text-xl text-uppercase">Lumora</h1>
      </RouterLink>
      <IconBtn class="d-block d-lg-none" aria-label="Tutup navigasi" @click="toggleIsOverlayNavActive(false)">
        <VIcon icon="ri-close-line" />
      </IconBtn>
    </template>
    <template #vertical-nav-content><NavItems /></template>
    <slot />
    <template #footer><Footer /></template>
  </VerticalNavLayout>
</template>

<style lang="scss" scoped>
.app-logo {
  display: flex;
  align-items: center;
  column-gap: 0.75rem;
}
.page-search {
  min-inline-size: 120px;
  max-inline-size: 380px;
}
</style>
