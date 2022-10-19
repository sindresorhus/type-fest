import {expectTypeOf} from 'expect-type';
import type {SetNonNullable} from '../index';

// Update one possibly undefined key and one possibly null key to non-nullable.
declare const variation1: SetNonNullable<{a: number; b: string | undefined; c: boolean | null}, 'b' | 'c'>;
expectTypeOf(variation1).toEqualTypeOf<{a: number; b: string; c: boolean}>();

// Update a key that is possibly null or undefined.
declare const variation2: SetNonNullable<{a: number; b: string | null | undefined}, 'b'>;
expectTypeOf(variation2).toEqualTypeOf<{a: number; b: string}>();

// Update an optional key.
declare const variation3: SetNonNullable<{a: number; b?: string | undefined}, 'b'>;
expectTypeOf(variation3).toEqualTypeOf<{a: number; b?: string}>();

// Fail if type changes even if non-nullable is right.
declare const variation4: SetNonNullable<{a: number; b: string | undefined}, 'b'>;
expectTypeOf(variation4).not.toMatchTypeOf<{a: string; b: string}>();
