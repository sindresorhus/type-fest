import {expectTypeOf} from 'nz';
import type {OverrideProperties} from '../source/override-properties.d.ts';

type Foo = {
	a: number;
	b: string;
};

const fixture: OverrideProperties<Foo, {b: number}> = {a: 1, b: 2};
expectTypeOf(fixture).toBe<{a: number; b: number}>();

// @ts-expect-error
type Bar1 = OverrideProperties<Foo, {c: number}>;

// @ts-expect-error
type Bar2 = OverrideProperties<Foo, {b: number; c: number}>;

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

	expectTypeOf<Final>().toBeAssignableTo<{foo: string | undefined; bar: string}>();
}

// Test for https://github.com/sindresorhus/type-fest/issues/969
{ // eslint-disable-line no-lone-blocks
	type Callable = {
		(value: string): number;
		property: number;
	};

	expectTypeOf<OverrideProperties<Callable, {property: string}>>().toBe<((value: string) => number) & {property: string}>();
}
