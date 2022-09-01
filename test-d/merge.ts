import {expectAssignable, expectError} from 'tsd';
import type {Merge} from '../index';

type Foo = {
	a: number;
	b: string;
};

type Bar = {
	b: number;
};

const ab: Merge<Foo, Bar> = {a: 1, b: 2};
expectAssignable<{a: number; b: number}>(ab);

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

expectAssignable<{
	[x: string]: unknown;
	[x: number]: number;
	[x: symbol]: boolean;
	foo: string;
	bar: Date;
	baz: boolean;
}>(fooBar);

declare function setFooBar(fooBar: FooBar): void;

expectError(setFooBar({
	[Symbol(42)]: 'life',
	foo: 'foo',
	bar: new Date(),
	baz: true,
}));
