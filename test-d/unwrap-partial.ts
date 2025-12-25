import {expectType} from 'tsd';
import type {EmptyObject, UnwrapPartial} from '../index.d.ts';

type TestType = {
	a: string;
	b: number;
};

expectType<TestType>({} as UnwrapPartial<Partial<TestType>>);
expectType<TestType>({} as UnwrapPartial<{a?: string; b?: number}>);
expectType<Partial<TestType>>({} as UnwrapPartial<Partial<Partial<TestType>>>);

// `UnwrapPartial` preserves optional properties
type TestTypeWithOptionalProp = TestType & {
	c?: boolean;
};

type AnotherTestType = {
	c: boolean;
	d: 'literal';
};

type TestTypeWithOptionalProps = TestType & Partial<AnotherTestType>;

expectType<TestTypeWithOptionalProp>({} as UnwrapPartial<Partial<TestTypeWithOptionalProp>>);
expectType<TestTypeWithOptionalProps>({} as UnwrapPartial<Partial<TestTypeWithOptionalProps>>);

// `UnwrapPartial` preserves nested `Partial` properties
type TestTypeWithPartialProp = TestType & {
	c: Partial<TestType>;
};

expectType<TestTypeWithPartialProp>({} as UnwrapPartial<Partial<TestTypeWithPartialProp>>);

// `UnwrapPartial` preserves readonly properties
type TestTypeWithReadonlyProps = Readonly<TestType> & {
	readonly c: boolean;
};

expectType<TestTypeWithReadonlyProps>({} as UnwrapPartial<Partial<TestTypeWithReadonlyProps>>);

// `UnwrapPartial` works with methods
type TestTypeWithMethod = {
	c(): void;
};

expectType<TestTypeWithMethod>({} as UnwrapPartial<Partial<TestTypeWithMethod>>);

// `UnwrapPartial` works with union types
type PartialUnionType = Partial<TestType> | Partial<AnotherTestType>;

expectType<TestType | AnotherTestType>({} as UnwrapPartial<PartialUnionType>);
expectType<TestType | AnotherTestType>({} as UnwrapPartial<Partial<TestType> | AnotherTestType>);

// `UnwrapPartial` works with index signatures
type ArrayLikeTestType = {
	[index: number]: string;
};

type PlainObjectTestType = {
	readonly [key: string]: number | undefined;
};

expectType<ArrayLikeTestType>({} as UnwrapPartial<Partial<ArrayLikeTestType>>);
expectType<PlainObjectTestType>({} as UnwrapPartial<PlainObjectTestType>);
expectType<Record<number, string>>({} as UnwrapPartial<Partial<Record<number, string>>>);
expectType<string[]>({} as UnwrapPartial<Partial<string[]>>);
expectType<Array<string | undefined>>({} as UnwrapPartial<Array<string | undefined>>);

// `UnwrapPartial` works with tuples
type TestTuple = [string, number, boolean];

expectType<TestTuple>({} as UnwrapPartial<Partial<TestTuple>>);
expectType<TestTuple>({} as UnwrapPartial<[string?, number?, boolean?]>);

// `UnwrapPartial` works with empty objects and unknown types
expectType<EmptyObject>({} as UnwrapPartial<Partial<EmptyObject>>);
expectType<unknown>({} as UnwrapPartial<Partial<unknown>>);
expectType<any>({} as UnwrapPartial<Partial<any>>);
expectType<never>({} as UnwrapPartial<never>);
expectType<Record<string, unknown>>({} as UnwrapPartial<Partial<Record<string, unknown>>>);
expectType<Record<string, any>>({} as UnwrapPartial<Partial<Record<string, any>>>);

// `UnwrapPartial` has no effect on non-partial types
expectType<TestType>({} as UnwrapPartial<TestType>);
