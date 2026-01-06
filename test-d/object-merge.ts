import {expectType} from 'tsd';
import type {ObjectMerge} from '../source/object-merge.d.ts';

// Simple cases
expectType<{a: number; b: string}>({} as ObjectMerge<{a: number}, {b: string}>);
expectType<{a: string}>({} as ObjectMerge<{a: number}, {a: string}>);
expectType<{a: string; b: boolean}>({} as ObjectMerge<{a: number}, {a: string; b: boolean}>);
expectType<{a: string; b: string; c: number}>({} as ObjectMerge<{a: number; b: string}, {a: string; c: number}>);
expectType<{a: string; b: boolean}>({} as ObjectMerge<{}, {a: string; b: boolean}>);
expectType<{a: string; b: boolean}>({} as ObjectMerge<{a: string; b: boolean}, {}>);

// Optional properties
// Optional only in second
expectType<{a: number | string; b: number; c: boolean}>(
	{} as ObjectMerge<{a: number; b: number}, {a?: string; c: boolean}>,
);
// Optional only in first
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

// Readonly properties
expectType<{a: string; b: string}>({} as ObjectMerge<{a: number}, {readonly a: string; readonly b: string}>);
expectType<{a: string; b: number}>({} as ObjectMerge<{readonly a: number; readonly b: number}, {a: string}>);
expectType<{a: string; b: number; c: string}>(
	{} as ObjectMerge<{readonly a: number; readonly b: number}, {readonly a: string; readonly c: string}>,
);
expectType<{a: number | string; b: string; c?: number | string}>(
	{} as ObjectMerge<
		{a: number; readonly b?: number; readonly c?: number},
		{readonly a?: string; b: string; readonly c?: string}
	>,
);
expectType<{a: number | string; b: string}>(
	{} as ObjectMerge<{a: number; readonly b?: number}, {readonly a?: string; b: string}>,
);
expectType<{[x: string]: number | string; a: string | number}>(
	{} as ObjectMerge<{a: string}, {readonly [x: string]: number}>,
);
expectType<{[x: string]: number | string; a: 1 | 2 | 3; b: string}>(
	{} as ObjectMerge<{readonly [x: string]: number; a: 1 | 2 | 3}, {b: string}>,
);

// Index signatures
expectType<{[x: string]: string | number | boolean; a: string | number; b: boolean | number}>( // TODO: Make tests like this, double properties
	{} as ObjectMerge<{a: string; b: boolean}, {[x: string]: number}>,
);
expectType<{[x: `handle${string}`]: number; [x: `on${string}`]: string | number; onChange: string | number}>(
	{} as ObjectMerge<{onChange: string}, {[x: `on${string}` | `handle${string}`]: number}>,
);
expectType<{[x: string]: string | number; a: string}>(
	{} as ObjectMerge<{[x: string]: number}, {a: string}>,
);
expectType<{[x: string]: number; a: 1 | 2 | 3}>(
	{} as ObjectMerge<{a: string}, {[x: string]: number; a: 1 | 2 | 3}>,
);
expectType<{[x: string]: string | number; a: string}>(
	{} as ObjectMerge<{[x: string]: number; a: 1 | 2 | 3}, {a: string}>,
);
expectType<{[x: number]: string; a: number; b?: number}>(
	{} as ObjectMerge<{a: number; b?: number}, {[x: number]: string}>,
);
expectType<{[x: number]: string; a: number; b?: number}>(
	{} as ObjectMerge<{[x: number]: string}, {a: number; b?: number}>,
);

// Indexor in `First` is same as in `Second`
expectType<{[x: string]: string | number}>(
	{} as ObjectMerge<{[x: string]: string}, {[x: string]: number}>,
);
// Indexor in `First` is supertype of indexor in `Second`
expectType<{[x: string]: string | number; [x: Lowercase<string>]: string | number}>(
	{} as ObjectMerge<{[x: string]: string}, {[x: Lowercase<string>]: number}>,
);
// Indexor in `First` is subtype of indexor in `Second`
expectType<{[x: string]: string | number; [x: Lowercase<string>]: string | number}>(
	{} as ObjectMerge<{[x: Lowercase<string>]: string}, {[x: string]: number}>,
);
// No overlap b/w indexors
expectType<{[x: symbol]: number; [x: number]: string}>(
	{} as ObjectMerge<{[x: symbol]: number}, {[x: number]: string}>,
);
// Partial overlap b/w indexors
expectType<{[x: Lowercase<string>]: string | number; [x: Uppercase<string>]: string | number}>(
	{} as ObjectMerge<{[x: Lowercase<string>]: number}, {[x: Uppercase<string>]: string}>,
);

// Index signatures and optional properties
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

// === `number` indexors ===
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
	// `{[x: number]: number}[never]` yields `number` instead of `never`
	// but if add a `symbol` index signature to it, then
	// `{[x: number]: number; [x: symbol]: boolean}[never]` yields `never` as expected
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

// Unions
expectType<{a: number; b: string; c: number} | {a: number; c: number; d: string}>(
	{} as ObjectMerge<{a: string; b: string} | {c: string; d: string}, {a: number; c: number}>,
);
expectType<{a: number; b: string} | {a: string; b: number}>(
	{} as ObjectMerge<{a: string; b: string}, {a: number} | {b: number}>,
);
expectType<{a: number; b: string} | {a: string; b: string; c: number} | {c: number; d: string} | {a: number; c: string; d: string}>(
	{} as ObjectMerge<{a: string; b: string} | {c: string; d: string}, {a: number} | {c: number}>,
);

// Non-objects
// @ts-expect-error
type T1 = ObjectMerge<string, {a: string}>;
// @ts-expect-error
type T2 = ObjectMerge<{a: string}, number>;
