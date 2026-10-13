import {expectTypeOf} from 'nz';
import type {UnionLength} from '../source/union-length.d.ts';
import type {IntRange} from '../source/int-range.d.ts';

expectTypeOf<UnionLength<string>>().toBe<1>();
expectTypeOf<UnionLength<boolean>>().toBe<2>();
expectTypeOf<UnionLength<string | number | symbol>>().toBe<3>();

// Non-primitives
expectTypeOf<UnionLength<[string] | Set<string> | {a: string}>>().toBe<3>();

// Both union members extend each other
expectTypeOf<UnionLength<{a: string} | {readonly a: string}>>().toBe<2>();

// Long unions
expectTypeOf<UnionLength<IntRange<0, 100>>>().toBe<100>();

// Boundary cases
expectTypeOf<UnionLength<never>>().toBe<0>();
expectTypeOf<UnionLength<any>>().toBe<1>();
expectTypeOf<UnionLength<unknown>>().toBe<1>();
