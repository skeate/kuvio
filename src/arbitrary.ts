import { match } from '@simspace/matchers'
import * as fc from 'fast-check'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'

import { Atom, Pattern, QuantifiedAtom, Term } from './types'

const matchK = match.on('kind').w

/** @internal */
export const arbitraryFromAtom: (atom: Atom) => fc.Arbitrary<string> = matchK({
	anything: () => fc.char(),
	character: ({ char }) => fc.constant(char),
	characterClass: ({ exclude, ranges }) =>
		(exclude
			? fc
					.integer({ min: 1, max: 0xffff })
					.filter((i) =>
						ranges.every(({ lower, upper }) => i > upper || i < lower),
					)
			: fc.oneof(
					...ranges.map(({ lower, upper }) =>
						fc.integer({ min: lower, max: upper }),
					),
			  )
		).map((charCode) => String.fromCharCode(charCode)),
	subgroup: ({ subpattern }) => arbitraryFromPattern(subpattern),
})

/** @internal */
export const arbitraryFromQuantifiedAtom: (
	quantifiedAtom: QuantifiedAtom,
) => fc.Arbitrary<string> = matchK({
	star: ({ atom }) =>
		fc.array(arbitraryFromAtom(atom)).map((strs) => strs.join('')),
	plus: ({ atom }) =>
		fc
			.array(arbitraryFromAtom(atom), { minLength: 1 })
			.map((strs) => strs.join('')),
	question: ({ atom }) =>
		fc
			.array(arbitraryFromAtom(atom), {
				minLength: 0,
				maxLength: 1,
			})
			.map((strs) => strs.join('')),
	exactly: ({ atom, count }) =>
		fc
			.array(arbitraryFromAtom(atom), {
				minLength: count,
				maxLength: count,
			})
			.map((strs) => strs.join('')),
	between: ({ atom, min, max }) =>
		fc
			.array(arbitraryFromAtom(atom), {
				minLength: min,
				maxLength: max,
			})
			.map((strs) => strs.join('')),
	minimum: ({ atom, min }) =>
		fc
			.array(arbitraryFromAtom(atom), { minLength: min })
			.map((strs) => strs.join('')),
})

const arbitraryFromTerm: (term: Term) => fc.Arbitrary<string> = match({
	atom: arbitraryFromAtom,
	quantifiedAtom: arbitraryFromQuantifiedAtom,
})

const chainConcatAll: (
	fcs: ReadonlyArray<fc.Arbitrary<string>>,
) => fc.Arbitrary<string> = RA.foldLeft(
	() => fc.constant(''),
	(head, tail) =>
		head.chain((headStr) =>
			chainConcatAll(tail).map((tailStr) => headStr + tailStr),
		),
)

/**
 * Construct a `fast-check` `Arbitrary` instance from a given `Pattern`.
 *
 * @since 1.0.0
 */
export const arbitraryFromPattern: (pattern: Pattern) => fc.Arbitrary<string> =
	match({
		atom: arbitraryFromAtom,
		disjunction: ({ left, right }) =>
			fc.oneof(arbitraryFromPattern(left), arbitraryFromPattern(right)),
		quantifiedAtom: arbitraryFromQuantifiedAtom,
		termSequence: ({ terms }) =>
			pipe(terms.map(arbitraryFromTerm), chainConcatAll),
	})
