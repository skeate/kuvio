import { pipe } from '../../src/util/pipe'

describe('pipe', () => {
	it.each([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10])(
		'threads a value through a series of %d functions',
		(n) => {
			const a = 1
			const f = jest.fn((x: number) => x + 1)

			const result = pipe(
				a,
				// @ts-ignore
				...[...Array(n)].map(() => f),
			)

			expect(result).toBe(n + 1)
		},
	)
})
