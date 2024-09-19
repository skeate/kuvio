import {
	and,
	andThen,
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
} from '../base'
import { alnum, alpha, digit } from '../character-classes'
import { Pattern } from '../types'
import { pipe } from '../util/pipe'

// (".+")
const localPartQuoted = pipe(
	char('"'),
	andThen(atLeastOne({ greedy: true })(characterClass(true, '"', [0, 0x1f]))),
	andThen(char('"')),
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
	andThen(
		pipe(
			char('.'),
			andThen(atLeastOne({ greedy: true })(localPartUnquotedAllowedCharacters)),
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
	andThen(char('.')),
	subgroup,
	atLeastOne({ greedy: true }),
	andThen(atLeast(2)(alpha)),
)

const domain = pipe(domainIpAddress, or(domainName), subgroup)

/**
 * @since 1.1.0
 * @category Pattern
 */
export const emailAddress: Pattern = pipe(
	localPart,
	andThen(char('@')),
	andThen(domain),
)
