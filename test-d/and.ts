import {expectTypeOf} from 'nz';
import type {And} from '../source/and.d.ts';

declare const boolean: boolean;

expectTypeOf<And<true, true>>().toBe<true>();
expectTypeOf<And<true, false>>().toBe<false>();
expectTypeOf<And<false, true>>().toBe<false>();
expectTypeOf<And<false, false>>().toBe<false>();

expectTypeOf(boolean).toBe<And<true, boolean>>();
expectTypeOf(boolean).toBe<And<boolean, true>>();
expectTypeOf<And<false, boolean>>().toBe<false>();
expectTypeOf<And<boolean, false>>().toBe<false>();
expectTypeOf(boolean).toBe<And<boolean, boolean>>();

// Boundary cases
expectTypeOf(boolean).toBe<And<any, true>>();
expectTypeOf(boolean).toBe<And<true, any>>();
expectTypeOf<And<any, false>>().toBe<false>();
expectTypeOf<And<false, any>>().toBe<false>();
expectTypeOf(boolean).toBe<And<any, boolean>>();
expectTypeOf(boolean).toBe<And<boolean, any>>();
expectTypeOf(boolean).toBe<And<any, any>>();

expectTypeOf<And<never, true>>().toBe<false>();
expectTypeOf<And<true, never>>().toBe<false>();
expectTypeOf<And<never, false>>().toBe<false>();
expectTypeOf<And<false, never>>().toBe<false>();
expectTypeOf<And<never, boolean>>().toBe<false>();
expectTypeOf<And<boolean, never>>().toBe<false>();
expectTypeOf<And<never, never>>().toBe<false>();
