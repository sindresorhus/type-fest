import {expectTypeOf} from 'nz';
import type {SharedUnionFieldsDeep} from '../index.d.ts';

type TestingType = {
	function: (() => void);
	record: Record<string, {
		propertyA: string;
	}>;
	object: {
		subObject: {
			subSubObject: {
				propertyA: string;
			};
		};
	};
	string: string;
	union: 'test1' | 'test2';
	number: number;
	boolean: boolean;
	date: Date;
	regexp: RegExp;
	symbol: symbol;
	null: null;
	undefined: undefined;
	optional?: boolean | undefined;
	readonly propertyWithKeyword: boolean;
	map: Map<string, {propertyA: string; propertyB: string}>;
	set: Set<string>;
	objectSet: Set<{propertyA: string; propertyB: string}>;
	array: Array<{a: number; b: string}>;
	readonlyArray: ReadonlyArray<{a: number; b: string}>;
};

type SharedUnionFieldsDeepRecurseIntoArrays<T> = SharedUnionFieldsDeep<T, {recurseIntoArrays: true}>;

declare const normal: SharedUnionFieldsDeep<TestingType | {string: string; number: number; foo: any}>;
expectTypeOf(normal).toBe<{string: string; number: number}>();

declare const normal2: SharedUnionFieldsDeep<TestingType | {string: string; foo: any}>;
expectTypeOf(normal2).toBe<{string: string}>();

declare const unMatched: SharedUnionFieldsDeep<TestingType | {foo: any}>;
expectTypeOf(unMatched).toBe<{}>();

declare const number: SharedUnionFieldsDeep<TestingType | {number: number; foo: any}>;
expectTypeOf(number).toBe<{number: number}>();

declare const string: SharedUnionFieldsDeep<TestingType | {string: string; foo: any}>;
expectTypeOf(string).toBe<{string: string}>();

declare const boolean: SharedUnionFieldsDeep<TestingType | {boolean: boolean; foo: any}>;
expectTypeOf(boolean).toBe<{boolean: boolean}>();

declare const date: SharedUnionFieldsDeep<TestingType | {date: Date; foo: any}>;
expectTypeOf(date).toBe<{date: Date}>();

declare const regexp: SharedUnionFieldsDeep<TestingType | {regexp: RegExp; foo: any}>;
expectTypeOf(regexp).toBe<{regexp: RegExp}>();

declare const symbol: SharedUnionFieldsDeep<TestingType | {symbol: symbol; foo: any}>;
expectTypeOf(symbol).toBe<{symbol: symbol}>();

declare const null_: SharedUnionFieldsDeep<TestingType | {null: null; foo: any}>;
expectTypeOf(null_).toBe<{null: null}>();

declare const undefined_: SharedUnionFieldsDeep<TestingType | {undefined: undefined; foo: any}>;
expectTypeOf(undefined_).toBe<{undefined: undefined}>();

declare const optional: SharedUnionFieldsDeep<TestingType | {optional: string; foo: any}>;
expectTypeOf(optional).toBe<{optional?: boolean | string | undefined}>();

declare const propertyWithKeyword: SharedUnionFieldsDeep<TestingType | {readonly propertyWithKeyword: string; foo: any}>;
expectTypeOf(propertyWithKeyword).toBe<{readonly propertyWithKeyword: boolean | string}>();

declare const map: SharedUnionFieldsDeep<TestingType | {map: Map<string, {propertyA: string}>; foo: any}>;
expectTypeOf(map).toBe<{map: TestingType['map'] | Map<string, {propertyA: string}>}>();

declare const set: SharedUnionFieldsDeep<TestingType | {set: Set<number>; foo: any}>;
expectTypeOf(set).toBe<{set: TestingType['set'] | Set<number>}>();

declare const union: SharedUnionFieldsDeep<TestingType | {string: string; number: number; foo: any} | {string: string; bar: any}>;
expectTypeOf(union).toBe<{string: string}>();

declare const union2: SharedUnionFieldsDeep<TestingType | {union: {a: number}}>;
expectTypeOf(union2).toBe<{union: 'test1' | 'test2' | {a: number}}>();

/**
Test for array
*/
declare const array: SharedUnionFieldsDeepRecurseIntoArrays<TestingType | {array: Array<{a: number; bar: string}>; foo: any}>;
expectTypeOf(array).toBe<{array: Array<{a: number}>}>();

declare const arrayWithoutRecursive: SharedUnionFieldsDeep<TestingType | {array: Array<{a: number; bar: string}>; foo: any}>;
expectTypeOf(arrayWithoutRecursive).toBe<{array: TestingType['array'] | Array<{a: number; bar: string}>}>();

declare const readonlyArray: SharedUnionFieldsDeepRecurseIntoArrays<TestingType | {readonlyArray: ReadonlyArray<{a: number; bar: string}>; foo: any}>;
expectTypeOf(readonlyArray).toBe<{readonlyArray: ReadonlyArray<{a: number}>}>();

/**
Test for tuple
*/
declare const tuple: SharedUnionFieldsDeepRecurseIntoArrays<{tuple: [number]} | {tuple: [number, string]; foo: any}>;
expectTypeOf(tuple).toBe<{tuple: [number]}>();

declare const tupleWithoutRecursive: SharedUnionFieldsDeep<{tuple: [number]} | {tuple: [number, string]; foo: any}>;
expectTypeOf(tupleWithoutRecursive).toBe<{tuple: [number] | [number, string]}>();

declare const tupleOrArray: SharedUnionFieldsDeepRecurseIntoArrays<{tuple: boolean[]} | {tuple: [number, string]}>;
expectTypeOf(tupleOrArray).toBe<{tuple: [number | boolean, string | boolean]}>();

/**
Test for fixed length tuple
*/
declare const fixedLengthTuple: SharedUnionFieldsDeepRecurseIntoArrays<{tuple: [number, string]} | {tuple: [number, string, boolean]}>;
expectTypeOf(fixedLengthTuple).toBe<{tuple: [number, string]}>();

declare const fixedLengthTuple2: SharedUnionFieldsDeepRecurseIntoArrays<{tuple: [number, string]} | {tuple: []}>;
expectTypeOf(fixedLengthTuple2).toBe<{tuple: []}>();

declare const fixedLengthTuple3: SharedUnionFieldsDeepRecurseIntoArrays<{tuple: [number, string, number]} | {tuple: [number, boolean, ...string[]]}>;
expectTypeOf(fixedLengthTuple3).toBe<{tuple: [number, string | boolean, number | string]}>();

declare const threeLengthTuple: SharedUnionFieldsDeepRecurseIntoArrays<{tuple: [number, string]} | {tuple: [number, string, boolean]} | {tuple: number[]}>;
expectTypeOf(threeLengthTuple).toBe<{tuple: [number, string | number]}>();

/**
Test for non-fixed length tuple
*/
declare const nonFixedLengthTuple: SharedUnionFieldsDeepRecurseIntoArrays<{tuple: [number, ...string[]]} | {tuple: boolean[]}>;
expectTypeOf(nonFixedLengthTuple).toBe<{tuple: [number | boolean, ...Array<string | boolean>]}>();

declare const nonFixedLengthTuple2: SharedUnionFieldsDeepRecurseIntoArrays<{tuple: [number, ...string[]]} | {tuple: [number, string, ...boolean[]]}>;
expectTypeOf(nonFixedLengthTuple2).toBe<{tuple: [number, string, ...Array<string | boolean>]}>();

// Test for same type
type TestingType2 = TestingType & {foo: any};
declare const same: SharedUnionFieldsDeepRecurseIntoArrays<TestingType | TestingType2>;
expectTypeOf(same).toBe<TestingType>();

// Test for propagation with non union root object
declare const nonUnionRootType: SharedUnionFieldsDeep<{union: {number: number; boolean: boolean} | {number: number}}>;
expectTypeOf(nonUnionRootType).toBe<{union: {number: number}}>();

declare const unionWithUndefined: SharedUnionFieldsDeep<{
	a?: {a: string; foo: number} | {a: string; bar: string} | undefined;
	b?: {a: string; foo: number} | {a: string; bar: string};
	c: {a: string; foo: number} | {a: string; bar: string} | undefined;
}>;
expectTypeOf(unionWithUndefined).toBe<{
	a?: {a: string} | undefined;
	b?: {a: string};
	c: {a: string} | undefined;
}>();

// Recursive array types must remain lazy instead of being repeatedly expanded through tuple spreads.
type RecursiveArray = RecursiveArray[];
expectTypeOf<SharedUnionFieldsDeepRecurseIntoArrays<RecursiveArray>>().toBeAssignableTo<RecursiveArray>();
expectTypeOf<RecursiveArray>().toBeAssignableTo<SharedUnionFieldsDeepRecurseIntoArrays<RecursiveArray>>();
type RecursiveReadonlyArray = readonly RecursiveReadonlyArray[];
expectTypeOf<SharedUnionFieldsDeepRecurseIntoArrays<RecursiveReadonlyArray>>().toBeAssignableTo<RecursiveReadonlyArray>();
expectTypeOf<RecursiveReadonlyArray>().toBeAssignableTo<SharedUnionFieldsDeepRecurseIntoArrays<RecursiveReadonlyArray>>();

// Recursive object unions still share their element fields at every array depth.
type LeftNode = {value: string; children: LeftNode[]; leftOnly: true};
type RightNode = {value: number; children: RightNode[]; rightOnly: true};
type CommonNode = {value: string | number; children: CommonNode[]};
expectTypeOf<SharedUnionFieldsDeepRecurseIntoArrays<LeftNode | RightNode>>().toBeAssignableTo<CommonNode>();
expectTypeOf<CommonNode>().toBeAssignableTo<SharedUnionFieldsDeepRecurseIntoArrays<LeftNode | RightNode>>();
expectTypeOf<SharedUnionFieldsDeepRecurseIntoArrays<{nested: RecursiveArray; readonly other?: RecursiveReadonlyArray}>>().toBe<{nested: RecursiveArray; readonly other?: RecursiveReadonlyArray}>();
expectTypeOf<SharedUnionFieldsDeep<RecursiveArray>>().toBe<RecursiveArray>();

// Ordinary array unions merge their element shapes rather than distributing into separate arrays.
type LeftArrayEntry = {shared: string; left: true};
type RightArrayEntry = {shared: number; right: true};
expectTypeOf<SharedUnionFieldsDeepRecurseIntoArrays<LeftArrayEntry[] | RightArrayEntry[]>>().toBe<Array<{shared: string | number}>>();
expectTypeOf<SharedUnionFieldsDeepRecurseIntoArrays<readonly LeftArrayEntry[] | readonly RightArrayEntry[]>>().toBe<ReadonlyArray<{shared: string | number}>>();
expectTypeOf<SharedUnionFieldsDeepRecurseIntoArrays<LeftArrayEntry[] | readonly RightArrayEntry[]>>().toBe<Array<{shared: string | number}> | ReadonlyArray<{shared: string | number}>>();
expectTypeOf<SharedUnionFieldsDeepRecurseIntoArrays<Array<string | number>>>().toBe<Array<string | number>>();

// A fixed tuple in any member keeps the existing tuple-length selection.
expectTypeOf<SharedUnionFieldsDeepRecurseIntoArrays<string[] | []>>().toBe<[]>();
expectTypeOf<SharedUnionFieldsDeepRecurseIntoArrays<readonly string[] | readonly []>>().toBe<readonly []>();
expectTypeOf<SharedUnionFieldsDeepRecurseIntoArrays<boolean[] | [number, ...string[]]>>().toBe<[number | boolean, ...Array<string | boolean>]>();
expectTypeOf<SharedUnionFieldsDeepRecurseIntoArrays<readonly boolean[] | readonly [number, ...string[]]>>().toBe<readonly [number | boolean, ...Array<string | boolean>]>();
expectTypeOf<SharedUnionFieldsDeepRecurseIntoArrays<[number?, string?]>>().toBe<[]>();

// Primitive and special element types retain their established meanings.
expectTypeOf<SharedUnionFieldsDeepRecurseIntoArrays<any>>().toBe<any>();
expectTypeOf<SharedUnionFieldsDeepRecurseIntoArrays<never>>().toBe<never>();
expectTypeOf<SharedUnionFieldsDeepRecurseIntoArrays<unknown>>().toBe<unknown>();
expectTypeOf<SharedUnionFieldsDeepRecurseIntoArrays<any[]>>().toBe<any[]>();
expectTypeOf<SharedUnionFieldsDeepRecurseIntoArrays<never[]>>().toBe<never[]>();
expectTypeOf<SharedUnionFieldsDeepRecurseIntoArrays<readonly unknown[]>>().toBe<readonly unknown[]>();
expectTypeOf<SharedUnionFieldsDeepRecurseIntoArrays<Array<{value: unknown} | {value: any}>>>().toBe<Array<{value: any}>>();

// Tuple reconstruction restores readonly once while recursively sharing each position.
type ReadonlyTupleAlternatives = readonly [{shared: string; left: true}, {value: 1}] | readonly [{shared: number; right: true}, {value: 2}];
type ReadonlySharedTuple = readonly [{shared: string | number}, {value: 1 | 2}];
expectTypeOf<SharedUnionFieldsDeepRecurseIntoArrays<ReadonlyTupleAlternatives>>().toBe<ReadonlySharedTuple>();
expectTypeOf<SharedUnionFieldsDeepRecurseIntoArrays<[{shared: string; left: true}] | [{shared: number; right: true}]>>().toBe<[{shared: string | number}]>();
expectTypeOf<SharedUnionFieldsDeepRecurseIntoArrays<readonly [number, string?] | readonly [number, boolean?]>>().toBe<readonly [number]>();

// Mixed readonly alternatives continue to allow both forms of the shared tuple.
type MixedReadonlyTupleAlternatives = readonly [{shared: string; left: true}] | [{shared: number; right: true}];
type MixedReadonlySharedTuple = SharedUnionFieldsDeepRecurseIntoArrays<MixedReadonlyTupleAlternatives>;
expectTypeOf<readonly [{shared: string | number}]>().toBeAssignableTo<MixedReadonlySharedTuple>();
expectTypeOf<[{shared: string | number}]>().toBeAssignableTo<MixedReadonlySharedTuple>();
expectTypeOf<MixedReadonlySharedTuple>().toBeAssignableTo<readonly [{shared: string | number}]>();
// A result that may be readonly is not assignable to a mutable array.
expectTypeOf<MixedReadonlySharedTuple>().not.toBeAssignableTo<Array<{shared: string | number}>>();

// Readonly on the owning property and on nested tuples is independent.
expectTypeOf<SharedUnionFieldsDeepRecurseIntoArrays<{
	readonly rows?: readonly [readonly [{value: string; left: true}]];
} | {
	readonly rows?: readonly [readonly [{value: number; right: true}]];
}>>().toBe<{readonly rows?: readonly [readonly [{value: string | number}]]}>();

// Fixed prefixes with a rest still keep their tuple shape and access mode.
expectTypeOf<SharedUnionFieldsDeepRecurseIntoArrays<readonly [number, ...string[]] | readonly [boolean, ...Date[]]>>()
	.toBe<readonly [number | boolean, ...Array<string | Date>]>();
expectTypeOf<SharedUnionFieldsDeepRecurseIntoArrays<[number, ...string[]] | [boolean, ...Date[]]>>()
	.toBe<[number | boolean, ...Array<string | Date>]>();
expectTypeOf<SharedUnionFieldsDeepRecurseIntoArrays<readonly [any, unknown, never]>>().toBe<readonly [any, unknown, never]>();

// Turning recursion off returns the original alternatives without rebuilding tuples.
expectTypeOf<SharedUnionFieldsDeep<ReadonlyTupleAlternatives, {recurseIntoArrays: false}>>().toBe<ReadonlyTupleAlternatives>();

// Normalize options at the boundary while keeping the same strategy throughout nested containers.
type NormalizationLeftRow = {value: string; leftOnly: true};
type NormalizationRightRow = {value: number; rightOnly: true};
type NormalizationGraph = {
	readonly group?: {label: 'left'; nested: {rows: readonly NormalizationLeftRow[]; tuple: readonly [NormalizationLeftRow]}; sentinels: {any: any; unknown: unknown; impossible: never}};
} | {
	readonly group?: {label: 'right'; nested: {rows: readonly NormalizationRightRow[]; tuple: readonly [NormalizationRightRow]}; sentinels: {any: any; unknown: unknown; impossible: never}};
};
type RecursiveNormalizationGraph = {
	readonly group?: {
		label: 'left' | 'right';
		nested: {rows: ReadonlyArray<{value: string | number}>; tuple: readonly [{value: string | number}]};
		sentinels: {any: any; unknown: unknown; impossible: never};
	};
};
type DefaultNormalizationGraph = {
	readonly group?: {
		label: 'left' | 'right';
		nested: {
			rows: readonly NormalizationLeftRow[] | readonly NormalizationRightRow[];
			tuple: readonly [NormalizationLeftRow] | readonly [NormalizationRightRow];
		};
		sentinels: {any: any; unknown: unknown; impossible: never};
	};
};
expectTypeOf<SharedUnionFieldsDeep<NormalizationGraph, {recurseIntoArrays: true}>>().toBe<RecursiveNormalizationGraph>();
expectTypeOf<SharedUnionFieldsDeep<NormalizationGraph, Readonly<{recurseIntoArrays: true}>>>().toBe<RecursiveNormalizationGraph>();
expectTypeOf<SharedUnionFieldsDeep<NormalizationGraph>>().toBe<DefaultNormalizationGraph>();
expectTypeOf<SharedUnionFieldsDeep<NormalizationGraph, {recurseIntoArrays: false}>>().toBe<DefaultNormalizationGraph>();
expectTypeOf<SharedUnionFieldsDeep<NormalizationGraph, any>>().toBe<DefaultNormalizationGraph>();
expectTypeOf<SharedUnionFieldsDeep<NormalizationGraph, never>>().toBe<DefaultNormalizationGraph>();

// Generic options do not prevent using a result through its known leaf or tuple type.
function _sharedLeaf<Options extends {recurseIntoArrays?: boolean}>(value: SharedUnionFieldsDeep<string, Options>): string {
	return value;
}

function _sharedTuple<Options extends {recurseIntoArrays?: boolean}>(value: SharedUnionFieldsDeep<readonly [string, number], Options>): readonly [string, number] {
	return value;
}

// An index signature must not hide fields declared in every union member.
type DeclaredIndexedFields =
	| {[key: string]: unknown; readonly kind: 'text'; id: string}
	| {[key: string]: unknown; readonly kind: 'number'; id: number};
declare const declaredIndexedFields: SharedUnionFieldsDeep<{data: DeclaredIndexedFields}>;
expectTypeOf(declaredIndexedFields.data.id).toBe<string | number>();
expectTypeOf<{data: {}}>().not.toBeAssignableTo<SharedUnionFieldsDeep<{data: DeclaredIndexedFields}>>();

// Transform declared nested fields while retaining independent owning modifiers.
type IndexedNestedFields =
	| {[key: string]: unknown; readonly details?: {value: string; left: true} | undefined; rows: ReadonlyArray<{value: string; left: true}>}
	| {[key: string]: unknown; details?: {value: number; right: true}; rows: ReadonlyArray<{value: number; right: true}>};
declare const indexedNestedFields: SharedUnionFieldsDeep<IndexedNestedFields, {recurseIntoArrays: true}>;
expectTypeOf(indexedNestedFields.details).toBe<{value: string | number} | undefined>();
expectTypeOf(indexedNestedFields.rows).toBe<ReadonlyArray<{value: string | number}>>();
// @ts-expect-error The owning field retains the readonly contributor.
indexedNestedFields.details = {value: 'updated'};
// @ts-expect-error Recursion retains readonly array access.
indexedNestedFields.rows[0] = {value: 'updated'};
const explicitlyUndefinedDetails: SharedUnionFieldsDeep<IndexedNestedFields> = {details: undefined, rows: []};
expectTypeOf(explicitlyUndefinedDetails.details).toBe<{value: string | number} | undefined>();

function _readIndexedNested<Extra>(value: SharedUnionFieldsDeep<{[key: string]: unknown; details: {value: string; extra: Extra}}>): string {
	return value.details.value;
}
