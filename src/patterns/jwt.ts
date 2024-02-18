import { char, maybe, sequence, subgroup } from '../base'
import { Pattern } from '../types'
import { base64Url } from './base64url'

/**
 * Matches a [JSON Web Token](https://datatracker.ietf.org/doc/html/rfc7519).
 */
export const jwt: Pattern = sequence(
	subgroup(base64Url),
	char('.'),
	subgroup(base64Url),
	maybe(subgroup(sequence(char('.'), subgroup(base64Url)))),
)
