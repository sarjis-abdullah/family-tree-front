// plugins/vuetify.ts
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles' // Import Vuetify styles

import { VDateInput } from 'vuetify/labs/VDateInput'


export default defineNuxtPlugin(nuxtApp => {
  const vuetify = createVuetify({
    components: {
        ...components,
        VDateInput
    },
    directives,
  })

  nuxtApp.vueApp.use(vuetify)
})
