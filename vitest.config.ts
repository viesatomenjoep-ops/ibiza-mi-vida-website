import { defineConfig } from 'vitest/config'
import { fileURLToPath } from 'node:url'

// Minimal unit-test setup. These tests cover pure logic in src/lib (data
// mapping, merge rules, redirect tables) — no DOM, no Next runtime — so the
// environment is plain node. Add jsdom + testing-library later if component
// tests are wanted.
export default defineConfig({
  resolve: {
    // Mirror the tsconfig path alias; vitest does not read tsconfig paths.
    alias: { '@': fileURLToPath(new URL('./src', import.meta.url)) },
  },
  test: {
    environment: 'node',
    include: ['src/**/*.{test,spec}.ts'],
    coverage: {
      provider: 'v8',
      include: ['src/lib/**/*.ts'],
    },
  },
})
