import {expectTypeOf} from 'nz';
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
expectTypeOf(fooBar).toBeAssignableTo<{
	foo: number;
	bar: string;
}>();

expectTypeOf(fooBar).not.toBeAssignableTo<FooBarBaz>(); // Invariance does not accept supertypes.
expectTypeOf(fooBarBaz).not.toBeAssignableTo<FooBar>(); // Invariance does not accept subtypes.
