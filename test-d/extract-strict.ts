import {expectType} from 'tsd';
import type {ExtractStrict} from '../source/extract-strict.d.ts';

// Primitive union tests

type ShirtSize = 'xxxl' | 'xxl' | 'xl' | 'l' | 'm' | 's' | 'xs' | 'xxs';
type LargeShirtSize = 'xxxl' | 'xxl' | 'xl' | 'l';
type SmallShirtSize = 's' | 'xs' | 'xxs';

declare const largeShirtSizes: ExtractStrict<ShirtSize, LargeShirtSize>;
expectType<LargeShirtSize>(largeShirtSizes);

declare const smallShirtSizes: ExtractStrict<ShirtSize, SmallShirtSize>;
expectType<SmallShirtSize>(smallShirtSizes);

// @ts-expect-error
declare const allInvalidShirtSizes: ExtractStrict<ShirtSize, 'skyscraper-large' | 'atom-small'>;

// @ts-expect-error
declare const someInvalidShirtSizes: ExtractStrict<ShirtSize, 'm' | 'atom-small'>;

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

declare const foobarByA: ExtractStrict<Foobar, {a: string}>;
expectType<Foobar>(foobarByA);

declare const onlyFooByKind: ExtractStrict<Foobar, {kind: 'foo'}>;
expectType<Foo>(onlyFooByKind);

declare const onlyFooByB: ExtractStrict<Foobar, {b: string}>;
expectType<Foo>(onlyFooByB);

declare const onlyBarByC: ExtractStrict<Foobar, {c: boolean}>;
expectType<Bar>(onlyBarByC);

declare const foobarByUnionBC: ExtractStrict<Foobar, {b: string} | {c: boolean}>;
expectType<Foobar>(foobarByUnionBC);

// @ts-expect-error
declare const invalidLoneField: ExtractStrict<Foobar, {d: string}>;

// @ts-expect-error
declare const invalidMixedFields: ExtractStrict<Foobar, {kind: 'foo'; d: string}>;

// @ts-expect-error
declare const undefinedField: ExtractStrict<Foobar, undefined>;

// Primitives
expectType<number>({} as ExtractStrict<string | number, number>);
expectType<number | bigint>({} as ExtractStrict<string | number | bigint, number | bigint>);
expectType<'bar' | 'baz'>({} as ExtractStrict<'foo' | 'bar' | 'baz', `b${string}`>);

// @ts-expect-error
type invalid1 = ExtractStrict<string | number | boolean, number | bigint>;
// @ts-expect-error
type invalid2 = ExtractStrict<string, Uppercase<string>>;

// Optional and readonly modifiers
expectType<{a: string; b: number}>({} as ExtractStrict<{a: string; b: number}, {a?: string}>);
expectType<string[]>({} as ExtractStrict<string[], readonly string[]>);

// @ts-expect-error
type invalid3 = ExtractStrict<{a?: string; b: number}, {a: string}>;
// @ts-expect-error
type invalid4 = ExtractStrict<readonly string[], string[]>;

// Index signatures
expectType<{c: true; d: false}>(
	{} as ExtractStrict<{a: string; b: number} | {c: true; d: false}, Record<string, boolean>>,
);

// @ts-expect-error
type invalid5 = ExtractStrict<{a: string; b: number} | {c: true; d: false}, Record<string, string>>;

// `any` and `never`
expectType<string | {a: string; b: number} | string[]>(
	{} as ExtractStrict<string | {a: string; b: number} | string[], any>,
);
expectType<never>(
	{} as ExtractStrict<string | {a: string; b: number} | string[], never>,
);

// Miscellaneous
expectType<[number, number]>({} as ExtractStrict<[number, number] | {x: number; y: number}, unknown[]>);
expectType<[number, number]>({} as ExtractStrict<[number, number] | [number, number, number], {length: 2}>);
expectType<{data: string | string[]}>({} as ExtractStrict<string | string[] | {data: string | string[]}, {data: unknown}>);
