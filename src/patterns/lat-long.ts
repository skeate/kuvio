import {
	andThen,
	anyNumber,
	atLeastOne,
	char,
	characterClass,
	maybe,
	sequence,
	subgroup,
} from '../base'
import { digit, space } from '../character-classes'
import { integerRange, oneOf } from '../combinators'
import { pipe } from '../util/pipe'

const latPattern = pipe(
	maybe(characterClass(false, '+', '-')),
	andThen(
		subgroup(
			oneOf(
				sequence(
					char('9'),
					char('0'),
					maybe(
						subgroup(
							pipe(char('.'), andThen(atLeastOne({ greedy: true })(char('0')))),
						),
					),
				),
				pipe(
					integerRange(0, 89),
					subgroup,
					andThen(
						maybe(
							subgroup(
								pipe(char('.'), andThen(atLeastOne({ greedy: true })(digit))),
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
	andThen(
		subgroup(
			oneOf(
				sequence(
					char('1'),
					char('8'),
					char('0'),
					maybe(
						subgroup(
							pipe(char('.'), andThen(atLeastOne({ greedy: true })(char('0')))),
						),
					),
				),
				pipe(
					integerRange(0, 179),
					subgroup,
					andThen(
						maybe(
							subgroup(
								pipe(char('.'), andThen(atLeastOne({ greedy: true })(digit))),
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
		andThen(char(',')),
		andThen(anyNumber({ greedy: true })(space)),
		andThen(longPattern),
	),
	pipe(
		char('('),
		andThen(latPattern),
		andThen(char(',')),
		andThen(anyNumber({ greedy: true })(space)),
		andThen(longPattern),
		andThen(char(')')),
	),
)
