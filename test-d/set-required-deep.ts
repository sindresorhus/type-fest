import {expectType} from 'tsd';
import type {SetRequiredDeep} from '../index.d.ts';

// Set nested key to required
declare const variation1: SetRequiredDeep<{a?: number; b?: {c?: string}}, 'b.c'>;
expectType<{a?: number; b?: {c: string}}>(variation1);

// Set key to required but not nested keys if not specified
declare const variation2: SetRequiredDeep<{a?: number; b?: {c?: string}}, 'b'>;
expectType<{a?: number; b: {c?: string}}>(variation2);

// Set root key to required
declare const variation3: SetRequiredDeep<{a?: number; b?: {c?: string}}, 'a'>;
expectType<{a: number; b?: {c?: string}}>(variation3);

// Keeps required key as required
declare const variation4: SetRequiredDeep<{a: number; b?: {c?: string}}, 'a'>;
expectType<{a: number; b?: {c?: string}}>(variation4);

// Set key to required in a union.
declare const variation5: SetRequiredDeep<{a?: '1'; b?: {c?: boolean}} | {a?: '2'; b?: {c?: boolean}}, 'a'>;
expectType<{a: '1'; b?: {c?: boolean}} | {a: '2'; b?: {c?: boolean}}>(variation5);

// Set key with array type to required
declare const variation6: SetRequiredDeep<{a?: Array<{b?: number}>}, 'a'>;
expectType<{a: Array<{b?: number}>}>(variation6);

// Can set both root and nested keys to required
declare const variation7: SetRequiredDeep<{a?: number; b?: {c?: string}}, 'b' | 'b.c'>;
expectType<{a?: number; b: {c: string}}>(variation7);

// Preserves required root keys
declare const variation8: SetRequiredDeep<{a: 1; b: {c?: 1}}, 'b.c'>;
expectType<{a: 1; b: {c: 1}}>(variation8);

// Preserves union in root keys
declare const variation9: SetRequiredDeep<{a: 1; b: {c?: 1} | number}, 'b.c'>;
expectType<{a: 1; b: {c: 1} | number}>(variation9);

// Preserves readonly
declare const variation10: SetRequiredDeep<{a: 1; readonly b: {c?: 1}}, 'b.c'>;
expectType<{a: 1; readonly b: {c: 1}}>(variation10);

declare const variation11: SetRequiredDeep<{readonly a?: 1; readonly b?: {readonly c?: 1}}, 'a' | 'b'>;
expectType<{readonly a: 1; readonly b: {readonly c?: 1}}>(variation11);

declare const variation12: SetRequiredDeep<{readonly a?: 1; readonly b?: {readonly c?: 1}}, 'a' | 'b' | 'b.c'>;
expectType<{readonly a: 1; readonly b: {readonly c: 1}}>(variation12);

// Works with number keys
declare const variation13: SetRequiredDeep<{0: 1; 1: {2?: string}}, '1.2'>;
expectType<{0: 1; 1: {2: string}}>(variation13);

declare const variation14: SetRequiredDeep<{0?: 1; 1?: {2?: string}}, 0 | 1>;
expectType<{0: 1; 1: {2?: string}}>(variation14);

// Multiple keys
declare const variation15: SetRequiredDeep<{a?: 1; b?: {c?: 2}; d?: {e?: {f?: 2}; g?: 3}}, 'a' | 'b' | 'b.c' | 'd.e.f' | 'd.g'>;
expectType<{a: 1; b: {c: 2}; d?: {e?: {f: 2}; g: 3}}>(variation15);

// Index signatures
declare const variation16: SetRequiredDeep<{[x: string]: any; a?: number; b?: {c?: number}}, 'a' | 'b.c'>;
expectType<{[x: string]: any; a: number; b?: {c: number}}>(variation16);

// Preserves union in nested keys
declare const variation17: SetRequiredDeep<{a: 1; b?: {c?: 1} | number}, 'b'>;
expectType<{a: 1; b: {c?: 1} | number}>(variation17);

declare const variation18: SetRequiredDeep<{a?: number; b?: {c?: number} | {d?: string}}, 'b' | 'b.d'>;
expectType<{a?: number; b: {c?: number} | {d: string}}>(variation18);

// Works with number keys containing dots
// NOTE: Passing "1.2" instead of 1.2 will treat it as a path instead of a key
declare const variation19: SetRequiredDeep<{1.2?: string; 1?: {2?: string}}, 1.2>;
expectType<{1.2: string; 1?: {2?: string}}>(variation19);

declare const variation20: SetRequiredDeep<{1.2?: string; 1?: {2?: string}}, '1.2'>;
expectType<{1.2?: string; 1?: {2: string}}>(variation20);

declare const variation21: SetRequiredDeep<{1.2?: string; 1?: {2?: string}}, 1.2 | '1.2'>;
expectType<{1.2: string; 1?: {2: string}}>(variation21);

// Works with unions
declare const variation22: SetRequiredDeep<{a?: {readonly b?: number}} | {readonly b?: {c?: number[]}}, 'a.b' | 'b' | 'b.c'>;
expectType<{a?: {readonly b: number}} | {readonly b: {c: number[]}}>(variation22);

// Works with `KeyPaths` containing template literals
declare const variation23: SetRequiredDeep<{a?: number; b?: {c?: number} | {d?: number}}, `b.${'c' | 'd'}`>;
expectType<{a?: number; b?: {c: number} | {d: number}}>(variation23);

declare const variation24: SetRequiredDeep<
{a?: number; b?: {readonly c?: {1?: number}} | {d?: {1?: number}}}, 'a' | `b.${'c' | 'd'}.1`
>;
expectType<{a: number; b?: {readonly c?: {1: number}} | {d?: {1: number}}}>(variation24);

// Calls `RequiredDeep` when `KeyPaths` is `any`
declare const variation25: SetRequiredDeep<{a?: number; readonly b?: {c?: string}}, any>;
expectType<{a: number; readonly b: {c: string}}>(variation25);

// Does nothing when `KeyPaths` is `never`
declare const variation26: SetRequiredDeep<{a?: number; readonly b?: {c?: string}}, never>;
expectType<{a?: number; readonly b?: {c?: string}}>(variation26);

// =================
// Works with arrays
// =================

// All optional elements
expectType<{a?: [string, number, boolean?]}>({} as SetRequiredDeep<{a?: [string?, number?, boolean?]}, 'a.0' | 'a.1'>);

// Mix of optional and required elements
expectType<{a: readonly [string, number, boolean]}>({} as SetRequiredDeep<{a: readonly [string, number?, boolean?]}, 'a.1' | 'a.2'>);

// Mix of optional and rest elements
expectType<{readonly a: [string, number, boolean?, ...number[]]}>({} as SetRequiredDeep<{readonly a: [string?, number?, boolean?, ...number[]]}, 'a.0' | 'a.1'>);

// Mix of optional, required, and rest elements
expectType<{readonly a?: [string, number, boolean, ...string[]]}>({} as SetRequiredDeep<{readonly a?: [string, number?, boolean?, ...string[]]}, 'a.1' | 'a.2'>);

// Works with readonly arrays
expectType<{a?: {b?: readonly [(string | number)]}}>({} as SetRequiredDeep<{a?: {b?: readonly [(string | number)?]}}, 'a.b.0'>);
expectType<{a: readonly [string, number, boolean, ...string[]]}>(
	{} as SetRequiredDeep<{a?: readonly [string, number?, boolean?, ...string[]]}, 'a' | 'a.1' | 'a.2'>,
);

// Ignores `Keys` that are already required
expectType<{a: [string, number?, boolean?]}>({} as SetRequiredDeep<{a: [string, number?, boolean?]}, 'a.0'>);

// Ignores `Keys` that are not known
// This case is only possible when the array contains a rest element,
// because otherwise the constaint on `KeyPaths` would disallow out of bound keys.
expectType<{a?: readonly [string?, number?, boolean?, ...number[]]}>(
	{} as SetRequiredDeep<{a?: readonly [string?, number?, boolean?, ...number[]]}, 'a.10'>,
);

// Marks all keys as required, if `Keys` is `number`.
// This case is only possible when the array contains a rest element,
// because otherwise the constaint on `KeyPaths` would be stricter.
expectType<{a?: readonly [string, number, boolean, ...number[]]}>(
	{} as SetRequiredDeep<{a?: readonly [string?, number?, boolean?, ...number[]]}, `a.${number}`>,
);

// Preserves `| undefined`, similar to how built-in `Required` works.
expectType<{a: [string | undefined, number | undefined, boolean]}>({} as SetRequiredDeep<{a: [string | undefined, (number | undefined)?, boolean?]}, 'a.0' | 'a.1' | 'a.2'>);
expectType<{a: readonly [string | undefined, (number | undefined)?, boolean?]}>(
	{} as SetRequiredDeep<{a: readonly [(string | undefined)?, (number | undefined)?, boolean?]}, 'a.0'>,
);

// Optional elements cannot appear after required ones, `Keys` leading to such situations are ignored.
expectType<{a: [string?, number?, boolean?]}>({} as SetRequiredDeep<{a: [string?, number?, boolean?]}, 'a.1' | 'a.2'>); // `a.1` and `a.2` can't be required when `a.0` is optional
expectType<{a: [string, number, boolean?, string?, string?]}>(
	{} as SetRequiredDeep<{a: [string?, number?, boolean?, string?, string?]}, 'a.0' | 'a.1' | 'a.3'>, // `a.3` can't be required when `a.2` is optional
);
expectType<{a: readonly [string | undefined, number?, boolean?, ...string[]]}>(
	{} as SetRequiredDeep<{a?: readonly [string | undefined, number?, boolean?, ...string[]]}, 'a' | 'a.2'>, // `a.2` can't be required when `a.1` is optional
);

// Works with unions of arrays
expectType<{a: [string] | [string, number, boolean?, ...number[]] | readonly [string, number, boolean?]}>(
	{} as SetRequiredDeep<{a: [string?] | [string, number?, boolean?, ...number[]] | readonly [string, number?, boolean?]}, 'a.0' | 'a.1'>,
);

// Works with labelled tuples
expectType<{a?: [b: string, c: number]}>({} as SetRequiredDeep<{a?: [b?: string, c?: number]}, 'a.0' | 'a.1'>);

// Non tuple arrays are left unchanged
expectType<{a: string[]}>({} as SetRequiredDeep<{a: string[]}, `a.${number}`>);
expectType<{readonly a: ReadonlyArray<string | number>}>({} as SetRequiredDeep<{readonly a?: ReadonlyArray<string | number>}, 'a' | `a.${number}`>);

// Works with nested arrays
expectType<{a?: [[string, number?]?]}>({} as SetRequiredDeep<{a?: [[string?, number?]?]}, 'a.0.0'>);
expectType<{a?: [[string, number]]}>({} as SetRequiredDeep<{a?: [[string?, number?]?]}, 'a.0' | 'a.0.0' | 'a.0.1'>);
expectType<{a?: Array<[string, number?]>}>({} as SetRequiredDeep<{a?: Array<[string?, number?]>}, `a.${number}.0`>);

// Set key inside array to required
expectType<{a?: Array<{b: number}>}>({} as SetRequiredDeep<{a?: Array<{b?: number}>}, `a.${number}.b`>);
expectType<{readonly a?: [{readonly b: number}]}>({} as SetRequiredDeep<{readonly a?: [{readonly b?: number}]}, 'a.0.b'>);
expectType<{readonly a: [{readonly b: number}, {c?: string}]}>(
	{} as SetRequiredDeep<{readonly a?: [{readonly b?: number}, {c?: string}?]}, 'a' | 'a.0.b' | 'a.1' >,
);

// Set only specified keys inside array to required
expectType<{a?: Array<{b: number; c?: string}>}>({} as SetRequiredDeep<{a?: Array<{b?: number; c?: string}>}, `a.${number}.b`>);
expectType<{a: [{b?: number; readonly c: string}]}>({} as SetRequiredDeep<{a: [{b?: number; readonly c?: string}]}, 'a.0.c'>);
