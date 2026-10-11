import {expectTypeOf} from 'nz';
import type {OmitDeep} from '../index.d.ts';

declare class ClassA {
	a: string;
}

type BaseType = {
	string: string;
	optionalString?: string;
	array: number[];
	readonlyArray: readonly number[];
	tuples: ['foo', 'bar'];
	objectArray: Array<{a: 1; b: 2}>;
	leadingSpreadArray: [...Array<{a: 1}>, {b: 2}];
	tailingSpreadArray: [{a: 1}, {b: {c: 2; other: 2}}, ...Array<{d: 3}>];
	objectTuple: [{a: 1}];
	number: number;
	boolean: boolean;
	date: Date;
	Class: typeof ClassA;
	instance: ClassA;
	0: number;
	1?: number;
	optionalObject?: {
		optionalString?: string;
	};
};

type Testing = {
	object: BaseType;
};

declare const normal: OmitDeep<Testing, 'object'>;
expectTypeOf(normal).toBe<Omit<Testing, 'object'>>();

declare const normal2: OmitDeep<Testing, 'object.string'>;
expectTypeOf(normal2).toBe<{object: Omit<BaseType, 'string'>}>();

declare const omitNotExistProperty: OmitDeep<Testing, 'not_in_Testing'>;
expectTypeOf(omitNotExistProperty).toBe<Testing>();

declare const omitNotExistProperties: OmitDeep<Testing, 'not_in_Testing' | 'not_in_Testing2'>;
expectTypeOf(omitNotExistProperties).toBe<Testing>();

declare const omitNotExistProperty2: OmitDeep<Testing, 'object.not_in_object'>;
expectTypeOf(omitNotExistProperty2).toBe<Testing>();

declare const omitNotExistArrayProperty2: OmitDeep<[1, 2, 3], 'not_in_array'>;
expectTypeOf(omitNotExistArrayProperty2).toBe<[1, 2, 3]>();

declare const number: OmitDeep<Testing, 'object.number'>;
expectTypeOf(number).toBe<{object: Omit<BaseType, 'number'>}>();

declare const boolean: OmitDeep<Testing, 'object.boolean'>;
expectTypeOf(boolean).toBe<{object: Omit<BaseType, 'boolean'>}>();

declare const date: OmitDeep<Testing, 'object.date'>;
expectTypeOf(date).toBe<{object: Omit<BaseType, 'date'>}>();

declare const class_: OmitDeep<Testing, 'object.Class'>;
expectTypeOf(class_).toBe<{object: Omit<BaseType, 'Class'>}>();

declare const instance: OmitDeep<Testing, 'object.instance'>;
expectTypeOf(instance).toBe<{object: Omit<BaseType, 'instance'>}>();

declare const array: OmitDeep<Testing, 'object.array'>;
expectTypeOf(array).toBe<{object: Omit<BaseType, 'array'>}>();

declare const numberKey: OmitDeep<Testing, 'object.1'>;
expectTypeOf(numberKey).toBe<{object: Omit<BaseType, 1>}>();

declare const numberKey2: OmitDeep<Testing, 'object.0'>;
expectTypeOf(numberKey2).toBe<{object: Omit<BaseType, 0>}>();

type DeepType = {
	nested: {
		deep: {
			deeper: {
				value: string;
				value2: string;
			};
		};
	};
	foo: string;
};
declare const deep: OmitDeep<DeepType, 'nested.deep.deeper.value'>;
expectTypeOf(deep).toBe<{
	nested: {
		deep: {
			deeper: {
				value2: string;
			};
		};
	};
	foo: string;
}>();

declare const union: OmitDeep<DeepType, 'nested.deep.deeper.value' | 'nested.deep.deeper.value2'>;
expectTypeOf(union).toBe<{
	nested: {
		deep: {
			deeper: {};
		};
	};
	foo: string;
}>();

type Optional = {
	foo?: {
		bar?: {
			baz: string;
		};
	};
};

declare const optional: OmitDeep<Optional, 'foo.bar.baz'>;
expectTypeOf(optional).toBe<{foo?: {bar?: {}}}>();

/**
Test for arrays
*/
declare const recurseIntoArray: OmitDeep<{array: BaseType['objectArray']}, `array.${number}.a`>;
expectTypeOf(recurseIntoArray).toBe<{array: Array<{b: 2}>}>();

declare const recurseIntoArray2: OmitDeep<{array: BaseType['objectArray']}, 'array.0.a'>;
expectTypeOf(recurseIntoArray2).toBe<{array: [{b: 2}, ...Array<{a: 1; b: 2}>]}>();

declare const recurseIntoArray3: OmitDeep<{array: BaseType['objectArray']}, 'array.3.a'>;
expectTypeOf(recurseIntoArray3).toBe<{array: [
	{a: 1; b: 2}, // 0
	{a: 1; b: 2}, // 1
	{a: 1; b: 2}, // 2
	{b: 2}, // 3
	...Array<{a: 1; b: 2}>,
];}>();

declare const tuple: OmitDeep<{array: BaseType['tuples']}, 'array.0'>;
expectTypeOf(tuple).toBe<{array: [unknown, 'bar']}>();

declare const arrayWithMultiplePaths: OmitDeep<{array: Array<{a: string; b: number; c: string}>}, `array.${number}.a` | `array.${number}.b`>;
expectTypeOf(arrayWithMultiplePaths).toBe<{array: Array<{c: string}>}>();

declare const tupleWithMultiplePaths: OmitDeep<{tuple: [{a: string; b: number; c: string}]}, 'tuple.0.a' | 'tuple.0.b'>;
expectTypeOf(tupleWithMultiplePaths).toBe<{tuple: [{c: string}]}>();

// Omitting an element of a tuple with optional elements keeps the rest of the tuple.
declare const omitFromOptionalTuple: OmitDeep<[string?, number?], '0'>;
expectTypeOf(omitFromOptionalTuple).toBe<[unknown, number?]>();

// Omitting every index already empties the array, so a path that continues into one of those indices cannot change the result and must not turn the array into `never[]`.
declare const redundantDeeperPath: OmitDeep<Array<{a: 1}>, `${number}` | `${number}.a`>;
expectTypeOf(redundantDeeperPath).toBe<[]>();

declare const deeperPathIntoEmptyTuple: OmitDeep<{a: []}, 'a.0.b'>;
expectTypeOf(deeperPathIntoEmptyTuple).toBe<{a: []}>();

// `Paths` emits a `${string}` path for a string index signature, so the path type accepts one and the omit has to be applied to the signature's value type, the way `PickDeep` applies a pick to it. The walk compared the path key with the mapped key, which never matches a signature, so the path was silently ignored and the input came back unchanged.
declare const throughStringIndexSignature: OmitDeep<{a: Record<string, {b: 1; c: 2}>}, 'a.x.b'>;
expectTypeOf(throughStringIndexSignature).toBe<{a: {[x: string]: {c: 2}}}>();

declare const throughNumberIndexSignature: OmitDeep<{a: Record<number, {b: 1; c: 2}>}, 'a.0.b'>;
expectTypeOf(throughNumberIndexSignature).toBe<{a: {[x: number]: {c: 2}}}>();

declare const nestedThroughIndexSignature: OmitDeep<{a: Record<string, {b: {c: 1; d: 2}}>}, 'a.x.b.c'>;
expectTypeOf(nestedThroughIndexSignature).toBe<{a: {[x: string]: {b: {d: 2}}}}>();

// A named key is still matched by name rather than by the signature rule, which only applies where the key really is a signature.
declare const namedKeyBesideSignature: OmitDeep<{a: string; b: {c: 1; d: 2}}, 'b.c'>;
expectTypeOf(namedKeyBesideSignature).toBe<{a: string; b: {d: 2}}>();

// A path that names a member leaves the signature beside it alone, the way `PickDeep` does.
declare const memberBesideSignature: OmitDeep<{[k: string]: {b: 1; c: 2}; x: {b: 1; c: 2}}, 'x.b'>;
expectTypeOf(memberBesideSignature.x).toBe<{c: 2}>();
expectTypeOf<(typeof memberBesideSignature)[string]>().toBe<{b: 1; c: 2}>();

declare const throughTemplateSignature: OmitDeep<{a: {[k: `v${string}`]: {b: 1; c: 2}}}, 'a.vx.b'>;
expectTypeOf(throughTemplateSignature).toBe<{a: {[x: `v${string}`]: {c: 2}}}>();
