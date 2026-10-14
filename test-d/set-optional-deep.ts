import {expectTypeOf} from 'nz';
import type {DigitCharacter, Paths, SetOptionalDeep} from '../index.d.ts';

// Set nested key to optional
declare const variation1: SetOptionalDeep<{a: number; b: {c: string}}, 'b.c'>;
expectTypeOf(variation1).toBe<{a: number; b: {c?: string}}>();

// Set key to optional but not nested keys if not specified
declare const variation2: SetOptionalDeep<{a: number; b: {c: string}}, 'b'>;
expectTypeOf(variation2).toBe<{a: number; b?: {c: string}}>();

// Set root key to optional
declare const variation3: SetOptionalDeep<{a: number; b: {c: string}}, 'a'>;
expectTypeOf(variation3).toBe<{a?: number; b: {c: string}}>();

// Keeps optional key as optional
declare const variation4: SetOptionalDeep<{a?: number; b: {c: string}}, 'a'>;
expectTypeOf(variation4).toBe<{a?: number; b: {c: string}}>();

// Set key to optional in a union.
declare const variation5: SetOptionalDeep<{a: '1'; b: {c: boolean}} | {a: '2'; b: {c: boolean}}, 'a'>;
expectTypeOf(variation5).toBe<{a?: '1'; b: {c: boolean}} | {a?: '2'; b: {c: boolean}}>();

// Set key with array type to optional
declare const variation6: SetOptionalDeep<{a: Array<{b: number}>}, 'a'>;
expectTypeOf(variation6).toBe<{a?: Array<{b: number}>}>();

// Can set both root and nested keys to optional
declare const variation7: SetOptionalDeep<{a: number; b: {c: string}}, 'b' | 'b.c'>;
expectTypeOf(variation7).toBe<{a: number; b?: {c?: string}}>();

// Preserves optional root keys
declare const variation8: SetOptionalDeep<{a?: 1; b: {c: 1}}, 'b.c'>;
expectTypeOf(variation8).toBe<{a?: 1; b: {c?: 1}}>();

// Preserves union in root keys
declare const variation9: SetOptionalDeep<{a: 1; b: number | {c: 1}}, 'b.c'>;
expectTypeOf(variation9).toBe<{a: 1; b: number | {c?: 1}}>();

// Preserves readonly
declare const variation10: SetOptionalDeep<{a: 1; readonly b: {c: 1}}, 'b.c'>;
expectTypeOf(variation10).toBe<{a: 1; readonly b: {c?: 1}}>();

declare const variation11: SetOptionalDeep<{readonly a: 1; readonly b: {readonly c: 1}}, 'a' | 'b'>;
expectTypeOf(variation11).toBe<{readonly a?: 1; readonly b?: {readonly c: 1}}>();

declare const variation12: SetOptionalDeep<{readonly a: 1; readonly b: {readonly c: 1}}, 'a' | 'b' | 'b.c'>;
expectTypeOf(variation12).toBe<{readonly a?: 1; readonly b?: {readonly c?: 1}}>();

// Works with number keys
declare const variation13: SetOptionalDeep<{0: 1; 1: {2: string}}, '1.2'>;
expectTypeOf(variation13).toBe<{0: 1; 1: {2?: string}}>();

declare const variation14: SetOptionalDeep<{0: 1; 1: {2: string}}, 0 | 1>;
expectTypeOf(variation14).toBe<{0?: 1; 1?: {2: string}}>();

// Multiple keys
declare const variation15: SetOptionalDeep<{a: 1; b: {c: 2}; d: {e: {f: 2}; g: 3}}, 'a' | 'b' | 'b.c' | 'd.e.f' | 'd.g'>;
expectTypeOf(variation15).toBe<{a?: 1; b?: {c?: 2}; d: {e: {f?: 2}; g?: 3}}>();

// Index signatures
declare const variation16: SetOptionalDeep<{[x: string]: any; a: number; b: {c: number}}, 'a' | 'b.c'>;
expectTypeOf(variation16).toBe<{[x: string]: any; a?: number; b: {c?: number}}>();

// Does nothing when `KeyPaths` is `never`
declare const variation17: SetOptionalDeep<{a: number; readonly b: {c: string}}, never>;
expectTypeOf(variation17).toBe<{a: number; readonly b: {c: string}}>();

// Calls `PartialDeep` when `KeyPaths` is `any`
declare const variation18: SetOptionalDeep<{a: number; readonly b: {c: string}}, any>;
expectTypeOf(variation18).toBe<{a?: number; readonly b?: {c?: string}}>();

// Preserves union in nested keys
declare const variation19: SetOptionalDeep<{a: number; b: {c: number} | {d: string}}, 'b' | 'b.d'>;
expectTypeOf(variation19).toBe<{a: number; b?: {c: number} | {d?: string}}>();

// Works with number keys containing dots
// NOTE: Passing "1.2" instead of 1.2 will treat it as a path instead of a key
declare const variation20: SetOptionalDeep<{1.2: string; 1: {2: string}}, 1.2>;
expectTypeOf(variation20).toBe<{1.2?: string; 1: {2: string}}>();

declare const variation21: SetOptionalDeep<{1.2: string; 1: {2: string}}, '1.2'>;
expectTypeOf(variation21).toBe<{1.2: string; 1: {2?: string}}>();

// Works with unions
declare const variation22: SetOptionalDeep<{a: {readonly b: number}} | {readonly b: {c: number[]}}, 'a.b' | 'b' | 'b.c'>;
expectTypeOf(variation22).toBe<{a: {readonly b?: number}} | {readonly b?: {c?: number[]}}>();

// Works with `KeyPaths` containing template literals
declare const variation23: SetOptionalDeep<{a: number; b: {c: number} | {d: number}}, `b.${'c' | 'd'}`>;
expectTypeOf(variation23).toBe<{a: number; b: {c?: number} | {d?: number}}>();

// =================
// Works with arrays
// =================

// Make trailing elements optional
expectTypeOf<SetOptionalDeep<{a: [string, number, boolean]}, 'a.1' | 'a.2'>>().toBe<{a: [string, number?, boolean?]}>();

// Make only the last element optional
expectTypeOf<SetOptionalDeep<{a: [string, number, boolean]}, 'a.2'>>().toBe<{a: [string, number, boolean?]}>();

// A selected element with a required element after it stays required and gains `| undefined`, like `SetOptional`
expectTypeOf<SetOptionalDeep<{a: [string, number, boolean]}, 'a.1'>>().toBe<{a: [string, number | undefined, boolean]}>();

// Extends an existing trailing optional run towards the front
expectTypeOf<SetOptionalDeep<{a: [string, number, boolean?]}, 'a.1'>>().toBe<{a: [string, number?, boolean?]}>();

// Works with readonly arrays
expectTypeOf<SetOptionalDeep<{readonly a: readonly [string, number, boolean]}, 'a.1' | 'a.2'>>().toBe<{readonly a: readonly [string, number?, boolean?]}>();

// Ignores keys that are already optional
expectTypeOf<SetOptionalDeep<{a: [string, number?, boolean?]}, 'a.2'>>().toBe<{a: [string, number?, boolean?]}>();

// Non tuple arrays are left unchanged
expectTypeOf<SetOptionalDeep<{a: string[]}, `a.${number}`>>().toBe<{a: string[]}>();

// Fixed elements of a tuple with a rest element can be made optional
expectTypeOf<SetOptionalDeep<{a: [string, number, boolean?, ...string[]]}, 'a.1'>>().toBe<{a: [string, number?, boolean?, ...string[]]}>();
expectTypeOf<SetOptionalDeep<{a: [string, number, ...boolean[]]}, 'a.0' | 'a.1'>>().toBe<{a: [string?, number?, ...boolean[]]}>();

expectTypeOf<SetOptionalDeep<{a: [string, number, ...boolean[]]}, 'a.1'>>().toBe<{a: [string, number?, ...boolean[]]}>();
expectTypeOf<SetOptionalDeep<{readonly a: readonly [string, number, ...boolean[]]}, 'a.1'>>().toBe<{readonly a: readonly [string, number?, ...boolean[]]}>();

// A key that lands in a rest element is ignored, like `SetOptional`
expectTypeOf<SetOptionalDeep<{a: [string, number, ...boolean[]]}, 'a.2'>>().toBe<{a: [string, number, ...boolean[]]}>();

// Set key inside array to optional
expectTypeOf<SetOptionalDeep<{a: Array<{b: number}>}, `a.${number}.b`>>().toBe<{a: Array<{b?: number}>}>();
expectTypeOf<SetOptionalDeep<{readonly a: [{readonly b: number}]}, 'a.0.b'>>().toBe<{readonly a: [{readonly b?: number}]}>();

// Works with nested arrays
expectTypeOf<SetOptionalDeep<{a: [[string, number]]}, 'a.0.1'>>().toBe<{a: [[string, number?]]}>();
expectTypeOf<SetOptionalDeep<{a: Array<[string, number]>}, `a.${number}.1`>>().toBe<{a: Array<[string, number?]>}>();

// Works with labelled tuples
expectTypeOf<SetOptionalDeep<{a: [b: string, c: number]}, 'a.0' | 'a.1'>>().toBe<{a: [b?: string, c?: number]}>();

// All terminal keys of a tuple are applied together, so union member order cannot leave an earlier element required.
declare const allIndices: SetOptionalDeep<readonly [string, number, boolean], '2' | '1' | '0'>;
expectTypeOf(allIndices).toBe<readonly [string?, number?, boolean?]>();

// Each object-union member keeps its own paths, and selected siblings are made optional together at each level.
declare const disjointPaths: SetOptionalDeep<{left: {first: string; second: number}} | {right: [string, number]}, 'left.first' | 'left.second' | 'right.0' | 'right.1'>;
expectTypeOf(disjointPaths).toBe<{left: {first?: string; second?: number}} | {right: [string?, number?]}>();

// A path deeper than `Paths` lists by default is accepted, and a missing path is ignored.
type DeepRequired = {a: {b: {c: {d: {e: {f: {g: {h: 1}}}}}}}};
expectTypeOf<SetOptionalDeep<DeepRequired, 'a.b.c.d.e.f.g.h'>>().toBe<{a: {b: {c: {d: {e: {f: {g: {h?: 1}}}}}}}}>();
expectTypeOf<SetOptionalDeep<{a: number; b: {c: number}}, 'b.c' | 'missing' | 'b.missing'>>().toBe<{a: number; b: {c?: number}}>();
expectTypeOf<SetOptionalDeep<{a: number}, 'missing'>>().toBe<{a: number}>();

// A non-literal path segment matches every key at its level, like a path through an index signature.
expectTypeOf<SetOptionalDeep<{a: number; b: {c: number}}, string>>().toBe<{a?: number; b?: {c: number}}>();
expectTypeOf<SetOptionalDeep<{a: number; b: {c: number}}, `b.${string}`>>().toBe<{a: number; b: {c?: number}}>();

// Built-ins and functions are not walked into.
expectTypeOf<SetOptionalDeep<{a: Date; b: {c: Date}}, 'b.c'>>().toBe<{a: Date; b: {c?: Date}}>();
expectTypeOf<SetOptionalDeep<{a: Date}, 'a.getTime'>>().toBe<{a: Date}>();

// Works with unions of arrays
expectTypeOf<SetOptionalDeep<{a: [string] | [string, number, boolean, ...number[]] | readonly [string, number]}, 'a.0' | 'a.1'>>()
	.toBe<{a: [string?] | [string | undefined, number | undefined, boolean, ...number[]] | readonly [string?, number?]}>();

// Marks all fixed elements as optional, if the path is `number`.
expectTypeOf<SetOptionalDeep<{a: readonly [string, number, ...boolean[]]}, `a.${number}`>>().toBe<{a: readonly [string?, number?, ...boolean[]]}>();

// A parent path, a path inside an element, and an element path can be combined.
expectTypeOf<SetOptionalDeep<{readonly a: [{readonly b: number}, {c: string}]}, 'a' | 'a.0.b' | 'a.1'>>().toBe<{readonly a?: [{readonly b?: number}, {c: string}?]}>();
expectTypeOf<SetOptionalDeep<{readonly a: ReadonlyArray<string | number>}, 'a' | `a.${number}`>>().toBe<{readonly a?: ReadonlyArray<string | number>}>();

// Preserves `| undefined`, similar to how built-in `Partial` works.
expectTypeOf<SetOptionalDeep<{a: [string | undefined, number]}, 'a.0' | 'a.1'>>().toBe<{a: [(string | undefined)?, number?]}>();

// Works with a numeric key containing dots and a dotted path together
declare const variation24: SetOptionalDeep<{1.2: string; 1: {2: string}}, 1.2 | '1.2'>;
expectTypeOf(variation24).toBe<{1.2?: string; 1: {2?: string}}>();

// Works with unions, template literals, and readonly members together
declare const variation25: SetOptionalDeep<{a: number; b: {readonly c: {1: number}} | {d: {1: number}}}, 'a' | `b.${'c' | 'd'}.1`>;
expectTypeOf(variation25).toBe<{a?: number; b: {readonly c: {1?: number}} | {d: {1?: number}}}>();

// `any`, `never`, and `unknown` values are made optional as is.
expectTypeOf<SetOptionalDeep<{a: any; b: never; c: unknown}, 'a' | 'b' | 'c'>>().toBe<{a?: any; b?: never; c?: unknown}>();
expectTypeOf<SetOptionalDeep<{a: {b: any}}, 'a.b'>>().toBe<{a: {b?: any}}>();

// `any` and `never` base types are returned as is.
expectTypeOf<SetOptionalDeep<any, 'a'>>().toBe<any>();
expectTypeOf<SetOptionalDeep<never, 'a'>>().toBe<never>();

// `Paths<T>` is a valid path for a generic `T`, even though autocomplete only lists paths up to `a.b.c`.
type SetOptionalDeepAllPaths<T> = SetOptionalDeep<T, Paths<T>>;
expectTypeOf<SetOptionalDeepAllPaths<{a: {b: 1}}>>().toBe<{a?: {b?: 1}}>();

// A number path reads the same index as its string form, also for a generic `Index`. A number that is not a path is ignored, like a string that is not a path. A wide `number` matches every index, like `${number}`.
type SetOptionalDeepIndex<T, Index extends number> = SetOptionalDeep<T, Index>;
expectTypeOf<SetOptionalDeepIndex<[1, 2], 1>>().toBe<[1, 2?]>();
expectTypeOf<SetOptionalDeep<{a: 1}, 5>>().toBe<{a: 1}>();
expectTypeOf<SetOptionalDeep<[1, 2], -1 | 1.5>>().toBe<[1, 2]>();
expectTypeOf<SetOptionalDeepIndex<[1, 2], number>>().toBe<[1?, 2?]>();

// Autocomplete only lists paths up to `a.b.c`, so a type with very many deeper paths does not make the union of paths too complex to represent.
type Level<Value> = Record<DigitCharacter, Value>;
type ManyPaths = Level<Level<Level<Level<Level<Level<1>>>>>>;
expectTypeOf<SetOptionalDeep<ManyPaths, '0.0.0.0.0.0'>['0']['0']['0']['0']['0']>().toBe<{0?: 1; 1: 1; 2: 1; 3: 1; 4: 1; 5: 1; 6: 1; 7: 1; 8: 1; 9: 1}>();
