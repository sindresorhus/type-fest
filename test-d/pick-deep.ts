import {expectType} from 'tsd';
import type {PickDeep, Get} from '../index.d.ts';

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

declare const normal: PickDeep<Testing, 'string'>;
expectType<{string: string}>(normal);

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

declare const deep: PickDeep<DeepType, 'nested.deep.deeper.value'>;
expectType<DepthType>(deep);

// Test interface
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface DeepInterface extends DeepType {
	bar: {
		number: number;
		string: string;
	};
}
declare const deepInterface: PickDeep<DeepInterface, 'nested.deep.deeper.value'>;
expectType<DepthType>(deepInterface);
declare const deepInterface2: PickDeep<DeepInterface, 'bar.number'>;
expectType<{bar: {number: number}}>(deepInterface2);

type GenericType<T> = {
	genericKey: T;
};
declare const genericTest: PickDeep<GenericType<number>, 'genericKey'>;
expectType<{genericKey: number}>(genericTest);

declare const union: PickDeep<Testing, 'object.number' | 'object.string'>;
expectType<{object: {number: number; string: string}}>(union);

declare const optional: PickDeep<Testing, 'optionalObject.optionalString'>;
expectType<{optionalObject?: {optionalString?: string}}>(optional);

declare const optionalUnion: PickDeep<Testing, 'optionalObject.string' | 'object.number'>;
expectType<{optionalObject?: {string?: string}; object: {number: number}}>(optionalUnion);

declare const readonlyTest: PickDeep<Testing, 'readonlyObject.a'>;
expectType<{readonly readonlyObject: {a: 1}}>(readonlyTest);

declare const array: PickDeep<Testing, 'object.array'>;
expectType<{object: {array: number[]}}>(array);

declare const readonlyArray: PickDeep<Testing, 'object.readonlyArray'>;
expectType<{object: {readonlyArray: readonly number[]}}>(readonlyArray);

declare const tuple: PickDeep<Testing, 'object.tuples'>;
expectType<{object: {tuples: ['foo', 'bar']}}>(tuple);

declare const objectArray1: PickDeep<Testing, `object.objectArray.${number}`>;
expectType<{object: {objectArray: Array<{a: 1; b: 2}>}}>(objectArray1);

declare const objectArray2: PickDeep<Testing, `object.objectArray.${number}.a`>;
expectType<{object: {objectArray: Array<{a: 1}>}}>(objectArray2);

declare const leadingSpreadArray1: PickDeep<Testing, `object.leadingSpreadArray.${number}.a`>;
expectType<{object: {leadingSpreadArray: [...Array<{a: 1}>]}}>(leadingSpreadArray1);

declare const leadingSpreadArray2: PickDeep<Testing, `object.leadingSpreadArray.${number}`>;
expectType<{object: {leadingSpreadArray: [...Array<{a: 1}>, {b: 2}]}}>(leadingSpreadArray2);

declare const tailingSpreadArray1: PickDeep<Testing, 'object.tailingSpreadArray.1'>;
expectType<{object: {tailingSpreadArray: [unknown, {b: {c: 2; other: 2}}]}}>(tailingSpreadArray1);

declare const tailingSpreadArray2: PickDeep<Testing, 'object.tailingSpreadArray.1.b.c'>;
expectType<{object: {tailingSpreadArray: [unknown, {b: {c: 2}}]}}>(tailingSpreadArray2);

declare const date: PickDeep<Testing, 'object.date'>;
expectType<{object: {date: Date}}>(date);

declare const instance: PickDeep<Testing, 'object.instance'>;
expectType<{object: {instance: ClassA}}>(instance);

declare const classTest: PickDeep<Testing, 'object.Class'>;
expectType<{object: {Class: typeof ClassA}}>(classTest);

declare const numberTest: PickDeep<Testing, '1'>;
expectType<{1: BaseType}>(numberTest);

declare const numberTest2: PickDeep<Testing, '1.0'>;
expectType<{1: {0: number}}>(numberTest2);

declare const numberTest3: PickDeep<Testing, '2.0'>;
expectType<{2?: {0: number}}>(numberTest3);

// Test for https://github.com/sindresorhus/type-fest/issues/1502.
type Leaf = {
	bar?: 'LeafBar';
	foo: 'LeafString';
};

type Tree = {
	foo?: Array<
		{
			mode: 'test1';
			bar: Array<{
				foo: Leaf[] | Leaf;
			}>;
		}
		| {
			mode: 'test2';
			foo: 'foo.number.foo';
			bar: Array<{
				foo: Leaf[] | Leaf;
			}>;
		}
	>;
};

declare const maxRecursionDepthPathTest0: Get<
	PickDeep<Tree, `foo.${number}.bar.${number}.foo.${number}.bar`>,
	`foo.${number}.bar.${number}.foo.${number}.bar`
>;
expectType<'LeafBar' | undefined>(maxRecursionDepthPathTest0);

// Returns `never` if a path is invalid.
type ValidTestObject = {
	fooRoot: Array<{bar: 0}>;
	barRoot: {foo: 1};
};

declare const invalidPathTest0: PickDeep<ValidTestObject, `fooRoot.${number}.bar.invalidPath`>;
expectType<never>(invalidPathTest0);

declare const invalidPathTest1: PickDeep<ValidTestObject, `fooRoot.${number}.invalidPath`>;
expectType<never>(invalidPathTest1);

declare const invalidPathTest2: PickDeep<ValidTestObject, `fooRoot.${number}..bar`>;
expectType<never>(invalidPathTest2);

declare const invalidPathTest3: PickDeep<ValidTestObject, `invalidValidTestObject.fooRoot.${number}.bar`>;
expectType<never>(invalidPathTest3);

declare const invalidPathTest4: PickDeep<ValidTestObject, `barRoot.${number}`>;
expectType<never>(invalidPathTest4);

declare const invalidPathTest5: PickDeep<ValidTestObject, `barRoot.foo.${number}`>;
expectType<never>(invalidPathTest5);

declare const invalidPathTest6: PickDeep<ValidTestObject, 'barRoot.invalidPath'>;
expectType<never>(invalidPathTest6);

type ValidTestArray = Array<{foo: 0; bar: 1}>;

// Invalid property after a valid array index.
declare const invalidArrayPathTest0: PickDeep<
	ValidTestArray,
	`${number}.invalidPath`
>;
expectType<never>(invalidArrayPathTest0);

// Cannot recurse into a non-object/non-array value.
declare const invalidArrayPathTest1: PickDeep<
	ValidTestArray,
	`${number}.foo.${number}`
>;
expectType<never>(invalidArrayPathTest1);

// Malformed path.
declare const invalidArrayPathTest2: PickDeep<
	ValidTestArray,
	`${number}..foo`
>;
expectType<never>(invalidArrayPathTest2);

type ValidTestTuple = [
	{foo: 0; bar: 1},
	{foo: 2; bar: 3},
];

declare const invalidTuplePathTest0: PickDeep<ValidTestTuple, '0.invalidPath'>;
expectType<never>(invalidTuplePathTest0);

declare const invalidTuplePathTest1: PickDeep<ValidTestTuple, '1.foo.invalidPath'>;
expectType<never>(invalidTuplePathTest1);

declare const invalidTuplePathTest2: PickDeep<ValidTestTuple, '2.foo'>;
expectType<never>(invalidTuplePathTest2);

declare const invalidTuplePathTest3: PickDeep<ValidTestTuple, 'invalidPath.foo'>;
expectType<never>(invalidTuplePathTest3);

declare const invalidTuplePathTest4: PickDeep<ValidTestTuple, '0..foo'>;
expectType<never>(invalidTuplePathTest4);

type ValidTestReadonlyArray = ReadonlyArray<{foo: 0; bar: 1}>;

// Invalid property after a valid array index.
declare const invalidReadonlyArrayPathTest0: PickDeep<
	ValidTestReadonlyArray,
	`${number}.invalidPath`
>;
expectType<never>(invalidReadonlyArrayPathTest0);

// Cannot recurse into a non-object/non-array value.
declare const invalidReadonlyArrayPathTest1: PickDeep<
	ValidTestReadonlyArray,
	`${number}.foo.${number}`
>;
expectType<never>(invalidReadonlyArrayPathTest1);

// Malformed path.
declare const invalidReadonlyArrayPathTest2: PickDeep<
	ValidTestReadonlyArray,
	`${number}..foo`
>;
expectType<never>(invalidReadonlyArrayPathTest2);

type ValidTestReadonlyTuple = readonly [
	{foo: 0; bar: 1},
	{foo: 2; bar: 3},
];

declare const invalidReadonlyTuplePathTest0: PickDeep<
	ValidTestReadonlyTuple,
	'0.invalidPath'
>;
expectType<never>(invalidReadonlyTuplePathTest0);

declare const invalidReadonlyTuplePathTest1: PickDeep<
	ValidTestReadonlyTuple,
	'1.foo.invalidPath'
>;
expectType<never>(invalidReadonlyTuplePathTest1);

declare const invalidReadonlyTuplePathTest2: PickDeep<
	ValidTestReadonlyTuple,
	'2.foo'
>;
expectType<never>(invalidReadonlyTuplePathTest2);

declare const invalidReadonlyTuplePathTest3: PickDeep<
	ValidTestReadonlyTuple,
	'invalidPath.foo'
>;
expectType<never>(invalidReadonlyTuplePathTest3);

declare const invalidReadonlyTuplePathTest4: PickDeep<
	ValidTestReadonlyTuple,
	'0..foo'
>;
expectType<never>(invalidReadonlyTuplePathTest4);
