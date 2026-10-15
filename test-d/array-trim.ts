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
