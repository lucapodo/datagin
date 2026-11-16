import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    // three.js / three-globe rappresentano da soli la maggior parte del
    // bundle: è previsto e accettabile per una libreria WebGL, non serve
    // segnalarlo come warning ad ogni build.
    chunkSizeWarningLimit: 2400,
  },
})
