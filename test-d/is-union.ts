import {expectType} from 'tsd';
import type {IsUnion} from '../index';

declare function isUnion<T>(): IsUnion<T>;

enum Nums {
	ONE,
	TWO,
}

// Non-union types.
expectType<false>(isUnion<1>());
expectType<false>(isUnion<number>());
expectType<false>(isUnion<string>());
expectType<false>(isUnion<`#${number}`>());

// Unions of self are not unions.
expectType<false>(isUnion<1 | 1>());

// Union types.
expectType<true>(isUnion<1 | 2>());
expectType<true>(isUnion<number | string>());
expectType<true>(isUnion<'a' | 'b'>());
expectType<true>(isUnion<Nums.ONE | Nums.TWO>());

// Surprising union types.
expectType<true>(isUnion<boolean>());
expectType<true>(isUnion<Nums>());
