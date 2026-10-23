import {expectTypeOf} from 'nz';
import type {ArrayTrim, ArrayTrimEnd, ArrayTrimStart, TupleOf, UnknownArray} from '../index.d.ts';

// Required elements
expectTypeOf<ArrayTrimStart<[0, 0, 1, 0, 2, 0], 0>>().toBe<[1, 0, 2, 0]>();
expectTypeOf<ArrayTrimEnd<[0, 1, 0, 2, 0, 0], 0>>().toBe<[0, 1, 0, 2]>();
expectTypeOf<ArrayTrim<[0, 0, 1, 0, 2, 0, 0], 0>>().toBe<[1, 0, 2]>();

// Nothing to trim
expectTypeOf<ArrayTrimStart<[1, 0], 0>>().toBe<[1, 0]>();
expectTypeOf<ArrayTrimEnd<[0, 1], 0>>().toBe<[0, 1]>();
expectTypeOf<ArrayTrim<[1, 0, 1], 0>>().toBe<[1, 0, 1]>();

// Every element trimmed
expectTypeOf<ArrayTrimStart<[0, 0], 0>>().toBe<[]>();
expectTypeOf<ArrayTrimEnd<[0, 0], 0>>().toBe<[]>();
expectTypeOf<ArrayTrim<[0, 0], 0>>().toBe<[]>();

// Empty array
expectTypeOf<ArrayTrimStart<[], 0>>().toBe<[]>();
expectTypeOf<ArrayTrimEnd<[], 0>>().toBe<[]>();
expectTypeOf<ArrayTrim<readonly [], 0>>().toBe<readonly []>();

// Readonly arrays
expectTypeOf<ArrayTrimStart<readonly [0, 1], 0>>().toBe<readonly [1]>();
expectTypeOf<ArrayTrimEnd<readonly [1, 0], 0>>().toBe<readonly [1]>();
expectTypeOf<ArrayTrim<readonly [0, 1, 0], 0>>().toBe<readonly [1]>();
expectTypeOf<ArrayTrim<readonly [1], 0>>().toBe<readonly [1]>();

// `undefined` elements
expectTypeOf<ArrayTrimStart<[undefined, string | undefined, undefined], undefined>>().toBe<[string | undefined, undefined]>();
expectTypeOf<ArrayTrimEnd<[undefined, string | undefined, undefined], undefined>>().toBe<[undefined, string | undefined]>();
expectTypeOf<ArrayTrimEnd<[1, undefined?], undefined>>().toBe<[1]>();

// Optional elements
expectTypeOf<ArrayTrimStart<[0?, 0?, 1?, 0?], 0>>().toBe<[1?, 0?]>();
expectTypeOf<ArrayTrimStart<[0, 0?, 1?], 0>>().toBe<[1?]>();
expectTypeOf<ArrayTrimEnd<[0, 1, 0?, 0?], 0>>().toBe<[0, 1]>();
expectTypeOf<ArrayTrimEnd<[0?, 1?, 0?], 0>>().toBe<[0?, 1?]>();
expectTypeOf<ArrayTrimEnd<[1, (0 | undefined)?], 0>>().toBe<[1, (0 | undefined)?]>();
expectTypeOf<ArrayTrimEnd<[1, (0 | undefined)?], 0 | undefined>>().toBe<[1]>();
// Trimming stops at an optional element that does not match, even though it can be absent.
expectTypeOf<ArrayTrimEnd<[0, 1?], 0>>().toBe<[0, 1?]>();

// Rest elements
expectTypeOf<ArrayTrimStart<[0, ...Array<0>, 1, 0], 0>>().toBe<[1, 0]>();
expectTypeOf<ArrayTrimStart<[0, ...Array<1>, 0], 0>>().toBe<[...Array<1>, 0]>();
expectTypeOf<ArrayTrimStart<[0?, ...Array<1>], 0>>().toBe<Array<1>>();
expectTypeOf<ArrayTrimEnd<[0, 1, 0?, ...Array<0>], 0>>().toBe<[0, 1]>();
expectTypeOf<ArrayTrimEnd<[0, ...Array<0>, 1, 0], 0>>().toBe<[0, ...Array<0>, 1]>();
expectTypeOf<ArrayTrimEnd<[0, ...Array<1>, 0], 0>>().toBe<[0, ...Array<1>]>();
expectTypeOf<ArrayTrimEnd<[...Array<0>, 0], 0>>().toBe<[]>();
expectTypeOf<ArrayTrimEnd<[...Array<1>, 0], 0>>().toBe<Array<1>>();
expectTypeOf<ArrayTrimStart<[0?, ...Array<0>], 0>>().toBe<[]>();
expectTypeOf<ArrayTrimEnd<[0, 1?, ...Array<0>], 0>>().toBe<[0, 1?]>();
expectTypeOf<ArrayTrimStart<[...Array<0>, 0, 1], 0>>().toBe<[1]>();
expectTypeOf<ArrayTrim<[0, 1, ...Array<0>, 1, 0], 0>>().toBe<[1, ...Array<0>, 1]>();
expectTypeOf<ArrayTrim<readonly [0, ...Array<0>, 0], 0>>().toBe<readonly []>();
// Trimming stops at a rest element that does not match, even though it can be empty.
expectTypeOf<ArrayTrimStart<[...Array<1>, 0], 0>>().toBe<[...Array<1>, 0]>();

// Arrays
expectTypeOf<ArrayTrimStart<Array<0>, 0>>().toBe<[]>();
expectTypeOf<ArrayTrimEnd<ReadonlyArray<0>, 0>>().toBe<readonly []>();
expectTypeOf<ArrayTrim<number[], 0>>().toBe<number[]>();

// Union of arrays
expectTypeOf<ArrayTrimStart<[0, 1] | readonly [0, 0, 2], 0>>().toBe<[1] | readonly [2]>();
expectTypeOf<ArrayTrimEnd<[1, 0] | [2], 0>>().toBe<[1] | [2]>();
expectTypeOf<ArrayTrim<[0, 1] | readonly [0?, ...string[]], 0>>().toBe<[1] | readonly string[]>();
expectTypeOf<ArrayTrim<readonly [0] | [0, 0], 0>>().toBe<readonly [] | []>();

// Union elements and items
expectTypeOf<ArrayTrimStart<[0 | 1, 0, 1], 0>>().toBe<[0 | 1, 0, 1]>();
expectTypeOf<ArrayTrimStart<[0 | 1, 0, 2], 0 | 1>>().toBe<[0, 2]>();
expectTypeOf<ArrayTrimStart<[0 | 1, 0, 2], 0 | 1, {condition: 'extends'}>>().toBe<[2]>();
expectTypeOf<ArrayTrimStart<[0 | 'a', 0, 2], number, {condition: 'extends'}>>().toBe<[0 | 'a', 0, 2]>();
expectTypeOf<ArrayTrim<[1 | 2, 0, 2 | 1], 1 | 2>>().toBe<[0]>();

// `condition` option
expectTypeOf<ArrayTrim<[1, 'a', number, 2], number>>().toBe<[1, 'a', number, 2]>();
expectTypeOf<ArrayTrim<[1, 'a', number, 2], number, {condition: 'equality'}>>().toBe<[1, 'a', number, 2]>();
expectTypeOf<ArrayTrim<[1, 'a', number, 2], number, {condition: 'extends'}>>().toBe<['a']>();
expectTypeOf<ArrayTrim<[number, 1, number], number>>().toBe<[1]>();
expectTypeOf<ArrayTrimEnd<[1, 0?, ...number[]], number, {condition: 'extends'}>>().toBe<[]>();
expectTypeOf<ArrayTrim<[boolean, 0, true], true>>().toBe<[boolean, 0]>();
expectTypeOf<ArrayTrim<[boolean, 0, true], true, {condition: 'extends'}>>().toBe<[boolean, 0]>();
expectTypeOf<ArrayTrim<[true, 0, boolean], boolean, {condition: 'extends'}>>().toBe<[0]>();
expectTypeOf<ArrayTrimStart<[{a: 1}, {a: 1; b: 2}, {a: 2}], {a: 1}>>().toBe<[{a: 1; b: 2}, {a: 2}]>();
expectTypeOf<ArrayTrimStart<[{a: 1}, {a: 1; b: 2}, {a: 2}], {a: 1}, {condition: 'extends'}>>().toBe<[{a: 2}]>();
expectTypeOf<ArrayTrimStart<[{readonly a: 1}, 0], {a: 1}>>().toBe<[{readonly a: 1}, 0]>();

// Boundary types
expectTypeOf<ArrayTrimStart<any, 0>>().toBe<any>();
expectTypeOf<ArrayTrimEnd<never, 0>>().toBe<never>();
expectTypeOf<ArrayTrim<any[], 0>>().toBe<any[]>();
expectTypeOf<ArrayTrim<[any, 0, any], any>>().toBe<[0]>();
expectTypeOf<ArrayTrim<[any, 0, any], 0>>().toBe<[any, 0, any]>();
expectTypeOf<ArrayTrim<[any, 0, any], 0, {condition: 'extends'}>>().toBe<[]>();
expectTypeOf<ArrayTrim<[0, 1], any, {condition: 'extends'}>>().toBe<[]>();
expectTypeOf<ArrayTrim<[never, 0, never], never>>().toBe<[0]>();
expectTypeOf<ArrayTrim<[0, 1], never>>().toBe<[0, 1]>();
expectTypeOf<ArrayTrim<[0, 1], never, {condition: 'extends'}>>().toBe<[0, 1]>();
expectTypeOf<ArrayTrim<[unknown, 0, unknown], unknown>>().toBe<[0]>();
expectTypeOf<ArrayTrim<[0, 1], unknown, {condition: 'extends'}>>().toBe<[]>();
expectTypeOf<ArrayTrim<[unknown, 0], 0, {condition: 'extends'}>>().toBe<[unknown]>();

// Generic arrays
type TrimmedLength<Array_ extends UnknownArray> = ArrayTrim<Array_, 0>['length'];
expectTypeOf<TrimmedLength<[0, 1, 0]>>().toBe<1>();

// Long tuples
expectTypeOf<ArrayTrimStart<[...TupleOf<998, 0>, 1], 0>>().toBe<[1]>();
expectTypeOf<ArrayTrimEnd<[1, ...TupleOf<998, 0>], 0>>().toBe<[1]>();
expectTypeOf<ArrayTrim<[...TupleOf<499, 0>, 1, ...TupleOf<499, 0>], 0>>().toBe<[1]>();

// @ts-expect-error
type InvalidArray = ArrayTrim<string, 0>;

// @ts-expect-error
type InvalidCondition = ArrayTrim<[0], 0, {condition: 'loose'}>;

// An unknown comparison condition can produce either complete trim result.
expectTypeOf<ArrayTrimStart<[1, 'a'], number, {condition: 'equality' | 'extends'}>>().toBe<[1, 'a'] | ['a']>();
expectTypeOf<ArrayTrimEnd<['a', 1], number, {condition: 'equality' | 'extends'}>>().toBe<['a', 1] | ['a']>();
expectTypeOf<ArrayTrim<[1, 'a', 2], number, {condition: 'equality' | 'extends'}>>().toBe<[1, 'a', 2] | ['a']>();
expectTypeOf<ArrayTrim<[1, 'a', 2], number, {condition: 'equality'} | {condition: 'extends'}>>().toBe<[1, 'a', 2] | ['a']>();

// One condition applies to both ends, so partial results from mixing conditions are excluded.
expectTypeOf<[1, 'a']>().not.toBeAssignableTo<ArrayTrim<[1, 'a', 2], number, {condition: 'equality' | 'extends'}>>();
expectTypeOf<['a', 2]>().not.toBeAssignableTo<ArrayTrim<[1, 'a', 2], number, {condition: 'equality' | 'extends'}>>();
expectTypeOf<ArrayTrim<readonly [1, 'a', 2], number, {condition: 'equality' | 'extends'}>>().toBe<readonly [1, 'a', 2] | readonly ['a']>();
expectTypeOf<ArrayTrim<[1, 'a', 2] | readonly [3, 'b', 4], number, {condition: 'equality' | 'extends'}>>()
	.toBe<[1, 'a', 2] | ['a'] | readonly [3, 'b', 4] | readonly ['b']>();
expectTypeOf<ArrayTrimStart<[{a: 1; b: 2}, 'value'], {a: 1}, {condition: 'equality' | 'extends'}>>()
	.toBe<[{a: 1; b: 2}, 'value'] | ['value']>();
expectTypeOf<ArrayTrim<[1 | 2, 'a', 2 | 1], 1 | 2, {condition: 'equality' | 'extends'}>>().toBe<['a']>();
expectTypeOf<ArrayTrim<[1?, 2?], number, {condition: 'equality' | 'extends'}>>().toBe<[1?, 2?] | []>();
expectTypeOf<ArrayTrim<[1, ...Array<2>, 'a', 3], number, {condition: 'equality' | 'extends'}>>().toBe<[1, ...Array<2>, 'a', 3] | ['a']>();
expectTypeOf<ArrayTrim<number[], number, {condition: 'equality' | 'extends'}>>().toBe<[]>();

// Existing defaults and sentinel behavior are shared by all three entry points.
expectTypeOf<ArrayTrim<[1, 'a', 2], number, {condition?: 'equality' | 'extends'}>>().toBe<[1, 'a', 2]>();
expectTypeOf<ArrayTrim<[1, 'a', 2], number, any>>().toBe<[1, 'a', 2]>();
expectTypeOf<ArrayTrim<[1, 'a', 2], number, never>>().toBe<[1, 'a', 2]>();
expectTypeOf<ArrayTrim<any, number, {condition: 'equality' | 'extends'}>>().toBe<any>();
expectTypeOf<ArrayTrim<never, number, {condition: 'equality' | 'extends'}>>().toBe<never>();
expectTypeOf<ArrayTrim<[1, 'a', 2], any, {condition: 'equality' | 'extends'}>>().toBe<[1, 'a', 2] | []>();
expectTypeOf<ArrayTrim<[never, 'a', never], never, {condition: 'equality' | 'extends'}>>().toBe<['a']>();
expectTypeOf<ArrayTrim<[1, 'a', 2], unknown, {condition: 'equality' | 'extends'}>>().toBe<[1, 'a', 2] | []>();
expectTypeOf<ArrayTrimStart<[unknown, 'a'], number, {condition: 'equality' | 'extends'}>>().toBe<[unknown, 'a']>();

// Rest trimming reaches fixed neighbors without dropping their optionality or explicit undefined.
expectTypeOf<ArrayTrimStart<readonly [...Array<0>, 'first', 'last'], 0>>().toBe<readonly ['first', 'last']>();
expectTypeOf<ArrayTrimEnd<readonly ['first', 'last', ...Array<0>], 0>>().toBe<readonly ['first', 'last']>();
expectTypeOf<ArrayTrimEnd<readonly [{id: 'row'}, (0 | undefined)?, ...Array<0>], 0>>().toBe<readonly [{id: 'row'}, (0 | undefined)?]>();
expectTypeOf<ArrayTrimStart<[0, undefined?, ...Array<0>], 0>>().toBe<[undefined?, ...Array<0>]>();
expectTypeOf<ArrayTrimEnd<readonly ['first', ...string[]], 0>>().toBe<readonly ['first', ...string[]]>();
expectTypeOf<ArrayTrimStart<readonly [...string[], 'last'], 0>>().toBe<readonly [...string[], 'last']>();
expectTypeOf<ArrayTrim<readonly [...Array<0>, {id: 'first'}, 0] | [0, {id: 'second'}, ...Array<0>], 0>>().toBe<readonly [{id: 'first'}] | [{id: 'second'}]>();

// One comparison strategy controls both the rest and the fixed neighbors.
expectTypeOf<ArrayTrimStart<[...Array<0>, 'middle'], number, {condition: 'equality' | 'extends'}>>().toBe<[...Array<0>, 'middle'] | ['middle']>();
expectTypeOf<ArrayTrimEnd<['middle', ...Array<0>], number, {condition: 'equality' | 'extends'}>>().toBe<['middle', ...Array<0>] | ['middle']>();
expectTypeOf<ArrayTrim<[1, ...Array<0>, 'middle', 2], number, {condition: 'equality' | 'extends'}>>().toBe<[1, ...Array<0>, 'middle', 2] | ['middle']>();

function _readTrimmedStart<Value>(value: ArrayTrimStart<[...Array<0>, {value: Value}], 0>): Value {
	return value[0].value;
}

function _readTrimmedEnd<Value>(value: ArrayTrimEnd<[{value: Value}, ...Array<0>], 0>): Value {
	return value[0].value;
}

function _readTrimmedBoth<Value>(value: ArrayTrim<[0, ...Array<0>, {value: Value}, 0], 0>): Value {
	return value[0].value;
}

declare function trimPadding<const Value extends readonly unknown[]>(value: Value): ArrayTrim<Value, 0>;
const inferredTrimmed = trimPadding([0, {id: 'row'}, 0]);
expectTypeOf(inferredTrimmed).toBe<readonly [{readonly id: 'row'}]>();
// @ts-expect-error The inferred output remains readonly even when the new value has the correct type.
inferredTrimmed[0] = {id: 'row'};
// @ts-expect-error The input must be an array.
trimPadding('row');

// Matching a rest does not change the surviving fixed values or mix comparison strategies.
expectTypeOf<ArrayTrimEnd<[unknown, ...Array<0>], 0>>().toBe<[unknown]>();
expectTypeOf<ArrayTrimEnd<[any, ...Array<0>], 0>>().toBe<[any]>();
expectTypeOf<ArrayTrimStart<[...Array<0>, never], 0>>().toBe<[never]>();
expectTypeOf<[1, 'middle']>().not.toBeAssignableTo<ArrayTrim<[1, ...Array<0>, 'middle', 2], number, {condition: 'equality' | 'extends'}>>();
expectTypeOf<ArrayTrimStart<[...Array<0>, ...TupleOf<120, 'keep'>], 0>>().toBe<TupleOf<120, 'keep'>>();
expectTypeOf<ArrayTrimEnd<readonly [...TupleOf<120, 'keep'>, ...Array<0>], 0>>().toBe<Readonly<TupleOf<120, 'keep'>>>();
