import {expectType} from 'tsd';
import type {ExtractStrict} from '../source/extract-strict';

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
expectType<never>(allInvalidShirtSizes);

// @ts-expect-error
declare const someInvalidShirtSizes: ExtractStrict<ShirtSize, 'm' | 'atom-small'>;
expectType<'m'>(someInvalidShirtSizes); // This is how native `Extract` works with primitives

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
expectType<never>(invalidLoneField);

// @ts-expect-error
declare const invalidMixedFields: ExtractStrict<Foobar, {kind: 'foo'; d: string}>;
expectType<never>(invalidMixedFields);

// @ts-expect-error
declare const undefinedField: ExtractStrict<Foobar, undefined>;
expectType<never>(undefinedField);
