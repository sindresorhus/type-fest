import {expectTypeOf} from 'nz';
import type {Includes, IncludesOptions, TupleOf} from '../index.d.ts';

// Fixed-length tuples
expectTypeOf<Includes<[1, 2, 3], 1>>().toBe<true>();
expectTypeOf<Includes<[1, 2, 3], 3>>().toBe<true>();
expectTypeOf<Includes<[1, 2, 3], 4>>().toBe<false>();
expectTypeOf<Includes<readonly [1, 2, 3], 4>>().toBe<false>();
expectTypeOf<Includes<['colors'], 'colors'>>().toBe<true>();
expectTypeOf<Includes<readonly ['a', 'b', 'c'], 'a'>>().toBe<true>();
expectTypeOf<Includes<[a: string, b: undefined], undefined>>().toBe<true>();
expectTypeOf<Includes<[{prop: 'value'; num: 5}, true, null, 'abcd'], 'abc'>>().toBe<false>();

// Empty tuples
expectTypeOf<Includes<[], 'abc'>>().toBe<false>();
expectTypeOf<Includes<[], any>>().toBe<false>();
expectTypeOf<Includes<[], never>>().toBe<false>();
expectTypeOf<Includes<[], undefined>>().toBe<false>();

// Elements are compared exactly, not by assignability.
expectTypeOf<Includes<[boolean], true>>().toBe<false>();
expectTypeOf<Includes<[boolean], boolean>>().toBe<true>();
expectTypeOf<Includes<[true, false], boolean>>().toBe<false>();
expectTypeOf<Includes<[{}], {a: 1}>>().toBe<false>();
expectTypeOf<Includes<[{a: 1}], {a: 1}>>().toBe<true>();
expectTypeOf<Includes<[string, number], 'a'>>().toBe<false>();
expectTypeOf<Includes<[1, 2, 3], number>>().toBe<false>();
expectTypeOf<Includes<[null], null>>().toBe<true>();
expectTypeOf<Includes<[null], undefined>>().toBe<false>();
expectTypeOf<Includes<[unknown], unknown>>().toBe<true>();
expectTypeOf<Includes<[unknown], string>>().toBe<false>();
expectTypeOf<Includes<[1, unknown], unknown>>().toBe<true>();
expectTypeOf<Includes<[1, 2], unknown>>().toBe<false>();
expectTypeOf<Includes<[1, 2], any>>().toBe<false>();
expectTypeOf<Includes<[any, 1], 2>>().toBe<false>();
expectTypeOf<Includes<[1, 2], never>>().toBe<false>();
expectTypeOf<Includes<[never], never>>().toBe<true>();
expectTypeOf<Includes<[never], any>>().toBe<false>();

declare const symbol: unique symbol;
expectTypeOf<Includes<[typeof symbol], typeof symbol>>().toBe<true>();
expectTypeOf<Includes<[typeof symbol], symbol>>().toBe<false>();

// Nested arrays and objects
expectTypeOf<Includes<[[1, 2], [3, 4]], [1, 2]>>().toBe<true>();
expectTypeOf<Includes<[[1, 2], [3, 4]], [2, 3]>>().toBe<false>();
expectTypeOf<Includes<[{a: 1; b: 2}, {c: 3; d: 4}], {c: 3; d: 4}>>().toBe<true>();

// Unions: the item must equal an element, so a union matches only an element of that same union.
expectTypeOf<Includes<[1 | 2, 3], 1>>().toBe<false>();
expectTypeOf<Includes<[1, 2], 1 | 2>>().toBe<false>();
expectTypeOf<Includes<[1 | 2, 3], 1 | 2>>().toBe<true>();

// A union of arrays is checked per array.
expectTypeOf<Includes<[1, 3] | [2, 3], 3>>().toBe<true>();
expectTypeOf<Includes<[1, 3] | [2, 3], 1>>().toBe<boolean>();
expectTypeOf<Includes<[1, 3] | [2, 3], 5>>().toBe<false>();
expectTypeOf<Includes<[1, 2?] | string[], 1>>().toBe<boolean>();
expectTypeOf<Includes<[1?] | string[], 1>>().toBe<boolean>();
expectTypeOf<Includes<[1, 2?] | [], 1>>().toBe<boolean>();
expectTypeOf<Includes<[1, ...Array<2>] | string[], 1>>().toBe<boolean>();
expectTypeOf<Includes<[1, 2?] | [...string[], 3], 3>>().toBe<boolean>();

// An optional element can be absent, so an item that only matches it may be absent.
expectTypeOf<Includes<[1, 2?], 1>>().toBe<true>();
expectTypeOf<Includes<[1, 2?], 2>>().toBe<boolean>();
expectTypeOf<Includes<[1, 2?], 3>>().toBe<false>();
expectTypeOf<Includes<readonly [1, 2?, 3?], 2>>().toBe<boolean>();
expectTypeOf<Includes<[1?, 2?, 3?], 1>>().toBe<boolean>();
expectTypeOf<Includes<[1?, 2?, 3?], 4>>().toBe<false>();
expectTypeOf<Includes<[1?], 2>>().toBe<false>();
expectTypeOf<Includes<[1, 3, 3?], 3>>().toBe<true>();
expectTypeOf<Includes<[undefined?], undefined>>().toBe<boolean>();
expectTypeOf<Includes<[undefined?], number>>().toBe<false>();
expectTypeOf<Includes<[null?], null>>().toBe<boolean>();

// An optional element is not `undefined`, so it does not include `undefined`.
expectTypeOf<Includes<[1?, 2?], undefined>>().toBe<false>();

// An array of unknown length can be empty, so even an item that matches its element type may be absent.
expectTypeOf<Includes<string[], string>>().toBe<boolean>();
expectTypeOf<Includes<readonly number[], number>>().toBe<boolean>();
expectTypeOf<Includes<string[], number>>().toBe<false>();
expectTypeOf<Includes<[...string[]], 'a'>>().toBe<false>();
expectTypeOf<Includes<readonly number[], 1>>().toBe<false>();

// The element type of `Array<string | number>` is `string | number`, which is not exactly `string`.
expectTypeOf<Includes<Array<string | number>, string>>().toBe<false>();

// Rest elements
expectTypeOf<Includes<[1, ...Array<2>, 3], 3>>().toBe<true>();
expectTypeOf<Includes<[1, 2, ...Array<2>], 2>>().toBe<true>();
expectTypeOf<Includes<[1, ...Array<2>, 2], 2>>().toBe<true>();
expectTypeOf<Includes<[1, 2, ...Array<3>], 3>>().toBe<boolean>();
expectTypeOf<Includes<[1, 2, ...Array<3>], 0>>().toBe<false>();
expectTypeOf<Includes<[...string[], 1], 1>>().toBe<true>();
expectTypeOf<Includes<[...string[], 1, 2, 3], 1>>().toBe<true>();
expectTypeOf<Includes<readonly [...string[], 'a'], 'a'>>().toBe<true>();
expectTypeOf<Includes<[...string[], 1], 2>>().toBe<false>();
expectTypeOf<Includes<[...string[], 1], string>>().toBe<boolean>();
expectTypeOf<Includes<[...Array<1>, 2], 3>>().toBe<false>();

// An optional element before a rest element may be absent too.
expectTypeOf<Includes<[1?, 2?, ...Array<3>], 1>>().toBe<boolean>();
expectTypeOf<Includes<[1?, 2?, ...Array<3>], 3>>().toBe<boolean>();
expectTypeOf<Includes<[1, 3?, ...Array<2>], 2>>().toBe<boolean>();
expectTypeOf<Includes<[1, 3?, ...Array<2>], 3>>().toBe<boolean>();
expectTypeOf<Includes<[1, 2?, ...Array<2>], 2>>().toBe<boolean>();

// The `distributeItem` option compares the item and the elements member by member, by assignability.
expectTypeOf<Includes<[1 | 2, 3], 1, {distributeItem: true}>>().toBe<boolean>();
expectTypeOf<Includes<[1, 3], 1 | 2, {distributeItem: true}>>().toBe<boolean>();
expectTypeOf<Includes<[1, 2], 1 | 2, {distributeItem: true}>>().toBe<true>();
expectTypeOf<Includes<[1 | 2, 3], 1 | 2, {distributeItem: true}>>().toBe<boolean>();
expectTypeOf<Includes<[true, false], true, {distributeItem: true}>>().toBe<true>();
expectTypeOf<Includes<[true, false], boolean, {distributeItem: true}>>().toBe<true>();
expectTypeOf<Includes<[boolean], boolean, {distributeItem: true}>>().toBe<boolean>();
expectTypeOf<Includes<[string, number], 'a', {distributeItem: true}>>().toBe<boolean>();
expectTypeOf<Includes<[1, 2, 3], number, {distributeItem: true}>>().toBe<boolean>();
expectTypeOf<Includes<string[], 'a', {distributeItem: true}>>().toBe<boolean>();
expectTypeOf<Includes<[...string[], 1], 'a', {distributeItem: true}>>().toBe<boolean>();
expectTypeOf<Includes<[1?], 1, {distributeItem: true}>>().toBe<boolean>();
expectTypeOf<Includes<[1, 3] | [2, 3], 1 | 3, {distributeItem: true}>>().toBe<boolean>();
expectTypeOf<Includes<[1, 2], never, {distributeItem: true}>>().toBe<false>();
expectTypeOf<Includes<[never], never, {distributeItem: true}>>().toBe<true>();
expectTypeOf<Includes<[never], any, {distributeItem: true}>>().toBe<false>();
expectTypeOf<Includes<[1, 2], unknown, {distributeItem: true}>>().toBe<boolean>();

// With `distributeItem`, `any` on only one side is a possible match, not a certain one.
expectTypeOf<Includes<[any], unknown, {distributeItem: true}>>().toBe<boolean>();
expectTypeOf<Includes<[1], any, {distributeItem: true}>>().toBe<boolean>();
expectTypeOf<Includes<[1, 2], any, {distributeItem: true}>>().toBe<boolean>();
expectTypeOf<Includes<[any], 1, {distributeItem: true}>>().toBe<boolean>();
expectTypeOf<Includes<[any], any, {distributeItem: true}>>().toBe<true>();

// Long tuples
type LongTuple<Length extends number, Element, Accumulator extends unknown[] = []> = Accumulator['length'] extends Length ? Accumulator : LongTuple<Length, Element, [...Accumulator, Element]>;
expectTypeOf<Includes<Partial<LongTuple<300, 1>>, 1>>().toBe<boolean>();
expectTypeOf<Includes<[...LongTuple<300, number>, 1], 1, {distributeItem: true}>>().toBe<true>();
expectTypeOf<Includes<LongTuple<300, 1 | 2>, 3, {distributeItem: true}>>().toBe<false>();
expectTypeOf<Includes<[...string[], ...LongTuple<300, 2>], 1>>().toBe<false>();

// Required elements that can be `undefined` keep their `undefined`.
expectTypeOf<Includes<[string | undefined], string | undefined>>().toBe<true>();
expectTypeOf<Includes<[1, string | undefined], string | undefined>>().toBe<true>();
expectTypeOf<Includes<[string | undefined, ...number[]], string | undefined>>().toBe<true>();
expectTypeOf<Includes<[string | undefined], string>>().toBe<false>();
expectTypeOf<Includes<[1 | undefined], undefined, {distributeItem: true}>>().toBe<boolean>();

// Primitive types and literals
expectTypeOf<Includes<[string], string>>().toBe<true>();
expectTypeOf<Includes<['a'], string>>().toBe<false>();
expectTypeOf<Includes<[1n, 2n], 1n>>().toBe<true>();
expectTypeOf<Includes<[bigint], 1n>>().toBe<false>();
expectTypeOf<Includes<[`prefix-${string}`], `prefix-${string}`>>().toBe<true>();
expectTypeOf<Includes<[`prefix-${string}`], 'prefix-a'>>().toBe<false>();
expectTypeOf<Includes<[`prefix-${string}`], 'prefix-a', {distributeItem: true}>>().toBe<boolean>();
expectTypeOf<Includes<[0, '0'], '0'>>().toBe<true>();
expectTypeOf<Includes<[0], '0'>>().toBe<false>();
expectTypeOf<Includes<[null, undefined], null>>().toBe<true>();
expectTypeOf<Includes<[void], undefined>>().toBe<false>();

// Objects, functions, and arrays as items
expectTypeOf<Includes<[() => void], () => void>>().toBe<true>();
expectTypeOf<Includes<[(value: string) => void], (value: number) => void>>().toBe<false>();
expectTypeOf<Includes<[Date, RegExp], RegExp>>().toBe<true>();
expectTypeOf<Includes<[{readonly a: 1}], {a: 1}>>().toBe<false>();
expectTypeOf<Includes<[{a?: 1}], {a: 1}>>().toBe<false>();
expectTypeOf<Includes<[readonly [1]], [1]>>().toBe<false>();
expectTypeOf<Includes<[readonly [1]], readonly [1]>>().toBe<true>();
expectTypeOf<Includes<[[1]], 1>>().toBe<false>();
expectTypeOf<Includes<[string[]], string[]>>().toBe<true>();

// An intersection of objects is not equal to the merged object, see the `IsEqual` docs.
expectTypeOf<Includes<[{a: 1} & {b: 2}], {a: 1; b: 2}>>().toBe<false>();

// With `distributeItem`, an object is a possible match for a wider or narrower object.
expectTypeOf<Includes<[{a: 1; b: 2}], {a: 1}, {distributeItem: true}>>().toBe<boolean>();
expectTypeOf<Includes<[{a: 1}], {a: 1; b: 2}, {distributeItem: true}>>().toBe<boolean>();
expectTypeOf<Includes<[{a: 1}], {b: 2}, {distributeItem: true}>>().toBe<false>();

// Labeled tuples
expectTypeOf<Includes<[first: 1, second?: 2], 1>>().toBe<true>();
expectTypeOf<Includes<[first: 1, second?: 2], 2>>().toBe<boolean>();
expectTypeOf<Includes<[first: 1, ...rest: string[]], string>>().toBe<boolean>();

// A required element decides the result even when an optional element or a rest element also matches.
expectTypeOf<Includes<[1, 1?], 1>>().toBe<true>();
expectTypeOf<Includes<[...Array<1>, 1], 1>>().toBe<true>();
expectTypeOf<Includes<[1, ...Array<1>], 1>>().toBe<true>();
expectTypeOf<Includes<[2, 3?, ...Array<1>], 2>>().toBe<true>();

// Several elements after a rest element are all searched.
expectTypeOf<Includes<[1, ...Array<2>, 3, 4], 4>>().toBe<true>();
expectTypeOf<Includes<[1, ...Array<2>, 3, 4], 3>>().toBe<true>();
expectTypeOf<Includes<[1, ...Array<2>, 3, 4], 2>>().toBe<boolean>();
expectTypeOf<Includes<[1, ...Array<2>, 3, 4], 5>>().toBe<false>();
expectTypeOf<Includes<[...Array<2>, 3, 4], 2>>().toBe<boolean>();

// Readonly arrays behave like mutable ones.
expectTypeOf<Includes<readonly [1, ...Array<2>, 3], 2>>().toBe<boolean>();
expectTypeOf<Includes<readonly [1?], 1>>().toBe<boolean>();
expectTypeOf<Includes<readonly [], 1>>().toBe<false>();
expectTypeOf<Includes<ReadonlyArray<1>, 1>>().toBe<boolean>();

// Unions of arrays mixing readonly, optional, and rest elements
expectTypeOf<Includes<readonly [1] | [1, 2?], 1>>().toBe<true>();
expectTypeOf<Includes<[1] | readonly [2], 1>>().toBe<boolean>();
expectTypeOf<Includes<[1?] | [1], 1>>().toBe<boolean>();
expectTypeOf<Includes<[] | [1], 1>>().toBe<boolean>();
expectTypeOf<Includes<[2] | [3], 1>>().toBe<false>();

// With `distributeItem`, a union item is `true` only when every member is certainly included.
expectTypeOf<Includes<[1, 2, 3], 1 | 2 | 3, {distributeItem: true}>>().toBe<true>();
expectTypeOf<Includes<[1, 2?], 1 | 2, {distributeItem: true}>>().toBe<boolean>();
expectTypeOf<Includes<[1, ...Array<2>], 1 | 2, {distributeItem: true}>>().toBe<boolean>();
expectTypeOf<Includes<[number, string], 1 | 'a', {distributeItem: true}>>().toBe<boolean>();
expectTypeOf<Includes<[1, 2], 3 | 4, {distributeItem: true}>>().toBe<false>();
expectTypeOf<Includes<[1], 1, {distributeItem: false}>>().toBe<true>();

// With `distributeItem`, a wider element is a possible match, and so is a wider item.
expectTypeOf<Includes<[number], 1, {distributeItem: true}>>().toBe<boolean>();
expectTypeOf<Includes<[1], number, {distributeItem: true}>>().toBe<boolean>();
expectTypeOf<Includes<[number, 1], 1, {distributeItem: true}>>().toBe<true>();
expectTypeOf<Includes<[string], number, {distributeItem: true}>>().toBe<false>();

// Generic arrays
declare function includesOne<ArrayType extends readonly unknown[]>(array: ArrayType): Includes<ArrayType, 1>;
expectTypeOf(includesOne([1, 2] as const)).toBe<true>();
expectTypeOf(includesOne([2, 3] as const)).toBe<false>();
expectTypeOf(includesOne([1, 2])).toBe<false>();

declare function requireOne<ArrayType extends readonly unknown[]>(array: ArrayType): Includes<ArrayType, 1> extends true ? 'yes' : 'no';
expectTypeOf(requireOne([1] as const)).toBe<'yes'>();
expectTypeOf(requireOne({} as [1?])).toBe<'no'>();
expectTypeOf(requireOne({} as Array<1>)).toBe<'no'>();

// Edge cases
expectTypeOf<Includes<any, any>>().toBe<any>();
expectTypeOf<Includes<never, never>>().toBe<never>();
expectTypeOf<Includes<any[], any>>().toBe<boolean>();
expectTypeOf<Includes<unknown[], unknown>>().toBe<boolean>();

// Invalid usage

// Missing all generic parameters.
// @ts-expect-error
type A0 = Includes;

// Missing `Item` generic parameter.
// @ts-expect-error
type A1 = Includes<['my', 'array', 'has', 'stuff']>;

// Array generic parameter is a string, not an array.
// @ts-expect-error
type A2 = Includes<'why a string?', 5>;

// Array generic parameter is an object, not an array.
// @ts-expect-error
type A3 = Includes<{key: 'value'}, 7>;

// Invalid option.
// @ts-expect-error
type A4 = Includes<[1], 1, {distributeItem: 1}>;

// A non-literal or optional option resolves like the default.
expectTypeOf<Includes<[1, 2], 1 | 2, {distributeItem: boolean}>>().toBe<false>();
expectTypeOf<Includes<[1, 2], 1 | 2, {distributeItem?: boolean}>>().toBe<false>();
expectTypeOf<Includes<[1, 2], 1 | 2, IncludesOptions>>().toBe<false>();
expectTypeOf<Includes<[1, 2], 1 | 2, {distributeItem: any}>>().toBe<false>();
expectTypeOf<Includes<[1, 2], 1 | 2, any>>().toBe<false>();
expectTypeOf<Includes<[1, 2], 1 | 2, never>>().toBe<false>();

function _includesBoolean<Value, Options extends IncludesOptions>(result: Includes<[Value], 1, Options>): boolean {
	return result;
}

// Generic membership results remain usable as booleans through optional and rest elements.
function _readOptionalGenericMembership<Value>(value: Includes<[Value?], Value>): boolean {
	return value;
}

function _readOptionalRestGenericMembership<Value>(value: Includes<[Value?, ...Value[]], Value>): boolean {
	return value;
}

function _readPrefixedGenericMembership<Value>(value: Includes<[0, Value], Value>): boolean {
	return value;
}

// Tuple metadata does not change whether a matching first position is required.
type RequiredRoute = readonly ['ready'] & {readonly description: string};
type OptionalRoute = readonly ['ready'?] & {readonly description: string};
expectTypeOf<Includes<RequiredRoute, 'ready'>>().toBe<true>();
expectTypeOf<Includes<OptionalRoute, 'ready'>>().toBe<boolean>();
expectTypeOf<Includes<RequiredRoute | OptionalRoute, 'ready'>>().toBe<boolean>();
expectTypeOf<Includes<RequiredRoute, 'ready', {distributeItem: true}>>().toBe<true>();
expectTypeOf<Includes<OptionalRoute, 'ready', {distributeItem: true}>>().toBe<boolean>();
expectTypeOf<Includes<readonly [undefined] & {readonly description: string}, undefined>>().toBe<true>();
expectTypeOf<Includes<readonly [undefined?] & {readonly description: string}, undefined>>().toBe<boolean>();
// Inference from a tuple with metadata widens the first element to every element, so a required first element is read by index.
expectTypeOf<Includes<readonly ['ready', 'done'] & {readonly description: string}, 'ready'>>().toBe<true>();
expectTypeOf<Includes<readonly ['ready', 'done'] & {readonly description: string}, 'ready' | 'done'>>().toBe<false>();

function _readRequiredMetadataMembership<Value>(value: Includes<[Value] & {readonly description: string}, Value>): boolean {
	return value;
}

function _readOptionalMetadataMembership<Value>(value: Includes<[Value?] & {readonly description: string}, Value>): boolean {
	return value;
}

// A sentinel element is still only possibly present when its position is optional.
expectTypeOf<Includes<[any?], any>>().toBe<boolean>();
expectTypeOf<Includes<[unknown?], unknown>>().toBe<boolean>();
expectTypeOf<Includes<OptionalRoute, 'ready'>>().not.toBeAssignableTo<true>();
// An optional `never` position cannot contain a value.
expectTypeOf<Includes<[never?], never>>().toBe<false>();

// A required property refinement guarantees presence even when the underlying tuple position was optional.
expectTypeOf<Includes<['ready'?] & {0: 'ready'}, 'ready'>>().toBe<true>();
expectTypeOf<Includes<readonly ['ready'?] & {0: 'ready'}, 'ready'>>().toBe<true>();
expectTypeOf<Includes<['ready'?] & {'0': 'ready'}, 'ready'>>().toBe<true>();
expectTypeOf<Includes<readonly ['ready'?] & {'0': 'ready'}, 'ready'>>().toBe<true>();
expectTypeOf<Includes<['ready'?] & {0?: 'ready'}, 'ready'>>().toBe<boolean>();
expectTypeOf<Includes<readonly ['ready'?] & {readonly '0'?: 'ready'}, 'ready'>>().toBe<boolean>();

// Generic readers cover both traversal directions when a tuple also has a rest element.
function _readSuffixGenericMembership<Value, Options extends IncludesOptions>(value: Includes<[...Value[], 0], Value, Options>): boolean {
	return value;
}

function _readMixedRestGenericMembership<Value>(value: Includes<[Value, ...number[], 0], Value>): boolean {
	return value;
}

expectTypeOf<Includes<readonly [0, ...number[], 'ready'], 'ready'>>().toBe<true>();
expectTypeOf<Includes<readonly [...string[], 'ready'] | readonly [0, ...number[]], 'ready'>>().toBe<boolean>();

// A required never suffix is compared exactly even in the distributive mode.
expectTypeOf<Includes<readonly [...unknown[], never], never, {distributeItem: true}>>().toBe<true>();
expectTypeOf<Includes<readonly [...unknown[], never], any, {distributeItem: true}>>().toBe<boolean>();
expectTypeOf<Includes<readonly [unknown?, ...never[]], unknown>>().toBe<boolean>();

function _readNeverMembership<Options extends IncludesOptions>(value: Includes<readonly [never], never, Options>): true {
	return value;
}

function _readEmptyMembership<Item, Options extends IncludesOptions>(value: Includes<readonly [], Item, Options>): false {
	return value;
}

// Distributive matching can produce true as well as false for a union-valued element.
function _rejectDefiniteDistributiveAbsence(value: Includes<readonly [1 | 2], 1, {distributeItem: true}>): false {
	// @ts-expect-error A possible match cannot promise definite absence.
	return value;
}

function _rejectDefiniteObjectAbsence(value: Includes<readonly [{id: 1} | {other: 2}], {id: 1}, {distributeItem: true}>): false {
	// @ts-expect-error An object variant can match when the mode enables assignability.
	return value;
}

function _readKnownExactMembership<Options extends {distributeItem: false}>(value: Includes<readonly [1 | 2], 1, Options>): false {
	return value;
}

function _readUnresolvedMembership<Distribute extends boolean>(value: Includes<readonly [1 | 2], 1, {distributeItem: Distribute}>): boolean {
	return value;
}

// Long tuples stay within the instantiation depth limit.
expectTypeOf<Includes<TupleOf<900, 1>, 2>>().toBe<false>();
expectTypeOf<Includes<[...TupleOf<900, 1>, 2], 2>>().toBe<true>();
expectTypeOf<Includes<[...TupleOf<900, 1>, 2?], 2>>().toBe<boolean>();
expectTypeOf<Includes<[...string[], ...TupleOf<900, 1>], 2>>().toBe<false>();
