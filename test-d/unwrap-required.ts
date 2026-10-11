import {expectTypeOf} from 'nz';
import type {UnwrapRequired} from '../index.d.ts';

type TestType = {
	a?: string;
	b: number;
};

expectTypeOf<UnwrapRequired<Required<TestType>>>().toBe<TestType>();

// `UnwrapRequired` preserves optional properties
type AnotherTestType = {
	c?: boolean;
	d?: 'literal';
};

type TestTypeWithOptionalProps = TestType & AnotherTestType;

expectTypeOf<UnwrapRequired<Required<TestTypeWithOptionalProps>>>().toBe<TestTypeWithOptionalProps>();

// `UnwrapRequired` preserves nested `Required` properties
type TestTypeWithRequiredProp = TestType & {
	c: Required<AnotherTestType>;
};

expectTypeOf<UnwrapRequired<Required<TestTypeWithRequiredProp>>>().toBe<TestTypeWithRequiredProp>();

// `UnwrapRequired` preserves readonly properties
type TestTypeWithReadonlyProps = {
	readonly a?: string;
	readonly b: number;
	readonly c?: boolean;
};

expectTypeOf<UnwrapRequired<Required<TestTypeWithReadonlyProps>>>().toBe<TestTypeWithReadonlyProps>();

// `UnwrapRequired` works with methods
type TestTypeWithMethod = {
	a?: string;
	c?(): void;
};

expectTypeOf<UnwrapRequired<Required<TestTypeWithMethod>>>().toBe<TestTypeWithMethod>();

// `UnwrapRequired` works with union types
type RequiredUnionType = Required<TestType> | Required<AnotherTestType>;

expectTypeOf<UnwrapRequired<RequiredUnionType>>().toBe<TestType | AnotherTestType>();
expectTypeOf<UnwrapRequired<Required<TestType> | AnotherTestType>>().toBe<TestType | AnotherTestType>();
expectTypeOf<UnwrapRequired<Required<TestType> | string>>().toBe<TestType | string>();
expectTypeOf<UnwrapRequired<Required<TestType> | Map<string, string>>>().toBe<TestType | Map<string, string>>();
expectTypeOf<UnwrapRequired<Required<TestType> | Map<string, string> | string>>().toBe<TestType | Map<string, string> | string>();

// `UnwrapRequired` works with unknown types
expectTypeOf<UnwrapRequired<Required<unknown>>>().toBe<unknown>();
expectTypeOf<UnwrapRequired<Required<any>>>().toBe<any>();

// `UnwrapRequired` has no effect on non-required types
expectTypeOf<UnwrapRequired<TestType>>().toBe<TestType>();
expectTypeOf<UnwrapRequired<{a: string; b: number}>>().toBe<{a: string; b: number}>();
expectTypeOf<UnwrapRequired<readonly string[]>>().toBe<readonly string[]>();
expectTypeOf<UnwrapRequired<readonly [string, number?]>>().toBe<readonly [string, number?]>();
expectTypeOf<UnwrapRequired<Set<string>>>().toBe<Set<string>>();
expectTypeOf<UnwrapRequired<ReadonlySet<string>>>().toBe<ReadonlySet<string>>();
expectTypeOf<UnwrapRequired<WeakSet<{a: string}>>>().toBe<WeakSet<{a: string}>>();
expectTypeOf<UnwrapRequired<Map<string, string>>>().toBe<Map<string, string>>();
expectTypeOf<UnwrapRequired<ReadonlyMap<string, string>>>().toBe<ReadonlyMap<string, string>>();
expectTypeOf<UnwrapRequired<WeakMap<{a: string}, string>>>().toBe<WeakMap<{a: string}, string>>();
expectTypeOf<UnwrapRequired<Date>>().toBe<Date>();
expectTypeOf<UnwrapRequired<RegExp>>().toBe<RegExp>();
expectTypeOf<UnwrapRequired<Promise<string>>>().toBe<Promise<string>>();
expectTypeOf<UnwrapRequired<string>>().toBe<string>();
expectTypeOf<UnwrapRequired<() => string>>().toBe<() => string>();

// Known limitation: a numeric or symbol index signature cannot be reversed through `Required<infer T>`, so the inferred object type is `unknown` and the index signature is lost. See the note in the docs.
declare const numericIndex: UnwrapRequired<{[index: number]: string}>;
expectTypeOf(numericIndex).toBe<unknown>();
