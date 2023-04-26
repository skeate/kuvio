import { pipe } from 'fp-ts/function'

import {
	and,
	anyNumber,
	atLeast,
	atLeastOne,
	atMost,
	between,
	char,
	characterClass,
	or,
	sequence,
	subgroup,
	then,
} from '../base'
import { alnum, alpha, digit } from '../character-classes'
import { Pattern } from '../types'

// (".+")
const localPartQuoted = pipe(
	char('"'),
	then(atLeastOne({ greedy: true })(characterClass(true, '"', [0, 0x1f]))),
	then(char('"')),
)

const localPartUnquotedAllowedCharacters = characterClass(
	false,
	['A', 'Z'],
	['a', 'z'],
	['0', '9'],
	'!',
	'#',
	'$',
	'%',
	'&',
	"'",
	'*',
	'+',
	'-',
	'/',
	'=',
	'?',
	'^',
	'_',
	'`',
	'{',
	'|',
	'}',
	'~',
)

// [^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*
const localPartUnquoted = pipe(
	atLeastOne({ greedy: true })(localPartUnquotedAllowedCharacters),
	then(
		pipe(
			char('.'),
			then(atLeastOne({ greedy: true })(localPartUnquotedAllowedCharacters)),
			subgroup,
			anyNumber({ greedy: true }),
		),
	),
)
const localPart = pipe(localPartUnquoted, or(localPartQuoted), subgroup)

const ipAddressByte = between(1, 3)(digit)

// \[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}]
const domainIpAddress = pipe(
	sequence(
		char('['),
		ipAddressByte,
		char('.'),
		ipAddressByte,
		char('.'),
		ipAddressByte,
		char('.'),
		ipAddressByte,
		char(']'),
	),
)

// ([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}
const domainName = pipe(
	alnum,
	and('-'),
	atMost(63),
	then(char('.')),
	subgroup,
	atLeastOne({ greedy: true }),
	then(atLeast(2)(alpha)),
)

const domain = pipe(domainIpAddress, or(domainName), subgroup)

/**
 * @since 1.1.0
 * @category Pattern
 */
export const emailAddress: Pattern = pipe(
	localPart,
	then(char('@')),
	then(domain),
)
