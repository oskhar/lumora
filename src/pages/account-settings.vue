<script setup lang="ts">
import { useProfileStore } from '@/stores/profile'
import avatar from '@images/avatars/avatar-1.png'
const store = useProfileStore()
const form = reactive({ ...store.profile })
const dirty = computed(() => JSON.stringify(form) !== JSON.stringify(store.profile))
const saved = ref(false)
const error = ref('')
const input = ref<HTMLInputElement | null>(null)
watch(form, () => { saved.value = false }, { deep: true })
function save() {
  if (!form.name.trim()) { error.value = 'Isi nama lengkap Anda.'; return }
  Object.assign(store.profile, { ...form, name: form.name.trim() })
  saved.value = true; error.value = ''
}
function reset() { Object.assign(form, store.profile); error.value = '' }
function upload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 512000) { error.value = 'Pilih JPG, PNG, atau WebP berukuran maksimal 500 KB.'; return }
  const reader = new FileReader()
  reader.onload = () => { if (typeof reader.result === 'string') form.avatar = reader.result; error.value = '' }
  reader.readAsDataURL(file)
}
</script>
<template>
  <PageHeader title="Pengaturan akun" eyebrow="AKUN" description="Perbarui profil dan preferensi Anda, lalu simpan perubahan." />
  <VAlert v-if="saved" type="info" variant="tonal" class="mb-5" role="status">Profil dan preferensi berhasil disimpan di browser ini.</VAlert>
  <VAlert v-if="error" type="error" variant="tonal" class="mb-5" role="alert">{{ error }}</VAlert>
  <form @submit.prevent="save"><VRow>
    <VCol cols="12" md="7"><VCard title="Profil Anda"><VCardText class="form-stack">
      <div class="d-flex align-center flex-wrap gap-4"><VAvatar :image="form.avatar || avatar" size="72" /><div><VBtn variant="outlined" prepend-icon="ri-upload-line" @click="input?.click()">Ganti foto</VBtn><p class="text-body-2 text-medium-emphasis mt-2">JPG, PNG, WebP · maksimal 500 KB</p></div><input ref="input" type="file" accept="image/png,image/jpeg,image/webp" hidden @change="upload"></div>
      <VTextField v-model="form.name" label="Nama lengkap" required maxlength="80" autocomplete="name" /><VTextField v-model="form.email" label="Alamat email" type="email" required autocomplete="email" /><VTextField v-model="form.phone" label="Nomor telepon (opsional)" type="tel" autocomplete="tel" /><VTextField v-model="form.company" label="Organisasi (opsional)" maxlength="100" />
    </VCardText></VCard></VCol>
    <VCol cols="12" md="5"><VCard title="Preferensi pemberitahuan"><VCardText class="form-stack"><VSwitch v-model="form.orderUpdates" label="Pembaruan status pesanan" /><VSwitch v-model="form.learningReminders" label="Pengingat belajar & private course" /><p class="text-body-2 text-medium-emphasis">Pilihan disimpan sebagai preferensi demo. Email dan notifikasi belum dikirim.</p></VCardText></VCard><VCard title="Tentang akun demo" class="mt-5"><VCardText><p>Profil ini hanya tersimpan di perangkat Anda. Password, login sungguhan, dan penghapusan akun memerlukan layanan autentikasi.</p></VCardText></VCard></VCol>
    <VCol cols="12"><VCard class="pa-4"><div class="d-flex justify-space-between align-center flex-wrap gap-3"><span class="text-body-2 text-medium-emphasis">{{ dirty ? 'Perubahan belum disimpan.' : 'Semua perubahan sudah tersimpan.' }}</span><div class="d-flex gap-2"><VBtn :disabled="!dirty" variant="outlined" @click="reset">Urungkan perubahan</VBtn><VBtn type="submit" :disabled="!dirty">Simpan perubahan</VBtn></div></div></VCard></VCol>
  </VRow></form>
  <UnsavedChangesGuard :dirty="dirty" />
</template>
