# kuvio

![build](https://img.shields.io/github/actions/workflow/status/skeate/kuvio/ci.yml)
[![Codacy
Badge](https://img.shields.io/codacy/grade/6c56da2df56d4dceb69fd38239640205)](https://app.codacy.com/gh/skeate/kuvio/dashboard?utm_source=gh&utm_medium=referral&utm_content=&utm_campaign=Badge_grade)
[![codecov](https://img.shields.io/codecov/c/github/skeate/kuvio)](https://codecov.io/github/skeate/kuvio)
[![dependencies](https://img.shields.io/librariesio/release/npm/kuvio)](https://libraries.io/npm/kuvio)
[![size](https://img.shields.io/bundlephobia/minzip/kuvio)](https://bundlephobia.com/package/kuvio)
![downloads](https://img.shields.io/npm/dw/kuvio)
[![version](https://img.shields.io/npm/v/kuvio)](https://www.npmjs.com/package/kuvio)

`kuvio` is a tool to construct composable string patterns, from which you can
derive things like regular expressions or [fast-check][] `Arbitrary`s.

`kuvio` is specifically for string-like patterns. If you want to extend this
concept to more complicated data types, check out [schemata-ts][]! `kuvio` was
originally developed as part of `schemata-ts` but was extracted as it seems
useful independently.

## Usage

`kuvio` comes with several useful patterns built-in, but you can also create
your own.

```typescript
import * as k from 'kuvio';

// Use built-in patterns
const creditCardRegex = k.regexFromPattern(k.patterns.creditCard);

// Create your own patterns.
const areaCode = k.exactly(3)(k.digit)
const exchangeCode = k.exactly(3)(k.digit)
const lineNumber = k.exactly(4)(k.digit)

// Create pattern functions
const parenthesize = (p: k.Pattern) => k.subgroup(
  k.sequence(k.char('('), p, k.char(')')
)

// Compose patterns to make more complex patterns
const phoneNumberPattern = k.sequence(
  parenthesize(areaCode),
  k.char(' '),
  k.subgroup(exchangeCode),
  k.char('-'),
  k.subgroup(lineNumber),
)
```

See the [patterns](src/patterns) directory for the built-in patterns, which can also be useful examples for creating your own.

**Note:** Arbitraries are intended primarily for use in test code; in order to
help keep `fast-check` out of your production code, `kuvio` does not include
`fast-check` in the main export. If you want to use the `Arbitrary` functions,
you'll need to import them separately from `kuvio/arbitrary`.

[fast-check]: https://github.com/dubzzz/fast-check
[schemata-ts]: https://github.com/jacob-alford/schemata-ts
