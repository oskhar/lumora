<script setup lang="ts">
import { useDemoStore, orderTotal, money } from '@/stores/demo'
const store = useDemoStore()
const rows = computed(() => store.data.customers.map(customer => {
  const orders = store.data.orders.filter(order => order.customerId === customer.id && order.status !== 'Cancelled')
  return { ...customer, orders: orders.length, spent: orders.filter(order => order.paymentStatus === 'Paid').reduce((sum, order) => sum + orderTotal(order), 0) }
}))
</script>
<template>
  <PageHeader title="Pelanggan" eyebrow="COMMERCE" description="Cari pelanggan untuk melihat profil, pesanan, dan total belanjanya." />
  <ExplorerTable search-label="Cari nama, email, atau kota pelanggan" :items="rows" :headers="[{ title: 'Pelanggan', key: 'name' }, { title: 'Email', key: 'email' }, { title: 'Kota', key: 'city' }, { title: 'Pesanan', key: 'orders' }, { title: 'Total dibayar', key: 'spent' }, { title: 'Bergabung', key: 'joined' }]" :filters="[{ key: 'city', label: 'Kota', options: [...new Set(store.data.customers.map(c => c.city))] }]">
    <template #item.name="{ item }"><RouterLink :to="`/customers/${item.id}`" class="d-flex align-center gap-3 py-3"><VAvatar color="primary" variant="tonal" size="34">{{ item.name.split(' ').map((p: string) => p[0]).slice(0, 2).join('') }}</VAvatar>{{ item.name }}</RouterLink></template>
    <template #item.spent="{ item }">{{ money(item.spent) }}</template>
  </ExplorerTable>
</template>
