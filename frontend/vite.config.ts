/// <reference types="vitest" />

import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./__tests__/setup.ts'],
    include: ['__tests__/**/*.test.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules',
        '__tests__',
        'dist',
        '**/*.d.ts',
        '**/*.config.{js,ts}',
        'src/components/**',
        'src/main.tsx',
        'src/vite-env.d.ts',
        'src/assets/**',
        'src/routes/**',
        'src/pages/**',
        'src/layouts/**',
        'src/lib/**',
        'src/config/**',
        'src/locales/types.ts',
        'src/hooks/use-mobile.ts',
        'src/hooks/useCourseFormManager.ts',
        'src/hooks/useGroupFormManager.ts',
        'src/hooks/useI18n.ts',
        'src/hooks/useGenerateSchedule.ts',
        'src/hooks/useScheduleExport.ts',
        'src/hooks/useScheduleHandlers.ts',
      ],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
