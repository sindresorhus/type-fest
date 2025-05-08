import {expectType} from 'tsd';
import type {ConditionalPickDeep} from '../index.d.ts';

declare class ClassA {
	public a: string;
}

// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface InterfaceA {
	a: number;
}

type Example = {
	optional?: boolean;
	optionalWithUndefined?: boolean | undefined;
	literal: 'foo';
	string: string;
	map: Map<string, string>;
	set: Set<string>;
	date: Date;
	number: 1;
	array: string[];
	tuples: ['foo', 'bar'];
	interface: InterfaceA;
	instanceA: ClassA;
	ClassA: typeof ClassA;
	function: (...arguments_: string[]) => string;
	stringOrBoolean: string | boolean;
	object: {
		string: string;
		subObject: {
			optional?: string;
			string: string;
		};
	};
};

declare const stringPick: ConditionalPickDeep<Example, string>;
expectType<{
	literal: 'foo';
	string: string;
	instanceA: {
		a: string;
	};
	object: {
		string: string;
		subObject: {
			string: string;
		};
	};
}>(stringPick);

declare const stringEqualityPick: ConditionalPickDeep<Example, string, {condition: 'equality'}>;
expectType<{
	string: string;
	instanceA: {
		a: string;
	};
	object: {
		string: string;
		subObject: {
			string: string;
		};
	};
}>(stringEqualityPick);

declare const stringPickOptional: ConditionalPickDeep<Example, string | undefined>;
expectType<{
	literal: 'foo';
	string: string;
	instanceA: {
		a: string;
	};
	object: {
		string: string;
		subObject: {
			optional?: string;
			string: string;
		};
	};
}>(stringPickOptional);

declare const stringPickOptionalOnly: ConditionalPickDeep<Example, string | undefined, {condition: 'equality'}>;
expectType<{object: {subObject: {optional?: string}}}>(stringPickOptionalOnly);

declare const booleanPick: ConditionalPickDeep<Example, boolean | undefined>;
expectType<{optional?: boolean; optionalWithUndefined?: boolean | undefined}>(booleanPick);

declare const numberPick: ConditionalPickDeep<Example, number>;
expectType<{number: 1; interface: {a: number}}>(numberPick);

declare const emptyPick: ConditionalPickDeep<Example, 'abcdefg'>;
expectType<{}>(emptyPick);

declare const stringOrBooleanPick: ConditionalPickDeep<Example, string | boolean>;
expectType<{
	literal: 'foo';
	string: string;
	stringOrBoolean: string | boolean;
	instanceA: {
		a: string;
	};
	object: {
		string: string;
		subObject: {
			string: string;
		};
	};
}>(stringOrBooleanPick);

declare const stringOrBooleanPickOnly: ConditionalPickDeep<Example, string | boolean, {condition: 'equality'}>;
expectType<{stringOrBoolean: string | boolean}>(stringOrBooleanPickOnly);

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

declare const functionPick: ConditionalPickDeep<Example, (...arguments_: string[]) => string>;
expectType<{function: (...arguments_: string[]) => string}>(functionPick);

declare const mapPick: ConditionalPickDeep<Example, Map<string, string>>;
expectType<{map: Map<string, string>}>(mapPick);

declare const setPick: ConditionalPickDeep<Example, Set<string>>;
expectType<{set: Set<string>}>(setPick);

declare const interfaceTest: ConditionalPickDeep<Example, InterfaceA>;
expectType<{interface: InterfaceA}>(interfaceTest);
