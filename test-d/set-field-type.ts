import {expectNotAssignable, expectType} from 'tsd';
import type {SetFieldType} from '../index.d.ts';

declare const variation1: SetFieldType<{a: number}, 'a', string>;
expectType<{a: string}>(variation1);

declare const variation2: SetFieldType<{a: number; b: boolean; c: Date}, 'a' | 'b', string>;
expectType<{a: string; b: string; c: Date}>(variation2);

declare const variation3: SetFieldType<{a: string; b: boolean; c: Date}, 'b' | 'c', number>;
expectType<{a: string; b: number; c: number}>(variation3);

declare const variation4: SetFieldType<{a: string; b: string; c: string}, 'b', number>;
expectNotAssignable<{a: string; b: string; c: string}>(variation4);

// Works with union types
declare const variation5: SetFieldType<{a: string; b: string} | {a: number; c: number}, 'a', boolean>;
expectType<{a: boolean; b: string} | {a: boolean; c: number}>(variation5);

declare const variation6: SetFieldType<{a: string; b: string} | {a: number; c: number}, 'a', boolean, {preservePropertyModifiers: false}>;
expectType<{a: boolean; b: string} | {a: boolean; c: number}>(variation6);

// Property modifiers are always preserved for properties that are not being updated
declare const variation7: SetFieldType<{a?: string; readonly b: string; c: string}, 'c', number>;
expectType<{a?: string; readonly b: string; c: number}>(variation7);

declare const variation8: SetFieldType<{a?: string; readonly b: string; c: string}, 'c', number, {preservePropertyModifiers: false}>;
expectType<{a?: string; readonly b: string; c: number}>(variation8);

// Preserves property modifiers
declare const variation9: SetFieldType<{a?: string; readonly b: string; readonly c?: string}, 'a' | 'c', number>;
expectType<{a?: number; readonly b: string; readonly c?: number}>(variation9);

// Doesn't preserve property modifiers when `preservePropertyModifiers` is `false`
declare const variation10: SetFieldType<{a?: string; readonly b: string; readonly c?: string}, 'a' | 'c', number, {preservePropertyModifiers: false}>;
expectType<{a: number; readonly b: string; c: number}>(variation10);

// Falls back to default of `true`, if `preservePropertyModifiers` is set to `boolean`
declare const variation11: SetFieldType<{a?: string; readonly b: string; readonly c?: string}, 'a' | 'c', number, {preservePropertyModifiers: boolean}>;
expectType<{a?: number; readonly b: string; readonly c?: number}>(variation11);
