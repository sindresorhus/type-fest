import {expectType} from 'tsd';
import type {MergeDeep, MergeDeepOptions} from '../index.d.ts';

// Test helper.
declare function mergeDeep<
	Destination,
	Source,
	Options extends MergeDeepOptions = {},
>(destination: Destination, source: Source, options?: Options): MergeDeep<Destination, Source, Options>;

// Test valid signatures for objects.
expectType<{}>(mergeDeep({}, {}));
expectType<{}>(mergeDeep({} as const, {}));
expectType<{}>(mergeDeep({}, {} as const));
expectType<{}>(mergeDeep({} as const, {} as const));

// Test valid signatures for arrays/tuples.
expectType<never[]>(mergeDeep([], []));
expectType<never[]>(mergeDeep([] as const, []));
expectType<never[]>(mergeDeep([], [] as const));
expectType<never[]>(mergeDeep([] as const, [] as const));

// Test invalid signatures.
expectType<never>(mergeDeep({}, []));
expectType<never>(mergeDeep([], {}));
expectType<never>(mergeDeep(null, {}));
expectType<never>(mergeDeep([], 'life'));
expectType<never>(mergeDeep([], new Set()));
expectType<never>(mergeDeep(new Set(), new Set()));
expectType<never>(mergeDeep(new Map(), new Map()));
expectType<never>(mergeDeep(undefined, undefined));
expectType<never>(mergeDeep({}, undefined));
expectType<never>(mergeDeep(undefined, {}));

// Should merge simple objects
expectType<{a: string; b: number}>(mergeDeep({a: 'life'}, {b: 42}));
expectType<{readonly a: 'life'; b: number}>(mergeDeep({a: 'life'} as const, {b: 42}));
expectType<{a: string; readonly b: 42}>(mergeDeep({a: 'life'}, {b: 42} as const));
expectType<{readonly a: 'life'; readonly b: 42}>(mergeDeep({a: 'life'} as const, {b: 42} as const));

// Should spread simple arrays/tuples (default mode)
expectType<Array<string | number>>(mergeDeep(['life'], [42]));
expectType<Array<'life' | number>>(mergeDeep(['life'] as const, [42]));
expectType<Array<string | 42>>(mergeDeep(['life'], [42] as const));
expectType<Array<'life' | 42>>(mergeDeep(['life'] as const, [42] as const));

expectType<Array<string | number>>(mergeDeep(['life'], [42], {arrayMergeMode: 'spread'}));
expectType<Array<'life' | number>>(mergeDeep(['life'] as const, [42], {arrayMergeMode: 'spread'}));
expectType<Array<string | 42>>(mergeDeep(['life'], [42] as const, {arrayMergeMode: 'spread'}));
expectType<Array<'life' | 42>>(mergeDeep(['life'] as const, [42] as const, {arrayMergeMode: 'spread'}));

// Should replace simple arrays/tuples
expectType<Array<string | number>>(mergeDeep(['life'], [42], {arrayMergeMode: 'replace'}));
expectType<Array<'life' | number>>(mergeDeep(['life'] as const, [42], {arrayMergeMode: 'replace'}));
expectType<Array<string | 42>>(mergeDeep(['life'], [42] as const, {arrayMergeMode: 'replace'}));
expectType<Array<'life' | 42>>(mergeDeep(['life'] as const, [42] as const, {arrayMergeMode: 'replace'}));

// Should merge tuples with union
expectType<Array<number | string | boolean>>(mergeDeep(['life', true], [42], {arrayMergeMode: 'spread'}));
expectType<Array<number | string | true>>(mergeDeep(['life'], [42, true], {arrayMergeMode: 'spread'}));

// Should not deep merge classes
class ClassA {
	public foo = 1;
	public bar = 'bar';
}
class ClassB {
	public foo = 'foo';
}
const mergedClass = mergeDeep({ClassConstructor: ClassA}, {ClassConstructor: ClassB});
const instance = new mergedClass.ClassConstructor();
expectType<{ClassConstructor: typeof ClassB}>(mergedClass);
expectType<ClassB>(instance);
// @ts-expect-error
const _a: unknown = instance.bar;

// Should merge simple types
type Foo = {foo: string; fooBar: unknown; items: string[]};
type Bar = {bar: number; fooBar: boolean; items: number[]};

declare const fooBar: MergeDeep<Foo, Bar>;
expectType<{foo: string; bar: number; fooBar: boolean; items: number[]}>(fooBar);

declare const fooBarSpread: MergeDeep<Foo, Bar, {arrayMergeMode: 'spread'}>;
expectType<{foo: string; bar: number; fooBar: boolean; items: Array<string | number>}>(fooBarSpread);

declare const fooBarReplace: MergeDeep<Foo, Bar, {arrayMergeMode: 'replace'}>;
expectType<{foo: string; bar: number; fooBar: boolean; items: number[]}>(fooBarReplace);

// Should merge types deep
type FooDeep = {foo: Foo; fooBar: Foo; items: {foo: Foo[]; fooBar: Foo}};
type BarDeep = {bar: Bar; fooBar: Bar; items: {bar: Bar[]; fooBar: Bar}};

declare const fooBarDeep: MergeDeep<FooDeep, BarDeep>;
expectType<{
	foo: {
		foo: string;
		fooBar: unknown;
		items: string[];
	};
	bar: {
		bar: number;
		fooBar: boolean;
		items: number[];
	};
	fooBar: {
		foo: string;
		bar: number;
		fooBar: boolean;
		items: number[];
	};
	items: {
		foo: Foo[];
		bar: Bar[];
		fooBar: {
			foo: string;
			bar: number;
			fooBar: boolean;
			items: number[];
		};
	};
}>(fooBarDeep);

// Should merge types with index signatures deep
type FooWithIndexSignature = {[x: number]: number; foo: string; items: string[]};
type BarWithIndexSignature = {[x: symbol]: symbol; bar: number; items: number[]};
type FooWithIndexSignatureDeep = {[x: number]: number; foo: string; fooBar: FooWithIndexSignature; items: string[]};
type BarWithIndexSignatureDeep = {[x: symbol]: symbol; bar: number; fooBar: BarWithIndexSignature; items: number[]};

declare const fooBarWithIndexSignature: MergeDeep<FooWithIndexSignatureDeep, BarWithIndexSignatureDeep>;
expectType<{
	[x: number]: number;
	[x: symbol]: symbol;
	foo: string;
	bar: number;
	fooBar: {
		[x: number]: number;
		[x: symbol]: symbol;
		foo: string;
		bar: number;
		items: number[];
	};
	items: number[];
}>(fooBarWithIndexSignature);

// Should merge types with optional properties deep
type FooWithOptional = {foo: string; fooOptional?: string; fooBar: Foo; fooBarOptional: Foo | undefined};
type BarWithOptional = {bar: number; barOptional?: number; fooBar: Bar; fooBarOptional: Bar | undefined};

declare const fooBarWithOptional: MergeDeep<FooWithOptional, BarWithOptional>;
expectType<{
	foo: string;
	bar: number;
	fooOptional?: string;
	barOptional?: number;
	fooBar: {
		foo: string;
		bar: number;
		fooBar: boolean;
		items: number[];
	};
	fooBarOptional: {
		foo: string;
		bar: number;
		fooBar: boolean;
		items: number[];
	} | undefined;
}>(fooBarWithOptional);

// Test for optional
type FooOptional = {
	string?: string;
	any?: any;
	never?: never;
};
type BarOptional = {
	number?: number;
};
type MergedFooBar = {
	string?: string;
	any?: any;
	never?: never;
	number?: number;
};
declare const mergedFooBar: MergeDeep<FooOptional, BarOptional>;
expectType<MergedFooBar>(mergedFooBar);
declare const mergedBarFoo: MergeDeep<FooOptional, BarOptional>;
expectType<MergedFooBar>(mergedBarFoo);

// Test for readonly
type ReadonlyFoo = {
	readonly string: string;
	readonly number: number;
	boolean: boolean;
};
type ReadonlyBar = {
	number: number;
	readonly boolean: boolean;
};
declare const readonlyTest: MergeDeep<ReadonlyFoo, ReadonlyBar>;
expectType<{
	readonly string: string;
	number: number;
	readonly boolean: boolean;
}>(readonlyTest);

// Should merge arrays with object entries
type FooArray = Foo[];
type BarArray = Bar[];

declare const fooBarArray: MergeDeep<FooArray, BarArray>;
expectType<Array<Foo | Bar>>(fooBarArray);

declare const fooBarArraySpread: MergeDeep<FooArray, BarArray, {arrayMergeMode: 'spread'}>;
expectType<Array<Foo | Bar>>(fooBarArraySpread);

declare const fooBarArrayReplace: MergeDeep<FooArray, BarArray, {arrayMergeMode: 'replace'}>;
expectType<Array<Foo | Bar>>(fooBarArrayReplace);

declare const fooBarArraySpreadRecursive: MergeDeep<FooArray, BarArray, {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectType<Array<{
	foo: string;
	bar: number;
	fooBar: boolean;
	items: Array<string | number>;
}>>(fooBarArraySpreadRecursive);

declare const fooBarArrayReplaceRecursive: MergeDeep<FooArray, BarArray, {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectType<Array<{
	foo: string;
	bar: number;
	fooBar: boolean;
	items: number[];
}>>(fooBarArrayReplaceRecursive);

declare const fooBarArraySpreadRecursiveFallback: MergeDeep<FooArray, string[], {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectType<Array<string | Foo>>(fooBarArraySpreadRecursiveFallback);

declare const fooBarArrayReplaceRecursiveFallback: MergeDeep<FooArray, string[], {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectType<Array<string | Foo>>(fooBarArrayReplaceRecursiveFallback);

declare const fooBarArrayDeepUnionRecursive: MergeDeep<FooArray[][], BarArray[][], {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectType<Array<Array<Array<{
	foo: string;
	bar: number;
	fooBar: boolean;
	items: Array<string | number>;
}>>>>(fooBarArrayDeepUnionRecursive);

declare const fooBarArrayDeepUnionRecursiveFallback: MergeDeep<FooArray[], BarArray[][], {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectType<Array<Array<Foo | BarArray>>>(fooBarArrayDeepUnionRecursiveFallback);

// Should merge tuples with object entries
type FooTuple = [Foo, [Foo[], 42], 'foo'];
type BarTuple = [Bar, [Bar[], 'a', 'b'], 'bar', true];

type FooBarSpread = typeof fooBarSpread;
type FooBarReplace = typeof fooBarReplace;

declare const fooBarTupleSpread: MergeDeep<FooTuple, BarTuple, {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectType<[FooBarSpread, [FooBarSpread[], 'a', 'b'], 'bar', true]>(fooBarTupleSpread);

declare const fooBarTupleReplace: MergeDeep<FooTuple, BarTuple, {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectType<[FooBarReplace, [FooBarReplace[], 'a', 'b'], 'bar', true]>(fooBarTupleReplace);

// Should merge array into tuple with object entries
type FooNumberTuple = [Foo[], number[]];
type BarArray2D = Bar[][];

declare const fooNumberTupleBarArray2DSpread: MergeDeep<FooNumberTuple, BarArray2D, {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectType<[FooBarSpread[], Array<number | Bar>, ...BarArray2D]>(fooNumberTupleBarArray2DSpread);

declare const fooNumberTupleBarArray2DReplace: MergeDeep<FooNumberTuple, BarArray2D, {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectType<[FooBarReplace[], Bar[], ...BarArray2D]>(fooNumberTupleBarArray2DReplace);

// Should merge tuple into array with object entries
type FooArray2D = Foo[][];
type BarNumberTuple = [Bar[], number[]];

declare const fooArray2DBarNumberTupleSpread: MergeDeep<FooArray2D, BarNumberTuple, {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectType<[FooBarSpread[], Array<Foo | number>, ...FooArray2D]>(fooArray2DBarNumberTupleSpread);

declare const fooArray2DBarNumberTupleReplace: MergeDeep<FooArray2D, BarNumberTuple, {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectType<[FooBarReplace[], number[], ...FooArray2D]>(fooArray2DBarNumberTupleReplace);

// Should merge array into tuple with object entries and variadic length
declare const arrayIntoTupleWithVariadicSpread: MergeDeep<[number, Foo, ...Foo[]], Bar[], {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectType<[Bar, FooBarSpread, ...FooBarSpread[]]>(arrayIntoTupleWithVariadicSpread);

declare const arrayIntoTupleWithVariadicReplace: MergeDeep<[number, Foo, ...Foo[]], Bar[], {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectType<[Bar, FooBarReplace, ...FooBarReplace[]]>(arrayIntoTupleWithVariadicReplace);

// Should merge tuple into array with object entries and variadic length
declare const tupleIntoArrayWithVariadicSpread: MergeDeep<Foo[], [number, Bar, ...Bar[]], {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectType<[number, FooBarSpread, ...FooBarSpread[]]>(tupleIntoArrayWithVariadicSpread);

declare const tupleIntoArrayWithVariadicReplace: MergeDeep<Foo[], [number, Bar, ...Bar[]], {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectType<[number, FooBarReplace, ...FooBarReplace[]]>(tupleIntoArrayWithVariadicReplace);

// Should merge tuple into tuple with object entries and variadic length
declare const tupleIntoTupleWithVariadicSpread: MergeDeep<[number, ...Foo[]], [Bar, Bar, ...Bar[]], {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectType<[Bar, FooBarSpread, ...FooBarSpread[]]>(tupleIntoTupleWithVariadicSpread);

declare const tupleIntoTupleWithVariadicSpreadReversed: MergeDeep<[Foo, ...Foo[]], [number, Bar, ...Bar[]], {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectType<[number, FooBarSpread, ...FooBarSpread[]]>(tupleIntoTupleWithVariadicSpreadReversed);

declare const tupleIntoTupleWithVariadicReplace: MergeDeep<[number, ...Foo[]], [Bar, Bar, ...Bar[]], {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectType<[Bar, FooBarReplace, ...FooBarReplace[]]>(tupleIntoTupleWithVariadicReplace);

declare const tupleIntoTupleWithVariadicReplaceReversed: MergeDeep<[Foo, ...Foo[]], [number, Bar, ...Bar[]], {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectType<[number, FooBarReplace, ...FooBarReplace[]]>(tupleIntoTupleWithVariadicReplaceReversed);
