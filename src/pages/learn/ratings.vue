<script setup lang="ts">
import { courses, useDemoStore, localDate } from '@/stores/demo'
const store = useDemoStore(); const route = useRoute()
const selected = ref<number | null>(null); const open = ref(false); const error = ref('')
watch(() => route.query.course, value => { selected.value = courses.some(c => c.id === Number(value)) ? Number(value) : null }, { immediate: true })
const filtered = computed(() => store.data.reviews.filter(r => !selected.value || r.courseId === selected.value).slice().reverse())
const average = computed(() => filtered.value.length ? (filtered.value.reduce((sum, r) => sum + r.rating, 0) / filtered.value.length).toFixed(1) : '—')
const enrolledCourses = computed(() => courses.filter(course => store.data.enrollments.some(e => e.courseId === course.id)))
const form = reactive({ courseId: null as number | null, rating: 5, text: '' })
function write() { form.courseId = selected.value && enrolledCourses.value.some(c => c.id === selected.value) ? selected.value : enrolledCourses.value[0]?.id ?? null; loadReview(); error.value = ''; open.value = true }
function loadReview() { const existing = store.data.reviews.find(r => r.courseId === form.courseId && r.author === 'You'); form.rating = existing?.rating ?? 5; form.text = existing?.text ?? '' }
function save() {
  if (!form.courseId || !enrolledCourses.value.some(c => c.id === form.courseId) || form.text.trim().length < 10 || !Number.isInteger(form.rating) || form.rating < 1 || form.rating > 5) { error.value = 'Pilih kursus yang diikuti, beri nilai, dan tulis ulasan minimal 10 karakter.'; return }
  const existing = store.data.reviews.find(r => r.courseId === form.courseId && r.author === 'You')
  const review = { courseId: form.courseId, author: 'You', rating: form.rating, text: form.text.trim(), date: localDate() }
  if (existing) Object.assign(existing, review)
  else store.data.reviews.push({ ...review, id: store.nextId(store.data.reviews) })
  selected.value = form.courseId; open.value = false
}
</script>
<template>
  <PageHeader title="Rating & ulasan" eyebrow="ACADEMY" description="Baca ulasan peserta atau bagikan pengalaman Anda pada kursus yang diikuti."><VBtn :disabled="!enrolledCourses.length" prepend-icon="ri-star-line" @click="write">Tulis ulasan</VBtn></PageHeader>
  <VRow><VCol cols="12" md="4"><VCard><VCardText class="form-stack"><h3 class="text-h3">{{ average }} <span class="text-body-1 text-medium-emphasis">/ 5</span></h3><p>{{ filtered.length }} ulasan peserta</p><VSelect v-model="selected" :items="courses" item-title="title" item-value="id" label="Kursus" clearable /><p class="text-caption">Anda dapat menulis satu ulasan per kursus yang diikuti, lalu mengeditnya melalui tombol Tulis ulasan.</p></VCardText></VCard></VCol><VCol cols="12" md="8"><VCard><VCardText><div v-for="review in filtered" :key="review.id" class="review-line"><div class="d-flex justify-space-between gap-3 flex-wrap"><div><p class="font-weight-medium">{{ review.author === 'You' ? 'Anda' : review.author }}</p><RouterLink :to="`/learn/courses/${review.courseId}`" class="text-body-2">{{ courses.find(c => c.id === review.courseId)?.title }}</RouterLink></div><VRating :model-value="review.rating" readonly color="warning" size="20" density="compact" /></div><p class="my-3">{{ review.text }}</p><p class="text-caption">{{ review.date }}</p></div><p v-if="!filtered.length" class="text-center pa-8">Belum ada ulasan untuk kursus ini.</p></VCardText></VCard></VCol></VRow>
  <VDialog v-model="open" max-width="540" aria-label="Tulis ulasan kursus"><VCard tag="form" title="Bagikan pengalaman belajar" @submit.prevent="save"><VCardText class="form-stack"><VSelect v-model="form.courseId" :items="enrolledCourses" item-title="title" item-value="id" label="Kursus" @update:model-value="loadReview" /><div><p class="mb-2">Nilai kursus ini</p><VRating v-model="form.rating" color="warning" hover aria-label="Pilih rating kursus" /></div><VTextarea v-model="form.text" label="Ulasan Anda" hint="Ceritakan hal yang membantu atau perlu ditingkatkan. Minimal 10 karakter." persistent-hint rows="4" minlength="10" maxlength="1000" counter required /><VAlert v-if="error" type="error" variant="tonal">{{ error }}</VAlert></VCardText><VCardActions class="pa-4"><VSpacer /><VBtn @click="open = false">Batal</VBtn><VBtn type="submit" variant="flat">Simpan ulasan</VBtn></VCardActions></VCard></VDialog>
</template>
