import type {CleanEmpty, EmptyArray, IsLeadingRestElement} from './internal/array.d.ts';
import type {Extends, IsTruthy} from './internal/type.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {If} from './if.d.ts';

/**
Determines whether a value `T` should be kept based on the filtering type `U`.

If `U` is `Boolean`, it checks whether `T` is `truthy` like {@link Boolean `Boolean(T)`} does.

Otherwise, it uses {@link Extends `Extends<T, U, S>`} to check if `T extends U` with strict or loose mode.
*/
export type FilterType<T, U, S extends boolean> = Boolean extends U ? IsTruthy<T> : Extends<T, U, S>;

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
// TODO: Maybe integrate `SplitOnRestElement`.
type _ArrayFilter<
	Array_ extends UnknownArray, Type,
	Strict extends boolean,
	HeadAcc extends any[] = [],
	TailAcc extends any[] = [],
> = Array_ extends EmptyArray ? [...HeadAcc, ...TailAcc]
	: IsLeadingRestElement<Array_> extends false
		? (/* eslint-disable @stylistic/indent */
			| Array_ extends readonly [infer Head, ...infer Tail] ? [false, Head, Tail]
			: Array_ extends readonly [(infer Head)?, ...infer Tail] ? [true, Head, Tail]
			: never /* eslint-enable @stylistic/indent */
		) extends [infer IsOptional extends boolean, infer Head, infer Tail extends UnknownArray]
			? FilterType<Head, Type, Strict> extends true
				? _ArrayFilter<Tail, Type, Strict, [...HeadAcc, ...If<IsOptional, [Head?], [Head]>], TailAcc>
				: _ArrayFilter<Tail, Type, Strict, HeadAcc, TailAcc>
			: never
		: (
			Array_ extends readonly [...infer Head, infer Tail]
				? [false, Head, Tail]
				: [true, [], Array_[number]]
		) extends [infer IsRest extends boolean, infer Head extends UnknownArray, infer Tail]
			? FilterType<Tail, Type, Strict> extends true
				? _ArrayFilter<Head, Type, Strict, HeadAcc, [...If<IsRest, Array_, [Tail]>, ...TailAcc]>
				: _ArrayFilter<Head, Type, Strict, HeadAcc, TailAcc>
			: never;
