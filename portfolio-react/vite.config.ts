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
})
