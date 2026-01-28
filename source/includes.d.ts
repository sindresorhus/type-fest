import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {IsOptionalKeyOf} from './is-optional-key-of.d.ts';
import type {ExtendsStrict} from './extends-strict.d.ts';
import type {IsAnyOrNever, Not} from './internal/type.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {And} from './and.d.ts';

/**
{@link Includes `Includes`} Options.
*/
export type IncludesOptions = {
	/**
	Controls whether to distribute the types of both sides before comparison.

	@example
	```
	import type {Includes} from 'type-fest';

	type T1 = Includes<[1, 2, 3], 1 | 4, {distributeItem: false}>;
	//=> false

	type T2 = Includes<[1, 2, 3], 1 | 4, {distributeItem: true}>;
	//=> boolean

	type T3 = Includes<[1 | 2, 3], 1, {distributeItem: false}>;
	//=> false

	type T4 = Includes<[1 | 2, 3], 1, {distributeItem: true}>;
	//=> boolean

	type T5 = Includes<[1, 2, 3], 1 | 2, {distributeItem: true}>;
	//=> true

	type T6 = Includes<[1, 2, 3], number, {distributeItem: true}>;
	//=> boolean

	type T7 = Includes<[string, 1], 'a', {distributeItem: true}>;
	//=> boolean
	```

	@default false
	*/
	distributeItem?: boolean;
};

type DefaultIncludesOptions = {
	distributeItem: false;
};

type IsEqualOrExtend<Type, Item, Options extends Required<IncludesOptions>> =
	And<
		Options['distributeItem'],
		Not<IsNever<Type>>
	> extends true
		? Type extends unknown // Distribute element
			? // Returns true if both extends eachother or boolean if only one extends the other
			| ExtendsStrict<Type, Item>
			| ExtendsStrict<Item, Type>
			: never
		: IsEqual<Type, Item>;

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

type T4 = Includes<[1, 2, 3?], 3>;
//=> boolean

type T5 = Includes<[1, 3, 3?], 3>;
//=> true

type T6 = Includes<[1, 2, 3], 1 | 4, {distributeItem: true}>;
//=> boolean

type T7 = Includes<[string, number], 'a', {distributeItem: true}>;
//=> boolean
```

@see {@link IncludesOptions `IncludesOptions`}
@category Array
*/
export type Includes<
	Array_ extends UnknownArray, Item,
	Options extends IncludesOptions = {},
> =
	IsAnyOrNever<Array_> extends true ? Array_ // Handle any/never
		: ApplyDefaultOptions<
			IncludesOptions,
			DefaultIncludesOptions,
			Options
		> extends infer ResolvedOptions extends Required<IncludesOptions>
			? And<
				ResolvedOptions['distributeItem'],
				Not<IsNever<Item>>
			> extends true
				? Item extends unknown // Distribute item
					? _Includes<Array_, Item, ResolvedOptions>
					: never
				: _Includes<Array_, Item, ResolvedOptions>
			: never;

type _Includes<
	Array_ extends UnknownArray, Item,
	Options extends Required<IncludesOptions>,
> =
	keyof Array_ & `${number}` extends never
		// Handle backward search
		? Array_ extends readonly [...infer Rest, infer Last]
			? IsEqualOrExtend<Last, Item, Options> extends infer Result
				? Result extends true // Distribute result
					? true
					: _Includes<Rest, Item, Options>
				: never
			// Handle rest element and result
			: Array_ extends readonly []
				? false // No match found
				: IsEqualOrExtend<Array_[number], Item, Options> extends infer Result
					? Result extends true
						? boolean // Return boolean for rest elements unless finding a required one
						: false // No match found
					: never
		// Handle forward search
		: Array_ extends readonly [(infer First)?, ...infer Rest]
			? IsEqualOrExtend<First, Item, Options> extends infer Result
				? Result extends true ? true | (
					IsOptionalKeyOf<Array_, 0> extends true
						? _Includes<Rest, Item, Options> // Return boolean for optional elements unless finding a required one
						: never
					)
					: _Includes<Rest, Item, Options>
				: never
			: never;

export {};
