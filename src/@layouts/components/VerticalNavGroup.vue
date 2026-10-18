<script lang="ts" setup>
import type { Ref } from 'vue'
import type { NavGroup } from '@layouts/types'
const props = defineProps<{ item: NavGroup }>()
const route = useRoute()
const collapsed = inject<Ref<boolean>>('lumora-nav-collapsed', ref(false))
const active = computed(() => props.item.children.some(link => 'to' in link && typeof link.to === 'string' && (route.path === link.to || route.path.startsWith(link.to + '/'))))
const isOpen = ref(false)
watch(() => route.path, () => { isOpen.value = active.value }, { immediate: true })
</script>
<template>
  <li class="nav-group" :class="{ open: isOpen && !collapsed, active }">
    <button type="button" class="nav-group-label" :aria-label="item.title" :title="item.title" :aria-expanded="!collapsed && isOpen" @click="!collapsed && (isOpen = !isOpen)">
      <VIcon :icon="item.icon || 'ri-checkbox-blank-circle-line'" class="nav-item-icon" />
      <span class="nav-item-title">{{ item.title }}</span>
      <VIcon icon="ri-arrow-right-s-line" class="nav-group-arrow" />
      <VMenu v-if="collapsed" activator="parent" location="end">
        <VList :aria-label="item.title">
          <VListSubheader>{{ item.title }}</VListSubheader>
          <template v-for="(link, index) in item.children" :key="index">
            <VListItem v-if="'to' in link" :to="link.to || undefined" :title="link.title" :prepend-icon="link.icon" />
          </template>
        </VList>
      </VMenu>
    </button>
    <div v-if="!collapsed" class="nav-group-children-wrapper"><ul class="nav-group-children"><slot /></ul></div>
  </li>
</template>
<style lang="scss">
.layout-vertical-nav .nav-group {
  &-label { display: flex; align-items: center; cursor: pointer; text-align: start; color: inherit; inline-size: calc(100% - 1rem); }
  .nav-group-children-wrapper { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .2s ease; }
  .nav-group-children { overflow: hidden; visibility: hidden; }
  &.open {
    .nav-group-children-wrapper { grid-template-rows: 1fr; }
    .nav-group-children { visibility: visible; }
  }
}
.layout-vertical-nav .nav-group-label:focus-visible { outline: 2px solid rgb(var(--v-theme-primary)); outline-offset: -2px; }
</style>
