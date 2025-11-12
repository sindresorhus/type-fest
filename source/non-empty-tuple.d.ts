/**
Matches any non-empty tuple.

@example
```
import type {NonEmptyTuple} from 'type-fest';

const sum = (...numbers: NonEmptyTuple<number>) => numbers.reduce((total, value) => total + value, 0);

sum(1, 2, 3);
//=> 6

// @ts-expect-error
sum();
//=> Error: Expected at least 1 arguments, but got 0.
```
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gOQgOwKLhIAqArmADYoC+cAZlBCHAORKoC0tKAzjMwNwAoQQGNcvONxJMAvHAAUAOmU5pAIxRRuALjjZ8hRKQooAPKpAaoAPgCUcGdbgWr3RVBQATEiJTz5MBAwAIbkADRwAG6hJCj2jghBoXAA1FExKBEADLZCglIg8gCMEQBMEQDMuYIA9DUJAGzCdXAAAjDc7CgAHqgiMF1QDFD50vLVdQl4Q9C6eL0o-V5wwfCUwRJFK1AA5tIoOB0RaiTwO0FwWYpAA)

@see {@link RequireAtLeastOne} for objects

@category Array
*/
export type NonEmptyTuple<T = unknown> = readonly [T, ...T[]];

export {};
