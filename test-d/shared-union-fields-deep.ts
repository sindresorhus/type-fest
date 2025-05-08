import {expectType} from 'tsd';
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
	set: Set<string> ;
	objectSet: Set<{propertyA: string; propertyB: string}>;
	array: Array<{a: number; b: string}>;
	readonlyArray: ReadonlyArray<{a: number; b: string}>;
};

type SharedUnionFieldsDeepRecurseIntoArrays<T> = SharedUnionFieldsDeep<T, {recurseIntoArrays: true}>;

declare const normal: SharedUnionFieldsDeep<TestingType | {string: string; number: number; foo: any}>;
expectType<{string: string; number: number}>(normal);

declare const normal2: SharedUnionFieldsDeep<TestingType | {string: string; foo: any}>;
expectType<{string: string}>(normal2);

declare const unMatched: SharedUnionFieldsDeep<TestingType | {foo: any}>;
expectType<{}>(unMatched);

declare const number: SharedUnionFieldsDeep<TestingType | {number: number; foo: any}>;
expectType<{number: number}>(number);

declare const string: SharedUnionFieldsDeep<TestingType | {string: string; foo: any}>;
expectType<{string: string}>(string);

declare const boolean: SharedUnionFieldsDeep<TestingType | {boolean: boolean; foo: any}>;
expectType<{boolean: boolean}>(boolean);

declare const date: SharedUnionFieldsDeep<TestingType | {date: Date; foo: any}>;
expectType<{date: Date}>(date);

declare const regexp: SharedUnionFieldsDeep<TestingType | {regexp: RegExp; foo: any}>;
expectType<{regexp: RegExp}>(regexp);

declare const symbol: SharedUnionFieldsDeep<TestingType | {symbol: symbol; foo: any}>;
expectType<{symbol: symbol}>(symbol);

declare const null_: SharedUnionFieldsDeep<TestingType | {null: null; foo: any}>;
expectType<{null: null}>(null_);

declare const undefined_: SharedUnionFieldsDeep<TestingType | {undefined: undefined; foo: any}>;
expectType<{undefined: undefined}>(undefined_);

declare const optional: SharedUnionFieldsDeep<TestingType | {optional: string; foo: any}>;
expectType<{optional?: boolean | string | undefined}>(optional);

declare const propertyWithKeyword: SharedUnionFieldsDeep<TestingType | {readonly propertyWithKeyword: string; foo: any}>;
expectType<{readonly propertyWithKeyword: boolean | string}>(propertyWithKeyword);

declare const map: SharedUnionFieldsDeep<TestingType | {map: Map<string, {propertyA: string}>; foo: any}>;
expectType<{map: TestingType['map'] | Map<string, {propertyA: string}>}>(map);

declare const set: SharedUnionFieldsDeep<TestingType | {set: Set<number>; foo: any}>;
expectType<{set: TestingType['set'] | Set<number>}>(set);

declare const union: SharedUnionFieldsDeep<TestingType | {string: string; number: number; foo: any} | {string: string; bar: any}>;
expectType<{string: string}>(union);

declare const union2: SharedUnionFieldsDeep<TestingType | {union: {a: number}}>;
expectType<{union: 'test1' | 'test2' | {a: number}}>(union2);

/** Test for array */
declare const array: SharedUnionFieldsDeepRecurseIntoArrays<TestingType | {array: Array<{a: number; bar: string}>; foo: any}>;
expectType<{array: Array<{a: number}>}>(array);

declare const arrayWithoutRecursive: SharedUnionFieldsDeep<TestingType | {array: Array<{a: number; bar: string}>; foo: any}>;
expectType<{array: TestingType['array'] | Array<{a: number; bar: string}>}>(arrayWithoutRecursive);

declare const readonlyArray: SharedUnionFieldsDeepRecurseIntoArrays<TestingType | {readonlyArray: ReadonlyArray<{a: number; bar: string}>; foo: any}>;
expectType<{readonlyArray: ReadonlyArray<{a: number}>}>(readonlyArray);

/** Test for tuple */
declare const tuple: SharedUnionFieldsDeepRecurseIntoArrays<{tuple: [number]} | {tuple: [number, string]; foo: any}>;
expectType<{tuple: [number]}>(tuple);

declare const tupleWithoutRecursive: SharedUnionFieldsDeep<{tuple: [number]} | {tuple: [number, string]; foo: any}>;
expectType<{tuple: [number] | [number, string]}>(tupleWithoutRecursive);

declare const tupleOrArray: SharedUnionFieldsDeepRecurseIntoArrays<{tuple: boolean[]} | {tuple: [number, string]}>;
expectType<{tuple: [number | boolean, string | boolean]}>(tupleOrArray);

/** Test for fixed length tuple */
declare const fixedLengthTuple: SharedUnionFieldsDeepRecurseIntoArrays<{tuple: [number, string]} | {tuple: [number, string, boolean]}>;
expectType<{tuple: [number, string]}>(fixedLengthTuple);

declare const fixedLengthTuple2: SharedUnionFieldsDeepRecurseIntoArrays<{tuple: [number, string]} | {tuple: []}>;
expectType<{tuple: []}>(fixedLengthTuple2);

declare const fixedLengthTuple3: SharedUnionFieldsDeepRecurseIntoArrays<{tuple: [number, string, number]} | {tuple: [number, boolean, ...string[]]}>;
expectType<{tuple: [number, string | boolean, number | string]}>(fixedLengthTuple3);

declare const threeLengthTuple: SharedUnionFieldsDeepRecurseIntoArrays<{tuple: [number, string]} | {tuple: [number, string, boolean]} | {tuple: number[]}>;
expectType<{tuple: [number, string | number]}>(threeLengthTuple);

/** Test for non-fixed length tuple */
declare const nonFixedLengthTuple: SharedUnionFieldsDeepRecurseIntoArrays<{tuple: [number, ...string[]]} | {tuple: boolean[]}>;
expectType<{tuple: [number | boolean, ...Array<string | boolean>]}>(nonFixedLengthTuple);

declare const nonFixedLengthTuple2: SharedUnionFieldsDeepRecurseIntoArrays<{tuple: [number, ...string[]]} | {tuple: [number, string, ...boolean[]]}>;
expectType<{tuple: [number, string, ...Array<string | boolean>]}>(nonFixedLengthTuple2);

// Test for same type
type TestingType2 = TestingType & {foo: any};
declare const same: SharedUnionFieldsDeepRecurseIntoArrays<TestingType | TestingType2>;
expectType<TestingType>(same);

// Test for propagation with non union root object
declare const nonUnionRootType: SharedUnionFieldsDeep<{union: {number: number; boolean: boolean} | {number: number}}>;
expectType<{union: {number: number}}>(nonUnionRootType);

declare const unionWithUndefined: SharedUnionFieldsDeep<{
	a?: {a: string; foo: number} | {a: string; bar: string} | undefined;
	b?: {a: string; foo: number} | {a: string; bar: string};
	c: {a: string; foo: number} | {a: string; bar: string} | undefined;
}>;
expectType<{
	a?: {a: string} | undefined;
	b?: {a: string};
	c: {a: string} | undefined;
}>(unionWithUndefined);
