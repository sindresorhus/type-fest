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

// A tuple with an optional element keeps its `?` modifier, so its length stays fixed.
declare const optionalTupleElement: PickDeep<{a: [1, 2?]}, 'a.1'>;
expectType<{a: [unknown, 2?]}>(optionalTupleElement);

declare const optionalHeadPicked: PickDeep<{a: [1, 2?]}, 'a.0'>;
expectType<{a: [1]}>(optionalHeadPicked);

declare const readonlyOptionalTuple: PickDeep<{a: readonly [1, 2?]}, 'a.1'>;
expectType<{a: readonly [unknown, 2?]}>(readonlyOptionalTuple);

declare const requiredTupleUnchanged: PickDeep<{a: [1, 2, 3]}, 'a.1'>;
expectType<{a: [unknown, 2]}>(requiredTupleUnchanged);

// A picked element that was optional keeps its `?` modifier wherever it sits in the tuple.
declare const optionalAtEnd: PickDeep<{a: [1, 2, 3?]}, 'a.2'>;
expectType<{a: [unknown, unknown, 3?]}>(optionalAtEnd);

declare const optionalTailHeadPicked: PickDeep<{a: [1, 2, 3?]}, 'a.0'>;
expectType<{a: [1]}>(optionalTailHeadPicked);

// A rest element is not optional, so picking it stays required.
declare const restElement: PickDeep<{a: [1, ...string[]]}, 'a.0'>;
expectType<{a: [1]}>(restElement);

// A tuple that starts with a rest element always has its trailing elements, so an index within that minimum length stays required.
declare const leadingRestElement: PickDeep<{a: [...string[], number]}, 'a.0'>;
expectType<{a: [string | number]}>(leadingRestElement);

declare const readonlyLeadingRestElement: PickDeep<{a: readonly [...string[], number]}, 'a.0'>;
expectType<{a: readonly [string | number]}>(readonlyLeadingRestElement);

declare const middleRestElement: PickDeep<{a: [1, ...string[], 2]}, 'a.1'>;
expectType<{a: [unknown, string | 2]}>(middleRestElement);

// An index past the minimum length may not exist, so it is optional.
declare const leadingRestElementPastMinimum: PickDeep<{a: [...string[], number]}, 'a.1'>;
expectType<{a: [unknown, (string | number)?]}>(leadingRestElementPastMinimum);

// An element of a plain array may not exist, so it is optional.
declare const plainArrayElement: PickDeep<{a: string[]}, 'a.0'>;
expectType<{a: [string?]}>(plainArrayElement);

// A required element is unaffected.
declare const allRequired: PickDeep<{a: [1, 2, 3]}, 'a.2'>;
expectType<{a: [unknown, unknown, 3]}>(allRequired);

// Known limitation: several indices of the same tuple in one call resolve to `never`, because each path produces a `unknown`-padded tuple and the results are intersected, so the tuple's `length` becomes the intersection of the different lengths. See the docs.
declare const severalIndices: PickDeep<[1, 2, 3], '1' | '2'>;
expectType<never>(severalIndices);

// Picking the containing property instead, then indexing into it at the use site, works around it.
declare const pickContainer: PickDeep<{a: [1, 2, 3]}, 'a'>;
expectType<{a: [1, 2, 3]}>(pickContainer);

// A literal path through an index signature picks that key, like `Pick<Record<string, X>, 'x'>` gives `{x: X}`.
declare const throughStringIndexSignature: PickDeep<{a: Record<string, {b: 1; c: 2}>}, 'a.x.b'>;
expectType<{a: {x: {b: 1}}}>(throughStringIndexSignature);

declare const throughNumberIndexSignature: PickDeep<{a: Record<number, {b: 1; c: 2}>}, 'a.7.b'>;
expectType<{a: {7: {b: 1}}}>(throughNumberIndexSignature);

// The same for the object-literal spelling of a signature.
declare const throughStringIndexSignatureLiteral: PickDeep<{a: {[k: string]: {b: 1; c: 2}}}, 'a.x.b'>;
expectType<{a: {x: {b: 1}}}>(throughStringIndexSignatureLiteral);

declare const throughNumberIndexSignatureLiteral: PickDeep<{a: {[k: number]: {b: 1; c: 2}}}, 'a.7.b'>;
expectType<{a: {7: {b: 1}}}>(throughNumberIndexSignatureLiteral);

// A subject that also names the key outright keeps the member, because the member is what the key reads.
declare const mixedSignatureAndMember: PickDeep<{[k: string]: {b: number; c: number}; a: {b: 9; c: 8}}, 'a.b'>;
expectType<{a: {b: 9}}>(mixedSignatureAndMember);

// A member that can be `null` or `undefined` when the value is read keeps them, because reading the picked path from `{a: null}` throws at runtime exactly as it does for the source. An optional member keeps its `?`, which already covers absence.
declare const nullableIntermediate: PickDeep<{a: {b: string} | null}, 'a.b'>;
expectType<{a: {b: string} | null}>(nullableIntermediate);

declare const undefinedIntermediate: PickDeep<{a: {b: string} | undefined}, 'a.b'>;
expectType<{a: {b: string} | undefined}>(undefinedIntermediate);

declare const optionalNullableIntermediate: PickDeep<{a?: {b: string} | null}, 'a.b'>;
expectType<{a?: {b: string} | null}>(optionalNullableIntermediate);

// Explicit `undefined` remains assignable with `exactOptionalPropertyTypes`, while implicit absence only keeps the `?` modifier.
declare const optionalUndefinedIntermediate: PickDeep<{a?: {b: string; other: number} | undefined}, 'a.b'>;
expectType<{a?: {b: string} | undefined}>(optionalUndefinedIntermediate);

declare const nestedOptionalUndefinedIntermediate: PickDeep<{a?: {b?: {c: string; other: number} | undefined} | null | undefined}, 'a.b.c'>;
expectType<{a?: {b?: {c: string} | undefined} | null | undefined}>(nestedOptionalUndefinedIntermediate);

// The documented tuple traversal limitation remains separate from optional object properties.
declare const nullableTupleTraversal: PickDeep<[({a: string; other: number} | null | undefined)?], '0.a'>;
expectType<[{a: string}]>(nullableTupleTraversal);

// A required element whose type includes `undefined` stays required.
declare const requiredUndefinedElement: PickDeep<{a: [1, 2 | undefined]}, 'a.1'>;
expectType<{a: [unknown, 2 | undefined]}>(requiredUndefinedElement);

// Two literal paths through the same signature pick two keys, and a non-literal path keeps the signature.
declare const twoKeysThroughSignature: PickDeep<{a: Record<string, {b: 1; c: 2}>}, 'a.x.b' | 'a.y.c'>;
expectType<{a: {x: {b: 1}; y: {c: 2}}}>(twoKeysThroughSignature);

declare const patternThroughSignature: PickDeep<{a: Record<string, {b: 1; c: 2}>}, `a.${string}.b`>;
expectType<{a: {[x: string]: {b: 1}}}>(patternThroughSignature);
