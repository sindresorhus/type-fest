import {expectTypeOf} from 'nz';
import type {ExcludeStrict} from '../source/exclude-strict.d.ts';

// Primitive union tests

type ShirtSize = 'xxxl' | 'xxl' | 'xl' | 'l' | 'm' | 's' | 'xs' | 'xxs';
type LargeShirtSize = 'xxxl' | 'xxl' | 'xl' | 'l';
type SmallShirtSize = 's' | 'xs' | 'xxs';

declare const nonLargeShirtSizes: ExcludeStrict<ShirtSize, LargeShirtSize>;
expectTypeOf(nonLargeShirtSizes).toBe<'m' | SmallShirtSize>();

declare const nonSmallShirtSizes: ExcludeStrict<ShirtSize, SmallShirtSize>;
expectTypeOf(nonSmallShirtSizes).toBe<LargeShirtSize | 'm'>();

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

expectTypeOf<ExcludeStrict<Foobar, {a: string}>>().toBe<never>();
expectTypeOf<ExcludeStrict<Foobar, {kind: 'foo'}>>().toBe<Bar>();
expectTypeOf<ExcludeStrict<Foobar, {b: string}>>().toBe<Bar>();
expectTypeOf<ExcludeStrict<Foobar, {c: boolean}>>().toBe<Foo>();
expectTypeOf<ExcludeStrict<Foobar, {b: string} | {c: boolean}>>().toBe<never>();

// @ts-expect-error
declare const invalidLoneField: ExcludeStrict<Foobar, {d: string}>;

// @ts-expect-error
declare const invalidMixedFields: ExcludeStrict<Foobar, {kind: 'foo'; d: string}>;

// @ts-expect-error
declare const undefinedField: ExcludeStrict<Foobar, undefined>;

// Primitives
expectTypeOf<ExcludeStrict<string | number, string>>().toBe<number>();
expectTypeOf<ExcludeStrict<string | number | bigint, number | bigint>>().toBe<string>();
expectTypeOf<ExcludeStrict<'foo' | 'bar' | 'baz', `b${string}`>>().toBe<'foo'>();

// @ts-expect-error
type invalid1 = ExcludeStrict<string | number | boolean, number | bigint>;
// @ts-expect-error
type invalid2 = ExcludeStrict<string, Uppercase<string>>;

// Optional and readonly modifiers
expectTypeOf<ExcludeStrict<{a: string; b: number}, {a?: string}>>().toBe<never>();
expectTypeOf<ExcludeStrict<{a: string; b: number} | {c: string; d: number}, {a?: string}>>().toBe<{c: string; d: number}>();
expectTypeOf<ExcludeStrict<string[], readonly string[]>>().toBe<never>();

// @ts-expect-error
type invalid3 = ExcludeStrict<{a?: string; b: number}, {a: string}>;
// @ts-expect-error
type invalid4 = ExcludeStrict<readonly string[], string[]>;

// Index signatures
expectTypeOf<ExcludeStrict<{a: string; b: number} | {c: true; d: false}, Record<string, boolean>>>().toBe<{a: string; b: number}>();

// @ts-expect-error
type invalid5 = ExcludeStrict<{a: string; b: number} | {c: true; d: false}, Record<string, string>>;

// `any` and `never`
expectTypeOf<ExcludeStrict<string | string[] | {a: string; b: number}, any>>().toBe<never>();
expectTypeOf<ExcludeStrict<string | string[] | {a: string; b: number}, never>>().toBe<string | string[] | {a: string; b: number}>();

// Miscellaneous
expectTypeOf<ExcludeStrict<[number, number] | {x: number; y: number}, unknown[]>>().toBe<{x: number; y: number}>();
expectTypeOf<ExcludeStrict<[number, number] | [number, number, number], {length: 2}>>().toBe<[number, number, number]>();
expectTypeOf<ExcludeStrict<string | string[] | {data: string | string[]}, {data: unknown}>>().toBe<string | string[]>();

// Matching union members are removed even when the remainder is their structural supertype.
type BasicEntry = {id: string};
type DetailedEntry = {id: string; details: string};
type OptionalEntry = {id: string; details?: string};
expectTypeOf<ExcludeStrict<BasicEntry | DetailedEntry, {details: string}>>().toBe<BasicEntry>();
expectTypeOf<ExcludeStrict<OptionalEntry | DetailedEntry, {details: string}>>().toBe<OptionalEntry>();
expectTypeOf<ExcludeStrict<readonly string[] | readonly [string, string], readonly [string, string]>>().toBe<readonly string[]>();

// The matching-member check follows Extract even when the source is `any`.
expectTypeOf<ExcludeStrict<any, string>>().toBe<any>();
expectTypeOf<ExcludeStrict<unknown, unknown>>().toBe<never>();
expectTypeOf<ExcludeStrict<never, never>>().toBe<never>();
// @ts-expect-error An unknown source does not extend a specific selector.
type UnknownSource = ExcludeStrict<unknown, string>;
// @ts-expect-error A source with no members cannot match a nonempty selector.
type EmptySource = ExcludeStrict<never, string>;
// @ts-expect-error Every selector must match, including when another removes an overlapping member.
type PartiallyMatchingOverlap = ExcludeStrict<BasicEntry | DetailedEntry, {details: string} | {missing: true}>;

function retainBasic<const Value>(id: Value): ExcludeStrict<{id: Value} | {id: Value; details: string}, {details: string}> {
	return {id};
}

function readBasic<Value>(entry: ExcludeStrict<{id: Value} | {id: Value; details: string}, {details: string}>): Value {
	return entry.id;
}

const retainedBasic = retainBasic({name: 'Jane', enabled: true});
expectTypeOf(readBasic(retainedBasic)).toBe<{readonly name: 'Jane'; readonly enabled: true}>();
// @ts-expect-error The retained member keeps its inferred value type.
const invalidRetainedBasic: typeof retainedBasic = {id: {name: 'John', enabled: true}};

type ReadonlyBasicEntry = ExcludeStrict<{readonly id: string} | {readonly id: string; details: string}, {details: string}>;
declare const readonlyBasicEntry: ReadonlyBasicEntry;
// @ts-expect-error A valid replacement value cannot be written to a readonly member.
readonlyBasicEntry.id = 'replacement';
