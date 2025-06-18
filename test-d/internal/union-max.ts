import {expectType} from 'tsd';
import type {UnionMax} from '../../source/internal/numeric.d.ts';

expectType<UnionMax<1 | 3 | 2>>(3);
expectType<UnionMax<10 | 5 | 2>>(10);
expectType<UnionMax<0 | 5 | 2 | 1>>(5);
expectType<UnionMax<1 | 2 | 5 | 3 | 7 | 9 | 0>>(9);

// Negatives are not supported yet (infinite)
// expectType<UnionMax<-1 | 3 | 2>>(2);
// expectType<UnionMax<0 | -5 | 2>>(5);

expectType<UnionMax<number>>({} as number);
expectType<UnionMax<(number & {})>>({} as number);
expectType<UnionMax<(number & {}) | 1 | 5>>({} as number);

expectType<UnionMax<any>>({} as any);
expectType<UnionMax<never>>({} as never);
