import {expectTypeOf} from 'nz';
import type {SetReadonly, Simplify} from '../index.d.ts';

// Update one readonly and one non readonly to readonly.
declare const variation1: SetReadonly<{a: number; readonly b: string; c: boolean}, 'b' | 'c'>;
expectTypeOf(variation1).toBe<{a: number; readonly b: string; readonly c: boolean}>();

// Update two non readonly to readonly.
declare const variation2: SetReadonly<{readonly a: number; readonly b: string; c: boolean}, 'a' | 'b'>;
expectTypeOf(variation2).toBe<{readonly a: number; readonly b: string; c: boolean}>();

// Three readonly remain readonly.
declare const variation3: SetReadonly<{readonly a: number; readonly b?: string; readonly c: boolean}, 'a' | 'b' | 'c'>;
expectTypeOf(variation3).toBe<{readonly a: number; readonly b?: string; readonly c: boolean}>();

// Fail if type changes even if readonly is right.
declare const variation4: SetReadonly<{a: number; readonly b: string; c: boolean}, 'b' | 'c'>;
expectTypeOf(variation4).not.toBeAssignableTo<{a: boolean; readonly b: string; readonly c: boolean}>();

// Preserves optional modifier.
declare const variation5: SetReadonly<{a?: number; readonly b?: string; c?: boolean}, 'b' | 'c'>;
expectTypeOf(variation5).toBe<{a?: number; readonly b?: string; readonly c?: boolean}>();

// Works with unions.
declare const variation6: SetReadonly<{a?: number; b: number; c: boolean} | {a: string; b?: string; d: boolean}, 'a' | 'b'>;
expectTypeOf(variation6).toBe<{readonly a?: number; readonly b: number; c: boolean} | {readonly a: string; readonly b?: string; d: boolean}>();

// Marks all keys as readonly, if `Keys` is `any`.
declare const variation7: SetReadonly<{a?: number; b: string; c: boolean}, any>;
expectTypeOf(variation7).toBe<{readonly a?: number; readonly b: string; readonly c: boolean}>();

// Does nothing, if `Keys` is `never`.
declare const variation8: SetReadonly<{a: number; readonly b: string; readonly c: boolean}, never>;
expectTypeOf(variation8).toBe<{a: number; readonly b: string; readonly c: boolean}>();

// Works with index signatures
declare const variation9: SetReadonly<{[k: string]: unknown; a: number; readonly b: string}, 'a' | 'b'>;
expectTypeOf(variation9).toBe<{[k: string]: unknown; readonly a: number; readonly b: string}>();

// Works with functions containing properties
declare const variation10: SetReadonly<{(a1: string, a2: number): boolean; p1: string; readonly p2?: number}, 'p1'>;
expectTypeOf(variation10('foo', 1)).toBe<boolean>();
expectTypeOf<Simplify<typeof variation10>>().toBe<{readonly p1: string; readonly p2?: number}>(); // Simplify removes the call signature from `typeof variation10`

declare const variation11: SetReadonly<{(a1: boolean, ...a2: string[]): number; p1: string; p2?: number; p3: boolean}, 'p1' | 'p2'>;
expectTypeOf(variation11(true, 'foo', 'bar', 'baz')).toBe<number>();
expectTypeOf<Simplify<typeof variation11>>().toBe<{readonly p1: string; readonly p2?: number; p3: boolean}>();

// Functions without properties are returned as is
declare const variation12: SetReadonly<(a: string) => number, never>;
expectTypeOf(variation12('foo')).toBe<number>();

// A tuple stays a tuple, and becomes readonly when any index is given.
declare const tuple: SetReadonly<[string, number, boolean], '0'>;
expectTypeOf(tuple).toBe<readonly [string, number, boolean]>();

declare const readonlyTuple: SetReadonly<readonly [string, number, boolean], '2'>;
expectTypeOf(readonlyTuple).toBe<readonly [string, number, boolean]>();

declare const optionalTail: SetReadonly<[string, number, boolean?], '1'>;
expectTypeOf(optionalTail).toBe<readonly [string, number, boolean?]>();

declare const noKeys: SetReadonly<[string, number], never>;
expectTypeOf(noKeys).toBe<[string, number]>();

// A key that only one member of a union has is still a key of that member, and the type distributes over the union anyway, so it should be accepted. `keyof` of a union is the intersection of its members' keys, so the constraint rejected it and the user got a type error instead of a result.
declare const keyOfOneMember: SetReadonly<{a: 1} | {b: 2}, 'a'>;
expectTypeOf(keyOfOneMember).toBe<{readonly a: 1} | {b: 2}>();

declare const keyOfTheOtherMember: SetReadonly<{a: 1} | {b: 2}, 'b'>;
expectTypeOf(keyOfTheOtherMember).toBe<{a: 1} | {readonly b: 2}>();

// The rebuilt call signature keeps the `this` parameter, which `Parameters` leaves out, so a wrong receiver stays a type error after the transform.
declare const thisParameter: ThisParameterType<SetReadonly<{(this: Date, a: string): void; p: string}, 'p'>>;
expectTypeOf(thisParameter).toBe<Date>();

// A tuple member of a union that the key does not reach is left alone.
expectTypeOf<SetReadonly<[1, 2] | {a: 1}, 'a'>>().toBe<[1, 2] | {readonly a: 1}>();

// `any` is not an array, so it does not take the tuple branch as well as the object branch.
declare const anyBase: SetReadonly<any, 'a'>;
expectTypeOf(anyBase).toBe<{[x: string]: any}>();
