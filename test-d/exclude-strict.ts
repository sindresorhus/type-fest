import {expectType} from 'tsd';
import type {ExcludeStrict} from '../source/exclude-strict.js';

// Primitive union tests

type ShirtSize = 'xxxl' | 'xxl' | 'xl' | 'l' | 'm' | 's' | 'xs' | 'xxs';
type LargeShirtSize = 'xxxl' | 'xxl' | 'xl' | 'l';
type SmallShirtSize = 's' | 'xs' | 'xxs';

declare const nonLargeShirtSizes: ExcludeStrict<ShirtSize, LargeShirtSize>;
expectType<'m' | SmallShirtSize>(nonLargeShirtSizes);

declare const nonSmallShirtSizes: ExcludeStrict<ShirtSize, SmallShirtSize>;
expectType<LargeShirtSize | 'm'>(nonSmallShirtSizes);

// @ts-expect-error
declare const allInvalidShirtSizes: ExcludeStrict<ShirtSize, 'skyscraper-large' | 'atom-small'>;

// @ts-expect-error
declare const someInvalidShirtSizes: ExcludeStrict<ShirtSize, 'm' | 'atom-small'>;

// Object union tests

type Foo = {
	kind: 'foo';
	a: string;
	b: string;
};

type Bar = {
	kind: 'bar';
	a: string;
	b: number;
	c: boolean;
};

type Foobar = Foo | Bar;

expectType<never>({} as ExcludeStrict<Foobar, {a: string}>);
expectType<Bar>({} as ExcludeStrict<Foobar, {kind: 'foo'}>);
expectType<Bar>({} as ExcludeStrict<Foobar, {b: string}>);
expectType<Foo>({} as ExcludeStrict<Foobar, {c: boolean}>);
expectType<never>({} as ExcludeStrict<Foobar, {b: string} | {c: boolean}>);

// @ts-expect-error
declare const invalidLoneField: ExcludeStrict<Foobar, {d: string}>;

// @ts-expect-error
declare const invalidMixedFields: ExcludeStrict<Foobar, {kind: 'foo'; d: string}>;

// @ts-expect-error
declare const undefinedField: ExcludeStrict<Foobar, undefined>;

// Primitives
expectType<number>({} as ExcludeStrict<string | number, string>);
expectType<string>({} as ExcludeStrict<string | number | bigint, number | bigint>);
expectType<'foo'>({} as ExcludeStrict<'foo' | 'bar' | 'baz', `b${string}`>);

// @ts-expect-error
type invalid1 = ExcludeStrict<string | number | boolean, number | bigint>;
// @ts-expect-error
type invalid2 = ExcludeStrict<string, Uppercase<string>>;

// Optional and readonly modifiers
expectType<never>({} as ExcludeStrict<{a: string; b: number}, {a?: string}>);
expectType<{c: string; d: number}>({} as ExcludeStrict<{a: string; b: number} | {c: string; d: number}, {a?: string}>);
expectType<never>({} as ExcludeStrict<string[], readonly string[]>);

// @ts-expect-error
type invalid3 = ExcludeStrict<{a?: string; b: number}, {a: string}>;
// @ts-expect-error
type invalid4 = ExcludeStrict<readonly string[], string[]>;

// Index signatures
expectType<{a: string; b: number}>(
	{} as ExcludeStrict<{a: string; b: number} | {c: true; d: false}, Record<string, boolean>>,
);

// @ts-expect-error
type invalid5 = ExcludeStrict<{a: string; b: number} | {c: true; d: false}, Record<string, string>>;

// `any` and `never`
expectType<never>(
	{} as ExcludeStrict<string | {a: string; b: number} | string[], any>,
);
expectType<string | {a: string; b: number} | string[]>(
	{} as ExcludeStrict<string | {a: string; b: number} | string[], never>,
);

// Miscellaneous
expectType<{x: number; y: number}>({} as ExcludeStrict<[number, number] | {x: number; y: number}, unknown[]>);
expectType<[number, number, number]>({} as ExcludeStrict<[number, number] | [number, number, number], {length: 2}>);
expectType<string | string[]>({} as ExcludeStrict<string | string[] | {data: string | string[]}, {data: unknown}>);
