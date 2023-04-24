import { match } from '@simspace/matchers'
import { Atom, Pattern, QuantifiedAtom, Term } from './types'
import { pipe } from 'fp-ts/function'
import * as O from 'fp-ts/Option'
import * as RNEA from 'fp-ts/ReadonlyNonEmptyArray'

const matchK = match.on('kind').w

const repr = (n: number): string =>
	// < 32 -> control characters
	// 45 -> '-'.. seems like `/[--z]/` for example actually works, but looks weird.
	// 93 -> ']' which needs to be escaped
	// 94 -> '^' which might get parsed as class exclusion marker, so escape just in case
	// 127 -> del
	// >127 -> outside normal ascii range. escape 'em
	n < 32 || n === 45 || n === 93 || n === 94 || n >= 127
		? n > 255
			? `\\u${n.toString(16).padStart(4, '0')}`
			: `\\x${n.toString(16).padStart(2, '0')}`
		: String.fromCharCode(n)

const regexStringFromAtom: (atom: Atom) => string = matchK({
	anything: () => '.',
	character: ({ char }) =>
		char === '['
			? '\\['
			: char === ']'
			? '\\]'
			: char === '.'
			? '\\.'
			: char === '('
			? '\\('
			: char === ')'
			? '\\)'
			: char === '+'
			? '\\+'
			: char,
	characterClass: ({ exclude, ranges }) =>
		pipe(
			RNEA.fromReadonlyArray(ranges),
			O.chain(O.fromPredicate((s) => s.length === 1)),
			O.chain(([{ lower, upper }]) =>
				lower === 48 && upper === 57 ? O.some('\\d') : O.none,
			),
			O.getOrElse(
				() =>
					`[${exclude ? '^' : ''}${ranges
						.map(({ lower, upper }) =>
							lower === upper ? repr(lower) : `${repr(lower)}-${repr(upper)}`,
						)
						.join('')}]`,
			),
		),
	subgroup: ({ subpattern }) => `(${regexStringFromPattern(subpattern)})`,
})

const regexStringFromQuantifiedAtom: (
	quantifiedAtom: QuantifiedAtom,
) => string = matchK({
	star: ({ atom, greedy }) =>
		`${regexStringFromAtom(atom)}*${greedy ? '' : '?'}`,
	plus: ({ atom, greedy }) =>
		`${regexStringFromAtom(atom)}+${greedy ? '' : '?'}`,
	question: ({ atom }) => `${regexStringFromAtom(atom)}?`,
	exactly: ({ atom, count }) => `${regexStringFromAtom(atom)}{${count}}`,
	between: ({ atom, min, max }) =>
		`${regexStringFromAtom(atom)}{${min},${max}}`,
	minimum: ({ atom, min }) => `${regexStringFromAtom(atom)}{${min},}`,
})

const regexStringFromTerm: (term: Term) => string = match.w({
	atom: regexStringFromAtom,
	quantifiedAtom: regexStringFromQuantifiedAtom,
})

const regexStringFromPattern: (pattern: Pattern) => string = match.w({
	atom: regexStringFromAtom,
	disjunction: ({ left, right }) =>
		`${regexStringFromPattern(left)}|${regexStringFromPattern(right)}`,
	quantifiedAtom: regexStringFromQuantifiedAtom,
	termSequence: ({ terms }) => terms.map(regexStringFromTerm).join(''),
})

/**
 * Construct a regular expression (`RegExp`) from a given `Pattern`.
 *
 * @since 1.0.0
 */
export const regexFromPattern = (
	pattern: Pattern,
	caseInsensitive = false,
): RegExp =>
	new RegExp(
		`^(${regexStringFromPattern(pattern)})$`,
		caseInsensitive ? 'i' : '',
	)
