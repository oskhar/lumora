<script setup lang="ts">
import AnalyticsWeeklyOverview from '@/views/dashboard/AnalyticsWeeklyOverview.vue'
import AnalyticsTotalEarning from '@/views/dashboard/AnalyticsTotalEarning.vue'
import AnalyticsTotalProfitLineCharts from '@/views/dashboard/AnalyticsTotalProfitLineCharts.vue'
import AnalyticsBarCharts from '@/views/dashboard/AnalyticsBarCharts.vue'
import AnalyticsSalesByCountries from '@/views/dashboard/AnalyticsSalesByCountries.vue'
import AnalyticsDepositWithdraw from '@/views/dashboard/AnalyticsDepositWithdraw.vue'
import AnalyticsUserTable from '@/views/dashboard/AnalyticsUserTable.vue'
import AnalyticsOrder from '@/views/sneat/AnalyticsOrder.vue'
import AnalyticsRevenue from '@/views/sneat/AnalyticsRevenue.vue'
import AnalyticsTransactions from '@/views/dashboard/AnalyticsTransactions.vue'
</script>

<template>
  <div class="page-heading">
    <div>
      <p class="text-overline text-primary mb-1">LUMORA / ANALYTICS</p>
      <h2 class="text-h4 mb-2">Analitik & grafik</h2>
      <p class="text-body-1 text-medium-emphasis mb-0">Contoh visualisasi tren dan pendapatan. Angka grafik merupakan data ilustrasi, bukan transaksi toko demo.</p>
    </div>
    <VChip color="primary" variant="tonal" prepend-icon="ri-pie-chart-line">Contoh grafik</VChip>
  </div>
  <VRow class="match-height">
    <VCol cols="12"><AnalyticsTransactions /></VCol>
    <VCol cols="12" md="4"><AnalyticsWeeklyOverview /></VCol>
    <VCol cols="12" md="4"><AnalyticsTotalEarning /></VCol>
    <VCol cols="12" md="4">
      <VRow>
        <VCol cols="12" sm="6"><AnalyticsTotalProfitLineCharts /></VCol>
        <VCol cols="12" sm="6"><AnalyticsBarCharts /></VCol>
        <VCol cols="12" sm="6"><AnalyticsOrder /></VCol>
        <VCol cols="12" sm="6"><AnalyticsRevenue /></VCol>
      </VRow>
    </VCol>
    <VCol cols="12" md="4"><AnalyticsSalesByCountries /></VCol>
    <VCol cols="12" md="8"><AnalyticsDepositWithdraw /></VCol>
    <VCol cols="12"><AnalyticsUserTable /></VCol>
  </VRow>
</template>
