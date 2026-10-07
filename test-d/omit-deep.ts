import {expectType} from 'tsd';
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
expectType<Omit<Testing, 'object'>>(normal);

declare const normal2: OmitDeep<Testing, 'object.string'>;
expectType<{object: Omit<BaseType, 'string'>}>(normal2);

declare const omitNotExistProperty: OmitDeep<Testing, 'not_in_Testing'>;
expectType<Testing>(omitNotExistProperty);

declare const omitNotExistProperties: OmitDeep<Testing, 'not_in_Testing' | 'not_in_Testing2'>;
expectType<Testing>(omitNotExistProperties);

declare const omitNotExistProperty2: OmitDeep<Testing, 'object.not_in_object'>;
expectType<Testing>(omitNotExistProperty2);

declare const omitNotExistArrayProperty2: OmitDeep<[1, 2, 3], 'not_in_array'>;
expectType<[1, 2, 3]>(omitNotExistArrayProperty2);

declare const number: OmitDeep<Testing, 'object.number'>;
expectType<{object: Omit<BaseType, 'number'>}>(number);

declare const boolean: OmitDeep<Testing, 'object.boolean'>;
expectType<{object: Omit<BaseType, 'boolean'>}>(boolean);

declare const date: OmitDeep<Testing, 'object.date'>;
expectType<{object: Omit<BaseType, 'date'>}>(date);

declare const class_: OmitDeep<Testing, 'object.Class'>;
expectType<{object: Omit<BaseType, 'Class'>}>(class_);

declare const instance: OmitDeep<Testing, 'object.instance'>;
expectType<{object: Omit<BaseType, 'instance'>}>(instance);

declare const array: OmitDeep<Testing, 'object.array'>;
expectType<{object: Omit<BaseType, 'array'>}>(array);

declare const numberKey: OmitDeep<Testing, 'object.1'>;
expectType<{object: Omit<BaseType, 1>}>(numberKey);

declare const numberKey2: OmitDeep<Testing, 'object.0'>;
expectType<{object: Omit<BaseType, 0>}>(numberKey2);

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
expectType<{
	nested: {
		deep: {
			deeper: {
				value2: string;
			};
		};
	};
	foo: string;
}>(deep);

declare const union: OmitDeep<DeepType, 'nested.deep.deeper.value' | 'nested.deep.deeper.value2'>;
expectType<{
	nested: {
		deep: {
			deeper: {};
		};
	};
	foo: string;
}>(union);

type Optional = {
	foo?: {
		bar?: {
			baz: string;
		};
	};
};

declare const optional: OmitDeep<Optional, 'foo.bar.baz'>;
expectType<{foo?: {bar?: {}}}>(optional);

/**
Test for arrays
*/
declare const recurseIntoArray: OmitDeep<{array: BaseType['objectArray']}, `array.${number}.a`>;
expectType<{array: Array<{b: 2}>}>(recurseIntoArray);

declare const recurseIntoArray2: OmitDeep<{array: BaseType['objectArray']}, 'array.0.a'>;
expectType<{array: [{b: 2}, ...Array<{a: 1; b: 2}>]}>(recurseIntoArray2);

declare const recurseIntoArray3: OmitDeep<{array: BaseType['objectArray']}, 'array.3.a'>;
expectType<{array: [
	{a: 1; b: 2}, // 0
	{a: 1; b: 2}, // 1
	{a: 1; b: 2}, // 2
	{b: 2}, // 3
	...Array<{a: 1; b: 2}>,
];}>(recurseIntoArray3);

declare const tuple: OmitDeep<{array: BaseType['tuples']}, 'array.0'>;
expectType<{array: [unknown, 'bar']}>(tuple);

declare const arrayWithMultiplePaths: OmitDeep<{array: Array<{a: string; b: number; c: string}>}, `array.${number}.a` | `array.${number}.b`>;
expectType<{array: Array<{c: string}>}>(arrayWithMultiplePaths);

declare const tupleWithMultiplePaths: OmitDeep<{tuple: [{a: string; b: number; c: string}]}, 'tuple.0.a' | 'tuple.0.b'>;
expectType<{tuple: [{c: string}]}>(tupleWithMultiplePaths);

// Omitting an element of a tuple with optional elements keeps the rest of the tuple.
declare const omitFromOptionalTuple: OmitDeep<[string?, number?], '0'>;
expectType<[unknown, number?]>(omitFromOptionalTuple);

// Omitting every index already empties the array, so a path that continues into one of those indices cannot change the result and must not turn the array into `never[]`.
declare const redundantDeeperPath: OmitDeep<Array<{a: 1}>, `${number}` | `${number}.a`>;
expectType<[]>(redundantDeeperPath);

declare const deeperPathIntoEmptyTuple: OmitDeep<{a: []}, 'a.0.b'>;
expectType<{a: []}>(deeperPathIntoEmptyTuple);

// `Paths` emits a `${string}` path for a string index signature, so the path type accepts one and the omit has to be applied to the signature's value type, the way `PickDeep` applies a pick to it. The walk compared the path key with the mapped key, which never matches a signature, so the path was silently ignored and the input came back unchanged.
declare const throughStringIndexSignature: OmitDeep<{a: Record<string, {b: 1; c: 2}>}, 'a.x.b'>;
expectType<{a: {[x: string]: {c: 2}}}>(throughStringIndexSignature);

declare const throughNumberIndexSignature: OmitDeep<{a: Record<number, {b: 1; c: 2}>}, 'a.0.b'>;
expectType<{a: {[x: number]: {c: 2}}}>(throughNumberIndexSignature);

declare const nestedThroughIndexSignature: OmitDeep<{a: Record<string, {b: {c: 1; d: 2}}>}, 'a.x.b.c'>;
expectType<{a: {[x: string]: {b: {d: 2}}}}>(nestedThroughIndexSignature);

// A named key is still matched by name rather than by the signature rule, which only applies where the key really is a signature.
declare const namedKeyBesideSignature: OmitDeep<{a: string; b: {c: 1; d: 2}}, 'b.c'>;
expectType<{a: string; b: {d: 2}}>(namedKeyBesideSignature);

// A path that names a member leaves the signature beside it alone, the way `PickDeep` does.
declare const memberBesideSignature: OmitDeep<{[k: string]: {b: 1; c: 2}; x: {b: 1; c: 2}}, 'x.b'>;
expectType<{c: 2}>(memberBesideSignature.x);
expectType<{b: 1; c: 2}>({} as (typeof memberBesideSignature)[string]);

declare const throughTemplateSignature: OmitDeep<{a: {[k: `v${string}`]: {b: 1; c: 2}}}, 'a.vx.b'>;
expectType<{a: {[x: `v${string}`]: {c: 2}}}>(throughTemplateSignature);
