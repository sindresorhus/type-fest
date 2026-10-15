import {expectTypeOf} from 'nz';
import type {SetRequiredExcept} from '../index.d.ts';

// Makes every key required except the given keys.
expectTypeOf<SetRequiredExcept<{a?: number; b?: string; c?: boolean}, 'a'>>().toBe<{a?: number; b: string; c: boolean}>();
expectTypeOf<SetRequiredExcept<{a?: number; b?: string; c?: boolean}, 'a' | 'b'>>().toBe<{a?: number; b?: string; c: boolean}>();

// The given keys are kept as is, so a required given key stays required.
expectTypeOf<SetRequiredExcept<{a: number; b?: string}, 'a'>>().toBe<{a: number; b: string}>();

// Only removes the optional modifier, like `SetRequired`.
expectTypeOf<SetRequiredExcept<{a?: number; b?: string | undefined}, 'a'>>().toBe<{a?: number; b: string | undefined}>();

// Preserves readonly modifier.
expectTypeOf<SetRequiredExcept<{readonly a?: number; readonly b?: string}, 'a'>>().toBe<{readonly a?: number; readonly b: string}>();

// Makes every key required, if `Keys` is `never`.
expectTypeOf<SetRequiredExcept<{a?: number; b?: string}, never>>().toBe<{a: number; b: string}>();

// Does nothing, if `Keys` is every key or `any`.
expectTypeOf<SetRequiredExcept<{a?: number; b?: string}, 'a' | 'b'>>().toBe<{a?: number; b?: string}>();
expectTypeOf<SetRequiredExcept<{a?: number; b?: string}, any>>().toBe<{a?: number; b?: string}>();

// Works with unions, and a key of only one member is accepted.
expectTypeOf<SetRequiredExcept<{kind: 'a'; a?: number} | {kind: 'b'; b?: string}, 'a'>>().toBe<{kind: 'a'; a?: number} | {kind: 'b'; b: string}>();

// Works with functions containing properties.
declare const function_: SetRequiredExcept<{(a: string): number; p1?: string; p2?: number}, 'p1'>;
expectTypeOf(function_('foo')).toBe<number>();
expectTypeOf<Omit<typeof function_, never>>().toBe<{p1?: string; p2: number}>();

// The given keys of a type with an index signature are made required too.
expectTypeOf<SetRequiredExcept<{[key: string]: number; a?: number}, 'a'>>().toBe<{[key: string]: number; a: number}>();

// A given key that the index signature does not cover is kept as is.
expectTypeOf<SetRequiredExcept<{[key: `x-${string}`]: number; a?: number}, 'a'>>().toBe<{[key: `x-${string}`]: number; a?: number}>();
expectTypeOf<SetRequiredExcept<{[key: symbol]: number; a?: number}, 'a'>>().toBe<{[key: symbol]: number; a?: number}>();

// Works with number keys.
expectTypeOf<SetRequiredExcept<{0?: string; 1?: number}, 0>>().toBe<{0?: string; 1: number}>();

// A tuple stays a tuple.
expectTypeOf<SetRequiredExcept<[string?, number?, boolean?], 2>>().toBe<[string, number, boolean?]>();
expectTypeOf<SetRequiredExcept<[string?, number?, boolean?], '2'>>().toBe<[string, number, boolean?]>();
expectTypeOf<SetRequiredExcept<readonly [string?, number?, boolean?], 2>>().toBe<readonly [string, number, boolean?]>();
expectTypeOf<SetRequiredExcept<[string?, number?, ...boolean[]], never>>().toBe<[string, number, ...boolean[]]>();
expectTypeOf<SetRequiredExcept<[string?, number?, ...boolean[]], 1>>().toBe<[string, number?, ...boolean[]]>();
expectTypeOf<SetRequiredExcept<[string?, number?] | [string?, number?, boolean?], 2>>().toBe<[string, number] | [string, number, boolean?]>();
expectTypeOf<SetRequiredExcept<[string?, number?, boolean?], 0>>().toBe<[string?, number?, boolean?]>();
expectTypeOf<SetRequiredExcept<[string?, number?], number>>().toBe<[string?, number?]>();
expectTypeOf<SetRequiredExcept<[string?, number?], any>>().toBe<[string?, number?]>();
expectTypeOf<SetRequiredExcept<string[], never>>().toBe<string[]>();
expectTypeOf<SetRequiredExcept<[string?, number?] | {a?: number; b?: string}, 'a'>>().toBe<[string, number] | {a?: number; b: string}>();
expectTypeOf<SetRequiredExcept<[string?, number?] | {a?: number; b?: string}, 1>>().toBe<[string, number?] | {a: number; b: string}>();

// Edge cases.
expectTypeOf<SetRequiredExcept<any, 'a'>>().toBe<{[x: string]: any}>();
expectTypeOf<SetRequiredExcept<never, never>>().toBe<never>();
expectTypeOf<SetRequiredExcept<unknown, never>>().toBe<{}>();

// A key that does not exist is a type error.
// @ts-expect-error
type Typo = SetRequiredExcept<{a?: number; b?: string}, 'c'>;
