/**
 * `kuvio` defines an API for constructing `Pattern`s. These `Pattern`s can be
 * used to generate things like regular expressions or fast-check Arbitraries.
 * They can also be composed together, allowing for the construction of complex
 * patterns, reuse of patterns, and the ability to easily test patterns.
 *
 * @since 0.0.1
 * @example
 *   import * as k from 'kuvio'
 *
 *   const digit = k.characterClass(false, ['0', '9'])
 *
 *   const areaCode = pipe(
 *     k.pipe(
 *       k.char('('),
 *       k.andThen(k.times(3)(digit)),
 *       k.andThen(k.char(')')),
 *       k.andThen(k.maybe(k.char(' '))),
 *     ),
 *     k.or(k.times(3)(digit)),
 *     k.subgroup,
 *   )
 *
 *   const prefix = k.times(3)(digit)
 *
 *   const lineNumber = k.times(4)(digit)
 *
 *   export const usPhoneNumber = k.pipe(
 *     areaCode,
 *     k.andThen(pipe(k.char('-'), k.maybe)),
 *     k.andThen(prefix),
 *     k.andThen(k.char('-')),
 *     k.andThen(lineNumber),
 *   )
 *
 *   assert.equal(k.regexFromPattern(usPhoneNumber).test('(123) 456-7890'), true)
 *   assert.equal(k.regexFromPattern(usPhoneNumber).test('(123)456-7890'), true)
 *   assert.equal(k.regexFromPattern(usPhoneNumber).test('123-456-7890'), true)
 *   assert.equal(k.regexFromPattern(usPhoneNumber).test('1234567890'), false)
 */

export * from './base'
export * from './types'

export * from './character-classes'
export * from './combinators'

export * from './regex'
export * as patterns from './patterns'
export * from './util/pipe'
