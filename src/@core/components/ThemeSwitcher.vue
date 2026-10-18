<script setup lang="ts">
import { useTheme } from 'vuetify'
import { useStorage } from '@vueuse/core'
import type { ThemeSwitcherTheme } from '@layouts/types'

const props = defineProps<{
  themes: ThemeSwitcherTheme[]
}>()

const { name: themeName, global: globalTheme } = useTheme()
const savedTheme = useStorage('lumora-theme', 'light')
if (props.themes.some(theme => theme.name === savedTheme.value)) globalTheme.name.value = savedTheme.value
const { state: currentThemeName, next: getNextThemeName, index: currentThemeIndex } = useCycleList(props.themes.map(t => t.name), { initialValue: themeName })

const changeTheme = () => {
  globalTheme.name.value = getNextThemeName()
}

// Update icon if theme is changed from other sources
watch(() => globalTheme.name.value, val => {
  currentThemeName.value = val
  savedTheme.value = val
})
</script>

<template>
  <IconBtn :aria-label="currentThemeName === 'light' ? 'Gunakan tampilan gelap' : 'Gunakan tampilan terang'" @click="changeTheme">
    <VIcon :icon="props.themes[currentThemeIndex].icon" />
    <VTooltip
      activator="parent"
      open-delay="250"
      scroll-strategy="close"
    >
      <span>{{ currentThemeName === 'light' ? 'Gunakan tampilan gelap' : 'Gunakan tampilan terang' }}</span>
    </VTooltip>
  </IconBtn>
</template>
