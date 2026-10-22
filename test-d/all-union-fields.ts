import {expectTypeOf} from 'nz';
import type {AllUnionFields, Simplify, ValueOf} from '../index.d.ts';
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

// Discriminated union
declare const discriminatedUnion: AllUnionFields<{id: number; type: 'Email'; email: string} | {id: number; type: 'Phone'; phone: string}>;
expectTypeOf(discriminatedUnion).toBe<{
	id: number;
	type: 'Email' | 'Phone';
	email?: string;
	phone?: string;
}>();

// A non-shared key with different types in different members gets the union of the types, not `never`.
declare const nonSharedKeyWithDifferentTypes: AllUnionFields<{kind: 'a'; extra: string} | {kind: 'b'; other: number} | {kind: 'c'; extra: number}>;
expectTypeOf(nonSharedKeyWithDifferentTypes).toBe<{
	kind: 'a' | 'b' | 'c';
	extra?: string | number;
	other?: number;
}>();

// Each shared key gets the union of its types on its own, so values from different members can be mixed.
type IdAndSerial = AllUnionFields<{id: number; serial: number} | {id: string; serial: string}>;
expectTypeOf<IdAndSerial>().toBe<{id: number | string; serial: number | string}>();
expectTypeOf({id: 3, serial: 'j'}).toBeAssignableTo<IdAndSerial>();
expectTypeOf({id: 3, serial: 'j'}).not.toBeAssignableTo<{id: number; serial: number} | {id: string; serial: string}>();

// A key that is optional in only one member does not make the other shared keys accept `undefined`.
expectTypeOf<AllUnionFields<{a: string; b: number} | {a: string; b?: number}>>().toBe<{a: string; b?: number}>();

// A key that is optional in every member stays optional.
expectTypeOf<AllUnionFields<{a?: string} | {a?: number}>>().toBe<{a?: string | number}>();

// A shared key with an `undefined` value stays required.
expectTypeOf<AllUnionFields<{a: string; b: number} | {a: string; b: undefined}>>().toBe<{a: string; b: number | undefined}>();

// An empty object member makes every key optional.
expectTypeOf<AllUnionFields<{a: string; b: number} | {}>>().toBe<{a?: string; b?: number}>();

// `never` and `unknown` values are absorbed like in any other union.
expectTypeOf<AllUnionFields<{a: string} | {a: never}>>().toBe<{a: string}>();
expectTypeOf<AllUnionFields<{a: string} | {a: unknown}>>().toBe<{a: unknown}>();

// Index signature member
expectTypeOf<AllUnionFields<Record<string, number> | {a: string}>>().toBe<Simplify<{a: string | number} & {[key: string]: number | undefined}>>();

// Merge the values of an object with `ValueOf`
type Retry = () => void;
type Steps = {
	'install-app': {title: string; onRetry: Retry};
	'generate-uat': {title: string; desc: string; onRetry: Retry};
	'storing-locally': {title: string; onRetry: Retry};
};
expectTypeOf<AllUnionFields<ValueOf<Steps>>>().toBe<{title: string; onRetry: Retry; desc?: string}>();

// Only the values of the given keys are merged.
expectTypeOf<AllUnionFields<ValueOf<Steps, 'install-app' | 'storing-locally'>>>().toBe<{title: string; onRetry: Retry}>();

// TypeScript does not merge separately written function types in a union, so the merged type is only mutually assignable, not identical.
type InlineSteps = {
	'install-app': {title: string; onRetry: () => void};
	'generate-uat': {title: string; desc: string; onRetry: () => void};
};
type StepProps = AllUnionFields<ValueOf<InlineSteps>>;
expectTypeOf<StepProps>().toBeAssignableTo<{title: string; onRetry: () => void; desc?: string}>();
expectTypeOf<{title: string; onRetry: () => void; desc?: string}>().toBeAssignableTo<StepProps>();
expectTypeOf<{title: string; onRetry: () => void}>().toBeAssignableTo<StepProps>();
expectTypeOf<{onRetry: () => void; desc: string}>().not.toBeAssignableTo<StepProps>();

// Values with different types for the same key
expectTypeOf<AllUnionFields<ValueOf<{a: {x: number; y: string}; b: {x: string; z: boolean}}>>>().toBe<{x: number | string; y?: string; z?: boolean}>();

// Optional and readonly keys in the values are kept.
expectTypeOf<AllUnionFields<ValueOf<{a: {readonly x: number; y?: string}; b: {x: number}}>>>().toBe<{readonly x: number; y?: string}>();

// Nested objects are not merged.
expectTypeOf<AllUnionFields<ValueOf<{a: {nested: {x: 1}}; b: {nested: {y: 2}}}>>>().toBe<{nested: {x: 1} | {y: 2}}>();

// A single value is returned as is.
expectTypeOf<AllUnionFields<ValueOf<{a: {x: 1; y?: 2}}>>>().toBe<{x: 1; y?: 2}>();

// Values of an index signature
expectTypeOf<AllUnionFields<ValueOf<Record<string, {a: number} | {b: string}>>>>().toBe<{a?: number; b?: string}>();

// Values that are not objects are kept as separate union members.
expectTypeOf<AllUnionFields<ValueOf<{a: {x: 1}; b: {x: 2; y: 3}; c: string}>>>().toBe<string | {x: 1 | 2; y?: 3}>();

// An object without values
expectTypeOf<AllUnionFields<ValueOf<{}>>>().toBe<never>();

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
