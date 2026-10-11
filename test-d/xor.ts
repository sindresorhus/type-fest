import {expectTypeOf} from 'nz';
import type {Xor} from '../source/xor.d.ts';

declare const boolean: boolean;

expectTypeOf<Xor<true, true>>().toBe<false>();
expectTypeOf<Xor<true, false>>().toBe<true>();
expectTypeOf<Xor<false, true>>().toBe<true>();
expectTypeOf<Xor<false, false>>().toBe<false>();

expectTypeOf(boolean).toBe<Xor<true, boolean>>();
expectTypeOf(boolean).toBe<Xor<boolean, true>>();
expectTypeOf(boolean).toBe<Xor<false, boolean>>();
expectTypeOf(boolean).toBe<Xor<boolean, false>>();
expectTypeOf(boolean).toBe<Xor<boolean, boolean>>();

// Boundary cases
expectTypeOf(boolean).toBe<Xor<true, any>>();
expectTypeOf(boolean).toBe<Xor<any, true>>();
expectTypeOf(boolean).toBe<Xor<false, any>>();
expectTypeOf(boolean).toBe<Xor<any, false>>();
expectTypeOf(boolean).toBe<Xor<boolean, any>>();
expectTypeOf(boolean).toBe<Xor<any, boolean>>();
expectTypeOf(boolean).toBe<Xor<any, any>>();

expectTypeOf<Xor<true, never>>().toBe<true>();
expectTypeOf<Xor<never, true>>().toBe<true>();
expectTypeOf<Xor<false, never>>().toBe<false>();
expectTypeOf<Xor<never, false>>().toBe<false>();
expectTypeOf(boolean).toBe<Xor<boolean, never>>();
expectTypeOf(boolean).toBe<Xor<never, boolean>>();
expectTypeOf<Xor<never, never>>().toBe<false>();
