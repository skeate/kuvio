import { atLeastOne, exactString, maybe, or, subgroup, then } from '../base'
import { xdigit } from '../character-classes'
import { Pattern } from '../types'
import { pipe } from '../util/pipe'

/**
 * Matches a hexadecimal number, with or without a leading '0x' or '0h', in any
 * combination of upper or lower case.
 *
 * @since 1.0.0
 * @category Pattern
 */
export const hexadecimal: Pattern = pipe(
	exactString('0x'),
	or(exactString('0X')),
	or(exactString('0h')),
	or(exactString('0H')),
	subgroup,
	maybe,
	then(atLeastOne()(xdigit)),
)
