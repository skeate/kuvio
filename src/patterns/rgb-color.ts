import {
	atLeastOne,
	char,
	exactString,
	maybe,
	sequence,
	subgroup,
} from '../base'
import { digit } from '../character-classes'
import { integerRange, oneOf } from '../combinators'

/**
 * Matches an RGB color in the format `rgb(0, 0, 0)`.
 */
export const rgbColorDecimal = sequence(
	exactString('rgb('),
	subgroup(integerRange(0, 255)),
	char(','),
	subgroup(integerRange(0, 255)),
	char(','),
	subgroup(integerRange(0, 255)),
	char(')'),
)

/**
 * Matches an RGBA color in the format `rgba(0, 0, 0, 0)`.
 */
export const rgbColorWithAlphaDecimal = sequence(
	exactString('rgba('),
	subgroup(integerRange(0, 255)),
	char(','),
	subgroup(integerRange(0, 255)),
	char(','),
	subgroup(integerRange(0, 255)),
	char(','),
	subgroup(
		oneOf(
			char('0'),
			char('1'),
			exactString('1.0'),
			sequence(
				maybe(char('0')),
				char('.'),
				atLeastOne({ greedy: true })(digit),
			),
		),
	),
	char(')'),
)

/**
 * Matches an RGB color in the format `rgb(0%, 0%, 0%)`.
 */
export const rgbColorPercent = sequence(
	exactString('rgb('),
	subgroup(integerRange(0, 100)),
	exactString('%,'),
	subgroup(integerRange(0, 100)),
	exactString('%,'),
	subgroup(integerRange(0, 100)),
	exactString('%)'),
)

/**
 * Matches an RGBA color in the format `rgba(0%, 0%, 0%, 0)`.
 */
export const rgbColorWithAlphaPercent = sequence(
	exactString('rgba('),
	subgroup(integerRange(0, 100)),
	exactString('%,'),
	subgroup(integerRange(0, 100)),
	exactString('%,'),
	subgroup(integerRange(0, 100)),
	exactString('%,'),
	subgroup(
		oneOf(
			char('0'),
			char('1'),
			exactString('1.0'),
			sequence(
				maybe(char('0')),
				char('.'),
				atLeastOne({ greedy: true })(digit),
			),
		),
	),
	char(')'),
)

/**
 * Matches an RGB color in any of the following formats:
 * - `rgb(0, 0, 0)`
 * - `rgba(0, 0, 0, 0)`
 * - `rgb(0%, 0%, 0%)`
 * - `rgba(0%, 0%, 0%, 0)`
 *
 * @since 1.1.0
 * @category Pattern
 */
export const rgbColor = oneOf(
	rgbColorDecimal,
	rgbColorWithAlphaDecimal,
	rgbColorPercent,
	rgbColorWithAlphaPercent,
)
