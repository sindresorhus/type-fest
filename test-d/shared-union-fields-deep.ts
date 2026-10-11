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

/** Test for array */
declare const array: SharedUnionFieldsDeepRecurseIntoArrays<TestingType | {array: Array<{a: number; bar: string}>; foo: any}>;
expectTypeOf(array).toBe<{array: Array<{a: number}>}>();

declare const arrayWithoutRecursive: SharedUnionFieldsDeep<TestingType | {array: Array<{a: number; bar: string}>; foo: any}>;
expectTypeOf(arrayWithoutRecursive).toBe<{array: TestingType['array'] | Array<{a: number; bar: string}>}>();

declare const readonlyArray: SharedUnionFieldsDeepRecurseIntoArrays<TestingType | {readonlyArray: ReadonlyArray<{a: number; bar: string}>; foo: any}>;
expectTypeOf(readonlyArray).toBe<{readonlyArray: ReadonlyArray<{a: number}>}>();

/** Test for tuple */
declare const tuple: SharedUnionFieldsDeepRecurseIntoArrays<{tuple: [number]} | {tuple: [number, string]; foo: any}>;
expectTypeOf(tuple).toBe<{tuple: [number]}>();

declare const tupleWithoutRecursive: SharedUnionFieldsDeep<{tuple: [number]} | {tuple: [number, string]; foo: any}>;
expectTypeOf(tupleWithoutRecursive).toBe<{tuple: [number] | [number, string]}>();

declare const tupleOrArray: SharedUnionFieldsDeepRecurseIntoArrays<{tuple: boolean[]} | {tuple: [number, string]}>;
expectTypeOf(tupleOrArray).toBe<{tuple: [number | boolean, string | boolean]}>();

/** Test for fixed length tuple */
declare const fixedLengthTuple: SharedUnionFieldsDeepRecurseIntoArrays<{tuple: [number, string]} | {tuple: [number, string, boolean]}>;
expectTypeOf(fixedLengthTuple).toBe<{tuple: [number, string]}>();

declare const fixedLengthTuple2: SharedUnionFieldsDeepRecurseIntoArrays<{tuple: [number, string]} | {tuple: []}>;
expectTypeOf(fixedLengthTuple2).toBe<{tuple: []}>();

declare const fixedLengthTuple3: SharedUnionFieldsDeepRecurseIntoArrays<{tuple: [number, string, number]} | {tuple: [number, boolean, ...string[]]}>;
expectTypeOf(fixedLengthTuple3).toBe<{tuple: [number, string | boolean, number | string]}>();

declare const threeLengthTuple: SharedUnionFieldsDeepRecurseIntoArrays<{tuple: [number, string]} | {tuple: [number, string, boolean]} | {tuple: number[]}>;
expectTypeOf(threeLengthTuple).toBe<{tuple: [number, string | number]}>();

/** Test for non-fixed length tuple */
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
