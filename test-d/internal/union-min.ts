import {expectType} from 'tsd';
import type {UnionMin} from '../../source/internal/numeric.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../../index.d.ts';

expectType<UnionMin<1 | 3 | 2>>(1);
expectType<UnionMin<10 | 5 | 2>>(2);
expectType<UnionMin<0 | 5 | 2 | 1>>(0);
expectType<UnionMin<1 | 2 | 5 | 3 | 7 | 9 | 0>>(0);

// TODO: push `negative-union-max-min` branch
// Negatives are not supported yet (skiped)
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
