import {expectAssignable} from 'tsd';
import type {PartialOnUndefinedDeep} from '../index';

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
	tuple: ['test1', {propertyA: string; propertyB: number | undefined}] | undefined;
};

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
	tuple?: TestingType['tuple'];
}>(foo);

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
	tuple?: ['test1', {propertyA: string; propertyB?: number | undefined}] | undefined;
}>(bar);
