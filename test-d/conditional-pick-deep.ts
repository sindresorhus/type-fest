import {expectType} from 'tsd';
import type {ConditionalPickDeep} from '../index';

declare class ClassA {
	public a: string;
}

type Example = {
	optional?: boolean;
	literal: 'foo';
	string: string;
	map: Map<string, string>;
	set: Set<string>;
	date: Date;
	array: string[];
	tuples: ['foo', 'bar'];
	instanceA: ClassA;
	ClassA: typeof ClassA;
	function: (...args: string[]) => string;
	strbool: string | boolean;
	obj: {
		string: string;
		subObj: {
			optional?: string;
			string: string;
		};
	};
};

declare const stringPick: ConditionalPickDeep<Example, string>;
expectType<{
	literal: 'foo';
	string: string;
	obj: {
		string: string;
		subObj: {
			string: string;
		};
	};
}>(stringPick);

declare const stringEqualityPick: ConditionalPickDeep<Example, string, {condition: 'equality'}>;
expectType<{
	string: string;
	obj: {
		string: string;
		subObj: {
			string: string;
		};
	};
}>(stringEqualityPick);

declare const stringPickOptional: ConditionalPickDeep<Example, string | undefined>;
expectType<{
	literal: 'foo';
	string: string;
	obj: {
		string: string;
		subObj: {
			optional?: string | undefined;
			string: string;
		};
	};
}>(stringPickOptional);

declare const stringPickOptionalOnly: ConditionalPickDeep<Example, string | undefined, {condition: 'equality'}>;
expectType<{obj: {subObj: {optional?: string | undefined}}}>(stringPickOptionalOnly);

declare const booleanPick: ConditionalPickDeep<Example, boolean | undefined>;
expectType<{optional?: boolean | undefined}>(booleanPick);

declare const numberPick: ConditionalPickDeep<Example, number>;
expectType<{}>(numberPick);

declare const stringOrBooleanPick: ConditionalPickDeep<Example, string | boolean>;
expectType<{
	literal: 'foo';
	string: string;
	strbool: string | boolean;
	obj: {
		string: string;
		subObj: {
			string: string;
		};
	};
}>(stringOrBooleanPick);

declare const stringOrBooleanPickOnly: ConditionalPickDeep<Example, string | boolean, {condition: 'equality'}>;
expectType<{strbool: string | boolean}>(stringOrBooleanPickOnly);

declare const arrayPick: ConditionalPickDeep<Example, string[]>;
expectType<{array: string[]; tuples: ['foo', 'bar']}>(arrayPick);

declare const arrayEqualityPick: ConditionalPickDeep<Example, string[], {condition: 'equality'}>;
expectType<{array: string[]}>(arrayEqualityPick);

declare const tuplePick: ConditionalPickDeep<Example, ['foo', 'bar']>;
expectType<{tuples: ['foo', 'bar']}>(tuplePick);

declare const instancePick: ConditionalPickDeep<Example, ClassA>;
expectType<{instanceA: ClassA}>(instancePick);

declare const classPick: ConditionalPickDeep<Example, typeof ClassA>;
expectType<{ClassA: typeof ClassA}>(classPick);

declare const functionPick: ConditionalPickDeep<Example, (...args: string[]) => string>;
expectType<{function: (...args: string[]) => string}>(functionPick);

declare const mapPick: ConditionalPickDeep<Example, Map<string, string>>;
expectType<{map: Map<string, string>}>(mapPick);

declare const setPick: ConditionalPickDeep<Example, Set<string>>;
expectType<{set: Set<string>}>(setPick);
