import {expectTypeOf} from 'expect-type';
import type {MergeDeep, MergeDeepOptions} from '../index';

// Test helper.
declare function mergeDeep<
	Destination,
	Source,
	Options extends MergeDeepOptions = {},
>(destination: Destination, source: Source, options?: Options): MergeDeep<Destination, Source, Options>;

// Test valid signatures for objects.
expectTypeOf(mergeDeep({}, {})).toEqualTypeOf<{}>();
expectTypeOf(mergeDeep({} as const, {})).toEqualTypeOf<{}>();
expectTypeOf(mergeDeep({}, {} as const)).toEqualTypeOf<{}>();
expectTypeOf(mergeDeep({} as const, {} as const)).toEqualTypeOf<{}>();

// Test valid signatures for arrays/tuples.
expectTypeOf(mergeDeep([], [])).toEqualTypeOf<never[]>();
expectTypeOf(mergeDeep([] as const, [])).toEqualTypeOf<never[]>();
expectTypeOf(mergeDeep([], [] as const)).toEqualTypeOf<never[]>();
expectTypeOf(mergeDeep([] as const, [] as const)).toEqualTypeOf<never[]>();

// Test invalid signatures.
expectTypeOf(mergeDeep({}, [])).toEqualTypeOf<never>();
expectTypeOf(mergeDeep([], {})).toEqualTypeOf<never>();
expectTypeOf(mergeDeep(null, {})).toEqualTypeOf<never>();
expectTypeOf(mergeDeep([], 'life')).toEqualTypeOf<never>();
expectTypeOf(mergeDeep([], new Set())).toEqualTypeOf<never>();
expectTypeOf(mergeDeep(new Set(), new Set())).toEqualTypeOf<never>();
expectTypeOf(mergeDeep(undefined, undefined)).toEqualTypeOf<never>();
expectTypeOf(mergeDeep({}, undefined)).toEqualTypeOf<never>();
expectTypeOf(mergeDeep(undefined, {})).toEqualTypeOf<never>();

// Should merge simple objects
expectTypeOf(mergeDeep({a: 'life'}, {b: 42})).toEqualTypeOf<{a: string; b: number}>();
expectTypeOf(mergeDeep({a: 'life'} as const, {b: 42})).toEqualTypeOf<{a: 'life'; b: number}>();
expectTypeOf(mergeDeep({a: 'life'}, {b: 42} as const)).toEqualTypeOf<{a: string; b: 42}>();
expectTypeOf(mergeDeep({a: 'life'} as const, {b: 42} as const)).toEqualTypeOf<{a: 'life'; b: 42}>();

// Should spread simple arrays/tuples (default mode)
expectTypeOf(mergeDeep(['life'], [42])).toEqualTypeOf<Array<string | number>>();
expectTypeOf(mergeDeep(['life'] as const, [42])).toEqualTypeOf<Array<'life' | number>>();
expectTypeOf(mergeDeep(['life'], [42] as const)).toEqualTypeOf<Array<string | 42>>();
expectTypeOf(mergeDeep(['life'] as const, [42] as const)).toEqualTypeOf<Array<'life' | 42>>();

expectTypeOf(mergeDeep(['life'], [42], {arrayMergeMode: 'spread'})).toEqualTypeOf<Array<string | number>>();
expectTypeOf(mergeDeep(['life'] as const, [42], {arrayMergeMode: 'spread'})).toEqualTypeOf<Array<'life' | number>>();
expectTypeOf(mergeDeep(['life'], [42] as const, {arrayMergeMode: 'spread'})).toEqualTypeOf<Array<string | 42>>();
expectTypeOf(mergeDeep(['life'] as const, [42] as const, {arrayMergeMode: 'spread'})).toEqualTypeOf<Array<'life' | 42>>();

// Should replace simple arrays/tuples
expectTypeOf(mergeDeep(['life'], [42], {arrayMergeMode: 'replace'})).toEqualTypeOf<Array<string | number>>();
expectTypeOf(mergeDeep(['life'] as const, [42], {arrayMergeMode: 'replace'})).toEqualTypeOf<Array<'life' | number>>();
expectTypeOf(mergeDeep(['life'], [42] as const, {arrayMergeMode: 'replace'})).toEqualTypeOf<Array<string | 42>>();
expectTypeOf(mergeDeep(['life'] as const, [42] as const, {arrayMergeMode: 'replace'})).toEqualTypeOf<Array<'life' | 42>>();

// Should merge tuples with union
expectTypeOf(mergeDeep(['life', true], [42], {arrayMergeMode: 'spread'})).toEqualTypeOf<Array<number | string | boolean>>();
expectTypeOf(mergeDeep(['life'], [42, true], {arrayMergeMode: 'spread'})).toEqualTypeOf<Array<number | string | boolean>>();

// Should merge simple types
type Foo = {foo: string; fooBar: unknown; items: string[]};
type Bar = {bar: number; fooBar: boolean; items: number[]};

declare const fooBar: MergeDeep<Foo, Bar>;
expectTypeOf(fooBar).toEqualTypeOf<{foo: string; bar: number; fooBar: boolean; items: number[]}>();

declare const fooBarSpread: MergeDeep<Foo, Bar, {arrayMergeMode: 'spread'}>;
expectTypeOf(fooBarSpread).toEqualTypeOf<{foo: string; bar: number; fooBar: boolean; items: Array<string | number>}>();

declare const fooBarReplace: MergeDeep<Foo, Bar, {arrayMergeMode: 'replace'}>;
expectTypeOf(fooBarReplace).toEqualTypeOf<{foo: string; bar: number; fooBar: boolean; items: number[]}>();

// Should merge types deep
type FooDeep = {foo: Foo; fooBar: Foo; items: {foo: Foo[]; fooBar: Foo}};
type BarDeep = {bar: Bar; fooBar: Bar; items: {bar: Bar[]; fooBar: Bar}};

declare const fooBarDeep: MergeDeep<FooDeep, BarDeep>;
expectTypeOf(fooBarDeep).toEqualTypeOf<{
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
}>();

// Should merge types with index signatures deep
type FooWithIndexSignature = {[x: number]: number; foo: string; items: string[]};
type BarWithIndexSignature = {[x: symbol]: symbol; bar: number; items: number[]};
type FooWithIndexSignatureDeep = {[x: number]: number; foo: string; fooBar: FooWithIndexSignature; items: string[]};
type BarWithIndexSignatureDeep = {[x: symbol]: symbol; bar: number; fooBar: BarWithIndexSignature; items: number[]};

declare const fooBarWithIndexSignature: MergeDeep<FooWithIndexSignatureDeep, BarWithIndexSignatureDeep>;
expectTypeOf(fooBarWithIndexSignature).toEqualTypeOf<{
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
}>();

// Should merge types with optional properties deep
type FooWithOptional = {foo: string; fooOptional?: string; fooBar: Foo; fooBarOptional: Foo | undefined};
type BarWithOptional = {bar: number; barOptional?: number; fooBar: Bar; fooBarOptional: Bar | undefined};

declare const fooBarWithOptional: MergeDeep<FooWithOptional, BarWithOptional>;
expectTypeOf(fooBarWithOptional).toEqualTypeOf<{
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
	fooBarOptional?: {
		foo: string;
		bar: number;
		fooBar: boolean;
		items: number[];
	};
}>();

// Should merge arrays with object entries
type FooArray = Foo[];
type BarArray = Bar[];

declare const fooBarArray: MergeDeep<FooArray, BarArray>;
expectTypeOf(fooBarArray).toEqualTypeOf<Array<Foo | Bar>>();

declare const fooBarArraySpread: MergeDeep<FooArray, BarArray, {arrayMergeMode: 'spread'}>;
expectTypeOf(fooBarArraySpread).toEqualTypeOf<Array<Foo | Bar>>();

declare const fooBarArrayReplace: MergeDeep<FooArray, BarArray, {arrayMergeMode: 'replace'}>;
expectTypeOf(fooBarArrayReplace).toEqualTypeOf<Array<Foo | Bar>>();

declare const fooBarArraySpreadRecursive: MergeDeep<FooArray, BarArray, {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectTypeOf(fooBarArraySpreadRecursive).toEqualTypeOf<Array<{
	foo: string;
	bar: number;
	fooBar: boolean;
	items: Array<string | number>;
}>>();

declare const fooBarArrayReplaceRecursive: MergeDeep<FooArray, BarArray, {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectTypeOf(fooBarArrayReplaceRecursive).toEqualTypeOf<Array<{
	foo: string;
	bar: number;
	fooBar: boolean;
	items: number[];
}>>();

declare const fooBarArraySpreadRecursiveFallback: MergeDeep<FooArray, string[], {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectTypeOf(fooBarArraySpreadRecursiveFallback).toEqualTypeOf<Array<string | Foo>>();

declare const fooBarArrayReplaceRecursiveFallback: MergeDeep<FooArray, string[], {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectTypeOf(fooBarArrayReplaceRecursiveFallback).toEqualTypeOf<Array<string | Foo>>();

declare const fooBarArrayDeepUnionRecursive: MergeDeep<FooArray[][], BarArray[][], {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectTypeOf(fooBarArrayDeepUnionRecursive).toEqualTypeOf<Array<Array<Array<{
	foo: string;
	bar: number;
	fooBar: boolean;
	items: Array<string | number>;
}>>>>();

declare const fooBarArrayDeepUnionRecursiveFallback: MergeDeep<FooArray[], BarArray[][], {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectTypeOf(fooBarArrayDeepUnionRecursiveFallback).toEqualTypeOf<Array<Array<Foo | BarArray>>>();

// Should merge tuples with object entries
type FooTuple = [Foo, [Foo[], 42], 'foo'];
type BarTuple = [Bar, [Bar[], 'a', 'b'], 'bar', true];

type FooBarSpread = typeof fooBarSpread;
type FooBarReplace = typeof fooBarReplace;

declare const fooBarTupleSpread: MergeDeep<FooTuple, BarTuple, {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectTypeOf(fooBarTupleSpread).toEqualTypeOf<[FooBarSpread, [FooBarSpread[], 'a', 'b'], 'bar', true]>();

declare const fooBarTupleReplace: MergeDeep<FooTuple, BarTuple, {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectTypeOf(fooBarTupleReplace).toEqualTypeOf<[FooBarReplace, [FooBarReplace[], 'a', 'b'], 'bar', true]>();

// Should merge array into tuple with object entries
type FooNumberTuple = [Foo[], number[]];
type BarArray2D = Bar[][];

declare const fooNumberTupleBarArray2DSpread: MergeDeep<FooNumberTuple, BarArray2D, {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectTypeOf(fooNumberTupleBarArray2DSpread).toEqualTypeOf<[FooBarSpread[], Array<number | Bar>, ...BarArray2D]>();

declare const fooNumberTupleBarArray2DReplace: MergeDeep<FooNumberTuple, BarArray2D, {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectTypeOf(fooNumberTupleBarArray2DReplace).toEqualTypeOf<[FooBarReplace[], Bar[], ...BarArray2D]>();

// Should merge tuple into array with object entries
type FooArray2D = Foo[][];
type BarNumberTuple = [Bar[], number[]];

declare const fooArray2DBarNumberTupleSpread: MergeDeep<FooArray2D, BarNumberTuple, {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectTypeOf(fooArray2DBarNumberTupleSpread).toEqualTypeOf<[FooBarSpread[], Array<Foo | number>, ...FooArray2D]>();

declare const fooArray2DBarNumberTupleReplace: MergeDeep<FooArray2D, BarNumberTuple, {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectTypeOf(fooArray2DBarNumberTupleReplace).toEqualTypeOf<[FooBarReplace[], number[], ...FooArray2D]>();

// Should merge array into tuple with object entries and variadic length
declare const arrayIntoTupleWithVariadicSpread: MergeDeep<[number, Foo, ...Foo[]], Bar[], {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectTypeOf(arrayIntoTupleWithVariadicSpread).toEqualTypeOf<[Bar, FooBarSpread, ...FooBarSpread[]]>();

declare const arrayIntoTupleWithVariadicReplace: MergeDeep<[number, Foo, ...Foo[]], Bar[], {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectTypeOf(arrayIntoTupleWithVariadicReplace).toEqualTypeOf<[Bar, FooBarReplace, ...FooBarReplace[]]>();

// Should merge tuple into array with object entries and variadic length
declare const tupleIntoArrayWithVariadicSpread: MergeDeep<Foo[], [number, Bar, ...Bar[]], {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectTypeOf(tupleIntoArrayWithVariadicSpread).toEqualTypeOf<[number, FooBarSpread, ...FooBarSpread[]]>();

declare const tupleIntoArrayWithVariadicReplace: MergeDeep<Foo[], [number, Bar, ...Bar[]], {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectTypeOf(tupleIntoArrayWithVariadicReplace).toEqualTypeOf<[number, FooBarReplace, ...FooBarReplace[]]>();

// Should merge tuple into tuple with object entries and variadic length
declare const tupleIntoTupleWithVariadicSpread: MergeDeep<[number, ...Foo[]], [Bar, Bar, ...Bar[]], {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectTypeOf(tupleIntoTupleWithVariadicSpread).toEqualTypeOf<[Bar, FooBarSpread, ...FooBarSpread[]]>();

declare const tupleIntoTupleWithVariadicSpreadReversed: MergeDeep<[Foo, ...Foo[]], [number, Bar, ...Bar[]], {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectTypeOf(tupleIntoTupleWithVariadicSpreadReversed).toEqualTypeOf<[number, FooBarSpread, ...FooBarSpread[]]>();

declare const tupleIntoTupleWithVariadicReplace: MergeDeep<[number, ...Foo[]], [Bar, Bar, ...Bar[]], {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectTypeOf(tupleIntoTupleWithVariadicReplace).toEqualTypeOf<[Bar, FooBarReplace, ...FooBarReplace[]]>();

declare const tupleIntoTupleWithVariadicReplaceReversed: MergeDeep<[Foo, ...Foo[]], [number, Bar, ...Bar[]], {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectTypeOf(tupleIntoTupleWithVariadicReplaceReversed).toEqualTypeOf<[number, FooBarReplace, ...FooBarReplace[]]>();
