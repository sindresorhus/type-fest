import type {StaticPartOfArray, VariablePartOfArray} from './internal/array.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Return's the spread element type from and array.

@example
```
type T = ExtractSpread<[number, ...string[], string, 'foo']>;
// => string[]

type U = ExtractSpread<[...boolean[], string]>;
// => boolean[]

type V = ExtractSpread<[number, string]>;
// => never
```

@author benzaria
@see ExcludeSpread, SplitOnSpread
@category Array
*/
export type ExtractSpread<T extends UnknownArray> =
	SplitOnSpread<T>[1] extends infer Result extends UnknownArray
		? Result extends []
			? never
			: Result[0]
		: never;

/**
Create a tuple with the spread element removed.

@example
```
type T = ExcludeSpread<[number, ...string[], string, 'foo']>;
// => [number, string, 'foo']

type U = ExcludeSpread<[...boolean[], string]>;
// => [string]

type V = ExcludeSpread<[number, string]>;
// => [number, string]
```

@author benzaria
@see ExtractSpread, SplitOnSpread
@category Array
*/
export type ExcludeSpread<T extends UnknownArray> =
	SplitOnSpread<T> extends infer Result extends UnknownArray[]
		? [...Result[0], ...Result[2]]
		: never;

/**
Splits an Array on its spreaded portion.

- The first part is the static head before the spread.
- The second part is a single-element tuple containing the spread type (e.g., `boolean` for `...boolean[]`).
- The third part is the static tail after the spread.

If no spread is present, it treats the entire array as static.

@example
```
type T = SplitOnSpread<[number, ...string[], boolean]>;
// => [[number], [string], [boolean]]

type U = SplitOnSpread<[...boolean[], string]>;
// => [[], [boolean], [string]]

type V = SplitOnSpread<[number, string]>;
// => [[number, string], [], []]
```

@author benzaria
@see ExtractSpread, ExcludeSpread
@category Array
*/
export type SplitOnSpread<T extends UnknownArray> = [
	StaticPartOfArray<T>,
	..._SplitOnSpread<VariablePartOfArray<T>>,
];

/**
Splits an Array on its spreaded portion, When It's the first element.
*/
type _SplitOnSpread<T extends UnknownArray, Rest extends UnknownArray = []> =
	T extends readonly [...infer Spread, infer Last]
		? _SplitOnSpread<Spread, [Last, ...Rest]>
		: [T, Rest];
