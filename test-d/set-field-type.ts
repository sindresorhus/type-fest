import {expectTypeOf} from 'nz';
import type {SetFieldType} from '../index.d.ts';

declare const variation1: SetFieldType<{a: number}, 'a', string>;
expectTypeOf(variation1).toBe<{a: string}>();

declare const variation2: SetFieldType<{a: number; b: boolean; c: Date}, 'a' | 'b', string>;
expectTypeOf(variation2).toBe<{a: string; b: string; c: Date}>();

declare const variation3: SetFieldType<{a: string; b: boolean; c: Date}, 'b' | 'c', number>;
expectTypeOf(variation3).toBe<{a: string; b: number; c: number}>();

declare const variation4: SetFieldType<{a: string; b: string; c: string}, 'b', number>;
expectTypeOf(variation4).not.toBeAssignableTo<{a: string; b: string; c: string}>();

// Works with union types
declare const variation5: SetFieldType<{a: string; b: string} | {a: number; c: number}, 'a', boolean>;
expectTypeOf(variation5).toBe<{a: boolean; b: string} | {a: boolean; c: number}>();

declare const variation6: SetFieldType<{a: string; b: string} | {a: number; c: number}, 'a', boolean, {preservePropertyModifiers: false}>;
expectTypeOf(variation6).toBe<{a: boolean; b: string} | {a: boolean; c: number}>();

// Property modifiers are always preserved for properties that are not being updated
declare const variation7: SetFieldType<{a?: string; readonly b: string; c: string}, 'c', number>;
expectTypeOf(variation7).toBe<{a?: string; readonly b: string; c: number}>();

declare const variation8: SetFieldType<{a?: string; readonly b: string; c: string}, 'c', number, {preservePropertyModifiers: false}>;
expectTypeOf(variation8).toBe<{a?: string; readonly b: string; c: number}>();

// Preserves property modifiers
declare const variation9: SetFieldType<{a?: string; readonly b: string; readonly c?: string}, 'a' | 'c', number>;
expectTypeOf(variation9).toBe<{a?: number; readonly b: string; readonly c?: number}>();

// Doesn't preserve property modifiers when `preservePropertyModifiers` is `false`
declare const variation10: SetFieldType<{a?: string; readonly b: string; readonly c?: string}, 'a' | 'c', number, {preservePropertyModifiers: false}>;
expectTypeOf(variation10).toBe<{a: number; readonly b: string; c: number}>();

// Falls back to default of `true`, if `preservePropertyModifiers` is set to `boolean`
declare const variation11: SetFieldType<{a?: string; readonly b: string; readonly c?: string}, 'a' | 'c', number, {preservePropertyModifiers: boolean}>;
expectTypeOf(variation11).toBe<{a?: number; readonly b: string; readonly c?: number}>();

// A tuple is keyed by a number, so the numeric index must be rewritten just like the string form is. Otherwise the request is silently ignored.
declare const tupleNumericIndex: SetFieldType<[1, 2], 0, string>;
expectTypeOf(tupleNumericIndex).toBe<[string, 2]>();

declare const tupleNumericIndexThird: SetFieldType<[string, number, boolean], 2, Date>;
expectTypeOf(tupleNumericIndexThird).toBe<[string, number, Date]>();

// A key that only one member of a union has is accepted, and a member without it is left as it is.
declare const keyOfOneMember: SetFieldType<{a: 1} | {b: 2}, 'a', string>;
expectTypeOf(keyOfOneMember).toBe<{a: string} | {b: 2}>();

declare const keyOfTheOtherMember: SetFieldType<{a: 1} | {b: 2}, 'b', string>;
expectTypeOf(keyOfTheOtherMember).toBe<{a: 1} | {b: string}>();

// A union member the key does not reach is left as it is, rather than gaining the key as a required one.
declare const withoutTheKey: SetFieldType<{a: 1} | {b: 2}, 'a', string, {preservePropertyModifiers: false}>;
expectTypeOf(withoutTheKey).toBe<{a: string} | {b: 2}>();

// A tuple stays a tuple: a `Record` over `number` would answer with every member an array has.
declare const tupleWithoutModifiers: SetFieldType<[1, 2], 0, string, {preservePropertyModifiers: false}>;
expectTypeOf(tupleWithoutModifiers).toBe<[string, 2]>();
