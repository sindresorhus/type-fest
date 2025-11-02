import type {GreaterThanOrEqual} from './greater-than-or-equal.d.ts';
import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {IsOptionalKeyOf} from './is-optional-key-of.d.ts';
import type {ReverseSign} from './internal/numeric.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {IsAnyOrNever} from './internal/type.d.ts';
import type {LiteralUnion} from './literal-union.d.ts';
import type {IsEqual} from './is-equal.d.ts';

/* eslint-disable type-fest/require-exported-types */
export type Inc<T extends number[]> = [...T, 1];
export type Neg<T extends number[]> = ReverseSign<T['length']>;
export type IndexOfOptions = {
	ignoreOptionalModifier?: boolean;
	fromIndex?: number;
};
/* eslint-enable type-fest/require-exported-types */

type DefaultIndexOfOptions = {
	ignoreOptionalModifier: false;
	fromIndex: 0;
};

export type IndexOf<
	Array_ extends UnknownArray, Item,
	Options extends IndexOfOptions = {},
> = IsAnyOrNever<Array_> extends true ? Array_
	: _IndexOf<Array_, Item,
		ApplyDefaultOptions<
			IndexOfOptions,
			DefaultIndexOfOptions,
			Options
		>
	>;

type _IndexOf<
	Array_ extends UnknownArray, Item,
	Options extends Required<IndexOfOptions>,
	F_Index extends number[] = [],
	B_Index extends number[] = [1],
	T_Index extends number[] = never,
> =
	keyof Array_ & `${number}` extends never
		// Backward search
		? Array_ extends readonly [...infer Rest, infer Last]
			? IsEqual<Last, Item> extends true
				? _IndexOf<Rest, Item, Options, F_Index, Inc<B_Index>, B_Index>
				: _IndexOf<Rest, Item, Options, F_Index, Inc<B_Index>, T_Index>
			: Array_ extends readonly [] ? Neg<T_Index>
				: IsEqual<Array_[number], Item> extends false ? Neg<T_Index>
					: LiteralUnion<F_Index, number>
		// Forward search
		: Array_ extends readonly [(infer First)?, ...infer Rest]
			? GreaterThanOrEqual<F_Index['length'], Options['fromIndex']> extends true
				? IsEqual<First, Item> extends true ? F_Index['length'] | (
					Options['ignoreOptionalModifier'] extends true ? never
						: IsOptionalKeyOf<Array_, '0'> extends false ? never
							: _IndexOf<Rest, Item, Options, Inc<F_Index>>)
					: _IndexOf<Rest, Item, Options, Inc<F_Index>>
				: _IndexOf<Rest, Item, Options, Inc<F_Index>>

			: never;

export {};
