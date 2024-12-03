import {expectType} from 'tsd';
import {type AllUnionFields, type Simplify} from '../index';

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

type AllUnionFieldsExact<T> = AllUnionFields<T, {exact: true}>;

declare const normal: AllUnionFields<
TestingType | {string: string; number: number; foo: any}
>;
expectType<Simplify<
{
	string: string;
	number: number;
	foo?: unknown;
} & Omit<{[Key in keyof TestingType]?: unknown;}, 'string' | 'number'>
>>(normal);

declare const normalExact: AllUnionFieldsExact<
TestingType | {string: string; number: number; foo: any}
>;
expectType<Simplify<
{
	string: string;
	number: number;
	foo?: any;
} & Partial<Omit<TestingType, 'string' | 'number'>>
>>(normalExact);

declare const unMatched: AllUnionFields<TestingType | {foo: any}>;
expectType<Simplify<
{
	foo?: unknown;
} & {[Key in keyof TestingType]?: unknown;}
>>(unMatched);

declare const unMatchedExact: AllUnionFieldsExact<TestingType | {foo: any}>;
expectType<Simplify<
{
	foo?: any;
} & Partial<TestingType>
>>(unMatchedExact);

declare const number: AllUnionFields<TestingType | {number: number; foo: any}>;
expectType<Simplify<{
	number: number;
	foo?: unknown;
} & Omit<{[Key in keyof TestingType]?: unknown;}, 'number'>
>>(number);

declare const numberExact: AllUnionFieldsExact<TestingType | {number: number; foo: any}>;
expectType<Simplify<{
	number: number;
	foo?: any;
} & Partial<Omit<TestingType, 'number'>>
>>(numberExact);

declare const string: AllUnionFields<TestingType | {string: string; foo: any}>;
expectType<Simplify<{
	string: string;
	foo?: unknown;
} & Omit<{[Key in keyof TestingType]?: unknown;}, 'string'>
>>(string);

declare const stringExact: AllUnionFieldsExact<TestingType | {string: string; foo: any}>;
expectType<Simplify<{
	string: string;
	foo?: any;
} & Partial<Omit<TestingType, 'string'>>
>>(stringExact);

declare const boolean: AllUnionFields<TestingType | {boolean: boolean; foo: any}>;
expectType<Simplify<{
	boolean: boolean;
	foo?: unknown;
} & Omit<{[Key in keyof TestingType]?: unknown;}, 'boolean'>
>>(boolean);

declare const booleanExact: AllUnionFieldsExact<TestingType | {boolean: boolean; foo: any}>;
expectType<Simplify<{
	boolean: boolean;
	foo?: any;
} & Partial<Omit<TestingType, 'boolean'>>
>>(booleanExact);

declare const date: AllUnionFields<TestingType | {date: Date; foo: any}>;
expectType<Simplify<{
	date: Date;
	foo?: unknown;
} & Omit<{[Key in keyof TestingType]?: unknown;}, 'date'>
>>(date);

declare const dateExact: AllUnionFieldsExact<TestingType | {date: Date; foo: any}>;
expectType<Simplify<{
	date: Date;
	foo?: any;
} & Partial<Omit<TestingType, 'date'>>
>>(dateExact);

declare const regexp: AllUnionFields<TestingType | {regexp: RegExp; foo: any}>;
expectType<Simplify<{
	regexp: RegExp;
	foo?: unknown;
} & Omit<{[Key in keyof TestingType]?: unknown;}, 'regexp'>
>>(regexp);

declare const regexpExact: AllUnionFieldsExact<TestingType | {regexp: RegExp; foo: any}>;
expectType<Simplify<{
	regexp: RegExp;
	foo?: any;
} & Partial<Omit<TestingType, 'regexp'>>
>>(regexpExact);

declare const symbol: AllUnionFields<TestingType | {symbol: symbol; foo: any}>;
expectType<Simplify<{
	symbol: symbol;
	foo?: unknown;
} & Omit<{[Key in keyof TestingType]?: unknown;}, 'symbol'>
>>(symbol);

declare const symbolExact: AllUnionFieldsExact<TestingType | {symbol: symbol; foo: any}>;
expectType<Simplify<{
	symbol: symbol;
	foo?: any;
} & Partial<Omit<TestingType, 'symbol'>>
>>(symbolExact);

declare const null_: AllUnionFields<TestingType | {null: null; foo: any}>;
expectType<Simplify<{
	null: null;
	foo?: unknown;
} & Omit<{[Key in keyof TestingType]?: unknown;}, 'null'>
>>(null_);

declare const nullExact: AllUnionFieldsExact<TestingType | {null: null; foo: any}>;
expectType<Simplify<{
	null: null;
	foo?: any;
} & Partial<Omit<TestingType, 'null'>>
>>(nullExact);

declare const undefined_: AllUnionFields<TestingType | {undefined: undefined; foo: any}>;
expectType<Simplify<{
	undefined: undefined;
	foo?: unknown;
} & Omit<{[Key in keyof TestingType]?: unknown;}, 'undefined'>
>>(undefined_);

declare const undefinedExact: AllUnionFieldsExact<TestingType | {undefined: undefined; foo: any}>;
expectType<Simplify<{
	undefined: undefined;
	foo?: any;
} & Partial<Omit<TestingType, 'undefined'>>
>>(undefinedExact);

declare const optional: AllUnionFields<TestingType | {optional: string; foo: any}>;
expectType<Simplify<{
	optional?: string | boolean | undefined;
	foo?: unknown;
} & Omit<{[Key in keyof TestingType]?: unknown;}, 'optional'>
>>(optional);

declare const optionalExact: AllUnionFieldsExact<TestingType | {optional: string; foo: any}>;
expectType<Simplify<{
	optional?: string | boolean | undefined;
	foo?: any;
} & Partial<Omit<TestingType, 'optional'>>
>>(optionalExact);

declare const propertyWithKeyword: AllUnionFields<TestingType | {readonly propertyWithKeyword: string; foo: any}>;
expectType<Simplify<{
	readonly propertyWithKeyword: boolean | string;
	foo?: unknown;
} & Omit<{[Key in keyof TestingType]?: unknown;}, 'propertyWithKeyword'>
>>(propertyWithKeyword);

declare const propertyWithKeywordExact: AllUnionFieldsExact<TestingType | {readonly propertyWithKeyword: string; foo: any}>;
expectType<Simplify<{
	readonly propertyWithKeyword: boolean | string;
	foo?: any;
} & Partial<Omit<TestingType, 'propertyWithKeyword'>>
>>(propertyWithKeywordExact);

declare const map: AllUnionFields<TestingType | {map: Map<string, {propertyA: string}>; foo: any}>;
expectType<Simplify<{
	map: TestingType['map'] | Map<string, {propertyA: string}>;
	foo?: unknown;
} & Omit<{[Key in keyof TestingType]?: unknown;}, 'map'>
>>(map);

declare const mapExact: AllUnionFieldsExact<TestingType | {map: Map<string, {propertyA: string}>; foo: any}>;
expectType<Simplify<{
	map: TestingType['map'] | Map<string, {propertyA: string}>;
	foo?: any;
} & Partial<Omit<TestingType, 'map'>>
>>(mapExact);

declare const set: AllUnionFields<TestingType | {set: Set<number>; foo: any}>;
expectType<Simplify<{
	set: TestingType['set'] | Set<number>;
	foo?: unknown;
} & Omit<{[Key in keyof TestingType]?: unknown;}, 'set'>
>>(set);

declare const setExact: AllUnionFieldsExact<TestingType | {set: Set<number>; foo: any}>;
expectType<Simplify<{
	set: TestingType['set'] | Set<number>;
	foo?: any;
} & Partial<Omit<TestingType, 'set'>>
>>(setExact);

declare const moreUnion: AllUnionFields<TestingType | {string: string; number: number; foo: any} | {string: string; bar: any}>;
expectType<Simplify<{
	string: string;
	foo?: unknown;
	bar?: unknown;
} & Omit<{[Key in keyof TestingType]?: unknown;}, 'string'>
>>(moreUnion);

declare const moreUnionExact: AllUnionFieldsExact<TestingType | {string: string; number: number; foo: any} | {string: string; bar: any}>;
expectType<Simplify<{
	string: string;
	foo?: any;
	bar?: any;
} & Partial<Omit<TestingType, 'string'>>
>>(moreUnionExact);

declare const union: AllUnionFields<TestingType | {union: {a: number}}>;
expectType<Simplify<{
	union: 'test1' | 'test2' | {a: number};
} & Omit<{[Key in keyof TestingType]?: unknown;}, 'union'>
>>(union);

declare const unionExact: AllUnionFieldsExact<TestingType | {union: {a: number}}>;
expectType<Simplify<{
	union: 'test1' | 'test2' | {a: number};
} & Partial<Omit<TestingType, 'union'>>
>>(unionExact);

declare const unionWithOptional: AllUnionFields<{a?: string; foo: number} | {a: string; bar: string}>;
expectType<{
	a?: string;
	foo?: unknown;
	bar?: unknown;
}>(unionWithOptional);

declare const unionWithOptionalExact: AllUnionFieldsExact<{a?: string; foo: number} | {a: string; bar: string}>;
expectType<{
	a?: string;
	foo?: number;
	bar?: string;
}>(unionWithOptionalExact);

declare const mixedKeywords: AllUnionFields<{readonly a: string; b: number} | {a: string; readonly b: string}>;
expectType<{
	readonly a: string;
	readonly b: string | number;
}>(mixedKeywords);

declare const mixedKeywordsExact: AllUnionFieldsExact<{readonly a: string; b: number} | {a: string; readonly b: string}>;
expectType<{
	readonly a: string;
	readonly b: string | number;
}>(mixedKeywordsExact);

declare const mixedKeywords2: AllUnionFields<{readonly a: string; b: number} | {a: string; readonly b: string} | {readonly c: number}>;
expectType<{
	readonly a?: unknown;
	readonly b?: unknown;
	readonly c?: unknown;
}>(mixedKeywords2);

declare const mixedKeywords2Exact: AllUnionFieldsExact<{readonly a: string; b: number} | {a: string; readonly b: string} | {readonly c: number}>;
expectType<{
	readonly a?: string;
	readonly b?: string | number;
	readonly c?: number;
}>(mixedKeywords2Exact);
