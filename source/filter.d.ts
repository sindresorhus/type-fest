import type {IsTruthy, Extends, IfNotAnyOrNever} from './internal/type.d.ts';
import type {IsArrayReadonly} from './internal/array.d.ts';
import type {ApplyDefaultOptions} from './internal/index.d.ts';
import type {IsOptionalKeyOf} from './is-optional-key-of.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {Simplify} from './simplify.d.ts';
import type {If} from './if.d.ts';

/**
{@link Filter `Filter`} options.
*/
export type FilterOptions = {
	/**
	Require the whole type of an element or property to extend the condition.

	By default, a union type is kept if any of its members extends the condition.

	@default false

	@example
	```
	import type {Filter} from 'type-fest';

	type T1 = Filter<[1, 2, 3 | 4, 3?], 3>;
	//=> [3 | 4, 3?]

	type T2 = Filter<[1, 2, 3 | 4, 3?], 3, {strict: true}>;
	//=> [3?]

	type T3 = Filter<{a: 1; b: 3 | 4; c?: 3}, 3>;
	//=> {b: 3 | 4; c?: 3}

	type T4 = Filter<{a: 1; b: 3 | 4; c?: 3}, 3, {strict: true}>;
	//=> {c?: 3}
	```
	*/
	strict?: boolean;
};

type DefaultFilterOptions = {
	strict: false;
};

/**
Returns a boolean for whether a value `Value` passes the filter `Condition`.

If `Condition` is `Boolean`, it checks whether `Value` is truthy like {@link Boolean `Boolean(value)`} does. Otherwise, it checks whether `Value` extends `Condition`.

Both checks use strict or loose mode, see {@link Extends `Extends`}.
*/
type Matches<Value, Condition, Strict extends boolean> =
	IsEqual<Condition, Boolean> extends true
		? Extends<IsTruthy<Value>, true, Strict>
		: Extends<Value, Condition, Strict>;

/**
Determines whether the array `V` should be kept based on the boolean type `T`.
*/
type IfFilter<T extends boolean, V extends UnknownArray> = [T] extends [true] ? V : [];

/**
Keep only the elements of an array, or the properties of an object, whose type extends the given condition, like `Array#filter()`.

Use `Boolean` as the condition to keep only truthy values, like `.filter(Boolean)`. It must be exactly `Boolean`.

An element or property whose type is a union is kept if any member of the union extends the condition. Use the `strict` option to require the whole union to extend it. The kept types are not narrowed.

Use-cases:
- Get the elements of a tuple that match a type, like the strings in a list of mixed values.
- Pick the properties of an object by the type of their values.

@example
```
import type {Filter} from 'type-fest';

type A = Filter<[1, 'a', 2, 'b'], number>;
//=> [1, 2]

type B = Filter<readonly [string, number?, ...boolean[]], number | boolean>;
//=> readonly [number?, ...boolean[]]

type C = Filter<[0, 'a', '', null, 1, boolean], Boolean>;
//=> ['a', 1, boolean]

type D = Filter<[1 | 'a', 2, 'b'], number>;
//=> [1 | 'a', 2]

type E = Filter<[1 | 'a', 2, 'b'], number, {strict: true}>;
//=> [2]
```

@example
```
import type {Filter} from 'type-fest';

type User = {
	id: number;
	name: string;
	nickname?: string;
	isAdmin: boolean;
};

type StringProperties = Filter<User, string>;
//=> {name: string; nickname?: string}
```

@category Array
@category Object
*/
export type Filter<
	Base extends UnknownArray | object,
	Condition,
	Options extends FilterOptions = {},
> = IfNotAnyOrNever<Base, {
	ifNot: Base extends unknown // For distributing `Base`
		? ApplyDefaultOptions<FilterOptions, DefaultFilterOptions, Options> extends infer ResolvedOptions extends Required<FilterOptions>
			? Base extends UnknownArray
				? FilterArray<Base, Condition, ResolvedOptions>
				: FilterObject<Base, Condition, ResolvedOptions>
			: never // Should never happen
		: never; // Should never happen
}>;

/**
Iterates through the object properties and keeps them if they pass {@link Matches `Matches`}.
*/
type FilterObject<
	Object_ extends object,
	Condition,
	Options extends Required<FilterOptions>,
> = Simplify<{
	// `Required` removes the `undefined` that an optional property adds to its type
	[Key in keyof Object_ as Matches<Required<Object_>[Key], Condition, Options['strict']> extends true ? Key : never]: Object_[Key]
}>;

/**
Iterates through the array elements and keeps them if they pass {@link Matches `Matches`}.
*/
type FilterArray<
	Array_ extends UnknownArray,
	Condition,
	Options extends Required<FilterOptions>,
> =
	_FilterArray<Array_, Condition, Options> extends infer Result extends UnknownArray
		? If<IsArrayReadonly<Array_>, Readonly<Result>, Result> // Preserve readonly modifier
		: never;

/**
Core implementation of {@link FilterArray}.
*/
type _FilterArray<
	Array_ extends UnknownArray,
	Condition,
	Options extends Required<FilterOptions>,
	HeadAcc extends UnknownArray = [],
	TailAcc extends UnknownArray = [],
> =
	keyof Array_ & `${number}` extends never // Is `Array_` a rest element or empty array
		? Array_ extends readonly [...infer Rest, infer Last]
			// Add `Last` to `TailAcc` if it passes the filter
			? _FilterArray<Rest, Condition, Options, HeadAcc, [
				...IfFilter<Matches<Last, Condition, Options['strict']>, [Last]>,
				...TailAcc,
			]>
			// Handle rest element (spread) or return the final result
			: [
				...HeadAcc,
				...IfFilter<Matches<Array_[number], Condition, Options['strict']>, Array_>,
				...TailAcc,
			]
		: Array_ extends readonly [(infer First)?, ...infer Rest]
			// Add `First` to `HeadAcc` if it passes the filter
			? _FilterArray<Rest, Condition, Options, [
				...HeadAcc,
				...IfFilter<
					Matches<First, Condition, Options['strict']>,
					// Preserve optional modifier
					If<IsOptionalKeyOf<Array_, 0>, [First?], [First]>
				>,
			], TailAcc>
			: never;

export {};
