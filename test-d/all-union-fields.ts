import {expectType} from 'tsd';
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
expectType<Simplify<
{
	string: string;
	number: number;
	foo?: any;
} & Partial<Omit<TestingType, 'string' | 'number'>>
>>(normal);

declare const unMatched: AllUnionFields<TestingType | {foo: any}>;
expectType<Simplify<
{
	foo?: any;
} & Partial<TestingType>
>>(unMatched);

declare const number: AllUnionFields<TestingType | {number: number; foo: any}>;
expectType<Simplify<{
	number: number;
	foo?: any;
} & Partial<Omit<TestingType, 'number'>>
>>(number);

declare const string: AllUnionFields<TestingType | {string: string; foo: any}>;
expectType<Simplify<{
	string: string;
	foo?: any;
} & Partial<Omit<TestingType, 'string'>>
>>(string);

declare const boolean: AllUnionFields<TestingType | {boolean: boolean; foo: any}>;
expectType<Simplify<{
	boolean: boolean;
	foo?: any;
} & Partial<Omit<TestingType, 'boolean'>>
>>(boolean);

declare const date: AllUnionFields<TestingType | {date: Date; foo: any}>;
expectType<Simplify<{
	date: Date;
	foo?: any;
} & Partial<Omit<TestingType, 'date'>>
>>(date);

declare const regexp: AllUnionFields<TestingType | {regexp: RegExp; foo: any}>;
expectType<Simplify<{
	regexp: RegExp;
	foo?: any;
} & Partial<Omit<TestingType, 'regexp'>>
>>(regexp);

declare const symbol: AllUnionFields<TestingType | {symbol: symbol; foo: any}>;
expectType<Simplify<{
	symbol: symbol;
	foo?: any;
} & Partial<Omit<TestingType, 'symbol'>>
>>(symbol);

declare const null_: AllUnionFields<TestingType | {null: null; foo: any}>;
expectType<Simplify<{
	null: null;
	foo?: any;
} & Partial<Omit<TestingType, 'null'>>
>>(null_);

declare const undefined_: AllUnionFields<TestingType | {undefined: undefined; foo: any}>;
expectType<Simplify<{
	undefined: undefined;
	foo?: any;
} & Partial<Omit<TestingType, 'undefined'>>
>>(undefined_);

declare const optional: AllUnionFields<TestingType | {optional: string; foo: any}>;
expectType<Simplify<{
	optional?: string | boolean | undefined;
	foo?: any;
} & Partial<Omit<TestingType, 'optional'>>
>>(optional);

declare const propertyWithKeyword: AllUnionFields<TestingType | {readonly propertyWithKeyword: string; foo: any}>;
expectType<Simplify<{
	readonly propertyWithKeyword: boolean | string;
	foo?: any;
} & Partial<Omit<TestingType, 'propertyWithKeyword'>>
>>(propertyWithKeyword);

declare const map: AllUnionFields<TestingType | {map: Map<string, {propertyA: string}>; foo: any}>;
expectType<Simplify<{
	map: TestingType['map'] | Map<string, {propertyA: string}>;
	foo?: any;
} & Partial<Omit<TestingType, 'map'>>
>>(map);

declare const set: AllUnionFields<TestingType | {set: Set<number>; foo: any}>;
expectType<Simplify<{
	set: TestingType['set'] | Set<number>;
	foo?: any;
} & Partial<Omit<TestingType, 'set'>>
>>(set);

declare const moreUnion: AllUnionFields<TestingType | {string: string; number: number; foo: any} | {string: string; bar: any}>;
expectType<Simplify<{
	string: string;
	foo?: any;
	bar?: any;
} & Partial<Omit<TestingType, 'string'>>
>>(moreUnion);

declare const union: AllUnionFields<TestingType | {union: {a: number}}>;
expectType<Simplify<{
	union: 'test1' | 'test2' | {a: number};
} & Partial<Omit<TestingType, 'union'>>
>>(union);

declare const unionWithOptional: AllUnionFields<{a?: string; foo: number} | {a: string; bar: string}>;
expectType<{
	a?: string;
	foo?: number;
	bar?: string;
}>(unionWithOptional);

declare const mixedKeywords: AllUnionFields<{readonly a: string; b: number} | {a: string; readonly b: string}>;
expectType<{
	readonly a: string;
	readonly b: string | number;
}>(mixedKeywords);

declare const mixedKeywords2: AllUnionFields<{readonly a: string; b: number} | {a: string; readonly b: string} | {readonly c: number}>;
expectType<{
	readonly a?: string;
	readonly b?: string | number;
	readonly c?: number;
}>(mixedKeywords2);

// Non-recursive types
expectType<Set<string> | Map<string, string>>({} as AllUnionFields<Set<string> | Map<string, string>>);
expectType<string[] | Set<string>>({} as AllUnionFields<string[] | Set<string>>);
expectType<NonRecursiveType>({} as AllUnionFields<NonRecursiveType>);

// Mix of non-recursive and recursive types
expectType<{a: string | number; b?: true} | undefined>({} as AllUnionFields<{a: string} | {a: number; b: true} | undefined>);
expectType<RegExp | {test: string}>({} as AllUnionFields<RegExp | {test: string}>);
expectType<RegExp | null | {test: string | number; foo?: any}>({} as AllUnionFields<RegExp | null | {test: string} | {test: number; foo: any}>);

// Boundary types
expectType<any>({} as AllUnionFields<any>);
expectType<never>({} as AllUnionFields<never>);
