import { match } from '@simspace/matchers'
import * as RA from 'fp-ts/ReadonlyArray'

import {
	Atom,
	Char,
	CharacterClass,
	Disjunction,
	Pattern,
	QuantifiedAtom,
	Term,
	TermSequence,
} from './types'

/**
 * A pattern of a single, specific character
 *
 * @since 0.0.1
 */
export const char: (c: Char) => Atom = (c) => ({
	tag: 'atom',
	kind: 'character',
	char: c,
})

/**
 * A pattern of any single character
 *
 * @since 0.0.1
 */
export const anything: Atom = { tag: 'atom', kind: 'anything' }

const convertRanges: (
	ranges: ReadonlyArray<
		readonly [Char, Char] | Char | readonly [number, number]
	>,
) => CharacterClass['ranges'] = RA.map((range) => {
	if (typeof range === 'string') {
		return { lower: range.charCodeAt(0), upper: range.charCodeAt(0) } as const
	}
	const [c1, c2] = range
	const lower = typeof c1 === 'string' ? c1.charCodeAt(0) : c1
	const upper = typeof c2 === 'string' ? c2.charCodeAt(0) : c2
	return { lower, upper } as const
})

/**
 * A pattern of a single character that matches a list of characters or ranges. The ranges
 * can either be charcter to character (e.g. `['A', 'Z']`) or number to number (e.g.
 * `[0x3040, 0x309F]` which matches the Hiragana range in Unicode.)
 *
 * If the first argument (`exclude`) is true, then the pattern is a single character that
 * is _not_ in the given ranges.
 *
 * @since 0.0.1
 */
export const characterClass: (
	exclude: boolean,
	...ranges: ReadonlyArray<
		readonly [Char, Char] | Char | readonly [number, number]
	>
) => CharacterClass = (exclude, ...ranges) => ({
	tag: 'atom',
	kind: 'characterClass',
	exclude,
	ranges: convertRanges(ranges),
})

/**
 * Turn a `Pattern` into an `Atom`. In regular expression terms, this is wrapping the
 * pattern in parentheses.
 *
 * @since 0.0.1
 */
export const subgroup: (subpattern: Pattern) => Atom = (subpattern) =>
	subpattern.tag === 'atom'
		? subpattern
		: {
				tag: 'atom',
				kind: 'subgroup',
				subpattern,
		  }

/**
 * Repeat an `Atom` any number of times (including zero).
 *
 * @since 0.0.1
 */
export const anyNumber: (opts?: {
	greedy: boolean
}) => (atom: Atom) => QuantifiedAtom =
	(opts = { greedy: false }) =>
	(atom) => ({
		tag: 'quantifiedAtom',
		atom,
		greedy: opts.greedy,
		kind: 'star',
	})

/**
 * Repeat an `Atom` any number of times, but at least once.
 *
 * @since 0.0.1
 */
export const atLeastOne: (opts?: {
	greedy: boolean
}) => (atom: Atom) => QuantifiedAtom =
	(opts = { greedy: false }) =>
	(atom) => ({
		tag: 'quantifiedAtom',
		atom,
		greedy: opts.greedy,
		kind: 'plus',
	})

/**
 * Make an `Atom` optional -- it can occur in the pattern once or not at all.
 *
 * @since 0.0.1
 */
export const maybe: (atom: Atom) => QuantifiedAtom = (atom) => ({
	tag: 'quantifiedAtom',
	atom,
	greedy: false,
	kind: 'question',
})

/**
 * Repeat an `Atom` an exact number of times. (Aliased to `exactly` for better readability
 * in some situations)
 *
 * @since 0.0.1
 */
export const times: (count: number) => (atom: Atom) => QuantifiedAtom =
	(count) => (atom) => ({
		tag: 'quantifiedAtom',
		atom,
		greedy: true,
		kind: 'exactly',
		count,
	})

/**
 * Alias of `times`
 *
 * @since 0.0.1
 */
export const exactly: (count: number) => (atom: Atom) => QuantifiedAtom = times

/**
 * Repeat an `Atom` at least some number of times. For example, `atLeast(3)(char('a'))`
 * represents `aaa`, `aaaaaa`, and `aaaaaaaaaaaaaaaaaaaaaaaa` but not `aa`
 *
 * @since 0.0.1
 */
export const atLeast: (min: number) => (atom: Atom) => QuantifiedAtom =
	(min) => (atom) => ({
		tag: 'quantifiedAtom',
		atom,
		kind: 'minimum',
		min,
	})

/**
 * Repeat an `Atom` some number of times in the given range, inclusive.
 *
 * @since 0.0.1
 */
export const between: (
	min: number,
	max: number,
) => (atom: Atom) => QuantifiedAtom = (min, max) => (atom) => ({
	tag: 'quantifiedAtom',
	atom,
	greedy: true,
	kind: 'between',
	min,
	max,
})

/**
 * Repeat an `Atom` at most some number of times. For example, `atMost(3)(char('a'))`
 * represents ``, `a`, and `aaa` but not `aaaa`
 *
 * @since 1.1.0
 */
export const atMost: (min: number) => (atom: Atom) => QuantifiedAtom =
	(max) => (atom) => ({
		tag: 'quantifiedAtom',
		atom,
		kind: 'between',
		min: 0,
		max,
	})

/**
 * Create a disjunction of two patterns. In regular expression terms, this corresponds to `|`.
 *
 * @since 0.0.1
 */
export const or: (
	right: TermSequence | Atom | QuantifiedAtom,
) => (left: Pattern) => Disjunction = (right) => (left) => ({
	tag: 'disjunction',
	left,
	right,
})

const getTerms: (termOrSeq: Term | TermSequence) => TermSequence['terms'] =
	match.w({
		termSequence: ({ terms }) => terms,
		atom: (atom) => [atom],
		quantifiedAtom: (qatom) => [qatom],
	})

/**
 * Append a term or term sequence onto another.
 *
 * @since 0.0.1
 */
export const then: (
	term: Term | TermSequence,
) => (alt: TermSequence | Term) => TermSequence = (term) => (alt) => ({
	tag: 'termSequence',
	terms: [...getTerms(alt), ...getTerms(term)],
})

/**
 * Construct an `Atom` for a specific string.
 *
 * @since 0.0.1
 */
export const exactString: (s: string) => Atom = (s) =>
	subgroup({
		tag: 'termSequence',
		terms: s.split('').map(char),
	})

/**
 * Concatenate `Term`s
 *
 * @since 0.0.1
 */
export const sequence: (
	term: Term,
	...terms: ReadonlyArray<Term>
) => TermSequence = (term, ...terms) => ({
	tag: 'termSequence',
	terms: [term, ...terms],
})

/**
 * Modify a character class with more ranges, or combine two character classes together.
 *
 * @since 0.0.1
 */
export const and: {
	(
		...ranges: ReadonlyArray<
			readonly [Char, Char] | Char | readonly [number, number]
		>
	): (cc: CharacterClass) => CharacterClass
	(ccb: CharacterClass): (cca: CharacterClass) => CharacterClass
} =
	(
		first,
		...addl: ReadonlyArray<
			readonly [Char, Char] | Char | readonly [number, number]
		>
	) =>
	(cc) => ({
		tag: 'atom',
		kind: 'characterClass',
		exclude: cc.exclude,
		ranges: cc.ranges.concat(
			typeof first === 'string' || first instanceof Array
				? convertRanges([first, ...addl])
				: first.ranges,
		),
	})

/**
 * Invert a character class
 *
 * @since 0.0.1
 */
export const non: (cc: CharacterClass) => CharacterClass = (cc) => ({
	...cc,
	exclude: !cc.exclude,
})

/**
 * An empty pattern.
 *
 * @since 0.0.1
 */
export const empty: Atom = { tag: 'atom', kind: 'character', char: '' }
