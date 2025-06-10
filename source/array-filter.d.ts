import type {CleanEmpty, EmptyArray, IsLeadingRestElement} from './internal/array.d.ts';
import type {Extends, IsTruthy} from './internal/type.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {If} from './if.d.ts';

/**
Determines whether a value `T` should be kept based on the filtering type `U`.

If `U` is `Boolean`, it checks whether `T` is `truthy` like `Boolean(T)` does.

Otherwise, it uses `Extends<T, U, S>` to check if `T extends U` with strict or loose mode.
*/
export type FilterType<T, U, S extends boolean> = Boolean extends U ? IsTruthy<T> : Extends<T, U, S>;

/**
Filters elements from an `Array_` based on whether they match the given `Type`.

If `Type` is `Boolean`, it filters out `falsy` values like `Boolean(T)` does.

Strict controls whether strict or loose type comparison is used (defaults to loose).
*/
export type ArrayFilter<
	Array_ extends UnknownArray, Type,
	Strict extends boolean = false,
> = CleanEmpty<_ArrayFilter<Array_, Type, Strict>>;

/**
Internal implementation of {@link ArrayFilter}.

Iterates through the array and includes elements in the accumulator if they pass `FilterType`.
*/
type _ArrayFilter<Array_ extends UnknownArray, Type, Strict extends boolean, HeadAcc extends any[] = [], TailAcc extends any[] = []> = Array_ extends EmptyArray ? [...HeadAcc, ...TailAcc]
	: IsLeadingRestElement<Array_> extends false
		? (Array_ extends readonly [infer Head, ...infer Tail] ? [false, Head, Tail]
			: Array_ extends readonly [(infer Head)?, ...infer Tail] ? [true, Head, Tail]
				: never) extends [infer IsOptional extends boolean, infer Head, infer Tail extends UnknownArray]
			? FilterType<Head, Type, Strict> extends true
				? _ArrayFilter<Tail, Type, Strict, [...HeadAcc, ...If<IsOptional, [Head?], [Head]>], TailAcc>
				: _ArrayFilter<Tail, Type, Strict, HeadAcc, TailAcc>
			: 'never_A'
		: Array_ extends readonly [...infer Head, infer Tail]
			? FilterType<Tail, Type, Strict> extends true
				? _ArrayFilter<Head, Type, Strict, HeadAcc, [Tail, ...TailAcc]>
				: _ArrayFilter<Head, Type, Strict, HeadAcc, TailAcc>
			: FilterType<Array_[number], Type, Strict> extends true
				? _ArrayFilter<[], Type, Strict, HeadAcc, [...Array_, ...TailAcc]>
				: _ArrayFilter<[], Type, Strict, HeadAcc, TailAcc>
; // TODO: need improvements (use `SplitOnRestElement`).

type A = ArrayFilter<[true, string, true?, number?, ...string[]], string | true>;
//   ^?
