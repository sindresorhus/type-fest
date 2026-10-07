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

// A tuple is keyed by a number, so the numeric index must be rewritten just like the string form is. Otherwise the request is silently ignored.
declare const tupleNumericIndex: SetFieldType<[1, 2], 0, string>;
expectType<[string, 2]>(tupleNumericIndex);

declare const tupleNumericIndexThird: SetFieldType<[string, number, boolean], 2, Date>;
expectType<[string, number, Date]>(tupleNumericIndexThird);

// A key that only one member of a union has is accepted, and a member without it is left as it is.
declare const keyOfOneMember: SetFieldType<{a: 1} | {b: 2}, 'a', string>;
expectType<{a: string} | {b: 2}>(keyOfOneMember);

declare const keyOfTheOtherMember: SetFieldType<{a: 1} | {b: 2}, 'b', string>;
expectType<{a: 1} | {b: string}>(keyOfTheOtherMember);

// A union member the key does not reach is left as it is, rather than gaining the key as a required one.
declare const withoutTheKey: SetFieldType<{a: 1} | {b: 2}, 'a', string, {preservePropertyModifiers: false}>;
expectType<{a: string} | {b: 2}>(withoutTheKey);

// A tuple stays a tuple: a `Record` over `number` would answer with every member an array has.
declare const tupleWithoutModifiers: SetFieldType<[1, 2], 0, string, {preservePropertyModifiers: false}>;
expectType<[string, 2]>(tupleWithoutModifiers);
