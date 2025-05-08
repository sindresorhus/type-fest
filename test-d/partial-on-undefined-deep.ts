import {expectAssignable, expectType} from 'tsd';
import type {PartialOnUndefinedDeep} from '../index.d.ts';

type TestingType = {
	function: (() => void) | undefined;
	object: {objectKey: 1} | undefined;
	objectDeep: {
		subObject: string | undefined;
	};
	string: string | undefined;
	union: 'test1' | 'test2' | undefined;
	number: number | undefined;
	boolean: boolean | undefined;
	date: Date | undefined;
	regexp: RegExp | undefined;
	symbol: symbol | undefined;
	null: null | undefined;
	record: Record<string, any> | undefined;
	map: Map<string, string> | undefined;
	set: Set<string> | undefined;
	array1: any[] | undefined;
	array2: Array<{propertyA: string; propertyB: number | undefined}> | undefined;
	readonly1: readonly any[] | undefined;
	readonly2: ReadonlyArray<{propertyA: string; propertyB: number | undefined}> | undefined;
	readonly readonlyProperty: string | undefined;
	tuple: ['test1', {propertyA: string; propertyB: number | undefined}] | undefined;
};
declare const indexType: {[k: string]: string | undefined; propertyA: string; propertyB: string | undefined};
declare const indexTypeUnknown: {[k: string]: unknown; propertyA: string; propertyB: number | undefined};

// Default behavior, without recursion into arrays/tuples
declare const foo: PartialOnUndefinedDeep<TestingType>;
expectAssignable<{
	function?: TestingType['function'];
	object?: TestingType['object'];
	objectDeep: {
		subObject?: TestingType['objectDeep']['subObject'];
	};
	string?: TestingType['string'];
	union?: TestingType['union'];
	number?: TestingType['number'];
	boolean?: TestingType['boolean'];
	date?: TestingType['date'];
	regexp?: TestingType['regexp'];
	symbol?: TestingType['symbol'];
	null?: TestingType['null'];
	record?: TestingType['record'];
	map?: TestingType['map'];
	set?: TestingType['set'];
	array1?: TestingType['array1'];
	array2?: TestingType['array2'];
	readonly1?: TestingType['readonly1'];
	readonly2?: TestingType['readonly2'];
	readonly readonlyProperty?: TestingType['readonlyProperty'];
	tuple?: TestingType['tuple'];
}>(foo);

declare const indexTypeWithoutRecursion: PartialOnUndefinedDeep<typeof indexType>;
declare const indexTypeUnknownWithoutRecursion: PartialOnUndefinedDeep<typeof indexTypeUnknown>;
expectType<{[k: string]: string | undefined; propertyA: string; propertyB?: string | undefined}>(indexTypeWithoutRecursion);
expectType<{[k: string]: unknown; propertyA: string; propertyB?: number | undefined}>(indexTypeUnknownWithoutRecursion);

// With recursion into arrays/tuples activated
declare const bar: PartialOnUndefinedDeep<TestingType, {recurseIntoArrays: true}>;
expectAssignable<{
	function?: TestingType['function'];
	object?: TestingType['object'];
	objectDeep: {
		subObject?: TestingType['objectDeep']['subObject'];
	};
	string?: TestingType['string'];
	union?: TestingType['union'];
	number?: TestingType['number'];
	boolean?: TestingType['boolean'];
	date?: TestingType['date'];
	regexp?: TestingType['regexp'];
	symbol?: TestingType['symbol'];
	null?: TestingType['null'];
	record?: TestingType['record'];
	map?: TestingType['map'];
	set?: TestingType['set'];
	array1?: TestingType['array1'];
	array2?: Array<{propertyA: string; propertyB?: number | undefined}> | undefined;
	readonly1?: TestingType['readonly1'];
	readonly2?: ReadonlyArray<{propertyA: string; propertyB?: number | undefined}> | undefined;
	readonly readonlyProperty?: TestingType['readonlyProperty'];
	tuple?: ['test1', {propertyA: string; propertyB?: number | undefined}] | undefined;
}>(bar);

declare const indexTypeWithRecursion: PartialOnUndefinedDeep<typeof indexType, {recurseIntoArrays: true}>;
declare const indexTypeUnknownWithRecursion: PartialOnUndefinedDeep<typeof indexTypeUnknown, {recurseIntoArrays: true}>;
expectType<{[k: string]: string | undefined; propertyA: string; propertyB?: string | undefined}>(indexTypeWithRecursion);
expectType<{[k: string]: unknown; propertyA: string; propertyB?: number | undefined}>(indexTypeUnknownWithRecursion);
