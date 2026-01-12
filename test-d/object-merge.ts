import {expectType} from 'tsd';
import type {ObjectMerge} from '../source/object-merge.d.ts';

declare const sym: unique symbol;

// === Simple cases ===
expectType<{a: number; b: string}>({} as ObjectMerge<{a: number}, {b: string}>);
expectType<{a: string}>({} as ObjectMerge<{a: number}, {a: string}>);
expectType<{a: string; b: boolean}>({} as ObjectMerge<{a: number}, {a: string; b: boolean}>);
expectType<{a: string; b: boolean}>({} as ObjectMerge<{a: number; b: boolean}, {a: string}>);
expectType<{a: string; b: string; c: number}>({} as ObjectMerge<{a: number; b: string}, {a: string; c: number}>);
expectType<{a: string; b: boolean}>({} as ObjectMerge<{}, {a: string; b: boolean}>);
expectType<{a: string; b: boolean}>({} as ObjectMerge<{a: string; b: boolean}, {}>);

// === Optional properties ===
// Optional in second
expectType<{a: number | string; b: number; c: boolean}>(
	{} as ObjectMerge<{a: number; b: number}, {a?: string; c: boolean}>,
);
// Optional in first
expectType<{a: string; b: number; c: boolean}>(
	{} as ObjectMerge<{a?: number; b: number}, {a: string; c: boolean}>,
);
// Optional in both
expectType<{a?: number | string; b: number; c: boolean}>(
	{} as ObjectMerge<{a?: number; b: number}, {a?: string; c: boolean}>,
);
// Optionality preserved for non-overlapping keys
expectType<{a: string; b?: number; c?: string}>(
	{} as ObjectMerge<{a: number; b?: number}, {a: string; c?: string}>,
);
// Mix
expectType<{a?: number | string; b: string | number; c: string; d: boolean; e?: bigint; f: boolean; g?: bigint}>(
	{} as ObjectMerge<
		{a?: number; b: string; c?: number; d: boolean; e?: bigint},
		{a?: string; b?: number; c: string; f: boolean; g?: bigint}
	>,
);

// === Readonly properties ===
// Readonly in second
expectType<{a: string; b: number; c: boolean}>(
	{} as ObjectMerge<{a: number; b: number}, {readonly a: string; c: boolean}>,
);
expectType<{[x: string]: number | string; a: string | number}>(
	{} as ObjectMerge<{a: string}, {readonly [x: string]: number}>,
);
// Readonly in first
expectType<{a: string; b: number; c: boolean}>(
	{} as ObjectMerge<{readonly a: number; b: number}, {a: string; c: boolean}>,
);
expectType<{[x: string]: number | string; b: string}>(
	{} as ObjectMerge<{readonly [x: string]: number}, {b: string}>,
);
// Readonly in both
expectType<{a: string; b: number; c: boolean}>(
	{} as ObjectMerge<{readonly a: number; b: number}, {readonly a: string; c: boolean}>,
);
expectType<{[x: string]: number | string; b: number | string; c: string}>(
	{} as ObjectMerge<{readonly [x: string]: number; b: number}, {readonly [x: string]: string; c: string}>,
);
// Readonly is not preserved even for non-overlapping keys
expectType<{a: string; b: number; c: string}>(
	{} as ObjectMerge<{a: number; readonly b: number}, {a: string; readonly c: string}>,
);
expectType<{[x: string]: string; [x: symbol]: number}>(
	{} as ObjectMerge<{readonly [x: string]: string}, {readonly [x: symbol]: number}>,
);
// Mix
expectType<{a: string; b: number; c: string; d: boolean; e: bigint; f: boolean; g: bigint}>(
	{} as ObjectMerge<
		{readonly a: number; b: string; readonly c: number; d: boolean; readonly e: bigint},
		{readonly a: string; readonly b: number; c: string; f: boolean; readonly g: bigint}
	>,
);

// === Optional and readonly properties ===
expectType<{a: string; b: number | string}>(
	{} as ObjectMerge<{a?: number; readonly b: number}, {readonly a: string; b?: string}>,
);
expectType<{[x: string]: string | number; [x: symbol]: number | string; [sym]: string | number; a?: string | number}>(
	{} as ObjectMerge<{readonly [x: string]: number; [sym]: string}, {[x: symbol]: number; a?: string}>,
);
expectType<{a?: number | string; b: string | number; c: string; d: boolean; e?: bigint; f: boolean; g?: bigint}>(
	{} as ObjectMerge<
		{readonly a?: number; b: string; readonly c?: number; d: boolean; readonly e?: bigint},
		{readonly a?: string; readonly b?: number; c: string; f: boolean; readonly g?: bigint}
	>,
);

// === Index signatures ===
// Index signature in second
expectType<{[x: string]: string | number; a: string | number; b: 1; c: 2}>(
	{} as ObjectMerge<{a: string; b: boolean}, {[x: string]: number; b: 1; c: 2}>,
);
expectType<
	{[x: `is${string}`]: boolean | 'y' | 'n'; isLoading: boolean | 'y' | 'n'; isOpen: boolean | 'y' | 'n'; foo: string; bar: number}
>(
	{} as ObjectMerge<
		{isLoading: 'y' | 'n'; isOpen: 'y' | 'n'; foo: string; bar: number},
		{[x: `is${string}`]: boolean}
	>,
);
// Index signature in first
expectType<{[x: string]: number | string | boolean; a: string; b: 2; c: boolean}>(
	{} as ObjectMerge<{[x: string]: number; a: 1; b: 2}, {a: string; c: boolean}>,
);
expectType<
	{[x: `is${string}`]: boolean | 'y' | 'n'; isLoading: 'y' | 'n'; isOpen: 'y' | 'n'; foo: string; bar: number}
>(
	{} as ObjectMerge<
		{[x: `is${string}`]: boolean},
		{isLoading: 'y' | 'n'; isOpen: 'y' | 'n'; foo: string; bar: number}
	>,
);
// Index signature in both
expectType<{[x: string]: number | string; [sym]: boolean; a: 1 | string; b: 'b'; c: 'c'}>(
	{} as ObjectMerge<{[x: string]: number; [sym]: boolean; a: 1; b: 2}, {[x: string]: string; b: 'b'; c: 'c'}>,
);
// Multiple index signatures
expectType<
	{[x: `on${string}`]: string | string[]; [x: `handle${string}`]: number | number[]; onChange: string | string[]; handleClick: number | number[]}
>(
	{} as ObjectMerge<
		{onChange: string[]; handleClick: number[]},
		{[x: `on${string}`]: string; [x: `handle${string}`]: number}
	>,
);
expectType<
	{[x: `on${string}`]: string | string[]; [x: `handle${string}`]: number | number[]; onChange: string[]; handleClick: number[]}
>(
	{} as ObjectMerge<
		{[x: `on${string}`]: string; [x: `handle${string}`]: number},
		{onChange: string[]; handleClick: number[]}
	>,
);
expectType<
	{[x: string]: string | boolean | bigint; [x: symbol]: number; [x: number]: string | boolean; [x: `is${string}`]: bigint | string}
>(
	{} as ObjectMerge<
		{[x: string]: string; [x: symbol]: number},
		{[x: number]: boolean; [x: `is${string}`]: bigint}
	>,
);
// Indexor in `First` is same as in `Second`
expectType<{[x: string]: string | number}>(
	{} as ObjectMerge<{[x: string]: string}, {[x: string]: number}>,
);
expectType<{[x: `${number}`]: number | string; [x: number]: string | number}>(
	{} as ObjectMerge<{[x: `${number}`]: number}, {[x: number]: string}>,
);
// Indexor in `First` is supertype of indexor in `Second`
expectType<{[x: string]: string | number; [x: Lowercase<string>]: string | number}>(
	{} as ObjectMerge<{[x: string]: string}, {[x: Lowercase<string>]: number}>,
);
expectType<{[x: string]: number | string; [x: number]: string | number}>(
	{} as ObjectMerge<{[x: string]: number}, {[x: number]: string}>,
);
expectType<{[x: string]: string | boolean; [x: `is${string}`]: boolean | string}>(
	{} as ObjectMerge<{[x: string]: string}, {[x: `is${string}`]: boolean}>,
);
// Indexor in `First` is subtype of indexor in `Second`
expectType<{[x: string]: string | number; [x: Lowercase<string>]: string | number}>(
	{} as ObjectMerge<{[x: Lowercase<string>]: string}, {[x: string]: number}>,
);
expectType<{[x: number]: number | string; [x: string]: string | number}>(
	{} as ObjectMerge<{[x: number]: number}, {[x: string]: string}>,
);
// No overlap b/w indexors
expectType<{[x: symbol]: number; [x: number]: string}>(
	{} as ObjectMerge<{[x: symbol]: number}, {[x: number]: string}>,
);
// Partial overlap b/w indexors
expectType<{[x: Lowercase<string>]: string | number; [x: Uppercase<string>]: string | number}>(
	{} as ObjectMerge<{[x: Lowercase<string>]: number}, {[x: Uppercase<string>]: string}>,
);

// === Index signatures and optional properties ===
expectType<{[x: string]: string | number; a?: string | number}>(
	{} as ObjectMerge<{a?: string}, {[x: string]: number}>,
);
expectType<{[x: string]: string | number; a?: string | number}>(
	{} as ObjectMerge<{[x: string]: number}, {a?: string}>,
);
expectType<{[x: string]: number | string; a: number | string}>(
	{} as ObjectMerge<{a: string}, {[x: string]: number; a?: number}>,
);
expectType<{[x: string]: number | string; a: string}>(
	{} as ObjectMerge<{[x: string]: number; a?: number}, {a: string}>,
);
expectType<{[x: string]: number | string; a?: number | string}>(
	{} as ObjectMerge<{[x: string]: number; a?: number}, {a?: string}>,
);

// === Normalized keys cases ===
// ===== Cases covering branch that handles literal keys of `Second` =====
// String/number key overwrites corresponding number/string key
expectType<{0: string; 1: string}>({} as ObjectMerge<{'0': number}, {0: string; 1: string}>);
expectType<{'0': string; '1': string}>({} as ObjectMerge<{0?: number}, {'0': string; '1': string}>);
// String/number key with number/string index signature
expectType<{[x: string]: number | string; 0: string}>({} as ObjectMerge<{[x: string]: number}, {0: string}>);
expectType<{[x: number]: number | string; '0': string}>({} as ObjectMerge<{[x: number]: number}, {'0': string}>);
// Optional number key with string index signature
expectType<{[x: string]: number | string; 0?: string | number}>({} as ObjectMerge<{[x: string]: number}, {0?: string}>);
// Optional string key with number index signature
expectType<{[x: number]: number | string; [x: symbol]: boolean; '0'?: string | number}>(
	// The `symbol` index signature is added because
	// `{[x: number]: number}[never]` yields `number` instead of `never`,
	// but if we add a `symbol` index signature to it, then
	// `{[x: number]: number; [x: symbol]: boolean}[never]` yields `never` as expected.
	{} as ObjectMerge<{[x: number]: number; [x: symbol]: boolean}, {'0'?: string}>,
);

// ===== Cases covering branch that handles literal keys of `First` =====
// String/number key from `First` doesn't show up in output if corresponding number/string key exists in `Second`
expectType<{0: string; '1': number}>({} as ObjectMerge<{'0': number; '1': number}, {0: string}>);
expectType<{'0': string; 1: number}>({} as ObjectMerge<{0: number; 1: number}, {'0': string}>);
// Number/string key from `First` with string/number index signature in `Second`
expectType<{[x: string]: string | number; 0: number | string}>({} as ObjectMerge<{0: number}, {[x: string]: string}>);
expectType<{[x: number]: string | number; [x: symbol]: boolean; '0': number | string}>(
	{} as ObjectMerge<{'0': number}, {[x: number]: string; [x: symbol]: boolean}>,
);

// ===== Cases covering branch that handles non-literal keys of `Second` =====
// String/number index signature in `Second` with number/string key in `First`
expectType<{[x: string]: number | string; 0: string | number}>({} as ObjectMerge<{0: string}, {[x: string]: number}>);
expectType<{[x: number]: number | string; '0': string | number}>({} as ObjectMerge<{'0': string}, {[x: number]: number}>);
// Index signature in `Second` with overwritten key in `First`
expectType<{[x: string]: number; [x: symbol]: boolean; 0: 1 | 2 | 3}>(
	{} as ObjectMerge<{[x: symbol]: boolean; '0': string}, {[x: string]: number; 0: 1 | 2 | 3}>,
);
// Index signature in `Second` with non-overwritten key in `First`
expectType<{[x: string]: number | string; 0: string | 1 | 2 | 3}>({} as ObjectMerge<{0: string}, {[x: string]: number; '0'?: 1 | 2 | 3}>);

// ===== Cases covering branch that handles non-literal keys of `First` =====
// String/number index signature in `First` with number/string key in `Second`
expectType<{[x: string]: number | string; 0: string}>({} as ObjectMerge<{[x: string]: number}, {0: string}>);
expectType<{[x: number]: number | string; '0': string}>({} as ObjectMerge<{[x: number]: number}, {'0': string}>);

// ===== Cases covering branch that handles optional keys of `Second` that are also present in `First` =====
// Number/string optional key in `Second` with corresponding string/number key in `First`
expectType<{'0': number | string}>({} as ObjectMerge<{'0': number}, {0?: string}>);
expectType<{0: number | string}>({} as ObjectMerge<{0: number}, {'0'?: string}>);
// Number/string optional key in `Second` with corresponding string/number optional key in `First`
expectType<{'0'?: number | string}>({} as ObjectMerge<{'0'?: number}, {0?: string}>);
expectType<{0?: number | string}>({} as ObjectMerge<{0?: number}, {'0'?: string}>);

// === Unions ===
expectType<{a: number; b: string; c: number} | {a: number; c: number; d: string}>(
	{} as ObjectMerge<{a: string; b: string} | {c: string; d: string}, {a: number; c: number}>,
);
expectType<{a: number; b: string} | {a: string; b: number}>(
	{} as ObjectMerge<{a: string; b: string}, {a: number} | {b: number}>,
);
expectType<{a: number; b: string} | {a: string; b: string; c: number} | {c: number; d: string} | {a: number; c: string; d: string}>(
	{} as ObjectMerge<{a: string; b: string} | {c: string; d: string}, {a: number} | {c: number}>,
);

// === Functions ===
expectType<{a: string}>({} as ObjectMerge<{a: string}, (a1: string, a2: number) => void>);
expectType<{a: number}>({} as ObjectMerge<{a: string}, {(a1: string, a2: number): void; a: number}>);
expectType<{a: string}>({} as ObjectMerge<() => string, {a: string}>);
expectType<{a: string}>({} as ObjectMerge<{(): string; a: number}, {a: string}>);

// === Non-objects ===
// @ts-expect-error
type T1 = ObjectMerge<string, {a: string}>;
// @ts-expect-error
type T2 = ObjectMerge<{a: string}, number>;
// @ts-expect-error
type T3 = ObjectMerge<{a: string}, unknown>;
// @ts-expect-error
type T4 = ObjectMerge<unknown, {a: string}>;
expectType<unknown>({} as ObjectMerge<string[], {0: string}>);
expectType<unknown>({} as ObjectMerge<{0: string}, string[]>);
expectType<unknown>({} as ObjectMerge<string[], number[]>);
expectType<unknown>({} as ObjectMerge<ReadonlyMap<string, number>, {a: string}>);
expectType<unknown>({} as ObjectMerge<{a: string}, ReadonlyMap<string, number>>);
expectType<unknown>({} as ObjectMerge<WeakMap<WeakKey, number>, {a: string}>);
expectType<unknown>({} as ObjectMerge<{a: string}, WeakMap<WeakKey, number>>);
expectType<unknown>({} as ObjectMerge<ReadonlySet<string>, {a: string}>);
expectType<unknown>({} as ObjectMerge<{a: string}, ReadonlySet<string>>);
expectType<unknown>({} as ObjectMerge<WeakSet<WeakKey>, {a: string}>);
expectType<unknown>({} as ObjectMerge<{a: string}, WeakSet<WeakKey>>);

// === Boundary cases ===
expectType<any>({} as ObjectMerge<any, {a: string}>);
expectType<any>({} as ObjectMerge<{a: string}, any>);
expectType<never>({} as ObjectMerge<never, {a: string}>);
expectType<never>({} as ObjectMerge<{a: string}, never>);
expectType<never>({} as ObjectMerge<any, never>);
expectType<never>({} as ObjectMerge<never, any>);
