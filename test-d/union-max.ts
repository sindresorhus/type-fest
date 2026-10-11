import {expectTypeOf} from 'nz';
import type {NegativeInfinity, PositiveInfinity, UnionMax} from '../index.d.ts';

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
