import {expectType} from 'tsd';
import type {SetRequiredDeep} from '../index';

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

// Set array key to required
declare const variation6: SetRequiredDeep<{a?: Array<{b?: number}>}, 'a'>;
expectType<{a: Array<{b?: number}>}>(variation6);

// Set key inside array to required
declare const variation7: SetRequiredDeep<{a?: Array<{b?: number}>}, `a.${number}.b`>;
expectType<{a?: Array<{b: number}>}>(variation7);

// Set only specified keys inside array to required
declare const variation8: SetRequiredDeep<{a?: Array<{b?: number; c?: string}>}, `a.${number}.b`>;
expectType<{a?: Array<{b: number; c?: string}>}>(variation8);

// Can set both root and nested keys to required
declare const variation9: SetRequiredDeep<{a?: number; b?: {c?: string}}, 'b' | 'b.c'>;
expectType<{a?: number; b: {c: string}}>(variation9);

// Preserves required root keys
declare const variation10: SetRequiredDeep<{a: 1; b: {c?: 1}}, 'b.c'>;
expectType<{a: 1; b: {c: 1}}>(variation10);

// Preserves union in root keys
declare const variation11: SetRequiredDeep<{a: 1; b: {c?: 1} | number}, 'b.c'>;
expectType<{a: 1; b: {c: 1} | number}>(variation11);

// Preserves readonly
declare const variation12: SetRequiredDeep<{a: 1; readonly b: {c?: 1}}, 'b.c'>;
expectType<{a: 1; readonly b: {c: 1}}>(variation12);

declare const variation13: SetRequiredDeep<{readonly a?: 1; readonly b?: {readonly c?: 1}}, 'a' | 'b'>;
expectType<{readonly a: 1; readonly b: {readonly c?: 1}}>(variation13);

declare const variation14: SetRequiredDeep<{readonly a?: 1; readonly b?: {readonly c?: 1}}, 'a' | 'b' | 'b.c'>;
expectType<{readonly a: 1; readonly b: {readonly c: 1}}>(variation14);

// Works with number keys
declare const variation15: SetRequiredDeep<{0: 1; 1: {2?: string}}, '1.2'>;
expectType<{0: 1; 1: {2: string}}>(variation15);

declare const variation16: SetRequiredDeep<{0?: 1; 1?: {2?: string}}, 0 | 1>;
expectType<{0: 1; 1: {2?: string}}>(variation16);

// Multiple keys
declare const variation17: SetRequiredDeep<{a?: 1; b?: {c?: 2}; d?: {e?: {f?: 2}; g?: 3}}, 'a' | 'b' | 'b.c' | 'd.e.f' | 'd.g'>;
expectType<{a: 1; b: {c: 2}; d?: {e?: {f: 2}; g: 3}}>(variation17);

// Index signatures
declare const variation18: SetRequiredDeep<{[x: string]: any; a?: number; b?: {c?: number}}, 'a' | 'b.c'>;
expectType<{[x: string]: any; a: number; b?: {c: number}}>(variation18);

// Preserves union in nested keys
declare const variation19: SetRequiredDeep<{a: 1; b?: {c?: 1} | number}, 'b'>;
expectType<{a: 1; b: {c?: 1} | number}>(variation19);

declare const variation20: SetRequiredDeep<{a?: number; b?: {c?: number} | {d?: string}}, 'b' | 'b.d'>;
expectType<{a?: number; b: {c?: number} | {d: string}}>(variation20);

// Works with number keys containing dots
// NOTE: Passing "1.2" instead of 1.2 will treat it as a path instead of a key
declare const variation21: SetRequiredDeep<{1.2?: string; 1?: {2?: string}}, 1.2>;
expectType<{1.2: string; 1?: {2?: string}}>(variation21);

declare const variation22: SetRequiredDeep<{1.2?: string; 1?: {2?: string}}, '1.2'>;
expectType<{1.2?: string; 1?: {2: string}}>(variation22);

declare const variation23: SetRequiredDeep<{1.2?: string; 1?: {2?: string}}, 1.2 | '1.2'>;
expectType<{1.2: string; 1?: {2: string}}>(variation23);

// Works with unions
declare const variation24: SetRequiredDeep<{a?: {readonly b?: number}} | {readonly b?: {c?: number[]}}, 'a.b' | 'b' | 'b.c'>;
expectType<{a?: {readonly b: number}} | {readonly b: {c: number[]}}>(variation24);

// Works with `KeyPaths` containing template literals
declare const variation25: SetRequiredDeep<{a?: number; b?: {c?: number} | {d?: number}}, `b.${'c' | 'd'}`>;
expectType<{a?: number; b?: {c: number} | {d: number}}>(variation25);

declare const variation26: SetRequiredDeep<
{a?: number; b?: {readonly c?: {1?: number}} | {d?: {1?: number}}}, 'a' | `b.${'c' | 'd'}.1`
>;
expectType<{a: number; b?: {readonly c?: {1: number}} | {d?: {1: number}}}>(variation26);

// Calls `RequiredDeep` when `KeyPaths` is `any`
declare const variation27: SetRequiredDeep<{a?: number; readonly b?: {c?: string}}, any>;
expectType<{a: number; readonly b: {c: string}}>(variation27);

// Does nothing when `KeyPaths` is `never`
declare const variation28: SetRequiredDeep<{a?: number; readonly b?: {c?: string}}, never>;
expectType<{a?: number; readonly b?: {c?: string}}>(variation28);
