import {expectNotAssignable, expectType} from 'tsd';
import type {SetReadonly, Simplify} from '../index.d.ts';

// Update one readonly and one non readonly to readonly.
declare const variation1: SetReadonly<{a: number; readonly b: string; c: boolean}, 'b' | 'c'>;
expectType<{a: number; readonly b: string; readonly c: boolean}>(variation1);

// Update two non readonly to readonly.
declare const variation2: SetReadonly<{readonly a: number; readonly b: string; c: boolean}, 'a' | 'b'>;
expectType<{readonly a: number; readonly b: string; c: boolean}>(variation2);

// Three readonly remain readonly.
declare const variation3: SetReadonly<{readonly a: number; readonly b?: string; readonly c: boolean}, 'a' | 'b' | 'c'>;
expectType<{readonly a: number; readonly b?: string; readonly c: boolean}>(variation3);

// Fail if type changes even if readonly is right.
declare const variation4: SetReadonly<{a: number; readonly b: string; c: boolean}, 'b' | 'c'>;
expectNotAssignable<{a: boolean; readonly b: string; readonly c: boolean}>(variation4);

// Preserves optional modifier.
declare const variation5: SetReadonly<{a?: number; readonly b?: string; c?: boolean}, 'b' | 'c'>;
expectType<{a?: number; readonly b?: string; readonly c?: boolean}>(variation5);

// Works with unions.
declare const variation6: SetReadonly<{a?: number; b: number; c: boolean} | {a: string; b?: string; d: boolean}, 'a' | 'b'>;
expectType<{readonly a?: number; readonly b: number; c: boolean} | {readonly a: string; readonly b?: string; d: boolean}>(variation6);

// Marks all keys as readonly, if `Keys` is `any`.
declare const variation7: SetReadonly<{a?: number; b: string; c: boolean}, any>;
expectType<{readonly a?: number; readonly b: string; readonly c: boolean}>(variation7);

// Does nothing, if `Keys` is `never`.
declare const variation8: SetReadonly<{a: number; readonly b: string; readonly c: boolean}, never>;
expectType<{a: number; readonly b: string; readonly c: boolean}>(variation8);

// Works with index signatures
declare const variation9: SetReadonly<{[k: string]: unknown; a: number; readonly b: string}, 'a' | 'b'>;
expectType<{[k: string]: unknown; readonly a: number; readonly b: string}>(variation9);

// Works with functions containing properties
declare const variation10: SetReadonly<{(a1: string, a2: number): boolean; p1: string; readonly p2?: number}, 'p1'>;
expectType<boolean>(variation10('foo', 1));
expectType<{readonly p1: string; readonly p2?: number}>({} as Simplify<typeof variation10>); // Simplify removes the call signature from `typeof variation10`

declare const variation11: SetReadonly<{(a1: boolean, ...a2: string[]): number; p1: string; p2?: number; p3: boolean}, 'p1' | 'p2'>;
expectType<number>(variation11(true, 'foo', 'bar', 'baz'));
expectType<{readonly p1: string; readonly p2?: number; p3: boolean}>({} as Simplify<typeof variation11>);

// Functions without properties are returned as is
declare const variation12: SetReadonly<(a: string) => number, never>;
expectType<number>(variation12('foo'));

// A tuple stays a tuple, and becomes readonly when any index is given.
declare const tuple: SetReadonly<[string, number, boolean], '0'>;
expectType<readonly [string, number, boolean]>(tuple);

declare const readonlyTuple: SetReadonly<readonly [string, number, boolean], '2'>;
expectType<readonly [string, number, boolean]>(readonlyTuple);

declare const optionalTail: SetReadonly<[string, number, boolean?], '1'>;
expectType<readonly [string, number, boolean?]>(optionalTail);

declare const noKeys: SetReadonly<[string, number], never>;
expectType<[string, number]>(noKeys);

// A key that only one member of a union has is still a key of that member, and the type distributes over the union anyway, so it should be accepted. `keyof` of a union is the intersection of its members' keys, so the constraint rejected it and the user got a type error instead of a result.
declare const keyOfOneMember: SetReadonly<{a: 1} | {b: 2}, 'a'>;
expectType<{readonly a: 1} | {b: 2}>(keyOfOneMember);

declare const keyOfTheOtherMember: SetReadonly<{a: 1} | {b: 2}, 'b'>;
expectType<{a: 1} | {readonly b: 2}>(keyOfTheOtherMember);

// The rebuilt call signature keeps the `this` parameter, which `Parameters` leaves out, so a wrong receiver stays a type error after the transform.
declare const thisParameter: ThisParameterType<SetReadonly<{(this: Date, a: string): void; p: string}, 'p'>>;
expectType<Date>(thisParameter);

// A tuple member of a union that the key does not reach is left alone.
expectType<[1, 2] | {readonly a: 1}>({} as SetReadonly<[1, 2] | {a: 1}, 'a'>);

// `any` is not an array, so it does not take the tuple branch as well as the object branch.
declare const anyBase: SetReadonly<any, 'a'>;
expectType<{[x: string]: any}>(anyBase);
