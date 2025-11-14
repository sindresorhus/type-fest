import {expectNever, expectType} from 'tsd';
import type {EmptyObject, UnwrapPartial} from '../index.d.ts';

type TestType = {
	a: string;
	b: number;
};

expectType<TestType>({} as UnwrapPartial<Partial<TestType>>);
expectType<TestType>({} as UnwrapPartial<{a?: string; b?: number}>);
expectType<Partial<TestType>>({} as UnwrapPartial<Partial<Partial<TestType>>>);

expectNever({} as UnwrapPartial<TestType>);
expectNever({} as UnwrapPartial<UnwrapPartial<Partial<TestType>>>);

expectNever({} as UnwrapPartial<string>);
expectNever({} as UnwrapPartial<number>);
expectNever({} as UnwrapPartial<boolean>);
expectNever({} as UnwrapPartial<'literal'>);
expectNever({} as UnwrapPartial<() => void>);
expectNever({} as UnwrapPartial<null>);
expectNever({} as UnwrapPartial<undefined>);

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
expectNever({} as UnwrapPartial<TestTypeWithOptionalProp>);
expectNever({} as UnwrapPartial<TestTypeWithOptionalProps>);

// `UnwrapPartial` preserves nested `Partial` properties
type TestTypeWithPartialProp = TestType & {
	c: Partial<TestType>;
};

expectType<TestTypeWithPartialProp>({} as UnwrapPartial<Partial<TestTypeWithPartialProp>>);
expectNever({} as UnwrapPartial<TestTypeWithPartialProp>);

// `UnwrapPartial` preserves readonly properties
type TestTypeWithReadonlyProps = Readonly<TestType> & {
	readonly c: boolean;
};

expectType<TestTypeWithReadonlyProps>({} as UnwrapPartial<Partial<TestTypeWithReadonlyProps>>);
expectNever({} as UnwrapPartial<TestTypeWithReadonlyProps>);

// `UnwrapPartial` works with methods
type TestTypeWithMethod = {
	c(): void;
};

expectType<TestTypeWithMethod>({} as UnwrapPartial<Partial<TestTypeWithMethod>>);
expectNever({} as UnwrapPartial<TestTypeWithMethod>);

// `UnwrapPartial` works with union types
type PartialUnionType = Partial<TestType> | Partial<AnotherTestType>;

expectType<TestType | AnotherTestType>({} as UnwrapPartial<PartialUnionType>);
expectType<TestType>({} as UnwrapPartial<{a?: string; b?: number} | {c: boolean; d: 'literal'}>);
expectNever({} as UnwrapPartial<TestType | AnotherTestType>);

// `UnwrapPartial` works with index signatures
type ArrayLikeTestType = {
	[index: number]: string;
};

expectType<ArrayLikeTestType>({} as UnwrapPartial<Partial<ArrayLikeTestType>>);
expectType<Record<number, string>>({} as UnwrapPartial<Partial<Record<number, string>>>);
expectType<string[]>({} as UnwrapPartial<Partial<string[]>>);

// `UnwrapPartial` works with tuples
type TestTuple = [string, number, boolean];

expectType<TestTuple>({} as UnwrapPartial<Partial<TestTuple>>);
expectType<TestTuple>({} as UnwrapPartial<[string?, number?, boolean?]>);
expectNever({} as UnwrapPartial<TestTuple>);

// `UnwrapPartial` works with empty objects and unknown types
expectType<EmptyObject>({} as UnwrapPartial<Partial<EmptyObject>>);
expectType<unknown>({} as UnwrapPartial<Partial<unknown>>);
expectType<any>({} as UnwrapPartial<Partial<any>>);
expectType<Record<string, unknown>>({} as UnwrapPartial<Partial<Record<string, unknown>>>);
expectType<Record<string, any>>({} as UnwrapPartial<Partial<Record<string, any>>>);
