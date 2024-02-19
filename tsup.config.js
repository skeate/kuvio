import { makeConfig } from '@fp-tx/build-tools'

export default makeConfig({
	iife: true,
	buildMode: {
		type: 'Multi',
		entrypointGlobs: [
			'src/index.ts',
			'src/arbitrary.ts',
			'src/arbitrary-deferred.ts',
		],
	},
})
