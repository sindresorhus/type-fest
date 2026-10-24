import {expectTypeOf} from 'nz';
import type {UnionMin} from '../../source/internal/numeric.d.ts';
import type {NegativeInfinity, PositiveInfinity, Tagged} from '../../index.d.ts';

expectTypeOf<UnionMin<1 | 3 | 2>>().toBe<1>();
expectTypeOf<UnionMin<10 | 5 | 2>>().toBe<2>();
expectTypeOf<UnionMin<0 | 5 | 2 | 1>>().toBe<0>();
expectTypeOf<UnionMin<1 | 2 | 5 | 3 | 7 | 9 | 0>>().toBe<0>();

// Negatives are not supported, as documented, because only tuple lengths are passed in (skipped)
// expectType<UnionMin<-1 | -3 | -2>>(-3);
// expectType<UnionMin<0 | -5 | -2>>(-5);

// Edge cases
expectTypeOf<any>().toBe<UnionMin<any>>();
expectTypeOf<never>().toBe<UnionMin<never>>();
expectTypeOf<number>().toBe<UnionMin<number>>();
expectTypeOf<number>().toBe<UnionMin<(number & {})>>();
expectTypeOf<number>().toBe<UnionMin<(number & {}) | 1 | 5>>();
expectTypeOf<PositiveInfinity>().toBe<UnionMin<PositiveInfinity>>();
expectTypeOf<NegativeInfinity>().toBe<UnionMin<NegativeInfinity>>();
expectTypeOf<1>().toBe<UnionMin<1 | PositiveInfinity>>();
expectTypeOf<NegativeInfinity>().toBe<UnionMin<1 | NegativeInfinity>>();

// Enum members retain their known numeric values.
enum Limit {
	Low = 3,
	High = 5,
}
expectTypeOf<UnionMin<Limit>>().toBe<3>();
expectTypeOf<UnionMin<Limit.High | 4>>().toBe<4>();

// A computed enum member has no known value.
declare enum RuntimeLimit {
	Value,
}
expectTypeOf<UnionMin<RuntimeLimit.Value | 3>>().toBe<number>();

// A brand does not hide the underlying value.
expectTypeOf<UnionMin<Tagged<5, 'Limit'> | 7>>().toBe<5>();
expectTypeOf<UnionMin<Tagged<3 | 5, 'Limit'>>>().toBe<3>();
expectTypeOf<UnionMin<Tagged<number, 'Limit'> | 3>>().toBe<number>();
