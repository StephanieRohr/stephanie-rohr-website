// @ts-check
import netlify from '@astrojs/netlify'
import react from '@astrojs/react'
import { defineConfig, fontProviders } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  integrations: [react()],
  adapter: netlify(),
  fonts: [
    {
      name: 'Raleway',
      cssVariable: '--font-heading',
      provider: fontProviders.google(),
    },
  ],
})
