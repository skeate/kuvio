# kuvio

`kuvio` is a tool to construct composable string patterns, from which you can
derive things like regular expressions or [fast-check][] `Arbitrary`s.

`kuvio` is specifically for string-like patterns. If you want to extend this
concept to more complicated data types, check out [schemata-ts][]! `kuvio` was
originally developed as part of `schemata-ts` but was extracted as it seems
useful independently.

[fast-check]: https://github.com/dubzzz/fast-check
[schemata-ts]: https://github.com/jacob-alford/schemata-ts
