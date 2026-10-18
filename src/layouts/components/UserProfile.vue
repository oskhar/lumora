<script setup lang="ts">
import avatar from '@images/avatars/avatar-1.png'
import { useProfileStore } from '@/stores/profile'
const profile = useProfileStore()
const route = useRoute()
</script>
<template>
  <IconBtn aria-label="Buka menu akun" title="Menu akun">
    <VAvatar :image="profile.profile.avatar || avatar" size="36" />
    <VMenu activator="parent" width="270" location="bottom end">
      <VList>
        <VListItem :title="profile.profile.name" subtitle="Profil lokal · akun demo" />
        <VDivider class="my-2" />
        <VListItem to="/account-settings" prepend-icon="ri-user-settings-line" title="Pengaturan akun" subtitle="Profil dan preferensi" />
        <VListItem to="/learn/my-courses" prepend-icon="ri-book-open-line" title="Kursus saya" />
        <VListItem :to="route.meta.customer ? '/dashboard' : '/shop/products'" prepend-icon="ri-layout-left-line" :title="route.meta.customer ? 'Buka mode admin' : 'Buka mode pelanggan'" />
        <VDivider class="my-2" />
        <VListItem to="/login" prepend-icon="ri-login-box-line" title="Contoh halaman masuk" subtitle="Preview form autentikasi" />
      </VList>
    </VMenu>
  </IconBtn>
</template>
