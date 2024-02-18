import { and, anyNumber } from '../base'
import { word } from '../character-classes'
import { Pattern } from '../types'
import { pipe } from '../util/pipe'

/**
 * Matches any
 * [base64url](https://datatracker.ietf.org/doc/html/rfc4648#section-5) string.
 *
 * @since 1.0.0
 * @category Pattern
 */
export const base64Url: Pattern = pipe(
	word,
	and('-'),
	anyNumber({ greedy: true }),
)
