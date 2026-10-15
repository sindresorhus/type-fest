import {expectTypeOf} from 'nz';
import type {SetOptionalExcept} from '../index.d.ts';

// Makes every key optional except the given keys.
expectTypeOf<SetOptionalExcept<{a: number; b: string; c: boolean}, 'a'>>().toBe<{a: number; b?: string; c?: boolean}>();
expectTypeOf<SetOptionalExcept<{a: number; b: string; c: boolean}, 'a' | 'b'>>().toBe<{a: number; b: string; c?: boolean}>();

// The given keys are kept as is, so an optional given key stays optional.
expectTypeOf<SetOptionalExcept<{a?: number; b: string}, 'a'>>().toBe<{a?: number; b?: string}>();

// Preserves readonly modifier.
expectTypeOf<SetOptionalExcept<{readonly a: number; readonly b: string}, 'a'>>().toBe<{readonly a: number; readonly b?: string}>();

// Makes every key optional, if `Keys` is `never`.
expectTypeOf<SetOptionalExcept<{a: number; b: string}, never>>().toBe<{a?: number; b?: string}>();

// Does nothing, if `Keys` is every key or `any`.
expectTypeOf<SetOptionalExcept<{a: number; b: string}, 'a' | 'b'>>().toBe<{a: number; b: string}>();
expectTypeOf<SetOptionalExcept<{a: number; b: string}, any>>().toBe<{a: number; b: string}>();

// Works with unions, and a key of only one member is accepted.
expectTypeOf<SetOptionalExcept<{kind: 'a'; a: number} | {kind: 'b'; b: string}, 'kind'>>().toBe<{kind: 'a'; a?: number} | {kind: 'b'; b?: string}>();
expectTypeOf<SetOptionalExcept<{kind: 'a'; a: number} | {kind: 'b'; b: string}, 'a'>>().toBe<{kind?: 'a'; a: number} | {kind?: 'b'; b?: string}>();

// Works with functions containing properties.
declare const function_: SetOptionalExcept<{(a: string): number; p1: string; p2: number}, 'p1'>;
expectTypeOf(function_('foo')).toBe<number>();
expectTypeOf<Omit<typeof function_, never>>().toBe<{p1: string; p2?: number}>();

// The given keys of a type with an index signature are made optional too.
expectTypeOf<SetOptionalExcept<{[key: string]: number; a: number}, 'a'>>().toBe<{[key: string]: number | undefined; a?: number}>();

// A given key that the index signature does not cover is kept as is.
expectTypeOf<SetOptionalExcept<{[key: `x-${string}`]: number; a: number}, 'a'>>().toBe<{[key: `x-${string}`]: number | undefined; a: number}>();
expectTypeOf<SetOptionalExcept<{[key: symbol]: number; a: number}, 'a'>>().toBe<{[key: symbol]: number | undefined; a: number}>();

// Works with number keys.
expectTypeOf<SetOptionalExcept<{0: string; 1: number}, 0>>().toBe<{0: string; 1?: number}>();

// A tuple stays a tuple.
expectTypeOf<SetOptionalExcept<[string, number, boolean], 0>>().toBe<[string, number?, boolean?]>();
expectTypeOf<SetOptionalExcept<[string, number, boolean], '0'>>().toBe<[string, number?, boolean?]>();
expectTypeOf<SetOptionalExcept<readonly [string, number, boolean], 0>>().toBe<readonly [string, number?, boolean?]>();
expectTypeOf<SetOptionalExcept<[string, number, ...boolean[]], never>>().toBe<[string?, number?, ...boolean[]]>();
expectTypeOf<SetOptionalExcept<[string, number, ...boolean[]], 0>>().toBe<[string, number?, ...boolean[]]>();
expectTypeOf<SetOptionalExcept<[string, number] | [string, number, boolean], 0>>().toBe<[string, number?] | [string, number?, boolean?]>();
expectTypeOf<SetOptionalExcept<[string, number, boolean], 1>>().toBe<[string | undefined, number, boolean?]>();
expectTypeOf<SetOptionalExcept<[string, number], number>>().toBe<[string, number]>();
expectTypeOf<SetOptionalExcept<[string, number], any>>().toBe<[string, number]>();
expectTypeOf<SetOptionalExcept<string[], never>>().toBe<string[]>();
expectTypeOf<SetOptionalExcept<[string, number] | {a: number; b: string}, 'a'>>().toBe<[string?, number?] | {a: number; b?: string}>();
expectTypeOf<SetOptionalExcept<[string, number] | {a: number; b: string}, 0>>().toBe<[string, number?] | {a?: number; b?: string}>();

// Edge cases.
expectTypeOf<SetOptionalExcept<any, 'a'>>().toBe<{[x: string]: any}>();
expectTypeOf<SetOptionalExcept<never, never>>().toBe<never>();
expectTypeOf<SetOptionalExcept<unknown, never>>().toBe<{}>();

// A key that does not exist is a type error.
// @ts-expect-error
type Typo = SetOptionalExcept<{a: number; b: string}, 'c'>;
