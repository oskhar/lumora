<script setup lang="ts">
import { useDemoStore, money } from '@/stores/demo'
const store = useDemoStore(); const router = useRouter(); const error = ref(''); const submitting = ref(false)
const form = reactive({ name: '', email: '', phone: '', address: '', city: '', postalCode: '', payment: '' })
const methods = computed(() => [ ...(store.data.settings.bankTransfer ? ['Bank transfer (demo)'] : []), ...(store.data.settings.cashOnDelivery ? ['Cash on delivery (demo)'] : []) ])
watch(methods, available => { if (!available.includes(form.payment)) form.payment = available[0] ?? '' }, { immediate: true })
async function submit() {
  if (submitting.value) return
  error.value = ''
  if (!methods.value.includes(form.payment)) { error.value = 'Pilih salah satu metode pembayaran yang tersedia.'; return }
  if ([form.name, form.email, form.phone, form.address, form.city, form.postalCode].some(value => !value.trim())) { error.value = 'Lengkapi semua data kontak dan alamat pengiriman.'; return }
  submitting.value = true
  try { const id = store.checkout({ name: form.name.trim(), email: form.email.trim(), phone: form.phone.trim(), city: form.city.trim() }, `${form.address}, ${form.city} ${form.postalCode}`, form.payment); await router.push(`/shop/orders/${id}?placed=1`) }
  catch (cause) { error.value = cause instanceof Error ? cause.message : 'Pesanan belum berhasil dibuat. Periksa keranjang dan coba lagi.' }
  finally { submitting.value = false }
}
</script>
<template>
  <PageHeader title="Checkout" eyebrow="STORE" back="/shop/cart" description="Isi alamat, pilih pembayaran, lalu periksa ringkasan pesanan." />
  <ShoppingSteps :step="2" />
  <VCard v-if="!store.cartItems.length" class="pa-8 text-center"><p class="mb-4">Keranjang Anda masih kosong.</p><VBtn to="/shop/products">Lanjut belanja</VBtn></VCard>
  <form v-else @submit.prevent="submit"><VRow><VCol cols="12" md="8"><VCard title="1. Kontak & alamat pengiriman"><VCardText class="form-stack"><VRow><VCol cols="12" sm="6"><VTextField v-model="form.name" label="Nama lengkap" autocomplete="name" required /></VCol><VCol cols="12" sm="6"><VTextField v-model="form.email" label="Alamat email" type="email" autocomplete="email" required /></VCol></VRow><VTextField v-model="form.phone" label="Nomor telepon" type="tel" placeholder="Contoh: 081234567890" autocomplete="tel" required /><VTextField v-model="form.address" label="Alamat lengkap" autocomplete="street-address" hint="Nama jalan, nomor rumah, dan detail patokan bila perlu." persistent-hint required /><VRow><VCol cols="12" sm="6"><VTextField v-model="form.city" label="Kota" autocomplete="address-level2" required /></VCol><VCol cols="12" sm="6"><VTextField v-model="form.postalCode" label="Kode pos" autocomplete="postal-code" required /></VCol></VRow></VCardText></VCard><VCard title="2. Pilih metode pembayaran" class="mt-5"><VCardText><VRadioGroup v-model="form.payment"><VRadio v-for="method in methods" :key="method" :label="method.startsWith('Bank') ? 'Transfer bank (demo)' : 'Bayar di tempat / COD (demo)'" :value="method" /></VRadioGroup><VAlert v-if="!methods.length" type="warning" variant="tonal">Toko belum mengaktifkan metode pembayaran. Pesanan belum bisa dibuat.</VAlert><p class="text-body-2 text-medium-emphasis mt-3">Ini checkout demo. Tidak ada uang yang ditransfer atau kartu yang ditagih.</p></VCardText></VCard></VCol><VCol cols="12" md="4"><VCard title="3. Periksa pesanan"><VCardText class="form-stack"><div v-for="line in store.cartItems" :key="line.productId" class="d-flex justify-space-between gap-3 text-body-2"><span>{{ line.product.name }} × {{ line.quantity }}</span><span class="text-no-wrap">{{ money(line.product.price * line.quantity) }}</span></div><VDivider /><dl class="detail-list"><div><dt>Subtotal</dt><dd>{{ money(store.cartTotal) }}</dd></div><div><dt>Ongkir standar</dt><dd>{{ money(20000) }}</dd></div><div class="font-weight-bold"><dt>Total</dt><dd>{{ money(store.cartTotal + 20000) }}</dd></div></dl><VAlert v-if="error" type="error" variant="tonal">{{ error }}</VAlert><VBtn type="submit" :loading="submitting" :disabled="!methods.length" size="large">Buat pesanan demo</VBtn><p class="text-caption">Pesanan dan informasi kontak disimpan di browser ini.</p></VCardText></VCard></VCol></VRow></form>
</template>
