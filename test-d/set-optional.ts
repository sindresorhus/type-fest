import {expectNotAssignable, expectType} from 'tsd';
import type {SetOptional, Simplify} from '../index.d.ts';

// Update one required and one optional to optional.
declare const variation1: SetOptional<{a: number; b?: string; c: boolean}, 'b' | 'c'>;
expectType<{a: number; b?: string; c?: boolean}>(variation1);

// Update two required to optional.
declare const variation2: SetOptional<{a: number; b: string; c: boolean}, 'a' | 'b'>;
expectType<{a?: number; b?: string; c: boolean}>(variation2);

// Three optional remain optional.
declare const variation3: SetOptional<{a?: number; b?: string; c?: boolean}, 'a' | 'b' | 'c'>;
expectType<{a?: number; b?: string; c?: boolean}>(variation3);

// Fail if type changes even if optional is right.
declare const variation4: SetOptional<{a: number; b?: string; c: boolean}, 'b' | 'c'>;
expectNotAssignable<{a: boolean; b?: string; c?: boolean}>(variation4);

// Preserves readonly modifier.
declare const variation5: SetOptional<{readonly a: number; readonly b?: string; c: boolean}, 'b' | 'c'>;
expectType<{readonly a: number; readonly b?: string; c?: boolean}>(variation5);

// Works with unions.
declare const variation6: SetOptional<{readonly a: number; b: number; c: boolean} | {a: string; readonly b: string; d: boolean}, 'a' | 'b'>;
expectType<{readonly a?: number; b?: number; c: boolean} | {a?: string; readonly b?: string; d: boolean}>(variation6);

// Marks all keys as optional, if `Keys` is `any`.
declare const variation7: SetOptional<{readonly a: number; b: string; c: boolean}, any>;
expectType<{readonly a?: number; b?: string; c?: boolean}>(variation7);

// Does nothing, if `Keys` is `never`.
declare const variation8: SetOptional<{a?: number; readonly b?: string; readonly c: boolean}, never>;
expectType<{a?: number; readonly b?: string; readonly c: boolean}>(variation8);

// Works with index signatures
declare const variation9: SetOptional<{[k: string]: unknown; a: number; b?: string}, 'a' | 'b'>;
expectType<{[k: string]: unknown; a?: number; b?: string}>(variation9);

// Works with functions containing properties
declare const variation10: SetOptional<{(a1: string, a2: number): boolean; p1: string; readonly p2?: number}, 'p1'>;
expectType<boolean>(variation10('foo', 1));
expectType<{p1?: string; readonly p2?: number}>({} as Simplify<typeof variation10>); // `Simplify` removes the call signature from `typeof variation10`

declare const variation11: SetOptional<{(a1: boolean, ...a2: string[]): number; p1: string; readonly p2: number; p3: boolean}, 'p1' | 'p2'>;
expectType<number>(variation11(true, 'foo', 'bar', 'baz'));
expectType<{p1?: string; readonly p2?: number; p3: boolean}>({} as Simplify<typeof variation11>);

// Functions without properties are returned as is
declare const variation12: SetOptional<(a: string) => number, never>;
expectType<number>(variation12('foo'));

// A tuple stays a tuple, with trailing selected indices made optional. An element before a required one gains `| undefined` instead, since TypeScript rejects a required element after an optional one.
declare const tuple: SetOptional<[string, number, boolean], '2'>;
expectType<[string, number, boolean?]>(tuple);

declare const readonlyTuple: SetOptional<readonly [string, number, boolean], '1' | '2'>;
expectType<readonly [string, number?, boolean?]>(readonlyTuple);

declare const optionalTail: SetOptional<[string, number, boolean?], '1'>;
expectType<[string, number?, boolean?]>(optionalTail);

declare const alreadyOptional: SetOptional<[string, number?], '1'>;
expectType<[string, number?]>(alreadyOptional);

expectType<[1, 2 | undefined, 3]>({} as SetOptional<[1, 2, 3], 1>);
expectType<readonly [1 | undefined, 2, 3?]>({} as SetOptional<readonly [1, 2, 3], 0 | 2>);

// A tuple can require its trailing element after a rest element, so an earlier selected element remains required too.
expectType<[1 | undefined, ...string[], 2]>({} as SetOptional<[1, ...string[], 2], 0>);

// A key that lands in a rest element is ignored, because a rest element has no optionality to add: its elements are always present, so there is nothing for the key to change.
expectType<[string, number, ...boolean[]]>({} as SetOptional<[string, number, ...boolean[]], 2>);

// A key that only one member of a union has is still a key of that member, and the type distributes over the union anyway, so it should be accepted. `keyof` of a union is the intersection of its members' keys, so the constraint rejected it and the user got a type error instead of a result.
declare const keyOfOneMember: SetOptional<{a: 1} | {b: 2}, 'a'>;
expectType<{a?: 1} | {b: 2}>(keyOfOneMember);

declare const keyOfOneMemberRequired: SetOptional<{a: 1} | {b: 2}, 'b'>;
expectType<{a: 1} | {b?: 2}>(keyOfOneMemberRequired);

declare const keyOfBothMembers: SetOptional<{a: 1} | {a: 2}, 'a'>;
expectType<{a?: 1} | {a?: 2}>(keyOfBothMembers);

// The rebuilt call signature keeps the `this` parameter, which `Parameters` leaves out, so a wrong receiver stays a type error after the transform.
declare const thisParameter: ThisParameterType<SetOptional<{(this: Date, a: string): void; p: string}, 'p'>>;
expectType<Date>(thisParameter);

// The keys are required, like for `SetRequired` and `SetReadonly`.
// @ts-expect-error
type MissingKeys = SetOptional<{a: 1}>;

// `any` is not an array, so it does not take the tuple branch as well as the object branch.
declare const anyBase: SetOptional<any, 'a'>;
expectType<{[x: string]: any}>(anyBase);
