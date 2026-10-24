import {expectTypeOf} from 'nz';
import type {MergeDeep, MergeDeepOptions, TupleOf} from '../index.d.ts';

// Test helper.
declare function mergeDeep<
	Destination,
	Source,
	Options extends MergeDeepOptions = {},
>(destination: Destination, source: Source, options?: Options): MergeDeep<Destination, Source, Options>;

// Test valid signatures for objects.
expectTypeOf(mergeDeep({}, {})).toBe<{}>();
expectTypeOf(mergeDeep({} as const, {})).toBe<{}>();
expectTypeOf(mergeDeep({}, {} as const)).toBe<{}>();
expectTypeOf(mergeDeep({} as const, {} as const)).toBe<{}>();

// Test valid signatures for arrays/tuples.
expectTypeOf(mergeDeep([], [])).toBe<never[]>();
expectTypeOf(mergeDeep([] as const, [])).toBe<never[]>();
expectTypeOf(mergeDeep([], [] as const)).toBe<never[]>();
expectTypeOf(mergeDeep([] as const, [] as const)).toBe<never[]>();

// Test invalid signatures.
expectTypeOf(mergeDeep({}, [])).toBe<never>();
expectTypeOf(mergeDeep([], {})).toBe<never>();
expectTypeOf(mergeDeep(null, {})).toBe<never>();
expectTypeOf(mergeDeep([], 'life')).toBe<never>();
expectTypeOf(mergeDeep([], new Set())).toBe<never>();
expectTypeOf(mergeDeep(new Set(), new Set())).toBe<never>();
expectTypeOf(mergeDeep(new Map(), new Map())).toBe<never>();
expectTypeOf(mergeDeep(undefined, undefined)).toBe<never>();
expectTypeOf(mergeDeep({}, undefined)).toBe<never>();
expectTypeOf(mergeDeep(undefined, {})).toBe<never>();

// Should merge simple objects
expectTypeOf(mergeDeep({a: 'life'}, {b: 42})).toBe<{a: string; b: number}>();
expectTypeOf(mergeDeep({a: 'life'} as const, {b: 42})).toBe<{readonly a: 'life'; b: number}>();
expectTypeOf(mergeDeep({a: 'life'}, {b: 42} as const)).toBe<{a: string; readonly b: 42}>();
expectTypeOf(mergeDeep({a: 'life'} as const, {b: 42} as const)).toBe<{readonly a: 'life'; readonly b: 42}>();

// Should spread simple arrays/tuples (default mode)
expectTypeOf(mergeDeep(['life'], [42])).toBe<Array<string | number>>();
expectTypeOf(mergeDeep(['life'] as const, [42])).toBe<Array<'life' | number>>();
expectTypeOf(mergeDeep(['life'], [42] as const)).toBe<Array<string | 42>>();
expectTypeOf(mergeDeep(['life'] as const, [42] as const)).toBe<Array<'life' | 42>>();

expectTypeOf(mergeDeep(['life'], [42], {arrayMergeMode: 'spread'})).toBe<Array<string | number>>();
expectTypeOf(mergeDeep(['life'] as const, [42], {arrayMergeMode: 'spread'})).toBe<Array<'life' | number>>();
expectTypeOf(mergeDeep(['life'], [42] as const, {arrayMergeMode: 'spread'})).toBe<Array<string | 42>>();
expectTypeOf(mergeDeep(['life'] as const, [42] as const, {arrayMergeMode: 'spread'})).toBe<Array<'life' | 42>>();

// Should replace simple arrays/tuples
expectTypeOf(mergeDeep(['life'], [42], {arrayMergeMode: 'replace'})).toBe<Array<string | number>>();
expectTypeOf(mergeDeep(['life'] as const, [42], {arrayMergeMode: 'replace'})).toBe<Array<'life' | number>>();
expectTypeOf(mergeDeep(['life'], [42] as const, {arrayMergeMode: 'replace'})).toBe<Array<string | 42>>();
expectTypeOf(mergeDeep(['life'] as const, [42] as const, {arrayMergeMode: 'replace'})).toBe<Array<'life' | 42>>();

// Should merge tuples with union
declare const stringsOrBooleans: Array<string | boolean>;
expectTypeOf(mergeDeep(stringsOrBooleans, [42], {arrayMergeMode: 'spread'})).toBe<Array<number | string | boolean>>();
expectTypeOf(mergeDeep(['life'], [42, true as const], {arrayMergeMode: 'spread'})).toBe<Array<number | string | true>>();

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
expectTypeOf(mergedClass).toBe<{ClassConstructor: typeof ClassB}>();
expectTypeOf(instance).toBe<ClassB>();
// @ts-expect-error
const _a: unknown = instance.bar;

// Should merge simple types
type Foo = {foo: string; fooBar: unknown; items: string[]};
type Bar = {bar: number; fooBar: boolean; items: number[]};

declare const fooBar: MergeDeep<Foo, Bar>;
expectTypeOf(fooBar).toBe<{foo: string; bar: number; fooBar: boolean; items: number[]}>();

declare const fooBarSpread: MergeDeep<Foo, Bar, {arrayMergeMode: 'spread'}>;
expectTypeOf(fooBarSpread).toBe<{foo: string; bar: number; fooBar: boolean; items: Array<string | number>}>();

declare const fooBarReplace: MergeDeep<Foo, Bar, {arrayMergeMode: 'replace'}>;
expectTypeOf(fooBarReplace).toBe<{foo: string; bar: number; fooBar: boolean; items: number[]}>();

// Should merge types deep
type FooDeep = {foo: Foo; fooBar: Foo; items: {foo: Foo[]; fooBar: Foo}};
type BarDeep = {bar: Bar; fooBar: Bar; items: {bar: Bar[]; fooBar: Bar}};

declare const fooBarDeep: MergeDeep<FooDeep, BarDeep>;
expectTypeOf(fooBarDeep).toBe<{
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
expectTypeOf(fooBarWithIndexSignature).toBe<{
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
expectTypeOf(fooBarWithOptional).toBe<{
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
}>();

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
expectTypeOf(mergedFooBar).toBe<MergedFooBar>();
declare const mergedBarFoo: MergeDeep<FooOptional, BarOptional>;
expectTypeOf(mergedBarFoo).toBe<MergedFooBar>();

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
expectTypeOf(readonlyTest).toBe<{
	readonly string: string;
	number: number;
	readonly boolean: boolean;
}>();

// Should merge arrays with object entries
type FooArray = Foo[];
type BarArray = Bar[];

declare const fooBarArray: MergeDeep<FooArray, BarArray>;
expectTypeOf(fooBarArray).toBe<Array<Foo | Bar>>();

declare const fooBarArraySpread: MergeDeep<FooArray, BarArray, {arrayMergeMode: 'spread'}>;
expectTypeOf(fooBarArraySpread).toBe<Array<Foo | Bar>>();

declare const fooBarArrayReplace: MergeDeep<FooArray, BarArray, {arrayMergeMode: 'replace'}>;
expectTypeOf(fooBarArrayReplace).toBe<Array<Foo | Bar>>();

declare const fooBarArraySpreadRecursive: MergeDeep<FooArray, BarArray, {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectTypeOf(fooBarArraySpreadRecursive).toBe<Array<{
	foo: string;
	bar: number;
	fooBar: boolean;
	items: Array<string | number>;
}>>();

declare const fooBarArrayReplaceRecursive: MergeDeep<FooArray, BarArray, {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectTypeOf(fooBarArrayReplaceRecursive).toBe<Array<{
	foo: string;
	bar: number;
	fooBar: boolean;
	items: number[];
}>>();

declare const fooBarArraySpreadRecursiveFallback: MergeDeep<FooArray, string[], {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectTypeOf(fooBarArraySpreadRecursiveFallback).toBe<Array<string | Foo>>();

declare const fooBarArrayReplaceRecursiveFallback: MergeDeep<FooArray, string[], {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectTypeOf(fooBarArrayReplaceRecursiveFallback).toBe<Array<string | Foo>>();

declare const fooBarArrayDeepUnionRecursive: MergeDeep<FooArray[][], BarArray[][], {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectTypeOf(fooBarArrayDeepUnionRecursive).toBe<Array<Array<Array<{
	foo: string;
	bar: number;
	fooBar: boolean;
	items: Array<string | number>;
}>>>>();

declare const fooBarArrayDeepUnionRecursiveFallback: MergeDeep<FooArray[], BarArray[][], {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectTypeOf(fooBarArrayDeepUnionRecursiveFallback).toBe<Array<Array<Foo | BarArray>>>();

// Should merge tuples with object entries
type FooTuple = [Foo, [Foo[], 42], 'foo'];
type BarTuple = [Bar, [Bar[], 'a', 'b'], 'bar', true];

type FooBarSpread = typeof fooBarSpread;
type FooBarReplace = typeof fooBarReplace;

declare const fooBarTupleSpread: MergeDeep<FooTuple, BarTuple, {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectTypeOf(fooBarTupleSpread).toBe<[FooBarSpread, [FooBarSpread[], 'a', 'b'], 'bar', true]>();

declare const fooBarTupleReplace: MergeDeep<FooTuple, BarTuple, {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectTypeOf(fooBarTupleReplace).toBe<[FooBarReplace, [FooBarReplace[], 'a', 'b'], 'bar', true]>();

// Should merge array into tuple with object entries
type FooNumberTuple = [Foo[], number[]];
type BarArray2D = Bar[][];

declare const fooNumberTupleBarArray2DSpread: MergeDeep<FooNumberTuple, BarArray2D, {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectTypeOf(fooNumberTupleBarArray2DSpread).toBe<[FooBarSpread[], Array<number | Bar>, ...BarArray2D]>();

declare const fooNumberTupleBarArray2DReplace: MergeDeep<FooNumberTuple, BarArray2D, {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectTypeOf(fooNumberTupleBarArray2DReplace).toBe<[FooBarReplace[], Bar[], ...BarArray2D]>();

// Should merge tuple into array with object entries
type FooArray2D = Foo[][];
type BarNumberTuple = [Bar[], number[]];

declare const fooArray2DBarNumberTupleSpread: MergeDeep<FooArray2D, BarNumberTuple, {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectTypeOf(fooArray2DBarNumberTupleSpread).toBe<[FooBarSpread[], Array<Foo | number>, ...FooArray2D]>();

declare const fooArray2DBarNumberTupleReplace: MergeDeep<FooArray2D, BarNumberTuple, {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectTypeOf(fooArray2DBarNumberTupleReplace).toBe<[FooBarReplace[], number[], ...FooArray2D]>();

// Should merge array into tuple with object entries and variadic length
declare const arrayIntoTupleWithVariadicSpread: MergeDeep<[number, Foo, ...Foo[]], Bar[], {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectTypeOf(arrayIntoTupleWithVariadicSpread).toBe<[Bar, FooBarSpread, ...FooBarSpread[]]>();

declare const arrayIntoTupleWithVariadicReplace: MergeDeep<[number, Foo, ...Foo[]], Bar[], {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectTypeOf(arrayIntoTupleWithVariadicReplace).toBe<[Bar, FooBarReplace, ...FooBarReplace[]]>();

// Should merge tuple into array with object entries and variadic length
declare const tupleIntoArrayWithVariadicSpread: MergeDeep<Foo[], [number, Bar, ...Bar[]], {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectTypeOf(tupleIntoArrayWithVariadicSpread).toBe<[number, FooBarSpread, ...FooBarSpread[]]>();

declare const tupleIntoArrayWithVariadicReplace: MergeDeep<Foo[], [number, Bar, ...Bar[]], {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectTypeOf(tupleIntoArrayWithVariadicReplace).toBe<[number, FooBarReplace, ...FooBarReplace[]]>();

// Should merge tuple into tuple with object entries and variadic length
declare const tupleIntoTupleWithVariadicSpread: MergeDeep<[number, ...Foo[]], [Bar, Bar, ...Bar[]], {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectTypeOf(tupleIntoTupleWithVariadicSpread).toBe<[Bar, FooBarSpread, ...FooBarSpread[]]>();

declare const tupleIntoTupleWithVariadicSpreadReversed: MergeDeep<[Foo, ...Foo[]], [number, Bar, ...Bar[]], {arrayMergeMode: 'spread'; recurseIntoArrays: true}>;
expectTypeOf(tupleIntoTupleWithVariadicSpreadReversed).toBe<[number, FooBarSpread, ...FooBarSpread[]]>();

declare const tupleIntoTupleWithVariadicReplace: MergeDeep<[number, ...Foo[]], [Bar, Bar, ...Bar[]], {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectTypeOf(tupleIntoTupleWithVariadicReplace).toBe<[Bar, FooBarReplace, ...FooBarReplace[]]>();

declare const tupleIntoTupleWithVariadicReplaceReversed: MergeDeep<[Foo, ...Foo[]], [number, Bar, ...Bar[]], {arrayMergeMode: 'replace'; recurseIntoArrays: true}>;
expectTypeOf(tupleIntoTupleWithVariadicReplaceReversed).toBe<[number, FooBarReplace, ...FooBarReplace[]]>();

type RecordNotPartial = {
	name: string;
	type: string;
	b: {bb?: string; cc: string};
};
type RecordPartial = Partial<RecordNotPartial>;

expectTypeOf<MergeDeep<RecordPartial, RecordNotPartial>>().toBe<RecordNotPartial>();
expectTypeOf<MergeDeep<RecordNotPartial, RecordPartial>>().toBe<RecordPartial>();

type NotOptional = {a: string; b: number; c: boolean};
type OptionalWithUndefined = {a: string | undefined; b?: number; c?: boolean | undefined};

expectTypeOf<MergeDeep<NotOptional, OptionalWithUndefined>>().toBe<OptionalWithUndefined>();
expectTypeOf<MergeDeep<OptionalWithUndefined, NotOptional>>().toBe<NotOptional>();

// An empty destination has no element to merge with, so the merge mode decides the result.
declare const emptyDestinationReplace: MergeDeep<{foo: []}, {foo: [1, 2]}, {recurseIntoArrays: true; arrayMergeMode: 'replace'}>;
expectTypeOf(emptyDestinationReplace).toBe<{foo: [1, 2]}>();

declare const emptyDestinationSpread: MergeDeep<{foo: []}, {foo: [1, 2]}, {recurseIntoArrays: true; arrayMergeMode: 'spread'}>;
expectTypeOf(emptyDestinationSpread).toBe<{foo: [1, 2]}>();

declare const emptyDestinationArray: MergeDeep<{foo: []}, {foo: number[]}, {recurseIntoArrays: true; arrayMergeMode: 'replace'}>;
expectTypeOf(emptyDestinationArray).toBe<{foo: number[]}>();

// A trailing optional element is merged like any other element, instead of collapsing to `never`.
declare const optionalTailTuple: MergeDeep<[string, string?], [number, number?], {recurseIntoArrays: true}>;
expectTypeOf(optionalTailTuple).toBe<[number, number?]>();

// A tuple element merged with an array element keeps its optional modifier, just like when merging two tuples.
declare const tupleWithOptionalTailIntoArray: MergeDeep<{foo: [string, number?]}, {foo: string[]}, {recurseIntoArrays: true; arrayMergeMode: 'spread'}>;
expectTypeOf(tupleWithOptionalTailIntoArray).toBe<{foo: [string, string?, ...string[]]}>();

declare const arrayIntoTupleWithOptionalTail: MergeDeep<{foo: string[]}, {foo: [string, number?]}, {recurseIntoArrays: true; arrayMergeMode: 'spread'}>;
expectTypeOf(arrayIntoTupleWithOptionalTail).toBe<{foo: [string, number?, ...string[]]}>();

declare const topLevelTupleWithOptionalTailIntoArray: MergeDeep<[string, number?], string[], {recurseIntoArrays: true; arrayMergeMode: 'spread'}>;
expectTypeOf(topLevelTupleWithOptionalTailIntoArray).toBe<[string, string?, ...string[]]>();

// The optional modifier is also kept when the optional element is followed by a rest element.
declare const optionalTailWithRestTuple: MergeDeep<[string, string?, ...string[]], [number, number?, ...number[]], {recurseIntoArrays: true}>;
expectTypeOf(optionalTailWithRestTuple).toBe<[number, number?, ...number[]]>();

declare const optionalTailWithRestTupleIntoArray: MergeDeep<[string, string?, ...string[]], number[], {recurseIntoArrays: true; arrayMergeMode: 'spread'}>;
expectTypeOf(optionalTailWithRestTupleIntoArray).toBe<[number, number?, ...Array<string | number>]>();

declare const arrayIntoOptionalTailWithRestTuple: MergeDeep<number[], [string, string?, ...string[]], {recurseIntoArrays: true; arrayMergeMode: 'spread'}>;
expectTypeOf(arrayIntoOptionalTailWithRestTuple).toBe<[string, string?, ...Array<string | number>]>();

// A source property that is only `undefined` replaces the destination property, just like object spread does at runtime. It must not collapse the property to `never`.
declare const sourceUndefinedReplacesDestination: MergeDeep<{a: {b: 1}}, {a: undefined}>;
expectTypeOf(sourceUndefinedReplacesDestination).toBe<{a: undefined}>();

declare const sourceUndefinedReplacesPrimitive: MergeDeep<{a: string}, {a: undefined}>;
expectTypeOf(sourceUndefinedReplacesPrimitive).toBe<{a: undefined}>();

declare const sourceUndefinedReplacesArray: MergeDeep<{a: string[]}, {a: undefined}>;
expectTypeOf(sourceUndefinedReplacesArray).toBe<{a: undefined}>();

declare const sourceUndefinedReplacesTuple: MergeDeep<{a: [1, 2]}, {a: undefined}>;
expectTypeOf(sourceUndefinedReplacesTuple).toBe<{a: undefined}>();

// An empty source array contains no indices, so the destination value is returned, the same way it is when the source does not have the key at all.
declare const emptySourceTuple: MergeDeep<[1, 2, 3], [], {recurseIntoArrays: true}>;
expectTypeOf(emptySourceTuple).toBe<[1, 2, 3]>();

declare const emptySourceNested: MergeDeep<{a: [1, 2]}, {a: []}, {recurseIntoArrays: true}>;
expectTypeOf(emptySourceNested).toBe<{a: [1, 2]}>();

declare const emptySourceWithSpreadMode: MergeDeep<[1, 2], [], {recurseIntoArrays: true; arrayMergeMode: 'spread'}>;
expectTypeOf(emptySourceWithSpreadMode).toBe<[1, 2]>();

declare const emptySourceArray: MergeDeep<number[], [], {recurseIntoArrays: true}>;
expectTypeOf(emptySourceArray).toBe<number[]>();

// By default inner arrays are replaced, which must not depend on whether the array sits at the top level or inside an object.
declare const nestedArrayReplacedInObject: MergeDeep<{a: number[][]}, {a: string[][]}, {recurseIntoArrays: true}>;
expectTypeOf(nestedArrayReplacedInObject).toBe<{a: string[][]}>();

declare const nestedArrayReplacedAtTopLevel: MergeDeep<number[][], string[][], {recurseIntoArrays: true}>;
expectTypeOf(nestedArrayReplacedAtTopLevel).toBe<string[][]>();

declare const nestedArraySpreadAtTopLevel: MergeDeep<number[][], string[][], {recurseIntoArrays: true; arrayMergeMode: 'spread'}>;
expectTypeOf(nestedArraySpreadAtTopLevel).toBe<Array<Array<string | number>>>();

// A `readonly` array does not keep its modifier through the spread, because the result is a fresh array. See the note in the docs.
declare const readonlyArrays: MergeDeep<readonly string[], readonly number[]>;
expectTypeOf(readonlyArrays).toBe<Array<string | number>>();

declare const readonlyArraysSpread: MergeDeep<readonly string[], readonly number[], {arrayMergeMode: 'spread'}>;
expectTypeOf(readonlyArraysSpread).toBe<Array<string | number>>();

// A source of `any` is a value of any type, so it has to win the way any other source does. `any` satisfies every assignability check, so without a guard for it the "source of only `undefined`" rule fired and the property was narrowed to `undefined`, which no object spread can produce.
declare const anySource: MergeDeep<{a: string}, {a: any}>;
expectTypeOf(anySource).toBe<{a: any}>();

declare const anySourceWithExtraKey: MergeDeep<{a: 1}, {a: any; b: 2}>;
expectTypeOf(anySourceWithExtraKey).toBe<{b: 2; a: any}>();

declare const anySourceOptional: MergeDeep<{a?: 1}, {a?: any}>;
expectTypeOf(anySourceOptional).toBe<{a?: any}>();

declare const anySourceTuple: MergeDeep<[1], [any], {recurseIntoArrays: true}>;
expectTypeOf(anySourceTuple).toBe<[any]>();

declare const anySourceElement: MergeDeep<{a: [1]}, {a: [any]}, {recurseIntoArrays: true}>;
expectTypeOf(anySourceElement).toBe<{a: [any]}>();

// A key the two operands share comes out with the modifiers of the source, whichever way round the two are written, because the mapped type that carries rule 3 is homomorphic over the source.
declare const modifiersFromSource: MergeDeep<{readonly a?: string}, {a: number}>;
expectTypeOf(modifiersFromSource).toBe<{a: number}>();

declare const modifiersFromSourceReversed: MergeDeep<{a: number}, {readonly a?: string}>;
expectTypeOf(modifiersFromSourceReversed).toBe<{readonly a?: string}>();

declare const bothReadonly: MergeDeep<{readonly a: string}, {readonly a: number}>;
expectTypeOf(bothReadonly).toBe<{readonly a: number}>();

declare const onlyDestinationReadonly: MergeDeep<{readonly a: string}, {b: number}>;
expectTypeOf(onlyDestinationReadonly).toBe<{readonly a: string; b: number}>();

declare const sharedKeyLeftOptional: MergeDeep<{a: string; b?: number}, {b?: string}>;
expectTypeOf(sharedKeyLeftOptional).toBe<{a: string; b?: string}>();

// A key only the source has is copied whole, so it keeps the source's own modifiers rather than either operand's modifier rules.
declare const onlySourceReadonly: MergeDeep<{a: 1}, {readonly b: 2}>;
expectTypeOf(onlySourceReadonly).toBe<{a: 1; readonly b: 2}>();

declare const onlySourceOptional: MergeDeep<{a: 1}, {b?: 2}>;
expectTypeOf(onlySourceOptional).toBe<{a: 1; b?: 2}>();

declare const onlySourceReadonlyOptional: MergeDeep<{a: 1}, {readonly b?: 2}>;
expectTypeOf(onlySourceReadonlyOptional).toBe<{a: 1; readonly b?: 2}>();

// A shared key that is a record on both sides is merged, and the merged record keeps the source's modifier rather than either contributor's.
declare const mergedRecordModifier: MergeDeep<{readonly a?: {x: string}}, {a: {y: number}}>;
expectTypeOf(mergedRecordModifier).toBe<{a: {x: string; y: number}}>();

declare const mergedRecordOptional: MergeDeep<{a: {x: string}}, {a?: {y: number}}>;
expectTypeOf(mergedRecordOptional).toBe<{a?: {x: string; y: number}}>();

// `any` satisfies every assignability check, so the guard that asks whether `undefined` can reach the result fired for a destination of `any` and narrowed the whole merge to `never`, which accepts nothing at all. `MergeDeep` already guards `any` per property, and `ObjectMerge` returns `any` for the same input.
declare const topTypeDestination: MergeDeep<any, {b: 2}>;
expectTypeOf(topTypeDestination).toBe<any>();

declare const topTypeBoth: MergeDeep<any, any>;
expectTypeOf(topTypeBoth).toBe<any>();

// A source of `any` is returned as it is too, the same as a destination of `any`: a merge with a value of any shape has no shape of its own to work out.
declare const topTypeSourceNamed: MergeDeep<{a: 1}, any>;
expectTypeOf(topTypeSourceNamed).toBe<any>();

// A key under an index signature both records share may be in either record or in both, so its value is the destination's, the source's, or the two merged.
type FooSharedIndexSignature = {[x: string]: {b: string}};
type BarSharedIndexSignature = {[x: string]: {c: number}};

declare const fooBarSharedIndexSignature: MergeDeep<FooSharedIndexSignature, BarSharedIndexSignature>;
expectTypeOf(fooBarSharedIndexSignature).toBe<{[x: string]: {b: string} | {c: number} | {b: string; c: number}}>();

type FooSharedNumberIndexSignature = {[x: number]: {b: string}};
type BarSharedNumberIndexSignature = {[x: number]: {c: number}};

declare const fooBarSharedNumberIndexSignature: MergeDeep<FooSharedNumberIndexSignature, BarSharedNumberIndexSignature>;
expectTypeOf(fooBarSharedNumberIndexSignature).toBe<{[x: number]: {b: string} | {c: number} | {b: string; c: number}}>();

// A signature only one record has is left as it is, and a named key is still merged next to it.
type FooOnlyDestinationSignature = {[x: string]: unknown; shared: {d: string}};
type BarOnlySourceSignature = {[x: symbol]: unknown; shared: {e: string}};

declare const fooBarMixedSignatures: MergeDeep<FooOnlyDestinationSignature, BarOnlySourceSignature>;
expectTypeOf(fooBarMixedSignatures).toBe<{[x: string]: unknown; [x: symbol]: unknown; shared: {d: string; e: string}}>();

// `object` is an object whose keys are unknown, so a merge with it is inside the domain of this type, but it is not assignable to `UnknownRecord`, which used to drop the whole merge to `never`, a type that accepts nothing at all. Nothing can be said about the result beyond `object` itself, which is also what the shallow `Merge` answers for `Merge<object, object>`.
declare const objectBoth: MergeDeep<object, object>;
expectTypeOf(objectBoth).toBe<object>();

declare const objectDestination: MergeDeep<object, {a: 1}>;
expectTypeOf(objectDestination).toBe<{a: 1}>();

declare const objectSource: MergeDeep<{a: 1}, object>;
expectTypeOf(objectSource).toBe<{a: 1}>();

declare const objectArraySource: MergeDeep<string[], object>;
expectTypeOf(objectArraySource).toBe<never>();

// A source that is not an object at all is outside the documented domain, and still answers `never`.
declare const primitiveSource: MergeDeep<{a: 1}, string>;
expectTypeOf(primitiveSource).toBe<never>();

declare const emptyDestinationTopLevel: MergeDeep<[], [1], {recurseIntoArrays: true}>;
expectTypeOf(emptyDestinationTopLevel).toBe<[1]>();

// A signature describes keys either side may not have, so a key under a shared signature can hold either side's value alone, like the runtime merge of `{foo: {b: 'x'}}` and `{bar: {c: 1}}` does.
({foo: {b: 'x'}, bar: {c: 1}}) satisfies MergeDeep<{[x: string]: {b: string}}, {[x: string]: {c: number}}>;

// The keys of a generic destination and of the source stay readable on the result. A branch that answers `object` in the constraint would hide them.
function mergeDeepOfGeneric<Destination extends {a: {b: number}}>(merged: MergeDeep<Destination, {a: {c: 1}}>) {
	expectTypeOf(merged.a.b).toBe<number>();
	expectTypeOf(merged.a.c).toBe<1>();
}

function mergeDeepIntoGeneric<Source extends {a: {b: number}}>(merged: MergeDeep<{c: 1}, Source>) {
	expectTypeOf(merged.a.b).toBe<number>();
	expectTypeOf(merged.c).toBe<1>();
}

// A tuple containing only optional elements still has fixed positions and must not become an unbounded array.
declare const allOptionalTuples: MergeDeep<readonly [string?, boolean?], readonly [number?], {recurseIntoArrays: true}>;
expectTypeOf(allOptionalTuples).toBe<[number?, boolean?]>();

declare const allOptionalTupleIntoArray: MergeDeep<[string?], number[], {recurseIntoArrays: true}>;
expectTypeOf(allOptionalTupleIntoArray).toBe<[number?, ...number[]]>();

declare const arrayIntoAllOptionalTuple: MergeDeep<number[], [string?], {recurseIntoArrays: true}>;
expectTypeOf(arrayIntoAllOptionalTuple).toBe<[string?, ...number[]]>();

// Recursing into a merge still creates a fresh mutable array when an operand is an empty readonly tuple.
declare const readonlyEmptyDestination: MergeDeep<readonly [], readonly [1, 2], {recurseIntoArrays: true}>;
expectTypeOf(readonlyEmptyDestination).toBe<[1, 2]>();

declare const readonlyEmptySource: MergeDeep<readonly [1, 2], readonly [], {recurseIntoArrays: true}>;
expectTypeOf(readonlyEmptySource).toBe<[1, 2]>();

// Readonly tuples with a rest element merge the same as their mutable counterparts, position by position and rest with rest.
type ReplaceIntoArrays = {recurseIntoArrays: true; arrayMergeMode: 'replace'};

declare const readonlyTuplesWithRest: MergeDeep<readonly [{a: 1}, ...Array<{b: 1}>], readonly [{c: 1}, ...Array<{d: 1}>], ReplaceIntoArrays>;
expectTypeOf(readonlyTuplesWithRest).toBe<[{a: 1; c: 1}, ...Array<{b: 1; d: 1}>]>();

declare const readonlyTuplesWithRestNested: MergeDeep<{list: readonly [{a: 1}, ...Array<{b: 1}>]}, {list: readonly [{c: 1}, ...Array<{d: 1}>]}, ReplaceIntoArrays>;
expectTypeOf(readonlyTuplesWithRestNested).toBe<{list: [{a: 1; c: 1}, ...Array<{b: 1; d: 1}>]}>();

declare const readonlyTupleWithOptionalAndRest: MergeDeep<readonly [{a: 1}, {b: 1}?, ...Array<{c: 1}>], readonly [{d: 1}, ...Array<{e: 1}>], ReplaceIntoArrays>;
expectTypeOf(readonlyTupleWithOptionalAndRest).toBe<[{a: 1; d: 1}, {b: 1; e: 1}?, ...Array<{c: 1; e: 1}>]>();

declare const readonlyTupleWithMiddleRest: MergeDeep<readonly [{a: 1}, ...Array<{b: 1}>, {c: 1}], readonly [{d: 1}], ReplaceIntoArrays>;
expectTypeOf(readonlyTupleWithMiddleRest).toBe<[{a: 1; d: 1}, ...Array<{b: 1}>, {c: 1}]>();

declare const readonlyRestOnlyIntoTuple: MergeDeep<readonly [...Array<{a: 1}>], readonly [{b: 1}, {c: 1}], ReplaceIntoArrays>;
expectTypeOf(readonlyRestOnlyIntoTuple).toBe<[{a: 1; b: 1}, {a: 1; c: 1}, ...Array<{a: 1}>]>();

declare const readonlyOptionalTuples: MergeDeep<readonly [{a: 1}, {b: 1}?], readonly [{c: 1}?], ReplaceIntoArrays>;
expectTypeOf(readonlyOptionalTuples).toBe<[{a: 1; c: 1}, {b: 1}?]>();

// A readonly tuple and a readonly array of unknown length merge each tuple element with the array element.
declare const readonlyTupleIntoReadonlyArray: MergeDeep<ReadonlyArray<{a: 1}>, readonly [{b: 1}, ...Array<{c: 1}>], ReplaceIntoArrays>;
expectTypeOf(readonlyTupleIntoReadonlyArray).toBe<[{a: 1; b: 1}, ...Array<{a: 1; c: 1}>]>();

declare const readonlyArrayIntoReadonlyTuple: MergeDeep<readonly [{a: 1}, ...Array<{b: 1}>], ReadonlyArray<{c: 1}>, ReplaceIntoArrays>;
expectTypeOf(readonlyArrayIntoReadonlyTuple).toBe<[{a: 1; c: 1}, ...Array<{b: 1; c: 1}>]>();

// A readonly tuple of fixed length keeps its required and optional positions when it is merged with a readonly array.
declare const readonlyArrayIntoFixedReadonlyTuple: MergeDeep<readonly [{a: 1}, {b: 1}?], ReadonlyArray<{c: 1}>, ReplaceIntoArrays>;
expectTypeOf(readonlyArrayIntoFixedReadonlyTuple).toBe<[{a: 1; c: 1}, {b: 1; c: 1}?, ...Array<{c: 1}>]>();

declare const fixedReadonlyTupleIntoReadonlyArray: MergeDeep<ReadonlyArray<{c: 1}>, readonly [{a: 1}, {b: 1}?], ReplaceIntoArrays>;
expectTypeOf(fixedReadonlyTupleIntoReadonlyArray).toBe<[{c: 1; a: 1}, {c: 1; b: 1}?, ...Array<{c: 1}>]>();

declare const readonlyArrayIntoRequiredReadonlyTuple: MergeDeep<readonly [{a: 1}, {b: 1}], ReadonlyArray<{c: 1}>, ReplaceIntoArrays>;
expectTypeOf(readonlyArrayIntoRequiredReadonlyTuple).toBe<[{a: 1; c: 1}, {b: 1; c: 1}, ...Array<{c: 1}>]>();

declare const readonlyTupleSpreadIntoRest: MergeDeep<{list: readonly [{a: 1}, ...Array<{b: 1}>]}, {list: readonly [{c: 1}]}, {recurseIntoArrays: true; arrayMergeMode: 'spread'}>;
expectTypeOf(readonlyTupleSpreadIntoRest).toBe<{list: [{a: 1; c: 1}, ...Array<{b: 1}>]}>();

declare const readonlyNestedTuples: MergeDeep<{list: readonly [readonly [{a: 1}], ...string[]]}, {list: readonly [readonly [{b: 1}]]}, ReplaceIntoArrays>;
expectTypeOf(readonlyNestedTuples).toBe<{list: [[{a: 1; b: 1}], ...string[]]}>();

// A mutable and a readonly operand give the same fresh mutable array.
declare const mutableIntoReadonlyTuple: MergeDeep<readonly [{a: 1}, ...Array<{b: 1}>], [{c: 1}, ...Array<{d: 1}>], ReplaceIntoArrays>;
expectTypeOf(mutableIntoReadonlyTuple).toBe<[{a: 1; c: 1}, ...Array<{b: 1; d: 1}>]>();

declare const readonlyIntoMutableTuple: MergeDeep<[{a: 1}, ...Array<{b: 1}>], readonly [{c: 1}, ...Array<{d: 1}>], ReplaceIntoArrays>;
expectTypeOf(readonlyIntoMutableTuple).toBe<[{a: 1; c: 1}, ...Array<{b: 1; d: 1}>]>();

// Without recursing into arrays, the `replace` mode keeps the source array as is, including its `readonly` modifier.
declare const readonlyTupleReplacedAsIs: MergeDeep<{list: readonly [{a: 1}, ...Array<{b: 1}>]}, {list: readonly [{c: 1}]}, {arrayMergeMode: 'replace'}>;
expectTypeOf(readonlyTupleReplacedAsIs).toBe<{list: readonly [{c: 1}]}>();

declare const readonlyArrayReplacedAsIs: MergeDeep<{list: string[]}, {list: readonly number[]}, {arrayMergeMode: 'replace'}>;
expectTypeOf(readonlyArrayReplacedAsIs).toBe<{list: readonly number[]}>();

// An actual empty-array element replaces an incompatible value; it is distinct from a tuple having no element at that index.
declare const emptyArrayElementReplacesPrimitive: MergeDeep<[1], [[]], {recurseIntoArrays: true}>;
expectTypeOf(emptyArrayElementReplacesPrimitive).toBe<[[]]>();

declare const emptyArrayElementReplacesObject: MergeDeep<[{value: 1}], [[]], {recurseIntoArrays: true}>;
expectTypeOf(emptyArrayElementReplacesObject).toBe<[[]]>();

// A position is guaranteed to exist when either tuple declares it as required.
declare const requiredSourceElement: MergeDeep<[1?], [2], {recurseIntoArrays: true}>;
expectTypeOf(requiredSourceElement).toBe<[2]>();

declare const requiredDestinationElement: MergeDeep<[1], [2?], {recurseIntoArrays: true}>;
expectTypeOf(requiredDestinationElement).toBe<[2]>();

// A rest element of `never[]` has no elements, so the source elements past the destination's fixed elements are kept as they are.
declare const neverRestDestination: MergeDeep<[1, ...never[]], [2, 3], {recurseIntoArrays: true}>;
expectTypeOf(neverRestDestination).toBe<[2, 3, ...never[]]>();

declare const neverRestSource: MergeDeep<[1, 2], [3, ...never[]], {recurseIntoArrays: true}>;
expectTypeOf(neverRestSource).toBe<[3, 2, ...never[]]>();

// An empty tuple on either side, see https://github.com/sindresorhus/type-fest/issues/1200
type EmptyFoo = {foo: []};
type NotEmptyTupleFoo = {foo: [0, 1]};
type NotEmptyArrayFoo = {foo: number[]};
expectTypeOf<MergeDeep<NotEmptyTupleFoo, EmptyFoo, {recurseIntoArrays: true; arrayMergeMode: 'replace'}>>().toBe<NotEmptyTupleFoo>();
expectTypeOf<MergeDeep<NotEmptyArrayFoo, EmptyFoo, {recurseIntoArrays: true; arrayMergeMode: 'replace'}>>().toBe<NotEmptyArrayFoo>();
expectTypeOf<MergeDeep<NotEmptyTupleFoo, EmptyFoo, {recurseIntoArrays: true; arrayMergeMode: 'spread'}>>().toBe<NotEmptyTupleFoo>();
expectTypeOf<MergeDeep<EmptyFoo, NotEmptyArrayFoo, {recurseIntoArrays: true; arrayMergeMode: 'spread'}>>().toBe<NotEmptyArrayFoo>();
expectTypeOf<MergeDeep<NotEmptyArrayFoo, EmptyFoo, {recurseIntoArrays: true; arrayMergeMode: 'spread'}>>().toBe<NotEmptyArrayFoo>();

type EmptyReadonlyFoo = {readonly foo: []};
type NotEmptyReadonlyTupleFoo = {readonly foo: [0, 1]};
type NotEmptyReadonlyArrayFoo = {readonly foo: number[]};
expectTypeOf<MergeDeep<EmptyReadonlyFoo, NotEmptyReadonlyTupleFoo, {recurseIntoArrays: true; arrayMergeMode: 'replace'}>>().toBe<NotEmptyReadonlyTupleFoo>();
expectTypeOf<MergeDeep<NotEmptyReadonlyTupleFoo, EmptyReadonlyFoo, {recurseIntoArrays: true; arrayMergeMode: 'replace'}>>().toBe<NotEmptyReadonlyTupleFoo>();
expectTypeOf<MergeDeep<EmptyReadonlyFoo, NotEmptyReadonlyArrayFoo, {recurseIntoArrays: true; arrayMergeMode: 'replace'}>>().toBe<NotEmptyReadonlyArrayFoo>();
expectTypeOf<MergeDeep<NotEmptyReadonlyArrayFoo, EmptyReadonlyFoo, {recurseIntoArrays: true; arrayMergeMode: 'replace'}>>().toBe<NotEmptyReadonlyArrayFoo>();

type EmptyOptionalFoo = {foo?: []};
type NotEmptyOptionalTupleFoo = {foo?: [0, 1]};
type NotEmptyOptionalArrayFoo = {foo?: number[]};
expectTypeOf<MergeDeep<EmptyOptionalFoo, NotEmptyOptionalTupleFoo, {recurseIntoArrays: true; arrayMergeMode: 'replace'}>>().toBe<NotEmptyOptionalTupleFoo>();
expectTypeOf<MergeDeep<NotEmptyOptionalTupleFoo, EmptyOptionalFoo, {recurseIntoArrays: true; arrayMergeMode: 'replace'}>>().toBe<NotEmptyOptionalTupleFoo>();
expectTypeOf<MergeDeep<EmptyOptionalFoo, NotEmptyOptionalArrayFoo, {recurseIntoArrays: true; arrayMergeMode: 'replace'}>>().toBe<NotEmptyOptionalArrayFoo>();
expectTypeOf<MergeDeep<NotEmptyOptionalArrayFoo, EmptyOptionalFoo, {recurseIntoArrays: true; arrayMergeMode: 'replace'}>>().toBe<NotEmptyOptionalArrayFoo>();

type EmptyOptionalReadonlyFoo = {readonly foo?: []};
type NotEmptyOptionalReadonlyTupleFoo = {readonly foo?: [0, 1]};
type NotEmptyOptionalReadonlyArrayFoo = {readonly foo?: number[]};
expectTypeOf<MergeDeep<EmptyOptionalReadonlyFoo, NotEmptyOptionalReadonlyTupleFoo, {recurseIntoArrays: true; arrayMergeMode: 'replace'}>>().toBe<NotEmptyOptionalReadonlyTupleFoo>();
expectTypeOf<MergeDeep<NotEmptyOptionalReadonlyTupleFoo, EmptyOptionalReadonlyFoo, {recurseIntoArrays: true; arrayMergeMode: 'replace'}>>().toBe<NotEmptyOptionalReadonlyTupleFoo>();
expectTypeOf<MergeDeep<EmptyOptionalReadonlyFoo, NotEmptyOptionalReadonlyArrayFoo, {recurseIntoArrays: true; arrayMergeMode: 'replace'}>>().toBe<NotEmptyOptionalReadonlyArrayFoo>();
expectTypeOf<MergeDeep<NotEmptyOptionalReadonlyArrayFoo, EmptyOptionalReadonlyFoo, {recurseIntoArrays: true; arrayMergeMode: 'replace'}>>().toBe<NotEmptyOptionalReadonlyArrayFoo>();

expectTypeOf<MergeDeep<EmptyOptionalFoo, NotEmptyOptionalReadonlyTupleFoo, {recurseIntoArrays: true; arrayMergeMode: 'replace'}>>().toBe<NotEmptyOptionalReadonlyTupleFoo>();
expectTypeOf<MergeDeep<NotEmptyOptionalReadonlyTupleFoo, EmptyOptionalFoo, {recurseIntoArrays: true; arrayMergeMode: 'replace'}>>().toBe<NotEmptyOptionalTupleFoo>();
expectTypeOf<MergeDeep<EmptyOptionalReadonlyFoo, EmptyOptionalFoo, {recurseIntoArrays: true; arrayMergeMode: 'replace'}>>().toBe<EmptyOptionalFoo>();
expectTypeOf<MergeDeep<EmptyOptionalFoo, EmptyOptionalReadonlyFoo, {recurseIntoArrays: true; arrayMergeMode: 'replace'}>>().toBe<EmptyOptionalReadonlyFoo>();

type EmptyFooRecursive = {foo: [0, string, {bar: []}]};
type NotEmptyTupleFooRecursive = {foo: [0, number, {bar: [0, 1]}]};
type NotEmptyArrayFooRecursive = {foo: [0, number, {bar: number[]}]};
expectTypeOf<MergeDeep<EmptyFooRecursive, NotEmptyTupleFooRecursive, {recurseIntoArrays: true; arrayMergeMode: 'replace'}>>().toBe<NotEmptyTupleFooRecursive>();
expectTypeOf<MergeDeep<NotEmptyTupleFooRecursive, EmptyFooRecursive, {recurseIntoArrays: true; arrayMergeMode: 'replace'}>>().toBe<{foo: [0, string, {bar: [0, 1]}]}>();
expectTypeOf<MergeDeep<EmptyFooRecursive, NotEmptyArrayFooRecursive, {recurseIntoArrays: true; arrayMergeMode: 'replace'}>>().toBe<NotEmptyArrayFooRecursive>();
expectTypeOf<MergeDeep<NotEmptyArrayFooRecursive, EmptyFooRecursive, {recurseIntoArrays: true; arrayMergeMode: 'replace'}>>().toBe<{foo: [0, string, {bar: number[]}]}>();

// Tuple and array recursion behavior with primitive values
expectTypeOf<MergeDeep<[1, 2], string[], {recurseIntoArrays: true; arrayMergeMode: 'replace'}>>().toBe<[string, string, ...string[]]>();
expectTypeOf<MergeDeep<[1, 2], string[], {recurseIntoArrays: true; arrayMergeMode: 'spread'}>>().toBe<[string, string, ...string[]]>();
expectTypeOf<MergeDeep<string[], [1, 2], {recurseIntoArrays: true; arrayMergeMode: 'replace'}>>().toBe<[1, 2, ...string[]]>();
expectTypeOf<MergeDeep<string[], [1, 2], {recurseIntoArrays: true; arrayMergeMode: 'spread'}>>().toBe<[1, 2, ...string[]]>();

// Numeric keys and their string spellings refer to the same property when merging records.
expectTypeOf<MergeDeep<{0: {before: string}}, {'0': {after: number}}>>().toBe<{'0': {before: string; after: number}}>();
expectTypeOf<MergeDeep<{'0': {before: string}}, {0: {after: number}}>>().toBe<{0: {before: string; after: number}}>();
expectTypeOf<MergeDeep<{0: string}, {'0': number}>>().toBe<{'0': number}>();
expectTypeOf<MergeDeep<{'0': string}, {0: number}>>().toBe<{0: number}>();
expectTypeOf<MergeDeep<{[-2]: string}, {'-2': boolean}>>().toBe<{'-2': boolean}>();
expectTypeOf<MergeDeep<{1.5: string}, {'1.5': boolean}>>().toBe<{'1.5': boolean}>();
expectTypeOf<MergeDeep<{readonly 0: string; readonly retained?: boolean}, {readonly '0'?: number; added: Date}>>().toBe<{readonly '0'?: number; readonly retained?: boolean; added: Date}>();
expectTypeOf<MergeDeep<{readonly '0'?: string}, {0: number}>>().toBe<{0: number}>();
expectTypeOf<MergeDeep<{0?: {before: string}}, {readonly '0'?: {after: number}}>>().toBe<{readonly '0'?: {before: string; after: number}}>();
expectTypeOf<MergeDeep<{outer: {0: {value: string; retained: boolean}}}, {outer: {'0': {value: number}}}>>().toBe<{outer: {'0': {value: number; retained: boolean}}}>();
expectTypeOf<MergeDeep<{0: string[]}, {'0': number[]}>>().toBe<{'0': number[]}>();
expectTypeOf<MergeDeep<{'0': string[]}, {0: number[]}, {arrayMergeMode: 'spread'}>>().toBe<{0: Array<string | number>}>();
expectTypeOf<MergeDeep<Array<{0: string}>, Array<{'0': number}>, {recurseIntoArrays: true}>>().toBe<Array<{'0': number}>>();

// Noncanonical number strings are separate names, and neither spelling loses unrelated properties.
expectTypeOf<MergeDeep<{1: string}, {'01': number; '1.0': boolean; '1e0': Date; ' 1': null}>>().toBe<{1: string; '01': number; '1.0': boolean; '1e0': Date; ' 1': null}>();
expectTypeOf<MergeDeep<{'01': string; '1.0': boolean; '1e0': Date; ' 1': null}, {1: number}>>().toBe<{'01': string; '1.0': boolean; '1e0': Date; ' 1': null; 1: number}>();
expectTypeOf<MergeDeep<{0: {destination: true}; untouched: 'left'}, {'0': {source: true}; added: 'right'}>>().toBe<{'0': {destination: true; source: true}; untouched: 'left'; added: 'right'}>();
expectTypeOf<MergeDeep<{0: string} | {1: boolean}, {'0': number}>>().toBe<{'0': number} | {1: boolean; '0': number}>();

// Alias matching preserves the same special-value behavior as an identically spelled key.
expectTypeOf<MergeDeep<{0: string}, {'0': any}>>().toBe<{'0': any}>();
expectTypeOf<MergeDeep<{0: string}, {'0': unknown}>>().toBe<{'0': unknown}>();
expectTypeOf<MergeDeep<{0: string}, {'0': never}>>().toBe<{'0': never}>();
expectTypeOf<MergeDeep<{0: any}, {'0': number}>>().toBe<{'0': number}>();
expectTypeOf<MergeDeep<{0: unknown}, {'0': {value: number}}>>().toBe<{'0': {value: number}}>();
expectTypeOf<MergeDeep<{0: string}, {'0': undefined}>>().toBe<{'0': undefined}>();
expectTypeOf<MergeDeep<{0: {before: string}}, {'0': {after: number} | undefined}>>().toBe<{'0': {before: string; after: number} | undefined}>();
expectTypeOf(mergeDeep({0: 'old'}, {'0': 42})).toBe<{'0': number}>();

// Numeric enum spellings must remain readable after their aliases are matched.
enum MergeIndex {
	Zero = '0',
	Name = 'name',
	Padded = '01',
}
expectTypeOf<MergeDeep<{[MergeIndex.Zero]: {before: string}}, {0: {after: number}}>>().toBe<{0: {before: string; after: number}}>();
expectTypeOf<MergeDeep<{0: {before: string}}, {[MergeIndex.Zero]: {after: number}}>>().toBe<{[MergeIndex.Zero]: {before: string; after: number}}>();
expectTypeOf<MergeDeep<{'0': {before: string}}, {[MergeIndex.Zero]: {after: number}}>>().toBe<{[MergeIndex.Zero]: {before: string; after: number}}>();
expectTypeOf<MergeDeep<{[MergeIndex.Zero]: {before: string}}, {'0': {after: number}}>>().toBe<{'0': {before: string; after: number}}>();

// Symbols have no string spelling and retain their matching property values.
declare const mergeSymbol: unique symbol;
expectTypeOf<MergeDeep<{[mergeSymbol]: {before: string}}, {[mergeSymbol]: {after: number}}>>().toBe<{[mergeSymbol]: {before: string; after: number}}>();
expectTypeOf<MergeDeep<{readonly [MergeIndex.Zero]?: {before: string}}, {'0': {after: number}}>>().toBe<{'0': {before: string; after: number}}>();
expectTypeOf<MergeDeep<{'0': {before: string}}, {readonly [MergeIndex.Zero]?: {after: number}}>>().toBe<{readonly [MergeIndex.Zero]?: {before: string; after: number}}>();
expectTypeOf<MergeDeep<{[MergeIndex.Name]: {before: string}}, {name: {after: number}}>>().toBe<{name: {before: string; after: number}}>();
expectTypeOf<MergeDeep<{name: {before: string}}, {[MergeIndex.Name]: {after: number}}>>().toBe<{[MergeIndex.Name]: {before: string; after: number}}>();
expectTypeOf<MergeDeep<{[MergeIndex.Name]: string}, {name: number}>>().toBe<{name: number}>();
expectTypeOf<MergeDeep<{name: string}, {[MergeIndex.Name]: number}>>().toBe<{[MergeIndex.Name]: number}>();
expectTypeOf<MergeDeep<{1: string}, {[MergeIndex.Padded]: number}>>().toBe<{1: string; [MergeIndex.Padded]: number}>();
expectTypeOf<MergeDeep<{[MergeIndex.Padded]: string}, {1: number}>>().toBe<{[MergeIndex.Padded]: string; 1: number}>();
expectTypeOf<MergeDeep<{[MergeIndex.Name]: string}, {name: any}>>().toBe<{name: any}>();
expectTypeOf<MergeDeep<{[MergeIndex.Name]: string}, {name: never}>>().toBe<{name: never}>();
expectTypeOf<MergeDeep<{[MergeIndex.Name]: string}, {name: unknown}>>().toBe<{name: unknown}>();

// A wide row merges every fixed position without exhausting the compiler's recursion budget.
type LongMergeDestination = [...TupleOf<30, {id: 'before'}>, {marker: true}, ...TupleOf<30, {id: 'after'}>];
type LongMergeSource = TupleOf<61, {enabled: true}>;
type LongMergedRow = [...TupleOf<30, {id: 'before'; enabled: true}>, {marker: true; enabled: true}, ...TupleOf<30, {id: 'after'; enabled: true}>];
type LongTupleMerge = MergeDeep<LongMergeDestination, LongMergeSource, {recurseIntoArrays: true}>;
expectTypeOf<LongTupleMerge>().toBe<LongMergedRow>();
expectTypeOf<LongTupleMerge['length']>().toBe<61>();

// The tuple/array and array/tuple strategies also retain every fixed position before their rest.
expectTypeOf<MergeDeep<LongMergeDestination, Array<{enabled: true}>, {recurseIntoArrays: true}>>()
	.toBe<[...LongMergedRow, ...Array<{enabled: true}>]>();
expectTypeOf<MergeDeep<Array<{id: 'base'}>, LongMergeSource, {recurseIntoArrays: true}>>()
	.toBe<[...TupleOf<61, {id: 'base'; enabled: true}>, ...Array<{id: 'base'}>]>();

// Unequal tuple lengths switch to the other traversal after merging the shared prefix.
expectTypeOf<MergeDeep<[{id: 'first'}, ...Array<{fromRest: true}>], LongMergeSource, {recurseIntoArrays: true}>>()
	.toBe<[{id: 'first'; enabled: true}, ...TupleOf<60, {fromRest: true; enabled: true}>, ...Array<{fromRest: true}>]>();
expectTypeOf<MergeDeep<LongMergeDestination, [{enabled: true}, ...Array<{enabled: false}>], {recurseIntoArrays: true}>>()
	.toBe<[{id: 'before'; enabled: true}, ...TupleOf<29, {id: 'before'; enabled: false}>, {marker: true; enabled: false}, ...TupleOf<30, {id: 'after'; enabled: false}>, ...Array<{enabled: false}>]>();

// Wide rows retain their ordering, optional positions, and nested merge behavior.
declare const longMergedRow: LongTupleMerge;
expectTypeOf(longMergedRow[0]).toBe<{id: 'before'; enabled: true}>();
expectTypeOf(longMergedRow[30]).toBe<{marker: true; enabled: true}>();
expectTypeOf(longMergedRow[60]).toBe<{id: 'after'; enabled: true}>();
// @ts-expect-error The middle marker does not become a neighboring row.
longMergedRow[30] = {id: 'before', enabled: true};
expectTypeOf<MergeDeep<Readonly<LongMergeDestination>, Readonly<LongMergeSource>, {recurseIntoArrays: true}>>().toBe<LongMergedRow>();
expectTypeOf<MergeDeep<Partial<LongMergeDestination>, Partial<LongMergeSource>, {recurseIntoArrays: true}>>().toBe<Partial<LongMergedRow>>();
expectTypeOf<MergeDeep<Partial<LongMergeDestination>, LongMergeSource, {recurseIntoArrays: true}>>().toBe<LongMergedRow>();
expectTypeOf<MergeDeep<{rows: LongMergeDestination}, {rows: LongMergeSource}, {recurseIntoArrays: true}>>().toBe<{rows: LongMergedRow}>();

// Accumulating one tuple alternative must not mix its later positions with another.
type MergedTupleChoices = MergeDeep<[{row: 'a'}, {left: 1}] | [{row: 'b'}, {right: 2}], [{enabled: true}], {recurseIntoArrays: true}>;
expectTypeOf<MergedTupleChoices>().toBe<[{row: 'a'; enabled: true}, {left: 1}] | [{row: 'b'; enabled: true}, {right: 2}]>();
expectTypeOf<[{row: 'a'; enabled: true}, {right: 2}]>().not.toBeAssignableTo<MergedTupleChoices>();

function _readMergedTupleFlag<Value>(merged: MergeDeep<readonly [{value: Value}], readonly [{enabled: true}], {recurseIntoArrays: true}>): true {
	return merged[0].enabled;
}

function _readMergedTupleLength<Options extends MergeDeepOptions>(merged: MergeDeep<[1], [2], Options>): number {
	return merged.length;
}

const inferredMergedTuple = mergeDeep([{id: 'left'}, {keep: true}] as const, [{enabled: true}] as const, {recurseIntoArrays: true});
expectTypeOf(inferredMergedTuple).toBe<[{readonly id: 'left'; readonly enabled: true}, {readonly keep: true}]>();
inferredMergedTuple[1] = {keep: true};
// @ts-expect-error A merged source field retains its literal value.
inferredMergedTuple[0] = {id: 'left', enabled: false};

// Nested matrix inference keeps the selected element type and fresh outer-array access.
const inferredNestedMatrix = mergeDeep([[1]], [['value']], {recurseIntoArrays: true});
expectTypeOf(inferredNestedMatrix).toBe<string[][]>();
inferredNestedMatrix.push(['next']);
// @ts-expect-error Replacing a nested matrix does not retain destination numbers.
inferredNestedMatrix[0] = [2];

function _constructMergedMatrix<Value extends string>(value: Value): MergeDeep<number[][], Value[][], {recurseIntoArrays: true}> {
	return [[value]];
}

function _readMergedMatrix<Value extends string>(value: MergeDeep<number[][], Value[][], {recurseIntoArrays: true}>): Value[][] {
	return value;
}

function _constructWithGenericOptions<Options extends MergeDeepOptions>(value: string): MergeDeep<{keep: number}, {id: string}, Options> {
	return {keep: 1, id: value};
}

// Nested array settings keep the selected merge mode when descending through record elements.
type NestedArrayDefaults = {rows: Array<{id: string; values: number[][]}>};
type NestedArrayOverrides = {rows: Array<{enabled: boolean; values: string[][]}>};
expectTypeOf<MergeDeep<NestedArrayDefaults, NestedArrayOverrides, {recurseIntoArrays: true}>>()
	.toBe<{rows: Array<{id: string; enabled: boolean; values: string[][]}>}>();
expectTypeOf<MergeDeep<NestedArrayDefaults, NestedArrayOverrides, Readonly<{recurseIntoArrays: true; arrayMergeMode: 'spread'}>>>()
	.toBe<{rows: Array<{id: string; enabled: boolean; values: Array<Array<string | number>>}>}>();

const inferredNestedArrays = mergeDeep({groups: [[{left: true}]]} as const, {groups: [[{right: true}]]} as const, {recurseIntoArrays: true, arrayMergeMode: 'spread'});
expectTypeOf(inferredNestedArrays.groups[0]![0]!).toBe<{readonly left: true; readonly right: true}>();
// @ts-expect-error The merged source retains its inferred literal value.
inferredNestedArrays.groups[0]![0] = {left: true, right: false};

// An indexed options object still honors its declared recursion flag.
expectTypeOf<MergeDeep<{rows: Array<{id: string}>}, {rows: Array<{enabled: true}>}, {recurseIntoArrays: true; [key: string]: unknown}>>()
	.toBe<{rows: Array<{id: string; enabled: true}>}>();
declare const indexedMergeOptions: {recurseIntoArrays: true; [key: string]: unknown};
const inferredIndexedMerge = mergeDeep({rows: [{id: 'known'}]}, {rows: [{enabled: true}]}, indexedMergeOptions);
expectTypeOf(inferredIndexedMerge.rows[0]?.id).toBe<string | undefined>();
// @ts-expect-error Recursing into indexed options keeps required destination fields.
const missingIndexedDestination: typeof inferredIndexedMerge = {rows: [{enabled: true}]};

// An uncertain mode can spread nested arrays instead of replacing them.
const uncertainModeSpread: MergeDeep<{values: number[]}, {values: readonly string[]}, {arrayMergeMode: 'replace' | 'spread'}> = {values: [1, 'source']};
const optionalModeSpread: MergeDeep<{values: number[]}, {values: readonly string[]}, {arrayMergeMode?: 'spread'}> = {values: [1, 'source']};

function mergeValues(mode: 'replace' | 'spread', destination: number[], source: readonly string[]): MergeDeep<{values: number[]}, {values: readonly string[]}, {arrayMergeMode: 'replace' | 'spread'}> {
	const replacement = {values: source};
	return mode === 'spread' ? {values: [...destination, ...source]} : replacement;
}

// A selected mode applies to all arrays, including readonly replacements.
type UncertainMergeDestination = {values: number[]; flags: boolean[]};
type UncertainMergeSource = {values: readonly string[]; flags: readonly Date[]};
type UncertainMergeResult = MergeDeep<UncertainMergeDestination, UncertainMergeSource, {arrayMergeMode: 'replace' | 'spread'}>;
const readonlyModeReplacement: UncertainMergeResult = {values: ['source'] as readonly string[], flags: [] as readonly Date[]};
const completeModeSpread: UncertainMergeResult = {values: [1, 'source'], flags: [true, new Date()]};
// @ts-expect-error One merge cannot spread one array while choosing a readonly replacement for the other.
const mixedMergeModes: UncertainMergeResult = {values: [1, 'source'], flags: [] as readonly Date[]};

// Optional spread can be absent and use the default readonly replacement.
const omittedSpreadMode: MergeDeep<UncertainMergeDestination, UncertainMergeSource, {arrayMergeMode?: 'spread'}> = readonlyModeReplacement;
const optionalReplaceMode: MergeDeep<UncertainMergeDestination, UncertainMergeSource, {arrayMergeMode?: 'replace'}> = readonlyModeReplacement;
declare const uncertainArrayMode: 'replace' | 'spread';
const inferredUncertainMerge = mergeDeep({values: [1]}, {values: ['source']} as const, {arrayMergeMode: uncertainArrayMode});
expectTypeOf(inferredUncertainMerge.values).toBe<readonly ['source'] | Array<number | 'source'>>();
const inferredReadonlyReplacement: typeof inferredUncertainMerge = {values: ['source'] as const};
const inferredMutableSpread: typeof inferredUncertainMerge = {values: [1, 'source']};

function readUncertainMerge<Value>(value: MergeDeep<{values: number[]}, {values: readonly Value[]}, {arrayMergeMode: 'replace' | 'spread'}>): ReadonlyArray<number | Value> {
	return value.values;
}

function constructOptionalMerge<Value>(source: readonly Value[]): MergeDeep<{values: number[]}, {values: readonly Value[]}, {arrayMergeMode?: 'spread'}> {
	return {values: source};
}

// @ts-expect-error A replacement can retain the source's readonly array.
readonlyModeReplacement.values[0] = 'source';
// @ts-expect-error Neither array merge strategy introduces boolean values here.
const invalidUncertainValue: UncertainMergeResult = {values: [false], flags: []};

// Copied named values remain sealed inside recursively merged tuples and signatures.
declare class CopiedMergeLeaf {
	name: string;
	nested: {id: number};
}

type CopiedMergeRows = {readonly [key: `row-${string}`]: CopiedMergeLeaf; keep: CopiedMergeLeaf};
declare const copiedMergeRows: MergeDeep<[CopiedMergeRows], [{enabled: true}], {recurseIntoArrays: true}>;
expectTypeOf(copiedMergeRows[0].keep).toBe<{name: string; nested: {id: number}}>();
const copiedMergeNamedRecord: Record<string, unknown> = copiedMergeRows[0].keep;
const copiedMergeIndexedRecord: Record<string, unknown> = copiedMergeRows[0]['row-first']!;
// @ts-expect-error A valid replacement still cannot write through the readonly signature.
copiedMergeRows[0]['row-first'] = {name: 'new', nested: {id: 1}};

declare const copiedMergeCallback: MergeDeep<[{handler: (value: string) => number}], [{enabled: true}], {recurseIntoArrays: true}>;
expectTypeOf(copiedMergeCallback[0].handler('value')).toBe<number>();

declare const fallbackMergeRows: MergeDeep<[{value: {before: true}}], [{value: CopiedMergeLeaf}], {recurseIntoArrays: true}>;
expectTypeOf(fallbackMergeRows[0].value).toBe<{name: string; nested: {id: number}}>();

function _readCopiedMergeValue<Value extends string>(value: MergeDeep<[{id: Value}], [{enabled: true}], {recurseIntoArrays: true}>): string {
	return value[0].id;
}

declare function mergeCopiedValues<const Destination, const Source>(destination: Destination, source: Source): MergeDeep<Destination, Source, {recurseIntoArrays: true}>;
const inferredCopiedMerge = mergeCopiedValues([{keep: 1}], [{value: 'ready'}]);
expectTypeOf(inferredCopiedMerge[0]).toBe<{readonly keep: 1; readonly value: 'ready'}>();

// Shared signature values are normalized as a complete union, including unmerged alternatives.
type CopiedMergeDictionary = Record<`row-${string}`, CopiedMergeLeaf>;
type SharedCopiedMergeRows = MergeDeep<[CopiedMergeDictionary], [CopiedMergeDictionary], {recurseIntoArrays: true}>;
expectTypeOf<SharedCopiedMergeRows[0][`row-${string}`]>().toBeAssignableTo<{name: string; nested: {id: number}}>();
declare const sharedCopiedMergeRows: SharedCopiedMergeRows;
const sharedCopiedMergeRecord: Record<string, unknown> = sharedCopiedMergeRows[0]['row-first']!;

declare const copiedNullableMerge: MergeDeep<[{optional?: CopiedMergeLeaf | null | undefined}], [{enabled: true}], {recurseIntoArrays: true}>;
expectTypeOf(copiedNullableMerge[0].optional?.nested.id).toBe<number | undefined>();
