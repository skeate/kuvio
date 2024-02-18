import {
	and,
	anyNumber,
	char,
	characterClass,
	exactly,
	maybe,
	sequence,
	subgroup,
	then,
} from '../base'
import { alnum } from '../character-classes'
import { oneOf } from '../combinators'
import { Pattern } from '../types'
import { pipe } from '../util/pipe'

export const base64Character = pipe(alnum, and(characterClass(false, '+', '/')))

/**
 * Matches a base64 string, with or without trailing '=' characters. However, if
 * they are present, they must be correct (i.e. pad out the string so its length
 * is a multiple of 4)
 *
 * @since 1.0.0
 * @category Pattern
 */
export const base64: Pattern = pipe(
	base64Character,
	exactly(4),
	subgroup,
	anyNumber(),
	then(
		maybe(
			subgroup(
				oneOf(
					sequence(exactly(2)(base64Character), exactly(2)(char('='))),
					sequence(exactly(3)(base64Character), char('=')),
				),
			),
		),
	),
)
