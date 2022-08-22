import {expectType, expectError} from 'tsd';
import type {SetNonNullable} from '../index';

// Update one possibly undefined key and one possibly null key to non-nullable.
declare const variation1: SetNonNullable<{a: number; b: string | undefined; c: boolean | null}, 'b' | 'c'>;
expectType<{a: number; b: string; c: boolean}>(variation1);

// Update a key that is possibly null or undefined.
declare const variation2: SetNonNullable<{a: number; b: string | null | undefined}, 'b'>;
expectType<{a: number; b: string}>(variation2);

// Update an optional key.
declare const variation3: SetNonNullable<{a: number; b?: string | undefined}, 'b'>;
expectType<{a: number; b?: string}>(variation3);

// Fail if type changes even if non-nullable is right.
declare const variation4: SetNonNullable<{a: number; b: string | undefined}, 'b'>;
expectError<{a: string; b: string}>(variation4);
