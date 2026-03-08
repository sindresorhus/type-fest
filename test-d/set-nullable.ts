import {expectNotAssignable, expectType} from 'tsd';
import type {SetNullable} from '../index.d.ts';

// Make one key nullable.
declare const variation1: SetNullable<{a: number; b: string}, 'a'>;
expectType<{a: number | null; b: string}>(variation1);

// Make multiple keys nullable.
declare const variation2: SetNullable<{a: number; b: string; c: boolean}, 'a' | 'c'>;
expectType<{a: number | null; b: string; c: boolean | null}>(variation2);

// Preserve optional modifier.
declare const variation3: SetNullable<{a: number; b?: string}, 'b'>;
expectType<{a: number; b?: string | null}>(variation3);

// Key already nullable remains unchanged.
declare const variation4: SetNullable<{a: number | null; b: string}, 'a'>;
expectType<{a: number | null; b: string}>(variation4);

// Fail if type changes even if nullable is right.
declare const variation5: SetNullable<{a: number; b: string}, 'b'>;
expectNotAssignable<{a: string; b: string | null}>(variation5);

// Make all keys nullable when `Keys` generic is not passed.
declare const variation6: SetNullable<{a: number; b: string; c: boolean}>;
expectType<{a: number | null; b: string | null; c: boolean | null}>(variation6);

// Preserve readonly modifier.
declare const variation7: SetNullable<{readonly a: number; b: string}, 'a'>;
expectType<{readonly a: number | null; b: string}>(variation7);

// Works with unions.
declare const variation8: SetNullable<{a: '1'; b: string; c: boolean} | {a: '2'; b: string; c: boolean}, 'a' | 'b'>;
expectType<{a: '1' | null; b: string | null; c: boolean} | {a: '2' | null; b: string | null; c: boolean}>(variation8);

// Works with index signatures.
declare const variation9: SetNullable<{[k: string]: unknown; a: number; b: string}, 'a'>;
expectType<{[k: string]: unknown; a: number | null; b: string}>(variation9);

// Makes all keys nullable when `Keys` is `any`.
declare const variation10: SetNullable<{readonly a: number; b?: string; c: boolean}, any>;
expectType<{readonly a: number | null; b?: string | null; c: boolean | null}>(variation10);

// Does nothing when `Keys` is `never`.
declare const variation11: SetNullable<{a: number; readonly b?: string; readonly c: boolean}, never>;
expectType<{a: number; readonly b?: string; readonly c: boolean}>(variation11);

// Preserves existing `undefined` when adding `null`.
declare const variation12: SetNullable<{a: string | undefined; b: number}, 'a'>;
expectType<{a: string | undefined | null; b: number}>(variation12);

// Works with unions where only some keys are shared across branches.
declare const variation13: SetNullable<{a: number; c: boolean} | {a: string; d: boolean}, 'a'>;
expectType<{a: number | null; c: boolean} | {a: string | null; d: boolean}>(variation13);

