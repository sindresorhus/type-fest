import {expectType} from 'tsd';
import type {PartialOnUndefinedDeep} from '../index';

declare const foo: PartialOnUndefinedDeep<{
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
	symbol: Symbol | undefined;
	null: null | undefined;
	record: Record<string, any> | undefined;
	map: Map<string, string> | undefined;
	set: Set<string> | undefined;
	array: any[] | undefined;
	tuple: ['test1'] | undefined;
	readonly: readonly string[] | undefined;
}>;

expectType<{
	function?: typeof foo['function'];
	object?: typeof foo['object'];
	objectDeep: {
		subObject?: typeof foo['objectDeep']['subObject'];
	};
	string?: typeof foo['string'];
	union?: typeof foo['union'];
	number?: typeof foo['number'];
	boolean?: typeof foo['boolean'];
	date?: typeof foo['date'];
	regexp?: typeof foo['regexp'];
	symbol?: typeof foo['symbol'];
	null?: typeof foo['null'];
	record?: typeof foo['record'];
	map?: typeof foo['map'];
	set?: typeof foo['set'];
	array?: typeof foo['array'];
	tuple?: typeof foo['tuple'];
	readonly?: typeof foo['readonly'];
}>(foo);
