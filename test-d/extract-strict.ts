import {expectTypeOf} from 'nz';
import type {ExtractStrict} from '../source/extract-strict.d.ts';

// Primitive union tests

type ShirtSize = 'xxxl' | 'xxl' | 'xl' | 'l' | 'm' | 's' | 'xs' | 'xxs';
type LargeShirtSize = 'xxxl' | 'xxl' | 'xl' | 'l';
type SmallShirtSize = 's' | 'xs' | 'xxs';

declare const largeShirtSizes: ExtractStrict<ShirtSize, LargeShirtSize>;
expectTypeOf(largeShirtSizes).toBe<LargeShirtSize>();

declare const smallShirtSizes: ExtractStrict<ShirtSize, SmallShirtSize>;
expectTypeOf(smallShirtSizes).toBe<SmallShirtSize>();

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
expectTypeOf(foobarByA).toBe<Foobar>();

declare const onlyFooByKind: ExtractStrict<Foobar, {kind: 'foo'}>;
expectTypeOf(onlyFooByKind).toBe<Foo>();

declare const onlyFooByB: ExtractStrict<Foobar, {b: string}>;
expectTypeOf(onlyFooByB).toBe<Foo>();

declare const onlyBarByC: ExtractStrict<Foobar, {c: boolean}>;
expectTypeOf(onlyBarByC).toBe<Bar>();

declare const foobarByUnionBC: ExtractStrict<Foobar, {b: string} | {c: boolean}>;
expectTypeOf(foobarByUnionBC).toBe<Foobar>();

// @ts-expect-error
declare const invalidLoneField: ExtractStrict<Foobar, {d: string}>;

// @ts-expect-error
declare const invalidMixedFields: ExtractStrict<Foobar, {kind: 'foo'; d: string}>;

// @ts-expect-error
declare const undefinedField: ExtractStrict<Foobar, undefined>;

// Primitives
expectTypeOf<ExtractStrict<string | number, number>>().toBe<number>();
expectTypeOf<ExtractStrict<string | number | bigint, number | bigint>>().toBe<number | bigint>();
expectTypeOf<ExtractStrict<'foo' | 'bar' | 'baz', `b${string}`>>().toBe<'bar' | 'baz'>();

// @ts-expect-error
type invalid1 = ExtractStrict<string | number | boolean, number | bigint>;
// @ts-expect-error
type invalid2 = ExtractStrict<string, Uppercase<string>>;

// Optional and readonly modifiers
expectTypeOf<ExtractStrict<{a: string; b: number}, {a?: string}>>().toBe<{a: string; b: number}>();
expectTypeOf<ExtractStrict<string[], readonly string[]>>().toBe<string[]>();

// @ts-expect-error
type invalid3 = ExtractStrict<{a?: string; b: number}, {a: string}>;
// @ts-expect-error
type invalid4 = ExtractStrict<readonly string[], string[]>;

// Index signatures
expectTypeOf<ExtractStrict<{a: string; b: number} | {c: true; d: false}, Record<string, boolean>>>().toBe<{c: true; d: false}>();

// @ts-expect-error
type invalid5 = ExtractStrict<{a: string; b: number} | {c: true; d: false}, Record<string, string>>;

// `any` and `never`
expectTypeOf<ExtractStrict<string | string[] | {a: string; b: number}, any>>().toBe<string | string[] | {a: string; b: number}>();
expectTypeOf<ExtractStrict<string | string[] | {a: string; b: number}, never>>().toBe<never>();

// Miscellaneous
expectTypeOf<ExtractStrict<[number, number] | {x: number; y: number}, unknown[]>>().toBe<[number, number]>();
expectTypeOf<ExtractStrict<[number, number] | [number, number, number], {length: 2}>>().toBe<[number, number]>();
expectTypeOf<ExtractStrict<string | string[] | {data: string | string[]}, {data: unknown}>>().toBe<{data: string | string[]}>();
