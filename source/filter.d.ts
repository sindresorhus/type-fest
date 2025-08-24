import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {OptionalKeysOf} from './optional-keys-of.d.ts';
import type {IsTruthy, Extends} from './internal/type.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {CleanEmpty} from './internal/array.d.ts';
import type {IsAny} from './is-any.d.ts';

/**
Filter options.

@see {@link Filter `Filter`}
*/
type FilterOptions = {
	/**
	Controls the strictness of type checking in {@link FilterType `FilterType`}.

	- When `true`, the entire union type **must** extend the filter type. For example, `string | number extends string` returns `false`.
	- When `false`, the check passes if **any** member of the union extends the filter type. For example, `string | number extends string` returns `true`.

	@default false
 	*/
	strict?: boolean;
};

type DefaultFilterOptions = {
	strict: false;
};

/**
Shorthand for `ApplyDefaultOptions<...>`
*/
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
type FilterType<T, U, S extends boolean> =
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

Strict controls whether strict or loose type comparison is used (defaults to loose).

@category Array
@category Utilities
*/
export type Filter<
	Array_ extends UnknownArray, Type,
	Options extends FilterOptions = {},
> = IsAny<Array_> extends true ? []
	: CleanEmpty<_Filter<Array_, Type, ApplyFilterOptions<Options>['strict']>>;

/**
Internal implementation of {@link Filter}.

Iterates through the array and includes elements in the accumulator if they pass `FilterType`.
*/
type _Filter<
	Array_ extends UnknownArray, Type,
	Strict extends boolean = false,
	HeadAcc extends any[] = [],
	TailAcc extends any[] = [],
> =
	keyof Array_ & `${number}` extends never // Is `Array_` leading a rest element or empty
		? Array_ extends readonly [...infer Rest, infer Last]
			? _Filter<Rest, Type, Strict, HeadAcc, [
				...IfFilter<FilterType<Last, Type, Strict>, [Last]>,
				...TailAcc,
			]>
			: [
				...HeadAcc,
				...IfFilter<FilterType<Array_[number], Type, Strict>, Array_>,
				...TailAcc,
			]
		: Array_ extends readonly [(infer First)?, ...infer Rest]
			? _Filter<Rest, Type, Strict, [
				...HeadAcc,
				...IfFilter<FilterType<First, Type, Strict>,
					'0' extends OptionalKeysOf<Array_> // TODO: replace with `IsOptionalKeyOf`.
						? [First?] // Preserve optional modifier.
						: [First]
				>,
			], TailAcc>
			: never;
