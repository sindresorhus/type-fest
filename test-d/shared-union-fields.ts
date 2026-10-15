import {expectTypeOf} from 'nz';
import type {SharedUnionFields} from '../index.d.ts';
import type {NonRecursiveType} from '../source/internal/index.d.ts';

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
};

declare const normal: SharedUnionFields<TestingType | {string: string; number: number; foo: any}>;
expectTypeOf(normal).toBe<{string: string; number: number}>();

declare const normal2: SharedUnionFields<TestingType | {string: string; foo: any}>;
expectTypeOf(normal2).toBe<{string: string}>();

declare const unMatched: SharedUnionFields<TestingType | {foo: any}>;
expectTypeOf(unMatched).toBe<{}>();

declare const number: SharedUnionFields<TestingType | {number: number; foo: any}>;
expectTypeOf(number).toBe<{number: number}>();

declare const string: SharedUnionFields<TestingType | {string: string; foo: any}>;
expectTypeOf(string).toBe<{string: string}>();

declare const boolean: SharedUnionFields<TestingType | {boolean: boolean; foo: any}>;
expectTypeOf(boolean).toBe<{boolean: boolean}>();

declare const date: SharedUnionFields<TestingType | {date: Date; foo: any}>;
expectTypeOf(date).toBe<{date: Date}>();

declare const regexp: SharedUnionFields<TestingType | {regexp: RegExp; foo: any}>;
expectTypeOf(regexp).toBe<{regexp: RegExp}>();

declare const symbol: SharedUnionFields<TestingType | {symbol: symbol; foo: any}>;
expectTypeOf(symbol).toBe<{symbol: symbol}>();

declare const null_: SharedUnionFields<TestingType | {null: null; foo: any}>;
expectTypeOf(null_).toBe<{null: null}>();

declare const undefined_: SharedUnionFields<TestingType | {undefined: undefined; foo: any}>;
expectTypeOf(undefined_).toBe<{undefined: undefined}>();

declare const optional: SharedUnionFields<TestingType | {optional: string; foo: any}>;
expectTypeOf(optional).toBe<{optional?: boolean | string | undefined}>();

declare const propertyWithKeyword: SharedUnionFields<TestingType | {readonly propertyWithKeyword: string; foo: any}>;
expectTypeOf(propertyWithKeyword).toBe<{readonly propertyWithKeyword: boolean | string}>();

declare const map: SharedUnionFields<TestingType | {map: Map<string, {propertyA: string}>; foo: any}>;
expectTypeOf(map).toBe<{map: TestingType['map'] | Map<string, {propertyA: string}>}>();

declare const set: SharedUnionFields<TestingType | {set: Set<number>; foo: any}>;
expectTypeOf(set).toBe<{set: TestingType['set'] | Set<number>}>();

declare const moreUnion: SharedUnionFields<TestingType | {string: string; number: number; foo: any} | {string: string; bar: any}>;
expectTypeOf(moreUnion).toBe<{string: string}>();

declare const union: SharedUnionFields<TestingType | {union: {a: number}}>;
expectTypeOf(union).toBe<{union: 'test1' | 'test2' | {a: number}}>();

declare const unionWithOptional: SharedUnionFields<{a?: string; foo: number} | {a: string; bar: string}>;
expectTypeOf(unionWithOptional).toBe<{a?: string}>();

// Non-recursive types
expectTypeOf<SharedUnionFields<Set<string> | Map<string, string>>>().toBe<Set<string> | Map<string, string>>();
expectTypeOf<SharedUnionFields<string[] | Set<string>>>().toBe<string[] | Set<string>>();
expectTypeOf<SharedUnionFields<NonRecursiveType>>().toBe<NonRecursiveType>();

// Mix of non-recursive and recursive types
expectTypeOf<SharedUnionFields<{a: string} | {a: number; b: true} | undefined>>().toBe<{a: string | number} | undefined>();
expectTypeOf<SharedUnionFields<RegExp | {test: string}>>().toBe<RegExp | {test: string}>();
expectTypeOf<SharedUnionFields<RegExp | null | {test: string} | {test: number; foo: any}>>().toBe<RegExp | null | {test: string | number}>();

// Boundary types
expectTypeOf<SharedUnionFields<any>>().toBe<any>();
expectTypeOf<SharedUnionFields<never>>().toBe<never>();

// A `WeakMap` and a `WeakSet` are passed through like a `Map` and a `Set`, rather than being stripped of their members.
declare const weakMapSkipped: SharedUnionFields<WeakMap<object, string> | {a: 1}>;
expectTypeOf(weakMapSkipped).toBe<WeakMap<object, string> | {a: 1}>();

declare const weakSetSkipped: SharedUnionFields<WeakSet<object> | {a: 1}>;
expectTypeOf(weakSetSkipped).toBe<WeakSet<object> | {a: 1}>();

// A DOM node is a single value, so it is kept as is.
expectTypeOf<SharedUnionFields<HTMLInputElement | {a: 1}>>().toBe<HTMLInputElement | {a: 1}>();
