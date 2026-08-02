import {expectType} from 'tsd';
import type {UnwrapRequired} from '../index.d.ts';

type TestType = {
	a?: string;
	b: number;
};

expectType<TestType>({} as UnwrapRequired<Required<TestType>>);

// `UnwrapRequired` preserves optional properties
type AnotherTestType = {
	c?: boolean;
	d?: 'literal';
};

type TestTypeWithOptionalProps = TestType & AnotherTestType;

expectType<TestTypeWithOptionalProps>({} as UnwrapRequired<Required<TestTypeWithOptionalProps>>);

// `UnwrapRequired` preserves nested `Required` properties
type TestTypeWithRequiredProp = TestType & {
	c: Required<AnotherTestType>;
};

expectType<TestTypeWithRequiredProp>({} as UnwrapRequired<Required<TestTypeWithRequiredProp>>);

// `UnwrapRequired` preserves readonly properties
type TestTypeWithReadonlyProps = {
	readonly a?: string;
	readonly b: number;
	readonly c?: boolean;
};

expectType<TestTypeWithReadonlyProps>({} as UnwrapRequired<Required<TestTypeWithReadonlyProps>>);

// `UnwrapRequired` works with methods
type TestTypeWithMethod = {
	a?: string;
	c?(): void;
};

expectType<TestTypeWithMethod>({} as UnwrapRequired<Required<TestTypeWithMethod>>);

// `UnwrapRequired` works with union types
type RequiredUnionType = Required<TestType> | Required<AnotherTestType>;

expectType<TestType | AnotherTestType>({} as UnwrapRequired<RequiredUnionType>);
expectType<TestType | AnotherTestType>({} as UnwrapRequired<Required<TestType> | AnotherTestType>);
expectType<TestType | string>({} as UnwrapRequired<Required<TestType> | string>);
expectType<TestType | Map<string, string>>({} as UnwrapRequired<Required<TestType> | Map<string, string>>);
expectType<TestType | Map<string, string> | string>({} as UnwrapRequired<Required<TestType> | Map<string, string> | string>);

// `UnwrapRequired` works with unknown types
expectType<unknown>({} as UnwrapRequired<Required<unknown>>);
expectType<any>({} as UnwrapRequired<Required<any>>);

// `UnwrapRequired` has no effect on non-required types
expectType<TestType>({} as UnwrapRequired<TestType>);
expectType<{a: string; b: number}>({} as UnwrapRequired<{a: string; b: number}>);
expectType<readonly string[]>({} as UnwrapRequired<readonly string[]>);
expectType<readonly [string, number?]>({} as UnwrapRequired<readonly [string, number?]>);
expectType<Set<string>>({} as UnwrapRequired<Set<string>>);
expectType<ReadonlySet<string>>({} as UnwrapRequired<ReadonlySet<string>>);
expectType<WeakSet<{a: string}>>({} as UnwrapRequired<WeakSet<{a: string}>>);
expectType<Map<string, string>>({} as UnwrapRequired<Map<string, string>>);
expectType<ReadonlyMap<string, string>>({} as UnwrapRequired<ReadonlyMap<string, string>>);
expectType<WeakMap<{a: string}, string>>({} as UnwrapRequired<WeakMap<{a: string}, string>>);
expectType<Date>({} as UnwrapRequired<Date>);
expectType<RegExp>({} as UnwrapRequired<RegExp>);
expectType<Promise<string>>({} as UnwrapRequired<Promise<string>>);
expectType<string>({} as UnwrapRequired<string>);
expectType<() => string>({} as UnwrapRequired<() => string>);
