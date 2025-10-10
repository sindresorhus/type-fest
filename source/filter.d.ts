import type {CleanEmpty, IsArrayReadonly} from './internal/array.d.ts';
import type {ApplyDefaultOptions} from './internal/index.d.ts';
import type {IsOptionalKeyOf} from './is-optional-key-of.d.ts';
import type {IsTruthy, Extends} from './internal/type.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {If} from './if.d.ts';

/**
{@link Filter `Filter`} options.
*/
// eslint-disable-next-line type-fest/require-exported-types
export type FilterOptions = {
	/**
	Controls the strictness of type checking in {@link FilterType `FilterType`}.

	- When `true`, the entire union type **must** extend the filter type. For example, `string | number extends string` returns `false`.
	- When `false`, the check passes if **any** member of the union extends the filter type. For example, `string | number extends string` returns `true`.

	@default false

	@example
	```
	import type {Filter, FilterObject} from 'type-fest';

	type T1 = Filter<[1, 2, 3 | 4, 3?, 4?], 3>;
	//=> [3 | 4, 3?]

	type T2 = Filter<[1, 2, 3 | 4, 3?, 4?], 3, {strict: true}>;
	//=> [3?]

	type T3 = FilterObject<{a: 1; b: 2; c: 3 | 4; d?: 3; e?: 4}, 3>;
	//=> {c: 3 | 4; d?: 3}

	type T4 = FilterObject<{a: 1; b: 2; c: 3 | 4; d?: 3; e?: 4}, 3, {strict: true}>;
	//=> {d?: 3}
	```
 	*/
	strict?: boolean;
};

type DefaultFilterOptions = {
	strict: false;
};

/**
Shorthand for `ApplyDefaultOptions<...>`
*/
// eslint-disable-next-line type-fest/require-exported-types
export type ApplyFilterOptions<Options extends FilterOptions> =
	ApplyDefaultOptions<
		FilterOptions,
		DefaultFilterOptions,
		Options
	>;

/**
Returns a boolean for whether a value `T` extends the filtering type `U`.

If `U` is `Boolean`, it checks whether `T` is `truthy` like {@link Boolean `Boolean(T)`} does.

Otherwise, it uses {@link Extends `Extends<T, U, S>`} to check if `T extends U` with strict or loose mode.
*/
// eslint-disable-next-line type-fest/require-exported-types
export type FilterType<T, U, S extends boolean> =
	Boolean extends U
		? IsTruthy<T>
		: Extends<T, U, S>;

/**
Determines whether the array `V` should be kept based on the boolean type `T`.
*/
type IfFilter<T extends boolean, V extends UnknownArray> = [T] extends [true] ? V : [];

/**
Filters elements from an array based on whether they extend the given type.

If `Type` is `Boolean`, it filters out `falsy` values like {@link Boolean `Boolean(T)`} does.

Optional control for strict or loose type comparison.

@default loose

@example
```
import type {Filter} from 'type-fest';

type T1 = Filter<[1, 2, 3 | 4, 3?, 4?], 3>;
//=> [3 | 4, 3?]

type T2 = Filter<[1, 2, 3 | 4, 3?, 4?], 3, {strict: true}>;
//=> [3?]

type T3 = Filter<['foo1', 'bar2', 'fooo', 'foo3'], `foo${number}`>;
//=> ['foo1', 'foo3']

type T4 = Filter<[1, '2', 3, 'foo', false], string | number>;
//=> [1, '2', 3, 'foo']

type T5 = Filter<[true, false, boolean, 0, 1], Boolean>;
//=> [true, 1]

type T6 = Filter<[0, '', false, null, undefined, 'ok', 42], Boolean>;
//=> ['ok', 42]
```

@see ObjectFilter
@category Array
@category Utilities
*/
export type Filter<
	Array_ extends UnknownArray, Type,
	Options extends FilterOptions = {},
> = IsAny<Array_> extends true ? []
	: CleanEmpty<
		Array_ extends unknown // For distributing `Array_`
			? _Filter<
				Array_, Type,
				ApplyFilterOptions<Options>
			> extends infer Result extends UnknownArray
				? IsArrayReadonly<Array_> extends true
					? Readonly<Result> // Preserve readonly modifier
					: Result
				: never
			: never
	>;

/**
Internal implementation of {@link Filter}.

Iterates through the array and includes elements in the accumulator if they pass `FilterType`.
*/
type _Filter<
	Array_ extends UnknownArray, Type,
	Options extends Required<FilterOptions>,
	HeadAcc extends any[] = [],
	TailAcc extends any[] = [],
> =
	keyof Array_ & `${number}` extends never // Is `Array_` leading a rest element or empty
		? Array_ extends readonly [...infer Rest, infer Last]
			// Move `Last` to `TailAcc` if it passes the filter
			? _Filter<Rest, Type, Options, HeadAcc, [
				...IfFilter<FilterType<Last, Type, Options['strict']>, [Last]>,
				...TailAcc,
			]>
			// Handle rest element or result
			: [
				...HeadAcc,
				...IfFilter<FilterType<Array_[number], Type, Options['strict']>, Array_>,
				...TailAcc,
			]
		: Array_ extends readonly [(infer First)?, ...infer Rest]
			// Move `First` to `TailAcc` if it passes the filter
			? _Filter<Rest, Type, Options, [
				...HeadAcc,
				...IfFilter<
					FilterType<First, Type, Options['strict']>,
					// Preserve optional modifier
					If<IsOptionalKeyOf<Array_, '0'>, [First?], [First]>
				>,
			], TailAcc>
			: never;
export {};
