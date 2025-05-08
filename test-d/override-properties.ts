import {expectType} from 'tsd';
import {expectTypeOf} from 'expect-type';
import type {OverrideProperties} from '../source/override-properties.d.ts';

type Foo = {
	a: number;
	b: string;
};

const fixture: OverrideProperties<Foo, {b: number}> = {a: 1, b: 2};
expectType<{a: number; b: number}>(fixture);

// @ts-expect-error
type Bar = OverrideProperties<Foo, {c: number}>;

// @ts-expect-error
type Bar = OverrideProperties<Foo, {b: number; c: number}>;

// Test for https://github.com/sindresorhus/type-fest/issues/858
{ // eslint-disable-line no-lone-blocks
	type Original = {
		foo: string;
		bar: string;
	};

	type Modified = {
		foo: string | undefined;
		bar: string;
	};

	type Final = OverrideProperties<Original, Modified>;

	expectTypeOf<Final>().toMatchTypeOf<{foo: string | undefined; bar: string}>();
}
