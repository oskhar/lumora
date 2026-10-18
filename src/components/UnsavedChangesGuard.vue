<script setup lang="ts">
const props = defineProps<{ dirty: boolean }>()
const open = ref(false)
let decide: ((value: boolean) => void) | undefined
function check() {
  if (!props.dirty) return true
  return new Promise<boolean>(resolve => { decide = resolve; open.value = true })
}
function respond(leave: boolean) { open.value = false; decide?.(leave); decide = undefined }
onBeforeRouteLeave(check)
onBeforeRouteUpdate(check)
function beforeUnload(event: BeforeUnloadEvent) { if (props.dirty) { event.preventDefault(); event.returnValue = '' } }
onMounted(() => window.addEventListener('beforeunload', beforeUnload))
onUnmounted(() => { window.removeEventListener('beforeunload', beforeUnload); decide?.(false) })
</script>
<template>
  <VDialog :model-value="open" max-width="480" persistent aria-label="Perubahan belum disimpan"><VCard title="Perubahan belum disimpan"><VCardText>Anda sudah mengubah form ini. Tetap di halaman untuk menyimpan, atau tinggalkan halaman dan abaikan perubahan.</VCardText><VCardActions class="pa-5 flex-wrap gap-2"><VBtn variant="outlined" @click="respond(true)">Abaikan perubahan</VBtn><VSpacer /><VBtn variant="flat" @click="respond(false)">Tetap di halaman</VBtn></VCardActions></VCard></VDialog>
</template>
