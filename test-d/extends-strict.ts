import {expectType} from 'tsd';
import type {Tagged} from '../source/tagged.d.ts';
import type {ExtendsStrict} from '../source/extends-strict.d.ts';

// Basic
expectType<ExtendsStrict<string, string>>(true);
expectType<ExtendsStrict<number, number>>(true);
expectType<ExtendsStrict<1, number>>(true);
expectType<ExtendsStrict<number, 1>>(false);
expectType<ExtendsStrict<'foo', 'foo' | 'bar'>>(true);
expectType<ExtendsStrict<'foo' | 'bar', 'foo'>>(false);

// Union behavior
expectType<ExtendsStrict<string | number, string>>(false);
expectType<ExtendsStrict<string, string | number>>(true);
expectType<ExtendsStrict<string | string[], string>>(false);
expectType<ExtendsStrict<string, string | string[]>>(true);

// Never handling
expectType<ExtendsStrict<never, never>>(true);
expectType<ExtendsStrict<never, string>>(false);
expectType<ExtendsStrict<string, never>>(false);

// Any and unknown
expectType<ExtendsStrict<any, any>>(true);
expectType<ExtendsStrict<any, never>>(false);
expectType<ExtendsStrict<never, any>>(true);
expectType<ExtendsStrict<any, number>>(true);
expectType<ExtendsStrict<any, unknown>>(true); // `any` is assignable to `unknown`
expectType<ExtendsStrict<unknown, any>>(true); // `unknown` is assignable to `any`
expectType<ExtendsStrict<unknown, unknown>>(true);
expectType<ExtendsStrict<string, unknown>>(true);
expectType<ExtendsStrict<unknown, string>>(false);

// Tuples
expectType<ExtendsStrict<[1, 2], number[]>>(true);
expectType<ExtendsStrict<number[], [1, 2]>>(false);
expectType<ExtendsStrict<[], []>>(true);

// Objects
expectType<ExtendsStrict<{a: 1}, {a: number}>>(true);
expectType<ExtendsStrict<{a: number}, {a: 1}>>(false);
expectType<ExtendsStrict<{a: number}, {a: number; b: string}>>(false);
expectType<ExtendsStrict<{a: number; b: string}, {a: number}>>(true);

// Functions
expectType<ExtendsStrict<() => void, Function>>(true);
expectType<ExtendsStrict<Function, () => void>>(false);
expectType<ExtendsStrict<() => void, () => void>>(true);
expectType<ExtendsStrict<(...args: any[]) => unknown, Function>>(true);

// Intersections
expectType<ExtendsStrict<string & {bar: string}, string>>(true);
expectType<ExtendsStrict<string, string & {bar: string}>>(false);

// Literal vs primitive
expectType<ExtendsStrict<'foo', string>>(true);
expectType<ExtendsStrict<string, 'foo'>>(false);

// Arrays
expectType<ExtendsStrict<string[], string[]>>(true);
expectType<ExtendsStrict<[string], string[]>>(true); // Tuple is assignable to array
expectType<ExtendsStrict<string[], [string]>>(false); // Array not assignable to fixed tuple

// Branded types
type UserId = Tagged<string, 'UserId'>;

expectType<ExtendsStrict<UserId, string>>(true);
expectType<ExtendsStrict<string, UserId>>(false);
expectType<ExtendsStrict<UserId, UserId>>(true);

// Edge meta-types
expectType<ExtendsStrict<null, any>>(true);
expectType<ExtendsStrict<undefined, any>>(true);
expectType<ExtendsStrict<null, undefined>>(false);
expectType<ExtendsStrict<undefined, null>>(false);
expectType<ExtendsStrict<undefined, unknown>>(true);
expectType<ExtendsStrict<null, unknown>>(true);

// --- Options ---

// `distributiveUnions`
expectType<ExtendsStrict<string | number, string, {distributiveUnions: true}>>({} as boolean);
expectType<ExtendsStrict<string | number, string, {distributiveUnions: false}>>(false);
expectType<ExtendsStrict<number | bigint, string, {distributiveUnions: true}>>(false);
expectType<ExtendsStrict<1 | 2 | 3, number, {distributiveUnions: true}>>(true);

// `strictNever`
expectType<ExtendsStrict<never, string, {strictNever: true}>>(false);
expectType<ExtendsStrict<never, never, {strictNever: true}>>(true);
expectType<ExtendsStrict<never, any, {strictNever: true}>>(true);
expectType<ExtendsStrict<never, unknown, {strictNever: true}>>(true);

expectType<ExtendsStrict<never, string, {strictNever: false}>>(true);
expectType<ExtendsStrict<never, never, {strictNever: false}>>(true);
expectType<ExtendsStrict<never, any, {strictNever: false}>>(true);
expectType<ExtendsStrict<never, unknown, {strictNever: false}>>(true);

// `strictAny`
expectType<ExtendsStrict<any, string, {strictAny: true}>>(false);
expectType<ExtendsStrict<any, never, {strictAny: true}>>(false);
expectType<ExtendsStrict<any, any, {strictAny: true}>>(true);
expectType<ExtendsStrict<any, unknown, {strictAny: true}>>(true);

expectType<ExtendsStrict<any, string, {strictAny: false}>>(true);
expectType<ExtendsStrict<any, never, {strictAny: false}>>(false);
expectType<ExtendsStrict<any, any, {strictAny: false}>>(true);
expectType<ExtendsStrict<any, unknown, {strictAny: false}>>(true);

// When `strictAny` is `false`, behavior depends on `distributiveUnions`
expectType<ExtendsStrict<any, string, {strictAny: false; distributiveUnions: true}>>({} as boolean);
expectType<ExtendsStrict<any, never, {strictAny: false; distributiveUnions: true}>>({} as boolean);
expectType<ExtendsStrict<any, any, {strictAny: false; distributiveUnions: true}>>(true);
expectType<ExtendsStrict<any, unknown, {strictAny: false; distributiveUnions: true}>>(true);

expectType<ExtendsStrict<any, string, {strictAny: false; distributiveUnions: false}>>(true);
expectType<ExtendsStrict<any, never, {strictAny: false; distributiveUnions: false}>>(false);
expectType<ExtendsStrict<any, any, {strictAny: false; distributiveUnions: false}>>(true);
expectType<ExtendsStrict<any, unknown, {strictAny: false; distributiveUnions: false}>>(true);

// When `strictNever` is `false`, the result will be `true` and not `never` even if `distributiveUnions` is `true`
expectType<ExtendsStrict<never, string, {strictNever: false; distributiveUnions: true}>>(true);
