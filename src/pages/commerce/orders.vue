<script setup lang="ts">
import { statusLabel, statusOptions } from "@/utils/ui"
import { useDemoStore, money, orderTotal, statusColor } from '@/stores/demo'
const store = useDemoStore()
const rows = computed(() => store.data.orders.map(order => ({ ...order, customer: store.data.customers.find(c => c.id === order.customerId)?.name ?? 'Pelanggan', total: orderTotal(order), date: order.createdAt.slice(0, 10) })))
</script>
<template>
  <PageHeader title="Pesanan" eyebrow="COMMERCE" description="Cari pesanan, periksa pembayarannya, dan perbarui status pengiriman." />
  <ExplorerTable search-label="Cari nomor pesanan atau nama pelanggan" :items="rows" :headers="[{ title: 'Pesanan', key: 'id' }, { title: 'Pelanggan', key: 'customer' }, { title: 'Tanggal', key: 'date' }, { title: 'Total', key: 'total' }, { title: 'Pembayaran', key: 'paymentStatus' }, { title: 'Status', key: 'status' }]" :filters="[{ key: 'status', label: 'Status pesanan', options: statusOptions(['Pending', 'Processing', 'Shipped', 'Completed', 'Cancelled']) }, { key: 'paymentStatus', label: 'Pembayaran', options: statusOptions(['Pending', 'Paid']) }]">
    <template #item.id="{ item }"><RouterLink :to="`/orders/${item.id}`" class="font-weight-medium">#LM-{{ item.id }}</RouterLink></template>
    <template #item.customer="{ item }"><RouterLink :to="`/customers/${item.customerId}`">{{ item.customer }}</RouterLink></template>
    <template #item.total="{ item }">{{ money(item.total) }}</template>
    <template #item.paymentStatus="{ item }"><VChip :color="statusColor(item.paymentStatus)" size="small">{{ statusLabel(item.paymentStatus) }}</VChip></template>
    <template #item.status="{ item }"><VChip :color="statusColor(item.status)" size="small">{{ statusLabel(item.status) }}</VChip></template>
  </ExplorerTable>
</template>
