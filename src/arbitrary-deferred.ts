import { match } from '@simspace/matchers'
import type * as FastCheck from 'fast-check'
import * as RA from 'fp-ts/ReadonlyArray'
import { pipe } from 'fp-ts/function'

import { Atom, Pattern, QuantifiedAtom, Term } from './types'

const matchK = match.on('kind').w

/** @internal */
export const arbitraryFromAtom: (
	fc: typeof FastCheck,
) => (atom: Atom) => FastCheck.Arbitrary<string> = (fc) =>
	matchK({
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
		subgroup: ({ subpattern }) => arbitraryFromPattern(fc)(subpattern),
	})

/** @internal */
export const arbitraryFromQuantifiedAtom: (
	fc: typeof FastCheck,
) => (quantifiedAtom: QuantifiedAtom) => FastCheck.Arbitrary<string> = (fc) =>
	matchK({
		star: ({ atom }) =>
			fc.array(arbitraryFromAtom(fc)(atom)).map((strs) => strs.join('')),
		plus: ({ atom }) =>
			fc
				.array(arbitraryFromAtom(fc)(atom), { minLength: 1 })
				.map((strs) => strs.join('')),
		question: ({ atom }) =>
			fc
				.array(arbitraryFromAtom(fc)(atom), {
					minLength: 0,
					maxLength: 1,
				})
				.map((strs) => strs.join('')),
		exactly: ({ atom, count }) =>
			fc
				.array(arbitraryFromAtom(fc)(atom), {
					minLength: count,
					maxLength: count,
				})
				.map((strs) => strs.join('')),
		between: ({ atom, min, max }) =>
			fc
				.array(arbitraryFromAtom(fc)(atom), {
					minLength: min,
					maxLength: max,
				})
				.map((strs) => strs.join('')),
		minimum: ({ atom, min }) =>
			fc
				.array(arbitraryFromAtom(fc)(atom), { minLength: min })
				.map((strs) => strs.join('')),
	})

const arbitraryFromTerm: (
	fc: typeof FastCheck,
) => (term: Term) => FastCheck.Arbitrary<string> = (fc) =>
	match({
		atom: arbitraryFromAtom(fc),
		quantifiedAtom: arbitraryFromQuantifiedAtom(fc),
	})

const chainConcatAll: (
	fc: typeof FastCheck,
) => (
	fcs: ReadonlyArray<FastCheck.Arbitrary<string>>,
) => FastCheck.Arbitrary<string> = (fc) =>
	RA.foldLeft(
		() => fc.constant(''),
		(head, tail) =>
			head.chain((headStr) =>
				chainConcatAll(fc)(tail).map((tailStr) => headStr + tailStr),
			),
	)

/**
 * Construct a `fast-check` `Arbitrary` instance from a given `Pattern`.
 *
 * @since 1.0.0
 */
export const arbitraryFromPattern: (
	fc: typeof FastCheck,
) => (pattern: Pattern) => FastCheck.Arbitrary<string> = (fc) =>
	match({
		atom: arbitraryFromAtom(fc),
		disjunction: ({ left, right }) =>
			fc.oneof(arbitraryFromPattern(fc)(left), arbitraryFromPattern(fc)(right)),
		quantifiedAtom: arbitraryFromQuantifiedAtom(fc),
		termSequence: ({ terms }) =>
			pipe(terms.map(arbitraryFromTerm(fc)), chainConcatAll(fc)),
	})
