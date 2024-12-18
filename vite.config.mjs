import { defineConfig } from 'vite'

export default defineConfig({
  test: {
    testTimeout: 80000,
    globals: true,
    "setupFiles": [
      "./setupVitest.mjs"
    ],
    include: ['./src/**/*.test.ts', './test/**/*.test.[tj]s'],
  },
})
