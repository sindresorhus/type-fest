import {expectType} from 'tsd';
import type {DistributedPick} from '../index.d.ts';

// When passing a non-union type, and
// picking keys that are present in the type.
// It behaves exactly like `Pick`.

type Example1 = {
	a: number;
	b: string;
};

type Actual1 = DistributedPick<Example1, 'a'>;
type Actual2 = DistributedPick<Example1, 'b'>;
type Actual3 = DistributedPick<Example1, 'a' | 'b'>;

type Expected1 = Pick<Example1, 'a'>;
type Expected2 = Pick<Example1, 'b'>;
type Expected3 = Pick<Example1, 'a' | 'b'>;

declare const expected1: Expected1;
declare const expected2: Expected2;
declare const expected3: Expected3;

expectType<Actual1>(expected1);
expectType<Actual2>(expected2);
expectType<Actual3>(expected3);

// When passing a non-union type, and
// picking keys that are NOT present in the type.
// It behaves exactly like `Pick`, by not letting you
// pick keys that are not present in the type.

type Example2 = {
	a: number;
	b: string;
};

// @ts-expect-error
type Actual4 = DistributedPick<Example2, 'c'>;

// When passing a union type, and
// picking keys that are present in some union members.
// It lets you pick keys that are present in some union members,
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

type PickedUnion = DistributedPick<Union, 'discriminant' | 'a' | 'b' | 'c'>;

declare const pickedUnion: PickedUnion;

if (pickedUnion.discriminant === 'A') {
	expectType<{discriminant: 'A'; a: number}>(pickedUnion);
	// @ts-expect-error
	const _foo = pickedUnion.foo; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
	// @ts-expect-error
	const _bar = pickedUnion.bar; // eslint-disable-line @typescript-eslint/no-unsafe-assignment
}

// Preserves property modifiers
declare const test1: DistributedPick<{readonly 'a': 1; 'b'?: 2; readonly 'c'?: 3}, 'a' | 'b' | 'c'>;
expectType<{readonly 'a': 1; 'b'?: 2; readonly 'c'?: 3}>(test1);

declare const test2: DistributedPick<{readonly 'a': 1; 'b'?: 2} | {readonly 'c'?: 3}, 'a' | 'b' | 'c'>;
expectType<{readonly 'a': 1; 'b'?: 2} | {readonly 'c'?: 3}>(test2);

// Works with index signatures
declare const test4: DistributedPick<{[k: string]: unknown; a?: number; b: string}, 'a' | 'b'>;
expectType<{a?: number; b: string}>(test4);
