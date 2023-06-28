import { defineConfig } from 'tsup'

export default defineConfig({
	entry: ['src/index.ts', 'src/arbitrary.ts', 'src/arbitrary-deferred.ts'],
	format: ['cjs', 'esm', 'iife'],
	dts: true,
})
