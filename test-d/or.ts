import {expectTypeOf} from 'nz';
import type {Or} from '../source/or.d.ts';

declare const boolean: boolean;

expectTypeOf<Or<true, true>>().toBe<true>();
expectTypeOf<Or<true, false>>().toBe<true>();
expectTypeOf<Or<false, true>>().toBe<true>();
expectTypeOf<Or<false, false>>().toBe<false>();

expectTypeOf<Or<true, boolean>>().toBe<true>();
expectTypeOf<Or<boolean, true>>().toBe<true>();
expectTypeOf(boolean).toBe<Or<false, boolean>>();
expectTypeOf(boolean).toBe<Or<boolean, false>>();
expectTypeOf(boolean).toBe<Or<boolean, boolean>>();

// Boundary cases
expectTypeOf<Or<true, any>>().toBe<true>();
expectTypeOf<Or<any, true>>().toBe<true>();
expectTypeOf(boolean).toBe<Or<false, any>>();
expectTypeOf(boolean).toBe<Or<any, false>>();
expectTypeOf(boolean).toBe<Or<boolean, any>>();
expectTypeOf(boolean).toBe<Or<any, boolean>>();
expectTypeOf(boolean).toBe<Or<any, any>>();

expectTypeOf<Or<true, never>>().toBe<true>();
expectTypeOf<Or<never, true>>().toBe<true>();
expectTypeOf<Or<false, never>>().toBe<false>();
expectTypeOf<Or<never, false>>().toBe<false>();
expectTypeOf(boolean).toBe<Or<boolean, never>>();
expectTypeOf(boolean).toBe<Or<never, boolean>>();
expectTypeOf<Or<never, never>>().toBe<false>();
