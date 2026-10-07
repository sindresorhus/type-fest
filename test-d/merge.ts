import {expectType} from 'tsd';
import type {Merge} from '../index.d.ts';

type Foo = {
	a: number;
	b: string;
};

type Bar = {
	b: number;
};

const ab: Merge<Foo, Bar> = {a: 1, b: 2};
expectType<{a: number; b: number}>(ab);

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface FooInterface {
	[x: string]: unknown;
	[x: number]: unknown;
	foo: string;
	bar: symbol;
}

type BarType = {
	[x: number]: number;
	[x: symbol]: boolean;
	bar: Date;
	baz: boolean;
};

type FooBar = Merge<FooInterface, BarType>;

const fooBar: FooBar = {
	'foo-string': 'foo',
	42: 24,
	[Symbol(42)]: true,
	foo: 'foo',
	bar: new Date(),
	baz: true,
};

expectType<{
	[x: string]: unknown;
	[x: number]: number;
	[x: symbol]: boolean;
	foo: string;
	bar: Date;
	baz: boolean;
}>(fooBar);

declare function setFooBar(fooBar: FooBar): void;

// @ts-expect-error
setFooBar({
	[Symbol(42)]: 'life',
	foo: 'foo',
	bar: new Date(),
	baz: true,
});

// Checks that a property can be replaced by another property that is not of the same type. This issue was encountered in `MergeDeep' with the default options.
type FooDefaultOptions = {
	stripUndefinedValues: false;
};

type FooOptions = Merge<FooDefaultOptions, {stripUndefinedValues: true}>;

expectType<FooOptions>({stripUndefinedValues: true});

// Test that optional keys are enforced.
type FooWithOptionaKeys = {
	[x: string]: unknown;
	[x: number]: unknown;
	a: string;
	b?: string;
	c: undefined;
	d: string;
	e: number | undefined;
};

type BarWithOptionaKeys = {
	[x: number]: number;
	[x: symbol]: boolean;
	a?: string;
	b: string;
	d?: string;
	f: number | undefined;
	g: undefined;
};

type FooBarWithOptionalKeys = Merge<FooWithOptionaKeys, BarWithOptionaKeys>;

declare const fooBarWithOptionalKeys: FooBarWithOptionalKeys;

// Note that `c` and `g` is not marked as optional and this is deliberate, as this is the behaviour expected by the older version of Merge. This may change in a later version.
expectType<{
	[x: number]: number;
	[x: symbol]: boolean;
	[x: string]: unknown;
	b: string;
	c: undefined;
	a?: string;
	d?: string;
	e: number | undefined;
	f: number | undefined;
	g: undefined;
}>(fooBarWithOptionalKeys);

// Checks that an indexed key type can be overwritten.
type FooWithIndexSignature = {
	[x: string]: unknown;
	[x: number]: boolean;
	[x: symbol]: number;
	foo: boolean;
	fooBar: boolean;
};

type BarWithIndexSignatureOverwrite = {
	[x: string]: number | string | boolean;
	[x: number]: number | string;
	[x: symbol]: symbol;
	bar: string;
	fooBar: string;
};

type FooBarWithIndexSignature = Merge<FooWithIndexSignature, BarWithIndexSignatureOverwrite>;

declare const fooBarWithIndexSignature: FooBarWithIndexSignature;

expectType<{
	[x: string]: string | number | boolean;
	[x: number]: string | number;
	[x: symbol]: symbol;
	foo: boolean;
	bar: string;
	fooBar: string;
}>(fooBarWithIndexSignature);

declare const destinationWithAny: Merge<{foo?: any}, {bar: true}>;

expectType<{
	foo?: any;
	bar: true;
}>(destinationWithAny);

declare const sourceWithAny: Merge<{foo: true}, {bar?: any}>;

expectType<{
	foo: true;
	bar?: any;
}>(sourceWithAny);

// Test for issue https://github.com/sindresorhus/type-fest/issues/601
type Baz = {
	t1?: number;
	t2?: number;
	t3?: number;
	t4?: number;
};
declare const baz: Merge<Pick<Baz, 't2' | 't4'>, {
	list: string[];
}>;
expectType<{
	t2?: number;
	t4?: number;
	list: string[];
}>(baz);

// Unions
expectType<{foo: number} | {foo: string; bar: boolean}>(
	{} as Merge<{foo: string}, {foo: number} | {bar: boolean}>,
);
expectType<{foo: string} | {bar: boolean; foo: string}>(
	{} as Merge<{foo: number} | {bar: boolean}, {foo: string}>,
);
expectType<{foo: number} | {foo: string; baz: boolean} | {bar: number; foo: number} | {bar: number; baz: boolean}>(
	{} as Merge<{foo: string} | {bar: number}, {foo: number} | {baz: boolean}>,
);
expectType<
	| {[x: number]: number; foo: number; bar: string}
	| {[x: number]: number; bar: bigint; foo: number}
	| {foo: string; bar: boolean; baz: boolean}
	| {[x: number]: bigint; bar: boolean; baz: boolean}
>(
	{} as Merge<
		{foo: string; bar: string} | {[x: number]: bigint; bar: bigint},
		{[x: number]: number; foo: number} | {bar: boolean; baz: boolean}
	>,
);

// Idempotency
type TestIntersectionObject = {a: string} & {b: string};
// Note: If `Merge` simplified `TestIntersectionObject` to `{a: string; b: string}` then the following test would fail,
// because `expectType` doesn't consider `{a: string; b: string}` equal to `{a: string} & {b: string}`.
expectType<TestIntersectionObject>({} as Merge<TestIntersectionObject, TestIntersectionObject>);

// Idempotency: Unions
expectType<TestIntersectionObject | {a: string; b: string; c: string}>({} as Merge<TestIntersectionObject | {c: string}, TestIntersectionObject>);
expectType<TestIntersectionObject | {a: string; b: string; c: string}>({} as Merge<TestIntersectionObject, TestIntersectionObject | {c: string}>);

// An array or tuple combines position by position, with the source's elements overriding the destination's. This is `Merge`'s own rule applied to the index keys a tuple has, not what either built-in spread does: the array spread appends and the object spread gives a plain object. See the note on `CombineTwoArrays` in the source.
declare const twoTuples: Merge<[1, 2, 3], [4, 5]>;
expectType<[4, 5, 3]>(twoTuples);

declare const shorterSource: Merge<[1, 2, 3, 4], [9]>;
expectType<[9, 2, 3, 4]>(shorterSource);

declare const longerSource: Merge<[9], [1, 2, 3, 4]>;
expectType<[1, 2, 3, 4]>(longerSource);

declare const twoArrays: Merge<string[], number[]>;
expectType<Array<string | number>>(twoArrays);

declare const twoReadonlyArrays: Merge<readonly string[], readonly number[]>;
expectType<ReadonlyArray<string | number>>(twoReadonlyArrays);

declare const mixedReadonlyArrays: Merge<readonly string[], number[]>;
expectType<Array<string | number>>(mixedReadonlyArrays);

// Two readonly tuples spread to a readonly tuple, the same rule the arrays above already follow.
declare const twoReadonlyTuples: Merge<readonly [1, 2, 3], readonly [4, 5]>;
expectType<readonly [4, 5, 3]>(twoReadonlyTuples);

declare const mixedReadonlyTuples: Merge<readonly [1, 2, 3], [4, 5]>;
expectType<[4, 5, 3]>(mixedReadonlyTuples);

declare const mixedReadonlyTuplesReversed: Merge<[1, 2, 3], readonly [4, 5]>;
expectType<[4, 5, 3]>(mixedReadonlyTuplesReversed);

// Known limitation: a tuple merged with an object collapses to `never`, where the real spread gives an object carrying the array's own members: `{...['a', 1], ...{0: true}}` has `length` and `toString` alongside the positions. See the note in the docs.
declare const tupleIntoObject: Merge<[1], {0: 2}>;
expectType<never>(tupleIntoObject);

// A source with an optional element has no fixed positions to override.
declare const optionalSourceElement: Merge<[1, 2], [3?]>;
expectType<Array<1 | 2 | 3 | undefined>>(optionalSourceElement);

// An optional destination element is a position the source can override.
declare const optionalDestinationElement: Merge<[1?], [2]>;
expectType<[2]>(optionalDestinationElement);

declare const optionalDestinationTail: Merge<[1, 2?, 3?], [4, 5]>;
expectType<[4, 5, 3?]>(optionalDestinationTail);

// `any` is not an array, so a merge with a tuple does not take the array branch as well as the object branch, which made the result a union with `any[]`.
declare const anyDestinationTupleSource: Merge<any, [1]>;
expectType<any>(anyDestinationTupleSource['foo']);

declare const tupleDestinationAnySource: Merge<[1], any>;
expectType<any>(tupleDestinationAnySource['foo']);
