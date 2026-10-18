<script setup lang="ts">
import { statusLabel } from "@/utils/ui"
import { useDemoStore, orderTotal, money, statusColor } from '@/stores/demo'
const store = useDemoStore(); const route = useRoute()
const customer = computed(() => store.data.customers.find(item => item.id === Number(route.params.id)))
const orders = computed(() => store.data.orders.filter(order => order.customerId === customer.value?.id))
const spent = computed(() => orders.value.filter(order => order.paymentStatus === 'Paid' && order.status !== 'Cancelled').reduce((sum, order) => sum + orderTotal(order), 0))
const notice = ref(''); const open = ref(false); const error = ref(''); const form = reactive({ name: '', email: '', phone: '', city: '' })
function edit() { if (customer.value) Object.assign(form, customer.value); error.value = ''; open.value = true }
function save() { if (!customer.value) return; if (store.data.customers.some(item => item.id !== customer.value?.id && item.email.toLowerCase() === form.email.toLowerCase())) { error.value = 'Email ini sudah digunakan pelanggan lain.'; return }; Object.assign(customer.value, form); open.value = false; notice.value = 'Profil pelanggan berhasil diperbarui.' }
</script>
<template>
  <PageHeader :title="customer?.name ?? 'Pelanggan tidak ditemukan'" eyebrow="COMMERCE" back="/customers" description="Informasi pelanggan dan riwayat pembeliannya."><VBtn v-if="customer" variant="outlined" prepend-icon="ri-edit-line" @click="edit">Edit profil</VBtn></PageHeader>
  <VAlert v-if="notice" type="info" variant="tonal" class="mb-5" role="status">{{ notice }}</VAlert>
  <VAlert v-if="!customer" type="warning">Pelanggan tidak ditemukan. Kembali ke daftar untuk memilih profil lain.</VAlert>
  <VRow v-else><VCol cols="12" md="4"><VCard title="Informasi kontak"><VCardText class="form-stack"><VAvatar size="64" color="primary" variant="tonal">{{ customer.name[0] }}</VAvatar><dl class="detail-list"><div><dt>Email</dt><dd>{{ customer.email }}</dd></div><div><dt>Nomor telepon</dt><dd>{{ customer.phone }}</dd></div><div><dt>Kota</dt><dd>{{ customer.city }}</dd></div><div><dt>Bergabung</dt><dd>{{ customer.joined }}</dd></div><div><dt>Total dibayar</dt><dd>{{ money(spent) }}</dd></div></dl></VCardText></VCard></VCol><VCol cols="12" md="8"><VCard title="Riwayat pesanan"><VTable><thead><tr><th>Pesanan</th><th>Tanggal</th><th>Total</th><th>Status</th></tr></thead><tbody><tr v-for="order in orders" :key="order.id"><td><RouterLink :to="`/orders/${order.id}`">#LM-{{ order.id }}</RouterLink></td><td>{{ order.createdAt.slice(0, 10) }}</td><td>{{ money(orderTotal(order)) }}</td><td><VChip :color="statusColor(order.status)" size="small">{{ statusLabel(order.status) }}</VChip></td></tr><tr v-if="!orders.length"><td colspan="4" class="text-center pa-8">Pelanggan ini belum memiliki pesanan.</td></tr></tbody></VTable></VCard></VCol></VRow>
  <VDialog v-model="open" max-width="500" aria-label="Edit pelanggan"><VCard tag="form" title="Edit pelanggan" @submit.prevent="save"><VCardText class="form-stack"><VTextField v-model="form.name" label="Nama lengkap" required /><VTextField v-model="form.email" label="Email" type="email" required /><VTextField v-model="form.phone" label="Nomor telepon" required /><VTextField v-model="form.city" label="Kota" required /><VAlert v-if="error" type="error">{{ error }}</VAlert></VCardText><VCardActions class="pa-4"><VSpacer /><VBtn @click="open = false">Batal</VBtn><VBtn type="submit" variant="flat">Simpan perubahan</VBtn></VCardActions></VCard></VDialog>
</template>
