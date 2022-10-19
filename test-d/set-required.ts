import {expectTypeOf} from 'expect-type';
import type {SetRequired} from '../index';

// Update one required and one optional to required.
declare const variation1: SetRequired<{a?: number; b: string; c?: boolean}, 'b' | 'c'>;
expectTypeOf(variation1).toEqualTypeOf<{a?: number; b: string; c: boolean}>();

// Update two optional to required.
declare const variation2: SetRequired<{a?: number; b?: string; c?: boolean}, 'a' | 'b'>;
expectTypeOf(variation2).toEqualTypeOf<{a: number; b: string; c?: boolean}>();

// Three required remain required.
declare const variation3: SetRequired<{a: number; b: string; c: boolean}, 'a' | 'b' | 'c'>;
expectTypeOf(variation3).toEqualTypeOf<{a: number; b: string; c: boolean}>();

// Fail if type changes even if optional is right.
declare const variation4: SetRequired<{a?: number; b: string; c?: boolean}, 'b' | 'c'>;
expectTypeOf(variation4).not.toMatchTypeOf<{a?: boolean; b: string; c: boolean}>();
