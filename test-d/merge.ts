import {expectTypeOf} from 'nz';
import type {Merge} from '../index.d.ts';

type Foo = {
	a: number;
	b: string;
};

type Bar = {
	b: number;
};

const ab: Merge<Foo, Bar> = {a: 1, b: 2};
expectTypeOf(ab).toBe<{a: number; b: number}>();

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

expectTypeOf(fooBar).toBe<{
	[x: string]: unknown;
	[x: number]: number;
	[x: symbol]: boolean;
	foo: string;
	bar: Date;
	baz: boolean;
}>();

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

expectTypeOf<FooOptions>().toBe<{stripUndefinedValues: true}>();

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
expectTypeOf(fooBarWithOptionalKeys).toBe<{
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
}>();

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

expectTypeOf(fooBarWithIndexSignature).toBe<{
	[x: string]: string | number | boolean;
	[x: number]: string | number;
	[x: symbol]: symbol;
	foo: boolean;
	bar: string;
	fooBar: string;
}>();

declare const destinationWithAny: Merge<{foo?: any}, {bar: true}>;

expectTypeOf(destinationWithAny).toBe<{
	foo?: any;
	bar: true;
}>();

declare const sourceWithAny: Merge<{foo: true}, {bar?: any}>;

expectTypeOf(sourceWithAny).toBe<{
	foo: true;
	bar?: any;
}>();

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
expectTypeOf(baz).toBe<{
	t2?: number;
	t4?: number;
	list: string[];
}>();

// Unions
expectTypeOf<Merge<{foo: string}, {foo: number} | {bar: boolean}>>().toBe<{foo: number} | {foo: string; bar: boolean}>();
expectTypeOf<Merge<{foo: number} | {bar: boolean}, {foo: string}>>().toBe<{foo: string} | {bar: boolean; foo: string}>();
expectTypeOf<Merge<{foo: string} | {bar: number}, {foo: number} | {baz: boolean}>>().toBe<{foo: number} | {foo: string; baz: boolean} | {bar: number; foo: number} | {bar: number; baz: boolean}>();
expectTypeOf<Merge<
		{foo: string; bar: string} | {[x: number]: bigint; bar: bigint},
		{[x: number]: number; foo: number} | {bar: boolean; baz: boolean}
>>().toBe<
	| {[x: number]: number; foo: number; bar: string}
	| {[x: number]: number; bar: bigint; foo: number}
	| {foo: string; bar: boolean; baz: boolean}
	| {[x: number]: bigint; bar: boolean; baz: boolean}>();

// Idempotency
type TestIntersectionObject = {a: string} & {b: string};
// Note: If `Merge` simplified `TestIntersectionObject` to `{a: string; b: string}` then the following test would fail,
// because `expectType` doesn't consider `{a: string; b: string}` equal to `{a: string} & {b: string}`.
expectTypeOf<Merge<TestIntersectionObject, TestIntersectionObject>>().toBe<TestIntersectionObject>();

// Idempotency: Unions
expectTypeOf<Merge<TestIntersectionObject | {c: string}, TestIntersectionObject>>().toBe<TestIntersectionObject | {a: string; b: string; c: string}>();
expectTypeOf<Merge<TestIntersectionObject, TestIntersectionObject | {c: string}>>().toBe<TestIntersectionObject | {a: string; b: string; c: string}>();

// An array or tuple combines position by position, with the source's elements overriding the destination's. This is `Merge`'s own rule applied to the index keys a tuple has, not what either built-in spread does: the array spread appends and the object spread gives a plain object. See the note on `CombineTwoArrays` in the source.
declare const twoTuples: Merge<[1, 2, 3], [4, 5]>;
expectTypeOf(twoTuples).toBe<[4, 5, 3]>();

declare const shorterSource: Merge<[1, 2, 3, 4], [9]>;
expectTypeOf(shorterSource).toBe<[9, 2, 3, 4]>();

declare const longerSource: Merge<[9], [1, 2, 3, 4]>;
expectTypeOf(longerSource).toBe<[1, 2, 3, 4]>();

declare const twoArrays: Merge<string[], number[]>;
expectTypeOf(twoArrays).toBe<Array<string | number>>();

declare const twoReadonlyArrays: Merge<readonly string[], readonly number[]>;
expectTypeOf(twoReadonlyArrays).toBe<ReadonlyArray<string | number>>();

declare const mixedReadonlyArrays: Merge<readonly string[], number[]>;
expectTypeOf(mixedReadonlyArrays).toBe<Array<string | number>>();

// Two readonly tuples spread to a readonly tuple, the same rule the arrays above already follow.
declare const twoReadonlyTuples: Merge<readonly [1, 2, 3], readonly [4, 5]>;
expectTypeOf(twoReadonlyTuples).toBe<readonly [4, 5, 3]>();

declare const mixedReadonlyTuples: Merge<readonly [1, 2, 3], [4, 5]>;
expectTypeOf(mixedReadonlyTuples).toBe<[4, 5, 3]>();

declare const mixedReadonlyTuplesReversed: Merge<[1, 2, 3], readonly [4, 5]>;
expectTypeOf(mixedReadonlyTuplesReversed).toBe<[4, 5, 3]>();

// Known limitation: a number key of an object is intersected with the position of a tuple instead of overriding it, so conflicting literal types collapse the result to `never`. See the note in the docs.
declare const tupleIntoObject: Merge<[1], {0: 2}>;
expectTypeOf(tupleIntoObject).toBe<never>();
expectTypeOf<Merge<{1: 'x'}, [1, 2]>>().toBe<never>();
expectTypeOf<Merge<[string], {0: number}>[0]>().toBe<never>();
expectTypeOf<Merge<[1], {'0': 2}>['0']>().toBe<2>();
expectTypeOf<Merge<[1], {'0': 2}>['length']>().toBe<1>();

// A source with an optional element has no fixed positions to override.
declare const optionalSourceElement: Merge<[1, 2], [3?]>;
expectTypeOf(optionalSourceElement).toBe<Array<1 | 2 | 3 | undefined>>();

// An optional destination element is a position the source can override.
declare const optionalDestinationElement: Merge<[1?], [2]>;
expectTypeOf(optionalDestinationElement).toBe<[2]>();

declare const optionalDestinationTail: Merge<[1, 2?, 3?], [4, 5]>;
expectTypeOf(optionalDestinationTail).toBe<[4, 5, 3?]>();

// `any` is not an array, so a merge with a tuple does not take the array branch as well as the object branch, which made the result a union with `any[]`.
declare const anyDestinationTupleSource: Merge<any, [1]>;
expectTypeOf(anyDestinationTupleSource['foo']).toBe<any>();

declare const tupleDestinationAnySource: Merge<[1], any>;
expectTypeOf(tupleDestinationAnySource['foo']).toBe<any>();

// A call signature is kept: the source's if it has one, otherwise the destination's. https://github.com/sindresorhus/type-fest/issues/969
type Callable = {
	(value: string): number;
	property: number;
};

expectTypeOf<Merge<Callable, {property: string}>>().toBe<((value: string) => number) & {property: string}>();
expectTypeOf<Merge<{other: string}, Callable>>().toBe<((value: string) => number) & {other: string; property: number}>();
expectTypeOf<Merge<Callable, (value: number) => string>>().toBe<((value: number) => string) & {property: number}>();
expectTypeOf<Merge<Callable | {other: string}, {property: string}>>().toBe<(((value: string) => number) & {property: string}) | {other: string; property: string}>();
expectTypeOf<Merge<Callable, any>>().toBe<((value: string) => number) & {[x: string]: any; property: number}>();
expectTypeOf<Merge<never, Callable>>().toBe<never>();
expectTypeOf<Merge<any, Callable>>().toBe<((value: string) => number) & {[x: string]: any; property: number}>();
expectTypeOf<Merge<Callable, unknown>>().toBe<((value: string) => number) & {property: number}>();
expectTypeOf<Merge<Callable, Callable>>().toBe<Callable>();
expectTypeOf<Merge<(value: string) => number, {property: string}>>().toBe<((value: string) => number) & {property: string}>();
expectTypeOf<Merge<Callable, {(value: number): string; other: string}>>().toBe<((value: number) => string) & {property: number; other: string}>();

// Modifiers and index signatures are kept next to the call signature.
type CallableWithModifiers = {
	(value: string): number;
	readonly property?: number;
	[key: string]: unknown;
};

expectTypeOf<Merge<CallableWithModifiers, {other: string}>>().toBe<((value: string) => number) & {[x: string]: unknown; readonly property?: number; other: string}>();

// Each union member keeps its own call signature.
expectTypeOf<Merge<Callable | ((value: boolean) => void), {property: string}>>().toBe<
	| (((value: string) => number) & {property: string})
	| (((value: boolean) => void) & {property: string})>();

// The `this` parameter is kept.
expectTypeOf<Merge<{(this: Date, value: string): number; property: number}, {property: string}>>().toBe<((this: Date, value: string) => number) & {property: string}>();

// Known limitation: the call signature is rebuilt, so an overloaded function keeps only its last signature, a generic function loses its type parameters, and a type predicate becomes `boolean`. A construct signature is dropped.
expectTypeOf<Merge<{(value: string): string; (value: number): number; property: number}, {property: string}>>().toBe<((value: number) => number) & {property: string}>();
expectTypeOf<Merge<{<Value>(value: Value): Value; property: number}, {property: string}>>().toBe<((value: unknown) => unknown) & {property: string}>();
expectTypeOf<Merge<{(value: unknown): value is string; property: number}, {property: string}>>().toBe<((value: unknown) => boolean) & {property: string}>();
expectTypeOf<Merge<{new (): Date; (value: string): number; property: number}, {property: string}>>().toBe<((value: string) => number) & {property: string}>();

// A property of the destination is overridden only by a property of the source, not by an index signature.
declare const sym: unique symbol;
expectTypeOf<Merge<{a: 1; b: 2}, {[x: string]: number}>>().toBe<{[x: string]: number; a: 1; b: 2}>();
expectTypeOf<Merge<{0: 'a'; 1: 'b'}, {[x: number]: string}>>().toBe<{[x: number]: string; 0: 'a'; 1: 'b'}>();
expectTypeOf<Merge<{[sym]: 1}, {[x: symbol]: number}>>().toBe<{[x: symbol]: number; [sym]: 1}>();
expectTypeOf<Merge<{fooBar: 1}, {[x: `foo${string}`]: number}>>().toBe<{[x: `foo${string}`]: number; fooBar: 1}>();
expectTypeOf<Merge<{0: 'a'}, {0: 'b'}>>().toBe<{0: 'b'}>();
expectTypeOf<Merge<{[sym]: 1}, {[sym]: 2}>>().toBe<{[sym]: 2}>();
expectTypeOf<Merge<{a: 1; b: 2}, {[x: string]: number; a: 3}>>().toBe<{[x: string]: number; b: 2; a: 3}>();
expectTypeOf<Merge<{a?: 1}, {[x: string]: number}>>().toBe<{[x: string]: number; a?: 1}>();
expectTypeOf<Merge<{readonly a: 1}, {readonly [x: string]: number}>>().toBe<{readonly [x: string]: number; readonly a: 1}>();
expectTypeOf<Merge<{[sym]: 1; a: 1}, {[sym]?: 2}>>().toBe<{a: 1; [sym]?: 2}>();
expectTypeOf<Merge<{[x: symbol]: number}, {[sym]: 2}>>().toBe<{[x: symbol]: number; [sym]: 2}>();
expectTypeOf<Merge<Record<'a' | 'b', 1>, Record<'b' | 'c', 2>>>().toBe<{a: 1; b: 2; c: 2}>();

// An enum member key is the same property as its value, in either direction.
enum StringEnum {
	A = 'a',
	B = 'b',
}

enum NumberEnum {
	A = 0,
}

expectTypeOf<Merge<{[StringEnum.A]: 1}, {a: 2}>>().toBe<{a: 2}>();
expectTypeOf<Merge<{a: 1}, {[StringEnum.A]: 2}>>().toBe<{a: 2}>();
expectTypeOf<Merge<{a: string}, {[StringEnum.A]: number}>>().toBe<{a: number}>();
expectTypeOf<Merge<{a: 1; b: 2}, {[StringEnum.A]?: 3}>>().toBe<{b: 2; a?: 3}>();
expectTypeOf<Merge<{readonly a: 1; c: 2}, {[StringEnum.A]: 3}>>().toBe<{c: 2; a: 3}>();
expectTypeOf<Merge<{a: 1; b: 1; c: 1}, Record<StringEnum, 2>>>().toBe<{c: 1; a: 2; b: 2}>();
expectTypeOf<Merge<Record<StringEnum, 1>, {a: 2}>>().toBe<{b: 1; a: 2}>();
expectTypeOf<Merge<{[StringEnum.A]: 1}, {[StringEnum.A]: 2}>>().toBe<{a: 2}>();
expectTypeOf<Merge<{0: 1}, {[NumberEnum.A]: 2}>>().toBe<{0: 2}>();
expectTypeOf<Merge<{[NumberEnum.A]: 1}, {0: 2}>>().toBe<{0: 2}>();
expectTypeOf<Merge<{[x: string]: number; a: 1}, {[StringEnum.A]: 2}>>().toBe<{[x: string]: number; a: 2}>();

// An index signature of the destination is overridden only by an index signature of the source that covers its keys, not by a property.
expectTypeOf<Merge<{[x: string]: number}, {a: 1}>>().toBe<{[x: string]: number; a: 1}>();
expectTypeOf<Merge<{[x: number]: 1}, {[x: string]: 2}>>().toBe<{[x: string]: 2}>();
expectTypeOf<Merge<{[x: string]: number}, {[x: number]: 2}>>().toBe<{[x: string]: number; [x: number]: 2}>();
expectTypeOf<Merge<{[x: `foo${string}`]: 1}, {[x: string]: 2}>>().toBe<{[x: string]: 2}>();
expectTypeOf<Merge<{[x: string]: number}, {[x: `foo${string}`]: 2; a: 3}>>().toBe<{[x: string]: number; [x: `foo${string}`]: 2; a: 3}>();
expectTypeOf<Merge<{[x: symbol]: 1}, {[x: string]: 2}>>().toBe<{[x: symbol]: 1; [x: string]: 2}>();
expectTypeOf<Merge<Record<string, number | string>, {a: string}>>().toBe<{[x: string]: number | string; a: string}>();
expectTypeOf<Merge<{[x: string]: number; a: 1}, {[x: string]: number | string}>>().toBe<{[x: string]: number | string; a: 1}>();
expectTypeOf<Merge<{[x: `foo${string}`]: 1}, {[x: `foo${string}`]: 2}>>().toBe<{[x: `foo${string}`]: 2}>();
expectTypeOf<Merge<{[x: `foo${string}`]: 1}, {[x: `bar${string}`]: 2}>>().toBe<{[x: `foo${string}`]: 1; [x: `bar${string}`]: 2}>();
expectTypeOf<Merge<{[x: `${number}`]: 1}, {[x: string]: 2}>>().toBe<{[x: string]: 2}>();
expectTypeOf<Merge<{[x: number]: 1; [x: symbol]: 2}, {[x: string]: 3}>>().toBe<{[x: symbol]: 2; [x: string]: 3}>();
expectTypeOf<Merge<{a: 1; [x: string]: number}, {[x: symbol]: 2}>>().toBe<{[x: string]: number; [x: symbol]: 2; a: 1}>();
expectTypeOf<Merge<{[x: string]: number}, {[x: string]: string; [x: number]: 'n'}>>().toBe<{[x: string]: string; [x: number]: 'n'}>();

// Modifiers come from the type that has the key: the source for an overridden key, otherwise the destination.
expectTypeOf<Merge<{readonly a?: 1; b: 2}, {c: 3}>>().toBe<{readonly a?: 1; b: 2; c: 3}>();
expectTypeOf<Merge<{readonly a?: 1}, {a: 2}>>().toBe<{a: 2}>();
expectTypeOf<Merge<{a: 1}, {readonly a?: 2}>>().toBe<{readonly a?: 2}>();
expectTypeOf<Merge<{readonly [x: string]: number}, {a: 2}>>().toBe<{readonly [x: string]: number; a: 2}>();
expectTypeOf<Merge<{[x: string]: 1}, {readonly [x: string]: 2}>>().toBe<{readonly [x: string]: 2}>();

// Top and empty types.
expectTypeOf<Merge<any, {a: 1}>>().toBe<{[x: string]: any; a: 1}>();
expectTypeOf<Merge<{a: 1}, any>>().toBe<{[x: string]: any; a: 1}>();
expectTypeOf<Merge<unknown, {a: 1}>>().toBe<{a: 1}>();
expectTypeOf<Merge<{a: 1}, unknown>>().toBe<{a: 1}>();
expectTypeOf<Merge<{}, {a: 1}>>().toBe<{a: 1}>();
expectTypeOf<Merge<{a: 1}, {}>>().toBe<{a: 1}>();
expectTypeOf<Merge<never, {a: 1}>>().toBe<never>();
expectTypeOf<Merge<{a: 1}, never>>().toBe<never>();
expectTypeOf<Merge<{[x: string]: number}, any>>().toBe<{[x: string]: any}>();
expectTypeOf<Merge<{[x: symbol]: 1; a: 1}, any>>().toBe<{[x: symbol]: 1; [x: string]: any; a: 1}>();
expectTypeOf<Merge<any, {[x: number]: 1}>>().toBe<{[x: string]: any; [x: number]: 1}>();
expectTypeOf<Merge<any, any>>().toBe<any>();
expectTypeOf<Merge<unknown, any>>().toBe<{[x: string]: any}>();
expectTypeOf<Merge<{}, {}>>().toBe<{}>();
expectTypeOf<Merge<object, {a: 1}>>().toBe<{a: 1}>();

// Nested merges stay correct with index signatures and modifiers.
type NestedWithIndexSignatures = Merge<Merge<Merge<{[x: string]: number; a?: 1}, {[x: number]: 2; readonly b: 2}>, {[x: string]: number | string; c: 3}>, {[x: symbol]: 4; a: 4}>;
expectTypeOf<NestedWithIndexSignatures>().toBe<{[x: string]: number | string; [x: symbol]: 4; readonly b: 2; c: 3; a: 4}>();

type NestedKeepsNumberIndexSignature = Merge<Merge<{[x: string]: number; a?: 1}, {[x: string]: number | string; c: 3}>, {[x: number]: 2; readonly b: 2}>;
expectTypeOf<NestedKeepsNumberIndexSignature>().toBe<{[x: string]: number | string; [x: number]: 2; a?: 1; c: 3; readonly b: 2}>();

// Each nested merge reads the previous result once, so deep nesting stays fast and within the depth limit. Reading it more than once made each level about four times slower, and 18 levels failed with “Type instantiation is excessively deep and possibly infinite”.
type DeepFirstHalf = Merge<Merge<Merge<Merge<Merge<Merge<Merge<Merge<Merge<Merge<{a: 0}, {b: 1}>, {c: 2}>, {a: 3}>, {b: 4}>, {c: 5}>, {a: 6}>, {b: 7}>, {c: 8}>, {a: 9}>, {b: 10}>;
type Deep = Merge<Merge<Merge<Merge<Merge<Merge<Merge<Merge<Merge<Merge<DeepFirstHalf, {c: 11}>, {a: 12}>, {b: 13}>, {c: 14}>, {a: 15}>, {b: 16}>, {c: 17}>, {a: 18}>, {b: 19}>, {c: 20}>;
expectTypeOf<Deep>().toBe<{a: 18; b: 19; c: 20}>();
