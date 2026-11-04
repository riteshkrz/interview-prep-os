import { defineConfig } from 'vite';

export default defineConfig({
  server: {
    port: 5174,
    open: false,
    host: true
  },
  preview: {
    port: 5174,
    host: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          supabase: ['@supabase/supabase-js']
        }
      }
    }
  }
});
