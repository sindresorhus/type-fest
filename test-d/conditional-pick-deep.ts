import {expectType, expectAssignable} from 'tsd';
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
	readonlyMap: ReadonlyMap<string, string>;
	weakMap: WeakMap<WeakKey, string>;
	set: Set<string>;
	readonlySet: ReadonlySet<string>;
	weakSet: WeakSet<WeakKey>;
	date: Date;
	number: 1;
	array: string[];
	readonlyArray: readonly string[];
	tuples: ['foo', 'bar'];
	interface: InterfaceA;
	instanceA: ClassA;
	ClassA: typeof ClassA;
	function: (...arguments_: string[]) => string;
	promise: Promise<string>;
	stringOrBoolean: string | boolean;
	never: never;
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
	never: never;
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
	never: never;
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
expectType<{optional?: boolean; optionalWithUndefined?: boolean | undefined; never: never}>(booleanPick);

declare const numberPick: ConditionalPickDeep<Example, number>;
expectType<{number: 1; interface: {a: number}; never: never}>(numberPick);

declare const emptyPick: ConditionalPickDeep<Example, 'abcdefg'>;
expectType<{never: never}>(emptyPick);

declare const emptyEqualityPick: ConditionalPickDeep<Example, 'abcdefg', {condition: 'equality'}>;
expectType<never>(emptyEqualityPick);

// Returns `never` when no keys match the condition
declare const noMatchingKeys: ConditionalPickDeep<{a: string; b: number}, boolean>;
expectType<never>(noMatchingKeys);

// Union with no common properties
declare const unionNoCommon: ConditionalPickDeep<{a: string} | {b: string}, string>;
expectType<{a: string} | {b: string}>(unionNoCommon);

// A union member with no matching properties contributes no value to the result.
declare const partlyMatchingUnion: ConditionalPickDeep<{a: string} | {b: number}, string>;
expectType<{a: string}>(partlyMatchingUnion);

declare const nestedPartlyMatchingUnion: ConditionalPickDeep<{data: {a: string} | {b: number}}, string>;
expectType<{data: {a: string}}>(nestedPartlyMatchingUnion);

declare const nestedNonmatchingUnion: ConditionalPickDeep<{data: {a: boolean} | {b: number}; label: string}, string>;
expectType<{label: string}>(nestedNonmatchingUnion);

// A nonempty index signature survives recursive filtering even beside a wholly nonmatching union member.
declare const nestedIndexSignatureUnion: ConditionalPickDeep<{data: Record<string, string> | {a: number}}, string>;
expectType<{data: Record<string, string>}>(nestedIndexSignatureUnion);

// Known limitation: optional object properties are not recursed into, but their whole value can still match directly.
declare const optionalObjectRecursion: ConditionalPickDeep<{data?: {a: string}}, string>;
expectType<never>(optionalObjectRecursion);

declare const optionalObjectDirectMatch: ConditionalPickDeep<{data?: {a: string}}, {a: string} | undefined>;
expectType<{data?: {a: string}}>(optionalObjectDirectMatch);

declare const stringOrBooleanPick: ConditionalPickDeep<Example, string | boolean>;
expectType<{
	literal: 'foo';
	string: string;
	stringOrBoolean: string | boolean;
	instanceA: {
		a: string;
	};
	never: never;
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
expectType<{array: string[]; tuples: ['foo', 'bar']; never: never}>(arrayPick);

declare const arrayEqualityPick: ConditionalPickDeep<Example, string[], {condition: 'equality'}>;
expectType<{array: string[]}>(arrayEqualityPick);

declare const tuplePick: ConditionalPickDeep<Example, ['foo', 'bar']>;
expectType<{tuples: ['foo', 'bar']; never: never}>(tuplePick);

declare const instancePick: ConditionalPickDeep<Example, ClassA>;
expectType<{instanceA: ClassA; never: never}>(instancePick);

declare const classPick: ConditionalPickDeep<Example, typeof ClassA>;
expectType<{ClassA: typeof ClassA; never: never}>(classPick);

declare const functionPick: ConditionalPickDeep<Example, (...arguments_: string[]) => string>;
expectType<{function: (...arguments_: string[]) => string; never: never}>(functionPick);

declare const mapPick: ConditionalPickDeep<Example, Map<string, string>>;
expectType<{map: Map<string, string>; never: never}>(mapPick);

declare const setPick: ConditionalPickDeep<Example, Set<string>>;
expectType<{set: Set<string>; never: never}>(setPick);

declare const interfaceTest: ConditionalPickDeep<Example, InterfaceA>;
expectType<{interface: InterfaceA; never: never}>(interfaceTest);

// An object with only an index signature is not empty, so it must not be filtered out. The shallow `ConditionalPick` already handles it.
declare const indexSignatureString: ConditionalPickDeep<{[key: string]: string}, string>;
expectType<{[key: string]: string}>(indexSignatureString);

// The result must not be `never`, so the picked properties are readable.
declare const indexSignatureObject: ConditionalPickDeep<Record<string, {a: string; b: number}>, {a: string}>;
expectAssignable<Record<string, {a: string}>>(indexSignatureObject);

// Each level goes through a mapped type, a conditional and `ConditionalSimplifyDeep`, so verify twelve levels of nesting remain within TypeScript's instantiation budget.
type DeepLevel11 = {leaf: string};
type DeepLevel10 = {next: DeepLevel11};
type DeepLevel9 = {next: DeepLevel10};
type DeepLevel8 = {next: DeepLevel9};
type DeepLevel7 = {next: DeepLevel8};
type DeepLevel6 = {next: DeepLevel7};
type DeepLevel5 = {next: DeepLevel6};
type DeepLevel4 = {next: DeepLevel5};
type DeepLevel3 = {next: DeepLevel4};
type DeepLevel2 = {next: DeepLevel3};
type DeepLevel1 = {next: DeepLevel2};
type DeepLevel0 = {next: DeepLevel1};

expectType<DeepLevel0>({} as ConditionalPickDeep<DeepLevel0, string>);

// A property whose value is `undefined` or `{}` matches a condition of `undefined` or `{}` like any other value, so it is picked. Removing the placeholder by its value cannot tell those two apart, which is what used to drop them.
declare const undefinedValuePick: ConditionalPickDeep<{data: undefined; meta: string}, string | undefined>;
expectType<{data: undefined; meta: string}>(undefinedValuePick);

declare const onlyUndefinedValuePick: ConditionalPickDeep<{data: undefined}, undefined>;
expectType<{data: undefined}>(onlyUndefinedValuePick);

declare const emptyObjectValuePick: ConditionalPickDeep<{data: {}; meta: string}, {}>;
expectType<{data: {}; meta: string}>(emptyObjectValuePick);

declare const optionalUndefinedValuePick: ConditionalPickDeep<{data?: undefined; meta: string}, string | undefined>;
expectType<{data?: undefined; meta: string}>(optionalUndefinedValuePick);

// Arrays are not recursed into, so a match that is only inside an array is not found. The comparable `*Deep` types take a `recurseIntoArrays` option for this; `ConditionalPickDeep` has none. See the note in the docs.
declare const matchInsideArray: ConditionalPickDeep<{a: Array<{b: 1}>}, 1>;
expectType<never>(matchInsideArray);

// A tuple at the top level is mapped as an object of matching keys and does not keep its array shape.
declare const tupleAtTopLevel: ConditionalPickDeep<[1, 2], 1>;
expectType<{0: 1}>(tupleAtTopLevel);

// An array as the whole type is mapped as a numeric index signature, with only matching element union members.
declare const arrayAtTopLevel: ConditionalPickDeep<ReadonlyArray<{a: 1} | {b: 2}>, 1>;
expectType<{readonly [index: number]: {a: 1}}>(arrayAtTopLevel);
