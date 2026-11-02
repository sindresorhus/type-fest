import {expectTypeOf} from 'nz';
import type {IndexOf, IndexOfOptions, TupleOf} from '../index.d.ts';

// Fixed-length tuples
expectTypeOf<IndexOf<[1, 2, 3], 1>>().toBe<0>();
expectTypeOf<IndexOf<[1, 2, 3], 2>>().toBe<1>();
expectTypeOf<IndexOf<[1, 2, 3], 3>>().toBe<2>();
expectTypeOf<IndexOf<readonly ['a', 'b', 'c'], 'a'>>().toBe<0>();
expectTypeOf<IndexOf<['colors'], 'colors'>>().toBe<0>();
expectTypeOf<IndexOf<[a: string, b: undefined], undefined>>().toBe<1>();
expectTypeOf<IndexOf<[{prop: 'value'; num: 5}, true, null, 'abcd'], 'abc'>>().toBe<never>();

// Every matching index is returned, not just the first.
expectTypeOf<IndexOf<[1, 2, 1], 1>>().toBe<0 | 2>();
expectTypeOf<IndexOf<['a', 'a', 'a'], 'a'>>().toBe<0 | 1 | 2>();
expectTypeOf<IndexOf<[1, 2, 3, 2, 1], 1>>().toBe<0 | 4>();
expectTypeOf<IndexOf<[1, 2, 3, 2, 1], 2>>().toBe<1 | 3>();
expectTypeOf<IndexOf<['a', 'b', 'a', 'b'], 'a'>>().toBe<0 | 2>();
expectTypeOf<IndexOf<[undefined, null, void], undefined>>().toBe<0>();
expectTypeOf<IndexOf<[undefined, null, void], null>>().toBe<1>();
expectTypeOf<IndexOf<[undefined, null, void], void>>().toBe<2>();
expectTypeOf<IndexOf<[undefined, undefined], undefined>>().toBe<0 | 1>();
expectTypeOf<IndexOf<[undefined, 1, undefined], undefined>>().toBe<0 | 2>();

// Empty tuples
expectTypeOf<IndexOf<[], 'abc'>>().toBe<never>();
expectTypeOf<IndexOf<[], any>>().toBe<never>();
expectTypeOf<IndexOf<[], never>>().toBe<never>();
expectTypeOf<IndexOf<[], undefined>>().toBe<never>();

// Elements are compared exactly, not by assignability.
expectTypeOf<IndexOf<[boolean], true>>().toBe<never>();
expectTypeOf<IndexOf<[boolean], boolean>>().toBe<0>();
expectTypeOf<IndexOf<[true, false], boolean>>().toBe<never>();
expectTypeOf<IndexOf<[{}], {a: 1}>>().toBe<never>();
expectTypeOf<IndexOf<[{a: 1}], {a: 1}>>().toBe<0>();
expectTypeOf<IndexOf<[string, number], 'a'>>().toBe<never>();
expectTypeOf<IndexOf<[1, 2, 3], number>>().toBe<never>();
expectTypeOf<IndexOf<[null], null>>().toBe<0>();
expectTypeOf<IndexOf<[null], undefined>>().toBe<never>();
expectTypeOf<IndexOf<[unknown], unknown>>().toBe<0>();
expectTypeOf<IndexOf<[unknown], string>>().toBe<never>();
expectTypeOf<IndexOf<[1, unknown], unknown>>().toBe<1>();
expectTypeOf<IndexOf<[1, 2], unknown>>().toBe<never>();
expectTypeOf<IndexOf<[1, 2], any>>().toBe<never>();
expectTypeOf<IndexOf<[any, 1], 2>>().toBe<never>();
expectTypeOf<IndexOf<[1, 2], never>>().toBe<never>();
expectTypeOf<IndexOf<[never], never>>().toBe<0>();
expectTypeOf<IndexOf<[never], any>>().toBe<never>();
expectTypeOf<IndexOf<[never], unknown>>().toBe<never>();
expectTypeOf<IndexOf<[any], never>>().toBe<never>();
expectTypeOf<IndexOf<[unknown], never>>().toBe<never>();
expectTypeOf<IndexOf<[1, 3], 1 | 2>>().toBe<never>();
expectTypeOf<IndexOf<[true, false], true>>().toBe<0>();
expectTypeOf<IndexOf<[1, 2], 0 | 1>>().toBe<never>();
expectTypeOf<IndexOf<[1 | 2], 1 | 2>>().toBe<0>();
expectTypeOf<IndexOf<[string | number], string | number>>().toBe<0>();
expectTypeOf<IndexOf<[string | number], string>>().toBe<never>();
expectTypeOf<IndexOf<[boolean, true], true>>().toBe<1>();
expectTypeOf<IndexOf<[1, 2, 3], 2 | 3>>().toBe<never>();
expectTypeOf<IndexOf<[(1 | 2)?], 1>>().toBe<never>();
expectTypeOf<IndexOf<[any], any>>().toBe<0>();
expectTypeOf<IndexOf<[void], void>>().toBe<0>();
expectTypeOf<IndexOf<[unknown, unknown], unknown>>().toBe<0 | 1>();
expectTypeOf<IndexOf<[-1, 0, 1], -1>>().toBe<0>();

declare const symbol: unique symbol;
expectTypeOf<IndexOf<[typeof symbol], typeof symbol>>().toBe<0>();
expectTypeOf<IndexOf<[typeof symbol], symbol>>().toBe<never>();

// Nested arrays and objects
expectTypeOf<IndexOf<[[1, 2], [3, 4]], [1, 2]>>().toBe<0>();
expectTypeOf<IndexOf<[[1, 2], [3, 4]], [2, 3]>>().toBe<never>();
expectTypeOf<IndexOf<[{a: 1; b: 2}, {c: 3; d: 4}], {c: 3; d: 4}>>().toBe<1>();
expectTypeOf<IndexOf<[{a: 1}, {a: 1}], {a: 1}>>().toBe<0 | 1>();
expectTypeOf<IndexOf<[{a: 1}, {a: 2}], {a: 1}>>().toBe<0>();
expectTypeOf<IndexOf<[readonly [1, 2], [1, 2]], readonly [1, 2]>>().toBe<0>();
expectTypeOf<IndexOf<[() => void, (value: string) => void], () => void>>().toBe<0>();
expectTypeOf<IndexOf<[(value: string) => void, (value: number) => void], (value: string) => void>>().toBe<0>();

// Unions: the item must equal an element, so a union matches only an element of that same union.
expectTypeOf<IndexOf<[1 | 2, 3], 1>>().toBe<never>();
expectTypeOf<IndexOf<[1, 2], 1 | 2>>().toBe<never>();
expectTypeOf<IndexOf<[1 | 2, 3], 1 | 2>>().toBe<0>();

// A union of arrays is checked per array.
expectTypeOf<IndexOf<[1, 3] | [2, 3], 3>>().toBe<1>();
expectTypeOf<IndexOf<[1, 3] | [2, 3], 1>>().toBe<0>();
expectTypeOf<IndexOf<[1, 3] | [2, 3], 5>>().toBe<never>();
expectTypeOf<IndexOf<[1, 2?] | string[], 1>>().toBe<0>();
expectTypeOf<IndexOf<[1?] | string[], 1>>().toBe<0>();
expectTypeOf<IndexOf<[1, 2?] | [], 1>>().toBe<0>();
expectTypeOf<IndexOf<[1, ...Array<2>] | string[], 1>>().toBe<0>();
expectTypeOf<IndexOf<[1, 2?] | [...string[], 3], 3>>().toBe<number>();
expectTypeOf<IndexOf<[1, 2] | [2, 1] | [3], 1>>().toBe<0 | 1>();
expectTypeOf<IndexOf<[1, 2] | [2, 1] | [3], 2>>().toBe<0 | 1>();
expectTypeOf<IndexOf<[1] | [1, 2], 1>>().toBe<0>();
expectTypeOf<IndexOf<[1?] | [1, 2], 1>>().toBe<0>();
expectTypeOf<IndexOf<readonly [1] | [2, 1], 1>>().toBe<0 | 1>();
expectTypeOf<IndexOf<[1, ...number[]] | [1], 1>>().toBe<0>();
expectTypeOf<IndexOf<[1, 2] | number[], 1>>().toBe<0>();

// An optional element can be absent, but the item can still be found at its index.
expectTypeOf<IndexOf<[1, 2?], 1>>().toBe<0>();
expectTypeOf<IndexOf<[1, 2?], 2>>().toBe<1>();
expectTypeOf<IndexOf<[1, 2?], 3>>().toBe<never>();
expectTypeOf<IndexOf<readonly [1, 2?, 3?], 2>>().toBe<1>();
expectTypeOf<IndexOf<[1?, 2?, 3?], 1>>().toBe<0>();
expectTypeOf<IndexOf<[1?, 2?, 3?], 4>>().toBe<never>();
expectTypeOf<IndexOf<[1?], 2>>().toBe<never>();
expectTypeOf<IndexOf<[1, 3, 3?], 3>>().toBe<1 | 2>();
expectTypeOf<IndexOf<[undefined?], undefined>>().toBe<0>();
expectTypeOf<IndexOf<[undefined?], number>>().toBe<never>();
expectTypeOf<IndexOf<[null?], null>>().toBe<0>();
expectTypeOf<IndexOf<[1?, 2?], 2>>().toBe<1>();
expectTypeOf<IndexOf<[1, never?], never>>().toBe<never>();
expectTypeOf<IndexOf<[any?], 1>>().toBe<never>();
expectTypeOf<IndexOf<[unknown?], 1>>().toBe<never>();

// An optional element is not `undefined`, so it does not match `undefined`.
expectTypeOf<IndexOf<[1?, 2?], undefined>>().toBe<never>();
expectTypeOf<IndexOf<[1, 2, 3?], 3 | undefined>>().toBe<never>();

// An array of unknown length has no known positions, so a matching element gives `number`.
expectTypeOf<IndexOf<string[], string>>().toBe<number>();
expectTypeOf<IndexOf<readonly number[], number>>().toBe<number>();
expectTypeOf<IndexOf<string[], number>>().toBe<never>();
expectTypeOf<IndexOf<[...string[]], 'a'>>().toBe<never>();
expectTypeOf<IndexOf<readonly number[], 1>>().toBe<never>();
expectTypeOf<IndexOf<Array<string | number>, string | number>>().toBe<number>();
expectTypeOf<IndexOf<Array<string | number>, string>>().toBe<never>();
expectTypeOf<IndexOf<unknown[], 1>>().toBe<never>();
expectTypeOf<IndexOf<any[], 1>>().toBe<never>();
expectTypeOf<IndexOf<any[], unknown>>().toBe<never>();
expectTypeOf<IndexOf<Array<1 | 2>, 1>>().toBe<never>();
expectTypeOf<IndexOf<Array<1 | 2>, 1, {distributeItem: true}>>().toBe<number>();

// A length-refined plain array has no tuple keys, but it still has positions.
expectTypeOf<IndexOf<string[] & {length: 2}, string>>().toBe<number>();
expectTypeOf<IndexOf<string[] & {length: 2}, string, {distributeItem: true}>>().toBe<number>();
expectTypeOf<IndexOf<string[] & {length: 2}, number>>().toBe<never>();
expectTypeOf<IndexOf<readonly string[] & {length: 2}, string>>().toBe<number>();
expectTypeOf<IndexOf<string[] & {length: 0}, string>>().toBe<never>();
expectTypeOf<IndexOf<string[] & {length: number}, string>>().toBe<number>();

// Rest elements
expectTypeOf<IndexOf<[1, ...Array<2>, 3], 3>>().toBe<number>();
// The item is at position `1` and in the rest element, so the known position is part of `number`.
expectTypeOf<IndexOf<[1, 2, ...Array<2>], 2>>().toBe<number>();
expectTypeOf<IndexOf<[1, ...Array<2>, 2], 2>>().toBe<number>();
expectTypeOf<IndexOf<[1, 2, ...Array<3>], 1>>().toBe<0>();
expectTypeOf<IndexOf<[1, 2, ...Array<3>], 3>>().toBe<number>();
expectTypeOf<IndexOf<[1, 2, ...Array<3>], 0>>().toBe<never>();
expectTypeOf<IndexOf<[...string[], 1], 1>>().toBe<number>();
expectTypeOf<IndexOf<[...string[], 1, 2, 3], 1>>().toBe<number>();
expectTypeOf<IndexOf<readonly [...string[], 'a'], 'a'>>().toBe<number>();
expectTypeOf<IndexOf<[...string[], 1], 2>>().toBe<never>();
expectTypeOf<IndexOf<[...string[], 1], string>>().toBe<number>();

// An optional element before a rest element is still found at its index.
expectTypeOf<IndexOf<[1?, 2?, ...Array<3>], 1>>().toBe<0>();
expectTypeOf<IndexOf<[1?, 2?, ...Array<3>], 3>>().toBe<number>();
expectTypeOf<IndexOf<[1, 3?, ...Array<2>], 2>>().toBe<number>();
expectTypeOf<IndexOf<[1, 3?, ...Array<2>], 3>>().toBe<1>();
// The item is at the optional position `1` and in the rest element, so the known position is part of `number`.
expectTypeOf<IndexOf<[1, 2?, ...Array<2>], 2>>().toBe<number>();

// A fixed element before a rest element keeps its exact index, while a match at or after the rest element gives `number`.
expectTypeOf<IndexOf<[1, ...number[]], 1>>().toBe<0>();
expectTypeOf<IndexOf<[1, ...number[]], 2>>().toBe<never>();
expectTypeOf<IndexOf<[1, ...number[]], number>>().toBe<number>();
expectTypeOf<IndexOf<[...number[], 1], number>>().toBe<number>();
expectTypeOf<IndexOf<[...number[], 1], string>>().toBe<never>();
expectTypeOf<IndexOf<readonly [...string[]], 'a'>>().toBe<never>();
expectTypeOf<IndexOf<readonly [...string[]], string>>().toBe<number>();
expectTypeOf<IndexOf<[...string[]], 'a', {distributeItem: true}>>().toBe<number>();
expectTypeOf<IndexOf<[1, 2?, ...string[]], 2>>().toBe<1>();
expectTypeOf<IndexOf<[1, 2?, ...string[]], string>>().toBe<number>();
expectTypeOf<IndexOf<[1, 2?, ...string[]], 2 | string>>().toBe<never>();
expectTypeOf<IndexOf<[1?, 2?, ...number[]], 3>>().toBe<never>();
expectTypeOf<IndexOf<[1?, 2?, ...number[]], 3, {distributeItem: true}>>().toBe<number>();
expectTypeOf<IndexOf<[1?, 2?, ...number[]], number, {distributeItem: true}>>().toBe<number>();
expectTypeOf<IndexOf<[...string[], 1, 2], 2>>().toBe<number>();
expectTypeOf<IndexOf<[...string[], 1, 2], 3>>().toBe<never>();
expectTypeOf<IndexOf<[1, ...string[], 2], 2>>().toBe<number>();
expectTypeOf<IndexOf<[1, ...string[], 2], 1>>().toBe<0>();
expectTypeOf<IndexOf<[1, ...string[], 2], 3>>().toBe<never>();
// A trailing rest element must not widen the fixed positions before it.
expectTypeOf<IndexOf<[1, 2, ...string[]], 2>>().toBe<1>();
expectTypeOf<IndexOf<[1, 2, ...string[]], 'a'>>().toBe<never>();
expectTypeOf<IndexOf<[1, ...never[]], 1>>().toBe<0>();
expectTypeOf<IndexOf<[1, ...never[]], 2>>().toBe<never>();
expectTypeOf<IndexOf<[1, ...unknown[]], unknown>>().toBe<number>();
expectTypeOf<IndexOf<[1, ...unknown[]], 1>>().toBe<0>();
expectTypeOf<IndexOf<[1, ...unknown[]], 1, {distributeItem: true}>>().toBe<number>();
expectTypeOf<IndexOf<[1?, ...string[]], 1>>().toBe<0>();
expectTypeOf<IndexOf<[1?, ...string[]], 'a'>>().toBe<never>();
expectTypeOf<IndexOf<[1?, ...Array<1>], 1>>().toBe<number>();
expectTypeOf<IndexOf<[...any[]], 1>>().toBe<never>();
// A `never` rest element cannot hold a value.
expectTypeOf<IndexOf<[...never[]], never>>().toBe<never>();
expectTypeOf<IndexOf<[1, ...never[]], never>>().toBe<never>();
expectTypeOf<IndexOf<[...never[], 1], never>>().toBe<never>();
expectTypeOf<IndexOf<never[], never>>().toBe<never>();

// The `distributeItem` option compares the item and the elements by assignability in either direction, and compares union members separately.
expectTypeOf<IndexOf<[1 | 2, 3], 1, {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<[1, 3], 1 | 2, {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<[1, 2], 1 | 2, {distributeItem: true}>>().toBe<0 | 1>();
expectTypeOf<IndexOf<[1 | 2, 3], 1 | 2, {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<[true, false], true, {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<[true, false], boolean, {distributeItem: true}>>().toBe<0 | 1>();
expectTypeOf<IndexOf<[boolean], boolean, {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<[string, number], 'a', {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<[1, 2, 3], number, {distributeItem: true}>>().toBe<0 | 1 | 2>();
expectTypeOf<IndexOf<[1 | 2, 3], 1 | 3, {distributeItem: true}>>().toBe<0 | 1>();
expectTypeOf<IndexOf<[1, 2, 3], 1 | 3, {distributeItem: true}>>().toBe<0 | 2>();
expectTypeOf<IndexOf<[1, 2, 3], 2 | 4, {distributeItem: true}>>().toBe<1>();
expectTypeOf<IndexOf<[1, 2], 0 | 1, {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<[1, 2], 1 | 3, {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<[boolean], true, {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<[boolean], false, {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<[number, string], boolean, {distributeItem: true}>>().toBe<never>();
expectTypeOf<IndexOf<[never], never, {distributeItem: false}>>().toBe<0>();
expectTypeOf<IndexOf<[never], unknown, {distributeItem: true}>>().toBe<never>();
expectTypeOf<IndexOf<[unknown], never, {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<[any], never, {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<[string | number], string, {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<[boolean, true], true, {distributeItem: true}>>().toBe<0 | 1>();
expectTypeOf<IndexOf<[string | undefined], string, {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<[1, 2], 1 | 2, {distributeItem: false}>>().toBe<never>();
expectTypeOf<IndexOf<[1 | 2, 3], 2, {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<string[], 'a', {distributeItem: true}>>().toBe<number>();
expectTypeOf<IndexOf<[...string[], 1], 'a', {distributeItem: true}>>().toBe<number>();
expectTypeOf<IndexOf<[1?], 1, {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<[1, 3] | [2, 3], 1 | 3, {distributeItem: true}>>().toBe<0 | 1>();
expectTypeOf<IndexOf<[1, 2], never, {distributeItem: true}>>().toBe<never>();
expectTypeOf<IndexOf<[never], never, {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<[never], any, {distributeItem: true}>>().toBe<never>();
expectTypeOf<IndexOf<[1, 2], unknown, {distributeItem: true}>>().toBe<0 | 1>();

// With `distributeItem`, `any` on only one side is a possible match, not a certain one.
expectTypeOf<IndexOf<[any], unknown, {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<[1], any, {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<[1, 2], any, {distributeItem: true}>>().toBe<0 | 1>();
expectTypeOf<IndexOf<[any], 1, {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<[any], any, {distributeItem: true}>>().toBe<0>();

// With `distributeItem`, a union item is found at the positions of every member it includes.
expectTypeOf<IndexOf<[1, 2, 3], 1 | 2 | 3, {distributeItem: true}>>().toBe<0 | 1 | 2>();
expectTypeOf<IndexOf<[1, 2?], 1 | 2, {distributeItem: true}>>().toBe<0 | 1>();
expectTypeOf<IndexOf<[1, ...Array<2>], 1 | 2, {distributeItem: true}>>().toBe<number>();
expectTypeOf<IndexOf<[number, string], 1 | 'a', {distributeItem: true}>>().toBe<0 | 1>();
expectTypeOf<IndexOf<[1, 2], 3 | 4, {distributeItem: true}>>().toBe<never>();
expectTypeOf<IndexOf<[1], 1, {distributeItem: false}>>().toBe<0>();
expectTypeOf<IndexOf<[1, 2, 3], 2 | 3, {distributeItem: true}>>().toBe<1 | 2>();
expectTypeOf<IndexOf<[1, 2, 3], 1 | 4, {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<[(1 | 2)?], 1, {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<[1?, 2?], 1 | 2, {distributeItem: true}>>().toBe<0 | 1>();
expectTypeOf<IndexOf<[1, 2, 1, 2], 1 | 2, {distributeItem: true}>>().toBe<0 | 1 | 2 | 3>();

// With `distributeItem`, a wider element is a possible match, and so is a wider item.
expectTypeOf<IndexOf<[number], 1, {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<[1], number, {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<[number, 1], 1, {distributeItem: true}>>().toBe<0 | 1>();
expectTypeOf<IndexOf<[string], number, {distributeItem: true}>>().toBe<never>();
expectTypeOf<IndexOf<[unknown], 1, {distributeItem: true}>>().toBe<0>();

// Long tuples
expectTypeOf<IndexOf<[...TupleOf<900, 1>, 2], 2>>().toBe<900>();
expectTypeOf<IndexOf<TupleOf<900, 1>, 2>>().toBe<never>();
expectTypeOf<IndexOf<[...TupleOf<900, 1>, 2?], 2>>().toBe<900>();
expectTypeOf<IndexOf<[...string[], ...TupleOf<900, 1>], 2>>().toBe<never>();
expectTypeOf<IndexOf<[...TupleOf<900, 1>, ...Array<2>], 2>>().toBe<number>();
expectTypeOf<IndexOf<[...TupleOf<900, 1>, ...Array<2>], 3>>().toBe<never>();

// Required elements that can be `undefined` keep their `undefined`.
expectTypeOf<IndexOf<[string | undefined], string | undefined>>().toBe<0>();
expectTypeOf<IndexOf<[1, string | undefined], string | undefined>>().toBe<1>();
expectTypeOf<IndexOf<[string | undefined, ...number[]], string | undefined>>().toBe<0>();
expectTypeOf<IndexOf<[string | undefined], string>>().toBe<never>();
expectTypeOf<IndexOf<[1 | undefined], undefined, {distributeItem: true}>>().toBe<0>();

// Primitive types and literals
expectTypeOf<IndexOf<[string], string>>().toBe<0>();
expectTypeOf<IndexOf<['a'], string>>().toBe<never>();
expectTypeOf<IndexOf<[1n, 2n], 1n>>().toBe<0>();
expectTypeOf<IndexOf<[bigint], 1n>>().toBe<never>();
expectTypeOf<IndexOf<[`prefix-${string}`], `prefix-${string}`>>().toBe<0>();
expectTypeOf<IndexOf<[`prefix-${string}`], 'prefix-a'>>().toBe<never>();
expectTypeOf<IndexOf<[`prefix-${string}`], 'prefix-a', {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<[0, '0'], '0'>>().toBe<1>();
expectTypeOf<IndexOf<[0], '0'>>().toBe<never>();
expectTypeOf<IndexOf<[null, undefined], null>>().toBe<0>();
expectTypeOf<IndexOf<[void], undefined>>().toBe<never>();

// Objects, functions, and arrays as items
expectTypeOf<IndexOf<[() => void], () => void>>().toBe<0>();
expectTypeOf<IndexOf<[(value: string) => void], (value: number) => void>>().toBe<never>();
expectTypeOf<IndexOf<[Date, RegExp], RegExp>>().toBe<1>();
expectTypeOf<IndexOf<[{readonly a: 1}], {a: 1}>>().toBe<never>();
expectTypeOf<IndexOf<[{a?: 1}], {a: 1}>>().toBe<never>();
expectTypeOf<IndexOf<[readonly [1]], [1]>>().toBe<never>();
expectTypeOf<IndexOf<[readonly [1]], readonly [1]>>().toBe<0>();
expectTypeOf<IndexOf<[[1]], 1>>().toBe<never>();
expectTypeOf<IndexOf<[string[]], string[]>>().toBe<0>();

// An intersection of objects is not equal to the merged object, see the `IsEqual` docs.
expectTypeOf<IndexOf<[{a: 1} & {b: 2}], {a: 1; b: 2}>>().toBe<never>();

// With `distributeItem`, an object is a possible match for a wider or narrower object.
expectTypeOf<IndexOf<[{a: 1; b: 2}], {a: 1}, {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<[{a: 1}], {a: 1; b: 2}, {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<[{a: 1}], {b: 2}, {distributeItem: true}>>().toBe<never>();

// Labeled tuples
expectTypeOf<IndexOf<[first: 1, second?: 2], 1>>().toBe<0>();
expectTypeOf<IndexOf<[first: 1, second?: 2], 2>>().toBe<1>();
expectTypeOf<IndexOf<[first: 1, ...rest: string[]], string>>().toBe<number>();

// Every matching position is included, whether it comes from a required, optional, or rest element.
expectTypeOf<IndexOf<[1, 1?], 1>>().toBe<0 | 1>();
expectTypeOf<IndexOf<[...Array<1>, 1], 1>>().toBe<number>();
expectTypeOf<IndexOf<[1, ...Array<1>], 1>>().toBe<number>();
expectTypeOf<IndexOf<[2, 3?, ...Array<1>], 2>>().toBe<0>();

// Several elements after a rest element are all searched.
expectTypeOf<IndexOf<[1, ...Array<2>, 3, 4], 4>>().toBe<number>();
expectTypeOf<IndexOf<[1, ...Array<2>, 3, 4], 3>>().toBe<number>();
expectTypeOf<IndexOf<[1, ...Array<2>, 3, 4], 2>>().toBe<number>();
expectTypeOf<IndexOf<[1, ...Array<2>, 3, 4], 5>>().toBe<never>();
expectTypeOf<IndexOf<[...Array<2>, 3, 4], 2>>().toBe<number>();

// A tuple intersected with an object type widens its rest element to `unknown[]`, so the rest element is not searched precisely.
type BrandedRest = readonly [1, ...string[]] & {readonly description: string};
expectTypeOf<IndexOf<BrandedRest, string>>().toBe<never>();
// The widened rest element is a possible match for any item in the distributive mode.
expectTypeOf<IndexOf<BrandedRest, string, {distributeItem: true}>>().toBe<number>();
expectTypeOf<IndexOf<[1, 2] & {brand: true}, 3>>().toBe<never>();
// A leading rest widens to `unknown[]` too, so a fixed element after it is not found exactly.
expectTypeOf<IndexOf<readonly [...number[], 1] & {brand: true}, 1>>().toBe<never>();
expectTypeOf<IndexOf<readonly [...number[], 1] & {brand: true}, 1, {distributeItem: true}>>().toBe<number>();

// Readonly arrays behave like mutable ones.
expectTypeOf<IndexOf<readonly [1, ...Array<2>, 3], 2>>().toBe<number>();
expectTypeOf<IndexOf<readonly [1, ...Array<2>, 3], 3>>().toBe<number>();
expectTypeOf<IndexOf<readonly [1, ...Array<2>, 3], 1>>().toBe<0>();
expectTypeOf<IndexOf<readonly [1, ...Array<2>, 3], 4>>().toBe<never>();
expectTypeOf<IndexOf<readonly [1, 2, 1], 1>>().toBe<0 | 2>();
expectTypeOf<IndexOf<readonly [1, 2?, 3?], 3>>().toBe<2>();
expectTypeOf<IndexOf<readonly [1?], 1>>().toBe<0>();
expectTypeOf<IndexOf<readonly [], 1>>().toBe<never>();
expectTypeOf<IndexOf<ReadonlyArray<1>, 1>>().toBe<number>();
expectTypeOf<IndexOf<readonly [1, 2, ...Array<3>], 1>>().toBe<0>();
expectTypeOf<IndexOf<readonly [...string[], 1], 'a'>>().toBe<never>();
expectTypeOf<IndexOf<readonly [1 | 2], 1, {distributeItem: true}>>().toBe<0>();

// Unions of arrays mixing readonly, optional, and rest elements
expectTypeOf<IndexOf<readonly [1] | [1, 2?], 1>>().toBe<0>();
expectTypeOf<IndexOf<[1] | readonly [2], 1>>().toBe<0>();
expectTypeOf<IndexOf<[1?] | [1], 1>>().toBe<0>();
expectTypeOf<IndexOf<[] | [1], 1>>().toBe<0>();
expectTypeOf<IndexOf<[2] | [3], 1>>().toBe<never>();

// Generic arrays
declare function indexOfOne<ArrayType extends readonly unknown[]>(array: ArrayType): IndexOf<ArrayType, 1>;
expectTypeOf(indexOfOne([1, 2] as const)).toBe<0>();
expectTypeOf(indexOfOne([2, 3] as const)).toBe<never>();
expectTypeOf(indexOfOne([1, 2])).toBe<never>();
expectTypeOf(indexOfOne([1, 2, 1] as const)).toBe<0 | 2>();
expectTypeOf(indexOfOne(['a', 'b'] as const)).toBe<never>();

declare function indexOfValue<ArrayType extends readonly unknown[], Item>(array: ArrayType, item: Item): IndexOf<ArrayType, Item>;
expectTypeOf(indexOfValue<readonly [1, 2], 2>([1, 2], 2)).toBe<1>();
expectTypeOf(indexOfValue<readonly [1, 2], 3>([1, 2], 3)).toBe<never>();

// `never` means the item cannot be found at any position.
declare function mayFindOne<ArrayType extends readonly unknown[]>(array: ArrayType): IndexOf<ArrayType, 1> extends never ? 'no' : 'yes';
expectTypeOf(mayFindOne([1] as const)).toBe<'yes'>();
expectTypeOf(mayFindOne({} as [1?])).toBe<'yes'>();
// An array of `1` elements can be empty, but any position it has holds the item, so the item may be found.
expectTypeOf(mayFindOne({} as Array<1>)).toBe<'yes'>();

declare function hasOne<ArrayType extends readonly unknown[]>(array: ArrayType): IndexOf<ArrayType, 1> extends never ? 'absent' : 'present';
expectTypeOf(hasOne([2] as const)).toBe<'absent'>();
expectTypeOf(hasOne([1] as const)).toBe<'present'>();
expectTypeOf(hasOne([2, 1] as const)).toBe<'present'>();

// Edge cases
expectTypeOf<IndexOf<any, any>>().toBe<any>();
expectTypeOf<IndexOf<any, 1>>().toBe<any>();
expectTypeOf<IndexOf<any, 1, {distributeItem: true}>>().toBe<any>();
expectTypeOf<IndexOf<never, never>>().toBe<never>();
expectTypeOf<IndexOf<never, 1>>().toBe<never>();
expectTypeOf<IndexOf<any[], any>>().toBe<number>();
expectTypeOf<IndexOf<unknown[], unknown>>().toBe<number>();
expectTypeOf<IndexOf<readonly [1 | 2], 1, {distributeItem: true}>>().not.toBeAssignableTo<never>();

// Invalid usage

// Missing all generic parameters.
// @ts-expect-error
type A0 = IndexOf;

// Missing `Item` generic parameter.
// @ts-expect-error
type A1 = IndexOf<['my', 'array', 'has', 'stuff']>;

// Array generic parameter is a string, not an array.
// @ts-expect-error
type A2 = IndexOf<'why a string?', 5>;

// Array generic parameter is an object, not an array.
// @ts-expect-error
type A3 = IndexOf<{key: 'value'}, 7>;

// Invalid option.
// @ts-expect-error
type A4 = IndexOf<[1], 1, {distributeItem: 1}>;

// Option property is not a boolean.
// @ts-expect-error
type A5 = IndexOf<[1], 1, {distributeItem: undefined}>;

// Options must be an object.
// @ts-expect-error
type A6 = IndexOf<[1], 1, null>;

// Options must be an object.
// @ts-expect-error
type A7 = IndexOf<[1], 1, string>;

// Array generic parameter is a number, not an array.
// @ts-expect-error
type A8 = IndexOf<number, 1>;

// Array generic parameter is a promise, not an array.
// @ts-expect-error
type A9 = IndexOf<Promise<[1]>, 1>;

// A non-literal or optional option resolves like the default.
expectTypeOf<IndexOf<[1, 2], 1 | 2, {distributeItem: boolean}>>().toBe<never>();
expectTypeOf<IndexOf<[1, 2], 1 | 2, {distributeItem?: boolean}>>().toBe<never>();
expectTypeOf<IndexOf<[1, 2], 1 | 2, IndexOfOptions>>().toBe<never>();
expectTypeOf<IndexOf<[1, 2], 1 | 2, {distributeItem: any}>>().toBe<never>();
expectTypeOf<IndexOf<[1, 2], 1 | 2, any>>().toBe<never>();
expectTypeOf<IndexOf<[1, 2], 1 | 2, never>>().toBe<never>();

// Generic index results remain usable as numbers through optional and rest elements.
function _readOptionalGenericIndex<Value>(value: IndexOf<[Value?], Value>): number {
	return value;
}

function _readOptionalRestGenericIndex<Value>(value: IndexOf<[Value?, ...Value[]], Value>): number {
	return value;
}

function _readPrefixedGenericIndex<Value>(value: IndexOf<[0, Value], Value>): number {
	return value;
}

function _readGenericItem<Item>(value: IndexOf<[Item], Item>): 0 {
	return value;
}

function _readDistributive<Options extends {distributeItem: true}>(value: IndexOf<readonly [1 | 2], 1, Options>): 0 {
	return value;
}

function _readExactNeverItem<Options extends IndexOfOptions>(value: IndexOf<readonly [1], never, Options>): never {
	return value;
}

// Tuple metadata does not change where a matching first position is found.
type RequiredRoute = readonly ['ready'] & {readonly description: string};
type OptionalRoute = readonly ['ready'?] & {readonly description: string};
expectTypeOf<IndexOf<RequiredRoute, 'ready'>>().toBe<0>();
expectTypeOf<IndexOf<OptionalRoute, 'ready'>>().toBe<0>();
expectTypeOf<IndexOf<RequiredRoute | OptionalRoute, 'ready'>>().toBe<0>();
expectTypeOf<IndexOf<RequiredRoute, 'ready', {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<OptionalRoute, 'ready', {distributeItem: true}>>().toBe<0>();
expectTypeOf<IndexOf<readonly [undefined] & {readonly description: string}, undefined>>().toBe<0>();
expectTypeOf<IndexOf<readonly [undefined?] & {readonly description: string}, undefined>>().toBe<0>();
// Inference from a tuple with metadata widens the first element to every element, so a required first element is read by index.
expectTypeOf<IndexOf<readonly ['ready', 'done'] & {readonly description: string}, 'ready'>>().toBe<0>();
expectTypeOf<IndexOf<readonly ['ready', 'done'] & {readonly description: string}, 'ready' | 'done'>>().toBe<never>();

function _readRequiredMetadataIndex<Value>(value: IndexOf<[Value] & {readonly description: string}, Value>): number {
	return value;
}

function _readOptionalMetadataIndex<Value>(value: IndexOf<[Value?] & {readonly description: string}, Value>): number {
	return value;
}

// A sentinel element is still found at its index when its position is optional.
expectTypeOf<IndexOf<[any?], any>>().toBe<0>();
expectTypeOf<IndexOf<[unknown?], unknown>>().toBe<0>();
// An optional `never` position cannot contain a value.
expectTypeOf<IndexOf<[never?], never>>().toBe<never>();

// A required property refinement guarantees presence even when the underlying tuple position was optional.
expectTypeOf<IndexOf<['ready'?] & {0: 'ready'}, 'ready'>>().toBe<0>();
expectTypeOf<IndexOf<readonly ['ready'?] & {0: 'ready'}, 'ready'>>().toBe<0>();
expectTypeOf<IndexOf<['ready'?] & {'0': 'ready'}, 'ready'>>().toBe<0>();
expectTypeOf<IndexOf<readonly ['ready'?] & {'0': 'ready'}, 'ready'>>().toBe<0>();
expectTypeOf<IndexOf<['ready'?] & {0?: 'ready'}, 'ready'>>().toBe<0>();
expectTypeOf<IndexOf<readonly ['ready'?] & {readonly '0'?: 'ready'}, 'ready'>>().toBe<0>();

// Generic readers cover both traversal directions when a tuple also has a rest element.
function _readSuffixGenericIndex<Value, Options extends IndexOfOptions>(value: IndexOf<[...Value[], 0], Value, Options>): number {
	return value;
}

function _readMixedRestGenericIndex<Value>(value: IndexOf<[Value, ...number[], 0], Value>): number {
	return value;
}

expectTypeOf<IndexOf<readonly [0, ...number[], 'ready'], 'ready'>>().toBe<number>();
expectTypeOf<IndexOf<readonly [...string[], 'ready'] | readonly [0, ...number[]], 'ready'>>().toBe<number>();

// In the distributive mode, a required `never` suffix and an `unknown` rest element both give `number`.
expectTypeOf<IndexOf<readonly [...unknown[], never], never, {distributeItem: true}>>().toBe<number>();
expectTypeOf<IndexOf<readonly [...unknown[], never], any, {distributeItem: true}>>().toBe<number>();
// A `never` rest element cannot hold a value, so only the optional position matches.
expectTypeOf<IndexOf<readonly [unknown?, ...never[]], unknown>>().toBe<0>();

function _readNeverIndex<Options extends IndexOfOptions>(value: IndexOf<readonly [never], never, Options>): 0 {
	return value;
}

function _readEmptyIndex<Item, Options extends IndexOfOptions>(value: IndexOf<readonly [], Item, Options>): never {
	return value;
}

// Distributive matching can produce a definite index as well as none for a union-valued element.
function _readDefiniteDistributiveMatch(value: IndexOf<readonly [1 | 2], 1, {distributeItem: true}>): 0 {
	return value;
}

function _rejectDefiniteDistributiveAbsence(value: IndexOf<readonly [1 | 2], 1, {distributeItem: true}>): never {
	// @ts-expect-error A possible match cannot promise definite absence.
	return value;
}

function _readKnownExactIndex<Options extends {distributeItem: false}>(value: IndexOf<readonly [1 | 2], 1, Options>): never {
	return value;
}

function _readUnresolvedIndex<Distribute extends boolean>(value: IndexOf<readonly [1 | 2], 1, {distributeItem: Distribute}>): never {
	return value;
}
