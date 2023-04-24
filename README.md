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

[fast-check]: https://github.com/dubzzz/fast-check
[schemata-ts]: https://github.com/jacob-alford/schemata-ts
