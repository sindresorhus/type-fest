import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {IsOptionalKeyOf} from './is-optional-key-of.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {IsAnyOrNever} from './internal/type.d.ts';
import type {Inc, Neg} from './index-of.d.ts';
import type {IsEqual} from './is-equal.d.ts';

type IndicesOfOptions = {
	ignoreOptionalModifier?: boolean;
	// FromIndex?: number;
};

type DefaultIndicesOfOptions = {
	ignoreOptionalModifier: false;
	// FromIndex: 0;
};

export type IndicesOf<
	Array_ extends UnknownArray, Item,
	Options extends IndicesOfOptions = {},
> = IsAnyOrNever<Array_> extends true ? Array_
	: _IndicesOf<Array_, Item,
		ApplyDefaultOptions<
			IndicesOfOptions,
			DefaultIndicesOfOptions,
			Options
		>
	>;

type _IndicesOf<
	Array_ extends UnknownArray, Item,
	Options extends Required<IndicesOfOptions>,
	F_Index extends number[] = [],
	F_Indices extends Array<number | undefined> = [],
	B_Index extends number[] = [1],
	B_Indices extends Array<number | undefined> = [],
	T_Index extends number = F_Index['length'],
> =
	keyof Array_ & `${number}` extends never

		? Array_ extends readonly [...infer Rest, infer Last]
			? IsEqual<Last, Item> extends true
				? _IndicesOf<Rest, Item, Options, F_Index, F_Indices, Inc<B_Index>, [Neg<B_Index>, ...B_Indices]>
				: _IndicesOf<Rest, Item, Options, F_Index, F_Indices, Inc<B_Index>, B_Indices>

			: [
				...F_Indices,
				...Array_ extends readonly [] ? []
					: IsEqual<Array_[number], Item> extends false ? []
						: [Array_[number] | (number & {})],
				...B_Indices,
			]

		: Array_ extends readonly [(infer First)?, ...infer Rest]
			? IsEqual<First, Item> extends true
				? _IndicesOf<Rest, Item, Options, Inc<F_Index>, [
					...F_Indices,
					...Options['ignoreOptionalModifier'] extends true ? [T_Index]
						: IsOptionalKeyOf<Array_, '0'> extends false ? [T_Index]
							: [T_Index?],
				]>
				: _IndicesOf<Rest, Item, Options, Inc<F_Index>, F_Indices>

			: never;

export {};
