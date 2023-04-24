import { pipe } from 'fp-ts/function'
import * as k from '../src'

describe('kuvio', () => {
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

	it('can create RegExps', () => {
		const actual = k.regexFromPattern(pattern)

		expect(actual.source).toEqual(
			"^((((foo){5,9}z+?y+)?.*.*?.*?[^a-z]{3}[0-4A#-'Q-T\\x1f-\\x2d\\x5e-\\x7f\\xff-\\u0100])|(bar){2,})$",
		)
		expect(actual.flags).toEqual('')
	})

	it('can create case-insensitive RegExps', () => {
		const actual = k.regexFromPattern(pattern, true)

		expect(actual.source).toEqual(
			"^((((foo){5,9}z+?y+)?.*.*?.*?[^a-z]{3}[0-4A#-'Q-T\\x1f-\\x2d\\x5e-\\x7f\\xff-\\u0100])|(bar){2,})$",
		)
		expect(actual.flags).toEqual('i')
	})
})
