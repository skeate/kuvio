import {
	anyNumber,
	atLeastOne,
	char,
	characterClass,
	maybe,
	sequence,
	subgroup,
	then,
} from '../base'
import { digit, space } from '../character-classes'
import { integerRange, oneOf } from '../combinators'
import { pipe } from '../util/pipe'

const latPattern = pipe(
	maybe(characterClass(false, '+', '-')),
	then(
		subgroup(
			oneOf(
				sequence(
					char('9'),
					char('0'),
					maybe(
						subgroup(
							pipe(char('.'), then(atLeastOne({ greedy: true })(char('0')))),
						),
					),
				),
				pipe(
					integerRange(0, 89),
					subgroup,
					then(
						maybe(
							subgroup(
								pipe(char('.'), then(atLeastOne({ greedy: true })(digit))),
							),
						),
					),
				),
			),
		),
	),
)

const longPattern = pipe(
	maybe(characterClass(false, '+', '-')),
	then(
		subgroup(
			oneOf(
				sequence(
					char('1'),
					char('8'),
					char('0'),
					maybe(
						subgroup(
							pipe(char('.'), then(atLeastOne({ greedy: true })(char('0')))),
						),
					),
				),
				pipe(
					integerRange(0, 179),
					subgroup,
					then(
						maybe(
							subgroup(
								pipe(char('.'), then(atLeastOne({ greedy: true })(digit))),
							),
						),
					),
				),
			),
		),
	),
)

/**
 * @since 1.0.0
 * @category Pattern
 */
export const latLong = oneOf(
	pipe(
		latPattern,
		then(char(',')),
		then(anyNumber({ greedy: true })(space)),
		then(longPattern),
	),
	pipe(
		char('('),
		then(latPattern),
		then(char(',')),
		then(anyNumber({ greedy: true })(space)),
		then(longPattern),
		then(char(')')),
	),
)
