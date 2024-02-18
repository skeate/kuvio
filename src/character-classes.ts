import { and, characterClass } from './base'
import { CharacterClass } from './types'
import { pipe } from './util/pipe'

/**
 * Any upper case letter in ASCII. See [POSIX
 * equivalent](https://en.wikibooks.org/wiki/Regular_Expressions/POSIX_Basic_Regular_Expressions#Character_classes)
 *
 * @since 0.0.1
 */
export const upper: CharacterClass = characterClass(false, ['A', 'Z'])

/**
 * Any lower case letter in ASCII. See [POSIX
 * equivalent](https://en.wikibooks.org/wiki/Regular_Expressions/POSIX_Basic_Regular_Expressions#Character_classes)
 *
 * @since 0.0.1
 */
export const lower: CharacterClass = characterClass(false, ['a', 'z'])

/**
 * Any upper or lower case letter in ASCII. See [POSIX
 * equivalent](https://en.wikibooks.org/wiki/Regular_Expressions/POSIX_Basic_Regular_Expressions#Character_classes)
 *
 * @since 0.0.1
 */
export const alpha: CharacterClass = pipe(upper, and(lower))

/**
 * Any digit character in ASCII. See [POSIX
 * equivalent](https://en.wikibooks.org/wiki/Regular_Expressions/POSIX_Basic_Regular_Expressions#Character_classes)
 *
 * @since 0.0.1
 */
export const digit: CharacterClass = characterClass(false, ['0', '9'])

/**
 * Any hexadecimal digit in ASCII. See [POSIX
 * equivalent](https://en.wikibooks.org/wiki/Regular_Expressions/POSIX_Basic_Regular_Expressions#Character_classes)
 *
 * @since 0.0.1
 */
export const xdigit: CharacterClass = pipe(digit, and(['A', 'F'], ['a', 'f']))

/**
 * Alias of `xdigit`
 *
 * @since 0.0.1
 */
export const hexDigit: CharacterClass = xdigit

/**
 * Any alphanumeric character in ASCII. See [POSIX
 * equivalent](https://en.wikibooks.org/wiki/Regular_Expressions/POSIX_Basic_Regular_Expressions#Character_classes)
 *
 * @since 0.0.1
 */
export const alnum: CharacterClass = pipe(alpha, and(digit))

/**
 * Any alphanumeric character in ASCII, or an underscore ('_'). See [POSIX
 * equivalent](https://en.wikibooks.org/wiki/Regular_Expressions/POSIX_Basic_Regular_Expressions#Character_classes)
 *
 * @since 0.0.1
 */
export const word: CharacterClass = pipe(alnum, and('_'))

/**
 * Any punctuation character in ASCII. See [POSIX
 * equivalent](https://en.wikibooks.org/wiki/Regular_Expressions/POSIX_Basic_Regular_Expressions#Character_classes)
 *
 * @since 0.0.1
 */
export const punct: CharacterClass = characterClass(
	false,
	['!', '/'],
	[':', '@'],
	['[', '_'],
	['{', '~'],
)

/**
 * Space or tab. See [POSIX
 * equivalent](https://en.wikibooks.org/wiki/Regular_Expressions/POSIX_Basic_Regular_Expressions#Character_classes)
 *
 * @since 0.0.1
 */
export const blank: CharacterClass = characterClass(false, ' ', '\t')

/**
 * Any whitespace character in ASCII. See [POSIX
 * equivalent](https://en.wikibooks.org/wiki/Regular_Expressions/POSIX_Basic_Regular_Expressions#Character_classes)
 *
 * @since 0.0.1
 */
export const space: CharacterClass = pipe(blank, and('\n', '\r', '\f', '\v'))

/**
 * Any character in ASCII which has a graphical representation (i.e. not control
 * characters or space). See [POSIX
 * equivalent](https://en.wikibooks.org/wiki/Regular_Expressions/POSIX_Basic_Regular_Expressions#Character_classes)
 *
 * @since 0.0.1
 */
export const graph: CharacterClass = characterClass(false, [33, 127])

/**
 * Any non-control character in ASCII. See [POSIX
 * equivalent](https://en.wikibooks.org/wiki/Regular_Expressions/POSIX_Basic_Regular_Expressions#Character_classes)
 *
 * @since 0.0.1
 */
export const print: CharacterClass = pipe(graph, and(' '))
