import type {IsOptionalKeyOf} from './is-optional-key-of.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {IsEqual} from './is-equal.d.ts';

/**
Returns a boolean for whether the given array includes the given item.

This can be useful if another type wants to make a decision based on whether the array includes that item.

@example
```
import type {Includes} from 'type-fest';

type array = [1, 2, 3, ...4[], 5];

type T1 = Includes<array, 1>;
//=> true

type T2 = Includes<array, 4>;
//=> true

type T3 = Includes<array, 0>;
//=> false

type T4 = Includes<[1, 2, 3?], 3>;
//=> boolean

type T5 = Includes<[1, 3, 3?], 3>;
//=> true
```

@category Array
*/
export type Includes<Array_ extends UnknownArray, Item> = {
	[Key in keyof Array_]-?:
	IsOptionalKeyOf<Array_, Key> extends true
		? IsEqual<Array_[Key], Item | undefined> extends true
			? 'boolean'
			: 'false'
		: IsEqual<Array_[Key], Item> extends true
			? 'true'
			: 'false'
}[number] extends infer Result
	? [Result] extends ['false'] ? false
		: ['true'] extends [Result] ? true
			: boolean
	: never;

export {};
