import {expectTypeOf} from 'nz';
import type {SetNullable} from '../index.d.ts';

// Make one key nullable.
declare const variation1: SetNullable<{a: number; b: string}, 'a'>;
expectTypeOf(variation1).toBe<{a: number | null; b: string}>();

// Make multiple keys nullable.
declare const variation2: SetNullable<{a: number; b: string; c: boolean}, 'a' | 'c'>;
expectTypeOf(variation2).toBe<{a: number | null; b: string; c: boolean | null}>();

// Preserve optional modifier.
declare const variation3: SetNullable<{a: number; b?: string}, 'b'>;
expectTypeOf(variation3).toBe<{a: number; b?: string | null}>();

// Key already nullable remains unchanged.
declare const variation4: SetNullable<{a: number | null; b: string}, 'a'>;
expectTypeOf(variation4).toBe<{a: number | null; b: string}>();

// Fail if type changes even if nullable is right.
declare const variation5: SetNullable<{a: number; b: string}, 'b'>;
expectTypeOf(variation5).not.toBeAssignableTo<{a: string; b: string | null}>();

// Make all keys nullable when `Keys` generic is not passed.
declare const variation6: SetNullable<{a: number; b: string; c: boolean}>;
expectTypeOf(variation6).toBe<{a: number | null; b: string | null; c: boolean | null}>();

// Preserve readonly modifier.
declare const variation7: SetNullable<{readonly a: number; b: string}, 'a'>;
expectTypeOf(variation7).toBe<{readonly a: number | null; b: string}>();

// Works with unions.
declare const variation8: SetNullable<{a: '1'; b: string; c: boolean} | {a: '2'; b: string; c: boolean}, 'a' | 'b'>;
expectTypeOf(variation8).toBe<{a: '1' | null; b: string | null; c: boolean} | {a: '2' | null; b: string | null; c: boolean}>();

// Works with index signatures.
declare const variation9: SetNullable<{[k: string]: unknown; a: number; b: string}, 'a'>;
expectTypeOf(variation9).toBe<{[k: string]: unknown; a: number | null; b: string}>();

declare const variation9a: SetNullable<{[k: Uppercase<string>]: number; A: number; b: string}, Uppercase<string>>;
expectTypeOf(variation9a).toBe<{[k: Uppercase<string>]: number | null; A: number | null; b: string}>();

// Makes all keys nullable when `Keys` is `any`.
declare const variation10: SetNullable<{readonly a: number; b?: string; c: boolean}, any>;
expectTypeOf(variation10).toBe<{readonly a: number | null; b?: string | null; c: boolean | null}>();

// Does nothing when `Keys` is `never`.
declare const variation11: SetNullable<{a: number; readonly b?: string; readonly c: boolean}, never>;
expectTypeOf(variation11).toBe<{a: number; readonly b?: string; readonly c: boolean}>();

// Preserves existing `undefined` when adding `null`.
declare const variation12: SetNullable<{a: string | undefined; b: number}, 'a'>;
expectTypeOf(variation12).toBe<{a: string | undefined | null; b: number}>();

// Works with unions where only some keys are shared across branches.
declare const variation13: SetNullable<{a: number; c: boolean} | {a: string; d: boolean}, 'a'>;
expectTypeOf(variation13).toBe<{a: number | null; c: boolean} | {a: string | null; d: boolean}>();
