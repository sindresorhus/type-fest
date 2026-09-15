import {expectNotAssignable, expectType} from 'tsd';
import type {NegativeInfinity, PositiveInfinity, UnionMax} from '../index.d.ts';

expectType<UnionMax<1 | 3 | 2>>(3);
expectType<UnionMax<10 | 5 | 2>>(10);
expectType<UnionMax<0 | 5 | 2 | 1>>(5);
expectType<UnionMax<1 | 2 | 5 | 3 | 7 | 9 | 0>>(9);

// Negative numbers are not supported yet.
// expectType<UnionMax<-1 | -3 | -2>>(-1);
// expectType<UnionMax<0 | -5 | -2>>(0);

// Edge cases
expectType<UnionMax<any>>({} as any);
expectType<UnionMax<never>>({} as never);
expectType<UnionMax<number>>({} as number);
expectType<UnionMax<(number & {})>>({} as number);
expectType<UnionMax<(number & {}) | 1 | 5>>({} as number);
expectType<UnionMax<PositiveInfinity>>({} as PositiveInfinity);
expectType<UnionMax<NegativeInfinity>>({} as NegativeInfinity);
expectType<UnionMax<1 | PositiveInfinity>>({} as PositiveInfinity);
expectType<UnionMax<1 | NegativeInfinity>>({} as 1);

expectType<UnionMax<0>>(0);
expectType<UnionMax<0 | 100>>(100);
expectType<UnionMax<PositiveInfinity | NegativeInfinity>>({} as PositiveInfinity);
expectType<UnionMax<0 | NegativeInfinity>>(0);
expectNotAssignable<UnionMax<1 | 3 | 2>>(2);

const retryCounts = [0, 2, 5] as const;
expectType<UnionMax<typeof retryCounts[number]>>(5);

// @ts-expect-error Non-numeric unions are not supported.
type InvalidUnion = UnionMax<'1' | '2'>;
