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
