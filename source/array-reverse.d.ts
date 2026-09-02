import type {If} from './if.d.ts';
import type {IsArrayReadonly} from './internal/array.d.ts';
import type {IfNotAnyOrNever, IsExactOptionalPropertyTypesEnabled} from './internal/type.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Reverse the order of elements in a tuple type.

@example
```ts
import type {ArrayReverse} from 'type-fest';

type A = ArrayReverse<[string, number, boolean]>;
//=> [boolean, number, string]

type B = ArrayReverse<readonly [string, number, ...boolean[]]>;
//=> readonly [...boolean[], number, string]

type C = ArrayReverse<['foo', 'bar'] | readonly [1, 2, 3]>;
//=> ['bar', 'foo'] | readonly [3, 2, 1]

type D = ArrayReverse<string[]>;
//=> string[]

type E = ArrayReverse<[]>;
//=> []
```

Note: If the tuple contains optional elements, the result will be a union of tuples, refer to the examples below:

@example
```ts
import type {ArrayReverse} from 'type-fest';

type A = ArrayReverse<[string, number, boolean?]>;
//=> [number, string] | [boolean, number, string]

type B = ArrayReverse<[string, number?, boolean?]>;
//=> [string] | [number, string] | [boolean, number, string]

type C = ArrayReverse<[string?, number?, boolean?]>;
//=> [] | [string] | [number, string] | [boolean, number, string]

type D = ArrayReverse<[string, number?, ...boolean[]]>;
//=> [string] | [...boolean[], number, string]

type E = ArrayReverse<[string?, number?, ...boolean[]]>;
//=> [] | [string] | [...boolean[], number, string]
```

@category Array
*/
export type ArrayReverse<TArray extends UnknownArray> = IfNotAnyOrNever<TArray, {
	ifNot: TArray extends unknown // For distributing `TArray`
		? _ArrayReverse<TArray> extends infer Result
			? If<IsArrayReadonly<TArray>, Readonly<Result>, Result>
			: never // Should never happen
		: never; // Should never happen
}>;

type _ArrayReverse<
	TArray extends UnknownArray,
	BeforeRestAcc extends UnknownArray = [],
	AfterRestAcc extends UnknownArray = [],
	Result extends UnknownArray = never,
> =
	'0' extends keyof TArray
		// Enters this branch, if `TArray` starts with a non-rest element (e.g., `[string, number]` or `[string, ...number[]]`).
		? TArray extends readonly [(infer First)?, ...infer Rest]
			// A tuple allows fewer than one element only when its first element is optional. Written in exactly this shape because equivalent ones, such as `[] extends TArray`, are several times slower.
			? TArray extends readonly [unknown, ...unknown[]]
				? _ArrayReverse<Rest, [First, ...BeforeRestAcc], AfterRestAcc, Result>
				: _ArrayReverse<
					Rest,
					[First | (If<IsExactOptionalPropertyTypesEnabled, never, undefined>), ...BeforeRestAcc], // Add `| undefined` for optional elements, if `exactOptionalPropertyTypes` is disabled.
					AfterRestAcc,
					Result | BeforeRestAcc
				>
			: never // Should never happen, since `readonly [(infer First)?, ...infer Rest]` is a top-type for arrays.
		// Enters this branch, if `TArray` is empty (e.g., `[]`),
		// or `TArray` contains no non-rest elements preceding the rest element (e.g., `[...string[]]` or `[...string[], string]`).
		: TArray extends readonly [...infer Rest, infer Last]
			? _ArrayReverse<Rest, BeforeRestAcc, [...AfterRestAcc, Last], Result> // Accumulate elements that are present after the rest element in reverse order.
			: Result | [...AfterRestAcc, ...TArray, ...BeforeRestAcc]; // Add the rest element between the accumulated elements.

export {};
