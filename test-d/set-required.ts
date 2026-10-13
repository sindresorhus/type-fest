import {expectTypeOf} from 'nz';
import type {SetRequired, Simplify} from '../index.d.ts';

// Update one required and one optional to required.
declare const variation1: SetRequired<{a?: number; b: string; c?: boolean}, 'b' | 'c'>;
expectTypeOf(variation1).toBe<{a?: number; b: string; c: boolean}>();

// Update two optional to required.
declare const variation2: SetRequired<{a?: number; b?: string; c?: boolean}, 'a' | 'b'>;
expectTypeOf(variation2).toBe<{a: number; b: string; c?: boolean}>();

// Three required remain required.
declare const variation3: SetRequired<{a: number; b: string; c: boolean}, 'a' | 'b' | 'c'>;
expectTypeOf(variation3).toBe<{a: number; b: string; c: boolean}>();

// Fail if type changes even if optional is right.
declare const variation4: SetRequired<{a?: number; b: string; c?: boolean}, 'b' | 'c'>;
expectTypeOf(variation4).not.toBeAssignableTo<{a?: boolean; b: string; c: boolean}>();

// Update one required and one optional to required in a union.
declare const variation5: SetRequired<{a?: '1'; b: string; c?: boolean} | {a?: '2'; b: string; c?: boolean}, 'a' | 'b'>;
expectTypeOf(variation5).toBe<{a: '1'; b: string; c?: boolean} | {a: '2'; b: string; c?: boolean}>();

// Preserves readonly modifier.
declare const variation6: SetRequired<{readonly a?: number; readonly b: string; c?: boolean}, 'b' | 'c'>;
expectTypeOf(variation6).toBe<{readonly a?: number; readonly b: string; c: boolean}>();

// Works with unions.
declare const variation7: SetRequired<{readonly a?: number; b?: number; c?: boolean} | {a?: string; readonly b?: string; d?: boolean}, 'a' | 'b'>;
expectTypeOf(variation7).toBe<{readonly a: number; b: number; c?: boolean} | {a: string; readonly b: string; d?: boolean}>();

// Marks all keys as required, if `Keys` is `any`.
declare const variation8: SetRequired<{readonly a?: number; b?: string; c?: boolean}, any>;
expectTypeOf(variation8).toBe<{readonly a: number; b: string; c: boolean}>();

// Does nothing, if `Keys` is `never`.
declare const variation9: SetRequired<{a?: number; readonly b?: string; readonly c: boolean}, never>;
expectTypeOf(variation9).toBe<{a?: number; readonly b?: string; readonly c: boolean}>();

// Works with index signatures
declare const variation10: SetRequired<{[k: string]: unknown; a?: number; b: string}, 'a' | 'b'>;
expectTypeOf(variation10).toBe<{[k: string]: unknown; a: number; b: string}>();

// Works with functions containing properties
declare const variation11: SetRequired<{(a1: string, a2: number): boolean; p1?: string; readonly p2: number}, 'p1'>;
expectTypeOf(variation11('foo', 1)).toBe<boolean>();
expectTypeOf<Simplify<typeof variation11>>().toBe<{p1: string; readonly p2: number}>();

declare const variation12: SetRequired<{(a1: boolean, ...a2: string[]): number; p1?: string; readonly p2?: number; p3?: boolean}, 'p1' | 'p2'>;
expectTypeOf(variation12(true, 'foo', 'bar', 'baz')).toBe<number>();
expectTypeOf<Simplify<typeof variation12>>().toBe<{p1: string; readonly p2: number; p3?: boolean}>();

// Functions without properties are returned as is
declare const variation13: SetRequired<(a: string) => number, never>;
expectTypeOf(variation13('foo')).toBe<number>();

// =================
// Works with arrays
// =================

// Empty array
expectTypeOf<SetRequired<[], never>>().toBe<[]>();
expectTypeOf<SetRequired<readonly [], never>>().toBe<readonly []>();

// All optional elements
expectTypeOf<SetRequired<[string?, number?], '0'>>().toBe<[string, number?]>();
expectTypeOf<SetRequired<[string?, number?, boolean?], '0' | '1' | '2'>>().toBe<[string, number, boolean]>();
expectTypeOf<SetRequired<[(string | number)?], '0'>>().toBe<[(string | number)]>();

// Works with number `Keys`, string `Keys`, and union of them.
expectTypeOf<SetRequired<[string, number?, boolean?], 1>>().toBe<[string, number, boolean?]>();
expectTypeOf<SetRequired<[string, number?, boolean?, ...number[]], '1' | '2'>>().toBe<[string, number, boolean, ...number[]]>();
expectTypeOf<SetRequired<readonly [string?, number?, boolean?], '0' | 1 | 2>>().toBe<readonly [string, number, boolean]>();

// Mix of optional and required elements
expectTypeOf<SetRequired<[string, number?, boolean?], '1'>>().toBe<[string, number, boolean?]>();
expectTypeOf<SetRequired<readonly [string, number?, boolean?], '1' | '2'>>().toBe<readonly [string, number, boolean]>();

// Mix of optional and rest elements
expectTypeOf<SetRequired<[string?, number?, boolean?, ...number[]], '0'>>().toBe<[string, number?, boolean?, ...number[]]>();
expectTypeOf<SetRequired<[string?, number?, boolean?, ...number[]], '0' | '1' | 2>>().toBe<[string, number, boolean, ...number[]]>();

// Mix of optional, required, and rest elements
expectTypeOf<SetRequired<readonly [string, number?, boolean?, ...number[]], '1'>>().toBe<readonly [string, number, boolean?, ...number[]]>();
expectTypeOf<SetRequired<[string, number?, boolean?, ...string[]], '1' | 2>>().toBe<[string, number, boolean, ...string[]]>();

// Works with readonly arrays
expectTypeOf<SetRequired<readonly [(string | number)?], '0'>>().toBe<readonly [(string | number)]>();
expectTypeOf<SetRequired<readonly [string, number?, boolean?], '1'>>().toBe<readonly [string, number, boolean?]>();
expectTypeOf<SetRequired<readonly [string?, number?, boolean?, ...number[]], '0' | '1' | 2>>().toBe<readonly [string, number, boolean, ...number[]]>();
expectTypeOf<SetRequired<readonly [string, number?, boolean?, ...string[]], '1' | 2>>().toBe<readonly [string, number, boolean, ...string[]]>();

// Ignores `Keys` that are already required
expectTypeOf<SetRequired<[string, number?, boolean?], '0'>>().toBe<[string, number?, boolean?]>();
expectTypeOf<SetRequired<readonly [string, number, boolean], 1 | 2>>().toBe<readonly [string, number, boolean]>();
expectTypeOf<SetRequired<readonly [string, number, boolean, ...number[]], 1 | 2>>().toBe<readonly [string, number, boolean, ...number[]]>();
expectTypeOf<SetRequired<[string, number?, boolean?, ...number[]], '0' | '1' | '2'>>().toBe<[string, number, boolean, ...number[]]>();

// Ignores `Keys` that are out of bounds
expectTypeOf<SetRequired<[], 1>>().toBe<[]>();
expectTypeOf<SetRequired<[string, number?, boolean?], 10>>().toBe<[string, number?, boolean?]>();
expectTypeOf<SetRequired<[string?, number?, boolean?], 0 | 1 | 2 | 3 | 4>>().toBe<[string, number, boolean]>();
expectTypeOf<SetRequired<readonly [string, number?, boolean?, ...number[]], 10 | 1>>().toBe<readonly [string, number, boolean?, ...number[]]>();

// Marks all keys as required, if `Keys` is `any`.
expectTypeOf<SetRequired<[string?, number?, boolean?], any>>().toBe<[string, number, boolean]>();
expectTypeOf<SetRequired<[string, number?, boolean?, ...number[]], any>>().toBe<[string, number, boolean, ...number[]]>();
expectTypeOf<SetRequired<readonly [string, number, boolean, ...number[]], any>>().toBe<readonly [string, number, boolean, ...number[]]>();
expectTypeOf<SetRequired<readonly [string, number?, boolean?, ...number[]], any>>().toBe<readonly [string, number, boolean, ...number[]]>();

// Marks all keys as required, if `Keys` is `number`.
expectTypeOf<SetRequired<[string?, number?, boolean?], number>>().toBe<[string, number, boolean]>();
expectTypeOf<SetRequired<[string, number?, boolean?, ...number[]], number>>().toBe<[string, number, boolean, ...number[]]>();
expectTypeOf<SetRequired<readonly [string, number, boolean, ...number[]], number>>().toBe<readonly [string, number, boolean, ...number[]]>();
expectTypeOf<SetRequired<readonly [string, number?, boolean?, ...number[]], number>>().toBe<readonly [string, number, boolean, ...number[]]>();

// Returns the array as-is, if `Keys` is `never`.
expectTypeOf<SetRequired<[string?, number?], never>>().toBe<[string?, number?]>();
expectTypeOf<SetRequired<readonly [string?, number?, ...number[]], never>>().toBe<readonly [string?, number?, ...number[]]>();

// Arrays where non-rest elements appear after the rest element are left unchanged, because they can never have optional elements.
expectTypeOf<SetRequired<[...string[], string | undefined, number], any>>().toBe<[...string[], string | undefined, number]>();
expectTypeOf<SetRequired<[boolean, ...string[], string, number], any>>().toBe<[boolean, ...string[], string, number]>();

// Preserves `| undefined`, similar to how built-in `Required` works.
expectTypeOf<SetRequired<[string | undefined, (number | undefined)?, boolean?], 0 | 1 | 2>>().toBe<[string | undefined, number | undefined, boolean]>();
expectTypeOf<SetRequired<readonly [(string | undefined)?, (number | undefined)?, boolean?], 0>>().toBe<readonly [string | undefined, (number | undefined)?, boolean?]>();

// Required elements cannot appear after optional ones, so `Keys` leading to such situations are ignored.
expectTypeOf<SetRequired<[string?, number?, boolean?], 1 | 2>>().toBe<[string?, number?, boolean?]>(); // `1` and `2` can't be required when `0` is optional
// `3` can't be required when `2` is optional
expectTypeOf<SetRequired<[string?, number?, boolean?, string?, string?], 0 | 1 | 3>>().toBe<[string, number, boolean?, string?, string?]>();
// `2` can't be required when `1` is optional
expectTypeOf<SetRequired<readonly [string | undefined, number?, boolean?, ...string[]], 2>>().toBe<readonly [string | undefined, number?, boolean?, ...string[]]>();

// Works with unions of arrays
expectTypeOf<SetRequired<readonly [] | [], never>>().toBe<readonly [] | []>();
expectTypeOf<SetRequired<[] | readonly [(string | number)?], 0>>().toBe<[] | readonly [(string | number)]>();
expectTypeOf<SetRequired<[string?] | [string, number?, boolean?, ...number[]] | readonly [string, number?, boolean?], 0 | 1>>().toBe<[string] | [string, number, boolean?, ...number[]] | readonly [string, number, boolean?]>();
expectTypeOf<SetRequired<readonly [number, string] | [string, boolean?, ...number[]] | readonly [string, (number | undefined)?, boolean?, string?], 1 | 3>>().toBe<readonly [number, string] | [string, boolean, ...number[]] | readonly [string, number | undefined, boolean?, string?]>();
expectTypeOf<SetRequired<readonly [...number[], number] | [string, boolean?, ...number[]] | readonly [string, (number | undefined)?, boolean?, string?], any>>().toBe<readonly [...number[], number] | [string, boolean, ...number[]] | readonly [string, number | undefined, boolean, string]>();
expectTypeOf<SetRequired<readonly string[] | [x: number, y?: number] | [string?, number?, ...string[]], number>>().toBe<readonly string[] | [x: number, y: number] | [string, number, ...string[]]>();

// Works with labelled tuples
expectTypeOf<SetRequired<[x?: string, y?: number], '0' | '1'>>().toBe<[x: string, y: number]>();
expectTypeOf<SetRequired<readonly [x?: number, y?: number, z?: number], 0 | 1>>().toBe<readonly [x: number, y: number, z?: number]>();
expectTypeOf<SetRequired<readonly [x?: number, y?: number, z?: number, ...rest: number[]], 0 | 1>>().toBe<readonly [x: number, y: number, z?: number, ...rest: number[]]>();

// Non tuple arrays are left unchanged
expectTypeOf<SetRequired<string[], number>>().toBe<string[]>();
expectTypeOf<SetRequired<ReadonlyArray<string | number>, number>>().toBe<ReadonlyArray<string | number>>();
expectTypeOf<SetRequired<[...number[]], never>>().toBe<number[]>();

// A key that lands in a rest element is ignored, unlike `SetNonNullable`, which makes the rest element non-nullable. Making a rest element required is not expressible either, because a rest element has no optionality to remove: its elements are always present, and the `undefined` in `number | undefined` is a value the element may hold rather than the element being absent. `SetRequired<[string, number?], 1>` is `[string, number]` because there the `?` is real optionality. See the note in the docs.
expectTypeOf<SetRequired<[string, ...Array<number | undefined>], 1>>().toBe<[string, ...Array<number | undefined>]>();

// A key that only one member of a union has is accepted, and a member without it is left as it is.
expectTypeOf<SetRequired<{a?: 1} | {b?: 2}, 'a'>>().toBe<{a: 1} | {b?: 2}>();
expectTypeOf<SetRequired<{a?: 1} | {b?: 2}, 'b'>>().toBe<{a?: 1} | {b: 2}>();

// TypeScript rejects a required element that follows an optional one, so `[number?, number]` is not a tuple type and the walk stops at the first optional element. Naming both keys gives `[number, number]`, which is the answer when the earlier key is named too.
declare const afterAnOptionalElement: SetRequired<[number?, number?], 1>;
expectTypeOf(afterAnOptionalElement).toBe<[number?, number?]>();

declare const afterAnOptionalElementWithBothKeys: SetRequired<[number?, number?], '0' | '1'>;
expectTypeOf(afterAnOptionalElementWithBothKeys).toBe<[number, number]>();

declare const afterAnOptionalElementWithBothKeysAsNumbers: SetRequired<[number?, number?], 0 | 1>;
expectTypeOf(afterAnOptionalElementWithBothKeysAsNumbers).toBe<[number, number]>();

// The rebuilt call signature keeps the `this` parameter, which `Parameters` leaves out, so a wrong receiver stays a type error after the transform.
declare const thisParameter: ThisParameterType<SetRequired<{(this: Date, a: string): void; p: string}, 'p'>>;
expectTypeOf(thisParameter).toBe<Date>();

// The call signature is kept per member, so a union of callables does not mix their signatures, and a callable member keeps its signature beside a member that is not callable.
type StringCallable = ((a: string) => 1) & {x?: 1};
type NumberCallable = ((a: number) => 2) & {y?: 2};
expectTypeOf<((a: string) => 1) & {y?: 2}>().not.toBeAssignableTo<SetRequired<StringCallable | NumberCallable, 'x'>>();
expectTypeOf(({} as Extract<SetRequired<StringCallable | {z?: 1}, 'x'>, Function>)('a')).toBe<1>();

// `any` is not an array, so it does not take the tuple branch as well as the object branch.
declare const anyBase: SetRequired<any, 'a'>;
expectTypeOf(anyBase).toBe<{[x: string]: any}>();

// A shared selected key must stay paired with its own callable signature too.
type NumberCallableWithSharedKey = ((argument: number) => 2) & {x?: 2};
type RequiredSharedCallableKey = SetRequired<StringCallable | NumberCallableWithSharedKey, 'x'>;
expectTypeOf<((argument: string) => 1) & {x: 1}>().toBeAssignableTo<RequiredSharedCallableKey>();
expectTypeOf<((argument: number) => 2) & {x: 2}>().toBeAssignableTo<RequiredSharedCallableKey>();
expectTypeOf<((argument: string) => 1) & {x: 2}>().not.toBeAssignableTo<RequiredSharedCallableKey>();
expectTypeOf<((argument: number) => 2) & {x: 1}>().not.toBeAssignableTo<RequiredSharedCallableKey>();
