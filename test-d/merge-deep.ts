import {expectAssignable, expectType} from 'tsd';
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
declare const stringsOrBooleans: Array<string | boolean>;
expectType<Array<number | string | boolean>>(mergeDeep(stringsOrBooleans, [42], {arrayMergeMode: 'spread'}));
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

type RecordNotPartial = {
	name: string;
	type: string;
	b: {bb?: string; cc: string};
};
type RecordPartial = Partial<RecordNotPartial>;

expectType<RecordNotPartial>({} as MergeDeep<RecordPartial, RecordNotPartial>);
expectType<RecordPartial>({} as MergeDeep<RecordNotPartial, RecordPartial>);

type NotOptional = {a: string; b: number; c: boolean};
type OptionalWithUndefined = {a: string | undefined; b?: number; c?: boolean | undefined};

expectType<OptionalWithUndefined>({} as MergeDeep<NotOptional, OptionalWithUndefined>);
expectType<NotOptional>({} as MergeDeep<OptionalWithUndefined, NotOptional>);

// An empty destination has no element to merge with, so the merge mode decides the result.
declare const emptyDestinationReplace: MergeDeep<{foo: []}, {foo: [1, 2]}, {recurseIntoArrays: true; arrayMergeMode: 'replace'}>;
expectType<{foo: [1, 2]}>(emptyDestinationReplace);

declare const emptyDestinationSpread: MergeDeep<{foo: []}, {foo: [1, 2]}, {recurseIntoArrays: true; arrayMergeMode: 'spread'}>;
expectType<{foo: [1, 2]}>(emptyDestinationSpread);

declare const emptyDestinationArray: MergeDeep<{foo: []}, {foo: number[]}, {recurseIntoArrays: true; arrayMergeMode: 'replace'}>;
expectType<{foo: number[]}>(emptyDestinationArray);

// A trailing optional element is merged like any other element, instead of collapsing to `never`.
declare const optionalTailTuple: MergeDeep<[string, string?], [number, number?], {recurseIntoArrays: true}>;
expectType<[number, number?]>(optionalTailTuple);

// A tuple element merged with an array element keeps its optional modifier, just like when merging two tuples.
declare const tupleWithOptionalTailIntoArray: MergeDeep<{foo: [string, number?]}, {foo: string[]}, {recurseIntoArrays: true; arrayMergeMode: 'spread'}>;
expectType<{foo: [string, string?, ...string[]]}>(tupleWithOptionalTailIntoArray);

declare const arrayIntoTupleWithOptionalTail: MergeDeep<{foo: string[]}, {foo: [string, number?]}, {recurseIntoArrays: true; arrayMergeMode: 'spread'}>;
expectType<{foo: [string, number?, ...string[]]}>(arrayIntoTupleWithOptionalTail);

declare const topLevelTupleWithOptionalTailIntoArray: MergeDeep<[string, number?], string[], {recurseIntoArrays: true; arrayMergeMode: 'spread'}>;
expectType<[string, string?, ...string[]]>(topLevelTupleWithOptionalTailIntoArray);

// The optional modifier is also kept when the optional element is followed by a rest element.
declare const optionalTailWithRestTuple: MergeDeep<[string, string?, ...string[]], [number, number?, ...number[]], {recurseIntoArrays: true}>;
expectType<[number, number?, ...number[]]>(optionalTailWithRestTuple);

declare const optionalTailWithRestTupleIntoArray: MergeDeep<[string, string?, ...string[]], number[], {recurseIntoArrays: true; arrayMergeMode: 'spread'}>;
expectType<[number, number?, ...Array<string | number>]>(optionalTailWithRestTupleIntoArray);

declare const arrayIntoOptionalTailWithRestTuple: MergeDeep<number[], [string, string?, ...string[]], {recurseIntoArrays: true; arrayMergeMode: 'spread'}>;
expectType<[string, string?, ...Array<string | number>]>(arrayIntoOptionalTailWithRestTuple);

// A source property that is only `undefined` replaces the destination property, just like object spread does at runtime. It must not collapse the property to `never`.
declare const sourceUndefinedReplacesDestination: MergeDeep<{a: {b: 1}}, {a: undefined}>;
expectType<{a: undefined}>(sourceUndefinedReplacesDestination);

declare const sourceUndefinedReplacesPrimitive: MergeDeep<{a: string}, {a: undefined}>;
expectType<{a: undefined}>(sourceUndefinedReplacesPrimitive);

declare const sourceUndefinedReplacesArray: MergeDeep<{a: string[]}, {a: undefined}>;
expectType<{a: undefined}>(sourceUndefinedReplacesArray);

declare const sourceUndefinedReplacesTuple: MergeDeep<{a: [1, 2]}, {a: undefined}>;
expectType<{a: undefined}>(sourceUndefinedReplacesTuple);

// An empty source array contains no indices, so the destination value is returned, the same way it is when the source does not have the key at all.
declare const emptySourceTuple: MergeDeep<[1, 2, 3], [], {recurseIntoArrays: true}>;
expectType<[1, 2, 3]>(emptySourceTuple);

declare const emptySourceNested: MergeDeep<{a: [1, 2]}, {a: []}, {recurseIntoArrays: true}>;
expectType<{a: [1, 2]}>(emptySourceNested);

declare const emptySourceWithSpreadMode: MergeDeep<[1, 2], [], {recurseIntoArrays: true; arrayMergeMode: 'spread'}>;
expectType<[1, 2]>(emptySourceWithSpreadMode);

declare const emptySourceArray: MergeDeep<number[], [], {recurseIntoArrays: true}>;
expectType<number[]>(emptySourceArray);

// By default inner arrays are replaced, which must not depend on whether the array sits at the top level or inside an object.
declare const nestedArrayReplacedInObject: MergeDeep<{a: number[][]}, {a: string[][]}, {recurseIntoArrays: true}>;
expectType<{a: string[][]}>(nestedArrayReplacedInObject);

declare const nestedArrayReplacedAtTopLevel: MergeDeep<number[][], string[][], {recurseIntoArrays: true}>;
expectType<string[][]>(nestedArrayReplacedAtTopLevel);

declare const nestedArraySpreadAtTopLevel: MergeDeep<number[][], string[][], {recurseIntoArrays: true; arrayMergeMode: 'spread'}>;
expectType<Array<Array<string | number>>>(nestedArraySpreadAtTopLevel);

// A `readonly` array does not keep its modifier through the spread, because the result is a fresh array. See the note in the docs.
declare const readonlyArrays: MergeDeep<readonly string[], readonly number[]>;
expectType<Array<string | number>>(readonlyArrays);

declare const readonlyArraysSpread: MergeDeep<readonly string[], readonly number[], {arrayMergeMode: 'spread'}>;
expectType<Array<string | number>>(readonlyArraysSpread);

// A source of `any` is a value of any type, so it has to win the way any other source does. `any` satisfies every assignability check, so without a guard for it the "source of only `undefined`" rule fired and the property was narrowed to `undefined`, which no object spread can produce.
declare const anySource: MergeDeep<{a: string}, {a: any}>;
expectType<{a: any}>(anySource);

declare const anySourceWithExtraKey: MergeDeep<{a: 1}, {a: any; b: 2}>;
expectType<{b: 2; a: any}>(anySourceWithExtraKey);

declare const anySourceOptional: MergeDeep<{a?: 1}, {a?: any}>;
expectType<{a?: any}>(anySourceOptional);

declare const anySourceTuple: MergeDeep<[1], [any], {recurseIntoArrays: true}>;
expectType<[any]>(anySourceTuple);

declare const anySourceElement: MergeDeep<{a: [1]}, {a: [any]}, {recurseIntoArrays: true}>;
expectType<{a: [any]}>(anySourceElement);

// A key the two operands share comes out with the modifiers of the source, whichever way round the two are written, because the mapped type that carries rule 3 is homomorphic over the source.
declare const modifiersFromSource: MergeDeep<{readonly a?: string}, {a: number}>;
expectType<{a: number}>(modifiersFromSource);

declare const modifiersFromSourceReversed: MergeDeep<{a: number}, {readonly a?: string}>;
expectType<{readonly a?: string}>(modifiersFromSourceReversed);

declare const bothReadonly: MergeDeep<{readonly a: string}, {readonly a: number}>;
expectType<{readonly a: number}>(bothReadonly);

declare const onlyDestinationReadonly: MergeDeep<{readonly a: string}, {b: number}>;
expectType<{readonly a: string; b: number}>(onlyDestinationReadonly);

declare const sharedKeyLeftOptional: MergeDeep<{a: string; b?: number}, {b?: string}>;
expectType<{a: string; b?: string}>(sharedKeyLeftOptional);

// A key only the source has is copied whole, so it keeps the source's own modifiers rather than either operand's modifier rules.
declare const onlySourceReadonly: MergeDeep<{a: 1}, {readonly b: 2}>;
expectType<{a: 1; readonly b: 2}>(onlySourceReadonly);

declare const onlySourceOptional: MergeDeep<{a: 1}, {b?: 2}>;
expectType<{a: 1; b?: 2}>(onlySourceOptional);

declare const onlySourceReadonlyOptional: MergeDeep<{a: 1}, {readonly b?: 2}>;
expectType<{a: 1; readonly b?: 2}>(onlySourceReadonlyOptional);

// A shared key that is a record on both sides is merged, and the merged record keeps the source's modifier rather than either contributor's.
declare const mergedRecordModifier: MergeDeep<{readonly a?: {x: string}}, {a: {y: number}}>;
expectType<{a: {x: string; y: number}}>(mergedRecordModifier);

declare const mergedRecordOptional: MergeDeep<{a: {x: string}}, {a?: {y: number}}>;
expectType<{a?: {x: string; y: number}}>(mergedRecordOptional);

// `any` satisfies every assignability check, so the guard that asks whether `undefined` can reach the result fired for a destination of `any` and narrowed the whole merge to `never`, which accepts nothing at all. `MergeDeep` already guards `any` per property, and `ObjectMerge` returns `any` for the same input.
declare const topTypeDestination: MergeDeep<any, {b: 2}>;
expectType<any>(topTypeDestination);

declare const topTypeBoth: MergeDeep<any, any>;
expectType<any>(topTypeBoth);

// A source of `any` is returned as it is too, the same as a destination of `any`: a merge with a value of any shape has no shape of its own to work out.
declare const topTypeSourceNamed: MergeDeep<{a: 1}, any>;
expectType<any>(topTypeSourceNamed);

// A key under an index signature both records share may be in either record or in both, so its value is the destination's, the source's, or the two merged.
type FooSharedIndexSignature = {[x: string]: {b: string}};
type BarSharedIndexSignature = {[x: string]: {c: number}};

declare const fooBarSharedIndexSignature: MergeDeep<FooSharedIndexSignature, BarSharedIndexSignature>;
expectType<{[x: string]: {b: string} | {c: number} | {b: string; c: number}}>(fooBarSharedIndexSignature);

type FooSharedNumberIndexSignature = {[x: number]: {b: string}};
type BarSharedNumberIndexSignature = {[x: number]: {c: number}};

declare const fooBarSharedNumberIndexSignature: MergeDeep<FooSharedNumberIndexSignature, BarSharedNumberIndexSignature>;
expectType<{[x: number]: {b: string} | {c: number} | {b: string; c: number}}>(fooBarSharedNumberIndexSignature);

// A signature only one record has is left as it is, and a named key is still merged next to it.
type FooOnlyDestinationSignature = {[x: string]: unknown; shared: {d: string}};
type BarOnlySourceSignature = {[x: symbol]: unknown; shared: {e: string}};

declare const fooBarMixedSignatures: MergeDeep<FooOnlyDestinationSignature, BarOnlySourceSignature>;
expectType<{[x: string]: unknown; [x: symbol]: unknown; shared: {d: string; e: string}}>(fooBarMixedSignatures);

// `object` is an object whose keys are unknown, so a merge with it is inside the domain of this type, but it is not assignable to `UnknownRecord`, which used to drop the whole merge to `never`, a type that accepts nothing at all. Nothing can be said about the result beyond `object` itself, which is also what the shallow `Merge` answers for `Merge<object, object>`.
declare const objectBoth: MergeDeep<object, object>;
expectType<object>(objectBoth);

declare const objectDestination: MergeDeep<object, {a: 1}>;
expectType<{a: 1}>(objectDestination);

declare const objectSource: MergeDeep<{a: 1}, object>;
expectType<{a: 1}>(objectSource);

declare const objectArraySource: MergeDeep<string[], object>;
expectType<never>(objectArraySource);

// A source that is not an object at all is outside the documented domain, and still answers `never`.
declare const primitiveSource: MergeDeep<{a: 1}, string>;
expectType<never>(primitiveSource);

declare const emptyDestinationTopLevel: MergeDeep<[], [1], {recurseIntoArrays: true}>;
expectType<[1]>(emptyDestinationTopLevel);

// A signature describes keys either side may not have, so a key under a shared signature can hold either side's value alone, like the runtime merge of `{foo: {b: 'x'}}` and `{bar: {c: 1}}` does.
expectAssignable<MergeDeep<{[x: string]: {b: string}}, {[x: string]: {c: number}}>>({foo: {b: 'x'}, bar: {c: 1}});

// The keys of a generic destination and of the source stay readable on the result. A branch that answers `object` in the constraint would hide them.
function mergeDeepOfGeneric<Destination extends {a: {b: number}}>(merged: MergeDeep<Destination, {a: {c: 1}}>) {
	expectType<number>(merged.a.b);
	expectType<1>(merged.a.c);
}

function mergeDeepIntoGeneric<Source extends {a: {b: number}}>(merged: MergeDeep<{c: 1}, Source>) {
	expectType<number>(merged.a.b);
	expectType<1>(merged.c);
}

// A tuple containing only optional elements still has fixed positions and must not become an unbounded array.
declare const allOptionalTuples: MergeDeep<readonly [string?, boolean?], readonly [number?], {recurseIntoArrays: true}>;
expectType<[number?, boolean?]>(allOptionalTuples);

declare const allOptionalTupleIntoArray: MergeDeep<[string?], number[], {recurseIntoArrays: true}>;
expectType<[number?, ...number[]]>(allOptionalTupleIntoArray);

declare const arrayIntoAllOptionalTuple: MergeDeep<number[], [string?], {recurseIntoArrays: true}>;
expectType<[string?, ...number[]]>(arrayIntoAllOptionalTuple);

// Recursing into a merge still creates a fresh mutable array when an operand is an empty readonly tuple.
declare const readonlyEmptyDestination: MergeDeep<readonly [], readonly [1, 2], {recurseIntoArrays: true}>;
expectType<[1, 2]>(readonlyEmptyDestination);

declare const readonlyEmptySource: MergeDeep<readonly [1, 2], readonly [], {recurseIntoArrays: true}>;
expectType<[1, 2]>(readonlyEmptySource);

// An actual empty-array element replaces an incompatible value; it is distinct from a tuple having no element at that index.
declare const emptyArrayElementReplacesPrimitive: MergeDeep<[1], [[]], {recurseIntoArrays: true}>;
expectType<[[]]>(emptyArrayElementReplacesPrimitive);

declare const emptyArrayElementReplacesObject: MergeDeep<[{value: 1}], [[]], {recurseIntoArrays: true}>;
expectType<[[]]>(emptyArrayElementReplacesObject);

// A position is guaranteed to exist when either tuple declares it as required.
declare const requiredSourceElement: MergeDeep<[1?], [2], {recurseIntoArrays: true}>;
expectType<[2]>(requiredSourceElement);

declare const requiredDestinationElement: MergeDeep<[1], [2?], {recurseIntoArrays: true}>;
expectType<[2]>(requiredDestinationElement);

// A rest element of `never[]` has no elements, so the source elements past the destination's fixed elements are kept as they are.
declare const neverRestDestination: MergeDeep<[1, ...never[]], [2, 3], {recurseIntoArrays: true}>;
expectType<[2, 3, ...never[]]>(neverRestDestination);

declare const neverRestSource: MergeDeep<[1, 2], [3, ...never[]], {recurseIntoArrays: true}>;
expectType<[3, 2, ...never[]]>(neverRestSource);
