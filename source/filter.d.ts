import type {IsTruthy, Extends, IsAnyOrNever} from './internal/type.d.ts';
import type {CleanEmpty, IsArrayReadonly} from './internal/array.d.ts';
import type {ApplyDefaultOptions} from './internal/index.d.ts';
import type {IsOptionalKeyOf} from './is-optional-key-of.d.ts';
import type {UnknownRecord} from './unknown-record.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {Simplify} from './simplify.d.ts';
import type {If} from './if.d.ts';

/**
{@link Filter `Filter`} options.
*/
export type FilterOptions = {
	/**
	Controls the strictness of type checking when filtering.

	- When `true`, the entire union type **must** extend the filter type. For example, `string | number extends string` returns `false`.
	- When `false`, the check passes if **any** member of the union extends the filter type. For example, `string | number extends string` returns `true`.

	@default false

	@example
	```
	import type {Filter} from 'type-fest';

	type T1 = Filter<[1, 2, 3 | 4, 3?, 4?], 3>;
	//=> [3 | 4, 3?]

	type T2 = Filter<[1, 2, 3 | 4, 3?, 4?], 3, {strict: true}>;
	//=> [3?]

	type T3 = Filter<{a: 1; b: 2; c: 3 | 4; d?: 3; e?: 4}, 3>;
	//=> {c: 3 | 4; d?: 3}

	type T4 = Filter<{a: 1; b: 2; c: 3 | 4; d?: 3; e?: 4}, 3, {strict: true}>;
	//=> {d?: 3}
	```
 	*/
	strict?: boolean;
};

type DefaultFilterOptions = {
	strict: false;
};

/**
Returns a boolean for whether a value `T` extends the filtering type `U`.

If `U` is `Boolean`, it checks whether `T` is `truthy` like {@link Boolean `Boolean(T)`} does.

Otherwise, it uses {@link Extends `Extends<T, U, S>`} to check if `T extends U` with strict or loose mode.
*/
type FilterType<T, U, S extends boolean> =
	Boolean extends U
		? IsTruthy<T>
		: Extends<T, U, S>;

/**
Determines whether the array `V` should be kept based on the boolean type `T`.
*/
type IfFilter<T extends boolean, V extends UnknownArray> = [T] extends [true] ? V : [];

/**
Filters elements or properties from an array or object based on whether they extend the specified filter type.

If `FilterType` is `Boolean`, it filters out `falsy` values like {@link Boolean `Boolean(T)`} does.

Optional control for strict or loose type comparison.

@example
```
import type {Filter} from 'type-fest';

type A1 = Filter<[1, 2, 3 | 4, 3?, 4?], 3>;
//=> [3 | 4, 3?]

type A2 = Filter<[1, 2, 3 | 4, 3?, 4?], 3, {strict: true}>;
//=> [3?]

type A3 = Filter<['foo1', 'bar2', 'fooo', 'foo3'], `foo${number}`>;
//=> ['foo1', 'foo3']

type A4 = Filter<[1, '2', 3, 'foo', false], string | number>;
//=> [1, '2', 3, 'foo']

type A5 = Filter<[true, false, boolean, 0, 1], Boolean>;
//=> [true, 1]

type A6 = Filter<[0, '', false, null, undefined, 'ok', 42], Boolean>;
//=> ['ok', 42]
```

@example
```
import type {Filter} from 'type-fest';

type O1 = Filter<{a: 1; b: 2; c: 3 | 4; d?: 3; e?: 4}, 3>;
//=> {c: 3 | 4; d?: 3}

type O2 = Filter<{a: 1; b: 2; c: 3 | 4; d?: 3; e?: 4}, 3, {strict: true}>;
//=> {c?: 3}

type O3 = Filter<{a: 'foo1'; b: 'bar2'; c: 'fooo'; d: 'foo3'}, `foo${number}`>;
//=> {a: 'foo1'; d: 'foo3'}

type O4 = Filter<{a: 1; b: '2'; c: 3; d: 'foo'; e: false}, string | number>;
//=> {a: 1; b: '2'; c: 3; d: 'foo'}

type O5 = Filter<{a: true; b: false; c: boolean; d: 0; e: 1}, Boolean>;
//=> {a: true; e: 1}

type O6 = Filter<{a: 0; b: ''; c: false; d: null; e: undefined; f: 'ok'; g: 42}, Boolean>;
//=> {f: 'ok'; g: 42}
```

@category Array
@category Object
@category Utilities
*/
export type Filter<
	BaseType extends UnknownArray | UnknownRecord,
	FilterType,
	Options extends FilterOptions = {},
> = IsAnyOrNever<BaseType> extends true ? BaseType
	: ApplyDefaultOptions<
		FilterOptions,
		DefaultFilterOptions,
		Options
	> extends infer ResolvedOptions extends Required<FilterOptions>
		? CleanEmpty<
			BaseType extends UnknownArray
				? FilterArray<BaseType, FilterType, ResolvedOptions>
				: BaseType extends UnknownRecord
					? FilterObject<BaseType, FilterType, ResolvedOptions>
					: never
		>
		: never;

/**
Iterates through the object properties and keep them if they pass {@link FilterType `FilterType`}`.
*/
type FilterObject<
	Object_ extends UnknownRecord, Type,
	Options extends Required<FilterOptions>,
> = Simplify<{
	[Key in keyof Object_ as
	FilterType<Object_[Key], Type, Options['strict']> extends true
		? Key
		: never
	]: Object_[Key]
}>;

/**
Iterates through the array elements and keep them if they pass {@link FilterType `FilterType`}`.
*/
type FilterArray<
	Array_ extends UnknownArray, Type,
	Options extends Required<FilterOptions>,
> =
	_FilterArray<Array_, Type, Options> extends infer Result extends UnknownArray
		? If<IsArrayReadonly<Array_>, Readonly<Result>, Result> // Preserve readonly modifier
		: never;

/**
Core implementation of {@link FilterArray}.
*/
type _FilterArray<
	Array_ extends UnknownArray, Type,
	Options extends Required<FilterOptions>,
	HeadAcc extends UnknownArray = [],
	TailAcc extends UnknownArray = [],
> =
	keyof Array_ & `${number}` extends never // Is `Array_` leading a rest element or empty
		? Array_ extends readonly [...infer Rest, infer Last]
			// Add `Last` to `TailAcc` if it passes the filter
			? _FilterArray<Rest, Type, Options, HeadAcc, [
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
			// Add `First` to `HeadAcc` if it passes the filter
			? _FilterArray<Rest, Type, Options, [
				...HeadAcc,
				...IfFilter<
					FilterType<First, Type, Options['strict']>,
					// Preserve optional modifier
					If<IsOptionalKeyOf<Array_, 0>, [First?], [First]>
				>,
			], TailAcc>
			: never;
export {};
