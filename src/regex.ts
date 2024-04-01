import { Atom, Pattern, QuantifiedAtom, Term } from './types'

const repr = (n: number): string =>
	// < 32 -> control characters
	// 45 -> '-'.. seems like `/[--z]/` for example actually works, but looks
	// weird.
	// 47 -> '/' doesn't need to be escaped in JS, but it's helpful for copying
	// into regex debuggers since it must be escaped in some languages
	// 92 -> '\' just to avoid any issues with escaping
	// 93 -> ']' which needs to be escaped
	// 94 -> '^' which might get parsed as class exclusion marker, so escape just in case
	// 127 -> del
	// >127 -> outside normal ascii range. escape 'em
	n < 32 || n === 45 || n === 47 || n === 92 || n === 93 || n === 94 || n >= 127
		? n > 255
			? `\\u${n.toString(16).padStart(4, '0')}`
			: `\\x${n.toString(16).padStart(2, '0')}`
		: String.fromCharCode(n)

const charEscapes = new Map<string, string>([
	['[', '\\['],
	[']', '\\]'],
	['.', '\\.'],
	['(', '\\('],
	[')', '\\)'],
	['+', '\\+'],
])

const regexStringFromAtom: (atom: Atom) => string = (atom) => {
	switch (atom.kind) {
		case 'anything':
			return '.'
		case 'character':
			return charEscapes.get(atom.char) ?? atom.char
		case 'characterClass': {
			const { exclude, ranges } = atom
			return ranges.length === 1 &&
				ranges[0].lower === 48 &&
				ranges[0].upper === 57
				? `\\d`
				: `[${exclude ? '^' : ''}${ranges
						.map(({ lower, upper }) =>
							lower === upper ? repr(lower) : `${repr(lower)}-${repr(upper)}`,
						)
						.join('')}]`
		}
		case 'subgroup':
			return `(${regexStringFromPattern(atom.subpattern)})`
	}
}

const regexStringFromQuantifiedAtom: (
	quantifiedAtom: QuantifiedAtom,
) => string = (quantifiedAtom) => {
	switch (quantifiedAtom.kind) {
		case 'star':
			return `${regexStringFromAtom(quantifiedAtom.atom)}*${
				quantifiedAtom.greedy ? '' : '?'
			}`
		case 'plus':
			return `${regexStringFromAtom(quantifiedAtom.atom)}+${
				quantifiedAtom.greedy ? '' : '?'
			}`
		case 'question':
			return `${regexStringFromAtom(quantifiedAtom.atom)}?`
		case 'exactly':
			return `${regexStringFromAtom(quantifiedAtom.atom)}{${
				quantifiedAtom.count
			}}`
		case 'between':
			return `${regexStringFromAtom(quantifiedAtom.atom)}{${
				quantifiedAtom.min
			},${quantifiedAtom.max}}`
		case 'minimum':
			return `${regexStringFromAtom(quantifiedAtom.atom)}{${
				quantifiedAtom.min
			},}`
	}
}

const regexStringFromTerm: (term: Term) => string = (term) => {
	switch (term.tag) {
		case 'atom':
			return regexStringFromAtom(term)
		case 'quantifiedAtom':
			return regexStringFromQuantifiedAtom(term)
	}
}

const regexStringFromPattern: (pattern: Pattern) => string = (pattern) => {
	switch (pattern.tag) {
		case 'atom':
			return regexStringFromAtom(pattern)
		case 'disjunction':
			return `${regexStringFromPattern(pattern.left)}|${regexStringFromPattern(
				pattern.right,
			)}`
		case 'quantifiedAtom':
			return regexStringFromQuantifiedAtom(pattern)
		case 'termSequence':
			return pattern.terms.map(regexStringFromTerm).join('')
	}
}

/**
 * Construct a regular expression (`RegExp`) from a given `Pattern`.
 *
 * @since 1.0.0
 */
export const regexFromPattern = (
	pattern: Pattern,
	caseInsensitive = false,
	global = false,
	multiline = false,
): RegExp =>
	new RegExp(
		`${global ? '' : '^('}${regexStringFromPattern(pattern)}${
			global ? '' : ')$'
		}`,
		`${global ? 'g' : ''}${caseInsensitive ? 'i' : ''}${multiline ? 'm' : ''}`,
	)
