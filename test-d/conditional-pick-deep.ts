import {expectTypeOf} from 'nz';
import type {ConditionalPickDeep, PartialDeep} from '../index.d.ts';

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

// Optional object properties are recursed into, and the `undefined` added by reading them contributes no keys.
declare const optionalObjectRecursion: ConditionalPickDeep<{data?: {a: string}}, string>;
expectTypeOf(optionalObjectRecursion).toBe<{data?: {a: string}}>();

declare const optionalObjectDirectMatch: ConditionalPickDeep<{data?: {a: string}}, {a: string} | undefined>;
expectTypeOf(optionalObjectDirectMatch).toBe<{data?: {a: string}}>();

// An optional object property whose content matches nothing is dropped entirely, like a nonmatching union member.
declare const optionalObjectNoMatch: ConditionalPickDeep<{data?: {a: string}; other: number}, number>;
expectTypeOf(optionalObjectNoMatch).toBe<{other: number}>();

// Optional object properties are entered through many levels, and each level stays optional while nonmatching keys are dropped.
type OptionalLevel4 = {leaf: string};
type OptionalLevel3 = {next?: OptionalLevel4; ignored: number};
type OptionalLevel2 = {next?: OptionalLevel3; ignored: number};
type OptionalLevel1 = {next?: OptionalLevel2; ignored: number};
declare const optionalObjectDeep: ConditionalPickDeep<OptionalLevel1, string>;
expectTypeOf(optionalObjectDeep).toBe<{next?: {next?: {next?: {leaf: string}}}}>();

// Composing with `PartialDeep` is a main use-case: see https://github.com/sindresorhus/type-fest/issues/572.
declare const partialDeepComposition: ConditionalPickDeep<PartialDeep<{price: {gte: number; lte: number}; property: number}>, number | undefined>;
expectTypeOf(partialDeepComposition).toBe<{price?: {gte?: number; lte?: number}; property?: number}>();

// A required property whose value is an object or `undefined` keeps the picked content and drops the `undefined` member, like any other nonmatching union member.
declare const declaredUndefinedObject: ConditionalPickDeep<{data: {a: string; z: number} | undefined}, string>;
expectTypeOf(declaredUndefinedObject).toBe<{data: {a: string}}>();

// A written `| undefined` in an optional property's value behaves like the `undefined` added by the optional modifier.
declare const writtenUndefinedOptional: ConditionalPickDeep<{data?: {a: string; z: number} | undefined}, string>;
expectTypeOf(writtenUndefinedOptional).toBe<{data?: {a: string}}>();

// An index signature with a declared `| undefined` value is recursed into too.
declare const indexSignatureUndefined: ConditionalPickDeep<{[key: string]: {a: string; b: number} | undefined}, string>;
expectTypeOf(indexSignatureUndefined).toBe<{[key: string]: {a: string}}>();

// An optional property with a union of objects is recursed into.
declare const optionalUnionOfObjects: ConditionalPickDeep<{data?: {a: string} | {b: number}}, string>;
expectTypeOf(optionalUnionOfObjects).toBe<{data?: {a: string}}>();

// A union with `null` is not recursed into; only an `undefined` member is excluded at the boundary.
declare const nullUnionObject: ConditionalPickDeep<{data?: {a: string} | null}, string>;
expectTypeOf(nullUnionObject).toBe<never>();

// Optional non-record-like values are still not recursed into.
declare const optionalFunction: ConditionalPickDeep<{data?: (() => string) | undefined; other: string}, string>;
expectTypeOf(optionalFunction).toBe<{other: string}>();

declare const optionalDate: ConditionalPickDeep<{data?: Date; other: string}, string>;
expectTypeOf(optionalDate).toBe<{other: string}>();

declare const optionalMap: ConditionalPickDeep<{data?: Map<string, string>; other: string}, string>;
expectTypeOf(optionalMap).toBe<{other: string}>();

// A callable with an own property that conflicts with `Function` is still a function, so it is not recursed into. The `label` property would match the condition if it were recursed into.
type CallableWithOwnBind = {(): void; bind: boolean; label: string};
declare const callableWithOwnBind: ConditionalPickDeep<{callback: CallableWithOwnBind; text: string}, string>;
expectTypeOf(callableWithOwnBind).toBe<{text: string}>();

// A data object with the same property but no call signature is still recursed into.
declare const recordWithBind: ConditionalPickDeep<{data: {bind: boolean}; text: string}, boolean>;
expectTypeOf(recordWithBind).toBe<{data: {bind: boolean}}>();

// A union that contains the callable is not recursed into either.
declare const unionWithCallable: ConditionalPickDeep<{data: CallableWithOwnBind | {x: string}; text: string}, string>;
expectTypeOf(unionWithCallable).toBe<{text: string}>();

// Arrays are not recursed into, also not through an optional property.
declare const optionalArray: ConditionalPickDeep<{data?: Array<{b: 1}>}, 1>;
expectTypeOf(optionalArray).toBe<never>();

// An optional `any`, `unknown`, or `never` value is excluded unless it matches directly.
declare const optionalAny: ConditionalPickDeep<{data?: any; other: string}, string>;
expectTypeOf(optionalAny).toBe<{other: string}>();

declare const optionalUnknown: ConditionalPickDeep<{data?: unknown; other: string}, string>;
expectTypeOf(optionalUnknown).toBe<{other: string}>();

declare const optionalNever: ConditionalPickDeep<{data?: never; other: string}, string>;
expectTypeOf(optionalNever).toBe<{other: string}>();

// Optional object properties are recursed into in `equality` mode too.
declare const optionalObjectEquality: ConditionalPickDeep<{data?: {a: string; b: number}}, string, {condition: 'equality'}>;
expectTypeOf(optionalObjectEquality).toBe<{data?: {a: string}}>();

// Optional class and interface values are recursed into, like required ones.
declare const optionalClass: ConditionalPickDeep<{data?: ClassA; other: string}, string>;
expectTypeOf(optionalClass).toBe<{data?: {a: string}; other: string}>();

declare const optionalInterface: ConditionalPickDeep<{data?: InterfaceA; other: string}, number>;
expectTypeOf(optionalInterface).toBe<{data?: {a: number}}>();

// An optional index-signature value is recursed into.
declare const optionalIndexSignature: ConditionalPickDeep<{data?: Record<string, {a: string; b: number}>}, string>;
expectTypeOf(optionalIndexSignature).toBe<{data?: Record<string, {a: string}>}>();

// Optional properties and picked nested properties keep their modifiers.
declare const optionalReadonly: ConditionalPickDeep<{readonly data?: {readonly a: string; b: number}}, string>;
expectTypeOf(optionalReadonly).toBe<{readonly data?: {readonly a: string}}>();

// A nested optional property is entered from a required parent too.
declare const nestedOptionalInRequired: ConditionalPickDeep<{data: {next?: {a: string; z: number}; keep: string}}, string>;
expectTypeOf(nestedOptionalInRequired).toBe<{data: {next?: {a: string}; keep: string}}>();

// An optional object property is filtered independently of its matching siblings.
declare const optionalObjectWithSibling: ConditionalPickDeep<{data?: {a: string; z: number}; label: string}, string>;
expectTypeOf(optionalObjectWithSibling).toBe<{data?: {a: string}; label: string}>();

// A union with `null` only removes its own key; matching siblings are kept.
declare const nullUnionWithSibling: ConditionalPickDeep<{data?: {a: string} | null; label: string}, string>;
expectTypeOf(nullUnionWithSibling).toBe<{label: string}>();

// A written `| undefined` at a nested level is dropped too.
declare const nestedWrittenUndefined: ConditionalPickDeep<{data: {next: {a: string} | undefined; keep: string}}, string>;
expectTypeOf(nestedWrittenUndefined).toBe<{data: {next: {a: string}; keep: string}}>();

// An optional object whose only matching member is itself optional needs `undefined` in the condition.
declare const optionalLeafOnly: ConditionalPickDeep<{data?: {a?: string; b: number}}, string>;
expectTypeOf(optionalLeafOnly).toBe<never>();

declare const optionalLeafOnlyWithUndefined: ConditionalPickDeep<{data?: {a?: string; b: number}}, string | undefined>;
expectTypeOf(optionalLeafOnlyWithUndefined).toBe<{data?: {a?: string}}>();

// A union with a primitive through an optional property is not recursed into, like at a required property.
declare const optionalPrimitiveUnion: ConditionalPickDeep<{data?: number | {a: string}}, number>;
expectTypeOf(optionalPrimitiveUnion).toBe<never>();

// Optional tuples are not recursed into.
declare const optionalTuple: ConditionalPickDeep<{data?: ['foo', 'bar']; other: string}, string>;
expectTypeOf(optionalTuple).toBe<{other: string}>();

// An optional primitive is picked directly when the condition includes `undefined`.
declare const optionalLiteralDirectMatch: ConditionalPickDeep<{data?: 'foo'}, 'foo' | undefined>;
expectTypeOf(optionalLiteralDirectMatch).toBe<{data?: 'foo'}>();

// An optional primitive is dropped when the condition excludes `undefined`.
declare const optionalLiteralNoMatch: ConditionalPickDeep<{data?: 'foo'; other: string}, string>;
expectTypeOf(optionalLiteralNoMatch).toBe<{other: string}>();

// An optional boolean is dropped when the condition excludes `undefined`.
declare const optionalBooleanNoMatch: ConditionalPickDeep<{data?: boolean; other: string}, boolean>;
expectTypeOf(optionalBooleanNoMatch).toBe<never>();

// An optional object property matches `unknown` directly, keeping its whole value.
declare const optionalUnknownCondition: ConditionalPickDeep<{data?: {a: string}}, unknown>;
expectTypeOf(optionalUnknownCondition).toBe<{data?: {a: string}}>();

// A condition of only `undefined` picks just the optional `undefined` property.
declare const optionalUndefinedOnly: ConditionalPickDeep<{data?: undefined; other: string}, undefined>;
expectTypeOf(optionalUndefinedOnly).toBe<{data?: undefined}>();

// A required written `| undefined` value matching directly keeps the whole union, without an optional modifier.
declare const requiredUndefinedDirectMatch: ConditionalPickDeep<{data: string | undefined; other: number}, string | undefined>;
expectTypeOf(requiredUndefinedDirectMatch).toBe<{data: string | undefined}>();

// An optional symbol-keyed object property is recursed into.
declare const optionalSymbolKey: unique symbol;
declare const optionalSymbolRecursion: ConditionalPickDeep<{readonly [optionalSymbolKey]?: {a: string; b: number}}, string>;
expectTypeOf(optionalSymbolRecursion).toBe<{readonly [optionalSymbolKey]?: {a: string}}>();

// `PartialDeep` composition works in `equality` mode too.
declare const partialDeepEquality: ConditionalPickDeep<PartialDeep<{price: {gte: number; lte: number}; name: string}>, number | undefined, {condition: 'equality'}>;
expectTypeOf(partialDeepEquality).toBe<{price?: {gte?: number; lte?: number}}>();

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

// Verify twelve levels of nesting remain within TypeScript's instantiation budget.
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

// Nested selections preserve modifiers and simplify directly retained object values.
expectTypeOf<ConditionalPickDeep<{readonly outer: {readonly label: string; count: number}; ignored: boolean}, string>>()
	.toBe<{readonly outer: {readonly label: string}}>();
expectTypeOf<ConditionalPickDeep<{data: {left: 'value'} & {right: number}}, {left: string}>>()
	.toBe<{data: {left: 'value'; right: number}}>();
expectTypeOf<ConditionalPickDeep<{data: {nested: {left: 'value'} & {right: number}}}, {nested: {left: string}}>>()
	.toBe<{data: {nested: {left: 'value'; right: number}}}>();
expectTypeOf<ConditionalPickDeep<{data: Record<string, {label: string; count: number}>}, string>>()
	.toBe<{data: Record<string, {label: string}>}>();
expectTypeOf<ConditionalPickDeep<{data: {label: string} | {count: number}; ready: boolean}, string>>()
	.toBe<{data: {label: string}}>();
expectTypeOf<ConditionalPickDeep<{data: {label: 'literal'; general: string}}, string, {condition: 'equality'}>>()
	.toBe<{data: {general: string}}>();

declare const selectedSymbol: unique symbol;
expectTypeOf<ConditionalPickDeep<{readonly [selectedSymbol]: {label: string; ignored: number}; 0: {label: string}}, string>>()
	.toBe<{readonly [selectedSymbol]: {label: string}; 0: {label: string}}>();

// Unknown values are excluded unless they match directly; a matching never property keeps its key.
expectTypeOf<ConditionalPickDeep<{label: string; ignored: any; unknown: unknown; missing: never}, string>>()
	.toBe<{label: string; missing: never}>();
expectTypeOf<ConditionalPickDeep<unknown, string>>().toBe<never>();
expectTypeOf<ConditionalPickDeep<never, string>>().toBe<never>();

function _genericSelectedObject<Value extends object>(value: ConditionalPickDeep<Value, string>): object {
	return value;
}

function _genericSelectedList<Value>(value: Array<ConditionalPickDeep<Value, string>>): object[] {
	return value;
}

declare function selectStringFields<const Value extends object>(value: Value): ConditionalPickDeep<Value, string>;
const selectedStringFields = selectStringFields({label: 'text', nested: {id: 'value', ignored: 123}});
expectTypeOf(selectedStringFields).toBe<{readonly label: 'text'; readonly nested: {readonly id: 'value'}}>();
// @ts-expect-error The retained nested value remains readonly.
selectedStringFields.nested.id = 'value';
// @ts-expect-error The number-valued field is excluded.
expectTypeOf(selectedStringFields.nested.ignored);

// A directly retained object keeps its callable fields while its intersections are flattened.
type SelectedHandler = (value: number) => string;
expectTypeOf<ConditionalPickDeep<{data: {handler: SelectedHandler} & {readonly label?: string}}, {handler: SelectedHandler}>>()
	.toBe<{data: {handler: SelectedHandler; readonly label?: string}}>();
expectTypeOf<ConditionalPickDeep<{data: {label: string} | {count: number}}, {label: string} | {count: number}, {condition: 'equality'}>>()
	.toBe<{data: {label: string} | {count: number}}>();

// A union of modes, an optional mode, or sentinel options resolve like the default.
type ModeSelectionInput = {literal: 'a'; wide: string; nested: {literal: 'b'; wide: string}};
expectTypeOf<ConditionalPickDeep<ModeSelectionInput, string, {condition: 'extends' | 'equality'}>>()
	.toBe<ConditionalPickDeep<ModeSelectionInput, string>>();
expectTypeOf<ConditionalPickDeep<ModeSelectionInput, string, {condition?: 'extends' | 'equality'}>>()
	.toBe<ConditionalPickDeep<ModeSelectionInput, string>>();
expectTypeOf<ConditionalPickDeep<ModeSelectionInput, string, any>>().toBe<ConditionalPickDeep<ModeSelectionInput, string>>();
expectTypeOf<ConditionalPickDeep<ModeSelectionInput, string, never>>().toBe<ConditionalPickDeep<ModeSelectionInput, string>>();

function _constructSelectedCallback<Arguments extends unknown[], Result>(
	value: (...arguments_: Arguments) => Result,
): ConditionalPickDeep<{handler: (...arguments_: Arguments) => Result; ignored: number}, Function> {
	return {handler: value};
}

function _readSelectedCallback<Arguments extends unknown[], Result>(
	value: ConditionalPickDeep<{handler: (...arguments_: Arguments) => Result; ignored: number}, Function>,
): (...arguments_: Arguments) => Result {
	return value.handler;
}

// An unresolved comparison mode remains usable through its common object constraint.
function _readUnresolvedComparison<Mode extends 'extends' | 'equality'>(value: ConditionalPickDeep<{literal: 'a'; wide: string}, string, {condition: Mode}>): object {
	return value;
}

expectTypeOf<ConditionalPickDeep<{literal: 'a'; wide: string}, string, {condition: 'equality'}>>().toBe<{wide: string}>();

// A concrete equality mode keeps the common field constructible, and the field stays readable with a generic mode.
function _constructKnownComparisonSelection(
	value: {readonly wide: string},
): ConditionalPickDeep<{readonly wide: string; ignored: number}, string, {condition: 'equality'}> {
	return value;
}

function _readCommonModeSelection<Mode extends 'extends' | 'equality'>(value: ConditionalPickDeep<{readonly wide: string; literal: 'a'}, string, {condition: Mode}>): string {
	return value.wide;
}

function _readGenericModeOptions<Options extends {condition?: 'extends' | 'equality'}>(value: ConditionalPickDeep<{wide: string}, string, Options>): string {
	return value.wide;
}

// A known extends policy retains literal-valued keys even while the options object stays generic.
function _readKnownExtendsComparison<Options extends {condition: 'extends'}>(value: ConditionalPickDeep<{literal: 'a'; wide: string}, string, Options>): 'a' {
	return value.literal;
}
