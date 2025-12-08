/// <reference types="vitest/config" />
/* You'll also need to add a reference to Vitest types using a triple
slash directive at the top of your config file. */
import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/tests/setupTests.ts',
    testTimeout: 10_000,
    coverage: {
      exclude: [
        'mockServiceWorker.js',
        '.eslintrc.cjs',
        'src/main.tsx',
        'src/mswServer',
        '**/*.config.js',
        '**/types/*.ts',
        'src/msw',
        '_tests_',
        'vite.config.ts',
      ],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
})
