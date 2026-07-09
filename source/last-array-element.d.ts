import type {If} from './if.d.ts';
import type {IfNotAnyOrNever, IsExactOptionalPropertyTypesEnabled} from './internal/type.d.ts';
import type {SplitOnRestElement} from './split-on-rest-element.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Extract the type of the last element of an array.

Use-case: Defining the return type of functions that extract the last element of an array, for example [`lodash.last`](https://lodash.com/docs/4.17.15#last).

@example
```
import type {LastArrayElement} from 'type-fest';

declare function lastOf<const V extends readonly any[]>(array: V): LastArrayElement<V>;

const last1 = lastOf(['foo', 'bar']);
//=> 'bar'

const last2 = lastOf([true, false, 'baz', 10]);
//=> 10
```

Note: When the array ends with an optional or rest element, the last element's position becomes ambiguous. In such cases, the result is a union of the types of all elements that could potentially be the last element of the array.

@example
```
import type {LastArrayElement} from 'type-fest';

type A = LastArrayElement<[string, number?, bigint?]>;
//=> bigint | number | string

type B = LastArrayElement<[string, number, bigint?, ...boolean[]]>;
//=> boolean | bigint | number
```

Note: If empty array is a valid value for the array type, the result includes an `undefined`. This aligns with the runtime behavior of `[].at(-1)`.

@example
```
import type {LastArrayElement} from 'type-fest';

type A = LastArrayElement<[]>;
//=> undefined

// `[]` is assignable to `string[]`
type B = LastArrayElement<string[]>;
//=> string | undefined

// `[]` is assignable to `[string?, number?]`
type C = LastArrayElement<[string?, number?]>;
//=> number | string | undefined

// `[]` is assignable to [string?, number?, ...bigint[]]`
type D = LastArrayElement<[string?, number?, ...bigint[]]>;
//=> bigint | number | string | undefined
```

@category Array
@category Template literal
*/
export type LastArrayElement<TArray extends UnknownArray> =
	IfNotAnyOrNever<TArray, {
		ifNot: TArray extends UnknownArray // For distributing `TArray`
			? SplitOnRestElement<TArray> extends readonly [infer BeforeRest extends UnknownArray, infer Rest extends UnknownArray, infer AfterRest extends UnknownArray]
				? _LastArrayElement<BeforeRest, Rest, AfterRest>
				: never
			: never;
	}>;

type _LastArrayElement<BeforeRest extends UnknownArray, Rest extends UnknownArray, AfterRest extends UnknownArray> =
	AfterRest extends readonly [...any, infer Last] // Note there are no optional elements in `AfterRest`.
		? Last // If there's a `Last` in `AfterRest`, then that's the result.
		: Rest[number] | BeforeRestLastElement<BeforeRest>; // Otherwise, the result is union of the `Rest` element and the last element in `BeforeRest`.

type BeforeRestLastElement<BeforeRest extends UnknownArray, Accumulator = never> =
	BeforeRest extends readonly []
		? Accumulator | undefined
		: BeforeRest extends readonly [...any, infer Last]
			? Last | Accumulator
			: BeforeRest extends readonly [...infer Rest, (infer Last)?]
				? BeforeRestLastElement<
					Rest,
					// Add `undefined` for optional elements, if `exactOptionalPropertyTypes` is disabled.
					Last | Accumulator | If<IsExactOptionalPropertyTypesEnabled, never, undefined>
				>
				: never;

export {};
