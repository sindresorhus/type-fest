import {expectTypeOf} from 'nz';
import type {OrAll} from '../source/or-all.d.ts';

declare const boolean: boolean;

// Basic boolean combinations
expectTypeOf<OrAll<[true, false]>>().toBe<true>();
expectTypeOf<OrAll<[false, true]>>().toBe<true>();
expectTypeOf<OrAll<[true, true]>>().toBe<true>();
expectTypeOf<OrAll<[false, false]>>().toBe<false>();

// Multiple elements in a tuple
expectTypeOf<OrAll<[false, false, false, true]>>().toBe<true>();
expectTypeOf<OrAll<[false, false, false, false]>>().toBe<false>();

// `boolean` element
expectTypeOf(boolean).toBe<OrAll<[false, false, boolean]>>();
expectTypeOf<OrAll<[false, boolean, true]>>().toBe<true>();
expectTypeOf(boolean).toBe<OrAll<[boolean, boolean, boolean]>>();

// Unions
expectTypeOf(boolean).toBe<OrAll<[false, false, true] | [false, false, false]>>(); // `true` | `false`
expectTypeOf<OrAll<[false, true, false] | [true]>>().toBe<true>(); // `true` | `true`
expectTypeOf<OrAll<[false] | [false, false, false]>>().toBe<false>(); // `false` | `false`
expectTypeOf(boolean).toBe<OrAll<[true, false] | [false, boolean]>>(); // `true` | `boolean`
expectTypeOf(boolean).toBe<OrAll<[false, false] | [false, false, boolean]>>(); // `false` | `boolean`
expectTypeOf(boolean).toBe<OrAll<[boolean, false, false] | [boolean]>>(); // `boolean` | `boolean`

// Tuples with rest element
expectTypeOf<OrAll<[false, ...Array<false>]>>().toBe<false>();
expectTypeOf<OrAll<[...Array<false>, true]>>().toBe<true>();
expectTypeOf(boolean).toBe<OrAll<[false, ...Array<false>, boolean]>>();

// Non-tuple arrays
expectTypeOf<OrAll<Array<true>>>().toBe<true>();
expectTypeOf<OrAll<Array<false>>>().toBe<false>();
expectTypeOf(boolean).toBe<OrAll<boolean[]>>();

// Readonly arrays
expectTypeOf<OrAll<readonly [true, false, true]>>().toBe<true>();
expectTypeOf<OrAll<readonly [false, false, false]>>().toBe<false>();
expectTypeOf(boolean).toBe<OrAll<readonly [false, false, boolean]>>();
expectTypeOf<OrAll<ReadonlyArray<true>>>().toBe<true>();
expectTypeOf<OrAll<ReadonlyArray<false>>>().toBe<false>();
expectTypeOf(boolean).toBe<OrAll<readonly boolean[]>>();

// Boundary cases
expectTypeOf<OrAll<[]>>().toBe<false>();

expectTypeOf(boolean).toBe<OrAll<[any, any, false]>>();
expectTypeOf<OrAll<[any, any, true]>>().toBe<true>();
expectTypeOf(boolean).toBe<OrAll<[any, any, any]>>();

expectTypeOf<OrAll<[never, never, false]>>().toBe<false>();
expectTypeOf<OrAll<[never, never, true]>>().toBe<true>();
expectTypeOf<OrAll<[never, never, never]>>().toBe<false>();

// Errors with non-boolean or optional elements
// @ts-expect-error
type Error1 = OrAll<[1, 0]>;
// @ts-expect-error
type Error2 = OrAll<[true, false?]>;
