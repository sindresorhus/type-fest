import type {IsOptionalKeyOf} from './is-optional-key-of.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {IsAnyOrNever} from './internal/type.d.ts';
import type {IsEqual} from './is-equal.d.ts';

/**
Returns a boolean for whether the given array includes the given item.

This can be useful if another type wants to make a decision based on whether the array includes that item.

@example
```
import type {Includes} from 'type-fest';

type T1 = Includes<[1, 2, ...3[]], 2>;
//=> true

type T2 = Includes<[1, 2, ...3[]], 0>;
//=> false

type T3 = Includes<[1, 2, ...3[]], 3>;
//=> boolean

type T4 = Includes<[1, 3, ...3[]], 3>;
//=> true

type T5 = Includes<[1, 2, 3?], 3>;
//=> boolean

type T6 = Includes<[1, 3, 3?], 3>;
//=> true
```

@category Array
*/
export type Includes<Array_ extends UnknownArray, Item> =
	IsAnyOrNever<Array_> extends true ? Array_ // Handle any/never
		: _Includes<Array_, Item>;

type _Includes<Array_ extends UnknownArray, Item> =
	keyof Array_ & `${number}` extends never
		// Handle fackward search
		? Array_ extends readonly [...infer Rest, infer Last]
			? IsEqual<Last, Item> extends true ? true
				: _Includes<Rest, Item>
		// Handle rest element and result
			: Array_ extends readonly []
				? false // No match found
				: IsEqual<Array_[number], Item> extends true
					? boolean // Return boolean for rest elements unless finding a required one
					: false // No match found
		// Handle forward search
		: Array_ extends readonly [(infer First)?, ...infer Rest]
			? IsEqual<First, Item> extends true ? true | (
				IsOptionalKeyOf<Array_, '0'> extends true
					? _Includes<Rest, Item> // Return boolean for optional elments unless finding a required one
					: never)
				: _Includes<Rest, Item>

			: never;

export {};
