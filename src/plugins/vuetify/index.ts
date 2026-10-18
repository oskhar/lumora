import type { App } from 'vue'

import { createVuetify } from 'vuetify'
import { id } from 'vuetify/locale'
import { VBtn } from 'vuetify/components/VBtn'
import defaults from './defaults'
import { icons } from './icons'
import { themes } from './theme'

// Styles

import '@core/scss/template/libs/vuetify/index.scss'
import 'vuetify/styles'

export default function (app: App) {
  const vuetify = createVuetify({
    aliases: {
      IconBtn: VBtn,
    },
    defaults,
    icons,
    locale: { locale: 'id', fallback: 'en', messages: { id } },
    theme: {
      defaultTheme: 'light',
      themes,
    },
  })

  app.use(vuetify)
}
