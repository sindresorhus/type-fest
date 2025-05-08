import {expectType} from 'tsd';
import type {DistributedOmit, Except} from '../index.d.ts';

// When passing a non-union type, and
// omitting keys that are present in the type.
// It behaves exactly like `Except`.

type Example1 = {
	a: number;
	b: string;
};

type Actual1 = DistributedOmit<Example1, 'a'>;
type Actual2 = DistributedOmit<Example1, 'b'>;
type Actual3 = DistributedOmit<Example1, 'a' | 'b'>;

type Expected1 = Except<Example1, 'a'>;
type Expected2 = Except<Example1, 'b'>;
type Expected3 = Except<Example1, 'a' | 'b'>;

declare const expected1: Expected1;
declare const expected2: Expected2;
declare const expected3: Expected3;

expectType<Actual1>(expected1);
expectType<Actual2>(expected2);
expectType<Actual3>(expected3);

// When passing a non-union type, and
// omitting keys that are NOT present in the type.
// It behaves exactly like `Except`, by not letting you
// omit keys that are not present in the type.

type Example2 = {
	a: number;
	b: string;
};

// @ts-expect-error
type Actual4 = DistributedOmit<Example2, 'c'>;

// When passing a union type, and
// omitting keys that are present in some union members.
// It lets you omit keys that are present in some union members,
// and distributes over the union.

type A = {
	discriminant: 'A';
	foo: string;
	a: number;
};

type B = {
	discriminant: 'B';
	foo: string;
	bar: string;
	b: string;
};

type C = {
	discriminant: 'C';
	bar: string;
	c: boolean;
};

type Union = A | B | C;

type OmittedUnion = DistributedOmit<Union, 'foo' | 'bar'>;

declare const omittedUnion: OmittedUnion;

if (omittedUnion.discriminant === 'A') {
	expectType<{discriminant: 'A'; a: number}>(omittedUnion);
	// @ts-expect-error
	const _a: unknown = omittedUnion.foo;
	// @ts-expect-error
	const _b: unknown = omittedUnion.bar;
}
