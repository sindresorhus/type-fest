import {expectTypeOf} from 'nz';
import type {AllUnionFields, Simplify} from '../index.d.ts';
import type {NonRecursiveType} from '../source/internal/index.d.ts';

type TestingType = {
	function: () => void;
	record: Record<
		string,
		{
			propertyA: string;
		}
	>;
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

declare const normal: AllUnionFields<
TestingType | {string: string; number: number; foo: any}
>;
expectTypeOf(normal).toBe<Simplify<
	{
		string: string;
		number: number;
		foo?: any;
	} & Partial<Omit<TestingType, 'string' | 'number'>>
>>();

declare const unMatched: AllUnionFields<TestingType | {foo: any}>;
expectTypeOf(unMatched).toBe<Simplify<
	{
		foo?: any;
	} & Partial<TestingType>
>>();

declare const number: AllUnionFields<TestingType | {number: number; foo: any}>;
expectTypeOf(number).toBe<Simplify<{
	number: number;
	foo?: any;
} & Partial<Omit<TestingType, 'number'>>
>>();

declare const string: AllUnionFields<TestingType | {string: string; foo: any}>;
expectTypeOf(string).toBe<Simplify<{
	string: string;
	foo?: any;
} & Partial<Omit<TestingType, 'string'>>
>>();

declare const boolean: AllUnionFields<TestingType | {boolean: boolean; foo: any}>;
expectTypeOf(boolean).toBe<Simplify<{
	boolean: boolean;
	foo?: any;
} & Partial<Omit<TestingType, 'boolean'>>
>>();

declare const date: AllUnionFields<TestingType | {date: Date; foo: any}>;
expectTypeOf(date).toBe<Simplify<{
	date: Date;
	foo?: any;
} & Partial<Omit<TestingType, 'date'>>
>>();

declare const regexp: AllUnionFields<TestingType | {regexp: RegExp; foo: any}>;
expectTypeOf(regexp).toBe<Simplify<{
	regexp: RegExp;
	foo?: any;
} & Partial<Omit<TestingType, 'regexp'>>
>>();

declare const symbol: AllUnionFields<TestingType | {symbol: symbol; foo: any}>;
expectTypeOf(symbol).toBe<Simplify<{
	symbol: symbol;
	foo?: any;
} & Partial<Omit<TestingType, 'symbol'>>
>>();

declare const null_: AllUnionFields<TestingType | {null: null; foo: any}>;
expectTypeOf(null_).toBe<Simplify<{
	null: null;
	foo?: any;
} & Partial<Omit<TestingType, 'null'>>
>>();

declare const undefined_: AllUnionFields<TestingType | {undefined: undefined; foo: any}>;
expectTypeOf(undefined_).toBe<Simplify<{
	undefined: undefined;
	foo?: any;
} & Partial<Omit<TestingType, 'undefined'>>
>>();

declare const optional: AllUnionFields<TestingType | {optional: string; foo: any}>;
expectTypeOf(optional).toBe<Simplify<{
	optional?: string | boolean | undefined;
	foo?: any;
} & Partial<Omit<TestingType, 'optional'>>
>>();

declare const propertyWithKeyword: AllUnionFields<TestingType | {readonly propertyWithKeyword: string; foo: any}>;
expectTypeOf(propertyWithKeyword).toBe<Simplify<{
	readonly propertyWithKeyword: boolean | string;
	foo?: any;
} & Partial<Omit<TestingType, 'propertyWithKeyword'>>
>>();

declare const map: AllUnionFields<TestingType | {map: Map<string, {propertyA: string}>; foo: any}>;
expectTypeOf(map).toBe<Simplify<{
	map: TestingType['map'] | Map<string, {propertyA: string}>;
	foo?: any;
} & Partial<Omit<TestingType, 'map'>>
>>();

declare const set: AllUnionFields<TestingType | {set: Set<number>; foo: any}>;
expectTypeOf(set).toBe<Simplify<{
	set: TestingType['set'] | Set<number>;
	foo?: any;
} & Partial<Omit<TestingType, 'set'>>
>>();

declare const moreUnion: AllUnionFields<TestingType | {string: string; number: number; foo: any} | {string: string; bar: any}>;
expectTypeOf(moreUnion).toBe<Simplify<{
	string: string;
	foo?: any;
	bar?: any;
} & Partial<Omit<TestingType, 'string'>>
>>();

declare const union: AllUnionFields<TestingType | {union: {a: number}}>;
expectTypeOf(union).toBe<Simplify<{
	union: 'test1' | 'test2' | {a: number};
} & Partial<Omit<TestingType, 'union'>>
>>();

declare const unionWithOptional: AllUnionFields<{a?: string; foo: number} | {a: string; bar: string}>;
expectTypeOf(unionWithOptional).toBe<{
	a?: string;
	foo?: number;
	bar?: string;
}>();

declare const mixedKeywords: AllUnionFields<{readonly a: string; b: number} | {a: string; readonly b: string}>;
expectTypeOf(mixedKeywords).toBe<{
	readonly a: string;
	readonly b: string | number;
}>();

declare const mixedKeywords2: AllUnionFields<{readonly a: string; b: number} | {a: string; readonly b: string} | {readonly c: number}>;
expectTypeOf(mixedKeywords2).toBe<{
	readonly a?: string;
	readonly b?: string | number;
	readonly c?: number;
}>();

// Non-recursive types
expectTypeOf<AllUnionFields<Set<string> | Map<string, string>>>().toBe<Set<string> | Map<string, string>>();
expectTypeOf<AllUnionFields<string[] | Set<string>>>().toBe<string[] | Set<string>>();
expectTypeOf<AllUnionFields<NonRecursiveType>>().toBe<NonRecursiveType>();

// Mix of non-recursive and recursive types
expectTypeOf<AllUnionFields<{a: string} | {a: number; b: true} | undefined>>().toBe<{a: string | number; b?: true} | undefined>();
expectTypeOf<AllUnionFields<RegExp | {test: string}>>().toBe<RegExp | {test: string}>();
expectTypeOf<AllUnionFields<RegExp | null | {test: string} | {test: number; foo: any}>>().toBe<RegExp | null | {test: string | number; foo?: any}>();

// Boundary types
expectTypeOf<AllUnionFields<any>>().toBe<any>();
expectTypeOf<AllUnionFields<never>>().toBe<never>();

// A `WeakMap` and a `WeakSet` are passed through like a `Map` and a `Set`, rather than having their members spread into an object.
declare const weakMapSkipped: AllUnionFields<WeakMap<object, string> | {a: 1}>;
expectTypeOf(weakMapSkipped).toBe<WeakMap<object, string> | {a: 1}>();

declare const weakSetSkipped: AllUnionFields<WeakSet<object> | {a: 1}>;
expectTypeOf(weakSetSkipped).toBe<WeakSet<object> | {a: 1}>();
