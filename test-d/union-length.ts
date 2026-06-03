import {expectType} from 'tsd';
import type {UnionLength} from '../source/union-length.d.ts';
import type {IntRange} from '../source/int-range.d.ts';

expectType<1>({} as UnionLength<string>);
expectType<2>({} as UnionLength<boolean>);
expectType<3>({} as UnionLength<string | number | symbol>);

// Non-primitives
expectType<3>({} as UnionLength<{a: string} | [string] | Set<string>>);

// Both union members extend each other
expectType<2>({} as UnionLength<{a: string} | {readonly a: string}>);

// Long unions
expectType<100>({} as UnionLength<IntRange<0, 100>>);

// Boundary cases
expectType<0>({} as UnionLength<never>);
expectType<1>({} as UnionLength<any>);
expectType<1>({} as UnionLength<unknown>);
