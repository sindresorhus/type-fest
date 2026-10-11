import {expectTypeOf} from 'nz';
import type {AndAll} from '../source/and-all.d.ts';

declare const boolean: boolean;

// Basic boolean combinations
expectTypeOf<AndAll<[true, true]>>().toBe<true>();
expectTypeOf<AndAll<[true, false]>>().toBe<false>();
expectTypeOf<AndAll<[false, true]>>().toBe<false>();
expectTypeOf<AndAll<[false, false]>>().toBe<false>();

// Multiple elements in a tuple
expectTypeOf<AndAll<[true, true, true, true]>>().toBe<true>();
expectTypeOf<AndAll<[true, true, true, false]>>().toBe<false>();
expectTypeOf<AndAll<[true, true, false, true]>>().toBe<false>();

// `boolean` element
expectTypeOf(boolean).toBe<AndAll<[true, true, boolean]>>();
expectTypeOf<AndAll<[true, boolean, false]>>().toBe<false>();
expectTypeOf(boolean).toBe<AndAll<[boolean, boolean, boolean]>>();

// Unions
expectTypeOf(boolean).toBe<AndAll<[true, true, true] | [true, true, false]>>(); // `true` | `false`
expectTypeOf<AndAll<[true, true] | [true]>>().toBe<true>(); // `true` | `true`
expectTypeOf<AndAll<[false] | [true, false, true]>>().toBe<false>(); // `false` | `false`
expectTypeOf(boolean).toBe<AndAll<[true, true] | [true, boolean]>>(); // `true` | `boolean`
expectTypeOf(boolean).toBe<AndAll<[false, true] | [true, true, boolean]>>(); // `false` | `boolean`
expectTypeOf(boolean).toBe<AndAll<[boolean, true, true] | [boolean]>>(); // `boolean` | `boolean`

// Tuples with rest element
expectTypeOf<AndAll<[true, ...Array<true>]>>().toBe<true>();
expectTypeOf<AndAll<[...Array<true>, false]>>().toBe<false>();
expectTypeOf(boolean).toBe<AndAll<[true, ...Array<true>, boolean]>>();

// Non-tuple arrays
expectTypeOf<AndAll<Array<true>>>().toBe<true>();
expectTypeOf<AndAll<Array<false>>>().toBe<false>();
expectTypeOf(boolean).toBe<AndAll<boolean[]>>();

// Readonly arrays
expectTypeOf<AndAll<readonly [true, true, true]>>().toBe<true>();
expectTypeOf<AndAll<readonly [true, true, false]>>().toBe<false>();
expectTypeOf(boolean).toBe<AndAll<readonly [true, true, boolean]>>();
expectTypeOf<AndAll<ReadonlyArray<true>>>().toBe<true>();
expectTypeOf<AndAll<ReadonlyArray<false>>>().toBe<false>();
expectTypeOf(boolean).toBe<AndAll<readonly boolean[]>>();

// Boundary cases
expectTypeOf<AndAll<[]>>().toBe<true>();

expectTypeOf<AndAll<[any, any, false]>>().toBe<false>();
expectTypeOf(boolean).toBe<AndAll<[any, any, true]>>();
expectTypeOf(boolean).toBe<AndAll<[any, any, any]>>();

expectTypeOf<AndAll<[false, never, never]>>().toBe<false>();
expectTypeOf<AndAll<[true, true, never]>>().toBe<false>();
expectTypeOf<AndAll<[never, never, never]>>().toBe<false>();

// Errors with non-boolean or optional elements
// @ts-expect-error
type Error1 = AndAll<[1, 0]>;
// @ts-expect-error
type Error2 = AndAll<[true, false?]>;
