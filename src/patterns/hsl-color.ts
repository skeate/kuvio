import { pipe } from 'fp-ts/function'

import {
	anyNumber,
	atLeastOne,
	char,
	exactString,
	maybe,
	sequence,
	subgroup,
	then,
} from '../base'
import { blank, digit } from '../character-classes'
import { integerRange, oneOf } from '../combinators'

const anyDecimal = subgroup(
	sequence(char('.'), atLeastOne({ greedy: true })(digit)),
)

const zeroDecimal = subgroup(
	sequence(char('.'), atLeastOne({ greedy: true })(char('0'))),
)

const exponential = subgroup(
	sequence(
		char('e'),
		maybe(subgroup(oneOf(char('+'), char('-')))),
		atLeastOne({ greedy: true })(digit),
	),
)

const hue = subgroup(
	sequence(
		maybe(subgroup(oneOf(char('+'), char('-')))),
		subgroup(
			oneOf(
				pipe(atLeastOne({ greedy: true })(digit), then(maybe(anyDecimal))),
				anyDecimal,
			),
		),
		maybe(exponential),
		maybe(
			subgroup(
				oneOf(
					exactString('deg'),
					exactString('grad'),
					exactString('rad'),
					exactString('turn'),
				),
			),
		),
	),
)

const percentage = subgroup(
	sequence(
		maybe(char('+')),
		anyNumber({ greedy: true })(char('0')),
		subgroup(
			oneOf(
				pipe(exactString('100'), then(maybe(zeroDecimal))),
				pipe(subgroup(integerRange(0, 99)), then(maybe(anyDecimal))),
				anyDecimal,
			),
		),
		maybe(exponential),
		char('%'),
	),
)

const alpha = subgroup(
	sequence(
		anyNumber({ greedy: true })(digit),
		subgroup(oneOf(digit, anyDecimal)),
		maybe(exponential),
		maybe(char('%')),
	),
)

const anySpace = anyNumber({ greedy: true })(blank)

const commaDelimiter = subgroup(sequence(anySpace, char(','), anySpace))

const slashDelimiter = subgroup(sequence(anySpace, char('/'), anySpace))

/**
 * Matches an HSL color in the format `hsl(0, 0%, 0%)`.
 *
 * @since 1.0.0
 * @category Pattern
 */
export const hslColor = sequence(
	exactString('hsl'),
	maybe(char('a')),
	char('('),
	anySpace,
	hue,
	subgroup(
		oneOf(
			sequence(
				commaDelimiter,
				percentage,
				commaDelimiter,
				percentage,
				maybe(subgroup(sequence(commaDelimiter, alpha))),
			),
			sequence(
				anySpace,
				percentage,
				anySpace,
				percentage,
				maybe(subgroup(sequence(slashDelimiter, alpha))),
			),
		),
	),
	anySpace,
	char(')'),
)
