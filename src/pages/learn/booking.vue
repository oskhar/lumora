<script setup lang="ts">
import { courses, useDemoStore, localDate, type Booking } from '@/stores/demo'
import { getTimeSlots, timeRange, overlapsTimeRange, type TimeSlot } from '@/utils/bookingAvailability'
const store = useDemoStore()
const route = useRoute()
const now = useNow({ interval: 30_000 })
const today = computed(() => localDate(now.value))
const selectedDate = ref(today.value)
const month = ref(new Date(now.value.getFullYear(), now.value.getMonth(), 1))
const enrolledCourses = computed(() => courses.filter(c => store.data.enrollments.some(e => e.courseId === c.id)))
const courseId = ref<number | null>(enrolledCourses.value[0]?.id ?? null)
const course = computed(() => courses.find(c => c.id === courseId.value))
const duration = ref(60)
const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone
const monthTitle = computed(() => month.value.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }))
const dateTitle = computed(() => new Date(selectedDate.value + 'T12:00:00').toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' }))
const days = computed(() => {
  const start = new Date(month.value)
  start.setDate(1 - (start.getDay() + 6) % 7)
  return Array.from({ length: 42 }, (_, i) => {
    const date = new Date(start); date.setDate(start.getDate() + i)
    const value = localDate(date)
    return { value, day: date.getDate(), current: date.getMonth() === month.value.getMonth(), count: store.data.bookings.filter(b => b.date === value && b.status === 'Confirmed').length }
  })
})
const slots = computed(() => getTimeSlots({ date: selectedDate.value, duration: duration.value, instructor: course.value?.instructor ?? '', bookings: store.data.bookings, instructorBookings: store.data.instructorBookings, now: now.value }))
const availableCount = computed(() => slots.value.filter(s => s.status === 'available').length)
const reservations = computed(() => [
  ...store.data.instructorBookings.filter(b => b.date === selectedDate.value && b.instructor === course.value?.instructor && b.status !== 'Cancelled').map(b => ({ ...b, label: 'Instruktur sudah dipesan' })),
  ...store.data.bookings.filter(b => b.date === selectedDate.value && b.status === 'Confirmed').map(b => ({ ...b, label: b.instructor === course.value?.instructor ? 'Booking Anda' : 'Anda memiliki sesi dengan instruktur lain' })),
].sort((a, b) => a.time.localeCompare(b.time)))
const sessions = computed(() => store.data.bookings.filter(b => b.date === selectedDate.value).slice().sort((a, b) => a.time.localeCompare(b.time)))
const reviewOpen = ref(false)
const selectedTimes = ref<string[]>([])
const selectedSlots = computed(() => selectedTimes.value.map(time => slots.value.find(s => s.time === time)).filter((slot): slot is TimeSlot => !!slot).sort((a, b) => a.time.localeCompare(b.time)))
const canConfirm = computed(() => selectedTimes.value.length > 0 && selectedSlots.value.length === selectedTimes.value.length && selectedSlots.value.every(slot => slot.status === 'available'))
function conflictsWithSelection(slot: TimeSlot) { return !selectedTimes.value.includes(slot.time) && selectedTimes.value.some(time => overlapsTimeRange(slot.time, duration.value, time, duration.value)) }
const notes = ref('')
const error = ref('')
const message = ref('')
watch(() => route.query.course, value => {
  if (enrolledCourses.value.some(c => c.id === Number(value))) courseId.value = Number(value)
}, { immediate: true })
watch([selectedDate, courseId, duration], () => { selectedTimes.value = []; reviewOpen.value = false; error.value = ''; notes.value = '' })
function move(amount: number) { month.value = new Date(month.value.getFullYear(), month.value.getMonth() + amount, 1) }
function jumpToday() { selectedDate.value = today.value; month.value = new Date(now.value.getFullYear(), now.value.getMonth(), 1) }
function findNext() {
  for (let i = 0; i < 30; i++) {
    const date = new Date(now.value); date.setDate(date.getDate() + i)
    const value = localDate(date)
    if (getTimeSlots({ date: value, duration: duration.value, instructor: course.value?.instructor ?? '', bookings: store.data.bookings, instructorBookings: store.data.instructorBookings, now: now.value }).some(s => s.status === 'available')) {
      selectedDate.value = value; month.value = new Date(date.getFullYear(), date.getMonth(), 1)
      message.value = 'Tanggal dengan jam tersedia terdekat sudah dipilih. Pilih satu atau beberapa jam untuk melanjutkan.'
      return
    }
  }
  message.value = 'Belum ada jadwal yang cocok dalam 30 hari ke depan.'
}
function selectSlot(slot: TimeSlot) {
  if (selectedTimes.value.includes(slot.time)) { selectedTimes.value = selectedTimes.value.filter(time => time !== slot.time); return }
  if (slot.status !== 'available') return
  if (conflictsWithSelection(slot)) return
  selectedTimes.value = [...selectedTimes.value, slot.time].sort()
  error.value = ''
}
function save() {
  if (!course.value || !canConfirm.value) { error.value = 'Periksa kembali jam yang dipilih. Belum ada booking yang dibuat.'; return }
  try {
    const created = store.bookMany(selectedTimes.value.map(time => ({ courseId: course.value!.id, instructor: course.value!.instructor, date: selectedDate.value, time, duration: duration.value, notes: notes.value.trim() })))
    message.value = created.length + ' sesi berhasil dipesan: ' + dateTitle.value + ', ' + created.map(session => timeRange(session.time, session.duration)).join(', ') + '. Lihat detailnya di Sesi Anda.'
    reviewOpen.value = false; selectedTimes.value = []
  } catch (cause) { error.value = cause instanceof Error ? cause.message : 'Booking belum berhasil. Silakan pilih jam lain.' }
}
const cancelling = ref<Booking | null>(null)
const cancelOpen = computed({ get: () => !!cancelling.value, set: value => { if (!value) cancelling.value = null } })
function cancel() { if (cancelling.value) cancelling.value.status = 'Cancelled'; cancelling.value = null; message.value = 'Booking dibatalkan. Ketersediaan jam telah diperbarui.' }
onMounted(() => { if (enrolledCourses.value.length && !availableCount.value) findNext() })
const slotLabel = (slot: TimeSlot) => slot.status !== 'available' ? ({ booked: 'Sudah dipesan', past: 'Sudah lewat', closed: 'Durasi tidak cukup' })[slot.status] : selectedTimes.value.includes(slot.time) ? 'Dipilih' : conflictsWithSelection(slot) ? 'Bentrok pilihan' : 'Tersedia'
</script>

<template>
  <PageHeader title="Booking private course" eyebrow="BELAJAR & JADWAL" description="Pilih kursus dan tanggal, centang beberapa jam tersedia, lalu konfirmasi sekaligus.">
    <VBtn to="/learn/my-courses" variant="outlined" prepend-icon="ri-book-open-line">Kursus saya</VBtn>
  </PageHeader>
  <VAlert v-if="message" type="info" variant="tonal" closable class="mb-5" role="status" @click:close="message = ''">{{ message }}</VAlert>
  <VCard v-if="!enrolledCourses.length" class="pa-8 text-center">
    <VIcon icon="ri-graduation-cap-line" size="44" color="primary" />
    <h3 class="text-h5 my-3">Ikuti kursus terlebih dahulu</h3>
    <p class="mb-5">Sesi pribadi tersedia untuk kursus yang sudah Anda ikuti.</p>
    <VBtn to="/learn/courses">Lihat katalog kursus</VBtn>
  </VCard>
  <template v-else>
    <VCard class="mb-5" title="1. Pilih kursus & durasi">
      <VCardText>
        <VRow align="center">
          <VCol cols="12" md="8"><VSelect v-model="courseId" :items="enrolledCourses" item-title="title" item-value="id" label="Kursus yang akan dipelajari" :hint="'Instruktur: ' + course?.instructor + ' · Jam layanan 09:00–18:00'" persistent-hint /></VCol>
          <VCol cols="12" md="4"><p class="text-body-2 font-weight-medium mb-2">Durasi per sesi</p><VBtnToggle class="duration-selector" v-model="duration" mandatory divided color="primary" variant="outlined" aria-label="Durasi sesi"><VBtn v-for="minutes in [30, 60, 90]" :key="minutes" :value="minutes" :aria-label="minutes + ' menit'">{{ minutes }} mnt</VBtn></VBtnToggle></VCol>
        </VRow>
      </VCardText>
    </VCard>
    <div class="booking-layout">
      <VCard title="2. Pilih tanggal" class="calendar-panel">
          <VCardText>
            <div class="d-flex align-center justify-space-between flex-wrap gap-2 mb-4">
              <h3 class="text-h6">{{ monthTitle }}</h3>
              <div class="d-flex align-center gap-1"><IconBtn aria-label="Bulan sebelumnya" title="Bulan sebelumnya" @click="move(-1)"><VIcon icon="ri-arrow-left-s-line" /></IconBtn><VBtn variant="tonal" size="small" @click="jumpToday">Hari ini</VBtn><IconBtn aria-label="Bulan berikutnya" title="Bulan berikutnya" @click="move(1)"><VIcon icon="ri-arrow-right-s-line" /></IconBtn></div>
            </div>
            <div class="booking-grid">
              <div v-for="day in ['Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab', 'Min']" :key="day" class="calendar-weekday">{{ day }}</div>
              <button v-for="day in days" :key="day.value" type="button" class="calendar-day" :class="{ selected: day.value === selectedDate, muted: !day.current, today: day.value === today }" :aria-label="day.value + ', ' + day.count + ' booking Anda'" :aria-pressed="day.value === selectedDate" @click="selectedDate = day.value">
                <span>{{ day.day }}</span><span v-if="day.count" class="calendar-count">{{ day.count }}</span>
              </button>
            </div>
            <p class="text-body-2 text-medium-emphasis mt-4"><VIcon icon="ri-calendar-check-line" size="16" /> Angka pada tanggal menunjukkan jumlah booking Anda yang aktif.</p>
          </VCardText>
        </VCard>
      <VCard title="3. Pilih jam yang tersedia" class="align-self-start availability-panel" id="available-times">
        <VCardText>
          <h3 class="text-h6">{{ dateTitle }}</h3>
          <p class="text-body-2 text-medium-emphasis mt-2 mb-4">{{ duration }} menit per sesi · Zona waktu {{ timezone }}</p>
          <div class="d-flex flex-wrap gap-2 mb-4" aria-label="Keterangan jadwal"><VChip color="primary" variant="outlined" size="small" prepend-icon="ri-checkbox-circle-line">Tersedia</VChip><VChip color="warning" variant="tonal" size="small" prepend-icon="ri-lock-line">Sudah dipesan</VChip><VChip color="secondary" variant="tonal" size="small" prepend-icon="ri-time-line">Tidak bisa dipilih</VChip></div>
          <p class="text-body-2 mb-4" aria-live="polite"><strong>{{ availableCount }} pilihan jam tersedia.</strong> Setiap pilihan mencakup durasi {{ duration }} menit penuh.</p>
          <VAlert v-if="!availableCount" variant="tonal" type="info" class="mb-4">Tidak ada jam yang bisa dipilih pada tanggal ini.<VBtn variant="text" size="small" class="mt-2" @click="findNext">Cari tanggal tersedia terdekat</VBtn></VAlert>
          <div class="time-slot-grid">
            <button v-for="slot in slots" :key="slot.time" type="button" class="time-slot" :class="[slot.status, { chosen: selectedTimes.includes(slot.time), conflict: slot.status === 'available' && conflictsWithSelection(slot) }]" :disabled="slot.status !== 'available' || conflictsWithSelection(slot)" :title="conflictsWithSelection(slot) ? 'Jam ini bertumpang tindih dengan pilihan Anda.' : slot.reason" :aria-pressed="selectedTimes.includes(slot.time)" :aria-label="slot.time + ' sampai ' + slot.end + ', ' + slotLabel(slot)" :data-time="slot.time" :data-status="slot.status" @click="selectSlot(slot)">
              <span class="font-weight-medium">{{ slot.time }}–{{ slot.end }}</span><span class="slot-status"><VIcon :icon="selectedTimes.includes(slot.time) ? 'ri-checkbox-circle-fill' : slot.status === 'available' ? 'ri-checkbox-blank-circle-line' : slot.status === 'booked' ? 'ri-lock-line' : 'ri-time-line'" size="14" />{{ slotLabel(slot) }}</span>
            </button>
          </div>
          <div class="selection-summary mt-5">
  <p class="font-weight-medium" role="status" aria-live="polite">{{ selectedTimes.length }} sesi dipilih · total {{ selectedTimes.length * duration }} menit</p>
  <p class="text-body-2 text-medium-emphasis mt-2">Klik beberapa jam untuk memilih. Klik kembali untuk membatalkan pilihan. Sesi berurutan diperbolehkan; jam yang tumpang tindih tidak bisa dipilih bersamaan.</p>
  <div class="d-flex flex-wrap gap-2 mt-3"><VChip v-for="slot in selectedSlots" :key="slot.time" closable :color="slot.status === 'available' ? 'primary' : 'warning'" :aria-label="'Hapus pilihan ' + slot.time" @click:close="selectedTimes = selectedTimes.filter(time => time !== slot.time)">{{ slot.time }}–{{ slot.end }}</VChip></div>
  <VAlert v-if="selectedTimes.length && !canConfirm" type="warning" variant="tonal" class="mt-3">Ada pilihan yang tidak lagi tersedia. Hapus jam tersebut sebelum melanjutkan.</VAlert>
  <div class="d-flex flex-wrap gap-2 mt-4"><VBtn :disabled="!canConfirm" data-testid="review-bookings" @click="error = ''; reviewOpen = true">Tinjau {{ selectedTimes.length }} sesi</VBtn><VBtn v-if="selectedTimes.length" variant="text" @click="selectedTimes = []">Kosongkan pilihan</VBtn></div>
  <p class="text-caption mt-3">Mengganti tanggal, kursus, atau durasi akan mengosongkan pilihan jam. Setiap jam akan disimpan sebagai sesi tersendiri.</p>
</div>
          <VExpansionPanels variant="accordion" class="mt-5">
            <VExpansionPanel :title="'Lihat rentang yang sudah dipesan (' + reservations.length + ')'">
              <VExpansionPanelText><div v-for="(item, index) in reservations" :key="index" class="py-2"><p class="font-weight-medium">{{ timeRange(item.time, item.duration) }}</p><p class="text-body-2">{{ item.label }}</p></div><p v-if="!reservations.length">Belum ada reservasi pada tanggal ini.</p></VExpansionPanelText>
            </VExpansionPanel>
          </VExpansionPanels>
          <p class="text-caption mt-5">Jadwal demo menggunakan reservasi contoh instruktur dan booking lokal Anda. Belum terhubung ke kalender atau ketersediaan instruktur sungguhan.</p>
        </VCardText>
      </VCard>
        <VCard class="session-panel" title="Sesi Anda pada tanggal ini">
          <VCardText>
            <div v-for="session in sessions" :key="session.id" class="review-line">
              <div class="d-flex align-center justify-space-between flex-wrap gap-2"><span class="font-weight-medium">{{ timeRange(session.time, session.duration) }}</span><VChip :color="session.status === 'Cancelled' ? 'secondary' : 'primary'" size="small">{{ session.status === 'Cancelled' ? 'Dibatalkan' : 'Terkonfirmasi' }}</VChip></div>
              <p class="mt-3 font-weight-medium">{{ courses.find(c => c.id === session.courseId)?.title }}</p><p class="text-body-2 mt-1">Bersama {{ session.instructor }} · {{ session.duration }} menit</p><p v-if="session.notes" class="text-body-2 mt-2">{{ session.notes }}</p>
              <VBtn v-if="session.status === 'Confirmed'" variant="text" color="error" size="small" class="mt-2" @click="cancelling = session">Batalkan sesi</VBtn>
            </div>
            <p v-if="!sessions.length" class="text-body-2 text-medium-emphasis">Belum ada booking Anda pada tanggal ini. Pilih jam tersedia di bagian jadwal.</p>
          </VCardText>
        </VCard>
    </div>
  </template>
  <VDialog v-model="reviewOpen" max-width="540" aria-labelledby="booking-review-title">
    <VCard tag="form" @submit.prevent="save">
      <VCardItem><VCardTitle id="booking-review-title">Tinjau booking Anda</VCardTitle><VCardSubtitle>Pastikan kursus dan jam sudah sesuai sebelum mengonfirmasi.</VCardSubtitle></VCardItem>
      <VCardText class="form-stack">
        <dl class="detail-list"><div><dt>Kursus</dt><dd>{{ course?.title }}</dd></div><div><dt>Instruktur</dt><dd>{{ course?.instructor }}</dd></div><div><dt>Tanggal</dt><dd>{{ dateTitle }}</dd></div><div><dt>Jam dipilih</dt><dd><p v-for="slot in selectedSlots" :key="slot.time">{{ slot.time }}–{{ slot.end }}</p></dd></div><div><dt>Jumlah sesi</dt><dd>{{ selectedTimes.length }} sesi × {{ duration }} menit</dd></div><div><dt>Total durasi</dt><dd>{{ selectedTimes.length * duration }} menit</dd></div><div><dt>Zona waktu</dt><dd>{{ timezone }}</dd></div></dl>
        <VTextarea v-model="notes" label="Topik untuk seluruh sesi (opsional)" placeholder="Contoh: latihan pencahayaan untuk foto produk" rows="3" maxlength="500" counter />
        <VAlert v-if="!canConfirm || error" type="warning" variant="tonal">{{ error || 'Ada pilihan yang tidak lagi tersedia. Kembali dan hapus jam tersebut. Belum ada sesi yang disimpan.' }}</VAlert>
        <p class="text-body-2 text-medium-emphasis">Sesi ini merupakan simulasi. Tidak ada pembayaran atau undangan yang dikirim.</p>
      </VCardText>
      <VCardActions class="pa-5 flex-wrap gap-2"><VBtn variant="outlined" @click="reviewOpen = false">Kembali pilih jam</VBtn><VSpacer /><VBtn type="submit" variant="flat" :disabled="!canConfirm" data-testid="confirm-bookings">Konfirmasi {{ selectedTimes.length }} sesi</VBtn></VCardActions>
    </VCard>
  </VDialog>
  <VDialog v-model="cancelOpen" max-width="480" aria-label="Konfirmasi pembatalan sesi">
    <VCard title="Batalkan sesi ini?"><VCardText><p class="font-weight-medium mb-2">{{ courses.find(c => c.id === cancelling?.courseId)?.title }}</p><p>{{ cancelling?.date }} · {{ cancelling ? timeRange(cancelling.time, cancelling.duration) : '' }}</p><p class="mt-3">Sesi akan ditandai Dibatalkan. Anda dapat memilih jam baru setelah pembatalan.</p></VCardText><VCardActions class="pa-5 flex-wrap gap-2"><VBtn variant="outlined" @click="cancelling = null">Pertahankan sesi</VBtn><VSpacer /><VBtn color="error" variant="flat" @click="cancel">Ya, batalkan sesi</VBtn></VCardActions></VCard>
  </VDialog>
</template>
<style scoped>
.booking-layout { display: grid; grid-template-columns: minmax(0, .95fr) minmax(0, 1.15fr); grid-template-areas: "calendar availability" "sessions availability"; grid-template-rows: auto 1fr; gap: 24px; align-items: start; }
.calendar-panel { grid-area: calendar; }
.availability-panel { grid-area: availability; }
.session-panel { grid-area: sessions; }
.duration-selector :deep(.v-btn) { min-inline-size: 84px !important; padding-inline: 12px !important; }
.booking-grid { display: grid; grid-template-columns: repeat(7, minmax(0, 1fr)); gap: 4px; }
.calendar-weekday { text-align: center; font-size: 12px; color: rgba(var(--v-theme-on-surface), .7); padding-block: 10px; }
.calendar-day { position: relative; display: flex; align-items: center; justify-content: center; min-block-size: 58px; border: 1px solid rgba(var(--v-border-color), .1); border-radius: 9px; color: rgb(var(--v-theme-on-surface)); }
.calendar-day:hover { background: rgba(var(--v-theme-primary), .08); }
.calendar-day.selected { background: rgb(var(--v-theme-primary)); color: rgb(var(--v-theme-on-primary)); }
.calendar-day.today { border-color: rgb(var(--v-theme-primary)); }
.calendar-day.muted:not(.selected) { opacity: .45; }
.calendar-count { position: absolute; inset-block-end: 3px; inset-inline-end: 5px; font-size: 9px; font-weight: 700; }
.time-slot-grid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 10px; }
.time-slot { display: flex; flex-direction: column; gap: 7px; padding: 12px 8px; border: 1px solid rgba(var(--v-theme-primary), .45); border-radius: 10px; color: rgb(var(--v-theme-primary)); text-align: center; font-size: 13px; }
.time-slot.available:hover { background: rgba(var(--v-theme-primary), .09); border-color: rgb(var(--v-theme-primary)); }
.time-slot.chosen { background: rgb(var(--v-theme-primary)); color: rgb(var(--v-theme-on-primary)); border-color: rgb(var(--v-theme-primary)); }
.time-slot.chosen:hover { background: rgb(var(--v-theme-primary)); }
.time-slot.conflict { border-style: dashed; border-color: rgba(var(--v-border-color), .2); color: rgba(var(--v-theme-on-surface), .55); }
.selection-summary { border: 1px solid rgba(var(--v-theme-primary), .2); border-radius: 12px; padding: 16px; }
.slot-status { display: flex; justify-content: center; align-items: center; gap: 4px; font-size: 11px; }
.time-slot.booked { border-color: rgba(var(--v-theme-warning), .2); color: rgb(var(--v-theme-on-surface)); background: rgba(var(--v-theme-warning), .1); }
.time-slot.closed, .time-slot.past { border-color: rgba(var(--v-border-color), .1); color: rgba(var(--v-theme-on-surface), .55); background: rgba(var(--v-theme-on-surface), .03); }
.calendar-day:focus-visible, .time-slot:focus-visible { outline: 3px solid rgb(var(--v-theme-primary)); outline-offset: 2px; }
@media (max-width: 1099px) { .booking-layout { grid-template-columns: minmax(0, 1fr); grid-template-areas: "calendar" "availability" "sessions"; grid-template-rows: auto; } }
@media (max-width: 599px) { .calendar-day { min-block-size: 45px; font-size: 12px; } .time-slot-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
</style>
