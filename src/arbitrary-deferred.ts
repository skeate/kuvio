import type * as FastCheck from 'fast-check'

import { Atom, Pattern, QuantifiedAtom, Term } from './types'
import { pipe } from './util/pipe'

/** @internal */
export const arbitraryFromAtom: (
	fc: typeof FastCheck,
) => (atom: Atom) => FastCheck.Arbitrary<string> = (fc) => (atom) => {
	switch (atom.kind) {
		case 'anything':
			return fc.char()
		case 'character':
			return fc.constant(atom.char)
		case 'characterClass':
			return (
				atom.exclude
					? fc
							.integer({ min: 1, max: 0xffff })
							.filter((i) =>
								atom.ranges.every(({ lower, upper }) => i > upper || i < lower),
							)
					: fc.oneof(
							...atom.ranges.map(({ lower, upper }) =>
								fc.integer({ min: lower, max: upper }),
							),
					  )
			).map((charCode) => String.fromCharCode(charCode))
		case 'subgroup':
			return arbitraryFromPattern(fc)(atom.subpattern)
	}
}

/** @internal */
export const arbitraryFromQuantifiedAtom: (
	fc: typeof FastCheck,
) => (quantifiedAtom: QuantifiedAtom) => FastCheck.Arbitrary<string> =
	(fc) => (quantifiedAtom) => {
		switch (quantifiedAtom.kind) {
			case 'star':
				return fc
					.array(arbitraryFromAtom(fc)(quantifiedAtom.atom))
					.map((strs) => strs.join(''))
			case 'plus':
				return fc
					.array(arbitraryFromAtom(fc)(quantifiedAtom.atom), { minLength: 1 })
					.map((strs) => strs.join(''))
			case 'question':
				return fc
					.array(arbitraryFromAtom(fc)(quantifiedAtom.atom), {
						minLength: 0,
						maxLength: 1,
					})
					.map((strs) => strs.join(''))
			case 'exactly':
				return fc
					.array(arbitraryFromAtom(fc)(quantifiedAtom.atom), {
						minLength: quantifiedAtom.count,
						maxLength: quantifiedAtom.count,
					})
					.map((strs) => strs.join(''))
			case 'between':
				return fc
					.array(arbitraryFromAtom(fc)(quantifiedAtom.atom), {
						minLength: quantifiedAtom.min,
						maxLength: quantifiedAtom.max,
					})
					.map((strs) => strs.join(''))
			case 'minimum':
				return fc
					.array(arbitraryFromAtom(fc)(quantifiedAtom.atom), {
						minLength: quantifiedAtom.min,
					})
					.map((strs) => strs.join(''))
		}
	}

const arbitraryFromTerm: (
	fc: typeof FastCheck,
) => (term: Term) => FastCheck.Arbitrary<string> = (fc) => (term) => {
	switch (term.tag) {
		case 'atom':
			return arbitraryFromAtom(fc)(term)
		case 'quantifiedAtom':
			return arbitraryFromQuantifiedAtom(fc)(term)
	}
}

const chainConcatAll: (
	fc: typeof FastCheck,
) => (
	fcs: ReadonlyArray<FastCheck.Arbitrary<string>>,
) => FastCheck.Arbitrary<string> = (fc) => (fcs) =>
	fcs.length === 0
		? fc.constant('')
		: fcs[0].chain((headStr) =>
				chainConcatAll(fc)(fcs.slice(1)).map((tailStr) => headStr + tailStr),
		  )

/**
 * Construct a `fast-check` `Arbitrary` instance from a given `Pattern`.
 *
 * @since 1.0.0
 */
export const arbitraryFromPattern: (
	fc: typeof FastCheck,
) => (pattern: Pattern) => FastCheck.Arbitrary<string> = (fc) => (pattern) => {
	switch (pattern.tag) {
		case 'atom':
			return arbitraryFromAtom(fc)(pattern)
		case 'disjunction':
			return fc.oneof(
				arbitraryFromPattern(fc)(pattern.left),
				arbitraryFromPattern(fc)(pattern.right),
			)
		case 'quantifiedAtom':
			return arbitraryFromQuantifiedAtom(fc)(pattern)
		case 'termSequence':
			return pipe(pattern.terms.map(arbitraryFromTerm(fc)), chainConcatAll(fc))
	}
}
