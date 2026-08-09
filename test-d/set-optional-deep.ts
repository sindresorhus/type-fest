import {expectType} from 'tsd';
import type {SetOptionalDeep} from '../index.d.ts';

// Set nested key to optional
declare const variation1: SetOptionalDeep<{a: number; b: {c: string}}, 'b.c'>;
expectType<{a: number; b: {c?: string}}>(variation1);

// Set key to optional but not nested keys if not specified
declare const variation2: SetOptionalDeep<{a: number; b: {c: string}}, 'b'>;
expectType<{a: number; b?: {c: string}}>(variation2);

// Set root key to optional
declare const variation3: SetOptionalDeep<{a: number; b: {c: string}}, 'a'>;
expectType<{a?: number; b: {c: string}}>(variation3);

// Keeps optional key as optional
declare const variation4: SetOptionalDeep<{a?: number; b: {c: string}}, 'a'>;
expectType<{a?: number; b: {c: string}}>(variation4);

// Set key to optional in a union.
declare const variation5: SetOptionalDeep<{a: '1'; b: {c: boolean}} | {a: '2'; b: {c: boolean}}, 'a'>;
expectType<{a?: '1'; b: {c: boolean}} | {a?: '2'; b: {c: boolean}}>(variation5);

// Set key with array type to optional
declare const variation6: SetOptionalDeep<{a: Array<{b: number}>}, 'a'>;
expectType<{a?: Array<{b: number}>}>(variation6);

// Can set both root and nested keys to optional
declare const variation7: SetOptionalDeep<{a: number; b: {c: string}}, 'b' | 'b.c'>;
expectType<{a: number; b?: {c?: string}}>(variation7);

// Preserves optional root keys
declare const variation8: SetOptionalDeep<{a?: 1; b: {c: 1}}, 'b.c'>;
expectType<{a?: 1; b: {c?: 1}}>(variation8);

// Preserves union in root keys
declare const variation9: SetOptionalDeep<{a: 1; b: {c: 1} | number}, 'b.c'>;
expectType<{a: 1; b: {c?: 1} | number}>(variation9);

// Preserves readonly
declare const variation10: SetOptionalDeep<{a: 1; readonly b: {c: 1}}, 'b.c'>;
expectType<{a: 1; readonly b: {c?: 1}}>(variation10);

declare const variation11: SetOptionalDeep<{readonly a: 1; readonly b: {readonly c: 1}}, 'a' | 'b'>;
expectType<{readonly a?: 1; readonly b?: {readonly c: 1}}>(variation11);

declare const variation12: SetOptionalDeep<{readonly a: 1; readonly b: {readonly c: 1}}, 'a' | 'b' | 'b.c'>;
expectType<{readonly a?: 1; readonly b?: {readonly c?: 1}}>(variation12);

// Works with number keys
declare const variation13: SetOptionalDeep<{0: 1; 1: {2: string}}, '1.2'>;
expectType<{0: 1; 1: {2?: string}}>(variation13);

declare const variation14: SetOptionalDeep<{0: 1; 1: {2: string}}, 0 | 1>;
expectType<{0?: 1; 1?: {2: string}}>(variation14);

// Multiple keys
declare const variation15: SetOptionalDeep<{a: 1; b: {c: 2}; d: {e: {f: 2}; g: 3}}, 'a' | 'b' | 'b.c' | 'd.e.f' | 'd.g'>;
expectType<{a?: 1; b?: {c?: 2}; d: {e: {f?: 2}; g?: 3}}>(variation15);

// Index signatures
declare const variation16: SetOptionalDeep<{[x: string]: any; a: number; b: {c: number}}, 'a' | 'b.c'>;
expectType<{[x: string]: any; a?: number; b: {c?: number}}>(variation16);

// Does nothing when `KeyPaths` is `never`
declare const variation17: SetOptionalDeep<{a: number; readonly b: {c: string}}, never>;
expectType<{a: number; readonly b: {c: string}}>(variation17);

// =================
// Works with arrays
// =================

// Make trailing elements optional
expectType<{a: [string, number?, boolean?]}>({} as SetOptionalDeep<{a: [string, number, boolean]}, 'a.1' | 'a.2'>);

// Make only the last element optional
expectType<{a: [string, number, boolean?]}>({} as SetOptionalDeep<{a: [string, number, boolean]}, 'a.2'>);

// Making a middle element optional cascades to the following elements, since an optional element cannot precede a required one
expectType<{a: [string, number?, boolean?]}>({} as SetOptionalDeep<{a: [string, number, boolean]}, 'a.1'>);

// Extends an existing trailing optional run towards the front
expectType<{a: [string, number?, boolean?]}>({} as SetOptionalDeep<{a: [string, number, boolean?]}, 'a.1'>);

// Works with readonly arrays
expectType<{readonly a: readonly [string, number?, boolean?]}>(
	{} as SetOptionalDeep<{readonly a: readonly [string, number, boolean]}, 'a.1' | 'a.2'>,
);

// Ignores keys that are already optional
expectType<{a: [string, number?, boolean?]}>({} as SetOptionalDeep<{a: [string, number?, boolean?]}, 'a.2'>);

// Non tuple arrays are left unchanged
expectType<{a: string[]}>({} as SetOptionalDeep<{a: string[]}, `a.${number}`>);

// Fixed elements of a tuple with a rest element can be made optional
expectType<{a: [string, number?, ...boolean[]]}>({} as SetOptionalDeep<{a: [string, number, ...boolean[]]}, 'a.1'>);
expectType<{a: [string?, number?, ...boolean[]]}>({} as SetOptionalDeep<{a: [string, number, ...boolean[]]}, 'a.0'>);
expectType<{a: [string, number?, boolean?, ...string[]]}>({} as SetOptionalDeep<{a: [string, number, boolean?, ...string[]]}, 'a.1'>);
expectType<{readonly a: readonly [string, number?, ...boolean[]]}>(
	{} as SetOptionalDeep<{readonly a: readonly [string, number, ...boolean[]]}, 'a.1'>,
);

// Set key inside array to optional
expectType<{a: Array<{b?: number}>}>({} as SetOptionalDeep<{a: Array<{b: number}>}, `a.${number}.b`>);
expectType<{readonly a: [{readonly b?: number}]}>({} as SetOptionalDeep<{readonly a: [{readonly b: number}]}, 'a.0.b'>);

// Works with nested arrays
expectType<{a: [[string, number?]]}>({} as SetOptionalDeep<{a: [[string, number]]}, 'a.0.1'>);
