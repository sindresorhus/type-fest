import {expectType} from 'tsd';
import type {SharedUnionFields} from '../index';

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
};

declare const normal: SharedUnionFields<TestingType | {string: string; number: number; foo: any}>;
expectType<{string: string; number: number}>(normal);

declare const normal2: SharedUnionFields<TestingType | {string: string; foo: any}>;
expectType<{string: string}>(normal2);

declare const unMatched: SharedUnionFields<TestingType | {foo: any}>;
expectType<{}>(unMatched);

declare const number: SharedUnionFields<TestingType | {number: number; foo: any}>;
expectType<{number: number}>(number);

declare const string: SharedUnionFields<TestingType | {string: string; foo: any}>;
expectType<{string: string}>(string);

declare const boolean: SharedUnionFields<TestingType | {boolean: boolean; foo: any}>;
expectType<{boolean: boolean}>(boolean);

declare const date: SharedUnionFields<TestingType | {date: Date; foo: any}>;
expectType<{date: Date}>(date);

declare const regexp: SharedUnionFields<TestingType | {regexp: RegExp; foo: any}>;
expectType<{regexp: RegExp}>(regexp);

declare const symbol: SharedUnionFields<TestingType | {symbol: symbol; foo: any}>;
expectType<{symbol: symbol}>(symbol);

declare const null_: SharedUnionFields<TestingType | {null: null; foo: any}>;
expectType<{null: null}>(null_);

declare const undefined_: SharedUnionFields<TestingType | {undefined: undefined; foo: any}>;
expectType<{undefined: undefined}>(undefined_);

declare const optional: SharedUnionFields<TestingType | {optional: string; foo: any}>;
expectType<{optional?: boolean | string | undefined}>(optional);

declare const propertyWithKeyword: SharedUnionFields<TestingType | {readonly propertyWithKeyword: string; foo: any}>;
expectType<{readonly propertyWithKeyword: boolean | string}>(propertyWithKeyword);

declare const map: SharedUnionFields<TestingType | {map: Map<string, {propertyA: string}>; foo: any}>;
expectType<{map: TestingType['map'] | Map<string, {propertyA: string}>}>(map);

declare const set: SharedUnionFields<TestingType | {set: Set<number>; foo: any}>;
expectType<{set: TestingType['set'] | Set<number>}>(set);

declare const moreUnion: SharedUnionFields<TestingType | {string: string; number: number; foo: any} | {string: string; bar: any}>;
expectType<{string: string}>(moreUnion);

declare const union: SharedUnionFields<TestingType | {union: {a: number}}>;
expectType<{union: 'test1' | 'test2' | {a: number}}>(union);

declare const unionWithOptional: SharedUnionFields<{a?: string; foo: number} | {a: string; bar: string}>;
expectType<{a?: string}>(unionWithOptional);
