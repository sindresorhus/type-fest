import {expectTypeOf} from 'nz';
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

expectTypeOf(expected1).toBe<Actual1>();
expectTypeOf(expected2).toBe<Actual2>();
expectTypeOf(expected3).toBe<Actual3>();

// When passing a non-union type, and
// omitting keys that are NOT present in the type.
// It behaves exactly like `Omit`, by removing nothing.

type Example2 = {
	a: number;
	b: string;
};

type Actual4 = DistributedOmit<Example2, 'c'>;

expectTypeOf<Actual4>().toBe<Example2>();

// A generic wrapper can omit a key that the wrapped type may not have.
// This is the use-case of https://github.com/sindresorhus/type-fest/issues/866.

type WrapperProps<Props> = DistributedOmit<Props, 'value'>;

expectTypeOf<WrapperProps<{value: number; other: string}>>().toBe<{other: string}>();
expectTypeOf<WrapperProps<{other: string}>>().toBe<{other: string}>();

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
	expectTypeOf(omittedUnion).toBe<{discriminant: 'A'; a: number}>();
	// @ts-expect-error
	const _a: unknown = omittedUnion.foo;
	// @ts-expect-error
	const _b: unknown = omittedUnion.bar;
}

// When passing a union type, and
// omitting a key that no union member has.
// It removes nothing, like `Omit`.

expectTypeOf<DistributedOmit<Union, 'xyz'>>().toBe<Union>();

// A key that is not present can be mixed with keys that are.

expectTypeOf<DistributedOmit<Union, 'foo' | 'xyz'>>().toBe<Omit<A, 'foo'> | Omit<B, 'foo'> | C>();

// Symbol and numeric keys are accepted.

type SymbolKey = {
	[Symbol.iterator]: 1;
	0: 'a';
	b: 2;
};

expectTypeOf<DistributedOmit<SymbolKey, 0 | typeof Symbol.iterator>>().toBe<{b: 2}>();

// An empty key union removes nothing.

expectTypeOf<DistributedOmit<Example2, never>>().toBe<Example2>();

// A key that widens to `string` removes every string key, like `Omit`.

declare const wideKey: string;

expectTypeOf<DistributedOmit<Example2, typeof wideKey>>().toBe<{}>();

// An index signature absorbs the named keys, like it does with `Omit`.

declare const withIndexSignature: DistributedOmit<{[key: string]: unknown; a: number}, 'missing'>;

expectTypeOf(withIndexSignature['a']).toBe<unknown>();

// The key still has to be a property key.
// @ts-expect-error
type ObjectKey = DistributedOmit<Example2, {a: number}>;
// @ts-expect-error
type BooleanKey = DistributedOmit<Example2, boolean>;

// `any` and `unknown` behave like they do with `Omit`, and a `never` type distributes to `never`.

expectTypeOf<DistributedOmit<any, 'a'>>().toBe<Omit<any, 'a'>>();
expectTypeOf<DistributedOmit<unknown, 'a'>>().toBe<{}>();
expectTypeOf<DistributedOmit<never, 'a'>>().toBe<never>();
