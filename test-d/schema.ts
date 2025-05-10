import {expectType} from 'tsd';
import type {Schema} from '../index.d.ts';

// Non recursives
expectType<number>({} as Schema<string, number>);
expectType<string>({} as Schema<boolean, string>);
expectType<'c'>({} as Schema<'a' | 'b', 'c'>);
expectType<string | null>({} as Schema<number, string | null>);
expectType<false>({} as Schema<null | undefined, false>);

expectType<{date: Date}>({} as Schema<Date, {date: Date}>);
expectType<string>({} as Schema<RegExp, string>);
expectType<Set<number>>({} as Schema<Map<string, string>, Set<number>>);
expectType<Record<string, number>>({} as Schema<ReadonlyMap<string, string>, Record<string, number>>);
expectType<Map<string, number>>({} as Schema<Set<string>, Map<string, number>>);
expectType<readonly number[]>({} as Schema<ReadonlySet<string>, readonly number[]>);
expectType<{fn: unknown}>({} as Schema<(a: number, b: number) => void, {fn: unknown}>);
expectType<(a: string, b: string) => void>({} as Schema<(a: number, b: number) => void, (a: string, b: string) => void>);
expectType<{a: string}>({} as Schema<Map<string, number> | Set<number> | Date, {a: string}>);

// Objects
expectType<{a: bigint}>({} as Schema<{a: number}, bigint>);
expectType<{a: {b: bigint}; c: bigint}>({} as Schema<{a: {b: number}; c: string}, bigint>);
expectType<{a: {b: bigint[]}; c: {d: {e: bigint} | {f: {g: bigint} | bigint}; h: {i: {j: {k: bigint}}}}}>(
	{} as Schema<{a: {b: string[]}; c: {d: {e: string} | {f: {g: number} | boolean}; h: {i: {j: {k: string}}}}}, bigint>,
);

// Preserves readonly and optional modifiers
expectType<{readonly a: number}>({} as Schema<{readonly a: string}, number>);
expectType<{a?: number}>({} as Schema<{a?: string}, number>);
expectType<{a?: {readonly b?: number}}>({} as Schema<{a?: {readonly b?: string}}, number>);
expectType<{0?: {readonly 1?: number}}>({} as Schema<{0?: {readonly 1?: string}}, number>);
expectType<{readonly a: boolean; b?: boolean; readonly c?: {readonly d?: {e?: boolean} | {readonly f: boolean}; g: {h: {readonly i: boolean}}}}>(
	{} as Schema<{readonly a: string; b?: string; readonly c?: {readonly d?: {e?: number} | {readonly f: number}; g: {h: {readonly i: bigint}}}}, boolean>,
);

// Caveat: Optional properties with explicit `undefined` don't behave differently from optional properties without explicit `undefined`.
// For example, `Schema<{a?: {b?: number} | undefined}, string>` gives `{a?: {b?: string}}` and not `{a?: {b?: string} | string}`
expectType<{a?: {b?: string}}>({} as Schema<{a?: {b?: number} | undefined}, string>);
expectType<{a: {b?: string} | string}>({} as Schema<{a: {b?: number} | undefined}, string>);

// Index signatures
expectType<Record<string, number>>({} as Schema<Record<string, string>, number>);
expectType<Record<string, {a: boolean; b: boolean}>>({} as Schema<Record<string, {a: string; b: number}>, boolean>);
expectType<Set<number> | Record<string, Set<number>>>({} as Schema<Map<string, string> | Record<string, string>, Set<number>>);
expectType<{[K: string]: number; a: number; b: number}>({} as Schema<{[K: string]: string; a: string; b: string}, number>);
expectType<{[K: number]: string; 0: string; 1: string}>({} as Schema<{[K: number]: boolean; 0: boolean; 1: boolean}, string>);

// Edge cases
expectType<{}>({} as Schema<{}, number>);
expectType<never>({} as Schema<never, bigint>);

// Unions
expectType<{a: string} | {b: {c: string}}>({} as Schema<{a: number} | {b: {c: number}}, string>);
expectType<{a: {b: null} | {c: {d: null}}}>({} as Schema<{a: {b: string} | {c: {d: number}}}, null>);
expectType<{a: {b: null} | null}>({} as Schema<{a: {b: string} | string}, null>);
expectType<{a: {a: string}} | Array<{a: string}> | [{a: string}, {a: string}]>({} as Schema<{a: string} | string[] | [string, string], {a: string}>);

// Arrays
expectType<[bigint, bigint]>({} as Schema<[string, number], bigint>);
expectType<[{a: bigint}, bigint]>({} as Schema<[{a: string}, number], bigint>);
expectType<[bigint, bigint?, bigint?]>({} as Schema<[string, number?, boolean?], bigint>);
expectType<[string, {a: string}?, string?]>({} as Schema<[string, {a: number}?, boolean?], string>);
expectType<[bigint, bigint, ...bigint[]]>({} as Schema<[string, number, ...string[]], bigint>);
expectType<[({a?: string})?, ({a?: string})?]>({} as Schema<[string?, string?], {a?: string}>);
expectType<[bigint, bigint?, ({a: {b: bigint}})?, ...bigint[]]>(
	{} as Schema<[string, number?, ({a: {b: string}})?, ...string[]], bigint>,
);
expectType<[bigint?, bigint?, ...Array<{a?: {b: bigint}}>]>({} as Schema<[string?, number?, ...Array<{a?: {b: string}}>], bigint>);
expectType<[...bigint[], bigint, bigint]>({} as Schema<[...string[], string, number], bigint>);
expectType<[bigint, ...bigint[], bigint, bigint]>({} as Schema<[string, ...string[], string, number], bigint>);
expectType<[bigint, [bigint, bigint], ...Array<[bigint, bigint?]>]>(
	{} as Schema<[string, [string, string], ...Array<[string, boolean?]>], bigint>,
);
expectType<[`${number}`, [`${number}`, Array<{a: `${number}`}>], ...Array<[`${number}`, ...(Array<{a: `${number}`}>)]>]>(
	{} as Schema<[number, [number, Array<{a: number}>], ...Array<[number, ...(Array<{a: number}>)]>], `${number}`>,
);
// Caveat: Optional properties with explicit `undefined` don't behave differently from optional properties without explicit `undefined`.
// For example, `Schema<[({a: number} | undefined)?], bigint>` gives `[{a: bigint}?]` and not `[({a: bigint} | bigint)?]`
expectType<[{a: bigint}?]>({} as Schema<[({a: number} | undefined)?], bigint>);
expectType<[({a: bigint} | bigint)]>({} as Schema<[({a: number} | undefined)], bigint>);
