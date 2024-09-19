import { andThen, between, char, exactly, maybe, or, subgroup } from '../base'
import { hexDigit } from '../character-classes'
import { Pattern } from '../types'
import { pipe } from '../util/pipe'

/**
 * Matches a hex color, with or without a leading '#'. Matches both short form
 * (3-digit) and long form (6-digit) hex colors, and can also match alpha values
 * (4- or 8-digit).
 */
export const hexColor: Pattern = pipe(
	maybe(char('#')),
	andThen(
		subgroup(
			pipe(
				between(3, 4)(hexDigit),
				or(exactly(6)(hexDigit)),
				or(exactly(8)(hexDigit)),
			),
		),
	),
)
