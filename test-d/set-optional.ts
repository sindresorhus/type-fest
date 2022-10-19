import {expectTypeOf} from 'expect-type';
import type {SetOptional} from '../index';

// Update one required and one optional to optional.
declare const variation1: SetOptional<{a: number; b?: string; c: boolean}, 'b' | 'c'>;
expectTypeOf(variation1).toEqualTypeOf<{a: number; b?: string; c?: boolean}>();

// Update two required to optional.
declare const variation2: SetOptional<{a: number; b: string; c: boolean}, 'a' | 'b'>;
expectTypeOf(variation2).toEqualTypeOf<{a?: number; b?: string; c: boolean}>();

// Three optional remain optional.
declare const variation3: SetOptional<{a?: number; b?: string; c?: boolean}, 'a' | 'b' | 'c'>;
expectTypeOf(variation3).toEqualTypeOf<{a?: number; b?: string; c?: boolean}>();

// Fail if type changes even if optional is right.
declare const variation4: SetOptional<{a: number; b?: string; c: boolean}, 'b' | 'c'>;
expectTypeOf(variation4).not.toMatchTypeOf<{a: boolean; b?: string; c?: boolean}>();
