import {
	andThen,
	char,
	characterClass,
	empty,
	or,
	sequence,
	subgroup,
} from './base'
import { digit } from './character-classes'
import { Pattern, Term, TermSequence } from './types'
import { pipe } from './util/pipe'

/**
 * Form a disjunction of multiple terms or term sequences.
 *
 * @since 0.0.1
 */
export const oneOf: (
	pattern: Pattern,
	...terms: ReadonlyArray<Term | TermSequence>
) => Pattern = (pattern, ...patterns) =>
	patterns.reduce((ored, next) => pipe(ored, or(next)), pattern)

const integerRange_: (
	min: string,
	max: string,
	omitInitialZeros?: boolean,
) => Pattern = (min, max, omitInitialZeros = false) => {
	const curMinDigit = Number(min[0] ?? '0')
	const restMin = min.slice(1)
	const curMaxDigit = Number(max[0] ?? '9')
	const restMax = max.slice(1)

	const res =
		restMin.length === 0
			? curMinDigit === curMaxDigit
				? char(min)
				: characterClass(false, [min, max])
			: curMinDigit === curMaxDigit
			? pipe(
					char(curMinDigit.toString(10)),
					andThen(subgroup(integerRange_(restMin, restMax))),
			  )
			: oneOf(
					curMinDigit === 0 && omitInitialZeros
						? integerRange_(restMin, restMax.replace(/./g, '9'), true)
						: pipe(
								char(curMinDigit.toString(10)),
								andThen(
									subgroup(integerRange_(restMin, restMin.replace(/./g, '9'))),
								),
						  ),
					...(curMaxDigit - curMinDigit > 1
						? [
								pipe(
									characterClass(false, [
										(curMinDigit + 1).toString(10),
										(curMaxDigit - 1).toString(10),
									]),
									andThen(
										sequence(empty, ...restMin.split('').map(() => digit)),
									),
								),
						  ]
						: []),
					pipe(
						char(curMaxDigit.toString(10)),
						andThen(
							subgroup(integerRange_(restMin.replace(/./g, '0'), restMax)),
						),
					),
			  )

	return res
}

/**
 * Create a pattern that matches integers in a given range. Does not currently handle
 * negatives (it returns an empty pattern if either number is negative)
 *
 * @since 0.0.1
 */
export const integerRange: (min: number, max: number) => Pattern = (
	min,
	max,
) => {
	if (
		min > max ||
		Number.isNaN(min) ||
		Number.isNaN(max) ||
		!Number.isInteger(min) ||
		!Number.isInteger(max) ||
		min < 0 ||
		max < 0
	) {
		return empty
	}

	const maxStr = max.toString(10)
	const minStr = min.toString(10).padStart(maxStr.length, '0')
	return integerRange_(minStr, maxStr, true)
}
