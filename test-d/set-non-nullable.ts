import {expectNotAssignable, expectType} from 'tsd';
import type {SetNonNullable} from '../index.d.ts';

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
expectNotAssignable<{a: string; b: string}>(variation4);

// Update all keys if `Keys` generic is not passed.
declare const variation5: SetNonNullable<{a: number; b: string | undefined; c: boolean | null}>;
expectType<{a: number; b: string; c: boolean}>(variation5);

// Does not throw type error in type predicate contexts.
type Variation6Config = {a: boolean | null; b: boolean | null};
const variant6Function = <TProperty extends keyof Variation6Config>(
	config: Variation6Config,
	property: TProperty,
): config is SetNonNullable<Variation6Config, TProperty> => Boolean(config[property]);
expectNotAssignable<never>(variant6Function); // Just to prevent unused error.
