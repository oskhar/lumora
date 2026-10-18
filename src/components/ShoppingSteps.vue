<script setup lang="ts">
defineProps<{ step: number }>()
const steps = [{ title: 'Keranjang', to: '/shop/cart' }, { title: 'Checkout', to: '/shop/checkout' }, { title: 'Pesanan dibuat', to: '' }]
</script>
<template>
  <nav aria-label="Tahap belanja" class="shopping-steps mb-5"><ol><li v-for="(item, index) in steps" :key="item.title" :aria-current="step === index + 1 ? 'step' : undefined" :class="{ current: step === index + 1 }"><span class="step-number">{{ index + 1 }}</span><RouterLink v-if="index + 1 < step && step !== 3" :to="item.to">{{ item.title }}</RouterLink><span v-else>{{ item.title }}</span><VIcon v-if="index < 2" icon="ri-arrow-right-s-line" size="16" class="step-arrow" /></li></ol></nav>
</template>
<style scoped>
ol { display: flex; flex-wrap: wrap; gap: 14px; padding: 0; list-style: none; }
li { display: flex; align-items: center; gap: 8px; font-size: 13px; color: rgba(var(--v-theme-on-surface), .65); }
li.current { color: rgb(var(--v-theme-primary)); font-weight: 600; }
.step-number { display: grid; place-items: center; border-radius: 50%; inline-size: 26px; block-size: 26px; background: rgba(var(--v-theme-on-surface), .06); }
.current .step-number { background: rgb(var(--v-theme-primary)); color: rgb(var(--v-theme-on-primary)); }
@media(max-width: 599px) { ol { gap: 8px; } li { font-size: 11px; gap: 5px; } }
</style>
