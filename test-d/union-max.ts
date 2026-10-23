import {expectTypeOf} from 'nz';
import type {IntRange, NegativeInfinity, PositiveInfinity, UnionMax} from '../index.d.ts';

expectTypeOf<UnionMax<1 | 3 | 2>>().toBe<3>();
expectTypeOf<UnionMax<10 | 5 | 2>>().toBe<10>();
expectTypeOf<UnionMax<0 | 5 | 2 | 1>>().toBe<5>();
expectTypeOf<UnionMax<1 | 2 | 5 | 3 | 7 | 9 | 0>>().toBe<9>();

// Negative numbers are not supported yet.
// expectType<UnionMax<-1 | -3 | -2>>(-1);
// expectType<UnionMax<0 | -5 | -2>>(0);

// Edge cases
expectTypeOf<any>().toBe<UnionMax<any>>();
expectTypeOf<never>().toBe<UnionMax<never>>();
expectTypeOf<number>().toBe<UnionMax<number>>();
expectTypeOf<number>().toBe<UnionMax<(number & {})>>();
expectTypeOf<number>().toBe<UnionMax<(number & {}) | 1 | 5>>();
expectTypeOf<PositiveInfinity>().toBe<UnionMax<PositiveInfinity>>();
expectTypeOf<NegativeInfinity>().toBe<UnionMax<NegativeInfinity>>();
expectTypeOf<PositiveInfinity>().toBe<UnionMax<1 | PositiveInfinity>>();
expectTypeOf<1>().toBe<UnionMax<1 | NegativeInfinity>>();

expectTypeOf<UnionMax<0>>().toBe<0>();
expectTypeOf<UnionMax<0 | 100>>().toBe<100>();
expectTypeOf<PositiveInfinity>().toBe<UnionMax<PositiveInfinity | NegativeInfinity>>();
expectTypeOf<UnionMax<0 | NegativeInfinity>>().toBe<0>();
expectTypeOf<2>().not.toBeAssignableTo<UnionMax<1 | 3 | 2>>();

const retryCounts = [0, 2, 5] as const;
expectTypeOf<UnionMax<typeof retryCounts[number]>>().toBe<5>();

// @ts-expect-error Non-numeric unions are not supported.
type InvalidUnion = UnionMax<'1' | '2'>;

// Sparse and dense unions keep their exact maximum across different magnitudes.
expectTypeOf<UnionMax<1 | 900>>().toBe<900>();
expectTypeOf<UnionMax<0 | 900 | NegativeInfinity>>().toBe<900>();
expectTypeOf<UnionMax<900 | PositiveInfinity>>().toBe<PositiveInfinity>();
expectTypeOf<UnionMax<0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9>>().toBe<9>();

// Finding a maximum should not spend a second recursion step removing each matched member.
type DenseCandidates = IntRange<0, 600>;
expectTypeOf<UnionMax<DenseCandidates>>().toBe<599>();
expectTypeOf<UnionMax<Exclude<DenseCandidates, 0>>>().toBe<599>();
expectTypeOf<UnionMax<DenseCandidates | NegativeInfinity>>().toBe<599>();
expectTypeOf<UnionMax<DenseCandidates | PositiveInfinity>>().toBe<PositiveInfinity>();
// @ts-expect-error - An unknown value cannot be compared.
type UnknownMaximum = UnionMax<unknown>;

// Enum members retain their known numeric values.
enum RetryLimit {
	None = 0,
	Low = 2,
	High = 5,
}
expectTypeOf<UnionMax<RetryLimit.Low | RetryLimit.High>>().toBe<5>();
expectTypeOf<UnionMax<RetryLimit.None>>().toBe<0>();
expectTypeOf<UnionMax<RetryLimit>>().toBe<5>();

declare enum RuntimeRetryLimit {
	Value,
}
expectTypeOf<UnionMax<RetryLimit.Low | 3>>().toBe<3>();
expectTypeOf<UnionMax<RetryLimit.High | 3>>().toBe<5>();
expectTypeOf<UnionMax<RetryLimit.None | NegativeInfinity>>().toBe<0>();
expectTypeOf<UnionMax<RetryLimit.High | NegativeInfinity>>().toBe<5>();
expectTypeOf<UnionMax<RetryLimit.High | PositiveInfinity>>().toBe<PositiveInfinity>();
expectTypeOf<UnionMax<RuntimeRetryLimit.Value>>().toBe<number>();
expectTypeOf<UnionMax<RetryLimit | number>>().toBe<number>();
expectTypeOf<UnionMax<RetryLimit | any>>().toBe<any>();
expectTypeOf<UnionMax<RetryLimit | never>>().toBe<5>();
