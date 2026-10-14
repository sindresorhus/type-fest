import type {If} from './if.d.ts';
import type {IsArrayReadonly} from './internal/array.d.ts';
import type {IfNotAnyOrNever, IsExactOptionalPropertyTypesEnabled} from './internal/type.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Remove the elements of the given type from an array type.

It works like `Exclude` on each element. An element whose type is fully excluded is removed.

Use-case: Remove some kinds of elements from a tuple, such as the `null` and `undefined` entries of a list of literal values.

@example
```
import type {ArrayExclude} from 'type-fest';

type A = ArrayExclude<[1, 'a', 2, 'b'], string>;
//=> [1, 2]

type B = ArrayExclude<readonly [string, number, boolean?], number>;
//=> readonly [string, boolean?]

type C = ArrayExclude<[number, ...Array<string | null>], null>;
//=> [number, ...string[]]

type D = ArrayExclude<Array<string | number>, number>;
//=> string[]
```

Note: This works on types, not values. An element that is a union keeps its remaining members, so `ArrayExclude<[1 | 'a'], string>` is `[1]`, even though filtering `['a']` at runtime gives `[]`.

Note: If `exactOptionalPropertyTypes` is disabled, an optional element also accepts `undefined`, so it is only removed when `undefined` is excluded too.

@category Array
*/
export type ArrayExclude<TArray extends UnknownArray, TExclude> = IfNotAnyOrNever<TArray, {
	ifNot: TArray extends unknown // For distributing `TArray`
		? _ArrayExclude<TArray, TExclude> extends infer Result extends UnknownArray
			? If<IsArrayReadonly<TArray>, Readonly<Result>, Result>
			: never // Should never happen
		: never; // Should never happen
}>;

type _ArrayExclude<
	TArray extends UnknownArray,
	TExclude,
	BeforeRestAcc extends UnknownArray = [],
	AfterRestAcc extends UnknownArray = [],
> =
	'0' extends keyof TArray
		// Enters this branch, if `TArray` starts with a non-rest element (e.g., `[string, number]` or `[string, ...number[]]`).
		? TArray extends readonly [(infer First)?, ...infer Rest]
			// A tuple allows fewer than one element only when its first element is optional.
			? TArray extends readonly [unknown, ...unknown[]]
				? Exclude<First, TExclude> extends infer Element
					? _ArrayExclude<Rest, TExclude, If<IsNever<Element>, BeforeRestAcc, [...BeforeRestAcc, Element]>, AfterRestAcc>
					: never // Should never happen
				: Exclude<First | If<IsExactOptionalPropertyTypesEnabled, never, undefined>, TExclude> extends infer Element // Add `| undefined` for optional elements, if `exactOptionalPropertyTypes` is disabled.
					? _ArrayExclude<Rest, TExclude, If<IsNever<Element>, BeforeRestAcc, [...BeforeRestAcc, Element?]>, AfterRestAcc>
					: never // Should never happen
			: never // Should never happen, since `readonly [(infer First)?, ...infer Rest]` is a top-type for arrays.
		// Enters this branch, if `TArray` is empty (e.g., `[]`), has no fixed length (e.g., `string[]`),
		// or contains no non-rest elements preceding the rest element (e.g., `[...string[], string]`).
		: TArray extends readonly [...infer Rest, infer Last]
			? Exclude<Last, TExclude> extends infer Element // Accumulate elements that are present after the rest element.
				? _ArrayExclude<Rest, TExclude, BeforeRestAcc, If<IsNever<Element>, AfterRestAcc, [Element, ...AfterRestAcc]>>
				: never // Should never happen
			: Exclude<TArray[number], TExclude> extends infer Element // Add the rest element between the accumulated elements.
				? [...BeforeRestAcc, ...If<IsNever<Element>, [], Element[]>, ...AfterRestAcc]
				: never; // Should never happen

export {};
