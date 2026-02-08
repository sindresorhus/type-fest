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
