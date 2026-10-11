import {expectTypeOf} from 'nz';
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
expectTypeOf(stringPick).toBe<{
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
}>();

declare const stringEqualityPick: ConditionalPickDeep<Example, string, {condition: 'equality'}>;
expectTypeOf(stringEqualityPick).toBe<{
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
}>();

declare const stringPickOptional: ConditionalPickDeep<Example, string | undefined>;
expectTypeOf(stringPickOptional).toBe<{
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
}>();

declare const stringPickOptionalOnly: ConditionalPickDeep<Example, string | undefined, {condition: 'equality'}>;
expectTypeOf(stringPickOptionalOnly).toBe<{object: {subObject: {optional?: string}}}>();

declare const booleanPick: ConditionalPickDeep<Example, boolean | undefined>;
expectTypeOf(booleanPick).toBe<{optional?: boolean; optionalWithUndefined?: boolean | undefined; never: never}>();

declare const numberPick: ConditionalPickDeep<Example, number>;
expectTypeOf(numberPick).toBe<{number: 1; interface: {a: number}; never: never}>();

declare const emptyPick: ConditionalPickDeep<Example, 'abcdefg'>;
expectTypeOf(emptyPick).toBe<{never: never}>();

declare const emptyEqualityPick: ConditionalPickDeep<Example, 'abcdefg', {condition: 'equality'}>;
expectTypeOf(emptyEqualityPick).toBe<never>();

// Returns `never` when no keys match the condition
declare const noMatchingKeys: ConditionalPickDeep<{a: string; b: number}, boolean>;
expectTypeOf(noMatchingKeys).toBe<never>();

// Union with no common properties
declare const unionNoCommon: ConditionalPickDeep<{a: string} | {b: string}, string>;
expectTypeOf(unionNoCommon).toBe<{a: string} | {b: string}>();

// A union member with no matching properties contributes no value to the result.
declare const partlyMatchingUnion: ConditionalPickDeep<{a: string} | {b: number}, string>;
expectTypeOf(partlyMatchingUnion).toBe<{a: string}>();

declare const nestedPartlyMatchingUnion: ConditionalPickDeep<{data: {a: string} | {b: number}}, string>;
expectTypeOf(nestedPartlyMatchingUnion).toBe<{data: {a: string}}>();

declare const nestedNonmatchingUnion: ConditionalPickDeep<{data: {a: boolean} | {b: number}; label: string}, string>;
expectTypeOf(nestedNonmatchingUnion).toBe<{label: string}>();

// A nonempty index signature survives recursive filtering even beside a wholly nonmatching union member.
declare const nestedIndexSignatureUnion: ConditionalPickDeep<{data: Record<string, string> | {a: number}}, string>;
expectTypeOf(nestedIndexSignatureUnion).toBe<{data: Record<string, string>}>();

// Known limitation: optional object properties are not recursed into, but their whole value can still match directly.
declare const optionalObjectRecursion: ConditionalPickDeep<{data?: {a: string}}, string>;
expectTypeOf(optionalObjectRecursion).toBe<never>();

declare const optionalObjectDirectMatch: ConditionalPickDeep<{data?: {a: string}}, {a: string} | undefined>;
expectTypeOf(optionalObjectDirectMatch).toBe<{data?: {a: string}}>();

declare const stringOrBooleanPick: ConditionalPickDeep<Example, string | boolean>;
expectTypeOf(stringOrBooleanPick).toBe<{
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
}>();

declare const stringOrBooleanPickOnly: ConditionalPickDeep<Example, string | boolean, {condition: 'equality'}>;
expectTypeOf(stringOrBooleanPickOnly).toBe<{stringOrBoolean: string | boolean}>();

declare const arrayPick: ConditionalPickDeep<Example, string[]>;
expectTypeOf(arrayPick).toBe<{array: string[]; tuples: ['foo', 'bar']; never: never}>();

declare const arrayEqualityPick: ConditionalPickDeep<Example, string[], {condition: 'equality'}>;
expectTypeOf(arrayEqualityPick).toBe<{array: string[]}>();

declare const tuplePick: ConditionalPickDeep<Example, ['foo', 'bar']>;
expectTypeOf(tuplePick).toBe<{tuples: ['foo', 'bar']; never: never}>();

declare const instancePick: ConditionalPickDeep<Example, ClassA>;
expectTypeOf(instancePick).toBe<{instanceA: ClassA; never: never}>();

declare const classPick: ConditionalPickDeep<Example, typeof ClassA>;
expectTypeOf(classPick).toBe<{ClassA: typeof ClassA; never: never}>();

declare const functionPick: ConditionalPickDeep<Example, (...arguments_: string[]) => string>;
expectTypeOf(functionPick).toBe<{function: (...arguments_: string[]) => string; never: never}>();

declare const mapPick: ConditionalPickDeep<Example, Map<string, string>>;
expectTypeOf(mapPick).toBe<{map: Map<string, string>; never: never}>();

declare const setPick: ConditionalPickDeep<Example, Set<string>>;
expectTypeOf(setPick).toBe<{set: Set<string>; never: never}>();

declare const interfaceTest: ConditionalPickDeep<Example, InterfaceA>;
expectTypeOf(interfaceTest).toBe<{interface: InterfaceA; never: never}>();

// An object with only an index signature is not empty, so it must not be filtered out. The shallow `ConditionalPick` already handles it.
declare const indexSignatureString: ConditionalPickDeep<{[key: string]: string}, string>;
expectTypeOf(indexSignatureString).toBe<{[key: string]: string}>();

// The result must not be `never`, so the picked properties are readable.
declare const indexSignatureObject: ConditionalPickDeep<Record<string, {a: string; b: number}>, {a: string}>;
expectTypeOf(indexSignatureObject).toBeAssignableTo<Record<string, {a: string}>>();

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

expectTypeOf<ConditionalPickDeep<DeepLevel0, string>>().toBe<DeepLevel0>();

// A property whose value is `undefined` or `{}` matches a condition of `undefined` or `{}` like any other value, so it is picked. Removing the placeholder by its value cannot tell those two apart, which is what used to drop them.
declare const undefinedValuePick: ConditionalPickDeep<{data: undefined; meta: string}, string | undefined>;
expectTypeOf(undefinedValuePick).toBe<{data: undefined; meta: string}>();

declare const onlyUndefinedValuePick: ConditionalPickDeep<{data: undefined}, undefined>;
expectTypeOf(onlyUndefinedValuePick).toBe<{data: undefined}>();

declare const emptyObjectValuePick: ConditionalPickDeep<{data: {}; meta: string}, {}>;
expectTypeOf(emptyObjectValuePick).toBe<{data: {}; meta: string}>();

declare const optionalUndefinedValuePick: ConditionalPickDeep<{data?: undefined; meta: string}, string | undefined>;
expectTypeOf(optionalUndefinedValuePick).toBe<{data?: undefined; meta: string}>();

// Arrays are not recursed into, so a match that is only inside an array is not found. The comparable `*Deep` types take a `recurseIntoArrays` option for this; `ConditionalPickDeep` has none. See the note in the docs.
declare const matchInsideArray: ConditionalPickDeep<{a: Array<{b: 1}>}, 1>;
expectTypeOf(matchInsideArray).toBe<never>();

// A tuple at the top level is mapped as an object of matching keys and does not keep its array shape.
declare const tupleAtTopLevel: ConditionalPickDeep<[1, 2], 1>;
expectTypeOf(tupleAtTopLevel).toBe<{0: 1}>();

// An array as the whole type is mapped as a numeric index signature, with only matching element union members.
declare const arrayAtTopLevel: ConditionalPickDeep<ReadonlyArray<{a: 1} | {b: 2}>, 1>;
expectTypeOf(arrayAtTopLevel).toBe<{readonly [index: number]: {a: 1}}>();
