import {expectType} from 'tsd';
import type {Merge} from '../index.d.ts';

type Foo = {
	a: number;
	b: string;
};

type Bar = {
	b: number;
};

const ab: Merge<Foo, Bar> = {a: 1, b: 2};
expectType<{a: number; b: number}>(ab);

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface FooInterface {
	[x: string]: unknown;
	[x: number]: unknown;
	foo: string;
	bar: symbol;
}

type BarType = {
	[x: number]: number;
	[x: symbol]: boolean;
	bar: Date;
	baz: boolean;
};

type FooBar = Merge<FooInterface, BarType>;

const fooBar: FooBar = {
	'foo-string': 'foo',
	42: 24,
	[Symbol(42)]: true,
	foo: 'foo',
	bar: new Date(),
	baz: true,
};

expectType<{
	[x: string]: unknown;
	[x: number]: number;
	[x: symbol]: boolean;
	foo: string;
	bar: Date;
	baz: boolean;
}>(fooBar);

declare function setFooBar(fooBar: FooBar): void;

// @ts-expect-error
setFooBar({
	[Symbol(42)]: 'life',
	foo: 'foo',
	bar: new Date(),
	baz: true,
});

// Checks that a property can be replaced by another property that is not of the same type. This issue was encountered in `MergeDeep' with the default options.
type FooDefaultOptions = {
	stripUndefinedValues: false;
};

type FooOptions = Merge<FooDefaultOptions, {stripUndefinedValues: true}>;

expectType<FooOptions>({stripUndefinedValues: true});

// Test that optional keys are enforced.
type FooWithOptionaKeys = {
	[x: string]: unknown;
	[x: number]: unknown;
	a: string;
	b?: string;
	c: undefined;
	d: string;
	e: number | undefined;
};

type BarWithOptionaKeys = {
	[x: number]: number;
	[x: symbol]: boolean;
	a?: string;
	b: string;
	d?: string;
	f: number | undefined;
	g: undefined;
};

type FooBarWithOptionalKeys = Merge<FooWithOptionaKeys, BarWithOptionaKeys>;

declare const fooBarWithOptionalKeys: FooBarWithOptionalKeys;

// Note that `c` and `g` is not marked as optional and this is deliberate, as this is the behaviour expected by the older version of Merge. This may change in a later version.
expectType<{
	[x: number]: number;
	[x: symbol]: boolean;
	[x: string]: unknown;
	b: string;
	c: undefined;
	a?: string;
	d?: string;
	e: number | undefined;
	f: number | undefined;
	g: undefined;
}>(fooBarWithOptionalKeys);

// Checks that an indexed key type can be overwritten.
type FooWithIndexSignature = {
	[x: string]: unknown;
	[x: number]: boolean;
	[x: symbol]: number;
	foo: boolean;
	fooBar: boolean;
};

type BarWithIndexSignatureOverwrite = {
	[x: string]: number | string | boolean;
	[x: number]: number | string;
	[x: symbol]: symbol;
	bar: string;
	fooBar: string;
};

type FooBarWithIndexSignature = Merge<FooWithIndexSignature, BarWithIndexSignatureOverwrite>;

declare const fooBarWithIndexSignature: FooBarWithIndexSignature;

expectType<{
	[x: string]: string | number | boolean;
	[x: number]: string | number;
	[x: symbol]: symbol;
	foo: boolean;
	bar: string;
	fooBar: string;
}>(fooBarWithIndexSignature);

declare const destinationWithAny: Merge<{foo?: any}, {bar: true}>;

expectType<{
	foo?: any;
	bar: true;
}>(destinationWithAny);

declare const sourceWithAny: Merge<{foo: true}, {bar?: any}>;

expectType<{
	foo: true;
	bar?: any;
}>(sourceWithAny);

// Test for issue https://github.com/sindresorhus/type-fest/issues/601
type Baz = {
	t1?: number;
	t2?: number;
	t3?: number;
	t4?: number;
};
declare const baz: Merge<Pick<Baz, 't2' | 't4'>, {
	list: string[];
}>;
expectType<{
	t2?: number;
	t4?: number;
	list: string[];
}>(baz);
