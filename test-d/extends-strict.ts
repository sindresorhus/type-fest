import {expectTypeOf} from 'nz';
import type {Tagged} from '../source/tagged.d.ts';
import type {ExtendsStrict} from '../source/extends-strict.d.ts';

// Basic
expectTypeOf<ExtendsStrict<string, string>>().toBe<true>();
expectTypeOf<ExtendsStrict<number, number>>().toBe<true>();
expectTypeOf<ExtendsStrict<1, number>>().toBe<true>();
expectTypeOf<ExtendsStrict<number, 1>>().toBe<false>();
expectTypeOf<ExtendsStrict<'foo', 'foo' | 'bar'>>().toBe<true>();
expectTypeOf<ExtendsStrict<'foo' | 'bar', 'foo'>>().toBe<false>();

// Union behavior
expectTypeOf<ExtendsStrict<string | number, string>>().toBe<false>();
expectTypeOf<ExtendsStrict<string, string | number>>().toBe<true>();
expectTypeOf<ExtendsStrict<string | string[], string>>().toBe<false>();
expectTypeOf<ExtendsStrict<string, string | string[]>>().toBe<true>();

// Never handling
expectTypeOf<ExtendsStrict<never, never>>().toBe<true>();
expectTypeOf<ExtendsStrict<never, string>>().toBe<false>();
expectTypeOf<ExtendsStrict<string, never>>().toBe<false>();

// Any and unknown
expectTypeOf<ExtendsStrict<any, any>>().toBe<true>();
expectTypeOf<ExtendsStrict<any, never>>().toBe<false>();
expectTypeOf<ExtendsStrict<never, any>>().toBe<true>();
expectTypeOf<ExtendsStrict<any, number>>().toBe<true>();
expectTypeOf<ExtendsStrict<any, unknown>>().toBe<true>(); // `any` is assignable to `unknown`
expectTypeOf<ExtendsStrict<unknown, any>>().toBe<true>(); // `unknown` is assignable to `any`
expectTypeOf<ExtendsStrict<unknown, unknown>>().toBe<true>();
expectTypeOf<ExtendsStrict<string, unknown>>().toBe<true>();
expectTypeOf<ExtendsStrict<unknown, string>>().toBe<false>();

// Tuples
expectTypeOf<ExtendsStrict<[1, 2], number[]>>().toBe<true>();
expectTypeOf<ExtendsStrict<number[], [1, 2]>>().toBe<false>();
expectTypeOf<ExtendsStrict<[], []>>().toBe<true>();

// Objects
expectTypeOf<ExtendsStrict<{a: 1}, {a: number}>>().toBe<true>();
expectTypeOf<ExtendsStrict<{a: number}, {a: 1}>>().toBe<false>();
expectTypeOf<ExtendsStrict<{a: number}, {a: number; b: string}>>().toBe<false>();
expectTypeOf<ExtendsStrict<{a: number; b: string}, {a: number}>>().toBe<true>();

// Functions
expectTypeOf<ExtendsStrict<() => void, Function>>().toBe<true>();
expectTypeOf<ExtendsStrict<Function, () => void>>().toBe<false>();
expectTypeOf<ExtendsStrict<() => void, () => void>>().toBe<true>();
expectTypeOf<ExtendsStrict<(...args: any[]) => unknown, Function>>().toBe<true>();

// Intersections
expectTypeOf<ExtendsStrict<string & {bar: string}, string>>().toBe<true>();
expectTypeOf<ExtendsStrict<string, string & {bar: string}>>().toBe<false>();

// Literal vs primitive
expectTypeOf<ExtendsStrict<'foo', string>>().toBe<true>();
expectTypeOf<ExtendsStrict<string, 'foo'>>().toBe<false>();

// Arrays
expectTypeOf<ExtendsStrict<string[], string[]>>().toBe<true>();
expectTypeOf<ExtendsStrict<[string], string[]>>().toBe<true>(); // Tuple is assignable to array
expectTypeOf<ExtendsStrict<string[], [string]>>().toBe<false>(); // Array not assignable to fixed tuple

// Branded types
type UserId = Tagged<string, 'UserId'>;

expectTypeOf<ExtendsStrict<UserId, string>>().toBe<true>();
expectTypeOf<ExtendsStrict<string, UserId>>().toBe<false>();
expectTypeOf<ExtendsStrict<UserId, UserId>>().toBe<true>();

// Edge meta-types
expectTypeOf<ExtendsStrict<null, any>>().toBe<true>();
expectTypeOf<ExtendsStrict<undefined, any>>().toBe<true>();
expectTypeOf<ExtendsStrict<null, undefined>>().toBe<false>();
expectTypeOf<ExtendsStrict<undefined, null>>().toBe<false>();
expectTypeOf<ExtendsStrict<undefined, unknown>>().toBe<true>();
expectTypeOf<ExtendsStrict<null, unknown>>().toBe<true>();

// --- Options ---

// `distributiveUnions`
expectTypeOf<boolean>().toBe<ExtendsStrict<string | number, string, {distributiveUnions: true}>>();
expectTypeOf<ExtendsStrict<string | number, string, {distributiveUnions: false}>>().toBe<false>();
expectTypeOf<ExtendsStrict<number | bigint, string, {distributiveUnions: true}>>().toBe<false>();
expectTypeOf<ExtendsStrict<1 | 2 | 3, number, {distributiveUnions: true}>>().toBe<true>();

// `strictNever`
expectTypeOf<ExtendsStrict<never, string, {strictNever: true}>>().toBe<false>();
expectTypeOf<ExtendsStrict<never, never, {strictNever: true}>>().toBe<true>();
expectTypeOf<ExtendsStrict<never, any, {strictNever: true}>>().toBe<true>();
expectTypeOf<ExtendsStrict<never, unknown, {strictNever: true}>>().toBe<true>();

expectTypeOf<ExtendsStrict<never, string, {strictNever: false}>>().toBe<true>();
expectTypeOf<ExtendsStrict<never, never, {strictNever: false}>>().toBe<true>();
expectTypeOf<ExtendsStrict<never, any, {strictNever: false}>>().toBe<true>();
expectTypeOf<ExtendsStrict<never, unknown, {strictNever: false}>>().toBe<true>();

// `strictAny`
expectTypeOf<ExtendsStrict<any, string, {strictAny: true}>>().toBe<false>();
expectTypeOf<ExtendsStrict<any, never, {strictAny: true}>>().toBe<false>();
expectTypeOf<ExtendsStrict<any, any, {strictAny: true}>>().toBe<true>();
expectTypeOf<ExtendsStrict<any, unknown, {strictAny: true}>>().toBe<true>();

expectTypeOf<ExtendsStrict<any, string, {strictAny: false}>>().toBe<true>();
expectTypeOf<ExtendsStrict<any, never, {strictAny: false}>>().toBe<false>();
expectTypeOf<ExtendsStrict<any, any, {strictAny: false}>>().toBe<true>();
expectTypeOf<ExtendsStrict<any, unknown, {strictAny: false}>>().toBe<true>();

// When `strictAny` is `false`, behavior depends on `distributiveUnions`
expectTypeOf<boolean>().toBe<ExtendsStrict<any, string, {strictAny: false; distributiveUnions: true}>>();
expectTypeOf<boolean>().toBe<ExtendsStrict<any, never, {strictAny: false; distributiveUnions: true}>>();
expectTypeOf<ExtendsStrict<any, any, {strictAny: false; distributiveUnions: true}>>().toBe<true>();
expectTypeOf<ExtendsStrict<any, unknown, {strictAny: false; distributiveUnions: true}>>().toBe<true>();

expectTypeOf<ExtendsStrict<any, string, {strictAny: false; distributiveUnions: false}>>().toBe<true>();
expectTypeOf<ExtendsStrict<any, never, {strictAny: false; distributiveUnions: false}>>().toBe<false>();
expectTypeOf<ExtendsStrict<any, any, {strictAny: false; distributiveUnions: false}>>().toBe<true>();
expectTypeOf<ExtendsStrict<any, unknown, {strictAny: false; distributiveUnions: false}>>().toBe<true>();

// When `strictNever` is `false`, the result will be `true` and not `never` even if `distributiveUnions` is `true`
expectTypeOf<ExtendsStrict<never, string, {strictNever: false; distributiveUnions: true}>>().toBe<true>();
