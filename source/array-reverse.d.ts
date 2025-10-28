import type {IsExactOptionalPropertyTypesEnabled} from './internal/type.d.ts';
import type {IsOptionalKeyOf} from './is-optional-key-of.d.ts';
import type {IsArrayReadonly} from './internal/array.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {If} from './if.d.ts';

/**
Reverses the order of elements in a tuple or array type.

@example
```
type T1 = ArrayReverse<['a', 'b', 'c']>
//=> ['c', 'b', 'a']

type T2 = ArrayReverse<readonly [1, 2, 3, 4, ...string[]]>
//=> readonly [...string[], 4, 3, 2, 1]

type T3 = ArrayReverse<['foo', 'bar'] | readonly [1, 2, 3]>;
//=> ["bar", "foo"] | readonly [3, 2, 1]

type T4 = ArrayReverse<readonly [1, 2, ...number[], 4]>
//=> readonly [4, ...number[], 2, 1]

declare function Arrayreverse<const T extends unknown[]>(array: T): ArrayReverse<T>;
Arrayreverse(['a', 'b', 'c', 'd']);
//=> ['d', 'c', 'b', 'a']
```

Note: If the array contains optional elements, the result will be a union of tuples covering all possible cases.

@example
```ts
import type {ArrayReverse} from 'type-fest';

type T1 = ArrayReverse<[string?, number?, boolean?]>;
//=> [boolean, number, string] | [number, string] | [string] | []

type T2 = ArrayReverse<[string, number?, boolean?]>;
//=> [boolean, number, string] | [number, string] | [string]

type T3 = ArrayReverse<[string, number?, ...boolean[]]>;
//=> [...boolean[], number, string] | [string]

type T4 = ArrayReverse<[string?, number?, ...boolean[]]>;
//=> [...boolean[], number, string] | [string] | []
```

@category Array
*/
export type ArrayReverse<Array_ extends UnknownArray> =
	IsAny<Array_> extends true ? Array_ // Prevent the return of `Readonly<[] | [unknown] | unknown[] | [...unknown[], unknown]>`
		: Array_ extends UnknownArray // For distributing `Array_`
			? _ArrayReverse<Array_> extends infer Result
				? If<IsArrayReadonly<Array_>, Readonly<Result>, Result> // Preserve readonly modifier
				: never // Should never happen
			: never; // Should never happen

/**
Core type for {@link ArrayReverse `ArrayReverse`}
*/
type _ArrayReverse<
	Array_ extends UnknownArray,
	HeadAcc extends UnknownArray = [],
	TailAcc extends UnknownArray = [],
> =
	keyof Array_ & `${number}` extends never // Is `Array_` leading a rest element or empty
		? Array_ extends readonly [...infer Rest, infer Last]
			? _ArrayReverse<Rest, [...HeadAcc, Last], TailAcc> // Accumulate elements after a rest element in Arrayreverse order
			: [...HeadAcc, ...Array_, ...TailAcc] // Add the rest element between the accumulated elements.
		: Array_ extends readonly [(infer First)?, ...infer Rest]
			// Accumulate elements before a rest element in Arrayreverse order.
			? IsOptionalKeyOf<Array_, 0> extends true
				? (
					| TailAcc // Union all possible cases when optional elements exist.
					| _ArrayReverse<Rest, HeadAcc, [
						If<IsExactOptionalPropertyTypesEnabled, First, First | undefined>, // Add `| undefined` for optional elements, if `exactOptionalPropertyTypes` is disabled.
						...TailAcc,
					]>
				) : _ArrayReverse<Rest, HeadAcc, [First, ...TailAcc]>
			: never; // Should never happen

export {};
