import { pipe } from 'fp-ts/function'

import { char, maybe, sequence, subgroup, then } from '../base'
import { Pattern } from '../types'
import { base64Url } from './base64url'

/**
 * Matches a [JSON Web Token](https://datatracker.ietf.org/doc/html/rfc7519).
 */
export const jwt: Pattern = sequence(
	subgroup(base64Url),
	char('.'),
	subgroup(base64Url),
	pipe(char('.'), then(subgroup(base64Url)), subgroup, maybe),
)
