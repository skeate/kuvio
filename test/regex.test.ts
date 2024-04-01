import * as k from '../src'

describe('kuvio', () => {
	const pattern: k.Pattern = k.pipe(
		k.exactString('foo'),
		k.between(5, 9),
		k.then(k.atLeastOne()(k.char('z'))),
		k.then(k.atLeastOne({ greedy: true })(k.char('y'))),
		k.subgroup,
		k.maybe,
		k.then(
			k.sequence(
				k.pipe(k.anything, k.anyNumber({ greedy: true })),
				k.pipe(k.anything, k.anyNumber({ greedy: false })),
				k.pipe(k.anything, k.anyNumber()),
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

	const testPattern =
		"(((foo){5,9}z+?y+)?.*.*?.*?[^a-z]{3}[0-4A#-'Q-T\\x1f-\\x2d\\x5e-\\x7f\\xff-\\u0100])|(bar){2,}"

	it('can create RegExps', () => {
		const actual = k.regexFromPattern(pattern)

		expect(actual.source).toEqual(`^(${testPattern})$`)
		expect(actual.flags).toEqual('')
	})

	it('can create case-insensitive RegExps', () => {
		const actual = k.regexFromPattern(pattern, true)

		expect(actual.source).toEqual(`^(${testPattern})$`)
		expect(actual.flags).toEqual('i')
	})

	it('can create global RegExps', () => {
		const actual = k.regexFromPattern(pattern, false, true)

		expect(actual.source).toEqual(testPattern)
		expect(actual.flags).toEqual('g')
	})

	it('can create multiline RegExps', () => {
		const actual = k.regexFromPattern(pattern, false, false, true)

		expect(actual.source).toEqual(`^(${testPattern})$`)
		expect(actual.flags).toEqual('m')
	})
})
