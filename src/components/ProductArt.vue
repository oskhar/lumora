<script setup lang="ts">
const props = withDefaults(defineProps<{ icon?: string; large?: boolean; image?: string; alt?: string }>(), { icon: 'ri-shopping-bag-line' })
const failed = ref(false)
watch(() => props.image, () => { failed.value = false })
</script>
<template>
  <div class="product-art" :class="{ 'product-art-large': large }">
    <img v-if="image && !failed" :src="image" :alt="alt || 'Foto koleksi Lumora'" loading="lazy" decoding="async" class="product-photo" @error="failed = true">
    <template v-else><span class="art-orbit" aria-hidden="true" /><VIcon :icon="icon" :size="large ? 100 : 66" aria-hidden="true" /><span class="art-label">LUMORA COLLECTION</span></template>
  </div>
</template>
<style scoped>
.product-art { position: relative; display: flex; align-items: center; justify-content: center; overflow: hidden; min-block-size: 200px; background: linear-gradient(135deg, rgba(var(--v-theme-primary), .06), rgba(var(--v-theme-primary), .15)); color: rgb(var(--v-theme-primary)); }
.product-art-large { min-block-size: 340px; border-radius: 12px; }
.product-photo { position: absolute; inset: 0; inline-size: 100%; block-size: 100%; object-fit: cover; }
.art-orbit { position: absolute; border: 1px solid rgba(var(--v-theme-primary), .12); border-radius: 50%; inline-size: 180px; block-size: 180px; transform: translate(30%, -20%); }
.art-label { position: absolute; inset-block-end: 18px; font-size: 9px; letter-spacing: .24em; opacity: .65; }
</style>
