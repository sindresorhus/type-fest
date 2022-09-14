import {expectType} from 'tsd';
import type {MergeDeep, MergeDeepOptions} from '../index';

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
expectType<never>(mergeDeep(undefined, undefined));
expectType<never>(mergeDeep({}, undefined));
expectType<never>(mergeDeep(undefined, {}));

// Should merge simple objects
expectType<{a: string; b: number}>(mergeDeep({a: 'life'}, {b: 42}));
expectType<{a: 'life'; b: number}>(mergeDeep({a: 'life'} as const, {b: 42}));
expectType<{a: string; b: 42}>(mergeDeep({a: 'life'}, {b: 42} as const));
expectType<{a: 'life'; b: 42}>(mergeDeep({a: 'life'} as const, {b: 42} as const));

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
expectType<number[]>(mergeDeep(['life'], [42], {arrayMergeMode: 'replace'}));
expectType<number[]>(mergeDeep(['life'] as const, [42], {arrayMergeMode: 'replace'}));
expectType<readonly [42]>(mergeDeep(['life'], [42] as const, {arrayMergeMode: 'replace'}));
expectType<readonly [42]>(mergeDeep(['life'] as const, [42] as const, {arrayMergeMode: 'replace'}));

// Should union simple arrays/tuples
expectType<string[] | number[]>(mergeDeep(['life'], [42], {arrayMergeMode: 'union'}));
expectType<readonly ['life'] | number[]>(mergeDeep(['life'] as const, [42], {arrayMergeMode: 'union'}));
expectType<string[] | readonly [42]>(mergeDeep(['life'], [42] as const, {arrayMergeMode: 'union'}));
expectType<readonly ['life'] | readonly [42]>(mergeDeep(['life'] as const, [42] as const, {arrayMergeMode: 'union'}));

// Should merge tuples with union
expectType<Array<number | string | boolean>>(mergeDeep(['life', true], [42], {arrayMergeMode: 'spread'}));
expectType<number[] | Array<string | boolean>>(mergeDeep(['life', true], [42], {arrayMergeMode: 'union'}));
expectType<Array<number | string | boolean>>(mergeDeep(['life'], [42, true], {arrayMergeMode: 'spread'}));
expectType<string[] | Array<number | boolean>>(mergeDeep(['life'], [42, true], {arrayMergeMode: 'union'}));

// Sould merge simple types
type Foo = {foo: string; fooBar: unknown; items: string[]};
type Bar = {bar: number; fooBar: boolean; items: number[]};

declare const fooBar: MergeDeep<Foo, Bar>;
expectType<{foo: string; bar: number; fooBar: boolean; items: Array<string | number>}>(fooBar);

declare const fooBarSpread: MergeDeep<Foo, Bar, {arrayMergeMode: 'spread'}>;
expectType<{foo: string; bar: number; fooBar: boolean; items: Array<string | number>}>(fooBarSpread);

declare const fooBarReplace: MergeDeep<Foo, Bar, {arrayMergeMode: 'replace'}>;
expectType<{foo: string; bar: number; fooBar: boolean; items: number[]}>(fooBarReplace);

declare const fooBarUnion: MergeDeep<Foo, Bar, {arrayMergeMode: 'union'}>;
expectType<{foo: string; bar: number; fooBar: boolean; items: string[] | number[]}>(fooBarUnion);

// Sould merge types deep
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
		items: Array<string | number>;
	};
	items: {
		foo: Foo[];
		bar: Bar[];
		fooBar: {
			foo: string;
			bar: number;
			fooBar: boolean;
			items: Array<string | number>;
		};
	};
}>(fooBarDeep);

// Sould merge types with index signatures deep
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
		items: Array<string | number>;
	};
	items: Array<string | number>;
}>(fooBarWithIndexSignature);

// Sould merge types with optional properties deep
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
		items: Array<string | number>;
	};
	fooBarOptional?: {
		foo: string;
		bar: number;
		fooBar: boolean;
		items: Array<string | number>;
	};
}>(fooBarWithOptional);

// Should merge arrays with object entries
type FooArray = Foo[];
type BarArray = Bar[];

declare const fooBarArray: MergeDeep<FooArray, BarArray>;
expectType<Array<Foo | Bar>>(fooBarArray);

declare const fooBarArraySpread: MergeDeep<FooArray, BarArray, {arrayMergeMode: 'spread'}>;
expectType<Array<Foo | Bar>>(fooBarArraySpread);

declare const fooBarArrayReplace: MergeDeep<FooArray, BarArray, {arrayMergeMode: 'replace'}>;
expectType<BarArray>(fooBarArrayReplace);

declare const fooBarArrayUnion: MergeDeep<FooArray, BarArray, {arrayMergeMode: 'union'}>;
expectType<FooArray | BarArray>(fooBarArrayUnion);

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

declare const fooBarArrayUnionRecursive: MergeDeep<FooArray, BarArray, {arrayMergeMode: 'union'; recurseIntoArrays: true}>;
expectType<Array<{
	foo: string;
	bar: number;
	fooBar: boolean;
	items: string[] | number[];
}>>(fooBarArrayUnionRecursive);

declare const fooBarArraySpreadRecursiveFallback: MergeDeep<FooArray, string[], {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectType<Array<string | Foo>>(fooBarArraySpreadRecursiveFallback);

declare const fooBarArrayReplaceRecursiveFallback: MergeDeep<FooArray, string[], {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectType<string[]>(fooBarArrayReplaceRecursiveFallback);

declare const fooBarArrayUnionRecursiveFallback: MergeDeep<FooArray, string[], {arrayMergeMode: 'union'; recurseIntoArrays: true}>;
expectType<FooArray | string[]>(fooBarArrayUnionRecursiveFallback);

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
type FooBarUnion = typeof fooBarUnion;

declare const fooBarTupleSpread: MergeDeep<FooTuple, BarTuple, {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectType<[FooBarSpread, [FooBarSpread[], 'a', 'b'], 'bar', true]>(fooBarTupleSpread);

declare const fooBarTupleReplace: MergeDeep<FooTuple, BarTuple, {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectType<[FooBarReplace, [FooBarReplace[], 'a', 'b'], 'bar', true]>(fooBarTupleReplace);

declare const fooBarTupleUnion: MergeDeep<FooTuple, BarTuple, {arrayMergeMode: 'union'; recurseIntoArrays: true}>;
expectType<[FooBarUnion, [FooBarUnion[], 'a', 'b'], 'bar', true]>(fooBarTupleUnion);

// Should merge array into tuple with object entries
type FooNumberTuple = [Foo[], number[]];
type BarArray2D = Bar[][];

declare const fooNumberTupleBarArray2DSpread: MergeDeep<FooNumberTuple, BarArray2D, {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectType<[FooBarSpread[], Array<number | Bar>, ...BarArray2D]>(fooNumberTupleBarArray2DSpread);

declare const fooNumberTupleBarArray2DReplace: MergeDeep<FooNumberTuple, BarArray2D, {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectType<[FooBarReplace[], Bar[], ...BarArray2D]>(fooNumberTupleBarArray2DReplace);

declare const fooNumberTupleBarArray2DUnion: MergeDeep<FooNumberTuple, BarArray2D, {arrayMergeMode: 'union'; recurseIntoArrays: true}>;
expectType<[FooBarUnion[], number[] | Bar[], ...BarArray2D]>(fooNumberTupleBarArray2DUnion);

// Should merge tuple into array with object entries
type FooArray2D = Foo[][];
type BarNumberTuple = [Bar[], number[]];

declare const fooArray2DBarNumberTupleSpread: MergeDeep<FooArray2D, BarNumberTuple, {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectType<[FooBarSpread[], Array<Foo | number>, ...FooArray2D]>(fooArray2DBarNumberTupleSpread);

declare const fooArray2DBarNumberTupleReplace: MergeDeep<FooArray2D, BarNumberTuple, {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectType<[FooBarReplace[], number[], ...FooArray2D]>(fooArray2DBarNumberTupleReplace);

declare const fooArray2DBarNumberTupleUnion: MergeDeep<FooArray2D, BarNumberTuple, {arrayMergeMode: 'union'; recurseIntoArrays: true}>;
expectType<[FooBarUnion[], Foo[] | number[], ...FooArray2D]>(fooArray2DBarNumberTupleUnion);

// Should merge array into tuple with object entries and variadic length
declare const arrayIntoTupleWithVariadicSpread: MergeDeep<[number, Foo, ...Foo[]], Bar[], {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectType<[Bar, FooBarSpread, ...FooBarSpread[]]>(arrayIntoTupleWithVariadicSpread);

declare const arrayIntoTupleWithVariadicReplace: MergeDeep<[number, Foo, ...Foo[]], Bar[], {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectType<[Bar, FooBarReplace, ...FooBarReplace[]]>(arrayIntoTupleWithVariadicReplace);

declare const arrayIntoTupleWithVariadicUnion: MergeDeep<[number, Foo, ...Foo[]], Bar[], {arrayMergeMode: 'union'; recurseIntoArrays: true}>;
expectType<[Bar, FooBarUnion, ...FooBarUnion[]]>(arrayIntoTupleWithVariadicUnion);

// Should merge tuple into array with object entries and variadic length
declare const tupleIntoArrayWithVariadicSpread: MergeDeep<Foo[], [number, Bar, ...Bar[]], {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectType<[number, FooBarSpread, ...FooBarSpread[]]>(tupleIntoArrayWithVariadicSpread);

declare const tupleIntoArrayWithVariadicReplace: MergeDeep<Foo[], [number, Bar, ...Bar[]], {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectType<[number, FooBarReplace, ...FooBarReplace[]]>(tupleIntoArrayWithVariadicReplace);

declare const tupleIntoArrayWithVariadicUnion: MergeDeep<Foo[], [number, Bar, ...Bar[]], {arrayMergeMode: 'union'; recurseIntoArrays: true}>;
expectType<[number, FooBarUnion, ...FooBarUnion[]]>(tupleIntoArrayWithVariadicUnion);

// Should merge tuple into tuple with object entries and variadic length
declare const tupleIntoTupleWithVariadicSpread: MergeDeep<[number, ...Foo[]], [Bar, Bar, ...Bar[]], {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectType<[Bar, FooBarSpread, ...FooBarSpread[]]>(tupleIntoTupleWithVariadicSpread);

declare const tupleIntoTupleWithVariadicSpreadReversed: MergeDeep<[Foo, ...Foo[]], [number, Bar, ...Bar[]], {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectType<[number, FooBarSpread, ...FooBarSpread[]]>(tupleIntoTupleWithVariadicSpreadReversed);

declare const tupleIntoTupleWithVariadicReplace: MergeDeep<[number, ...Foo[]], [Bar, Bar, ...Bar[]], {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectType<[Bar, FooBarReplace, ...FooBarReplace[]]>(tupleIntoTupleWithVariadicReplace);

declare const tupleIntoTupleWithVariadicReplaceReversed: MergeDeep<[Foo, ...Foo[]], [number, Bar, ...Bar[]], {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectType<[number, FooBarReplace, ...FooBarReplace[]]>(tupleIntoTupleWithVariadicReplaceReversed);

declare const tupleIntoTupleWithVariadicUnion: MergeDeep<[number, ...Foo[]], [Bar, Bar, ...Bar[]], {arrayMergeMode: 'union'; recurseIntoArrays: true}>;
expectType<[Bar, FooBarUnion, ...FooBarUnion[]]>(tupleIntoTupleWithVariadicUnion);

declare const tupleIntoTupleWithVariadicUnionReversed: MergeDeep<[Foo, ...Foo[]], [number, Bar, ...Bar[]], {arrayMergeMode: 'union'; recurseIntoArrays: true}>;
expectType<[number, FooBarUnion, ...FooBarUnion[]]>(tupleIntoTupleWithVariadicUnionReversed);
