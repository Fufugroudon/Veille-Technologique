import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Static build for o2switch shared hosting (no SSR, no Node runtime).
// `base: './'` keeps asset URLs relative so the build works from any
// subdirectory on the shared host.
export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,
  },
  server: {
    // No PHP backend exists in this repo — the contact form builds a
    // mailto: link client-side (see src/components/contact/ContactForm.tsx).
    // If a real PHP endpoint is added later, point requests to it here, e.g.:
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8000',
    //     changeOrigin: true,
    //   },
    // },
  },
})
