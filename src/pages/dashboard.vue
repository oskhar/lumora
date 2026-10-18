<script setup lang="ts">
import AnalyticsCongratulations from '@/views/sneat/AnalyticsCongratulations.vue'
import AnalyticsFinanceTabs from '@/views/sneat/AnalyticsFinanceTab.vue'
import AnalyticsOrderStatistics from '@/views/sneat/AnalyticsOrderStatistics.vue'
import AnalyticsProfitReport from '@/views/sneat/AnalyticsProfitReport.vue'
import AnalyticsTotalRevenue from '@/views/sneat/AnalyticsTotalRevenue.vue'
import AnalyticsTransactions from '@/views/sneat/AnalyticsTransactions.vue'
import SneatStatisticsCard from '@/components/SneatStatisticsCard.vue'

// 👉 Images
import chart from '@images/cards/chart-success.png'
import card from '@images/cards/credit-card-primary.png'
import paypal from '@images/cards/paypal-error.png'
import wallet from '@images/cards/wallet-info.png'
</script>

<template>
  <div class="page-heading">
    <div>
      <p class="text-overline text-primary mb-1">LUMORA / OVERVIEW</p>
      <h2 class="text-h4 mb-2">Ringkasan bisnis</h2>
      <p class="text-body-1 text-medium-emphasis mb-0">Contoh grafik bisnis. Kelola data toko melalui menu Kelola toko.</p>
    </div>
    <VBtn to="/analytics" prepend-icon="ri-bar-chart-grouped-line" variant="tonal">Lihat analitik</VBtn>
  </div>
  <div class="d-flex gap-2 flex-wrap mb-5"><VBtn to="/products" variant="tonal" prepend-icon="ri-shopping-bag-line">Kelola produk</VBtn><VBtn to="/orders" variant="tonal" prepend-icon="ri-file-list-3-line">Lihat pesanan</VBtn><VChip variant="outlined" color="secondary">Grafik berisi data ilustrasi</VChip></div>
  <VRow>
    <!-- 👉 Congratulations -->
    <VCol
      cols="12"
      md="8"
    >
      <AnalyticsCongratulations />
    </VCol>

    <VCol
      cols="12"
      sm="4"
    >
      <VRow>
        <!-- 👉 Profit -->
        <VCol
          cols="12"
          md="6"
        >
          <SneatStatisticsCard
            v-bind="{
              title: 'Profit',
              image: chart,
              stats: '$12,628',
              change: 72.80,
            }"
          />
        </VCol>

        <!-- 👉 Sales -->
        <VCol
          cols="12"
          md="6"
        >
          <SneatStatisticsCard
            v-bind="{
              title: 'Sales',
              image: wallet,
              stats: '$4,679',
              change: 28.42,
            }"
          />
        </VCol>
      </VRow>
    </VCol>

    <!-- 👉 Total Revenue -->
    <VCol
      cols="12"
      md="8"
      order="2"
      order-md="1"
    >
      <AnalyticsTotalRevenue />
    </VCol>

    <VCol
      cols="12"
      sm="8"
      md="4"
      order="1"
      order-md="2"
    >
      <VRow>
        <!-- 👉 Payments -->
        <VCol
          cols="12"
          sm="6"
        >
          <SneatStatisticsCard
            v-bind=" {
              title: 'Payments',
              image: paypal,
              stats: '$2,468',
              change: -14.82,
            }"
          />
        </VCol>

        <!-- 👉 Revenue -->
        <VCol
          cols="12"
          sm="6"
        >
          <SneatStatisticsCard
            v-bind="{
              title: 'Transactions',
              image: card,
              stats: '$14,857',
              change: 28.14,
            }"
          />
        </VCol>
      </VRow>

      <VRow>
        <!-- 👉 Profit Report -->
        <VCol
          cols="12"
          sm="12"
        >
          <AnalyticsProfitReport />
        </VCol>
      </VRow>
    </VCol>

    <!-- 👉 Order Statistics -->
    <VCol
      cols="12"
      md="4"
      sm="6"
      order="3"
    >
      <AnalyticsOrderStatistics />
    </VCol>

    <!-- 👉 Tabs chart -->
    <VCol
      cols="12"
      md="4"
      sm="6"
      order="3"
    >
      <AnalyticsFinanceTabs />
    </VCol>

    <!-- 👉 Transactions -->
    <VCol
      cols="12"
      md="4"
      sm="6"
      order="3"
    >
      <AnalyticsTransactions />
    </VCol>
  </VRow>
</template>
