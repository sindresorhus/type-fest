import {expectTypeOf} from 'nz';
import type {Get, OptionalPaths, PickDeep} from '../index.d.ts';

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
expectTypeOf(normal).toBe<{string: string}>();

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
expectTypeOf(deep).toBe<DepthType>();

// Test interface
// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
interface DeepInterface extends DeepType {
	bar: {
		number: number;
		string: string;
	};
}
declare const deepInterface: PickDeep<DeepInterface, 'nested.deep.deeper.value'>;
expectTypeOf(deepInterface).toBe<DepthType>();
declare const deepInterface2: PickDeep<DeepInterface, 'bar.number'>;
expectTypeOf(deepInterface2).toBe<{bar: {number: number}}>();

type GenericType<T> = {
	genericKey: T;
};
declare const genericTest: PickDeep<GenericType<number>, 'genericKey'>;
expectTypeOf(genericTest).toBe<{genericKey: number}>();

declare const union: PickDeep<Testing, 'object.number' | 'object.string'>;
expectTypeOf(union).toBe<{object: {number: number; string: string}}>();

declare const optional: PickDeep<Testing, 'optionalObject.optionalString'>;
expectTypeOf(optional).toBe<{optionalObject?: {optionalString?: string}}>();

declare const optionalUnion: PickDeep<Testing, 'optionalObject.string' | 'object.number'>;
expectTypeOf(optionalUnion).toBe<{optionalObject?: {string?: string}; object: {number: number}}>();

declare const readonlyTest: PickDeep<Testing, 'readonlyObject.a'>;
expectTypeOf(readonlyTest).toBe<{readonly readonlyObject: {a: 1}}>();

declare const array: PickDeep<Testing, 'object.array'>;
expectTypeOf(array).toBe<{object: {array: number[]}}>();

declare const readonlyArray: PickDeep<Testing, 'object.readonlyArray'>;
expectTypeOf(readonlyArray).toBe<{object: {readonlyArray: readonly number[]}}>();

declare const tuple: PickDeep<Testing, 'object.tuples'>;
expectTypeOf(tuple).toBe<{object: {tuples: ['foo', 'bar']}}>();

declare const objectArray1: PickDeep<Testing, `object.objectArray.${number}`>;
expectTypeOf(objectArray1).toBe<{object: {objectArray: Array<{a: 1; b: 2}>}}>();

declare const objectArray2: PickDeep<Testing, `object.objectArray.${number}.a`>;
expectTypeOf(objectArray2).toBe<{object: {objectArray: Array<{a: 1}>}}>();

declare const leadingSpreadArray1: PickDeep<Testing, `object.leadingSpreadArray.${number}.a`>;
expectTypeOf(leadingSpreadArray1).toBe<{object: {leadingSpreadArray: [...Array<{a: 1}>]}}>();

declare const leadingSpreadArray2: PickDeep<Testing, `object.leadingSpreadArray.${number}`>;
expectTypeOf(leadingSpreadArray2).toBe<{object: {leadingSpreadArray: [...Array<{a: 1}>, {b: 2}]}}>();

declare const tailingSpreadArray1: PickDeep<Testing, 'object.tailingSpreadArray.1'>;
expectTypeOf(tailingSpreadArray1).toBe<{object: {tailingSpreadArray: [unknown, {b: {c: 2; other: 2}}]}}>();

declare const tailingSpreadArray2: PickDeep<Testing, 'object.tailingSpreadArray.1.b.c'>;
expectTypeOf(tailingSpreadArray2).toBe<{object: {tailingSpreadArray: [unknown, {b: {c: 2}}]}}>();

declare const date: PickDeep<Testing, 'object.date'>;
expectTypeOf(date).toBe<{object: {date: Date}}>();

declare const instance: PickDeep<Testing, 'object.instance'>;
expectTypeOf(instance).toBe<{object: {instance: ClassA}}>();

declare const classTest: PickDeep<Testing, 'object.Class'>;
expectTypeOf(classTest).toBe<{object: {Class: typeof ClassA}}>();

declare const numberTest: PickDeep<Testing, '1'>;
expectTypeOf(numberTest).toBe<{1: BaseType}>();

declare const numberTest2: PickDeep<Testing, '1.0'>;
expectTypeOf(numberTest2).toBe<{1: {0: number}}>();

declare const numberTest3: PickDeep<Testing, '2.0'>;
expectTypeOf(numberTest3).toBe<{2?: {0: number}}>();

// A tuple with an optional element keeps its `?` modifier, so its length stays fixed.
declare const optionalTupleElement: PickDeep<{a: [1, 2?]}, 'a.1'>;
expectTypeOf(optionalTupleElement).toBe<{a: [unknown, 2?]}>();

declare const optionalHeadPicked: PickDeep<{a: [1, 2?]}, 'a.0'>;
expectTypeOf(optionalHeadPicked).toBe<{a: [1]}>();

declare const readonlyOptionalTuple: PickDeep<{a: readonly [1, 2?]}, 'a.1'>;
expectTypeOf(readonlyOptionalTuple).toBe<{a: readonly [unknown, 2?]}>();

declare const requiredTupleUnchanged: PickDeep<{a: [1, 2, 3]}, 'a.1'>;
expectTypeOf(requiredTupleUnchanged).toBe<{a: [unknown, 2]}>();

// A picked element that was optional keeps its `?` modifier wherever it sits in the tuple.
declare const optionalAtEnd: PickDeep<{a: [1, 2, 3?]}, 'a.2'>;
expectTypeOf(optionalAtEnd).toBe<{a: [unknown, unknown, 3?]}>();

declare const optionalTailHeadPicked: PickDeep<{a: [1, 2, 3?]}, 'a.0'>;
expectTypeOf(optionalTailHeadPicked).toBe<{a: [1]}>();

// A rest element is not optional, so picking it stays required.
declare const restElement: PickDeep<{a: [1, ...string[]]}, 'a.0'>;
expectTypeOf(restElement).toBe<{a: [1]}>();

// A tuple that starts with a rest element always has its trailing elements, so an index within that minimum length stays required.
declare const leadingRestElement: PickDeep<{a: [...string[], number]}, 'a.0'>;
expectTypeOf(leadingRestElement).toBe<{a: [string | number]}>();

declare const readonlyLeadingRestElement: PickDeep<{a: readonly [...string[], number]}, 'a.0'>;
expectTypeOf(readonlyLeadingRestElement).toBe<{a: readonly [string | number]}>();

declare const middleRestElement: PickDeep<{a: [1, ...string[], 2]}, 'a.1'>;
expectTypeOf(middleRestElement).toBe<{a: [unknown, string | 2]}>();

// An index past the minimum length may not exist, so it is optional.
declare const leadingRestElementPastMinimum: PickDeep<{a: [...string[], number]}, 'a.1'>;
expectTypeOf(leadingRestElementPastMinimum).toBe<{a: [unknown, (string | number)?]}>();

// An element of a plain array may not exist, so it is optional.
declare const plainArrayElement: PickDeep<{a: string[]}, 'a.0'>;
expectTypeOf(plainArrayElement).toBe<{a: [string?]}>();

// A required element is unaffected.
declare const allRequired: PickDeep<{a: [1, 2, 3]}, 'a.2'>;
expectTypeOf(allRequired).toBe<{a: [unknown, unknown, 3]}>();

// Several indices of the same tuple are merged into one tuple, padded with `unknown` up to the last picked index, whatever the order of the paths.
expectTypeOf<PickDeep<[1, 2, 3], '1' | '2'>>().toBe<[unknown, 2, 3]>();
expectTypeOf<PickDeep<[1, 2, 3], '2' | '1'>>().toBe<[unknown, 2, 3]>();
expectTypeOf<PickDeep<[1, 2, 3], '0' | '2'>>().toBe<[1, unknown, 3]>();
expectTypeOf<PickDeep<readonly [1, 2, 3], '0' | '2'>>().toBe<readonly [1, unknown, 3]>();
expectTypeOf<PickDeep<{a: [1, 2, 3]}, 'a.0' | 'a.2'>>().toBe<{a: [1, unknown, 3]}>();

// Paths into different elements of the same tuple are merged too.
expectTypeOf<PickDeep<{t: [{x?: 1; y: 2}, {z?: 1; w: 2}]}, 't.0.x' | 't.1.z'>>().toBe<{t: [{x?: 1}, {z?: 1}]}>();
expectTypeOf<PickDeep<[[1, 2], 3], '0.1' | '1'>>().toBe<[[unknown, 2], 3]>();
expectTypeOf<PickDeep<[{a: 1; b: 2; c: 3}], '0.a' | '0.b'>>().toBe<[{a: 1; b: 2}]>();

// Picking a whole element and a path inside it gives the whole element.
expectTypeOf<PickDeep<[{a: 1; b: 2}, 3], '0' | '0.a' | '1'>>().toBe<[{a: 1; b: 2}, 3]>();

// A picked optional element keeps its `?` when nothing required follows it. Otherwise, it gains `| undefined`, like `SetOptional`.
expectTypeOf<PickDeep<{t: [string?, number?]}, 't.0' | 't.1'>>().toBe<{t: [string?, number?]}>();
expectTypeOf<PickDeep<{t: [{a?: 1}, {b?: 1}?]}, 't.0.a' | 't.1' | 't.1.b'>>().toBe<{t: [{a?: 1}, {b?: 1}?]}>();
expectTypeOf<PickDeep<[1?, 2?, 3?], '0' | '2'>>().toBe<[1 | undefined, unknown, 3?]>();

// A single large index is padded in one step, so it does not hit the recursion limit.
type LargeIndexPick = PickDeep<Array<{x: 1; y: 2}>, '999'>;
expectTypeOf<LargeIndexPick['length']>().toBe<999 | 1000>();
expectTypeOf<LargeIndexPick[999]>().toBe<{x: 1; y: 2} | undefined>();
expectTypeOf<PickDeep<Array<{x: 1; y: 2}>, '999.x'>[999]>().toBe<{x: 1}>();

// Picking the containing property still works.
declare const pickContainer: PickDeep<{a: [1, 2, 3]}, 'a'>;
expectTypeOf(pickContainer).toBe<{a: [1, 2, 3]}>();

// A literal path through an index signature picks that key, like `Pick<Record<string, X>, 'x'>` gives `{x: X}`.
declare const throughStringIndexSignature: PickDeep<{a: Record<string, {b: 1; c: 2}>}, 'a.x.b'>;
expectTypeOf(throughStringIndexSignature).toBe<{a: {x: {b: 1}}}>();

declare const throughNumberIndexSignature: PickDeep<{a: Record<number, {b: 1; c: 2}>}, 'a.7.b'>;
expectTypeOf(throughNumberIndexSignature).toBe<{a: {7: {b: 1}}}>();

// The same for the object-literal spelling of a signature.
declare const throughStringIndexSignatureLiteral: PickDeep<{a: {[k: string]: {b: 1; c: 2}}}, 'a.x.b'>;
expectTypeOf(throughStringIndexSignatureLiteral).toBe<{a: {x: {b: 1}}}>();

declare const throughNumberIndexSignatureLiteral: PickDeep<{a: {[k: number]: {b: 1; c: 2}}}, 'a.7.b'>;
expectTypeOf(throughNumberIndexSignatureLiteral).toBe<{a: {7: {b: 1}}}>();

// A subject that also names the key outright keeps the member, because the member is what the key reads.
declare const mixedSignatureAndMember: PickDeep<{[k: string]: {b: number; c: number}; a: {b: 9; c: 8}}, 'a.b'>;
expectTypeOf(mixedSignatureAndMember).toBe<{a: {b: 9}}>();

// A member that can be `null` or `undefined` when the value is read keeps them, because reading the picked path from `{a: null}` throws at runtime exactly as it does for the source. An optional member keeps its `?`, which already covers absence.
declare const nullableIntermediate: PickDeep<{a: {b: string} | null}, 'a.b'>;
expectTypeOf(nullableIntermediate).toBe<{a: {b: string} | null}>();

declare const undefinedIntermediate: PickDeep<{a: {b: string} | undefined}, 'a.b'>;
expectTypeOf(undefinedIntermediate).toBe<{a: {b: string} | undefined}>();

declare const optionalNullableIntermediate: PickDeep<{a?: {b: string} | null}, 'a.b'>;
expectTypeOf(optionalNullableIntermediate).toBe<{a?: {b: string} | null}>();

// Explicit `undefined` remains assignable with `exactOptionalPropertyTypes`, while implicit absence only keeps the `?` modifier.
declare const optionalUndefinedIntermediate: PickDeep<{a?: {b: string; other: number} | undefined}, 'a.b'>;
expectTypeOf(optionalUndefinedIntermediate).toBe<{a?: {b: string} | undefined}>();

declare const nestedOptionalUndefinedIntermediate: PickDeep<{a?: {b?: {c: string; other: number} | undefined} | null | undefined}, 'a.b.c'>;
expectTypeOf(nestedOptionalUndefinedIntermediate).toBe<{a?: {b?: {c: string} | undefined} | null | undefined}>();

// The documented tuple traversal limitation remains separate from optional object properties.
declare const nullableTupleTraversal: PickDeep<[({a: string; other: number} | null | undefined)?], '0.a'>;
expectTypeOf(nullableTupleTraversal).toBe<[{a: string}]>();

// A required element whose type includes `undefined` stays required.
declare const requiredUndefinedElement: PickDeep<{a: [1, 2 | undefined]}, 'a.1'>;
expectTypeOf(requiredUndefinedElement).toBe<{a: [unknown, 2 | undefined]}>();

// Two literal paths through the same signature pick two keys, and a non-literal path keeps the signature.
declare const twoKeysThroughSignature: PickDeep<{a: Record<string, {b: 1; c: 2}>}, 'a.x.b' | 'a.y.c'>;
expectTypeOf(twoKeysThroughSignature).toBe<{a: {x: {b: 1}; y: {c: 2}}}>();

declare const patternThroughSignature: PickDeep<{a: Record<string, {b: 1; c: 2}>}, `a.${string}.b`>;
expectTypeOf(patternThroughSignature).toBe<{a: {[x: string]: {b: 1}}}>();

// A present key can have the value `never`; it is different from a missing path.
expectTypeOf<PickDeep<{value: never; other: string}, 'value'>>().toBe<{value: never}>();
expectTypeOf<PickDeep<{nested: {value: never; other: string}}, 'nested.value'>>().toBe<{nested: {value: never}}>();

expectTypeOf<PickDeep<{readonly value: never; other: string}, 'value'>>().toBe<{readonly value: never}>();
expectTypeOf<PickDeep<{nested?: {readonly value: never; other: string}}, 'nested.value'>>().toBe<{nested?: {readonly value: never}}>();
expectTypeOf<PickDeep<{nested: {value: never; other: string} | null}, 'nested.value'>>().toBe<{nested: {value: never} | null}>();
expectTypeOf<PickDeep<{nested: {value: never; other: string} | undefined}, 'nested.value'>>().toBe<{nested: {value: never} | undefined}>();

// Picking alongside other properties must keep the impossible property's constraint.
expectTypeOf<PickDeep<{value: never; other: string; ignored: number}, 'value' | 'other'>>().toBe<{value: never; other: string}>();
expectTypeOf<PickDeep<{nested: {value: never; other: string; ignored: number}}, 'nested.value' | 'nested.other'>>().toBe<{nested: {value: never; other: string}}>();

// Numeric keys and signatures can also contain `never` values.
expectTypeOf<PickDeep<{0: never; other: string}, 0>>().toBe<{0: never}>();
expectTypeOf<PickDeep<{0: never; other: string}, '0'>>().toBe<{0: never}>();
expectTypeOf<PickDeep<Record<string, never>, 'value'>>().toBe<{value: never}>();
expectTypeOf<PickDeep<Record<number, never>, '7'>>().toBe<{7: never}>();

// A missing key in a different union member is still excluded.
expectTypeOf<PickDeep<{value: never; first: string} | {other: number}, 'value'>>().toBe<{value: never}>();
expectTypeOf<PickDeep<{value: never; first: string} | {value: number; second: string}, 'value'>>().toBe<{value: never} | {value: number}>();

// A path deeper than `Paths` lists by default is accepted. https://github.com/sindresorhus/type-fest/issues/1502
type Leaf = {
	bar?: 'LeafBar';
	foo: 'LeafString';
};

type Tree = {
	foo?: Array<{
		mode: 'test1';
		bar: Array<{foo: Leaf[] | Leaf}>;
	} | {
		mode: 'test2';
		foo: 'foo.number.foo';
		bar: Array<{foo: Leaf[] | Leaf}>;
	}>;
};

expectTypeOf<Get<PickDeep<Tree, `foo.${number}.bar.${number}.foo.${number}.bar`>, `foo.${number}.bar.${number}.foo.${number}.bar`>>().toBe<'LeafBar' | undefined>();

// A missing path is ignored, and if no path exists, the result is `never`.
type ValidObject = {
	fooRoot: Array<{bar: 0}>;
	barRoot: {foo: 1};
};

expectTypeOf<PickDeep<ValidObject, 'barRoot.foo' | 'barRoot.invalidPath'>>().toBe<{barRoot: {foo: 1}}>();
expectTypeOf<PickDeep<ValidObject, 'invalidPath'>>().toBe<never>();
expectTypeOf<PickDeep<ValidObject, 'barRoot.invalidPath'>>().toBe<never>();
expectTypeOf<PickDeep<ValidObject, `barRoot.${number}`>>().toBe<never>();
expectTypeOf<PickDeep<ValidObject, `barRoot.foo.${number}`>>().toBe<never>();
expectTypeOf<PickDeep<ValidObject, `fooRoot.${number}.bar.invalidPath`>>().toBe<never>();
expectTypeOf<PickDeep<ValidObject, `fooRoot.${number}.invalidPath`>>().toBe<never>();
expectTypeOf<PickDeep<ValidObject, `fooRoot.${number}..bar`>>().toBe<never>();
expectTypeOf<PickDeep<ValidObject, `invalidPath.fooRoot.${number}.bar`>>().toBe<never>();
expectTypeOf<PickDeep<ValidObject, string>>().toBe<never>();
expectTypeOf<PickDeep<{a: null}, 'a.b'>>().toBe<never>();

type ValidArray = Array<{foo: 0; bar: 1}>;
expectTypeOf<PickDeep<ValidArray, `${number}.invalidPath`>>().toBe<never>();
expectTypeOf<PickDeep<ValidArray, `${number}.foo.${number}`>>().toBe<never>();
expectTypeOf<PickDeep<ValidArray, `${number}..foo`>>().toBe<never>();
expectTypeOf<PickDeep<ReadonlyArray<ValidArray[number]>, `${number}.invalidPath`>>().toBe<never>();

type ValidTuple = [{foo: 0; bar: 1}, {foo: 2; bar: 3}];
expectTypeOf<PickDeep<ValidTuple, '0.invalidPath'>>().toBe<never>();
expectTypeOf<PickDeep<ValidTuple, '1.foo.invalidPath'>>().toBe<never>();
expectTypeOf<PickDeep<ValidTuple, '2.foo'>>().toBe<never>();
expectTypeOf<PickDeep<ValidTuple, 'invalidPath.foo'>>().toBe<never>();
expectTypeOf<PickDeep<ValidTuple, '0..foo'>>().toBe<never>();
expectTypeOf<PickDeep<Readonly<ValidTuple>, '0.invalidPath'>>().toBe<never>();
expectTypeOf<PickDeep<Readonly<ValidTuple>, '2.foo'>>().toBe<never>();

// An index that the array cannot have is a missing path.
expectTypeOf<PickDeep<ValidTuple, '2'>>().toBe<never>();
expectTypeOf<PickDeep<{a: ValidTuple}, 'a.2'>>().toBe<never>();
expectTypeOf<PickDeep<ValidTuple, '-1'>>().toBe<never>();
expectTypeOf<PickDeep<ValidTuple, '-1.foo'>>().toBe<never>();
expectTypeOf<PickDeep<ValidArray, '-1'>>().toBe<never>();
expectTypeOf<PickDeep<Readonly<ValidTuple>, '2'>>().toBe<never>();
expectTypeOf<PickDeep<[1, 2], '1' | '5'>>().toBe<[unknown, 2]>();
expectTypeOf<PickDeep<{a: [1, 2]}, 'a.1' | 'a.5'>>().toBe<{a: [unknown, 2]}>();

// An index that the array can have is unchanged, including an optional element and any index of an array of unknown length.
expectTypeOf<PickDeep<[1, 2?], '1'>>().toBe<[unknown, 2?]>();
expectTypeOf<PickDeep<[1, ...string[]], '5'>>().toBe<[unknown, unknown, unknown, unknown, unknown, string?]>();
expectTypeOf<PickDeep<ValidArray, '5.foo'>>().toBe<[unknown, unknown, unknown, unknown, unknown, {foo: 0}]>();

// A valid path through an array or tuple is unchanged.
expectTypeOf<PickDeep<ValidTuple, '1.foo'>>().toBe<[unknown, {foo: 2}]>();
expectTypeOf<PickDeep<ValidArray, `${number}.foo`>>().toBe<Array<{foo: 0}>>();

// Boundary types
expectTypeOf<PickDeep<ValidObject, never>>().toBe<never>();
expectTypeOf<PickDeep<unknown, 'a'>>().toBe<never>();
expectTypeOf<PickDeep<never, 'a'>>().toBe<never>();

// `OptionalPaths` can give several paths into one tuple. (https://github.com/sindresorhus/type-fest/pull/1443)
type WithOptionalTuple = {t: [{a?: 1; b: 2}, {c?: 3}?]};
expectTypeOf<PickDeep<WithOptionalTuple, OptionalPaths<WithOptionalTuple>>>().toBe<{t: [{a?: 1}, {c?: 3}?]}>();
