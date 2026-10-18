<script setup lang="ts">
const props = defineProps<{ title: string; description?: string; eyebrow?: string; back?: string; backLabel?: string }>()
const backText = computed(() => props.backLabel || ({ '/products': 'Daftar produk', '/shop/products': 'Katalog produk', '/shop/cart': 'Keranjang', '/orders': 'Daftar pesanan', '/customers': 'Daftar pelanggan', '/learn/courses': 'Katalog kursus' } as Record<string, string>)[props.back || ''] || 'Halaman sebelumnya')
</script>
<template>
  <div class="page-heading">
    <div>
      <RouterLink v-if="back" :to="back" class="text-body-2 d-inline-flex align-center mb-3"><VIcon icon="ri-arrow-left-line" size="16" class="me-1" />{{ backText }}</RouterLink>
      <p class="text-overline text-primary mb-1">LUMORA / {{ eyebrow || 'WORKSPACE' }}</p>
      <h2 class="text-h4 mb-2">{{ title }}</h2>
      <p v-if="description" class="text-body-1 text-medium-emphasis mb-0">{{ description }}</p>
    </div>
    <div class="d-flex align-center flex-wrap gap-2"><slot /></div>
  </div>
</template>
