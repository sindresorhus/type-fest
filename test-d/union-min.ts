import {expectNotAssignable, expectType} from 'tsd';
import type {NegativeInfinity, PositiveInfinity, UnionMin} from '../index.d.ts';

expectType<UnionMin<1 | 3 | 2>>(1);
expectType<UnionMin<10 | 5 | 2>>(2);
expectType<UnionMin<0 | 5 | 2 | 1>>(0);
expectType<UnionMin<1 | 2 | 5 | 3 | 7 | 9 | 0>>(0);

// Negative numbers are not supported yet.
// expectType<UnionMin<-1 | -3 | -2>>(-3);
// expectType<UnionMin<0 | -5 | -2>>(-5);

// Edge cases
expectType<UnionMin<any>>({} as any);
expectType<UnionMin<never>>({} as never);
expectType<UnionMin<number>>({} as number);
expectType<UnionMin<(number & {})>>({} as number);
expectType<UnionMin<(number & {}) | 1 | 5>>({} as number);
expectType<UnionMin<PositiveInfinity>>({} as PositiveInfinity);
expectType<UnionMin<NegativeInfinity>>({} as NegativeInfinity);
expectType<UnionMin<1 | PositiveInfinity>>({} as 1);
expectType<UnionMin<1 | NegativeInfinity>>({} as NegativeInfinity);

expectType<UnionMin<0>>(0);
expectType<UnionMin<0 | 100>>(0);
expectType<UnionMin<PositiveInfinity | NegativeInfinity>>({} as NegativeInfinity);
expectType<UnionMin<0 | PositiveInfinity>>(0);
expectNotAssignable<UnionMin<1 | 3 | 2>>(2);

const pageSizes = [10, 20, 50] as const;
expectType<UnionMin<typeof pageSizes[number]>>(10);

// @ts-expect-error Non-numeric unions are not supported.
type InvalidUnion = UnionMin<'1' | '2'>;
