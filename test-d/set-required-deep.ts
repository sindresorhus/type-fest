import {expectTypeOf} from 'nz';
import type {SetRequiredDeep} from '../index.d.ts';

// Set nested key to required
declare const variation1: SetRequiredDeep<{a?: number; b?: {c?: string}}, 'b.c'>;
expectTypeOf(variation1).toBe<{a?: number; b?: {c: string}}>();

// Set key to required but not nested keys if not specified
declare const variation2: SetRequiredDeep<{a?: number; b?: {c?: string}}, 'b'>;
expectTypeOf(variation2).toBe<{a?: number; b: {c?: string}}>();

// Set root key to required
declare const variation3: SetRequiredDeep<{a?: number; b?: {c?: string}}, 'a'>;
expectTypeOf(variation3).toBe<{a: number; b?: {c?: string}}>();

// Keeps required key as required
declare const variation4: SetRequiredDeep<{a: number; b?: {c?: string}}, 'a'>;
expectTypeOf(variation4).toBe<{a: number; b?: {c?: string}}>();

// Set key to required in a union.
declare const variation5: SetRequiredDeep<{a?: '1'; b?: {c?: boolean}} | {a?: '2'; b?: {c?: boolean}}, 'a'>;
expectTypeOf(variation5).toBe<{a: '1'; b?: {c?: boolean}} | {a: '2'; b?: {c?: boolean}}>();

// Set key with array type to required
declare const variation6: SetRequiredDeep<{a?: Array<{b?: number}>}, 'a'>;
expectTypeOf(variation6).toBe<{a: Array<{b?: number}>}>();

// Can set both root and nested keys to required
declare const variation7: SetRequiredDeep<{a?: number; b?: {c?: string}}, 'b' | 'b.c'>;
expectTypeOf(variation7).toBe<{a?: number; b: {c: string}}>();

// Preserves required root keys
declare const variation8: SetRequiredDeep<{a: 1; b: {c?: 1}}, 'b.c'>;
expectTypeOf(variation8).toBe<{a: 1; b: {c: 1}}>();

// Preserves union in root keys
declare const variation9: SetRequiredDeep<{a: 1; b: {c?: 1} | number}, 'b.c'>;
expectTypeOf(variation9).toBe<{a: 1; b: {c: 1} | number}>();

// Preserves readonly
declare const variation10: SetRequiredDeep<{a: 1; readonly b: {c?: 1}}, 'b.c'>;
expectTypeOf(variation10).toBe<{a: 1; readonly b: {c: 1}}>();

declare const variation11: SetRequiredDeep<{readonly a?: 1; readonly b?: {readonly c?: 1}}, 'a' | 'b'>;
expectTypeOf(variation11).toBe<{readonly a: 1; readonly b: {readonly c?: 1}}>();

declare const variation12: SetRequiredDeep<{readonly a?: 1; readonly b?: {readonly c?: 1}}, 'a' | 'b' | 'b.c'>;
expectTypeOf(variation12).toBe<{readonly a: 1; readonly b: {readonly c: 1}}>();

// Works with number keys
declare const variation13: SetRequiredDeep<{0: 1; 1: {2?: string}}, '1.2'>;
expectTypeOf(variation13).toBe<{0: 1; 1: {2: string}}>();

declare const variation14: SetRequiredDeep<{0?: 1; 1?: {2?: string}}, 0 | 1>;
expectTypeOf(variation14).toBe<{0: 1; 1: {2?: string}}>();

// Multiple keys
declare const variation15: SetRequiredDeep<{a?: 1; b?: {c?: 2}; d?: {e?: {f?: 2}; g?: 3}}, 'a' | 'b' | 'b.c' | 'd.e.f' | 'd.g'>;
expectTypeOf(variation15).toBe<{a: 1; b: {c: 2}; d?: {e?: {f: 2}; g: 3}}>();

// Index signatures
declare const variation16: SetRequiredDeep<{[x: string]: any; a?: number; b?: {c?: number}}, 'a' | 'b.c'>;
expectTypeOf(variation16).toBe<{[x: string]: any; a: number; b?: {c: number}}>();

// Preserves union in nested keys
declare const variation17: SetRequiredDeep<{a: 1; b?: {c?: 1} | number}, 'b'>;
expectTypeOf(variation17).toBe<{a: 1; b: {c?: 1} | number}>();

declare const variation18: SetRequiredDeep<{a?: number; b?: {c?: number} | {d?: string}}, 'b' | 'b.d'>;
expectTypeOf(variation18).toBe<{a?: number; b: {c?: number} | {d: string}}>();

// Works with number keys containing dots
// NOTE: Passing "1.2" instead of 1.2 will treat it as a path instead of a key
declare const variation19: SetRequiredDeep<{1.2?: string; 1?: {2?: string}}, 1.2>;
expectTypeOf(variation19).toBe<{1.2: string; 1?: {2?: string}}>();

declare const variation20: SetRequiredDeep<{1.2?: string; 1?: {2?: string}}, '1.2'>;
expectTypeOf(variation20).toBe<{1.2?: string; 1?: {2: string}}>();

declare const variation21: SetRequiredDeep<{1.2?: string; 1?: {2?: string}}, 1.2 | '1.2'>;
expectTypeOf(variation21).toBe<{1.2: string; 1?: {2: string}}>();

// Works with unions
declare const variation22: SetRequiredDeep<{a?: {readonly b?: number}} | {readonly b?: {c?: number[]}}, 'a.b' | 'b' | 'b.c'>;
expectTypeOf(variation22).toBe<{a?: {readonly b: number}} | {readonly b: {c: number[]}}>();

// Works with `KeyPaths` containing template literals
declare const variation23: SetRequiredDeep<{a?: number; b?: {c?: number} | {d?: number}}, `b.${'c' | 'd'}`>;
expectTypeOf(variation23).toBe<{a?: number; b?: {c: number} | {d: number}}>();

declare const variation24: SetRequiredDeep<
	{a?: number; b?: {readonly c?: {1?: number}} | {d?: {1?: number}}}, 'a' | `b.${'c' | 'd'}.1`
>;
expectTypeOf(variation24).toBe<{a: number; b?: {readonly c?: {1: number}} | {d?: {1: number}}}>();

// Calls `RequiredDeep` when `KeyPaths` is `any`
declare const variation25: SetRequiredDeep<{a?: number; readonly b?: {c?: string}}, any>;
expectTypeOf(variation25).toBe<{a: number; readonly b: {c: string}}>();

// Does nothing when `KeyPaths` is `never`
declare const variation26: SetRequiredDeep<{a?: number; readonly b?: {c?: string}}, never>;
expectTypeOf(variation26).toBe<{a?: number; readonly b?: {c?: string}}>();

// =================
// Works with arrays
// =================

// All optional elements
expectTypeOf<SetRequiredDeep<{a?: [string?, number?, boolean?]}, 'a.0' | 'a.1'>>().toBe<{a?: [string, number, boolean?]}>();

// Mix of optional and required elements
expectTypeOf<SetRequiredDeep<{a: readonly [string, number?, boolean?]}, 'a.1' | 'a.2'>>().toBe<{a: readonly [string, number, boolean]}>();

// Mix of optional and rest elements
expectTypeOf<SetRequiredDeep<{readonly a: [string?, number?, boolean?, ...number[]]}, 'a.0' | 'a.1'>>().toBe<{readonly a: [string, number, boolean?, ...number[]]}>();

// Mix of optional, required, and rest elements
expectTypeOf<SetRequiredDeep<{readonly a?: [string, number?, boolean?, ...string[]]}, 'a.1' | 'a.2'>>().toBe<{readonly a?: [string, number, boolean, ...string[]]}>();

// Works with readonly arrays
expectTypeOf<SetRequiredDeep<{a?: {b?: readonly [(string | number)?]}}, 'a.b.0'>>().toBe<{a?: {b?: readonly [(string | number)]}}>();
expectTypeOf<SetRequiredDeep<{a?: readonly [string, number?, boolean?, ...string[]]}, 'a' | 'a.1' | 'a.2'>>().toBe<{a: readonly [string, number, boolean, ...string[]]}>();

// Ignores `Keys` that are already required
expectTypeOf<SetRequiredDeep<{a: [string, number?, boolean?]}, 'a.0'>>().toBe<{a: [string, number?, boolean?]}>();

// Ignores `Keys` that are not known
// This case is only possible when the array contains a rest element,
// because otherwise the constaint on `KeyPaths` would disallow out of bound keys.
expectTypeOf<SetRequiredDeep<{a?: readonly [string?, number?, boolean?, ...number[]]}, 'a.10'>>().toBe<{a?: readonly [string?, number?, boolean?, ...number[]]}>();

// Marks all keys as required, if `Keys` is `number`.
// This case is only possible when the array contains a rest element,
// because otherwise the constaint on `KeyPaths` would be stricter.
expectTypeOf<SetRequiredDeep<{a?: readonly [string?, number?, boolean?, ...number[]]}, `a.${number}`>>().toBe<{a?: readonly [string, number, boolean, ...number[]]}>();

// Preserves `| undefined`, similar to how built-in `Required` works.
expectTypeOf<SetRequiredDeep<{a: [string | undefined, (number | undefined)?, boolean?]}, 'a.0' | 'a.1' | 'a.2'>>().toBe<{a: [string | undefined, number | undefined, boolean]}>();
expectTypeOf<SetRequiredDeep<{a: readonly [(string | undefined)?, (number | undefined)?, boolean?]}, 'a.0'>>().toBe<{a: readonly [string | undefined, (number | undefined)?, boolean?]}>();

// Optional elements cannot appear after required ones, `Keys` leading to such situations are ignored.
expectTypeOf<SetRequiredDeep<{a: [string?, number?, boolean?]}, 'a.1' | 'a.2'>>().toBe<{a: [string?, number?, boolean?]}>(); // `a.1` and `a.2` can't be required when `a.0` is optional
// `a.3` can't be required when `a.2` is optional
expectTypeOf<SetRequiredDeep<{a: [string?, number?, boolean?, string?, string?]}, 'a.0' | 'a.1' | 'a.3'>>().toBe<{a: [string, number, boolean?, string?, string?]}>();
// `a.2` can't be required when `a.1` is optional
expectTypeOf<SetRequiredDeep<{a?: readonly [string | undefined, number?, boolean?, ...string[]]}, 'a' | 'a.2'>>().toBe<{a: readonly [string | undefined, number?, boolean?, ...string[]]}>();

// Works with unions of arrays
expectTypeOf<SetRequiredDeep<{a: [string?] | [string, number?, boolean?, ...number[]] | readonly [string, number?, boolean?]}, 'a.0' | 'a.1'>>().toBe<{a: [string] | [string, number, boolean?, ...number[]] | readonly [string, number, boolean?]}>();

// Works with labelled tuples
expectTypeOf<SetRequiredDeep<{a?: [b?: string, c?: number]}, 'a.0' | 'a.1'>>().toBe<{a?: [b: string, c: number]}>();

// Non tuple arrays are left unchanged
expectTypeOf<SetRequiredDeep<{a: string[]}, `a.${number}`>>().toBe<{a: string[]}>();
expectTypeOf<SetRequiredDeep<{readonly a?: ReadonlyArray<string | number>}, 'a' | `a.${number}`>>().toBe<{readonly a: ReadonlyArray<string | number>}>();

// Works with nested arrays
expectTypeOf<SetRequiredDeep<{a?: [[string?, number?]?]}, 'a.0.0'>>().toBe<{a?: [[string, number?]?]}>();
expectTypeOf<SetRequiredDeep<{a?: [[string?, number?]?]}, 'a.0' | 'a.0.0' | 'a.0.1'>>().toBe<{a?: [[string, number]]}>();
expectTypeOf<SetRequiredDeep<{a?: Array<[string?, number?]>}, `a.${number}.0`>>().toBe<{a?: Array<[string, number?]>}>();

// Set key inside array to required
expectTypeOf<SetRequiredDeep<{a?: Array<{b?: number}>}, `a.${number}.b`>>().toBe<{a?: Array<{b: number}>}>();
expectTypeOf<SetRequiredDeep<{readonly a?: [{readonly b?: number}]}, 'a.0.b'>>().toBe<{readonly a?: [{readonly b: number}]}>();
expectTypeOf<SetRequiredDeep<{readonly a?: [{readonly b?: number}, {c?: string}?]}, 'a' | 'a.0.b' | 'a.1'>>().toBe<{readonly a: [{readonly b: number}, {c?: string}]}>();

// Set only specified keys inside array to required
expectTypeOf<SetRequiredDeep<{a?: Array<{b?: number; c?: string}>}, `a.${number}.b`>>().toBe<{a?: Array<{b: number; c?: string}>}>();
expectTypeOf<SetRequiredDeep<{a: [{b?: number; readonly c?: string}]}, 'a.0.c'>>().toBe<{a: [{b?: number; readonly c: string}]}>();

// All terminal keys of a tuple are applied together, so union member order cannot leave a later element optional.
declare const allOptionalIndices: SetRequiredDeep<readonly [string?, number?, boolean?], '2' | '1' | '0'>;
expectTypeOf(allOptionalIndices).toBe<readonly [string, number, boolean]>();

// Each object-union member keeps its own paths, and selected siblings are required together at each level.
declare const disjointPaths: SetRequiredDeep<{left?: {first?: string; second?: number}} | {right?: [string?, number?]}, 'left.first' | 'left.second' | 'right.0' | 'right.1'>;
expectTypeOf(disjointPaths).toBe<{left?: {first: string; second: number}} | {right?: [string, number]}>();
