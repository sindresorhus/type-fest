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

// Each member of a union gets the keys it has, so the default makes every key of every member nullable.
expectTypeOf<SetNullable<{a: number; b: number} | {a: string; c: string}>>().toBe<{a: number | null; b: number | null} | {a: string | null; c: string | null}>();

// A key that only some members of a union have is accepted, and the other members are left as they are.
expectTypeOf<SetNullable<{a: 1} | {b: 2}, 'a'>>().toBe<{a: 1 | null} | {b: 2}>();

// A tuple is keyed by a number.
expectTypeOf<SetNullable<[1, 2], 0>>().toBe<[1 | null, 2]>();
expectTypeOf<SetNullable<[1, 2]>>().toBe<[1 | null, 2 | null]>();
expectTypeOf<SetNullable<[1, 2], number>>().toBe<[1 | null, 2 | null]>();
expectTypeOf<SetNullable<readonly [1, 2?], 1>>().toBe<readonly [1, (2 | null)?]>();
expectTypeOf<SetNullable<string[]>>().toBe<Array<string | null>>();

// @ts-expect-error
type InvalidKey = SetNullable<{a: number}, 'b'>;

// @ts-expect-error
type InvalidUnionKey = SetNullable<{a: 1} | {b: 2}, 'c'>;

// A numeric key does not reach a tuple's rest element or the elements after it, but `number` does. See the docs.
expectTypeOf<SetNullable<[1, ...string[]], 1>>().toBe<[1, ...string[]]>();
expectTypeOf<SetNullable<[1, ...string[]], number>>().toBe<[1 | null, ...Array<string | null>]>();
expectTypeOf<SetNullable<[1, ...string[], 2], 2>>().toBe<[1, ...string[], 2]>();
expectTypeOf<SetNullable<[1, ...string[], 2], number>>().toBe<[1 | null, ...Array<string | null>, 2 | null]>();

expectTypeOf<SetNullable<any>>().toBe<{[x: string]: any}>();
expectTypeOf<SetNullable<never>>().toBe<never>();
expectTypeOf<SetNullable<unknown>>().toBe<{}>();

// A generic `SetNullable` can be indexed by its keys.
function getNullable<BaseType extends object, Key extends keyof BaseType>(value: SetNullable<BaseType, Key>, key: Key) {
	return value[key];
}

expectTypeOf(getNullable<{a: number}, 'a'>).returns.toBe<number | null>();
