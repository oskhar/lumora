import { defineStore } from 'pinia'
import { useStorage } from '@vueuse/core'
export const useProfileStore = defineStore('lumora-profile', () => {
  const profile = useStorage('lumora-profile-v1', { name: 'Pengguna demo', email: 'demo@example.com', phone: '', company: '', avatar: '', orderUpdates: true, learningReminders: true })
  return { profile }
})
