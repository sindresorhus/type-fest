import type {OptionalKeysOf} from './optional-keys-of.d.ts';
import type {IsTruthy, Extends} from './internal/type.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {CleanEmpty} from './internal/array.d.ts';
import type {IsAny} from './is-any.d.ts';

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
type IfFilter<T extends boolean, V extends UnknownArray> = T extends true ? V : [];

/**
Filters elements from an `Array_` based on whether they match the given `Type`.

If `Type` is `Boolean`, it filters out `falsy` values like {@link Boolean `Boolean(T)`} does.

Strict controls whether strict or loose type comparison is used (defaults to loose).
*/
export type ArrayFilter<
	Array_ extends UnknownArray, Type,
	Strict extends boolean = false,
> = IsAny<Array_> extends true ? []
	: CleanEmpty<_ArrayFilter<Array_, Type, Strict>>;

/**
Internal implementation of {@link ArrayFilter}.

Iterates through the array and includes elements in the accumulator if they pass `FilterType`.
*/
type _ArrayFilter<
	Array_ extends UnknownArray, Type,
	Strict extends boolean = false,
	Head extends any[] = [],
	Tail extends any[] = [],
> =
	keyof Array_ & `${number}` extends never // Is `Array_` leading a rest element or empty
		? Array_ extends readonly [...infer Rest, infer Last]
			? _ArrayFilter<Rest, Type, Strict, Head, [
				...IfFilter<FilterType<Last, Type, Strict>, [Last]>,
				...Tail,
			]>
			: [
				...Head,
				...IfFilter<FilterType<Array_[number], Type, Strict>, Array_>,
				...Tail,
			]
		: Array_ extends readonly [(infer First)?, ...infer Rest]
			? _ArrayFilter<Rest, Type, Strict, [
				...Head,
				...IfFilter<FilterType<First, Type, Strict>,
					'0' extends OptionalKeysOf<Array_> // TODO: replace with `IsOptionalKeyOf`.
						? [First?]
						: [First]
				>,
			], Tail>
			: never;
