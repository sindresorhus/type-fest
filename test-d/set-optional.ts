import {expectTypeOf} from 'nz';
import type {SetOptional, Simplify, Tagged} from '../index.d.ts';

// Update one required and one optional to optional.
declare const variation1: SetOptional<{a: number; b?: string; c: boolean}, 'b' | 'c'>;
expectTypeOf(variation1).toBe<{a: number; b?: string; c?: boolean}>();

// Update two required to optional.
declare const variation2: SetOptional<{a: number; b: string; c: boolean}, 'a' | 'b'>;
expectTypeOf(variation2).toBe<{a?: number; b?: string; c: boolean}>();

// Three optional remain optional.
declare const variation3: SetOptional<{a?: number; b?: string; c?: boolean}, 'a' | 'b' | 'c'>;
expectTypeOf(variation3).toBe<{a?: number; b?: string; c?: boolean}>();

// Fail if type changes even if optional is right.
declare const variation4: SetOptional<{a: number; b?: string; c: boolean}, 'b' | 'c'>;
expectTypeOf(variation4).not.toBeAssignableTo<{a: boolean; b?: string; c?: boolean}>();

// Preserves readonly modifier.
declare const variation5: SetOptional<{readonly a: number; readonly b?: string; c: boolean}, 'b' | 'c'>;
expectTypeOf(variation5).toBe<{readonly a: number; readonly b?: string; c?: boolean}>();

// Works with unions.
declare const variation6: SetOptional<{readonly a: number; b: number; c: boolean} | {a: string; readonly b: string; d: boolean}, 'a' | 'b'>;
expectTypeOf(variation6).toBe<{readonly a?: number; b?: number; c: boolean} | {a?: string; readonly b?: string; d: boolean}>();

// Marks all keys as optional, if `Keys` is `any`.
declare const variation7: SetOptional<{readonly a: number; b: string; c: boolean}, any>;
expectTypeOf(variation7).toBe<{readonly a?: number; b?: string; c?: boolean}>();

// Does nothing, if `Keys` is `never`.
declare const variation8: SetOptional<{a?: number; readonly b?: string; readonly c: boolean}, never>;
expectTypeOf(variation8).toBe<{a?: number; readonly b?: string; readonly c: boolean}>();

// Works with index signatures
declare const variation9: SetOptional<{[k: string]: unknown; a: number; b?: string}, 'a' | 'b'>;
expectTypeOf(variation9).toBe<{[k: string]: unknown; a?: number; b?: string}>();

// Works with functions containing properties
declare const variation10: SetOptional<{(a1: string, a2: number): boolean; p1: string; readonly p2?: number}, 'p1'>;
expectTypeOf(variation10('foo', 1)).toBe<boolean>();
expectTypeOf<Simplify<typeof variation10>>().toBe<{p1?: string; readonly p2?: number}>(); // `Simplify` removes the call signature from `typeof variation10`

declare const variation11: SetOptional<{(a1: boolean, ...a2: string[]): number; p1: string; readonly p2: number; p3: boolean}, 'p1' | 'p2'>;
expectTypeOf(variation11(true, 'foo', 'bar', 'baz')).toBe<number>();
expectTypeOf<Simplify<typeof variation11>>().toBe<{p1?: string; readonly p2?: number; p3: boolean}>();

// Functions without properties are returned as is
declare const variation12: SetOptional<(a: string) => number, never>;
expectTypeOf(variation12('foo')).toBe<number>();

// A tuple stays a tuple, with trailing selected indices made optional. An element before a required one gains `| undefined` instead, since TypeScript rejects a required element after an optional one.
declare const tuple: SetOptional<[string, number, boolean], '2'>;
expectTypeOf(tuple).toBe<[string, number, boolean?]>();

declare const readonlyTuple: SetOptional<readonly [string, number, boolean], '1' | '2'>;
expectTypeOf(readonlyTuple).toBe<readonly [string, number?, boolean?]>();

declare const optionalTail: SetOptional<[string, number, boolean?], '1'>;
expectTypeOf(optionalTail).toBe<[string, number?, boolean?]>();

declare const alreadyOptional: SetOptional<[string, number?], '1'>;
expectTypeOf(alreadyOptional).toBe<[string, number?]>();

expectTypeOf<SetOptional<[1, 2, 3], 1>>().toBe<[1, 2 | undefined, 3]>();
expectTypeOf<SetOptional<readonly [1, 2, 3], 0 | 2>>().toBe<readonly [1 | undefined, 2, 3?]>();

// A tuple can require its trailing element after a rest element, so an earlier selected element remains required too.
expectTypeOf<SetOptional<[1, ...string[], 2], 0>>().toBe<[1 | undefined, ...string[], 2]>();

// A key that lands in a rest element is ignored, because a rest element has no optionality to add: its elements are always present, so there is nothing for the key to change.
expectTypeOf<SetOptional<[string, number, ...boolean[]], 2>>().toBe<[string, number, ...boolean[]]>();

// A key that only one member of a union has is still a key of that member, and the type distributes over the union anyway, so it should be accepted. `keyof` of a union is the intersection of its members' keys, so the constraint rejected it and the user got a type error instead of a result.
declare const keyOfOneMember: SetOptional<{a: 1} | {b: 2}, 'a'>;
expectTypeOf(keyOfOneMember).toBe<{a?: 1} | {b: 2}>();

declare const keyOfOneMemberRequired: SetOptional<{a: 1} | {b: 2}, 'b'>;
expectTypeOf(keyOfOneMemberRequired).toBe<{a: 1} | {b?: 2}>();

declare const keyOfBothMembers: SetOptional<{a: 1} | {a: 2}, 'a'>;
expectTypeOf(keyOfBothMembers).toBe<{a?: 1} | {a?: 2}>();

// The rebuilt call signature keeps the `this` parameter, which `Parameters` leaves out, so a wrong receiver stays a type error after the transform.
declare const thisParameter: ThisParameterType<SetOptional<{(this: Date, a: string): void; p: string}, 'p'>>;
expectTypeOf(thisParameter).toBe<Date>();

// The keys are required, like for `SetRequired` and `SetReadonly`.
// @ts-expect-error
type MissingKeys = SetOptional<{a: 1}>;

// `any` is not an array, so it does not take the tuple branch as well as the object branch.
declare const anyBase: SetOptional<any, 'a'>;
expectTypeOf(anyBase).toBe<{[x: string]: any}>();

// Empty array
expectTypeOf<SetOptional<[], never>>().toBe<[]>();
expectTypeOf<SetOptional<readonly [], never>>().toBe<readonly []>();

// All required elements
expectTypeOf<SetOptional<[string, number], '1'>>().toBe<[string, number?]>();
expectTypeOf<SetOptional<[string, number, boolean], '0' | '1' | '2'>>().toBe<[string?, number?, boolean?]>();
expectTypeOf<SetOptional<[(string | number)], '0'>>().toBe<[(string | number)?]>();

// Works with number `Keys`, string `Keys`, and union of them.
expectTypeOf<SetOptional<[string, number, boolean], 2>>().toBe<[string, number, boolean?]>();
expectTypeOf<SetOptional<[string, number, boolean, ...number[]], '1' | '2'>>().toBe<[string, number?, boolean?, ...number[]]>();
expectTypeOf<SetOptional<readonly [string, number, boolean], '0' | 1 | 2>>().toBe<readonly [string?, number?, boolean?]>();

// Mix of optional and required elements
expectTypeOf<SetOptional<readonly [string, number, boolean?], '0' | '1'>>().toBe<readonly [string?, number?, boolean?]>();

// Mix of required and rest elements
expectTypeOf<SetOptional<[string, number, boolean, ...number[]], '2'>>().toBe<[string, number, boolean?, ...number[]]>();
expectTypeOf<SetOptional<[string, number, boolean, ...number[]], '1' | 2>>().toBe<[string, number?, boolean?, ...number[]]>();

// Mix of optional, required, and rest elements
expectTypeOf<SetOptional<readonly [string, number, boolean?, ...number[]], '1'>>().toBe<readonly [string, number?, boolean?, ...number[]]>();
expectTypeOf<SetOptional<[string, number, boolean?, ...string[]], '0' | 1>>().toBe<[string?, number?, boolean?, ...string[]]>();

// Works with readonly arrays
expectTypeOf<SetOptional<readonly [(string | number)], '0'>>().toBe<readonly [(string | number)?]>();
expectTypeOf<SetOptional<readonly [string, number, boolean?], '1'>>().toBe<readonly [string, number?, boolean?]>();
expectTypeOf<SetOptional<readonly [string, number, boolean, ...number[]], '1' | '2'>>().toBe<readonly [string, number?, boolean?, ...number[]]>();
expectTypeOf<SetOptional<readonly [string, number, boolean?, ...string[]], 0 | '1'>>().toBe<readonly [string?, number?, boolean?, ...string[]]>();

// Ignores `Keys` that are already optional, and still applies the other keys
expectTypeOf<SetOptional<[string, number, boolean?], '2'>>().toBe<[string, number, boolean?]>();
expectTypeOf<SetOptional<readonly [string, number?, boolean?], 1 | 2>>().toBe<readonly [string, number?, boolean?]>();
expectTypeOf<SetOptional<readonly [string, number?, boolean?, ...number[]], 1 | 2>>().toBe<readonly [string, number?, boolean?, ...number[]]>();
expectTypeOf<SetOptional<[string, number, boolean?, ...number[]], '1' | '2'>>().toBe<[string, number?, boolean?, ...number[]]>();

// Ignores `Keys` that are out of bounds, and still applies the other keys
expectTypeOf<SetOptional<[], 1>>().toBe<[]>();
expectTypeOf<SetOptional<[string, number, boolean], 10>>().toBe<[string, number, boolean]>();
expectTypeOf<SetOptional<[string, number, boolean], 0 | 1 | 2 | 3 | 4>>().toBe<[string?, number?, boolean?]>();
expectTypeOf<SetOptional<readonly [string, number, boolean?, ...number[]], 10 | 1>>().toBe<readonly [string, number?, boolean?, ...number[]]>();

// Marks all keys as optional, if `Keys` is `any`.
expectTypeOf<SetOptional<[string, number, boolean], any>>().toBe<[string?, number?, boolean?]>();
expectTypeOf<SetOptional<[string, number, boolean, ...number[]], any>>().toBe<[string?, number?, boolean?, ...number[]]>();
expectTypeOf<SetOptional<readonly [string, number, boolean, ...number[]], any>>().toBe<readonly [string?, number?, boolean?, ...number[]]>();
expectTypeOf<SetOptional<readonly [string, number, boolean?, ...number[]], any>>().toBe<readonly [string?, number?, boolean?, ...number[]]>();

// Marks all keys as optional, if `Keys` is `number`.
expectTypeOf<SetOptional<[string, number, boolean], number>>().toBe<[string?, number?, boolean?]>();
expectTypeOf<SetOptional<[string, number, boolean, ...number[]], number>>().toBe<[string?, number?, boolean?, ...number[]]>();
expectTypeOf<SetOptional<readonly [string, number, boolean, ...number[]], number>>().toBe<readonly [string?, number?, boolean?, ...number[]]>();
expectTypeOf<SetOptional<readonly [string, number, boolean?, ...number[]], number>>().toBe<readonly [string?, number?, boolean?, ...number[]]>();

// Returns the array as-is, if `Keys` is `never`.
expectTypeOf<SetOptional<[string, number?], never>>().toBe<[string, number?]>();
expectTypeOf<SetOptional<readonly [string, number?, ...number[]], never>>().toBe<readonly [string, number?, ...number[]]>();

// Elements after a rest element are left unchanged, because a tuple cannot have an optional element after a rest element.
expectTypeOf<SetOptional<[...string[], string | undefined, number], any>>().toBe<[...string[], string | undefined, number]>();

// Preserves `| undefined`, similar to how built-in `Partial` works.
expectTypeOf<SetOptional<[string | undefined, number | undefined, boolean], 1 | 2>>().toBe<[string | undefined, (number | undefined)?, boolean?]>();
expectTypeOf<SetOptional<readonly [string | undefined, number | undefined, boolean], 0 | 1 | 2>>().toBe<readonly [(string | undefined)?, (number | undefined)?, boolean?]>();

// Optional elements cannot appear before required ones, so a selected element before a required one gains `| undefined` instead.
expectTypeOf<SetOptional<[string, number, boolean], 0 | 1>>().toBe<[string | undefined, number | undefined, boolean]>();
expectTypeOf<SetOptional<[string, number, boolean, string, string], 0 | 2 | 4>>().toBe<[string | undefined, number, boolean | undefined, string, string?]>();
expectTypeOf<SetOptional<readonly [string, number, boolean, ...string[]], 0 | 2>>().toBe<readonly [string | undefined, number, boolean?, ...string[]]>();

// Works with unions of arrays
expectTypeOf<SetOptional<readonly [] | [], never>>().toBe<readonly [] | []>();
expectTypeOf<SetOptional<[] | readonly [(string | number)], 0>>().toBe<[] | readonly [(string | number)?]>();
expectTypeOf<SetOptional<[string] | [string, number, boolean, ...number[]] | readonly [string, number], 0 | 2>>()
	.toBe<[string?] | [string | undefined, number, boolean?, ...number[]] | readonly [string | undefined, number]>();
expectTypeOf<SetOptional<readonly [number, string] | [string, boolean, ...number[]] | readonly [string, number, boolean, (string | undefined)], 1 | 3>>()
	.toBe<readonly [number, string?] | [string, boolean?, ...number[]] | readonly [string, number | undefined, boolean, (string | undefined)?]>();
expectTypeOf<SetOptional<readonly [...number[], number] | [string, boolean, ...number[]] | readonly [string, number | undefined, boolean?, string?], any>>()
	.toBe<readonly [...number[], number] | [string?, boolean?, ...number[]] | readonly [string?, (number | undefined)?, boolean?, string?]>();
expectTypeOf<SetOptional<readonly string[] | [x: number, y: number] | [string, number, ...string[]], number>>().toBe<readonly string[] | [x?: number, y?: number] | [string?, number?, ...string[]]>();

// Works with labelled tuples
expectTypeOf<SetOptional<[x: string, y: number], '1'>>().toBe<[x: string, y?: number]>();
expectTypeOf<SetOptional<readonly [x: number, y: number, z: number], 1 | 2>>().toBe<readonly [x: number, y?: number, z?: number]>();
expectTypeOf<SetOptional<readonly [x: number, y: number, z: number, ...rest: number[]], 1 | 2>>().toBe<readonly [x: number, y?: number, z?: number, ...rest: number[]]>();

// Non tuple arrays are left unchanged
expectTypeOf<SetOptional<string[], number>>().toBe<string[]>();
expectTypeOf<SetOptional<ReadonlyArray<string | number>, number>>().toBe<ReadonlyArray<string | number>>();
expectTypeOf<SetOptional<[...number[]], never>>().toBe<number[]>();

// An array with extra members is returned as is when `Keys` is `never`, and a key that is not an index takes the object branch, so the extra members are kept.
type AugmentedArray = string[] & {tag: boolean};
expectTypeOf<SetOptional<AugmentedArray, never>>().toBe<AugmentedArray>();

declare const augmentedArray: SetOptional<AugmentedArray, 'tag'>;
expectTypeOf(augmentedArray.tag).toBe<boolean | undefined>();

type TaggedTuple = Tagged<[string, number], 'Tuple'>;
expectTypeOf<SetOptional<TaggedTuple, never>>().toBe<TaggedTuple>();
