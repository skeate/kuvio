import * as fc from 'fast-check'

import * as k from '../src'

describe('combinators', () => {
	describe('integerRange', () => {
		describe('invalid range', () => {
			const pattern = k.integerRange(Infinity, NaN)
			const actual = k.regexFromPattern(pattern)
			expect(actual.source).toEqual('^()$')
		})
		describe('one digit ranges', () => {
			test('1-9', () => {
				const pattern = k.integerRange(1, 9)
				const actual = k.regexFromPattern(pattern)
				expect(actual.source).toEqual('^([1-9])$')
			})

			test('5-7', () => {
				const pattern = k.integerRange(5, 7)
				const actual = k.regexFromPattern(pattern)
				expect(actual.source).toEqual('^([5-7])$')
			})
		})

		describe('two digit ranges', () => {
			test('10-99', () => {
				const pattern = k.integerRange(10, 99)
				const actual = k.regexFromPattern(pattern)
				expect(actual.source).toEqual('^(1\\d|[2-8]\\d|9\\d)$')
			})

			test('41-74', () => {
				const pattern = k.integerRange(41, 74)
				const actual = k.regexFromPattern(pattern)
				for (let i = 10; i < 100; i++) {
					if (i >= 41 && i <= 74) {
						expect([i.toString(), actual.test(i.toString())]).toEqual([
							i.toString(),
							true,
						])
					} else {
						expect([i.toString(), actual.test(i.toString())]).toEqual([
							i.toString(),
							false,
						])
					}
				}
			})
		})

		describe('three digit ranges', () => {
			test('100-999', () => {
				const pattern = k.integerRange(100, 999)
				const actual = k.regexFromPattern(pattern)
				expect(actual.source).toEqual(
					'^(1(0\\d|[1-8]\\d|9\\d)|[2-8]\\d\\d|9(0\\d|[1-8]\\d|9\\d))$',
				)
			})

			test('421-734', () => {
				const pattern = k.integerRange(421, 734)
				const actual = k.regexFromPattern(pattern)

				for (let i = 100; i < 1000; i++) {
					if (i >= 421 && i <= 734) {
						expect([i.toString(), actual.test(i.toString())]).toEqual([
							i.toString(),
							true,
						])
					} else {
						expect([i.toString(), actual.test(i.toString())]).toEqual([
							i.toString(),
							false,
						])
					}
				}
			})
		})

		describe('mixed digit ranges', () => {
			test('5-226', () => {
				const pattern = k.integerRange(5, 226)
				const actual = k.regexFromPattern(pattern)

				for (let i = 1; i < 500; i++) {
					if (i >= 5 && i <= 226) {
						expect([i.toString(), actual.test(i.toString())]).toEqual([
							i.toString(),
							true,
						])
					} else {
						expect([i.toString(), actual.test(i.toString())]).toEqual([
							i.toString(),
							false,
						])
					}
				}
			})

			test('arbitrary ranges', () => {
				fc.assert(
					fc.property(
						fc.tuple(
							fc.integer({ min: 0, max: 200 }),
							fc.integer({ min: 1, max: 799 }),
							fc.array(fc.integer({ min: 0, max: 1000 }), {
								minLength: 1,
								maxLength: 100,
							}),
						),
						([min, addition, checks]) => {
							const pattern = k.integerRange(min, min + addition)
							const actual = k.regexFromPattern(pattern)
							return checks.every((n) =>
								n >= min && n <= min + addition
									? actual.test(n.toString())
									: !actual.test(n.toString()),
							)
						},
					),
				)
			})
		})
	})
})
