import fc from 'fast-check'

import { type Pattern, regexFromPattern } from '../../src'
import { arbitraryFromPattern } from '../../src/arbitrary'

type TestPatternConfig = {
	name: string
	pattern: Pattern
	caseInsensitive?: boolean
	validCases: ReadonlyArray<string>
	invalidCases: ReadonlyArray<string>
}

export const testPattern = ({
	name,
	pattern,
	caseInsensitive = false,
	validCases,
	invalidCases,
}: TestPatternConfig) => {
	describe(name, () => {
		const regex = regexFromPattern(pattern, caseInsensitive)

		test.each(validCases)('valid: %s', (c) => {
			expect(regex.test(c)).toBe(true)
		})

		test.each(invalidCases)('invalid: %s', (c) => {
			expect(regex.test(c)).toBe(false)
		})

		test('arbitrary matches regex', () => {
			fc.assert(
				fc.property(arbitraryFromPattern(pattern), (s) => regex.test(s)),
			)
		})
	})
}
