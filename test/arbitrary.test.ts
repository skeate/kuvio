import * as fc from 'fast-check'

import * as k from '../src'
import { arbitraryFromPattern } from '../src/arbitrary'
import { arbitraryFromPattern as arbitraryFromPatternDeferred } from '../src/arbitrary-deferred'
import { pipe } from '../src/util/pipe'

describe('arbitrary derivation', () => {
	const pattern: k.Pattern = pipe(
		k.exactString('foo'),
		k.between(5, 9),
		k.then(k.atLeastOne()(k.char('z'))),
		k.then(k.atLeastOne({ greedy: true })(k.char('y'))),
		k.subgroup,
		k.maybe,
		k.then(
			k.sequence(
				pipe(k.anything, k.anyNumber({ greedy: true })),
				pipe(k.anything, k.anyNumber({ greedy: false })),
				pipe(k.anything, k.anyNumber()),
				k.times(3)(k.non(k.lower)),
			),
		),
		k.then(
			k.characterClass(
				false,
				['0', '4'],
				'A',
				[35, 39],
				['Q', 'T'],
				[31, 45],
				[94, 127],
				[255, 256],
			),
		),
		k.subgroup,
		k.or(k.atLeast(2)(k.exactString('bar'))),
	)

	it('can create Arbitraries', () => {
		const arbitrary = arbitraryFromPattern(pattern)

		// woof, bad testing practices ahead, but I'm not sure of a better way to test Arbitraries
		const regex = k.regexFromPattern(pattern)

		fc.assert(fc.property(arbitrary, (s) => regex.test(s)))
	})

	it('can create Arbitraries in a deferred call manner', () => {
		const arbitrary = arbitraryFromPatternDeferred(fc)(pattern)
		const regex = k.regexFromPattern(pattern)
		fc.assert(fc.property(arbitrary, (s) => regex.test(s)))
	})
})
