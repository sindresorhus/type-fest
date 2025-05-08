import {expectAssignable, expectNotAssignable} from 'tsd';
import type {InvariantOf} from '../index.d.ts';

type FooBar = InvariantOf<{
	foo: number;
	bar: string;
}>;

type FooBarBaz = InvariantOf<{
	foo: number;
	bar: string;
	baz: boolean;
}>;

// We make an explicit cast so we can test the value.
const fooBar: FooBar = {foo: 123, bar: 'hello'} as FooBar; // eslint-disable-line @typescript-eslint/consistent-type-assertions
const fooBarBaz: FooBarBaz = {foo: 123, bar: 'hello', baz: true} as FooBarBaz; // eslint-disable-line @typescript-eslint/consistent-type-assertions

// The invariantOf<Type> is assignable to Type.
expectAssignable<{
	foo: number;
	bar: string;
}>(fooBar);

expectNotAssignable<FooBarBaz>(fooBar); // Invariance does not accept supertypes.
expectNotAssignable<FooBar>(fooBarBaz); // Invariance does not accept subtypes.
