import type {ExcludeRestElement} from './exclude-rest-element.d.ts';
import type {ExtractRestElement} from './extract-rest-element.d.ts';
import type {If} from './if.d.ts';
import type {IsExactOptionalPropertyTypesEnabled} from './internal/type.d.ts';
import type {IsOptionalKeyOf} from './is-optional-key-of.d.ts';
import type {IsNegative} from './numeric.d.ts';
import type {Subtract} from './subtract.d.ts';
import type {Sum} from './sum.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Return the element at the given index of the given array.

Use-case: Get the element at a specific index of an array.

Like [`Array#at()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/at) but for types.

@example
```
import type {ArrayAt} from 'type-fest';

// Positive index
type A = ArrayAt<['a', 'b', 'c', 'd'], 1>;
//=> 'b'

// Negative index
type B = ArrayAt<['a', 'b', 'c', 'd'], -4>;
//=> 'a'

// Positive index with optional elements
type C = ArrayAt<['a', 'b', 'c'?, 'd'?], 3>;
//=> 'd' | undefined

// Negative index with optional elements
type D = ArrayAt<['a', 'b', 'c'?, 'd'?], -2>;
//=> 'a' | 'b' | 'c'

// Positive index with rest element and optional elements
type E = ArrayAt<['a', 'b', 'c'?, ...number[]], 3>;
//=> number | undefined

// Negative index with rest element and optional elements
type F = ArrayAt<['a', 'b', 'c'?, ...number[]], -1>;
//=> 'b' | 'c' | number

// Positive index with rest element in middle
type G = ArrayAt<['a', 'b', 'c', ...number[], 'd', 'e'], 4>;
//=> number | 'd' | 'e'

// Negative index with rest element in middle
type H = ArrayAt<['a', 'b', ...number[], 'c', 'd', 'e'], -5>;
//=> 'a' | 'b' | number

// Out-of-bounds positive index
type I = ArrayAt<['a', 'b'], 5>;
//=> undefined

// Out-of-bounds negative index
type J = ArrayAt<['a', 'b'], -3>;
//=> undefined
*/
export type ArrayAt<TArray extends UnknownArray, Index extends number> =
	TArray extends unknown // For distributing `Array_`
		? Index extends unknown // For distributing `Index`
			? number extends Index
				? TArray[number] | undefined
				: IsNegative<Index> extends true
					? ArrayAtNegativeIndex<TArray, Index>
					: ArrayAtPositiveIndex<TArray, Index>
			: never // Should never happen
		: never; // Should never happen

/**
Recursion order for `ArrayAtPositiveIndex<["a", "b", ...number[], "c", "d", "e"], 4>`:

1. `ArrayAtPositiveIndex<["a", "b", ...number[], "c", "d", "e"], 4>` // No match, decrement `Index`.
2. `ArrayAtPositiveIndex<["b", ...number[], "c", "d", "e"], 3, 0, never>` // No match, decrement `Index`.
3. `ArrayAtPositiveIndex<[...number[], "c", "d", "e"], 2, 0, number>` // Found rest element, set `Index` to `0`, `Right` to `Index` (i.e., `2`), add rest element to result.
4. `ArrayAtPositiveIndex<["c", "d", "e"], 0, 2, number | "c">` // Match found, `Right` not yet `0`, decrement `Right`, add current element to result.
5. `ArrayAtPositiveIndex<["d", "e"], 0, 1, number | "c" | "d">` // Match found, `Right` not yet `0`, decrement `Right`, add current element to result.
6. `ArrayAtPositiveIndex<["e"], 0, 0, number | "c" | "d" | "e">` // Match found, `Right` is `0`, add current element to result and return result.

Result: `number | "c" | "d" | "e"`
*/
type ArrayAtPositiveIndex<TArray extends UnknownArray, Index extends number, Right extends number = 0, Result = never> =
	TArray extends readonly []
		? Result | undefined // If the array is exhausted, return `Result` with `undefined`.
		: keyof TArray & `${number}` extends never
			// Enters this branch, if `TArray` is empty (e.g., `[]`),
			// or `TArray` contains no non-rest elements preceding the rest element (e.g., `[...string[]]` or `[...string[], string]`).
			? ExcludeRestElement<TArray> extends infer TWithoutRest extends UnknownArray
				// Remove the rest element and recurse further with the elements after the rest element,
				// Set `Index` to `0` & `Right` to `Index`, so that elements keep getting matched until `Right` reaches `0`.
				? ArrayAtPositiveIndex<TWithoutRest, 0, Index, Result | ExtractRestElement<TArray>> // Also, add the rest element to `Result`.
				: never // Should never happen
			: TArray extends readonly [(infer First)?, ...infer Rest]
				? Index extends 0
					? Right extends 0
						? Result | First | If<IsOptionalKeyOf<TArray, '0'>, undefined, never> // If there's a match, and `Right` is `0`, return `Result` with `First`.
						: ArrayAtPositiveIndex<Rest, Index, Subtract<Right, 1>, Result | First> // Enters this branch for elements after the rest element, so `First` cannot be optional here.
					: ArrayAtPositiveIndex<Rest, Subtract<Index, 1>, Right, Result> // Enters this branch for elements before the rest element.
				: never; // Should never happen

/**
Recursion order for `ArrayAtNegativeIndex<["a", "b", "c", ...number[], "d", "e"], -5>`:

1. `ArrayAtNegativeIndex<["a", "b", "c", ...number[], "d", "e"], -5, 0, never>` // No match, increment `Index`.
2. `ArrayAtNegativeIndex<["a", "b", "c", ...number[], "d"], -4, 0, never>` // No match, increment `Index`.
3. `ArrayAtNegativeIndex<["a", "b", "c", ...number[]], -3, 0, never>` // Found rest element, set `Index` to `-1`, `Left` to `Sum<Index, 1>` (i.e., `-2`), add rest element to result.
4. `ArrayAtNegativeIndex<["a", "b", "c"], -1, -2, number>` // Match found, `Left` not yet `0`, increment `Left`, add current element to result.
5. `ArrayAtNegativeIndex<["a", "b"], -1, -1, "c" | number>` // Match found, `Left` not yet `0`, increment `Left`, add current element to result.
6. `ArrayAtNegativeIndex<["a"], -1, 0, "b" | "c" | number>` // Match found, `Left` is `0`, add current element to result and return result.

Result: "a" | "b" | "c" | number

---

Recursion order for `ArrayAtNegativeIndex<["a", "b", "c"?, ...number[]], -1>`:

1. `ArrayAtNegativeIndex<["a", "b", "c"?, ...number[]], -1, 0, never>` // Found rest element, set `Index` to `-1`, `Left` to `Sum<Index, 1>` (i.e., `0`), add rest element to result.
2. `ArrayAtNegativeIndex<["a", "b", "c"?], -1, 0, number>` // Match found, current element is optional, add it to result without changing anything else.
3. `ArrayAtNegativeIndex<["a", "b"], -1, 0, number | "c">` // Match found, current element is not optional, add it to result and return result.

Result: "b" | "c" | number
*/
type ArrayAtNegativeIndex<TArray extends UnknownArray, Index extends number, Left extends number = 0, Result = never> =
	TArray extends readonly []
		? Result | undefined // If the array is exhausted, return `Result` with `undefined`.
		: number extends TArray['length']
			// Enters this branch, if `TArray` contains a rest element.
			? TArray extends readonly [...infer Rest, infer L]
				? Index extends -1
					? L // If an element after the rest element matches, return it.
					: ArrayAtNegativeIndex<Rest, Sum<Index, 1>, Left, Result>
				// Enters this branch, if `TArray` contains no elements after the rest element.
				: ExcludeRestElement<TArray> extends infer TWithoutRest extends UnknownArray
					// Remove the rest element and recurse further with the elements before the rest element,
					// Set `Index` to `-1` & `Left` to `Sum<Index, 1>`, so that elements keep getting matched until `Left` reaches `0`.
					? ArrayAtNegativeIndex<TWithoutRest, -1, Sum<Index, 1>, ExtractRestElement<TArray> | Result> // Also, add the rest element to `Result`.
					: never // Should never happen
			// Enters this branch, if `TArray` contains no rest element.
			: TArray extends readonly [...infer Rest, (infer Last)?]
				? Index extends -1
					? TArray extends readonly [...infer Rest, infer Last] // If `Last` is not optional
						? Left extends 0
							? Last | Result // If there's a match, and `Left` is `0`, return `Result` with `Last`.
							: ArrayAtNegativeIndex<Rest, Index, Sum<Left, 1>, Last | Result> // If there's a match, and `Left` is not `0`, increment `Left` and add `Last` to `Result`.
						: ArrayAtNegativeIndex<Rest, Index, Left, Last | If<IsExactOptionalPropertyTypesEnabled, never, undefined> | Result> // If `Last` is optional, just add it to `Result` without changing anything else.
					: TArray extends readonly [...infer Rest, unknown]
						? ArrayAtNegativeIndex<Rest, Sum<Index, 1>, Left, Result> // If `Last` is not optional, just increment `Index`.
						: ArrayAtNegativeIndex<Rest, Sum<Index, 1>, Subtract<Left, 1>, Result> // If `Last` is optional, increment `Index` and decrement `Left`.
				: never; // Should never happen

export {};
