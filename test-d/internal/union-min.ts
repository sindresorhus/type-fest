import {expectType} from 'tsd';
import type {UnionMin} from '../../source/internal/numeric.d.ts';

expectType<UnionMin<1 | 3 | 2>>(1);
expectType<UnionMin<10 | 5 | 2>>(2);
expectType<UnionMin<0 | 5 | 2 | 1>>(0);
expectType<UnionMin<1 | 2 | 5 | 3 | 7 | 9 | 0>>(0);

// Negatives are not supported yet (skiped)
expectType<UnionMin<-1 | 3 | 2>>(2);
expectType<UnionMin<0 | -5 | 2>>(0);

expectType<UnionMin<number>>(0);
expectType<UnionMin<(number & {})>>(0);
expectType<UnionMin<(number & {}) | 1 | 5>>(0);

expectType<UnionMin<any>>({} as any);
expectType<UnionMin<never>>({} as never);
