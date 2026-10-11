import {expectTypeOf} from 'nz';
import type {EmptyObject, UnwrapPartial} from '../index.d.ts';

type TestType = {
	a: string;
	b: number;
};

expectTypeOf<UnwrapPartial<Partial<TestType>>>().toBe<TestType>();
expectTypeOf<UnwrapPartial<{a?: string; b?: number}>>().toBe<TestType>();
expectTypeOf<UnwrapPartial<Partial<Partial<TestType>>>>().toBe<Partial<TestType>>();

// `UnwrapPartial` preserves optional properties
type TestTypeWithOptionalProp = TestType & {
	c?: boolean;
};

type AnotherTestType = {
	c: boolean;
	d: 'literal';
};

type TestTypeWithOptionalProps = TestType & Partial<AnotherTestType>;

expectTypeOf<UnwrapPartial<Partial<TestTypeWithOptionalProp>>>().toBe<TestTypeWithOptionalProp>();
expectTypeOf<UnwrapPartial<Partial<TestTypeWithOptionalProps>>>().toBe<TestTypeWithOptionalProps>();

// `UnwrapPartial` preserves nested `Partial` properties
type TestTypeWithPartialProp = TestType & {
	c: Partial<TestType>;
};

expectTypeOf<UnwrapPartial<Partial<TestTypeWithPartialProp>>>().toBe<TestTypeWithPartialProp>();

// `UnwrapPartial` preserves readonly properties
type TestTypeWithReadonlyProps = Readonly<TestType> & {
	readonly c: boolean;
};

expectTypeOf<UnwrapPartial<Partial<TestTypeWithReadonlyProps>>>().toBe<TestTypeWithReadonlyProps>();

// `UnwrapPartial` works with methods
type TestTypeWithMethod = {
	c(): void;
};

expectTypeOf<UnwrapPartial<Partial<TestTypeWithMethod>>>().toBe<TestTypeWithMethod>();

// `UnwrapPartial` works with union types
type PartialUnionType = Partial<TestType> | Partial<AnotherTestType>;

expectTypeOf<UnwrapPartial<PartialUnionType>>().toBe<TestType | AnotherTestType>();
expectTypeOf<UnwrapPartial<Partial<TestType> | AnotherTestType>>().toBe<TestType | AnotherTestType>();

// `UnwrapPartial` works with index signatures
type ArrayLikeTestType = {
	[index: number]: string;
};

type PlainObjectTestType = {
	readonly [key: string]: number | undefined;
};

expectTypeOf<UnwrapPartial<Partial<ArrayLikeTestType>>>().toBe<ArrayLikeTestType>();
expectTypeOf<UnwrapPartial<PlainObjectTestType>>().toBe<PlainObjectTestType>();
expectTypeOf<UnwrapPartial<Partial<Record<number, string>>>>().toBe<Record<number, string>>();
expectTypeOf<UnwrapPartial<Partial<string[]>>>().toBe<string[]>();
expectTypeOf<UnwrapPartial<Array<string | undefined>>>().toBe<Array<string | undefined>>();

// `UnwrapPartial` works with tuples
type TestTuple = [string, number, boolean];

expectTypeOf<UnwrapPartial<Partial<TestTuple>>>().toBe<TestTuple>();
expectTypeOf<UnwrapPartial<[string?, number?, boolean?]>>().toBe<TestTuple>();

// `UnwrapPartial` works with empty objects and unknown types
expectTypeOf<UnwrapPartial<Partial<EmptyObject>>>().toBe<EmptyObject>();
expectTypeOf<UnwrapPartial<Partial<unknown>>>().toBe<unknown>();
expectTypeOf<UnwrapPartial<Partial<any>>>().toBe<any>();
expectTypeOf<UnwrapPartial<never>>().toBe<never>();
expectTypeOf<UnwrapPartial<Partial<Record<string, unknown>>>>().toBe<Record<string, unknown>>();
expectTypeOf<UnwrapPartial<Partial<Record<string, any>>>>().toBe<Record<string, any>>();

// `UnwrapPartial` has no effect on non-partial types
expectTypeOf<UnwrapPartial<TestType>>().toBe<TestType>();

// Known limitation: a numeric or symbol index signature cannot be reversed through `Partial<infer T>`, so the inferred object type is `unknown`. See the note in the docs.
declare const numericIndex: UnwrapPartial<{[index: number]: string | undefined}>;
expectTypeOf(numericIndex).toBe<unknown>();
