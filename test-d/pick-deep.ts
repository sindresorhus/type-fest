import {expectType} from 'tsd';
import type {PickDeep} from '../index.d.ts';

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
expectType<{object: {number: number} & {string: string}}>(union);

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
