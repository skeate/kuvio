import * as fc from 'fast-check'

import { Atom, Pattern, QuantifiedAtom, Term } from './types'

/** @internal */
export const arbitraryFromAtom: (atom: Atom) => fc.Arbitrary<string> = (
	atom,
) => {
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
			return arbitraryFromPattern(atom.subpattern)
	}
}

/** @internal */
export const arbitraryFromQuantifiedAtom: (
	quantifiedAtom: QuantifiedAtom,
) => fc.Arbitrary<string> = (quantifiedAtom) => {
	switch (quantifiedAtom.kind) {
		case 'star':
			return fc
				.array(arbitraryFromAtom(quantifiedAtom.atom))
				.map((strs) => strs.join(''))
		case 'plus':
			return fc
				.array(arbitraryFromAtom(quantifiedAtom.atom), { minLength: 1 })
				.map((strs) => strs.join(''))
		case 'question':
			return fc
				.array(arbitraryFromAtom(quantifiedAtom.atom), {
					minLength: 0,
					maxLength: 1,
				})
				.map((strs) => strs.join(''))
		case 'exactly':
			return fc
				.array(arbitraryFromAtom(quantifiedAtom.atom), {
					minLength: quantifiedAtom.count,
					maxLength: quantifiedAtom.count,
				})
				.map((strs) => strs.join(''))
		case 'between':
			return fc
				.array(arbitraryFromAtom(quantifiedAtom.atom), {
					minLength: quantifiedAtom.min,
					maxLength: quantifiedAtom.max,
				})
				.map((strs) => strs.join(''))
		case 'minimum':
			return fc
				.array(arbitraryFromAtom(quantifiedAtom.atom), {
					minLength: quantifiedAtom.min,
				})
				.map((strs) => strs.join(''))
	}
}

const arbitraryFromTerm: (term: Term) => fc.Arbitrary<string> = (term) => {
	switch (term.tag) {
		case 'atom':
			return arbitraryFromAtom(term)
		case 'quantifiedAtom':
			return arbitraryFromQuantifiedAtom(term)
	}
}

const chainConcatAll: (
	fcs: ReadonlyArray<fc.Arbitrary<string>>,
) => fc.Arbitrary<string> = (fcs) =>
	fcs.length === 0
		? fc.constant('')
		: fcs[0].chain((headStr) =>
				chainConcatAll(fcs.slice(1)).map((tailStr) => headStr + tailStr),
		  )

/**
 * Construct a `fast-check` `Arbitrary` instance from a given `Pattern`.
 *
 * @since 1.0.0
 */
export const arbitraryFromPattern: (
	pattern: Pattern,
) => fc.Arbitrary<string> = (pattern) => {
	switch (pattern.tag) {
		case 'atom':
			return arbitraryFromAtom(pattern)
		case 'disjunction':
			return fc.oneof(
				arbitraryFromPattern(pattern.left),
				arbitraryFromPattern(pattern.right),
			)
		case 'quantifiedAtom':
			return arbitraryFromQuantifiedAtom(pattern)
		case 'termSequence':
			return chainConcatAll(pattern.terms.map(arbitraryFromTerm))
	}
}
