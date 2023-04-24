/**
 * @since 1.0.0
 * @category Model
 */
export type Pattern = Disjunction | TermSequence | Term

/**
 * @since 1.0.0
 * @category Model
 */
export type Disjunction = {
	tag: 'disjunction'
	left: Pattern
	right: TermSequence | Term
}

/**
 * @since 1.0.0
 * @category Model
 */
export type TermSequence = { tag: 'termSequence'; terms: ReadonlyArray<Term> }

/**
 * @since 1.0.0
 * @category Model
 */
export type Term = Atom | QuantifiedAtom

/**
 * @since 1.0.0
 * @category Model
 */
export type QuantifiedAtom = { tag: 'quantifiedAtom'; atom: Atom } & (
	| { kind: 'star'; greedy: boolean }
	| { kind: 'plus'; greedy: boolean }
	| { kind: 'question' }
	| { kind: 'exactly'; count: number }
	| { kind: 'minimum'; min: number }
	| { kind: 'between'; min: number; max: number }
)

/**
 * @since 1.0.0
 * @category Model
 */
export type CharacterClass = {
	tag: 'atom'
	kind: 'characterClass'
	exclude: boolean
	ranges: ReadonlyArray<{ lower: number; upper: number }>
}

/**
 * @since 1.0.0
 * @category Model
 */
export type Atom =
	| CharacterClass
	| ({ tag: 'atom' } & (
			| { kind: 'character'; char: string }
			| { kind: 'anything' }
			| { kind: 'subgroup'; subpattern: Pattern }
	  ))

export type Char = string
