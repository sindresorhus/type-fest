import type {GreaterThanOrEqual} from './greater-than-or-equal.d.ts';
import type {ApplyDefaultOptions} from './internal/object.d.ts';
import type {IsOptionalKeyOf} from './is-optional-key-of.d.ts';
import type {Inc, Neg, IndexOfOptions} from './index-of.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {IsAnyOrNever} from './internal/type.d.ts';
import type {LiteralUnion} from './literal-union.d.ts';
import type {GreaterThan} from './greater-than.d.ts';
import type {IsEqual} from './is-equal.d.ts';

type DefaultLastIndexOfOptions = {
    ignoreOptionalModifier: false;
    fromIndex: 0;
}

type IsLastOptional<T extends UnknownArray> =
    T extends [...infer Rest, (infer _)?]
        ? [...Rest] extends T
            ? true
            : false
        : false;

export type LastIndexOf<
    Array_ extends UnknownArray, Item,
    Options extends IndexOfOptions = {},
> = IsAnyOrNever<Array_> extends true ? Array_
    : _LastIndexOf<Array_, Item,
        ApplyDefaultOptions<
            IndexOfOptions,
            DefaultLastIndexOfOptions,
            Options
        >
    >;

type _LastIndexOf<
    Array_ extends UnknownArray, Item,
    Options extends Required<IndexOfOptions>,
    F_Index extends number[] = [],
    B_Index extends number[] = [1],
    T_Index extends number = never,
> =
    number extends Array_['length']
        ? keyof Array_ & `${number}` extends never

            ? Array_ extends readonly [...infer Rest, infer Last]
                ? GreaterThan<B_Index['length'], Options['fromIndex']> extends true
                    ? IsEqual<Last, Item> extends true ? Neg<B_Index>
                        : _LastIndexOf<Rest, Item, Options, F_Index, Inc<B_Index>, T_Index>
                    : _LastIndexOf<Rest, Item, Options, F_Index, Inc<B_Index>, T_Index>

                : Array_ extends readonly [] ? T_Index
                    : IsEqual<Array_[number], Item> extends false ? T_Index
                        : LiteralUnion<F_Index['length'], number>

            : Array_ extends readonly [(infer First)?, ...infer Rest]
                ? IsEqual<First, Item> extends true
                    ? _LastIndexOf<Rest, Item, Options, Inc<F_Index>, B_Index,
                        F_Index['length'] | (
                            Options['ignoreOptionalModifier'] extends true ? never
                                : IsOptionalKeyOf<Array_, '0'> extends false ? never
                                    : _LastIndexOf<Rest, Item, Options, Inc<F_Index>, B_Index, T_Index>)>
                    : _LastIndexOf<Rest, Item, Options, Inc<F_Index>, B_Index, T_Index>
                : never

        : Array_ extends readonly [...infer Rest, (infer Last)?]
            ? GreaterThanOrEqual<F_Index['length'], Options['fromIndex']> extends true
                ? IsEqual<Last, Item> extends true
                    ? Required<Rest>['length'] | (
                        Options['ignoreOptionalModifier'] extends true ? never
                            : IsLastOptional<Array_> extends false ? never
                                : _LastIndexOf<Rest, Item, Options, Inc<F_Index>>)
                    : _LastIndexOf<Rest, Item, Options, Inc<F_Index>>
                : _LastIndexOf<Rest, Item, Options, Inc<F_Index>>
            : never


type T = LastIndexOf<[1, 3, 6, 6, ...10[], 8, 10, 4, 2, 4, 6], 4, {fromIndex: 0, ignoreOptionalModifier: false}>
//    ^?

export {};