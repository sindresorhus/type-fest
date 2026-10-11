import {expectTypeOf} from 'nz';
import type {ObjectMerge} from '../source/object-merge.d.ts';

declare const sym: unique symbol;

// === Simple cases ===
expectTypeOf<ObjectMerge<{a: number}, {b: string}>>().toBe<{a: number; b: string}>();
expectTypeOf<ObjectMerge<{a: number}, {a: string}>>().toBe<{a: string}>();
expectTypeOf<ObjectMerge<{a: number}, {a: string; b: boolean}>>().toBe<{a: string; b: boolean}>();
expectTypeOf<ObjectMerge<{a: number; b: boolean}, {a: string}>>().toBe<{a: string; b: boolean}>();
expectTypeOf<ObjectMerge<{a: number; b: string}, {a: string; c: number}>>().toBe<{a: string; b: string; c: number}>();
expectTypeOf<ObjectMerge<{}, {a: string; b: boolean}>>().toBe<{a: string; b: boolean}>();
expectTypeOf<ObjectMerge<{a: string; b: boolean}, {}>>().toBe<{a: string; b: boolean}>();

// === Optional properties ===
// Optional in second
expectTypeOf<ObjectMerge<{a: number; b: number}, {a?: string; c: boolean}>>().toBe<{a: number | string; b: number; c: boolean}>();
// Optional in first
expectTypeOf<ObjectMerge<{a?: number; b: number}, {a: string; c: boolean}>>().toBe<{a: string; b: number; c: boolean}>();
// Optional in both
expectTypeOf<ObjectMerge<{a?: number; b: number}, {a?: string; c: boolean}>>().toBe<{a?: number | string; b: number; c: boolean}>();
// Optionality preserved for non-overlapping keys
expectTypeOf<ObjectMerge<{a: number; b?: number}, {a: string; c?: string}>>().toBe<{a: string; b?: number; c?: string}>();
// Mix
expectTypeOf<ObjectMerge<
	{a?: number; b: string; c?: number; d: boolean; e?: bigint},
	{a?: string; b?: number; c: string; f: boolean; g?: bigint}
>>().toBe<{a?: number | string; b: string | number; c: string; d: boolean; e?: bigint; f: boolean; g?: bigint}>();

// === Readonly properties ===
// Readonly in second
expectTypeOf<ObjectMerge<{a: number; b: number}, {readonly a: string; c: boolean}>>().toBe<{a: string; b: number; c: boolean}>();
expectTypeOf<ObjectMerge<{a: string}, {readonly [x: string]: number}>>().toBe<{[x: string]: number | string; a: string | number}>();
// Readonly in first
expectTypeOf<ObjectMerge<{readonly a: number; b: number}, {a: string; c: boolean}>>().toBe<{a: string; b: number; c: boolean}>();
expectTypeOf<ObjectMerge<{readonly [x: string]: number}, {b: string}>>().toBe<{[x: string]: number | string; b: string}>();
// Readonly in both
expectTypeOf<ObjectMerge<{readonly a: number; b: number}, {readonly a: string; c: boolean}>>().toBe<{a: string; b: number; c: boolean}>();
expectTypeOf<ObjectMerge<{readonly [x: string]: number; b: number}, {readonly [x: string]: string; c: string}>>().toBe<{[x: string]: number | string; b: number | string; c: string}>();
// Readonly is not preserved even for non-overlapping keys
expectTypeOf<ObjectMerge<{a: number; readonly b: number}, {a: string; readonly c: string}>>().toBe<{a: string; b: number; c: string}>();
expectTypeOf<ObjectMerge<{readonly [x: string]: string}, {readonly [x: symbol]: number}>>().toBe<{[x: string]: string; [x: symbol]: number}>();
// Mix
expectTypeOf<ObjectMerge<
	{readonly a: number; b: string; readonly c: number; d: boolean; readonly e: bigint},
	{readonly a: string; readonly b: number; c: string; f: boolean; readonly g: bigint}
>>().toBe<{a: string; b: number; c: string; d: boolean; e: bigint; f: boolean; g: bigint}>();

// === Optional and readonly properties ===
expectTypeOf<ObjectMerge<{a?: number; readonly b: number}, {readonly a: string; b?: string}>>().toBe<{a: string; b: number | string}>();
expectTypeOf<ObjectMerge<{readonly [x: string]: number; [sym]: string}, {[x: symbol]: number; a?: string}>>().toBe<{[x: string]: string | number; [x: symbol]: number | string; [sym]: string | number; a?: string | number}>();
expectTypeOf<ObjectMerge<
	{readonly a?: number; b: string; readonly c?: number; d: boolean; readonly e?: bigint},
	{readonly a?: string; readonly b?: number; c: string; f: boolean; readonly g?: bigint}
>>().toBe<{a?: number | string; b: string | number; c: string; d: boolean; e?: bigint; f: boolean; g?: bigint}>();

// === Index signatures ===
// Index signature in second
expectTypeOf<ObjectMerge<{a: string; b: boolean}, {[x: string]: number; b: 1; c: 2}>>().toBe<{[x: string]: string | number; a: string | number; b: 1; c: 2}>();
expectTypeOf<ObjectMerge<
	{isLoading: 'y' | 'n'; isOpen: 'y' | 'n'; foo: string; bar: number},
	{[x: `is${string}`]: boolean}
>>().toBe<
	{[x: `is${string}`]: boolean | 'y' | 'n'; isLoading: boolean | 'y' | 'n'; isOpen: boolean | 'y' | 'n'; foo: string; bar: number}>();
// Index signature in first
expectTypeOf<ObjectMerge<{[x: string]: number; a: 1; b: 2}, {a: string; c: boolean}>>().toBe<{[x: string]: number | string | boolean; a: string; b: 2; c: boolean}>();
expectTypeOf<ObjectMerge<
	{[x: `is${string}`]: boolean},
	{isLoading: 'y' | 'n'; isOpen: 'y' | 'n'; foo: string; bar: number}
>>().toBe<
	{[x: `is${string}`]: boolean | 'y' | 'n'; isLoading: 'y' | 'n'; isOpen: 'y' | 'n'; foo: string; bar: number}>();
// Index signature in both
expectTypeOf<ObjectMerge<{[x: string]: number; [sym]: boolean; a: 1; b: 2}, {[x: string]: string; b: 'b'; c: 'c'}>>().toBe<{[x: string]: number | string; [sym]: boolean; a: 1 | string; b: 'b'; c: 'c'}>();
// Multiple index signatures
expectTypeOf<ObjectMerge<
	{onChange: string[]; handleClick: number[]},
	{[x: `on${string}`]: string; [x: `handle${string}`]: number}
>>().toBe<
	{[x: `on${string}`]: string | string[]; [x: `handle${string}`]: number | number[]; onChange: string | string[]; handleClick: number | number[]}>();
expectTypeOf<ObjectMerge<
	{[x: `on${string}`]: string; [x: `handle${string}`]: number},
	{onChange: string[]; handleClick: number[]}
>>().toBe<
	{[x: `on${string}`]: string | string[]; [x: `handle${string}`]: number | number[]; onChange: string[]; handleClick: number[]}>();
expectTypeOf<ObjectMerge<
	{[x: string]: string; [x: symbol]: number},
	{[x: number]: boolean; [x: `is${string}`]: bigint}
>>().toBe<
	{[x: string]: string | boolean | bigint; [x: symbol]: number; [x: number]: string | boolean; [x: `is${string}`]: bigint | string}>();
// Indexor in `First` is same as in `Second`
expectTypeOf<ObjectMerge<{[x: string]: string}, {[x: string]: number}>>().toBe<{[x: string]: string | number}>();
expectTypeOf<ObjectMerge<{[x: `${number}`]: number}, {[x: number]: string}>>().toBe<{[x: `${number}`]: number | string; [x: number]: string | number}>();
// Indexor in `First` is supertype of indexor in `Second`
expectTypeOf<ObjectMerge<{[x: string]: string}, {[x: Lowercase<string>]: number}>>().toBe<{[x: string]: string | number; [x: Lowercase<string>]: string | number}>();
expectTypeOf<ObjectMerge<{[x: string]: number}, {[x: number]: string}>>().toBe<{[x: string]: number | string; [x: number]: string | number}>();
expectTypeOf<ObjectMerge<{[x: string]: string}, {[x: `is${string}`]: boolean}>>().toBe<{[x: string]: string | boolean; [x: `is${string}`]: boolean | string}>();
// Indexor in `First` is subtype of indexor in `Second`
expectTypeOf<ObjectMerge<{[x: Lowercase<string>]: string}, {[x: string]: number}>>().toBe<{[x: string]: string | number; [x: Lowercase<string>]: string | number}>();
expectTypeOf<ObjectMerge<{[x: number]: number}, {[x: string]: string}>>().toBe<{[x: number]: number | string; [x: string]: string | number}>();
// No overlap b/w indexors
expectTypeOf<ObjectMerge<{[x: symbol]: number}, {[x: number]: string}>>().toBe<{[x: symbol]: number; [x: number]: string}>();
// Partial overlap b/w indexors
expectTypeOf<ObjectMerge<{[x: Lowercase<string>]: number}, {[x: Uppercase<string>]: string}>>().toBe<{[x: Lowercase<string>]: string | number; [x: Uppercase<string>]: string | number}>();

// === Index signatures and optional properties ===
expectTypeOf<ObjectMerge<{a?: string}, {[x: string]: number}>>().toBe<{[x: string]: string | number; a?: string | number}>();
expectTypeOf<ObjectMerge<{[x: string]: number}, {a?: string}>>().toBe<{[x: string]: string | number; a?: string | number}>();
expectTypeOf<ObjectMerge<{a: string}, {[x: string]: number; a?: number}>>().toBe<{[x: string]: number | string; a: number | string}>();
expectTypeOf<ObjectMerge<{[x: string]: number; a?: number}, {a: string}>>().toBe<{[x: string]: number | string; a: string}>();
expectTypeOf<ObjectMerge<{[x: string]: number; a?: number}, {a?: string}>>().toBe<{[x: string]: number | string; a?: number | string}>();

// === Normalized keys cases ===
// ===== Cases covering branch that handles literal keys of `Second` =====
// String/number key overwrites corresponding number/string key
expectTypeOf<ObjectMerge<{'0': number}, {0: string; 1: string}>>().toBe<{0: string; 1: string}>();
expectTypeOf<ObjectMerge<{0?: number}, {'0': string; '1': string}>>().toBe<{'0': string; '1': string}>();
expectTypeOf<ObjectMerge<{1.5: number}, {'1.50': string}>>().toBe<{1.5: number; '1.50': string}>();
// String/number key with number/string index signature
expectTypeOf<ObjectMerge<{[x: string]: number}, {0: string}>>().toBe<{[x: string]: number | string; 0: string}>();
expectTypeOf<ObjectMerge<{[x: number]: number}, {'0': string}>>().toBe<{[x: number]: number | string; '0': string}>();
// Optional number key with string index signature
expectTypeOf<ObjectMerge<{[x: string]: number}, {0?: string}>>().toBe<{[x: string]: number | string; 0?: string | number}>();
// Optional string key with number index signature
// The `symbol` index signature is added because
// `{[x: number]: number}[never]` yields `number` instead of `never`,
// but if we add a `symbol` index signature to it, then
// `{[x: number]: number; [x: symbol]: boolean}[never]` yields `never` as expected.
expectTypeOf<ObjectMerge<{[x: number]: number; [x: symbol]: boolean}, {'0'?: string}>>().toBe<{[x: number]: number | string; [x: symbol]: boolean; '0'?: string | number}>();

// ===== Cases covering branch that handles literal keys of `First` =====
// String/number key from `First` doesn't show up in output if corresponding number/string key exists in `Second`
expectTypeOf<ObjectMerge<{'0': number; '1': number}, {0: string}>>().toBe<{0: string; '1': number}>();
expectTypeOf<ObjectMerge<{0: number; 1: number}, {'0': string}>>().toBe<{'0': string; 1: number}>();
// Number/string key from `First` with string/number index signature in `Second`
expectTypeOf<ObjectMerge<{0: number}, {[x: string]: string}>>().toBe<{[x: string]: string | number; 0: number | string}>();
expectTypeOf<ObjectMerge<{'0': number}, {[x: number]: string; [x: symbol]: boolean}>>().toBe<{[x: number]: string | number; [x: symbol]: boolean; '0': number | string}>();

// ===== Cases covering branch that handles non-literal keys of `Second` =====
// String/number index signature in `Second` with number/string key in `First`
expectTypeOf<ObjectMerge<{0: string}, {[x: string]: number}>>().toBe<{[x: string]: number | string; 0: string | number}>();
expectTypeOf<ObjectMerge<{'0': string}, {[x: number]: number}>>().toBe<{[x: number]: number | string; '0': string | number}>();
// Index signature in `Second` with overwritten key in `First`
expectTypeOf<ObjectMerge<{[x: symbol]: boolean; '0': string}, {[x: string]: number; 0: 1 | 2 | 3}>>().toBe<{[x: string]: number; [x: symbol]: boolean; 0: 1 | 2 | 3}>();
// Index signature in `Second` with non-overwritten key in `First`
expectTypeOf<ObjectMerge<{0: string}, {[x: string]: number; '0'?: 1 | 2 | 3}>>().toBe<{[x: string]: number | string; 0: string | 1 | 2 | 3}>();

// ===== Cases covering branch that handles non-literal keys of `First` =====
// String/number index signature in `First` with number/string key in `Second`
expectTypeOf<ObjectMerge<{[x: string]: number}, {0: string}>>().toBe<{[x: string]: number | string; 0: string}>();
expectTypeOf<ObjectMerge<{[x: number]: number}, {'0': string}>>().toBe<{[x: number]: number | string; '0': string}>();

// ===== Cases covering branch that handles optional keys of `Second` that are also present in `First` =====
// Number/string optional key in `Second` with corresponding string/number key in `First`
expectTypeOf<ObjectMerge<{'0': number}, {0?: string}>>().toBe<{'0': number | string}>();
expectTypeOf<ObjectMerge<{0: number}, {'0'?: string}>>().toBe<{0: number | string}>();
// Number/string optional key in `Second` with corresponding string/number optional key in `First`
expectTypeOf<ObjectMerge<{'0'?: number}, {0?: string}>>().toBe<{'0'?: number | string}>();
expectTypeOf<ObjectMerge<{0?: number}, {'0'?: string}>>().toBe<{0?: number | string}>();

// ===== `readonly` on a member the merge touches never survives, because the result is a fresh object. A `readonly` one level down does survive, because that member is copied by reference. =====

// A key only the second has keeps its own modifier minus `readonly`.
expectTypeOf<ObjectMerge<{readonly a: string}, {readonly b: number}>>().toBe<{a: string; b: number}>();
// A key on both sides takes the second's modifier, and `readonly` is dropped either way.
expectTypeOf<ObjectMerge<{readonly a: string}, {a: number}>>().toBe<{a: number}>();
expectTypeOf<ObjectMerge<{a: string}, {readonly a: number}>>().toBe<{a: number}>();
expectTypeOf<ObjectMerge<{readonly a?: string}, {a?: number}>>().toBe<{a?: number | string}>();

// One level down the member is copied whole, so its `readonly` is still there, which is what the runtime does as well.
expectTypeOf<ObjectMerge<{a: {readonly b: string}}, {c: number}>>().toBe<{a: {readonly b: string}; c: number}>();

// === Unions ===
expectTypeOf<ObjectMerge<{a: string; b: string} | {c: string; d: string}, {a: number; c: number}>>().toBe<{a: number; b: string; c: number} | {a: number; c: number; d: string}>();
expectTypeOf<ObjectMerge<{a: string; b: string}, {a: number} | {b: number}>>().toBe<{a: number; b: string} | {a: string; b: number}>();
expectTypeOf<ObjectMerge<{a: string; b: string} | {c: string; d: string}, {a: number} | {c: number}>>().toBe<{a: number; b: string} | {a: string; b: string; c: number} | {c: number; d: string} | {a: number; c: string; d: string}>();

// === Functions ===
expectTypeOf<ObjectMerge<{a: string}, (a1: string, a2: number) => void>>().toBe<{a: string}>();
expectTypeOf<ObjectMerge<{a: string}, {(a1: string, a2: number): void; a: number}>>().toBe<{a: number}>();
expectTypeOf<ObjectMerge<() => string, {a: string}>>().toBe<{a: string}>();
expectTypeOf<ObjectMerge<{(): string; a: number}, {a: string}>>().toBe<{a: string}>();

// === Non-objects ===
// @ts-expect-error
type T1 = ObjectMerge<string, {a: string}>;
// @ts-expect-error
type T2 = ObjectMerge<{a: string}, number>;
// @ts-expect-error
type T3 = ObjectMerge<{a: string}, unknown>;
// @ts-expect-error
type T4 = ObjectMerge<unknown, {a: string}>;
expectTypeOf<ObjectMerge<string[], {0: string}>>().toBe<unknown>();
expectTypeOf<ObjectMerge<{0: string}, string[]>>().toBe<unknown>();
expectTypeOf<ObjectMerge<string[], number[]>>().toBe<unknown>();
expectTypeOf<ObjectMerge<ReadonlyMap<string, number>, {a: string}>>().toBe<unknown>();
expectTypeOf<ObjectMerge<{a: string}, ReadonlyMap<string, number>>>().toBe<unknown>();
expectTypeOf<ObjectMerge<WeakMap<WeakKey, number>, {a: string}>>().toBe<unknown>();
expectTypeOf<ObjectMerge<{a: string}, WeakMap<WeakKey, number>>>().toBe<unknown>();
expectTypeOf<ObjectMerge<ReadonlySet<string>, {a: string}>>().toBe<unknown>();
expectTypeOf<ObjectMerge<{a: string}, ReadonlySet<string>>>().toBe<unknown>();
expectTypeOf<ObjectMerge<WeakSet<WeakKey>, {a: string}>>().toBe<unknown>();
expectTypeOf<ObjectMerge<{a: string}, WeakSet<WeakKey>>>().toBe<unknown>();

// === Boundary cases ===
expectTypeOf<ObjectMerge<any, {a: string}>>().toBe<any>();
expectTypeOf<ObjectMerge<{a: string}, any>>().toBe<any>();
expectTypeOf<ObjectMerge<never, {a: string}>>().toBe<never>();
expectTypeOf<ObjectMerge<{a: string}, never>>().toBe<never>();
expectTypeOf<ObjectMerge<any, never>>().toBe<never>();
expectTypeOf<ObjectMerge<never, any>>().toBe<never>();
