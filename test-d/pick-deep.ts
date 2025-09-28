import {expectType} from 'tsd';
import type {IsEqual, PickDeep, Simplify} from '../index.d.ts';

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
};

type Testing = BaseType & {
	object: BaseType;
	optionalObject?: Partial<BaseType>;
	optionalString?: string;
	readonly readonlyObject: {a: 1};
	1: BaseType;
	2?: BaseType;
};

type normal_Actual = PickDeep<Testing, 'string'>;
type normal_Expected = {string: string};
expectType<true>({} as IsEqual<normal_Actual, normal_Expected>);

type DeepType = {
	nested: {
		deep: {
			deeper: {
				value: string;
				value1: number;
			};
		};
	};
	foo: string;
};
type DepthType = {nested: {deep: {deeper: {value: string}}}};

type deep_Actual = PickDeep<DeepType, 'nested.deep.deeper.value'>;
expectType<true>({} as IsEqual<deep_Actual, DepthType>);

// Test interface
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface DeepInterface extends DeepType {
	bar: {
		number: number;
		string: string;
	};
}

type deepInterface_Actual = PickDeep<DeepInterface, 'nested.deep.deeper.value'>;
expectType<true>({} as IsEqual<deepInterface_Actual, DepthType>);

type deepInterface2_Actual = PickDeep<DeepInterface, 'bar.number'>;
type deepInterface2_Expected = {bar: {number: number}};
expectType<true>({} as IsEqual<deepInterface2_Actual, deepInterface2_Expected>);

type GenericType<T> = {
	genericKey: T;
};
type genericTest_Actual = PickDeep<GenericType<number>, 'genericKey'>;
type genericTest_Expected = {genericKey: number};
expectType<true>({} as IsEqual<genericTest_Actual, genericTest_Expected>);

type union_Actual = PickDeep<Testing, 'object.number' | 'object.string'>;
type union_Expected = {object: {number: number; string: string}};
expectType<true>({} as IsEqual<union_Actual, union_Expected>);

type optional_Actual = PickDeep<Testing, 'optionalObject.optionalString'>;
type optional_Expected = {optionalObject?: {optionalString?: string}};
expectType<true>({} as IsEqual<optional_Actual, optional_Expected>);

type optionalUnion_Actual = PickDeep<Testing, 'optionalObject.string' | 'object.number'>;
type optionalUnion_Expected = {
	optionalObject?: {string?: string};
	object: {number: number};
};
expectType<true>({} as IsEqual<optionalUnion_Actual, optionalUnion_Expected>);

type readonlyTest_Actual = PickDeep<Testing, 'readonlyObject.a'>;
type readonlyTest_Expected = {readonly readonlyObject: {a: 1}};
expectType<true>({} as IsEqual<readonlyTest_Actual, readonlyTest_Expected>);

type array_Actual = PickDeep<Testing, 'object.array'>;
type array_Expected = {object: {array: number[]}};
expectType<true>({} as IsEqual<array_Actual, array_Expected>);

type readonlyArray_Actual = PickDeep<Testing, 'object.readonlyArray'>;
type readonlyArray_Expected = {object: {readonlyArray: readonly number[]}};
expectType<true>({} as IsEqual<readonlyArray_Actual, readonlyArray_Expected>);

type tuple_Actual = PickDeep<Testing, 'object.tuples'>;
type tuple_Expected = {object: {tuples: ['foo', 'bar']}};
expectType<true>({} as IsEqual<tuple_Actual, tuple_Expected>);

type objectArray1_Actual = PickDeep<Testing, `object.objectArray.${number}`>;
type objectArray1_Expected = {object: {objectArray: Array<{a: 1; b: 2}>}};
expectType<true>({} as IsEqual<objectArray1_Actual, objectArray1_Expected>);

type objectArray2_Actual = PickDeep<Testing, `object.objectArray.${number}.a`>;
type objectArray2_Expected = {object: {objectArray: Array<{a: 1}>}};
expectType<true>({} as IsEqual<objectArray2_Actual, objectArray2_Expected>);

type leadingSpreadArray1_Actual = PickDeep<Testing, `object.leadingSpreadArray.${number}.a`>;
type leadingSpreadArray1_Expected = {object: {leadingSpreadArray: [...Array<{a: 1}>]}};
expectType<true>({} as IsEqual<leadingSpreadArray1_Actual, leadingSpreadArray1_Expected>);

type leadingSpreadArray2_Actual = PickDeep<Testing, `object.leadingSpreadArray.${number}`>;
type leadingSpreadArray2_Expected = {object: {leadingSpreadArray: [...Array<{a: 1}>, {b: 2}]}};
expectType<true>({} as IsEqual<leadingSpreadArray2_Actual, leadingSpreadArray2_Expected>);

type tailingSpreadArray1_Actual = PickDeep<Testing, 'object.tailingSpreadArray.1'>;
type tailingSpreadArray1_Expected = {object: {tailingSpreadArray: [unknown, {b: {c: 2; other: 2}}]}};
expectType<true>({} as IsEqual<tailingSpreadArray1_Actual, tailingSpreadArray1_Expected>);

type tailingSpreadArray2_Actual = PickDeep<Testing, 'object.tailingSpreadArray.1.b.c'>;
type tailingSpreadArray2_Expected = {object: {tailingSpreadArray: [unknown, {b: {c: 2}}]}};
expectType<true>({} as IsEqual<tailingSpreadArray2_Actual, tailingSpreadArray2_Expected>);

type date_Actual = PickDeep<Testing, 'object.date'>;
type date_Expected = {object: {date: Date}};
expectType<true>({} as IsEqual<date_Actual, date_Expected>);

// The `PickDeep` test for a property containing a class instance (ClassA).
type instance_Actual = PickDeep<Testing, 'object.instance'>;
type instance_Expected = {object: {instance: ClassA}};
expectType<true>({} as IsEqual<instance_Actual, instance_Expected>);

type classTest_Actual = PickDeep<Testing, 'object.Class'>;
type classTest_Expected = {object: {Class: typeof ClassA}};
expectType<true>({} as IsEqual<classTest_Actual, classTest_Expected>);

type numberTest_Actual = PickDeep<Testing, '1'>;
type numberTest_Expected = {1: BaseType};
expectType<true>({} as IsEqual<numberTest_Actual, numberTest_Expected>);

type numberTest2_Actual = PickDeep<Testing, '1.0'>;
type numberTest2_Expected = {1: {0: number}};
expectType<true>({} as IsEqual<numberTest2_Actual, numberTest2_Expected>);

type notEqual_NumberTest2_Actual0 = PickDeep<Testing, '1'>;
type notEqual_NumberTest2_Expected0 = PickDeep<Testing, '1.0'>;
expectType<false>({} as IsEqual<notEqual_NumberTest2_Actual0, notEqual_NumberTest2_Expected0>);

type numberTest3_Actual = PickDeep<Testing, '2.0'>;
type numberTest3_Expected = {2?: {0: number}};
expectType<true>({} as IsEqual<numberTest3_Actual, numberTest3_Expected>);

// Test for https://github.com/sindresorhus/type-fest/issues/1224
type unionElement0_Actual = PickDeep<{obj: string | {a: string; b: number; c: boolean} | null | undefined}, 'obj'>;
type unionElement0_Expected = {obj: string | {a: string; b: number; c: boolean} | null | undefined};
expectType<true>({} as IsEqual<unionElement0_Actual, unionElement0_Expected>);

// Test for https://github.com/sindresorhus/type-fest/issues/1224
type unionElement1_Actual = PickDeep<{obj: string | {a: string; b: number; c: {d: 'result'}} | null | undefined}, 'obj.b'>;
type unionElement1_Expected = {obj: string | null | undefined | {b: number}};
expectType<true>({} as IsEqual<unionElement1_Actual, unionElement1_Expected>);

// Test for https://github.com/sindresorhus/type-fest/issues/1224
type unionElement2_Actual = PickDeep<{obj: string | {a: string; b: number; c: {readonly d?: 'result'}} | null | undefined}, 'obj.c.d'>;
type unionElement2_Expected = {obj: string | null | undefined | {c: {readonly d?: 'result'}}};
expectType<true>({} as IsEqual<unionElement2_Actual, unionElement2_Expected>);

// Test for https://github.com/sindresorhus/type-fest/issues/1224
type unionElement3_Actual = PickDeep<
	{obj: string | {a: string; b: number; c?: {readonly d?: 'result' | 'is'}} | null | undefined}, 'obj.c.d'>;
type unionElement3_Expected = {obj: string | null | undefined | {c?: {readonly d?: 'result' | 'is'}}};
expectType<true>({} as IsEqual<unionElement3_Actual, unionElement3_Expected>);

// Test for https://github.com/sindresorhus/type-fest/issues/1224
type unionElement4_Actual = PickDeep<
	{obj: string | {a: string; b: number; c?: {readonly d?: 'result' | 'is'}} | null | undefined}, 'obj.c.d' | 'obj.b'>;
type unionElement4_Expected = {obj: string | null | undefined | {c?: {readonly d?: 'result' | 'is'}; b: number}};
expectType<true>({} as IsEqual<unionElement4_Actual, unionElement4_Expected>);

// Test for https://github.com/sindresorhus/type-fest/issues/1140#issuecomment-2881382244
type unionObject0_Actual = PickDeep<{foo: string} | {foo: number}, 'foo'>;
type unionObject0_Expected = {foo: string} | {foo: number};
expectType<true>({} as IsEqual<unionObject0_Actual, unionObject0_Expected>);

// Test for https://github.com/sindresorhus/type-fest/issues/1223
type unionKeyObjectArray_Actual = PickDeep<{arr: Array<{a: string; b: number; c: boolean}>}, `arr.${number}.${'b' | 'c'}`>;
type unionKeyObjectArray_Expected = {arr: Array<{b: number; c: boolean}>};
expectType<true>({} as IsEqual<unionKeyObjectArray_Actual, unionKeyObjectArray_Expected>);

type unionKeyObjectArrayArray_Actual = PickDeep<{arr: Array<Array<{a: string; b: number; c: boolean}>>}, `arr.${number}.${number}.${'b' | 'c'}`>;
type unionKeyObjectArrayArray_Expected = {arr: Array<Array<{b: number; c: boolean}>>};
expectType<true>({} as IsEqual<unionKeyObjectArrayArray_Actual, unionKeyObjectArrayArray_Expected>);

type unionSameKeysObject_Actual = PickDeep<{a: string | {b: 1 | true; c: 2; d: {g: {f: 9; h: 10}}} | {b: '1'; c: '2'}; x: 10 | 11; y: [[0, 1], 2, 3]}, `a.${'b' | 'c'}` | 'x'>;
type unionSameKeysObject_Expected = {x: 10 | 11; a: string | {b: 1 | true; c: 2} | {b: '1'; c: '2'}};
expectType<true>({} as IsEqual<unionSameKeysObject_Actual, unionSameKeysObject_Expected>);

type unionTupleTuple_Actual = PickDeep<[0, string | [1, [2]]], '1.1'>;
type unionTupleTuple_Expected = [unknown, string | [unknown, [2]]];
expectType<true>({} as IsEqual<unionTupleTuple_Actual, unionTupleTuple_Expected>);
