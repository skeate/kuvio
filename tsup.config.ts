import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/index.ts', 'src/arbitrary.ts'],
	format: ['cjs', 'esm', 'iife'],
	dts: true,
})
