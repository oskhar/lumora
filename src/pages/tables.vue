<script setup lang="ts">
import AnalyticsUserTable from '@/views/dashboard/AnalyticsUserTable.vue'
</script>

<template>
  <div class="page-heading">
    <div>
      <p class="text-overline text-primary mb-1">LUMORA / TABLES</p>
      <h2 class="text-h4 mb-2">User directory</h2>
      <p class="text-body-1 text-medium-emphasis mb-0">Find people, refine your view, and explore your team.</p>
    </div>
    <VChip variant="tonal" color="secondary" prepend-icon="ri-database-2-line">Demo data</VChip>
  </div>
  <AnalyticsUserTable />
</template>
