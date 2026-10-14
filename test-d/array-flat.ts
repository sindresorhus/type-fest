import {expectTypeOf} from 'nz';
import type {ArrayFlat, PositiveInfinity} from '../index.d.ts';

// Fixed-length tuples
expectTypeOf<ArrayFlat<[]>>().toBe<[]>();
expectTypeOf<ArrayFlat<[1, 2, 3]>>().toBe<[1, 2, 3]>();
expectTypeOf<ArrayFlat<[[1, 2], [3, 4]]>>().toBe<[1, 2, 3, 4]>();
expectTypeOf<ArrayFlat<[1, [2, [3]], 4]>>().toBe<[1, 2, [3], 4]>();
expectTypeOf<ArrayFlat<[1, [], 2]>>().toBe<[1, 2]>();
expectTypeOf<ArrayFlat<[{a: number}, [{b: string}]]>>().toBe<[{a: number}, {b: string}]>();

// Depth
type Nested = [[0, [1, [2, [3, [4, [5]]]]]]];
expectTypeOf<ArrayFlat<Nested, 0>>().toBe<Nested>();
expectTypeOf<ArrayFlat<Nested, 2>>().toBe<[0, 1, [2, [3, [4, [5]]]]]>();
expectTypeOf<ArrayFlat<Nested, 3>>().toBe<[0, 1, 2, [3, [4, [5]]]]>();
expectTypeOf<ArrayFlat<Nested, 6>>().toBe<[0, 1, 2, 3, 4, 5]>();
expectTypeOf<ArrayFlat<Nested, 7>>().toBe<[0, 1, 2, 3, 4, 5]>();
expectTypeOf<ArrayFlat<Nested, PositiveInfinity>>().toBe<[0, 1, 2, 3, 4, 5]>();
expectTypeOf<ArrayFlat<[0, ...Array<[1, [2]]>], PositiveInfinity>>().toBe<[0, ...Array<1 | 2>]>();

// A union of depths gives a result for each depth.
expectTypeOf<ArrayFlat<[1, [2], 3], 0 | 1>>().toBe<[1, [2], 3] | [1, 2, 3]>();

// A depth below 1 does not flatten, just like `Array#flat()`.
expectTypeOf<ArrayFlat<Nested, -1>>().toBe<Nested>();
expectTypeOf<ArrayFlat<Nested, 0.5>>().toBe<Nested>();

// An unknown depth gives the element type of the built-in `Array#flat()`.
expectTypeOf<ArrayFlat<[[1], [[2]]], number>>().toBe<Array<FlatArray<[[1], [[2]]], number>>>();

// Rest elements and arrays of unknown length
expectTypeOf<ArrayFlat<number[][]>>().toBe<number[]>();
expectTypeOf<ArrayFlat<['a', number[], 'b']>>().toBe<['a', ...number[], 'b']>();
expectTypeOf<ArrayFlat<[1, [2, ...Array<3>], 4]>>().toBe<[1, 2, ...Array<3>, 4]>();
expectTypeOf<ArrayFlat<[...Array<[1, 2]>, 3]>>().toBe<[...Array<1 | 2>, 3]>();

// The pairing of elements in an array of unknown length cannot be kept, so their types are merged.
expectTypeOf<ArrayFlat<Array<[number, string]>>>().toBe<Array<number | string>>();

// Two rest elements are merged into one, along with the elements between them.
expectTypeOf<ArrayFlat<[number, Array<'a'>, Array<'b'>, boolean]>>().toBe<[number, ...Array<'a' | 'b'>, boolean]>();
expectTypeOf<ArrayFlat<[...number[], string[]]>>().toBe<Array<number | string>>();

// An optional element becomes a rest element, because it can be absent.
type WithOptional = ArrayFlat<[boolean, [string, number?], boolean]>;
expectTypeOf<WithOptional>().toBe<[boolean, string, ...number[], boolean]>();
expectTypeOf([true, 'a', false] as [true, 'a', false]).toBeAssignableTo<WithOptional>();
expectTypeOf([true, 'a', 1, false] as [true, 'a', 1, false]).toBeAssignableTo<WithOptional>();
expectTypeOf<ArrayFlat<Array<[number, string?]>>>().toBe<Array<number | string>>();
expectTypeOf<ArrayFlat<[1, 2?]>>().toBe<[1, ...Array<2>]>();

// Unions
expectTypeOf<ArrayFlat<[1, [2]] | [[3], 4]>>().toBe<[1, 2] | [3, 4]>();
expectTypeOf<ArrayFlat<[1 | [2, 3]]>>().toBe<[1] | [2, 3]>();

// A union of non-array members stays one element.
expectTypeOf<ArrayFlat<[boolean, [string]]>>().toBe<[boolean, string]>();

// Readonly arrays give a mutable array, just like `Array#flat()`.
expectTypeOf<ArrayFlat<readonly [readonly [1, 2], 3]>>().toBe<[1, 2, 3]>();
expectTypeOf<ArrayFlat<ReadonlyArray<readonly string[]>>>().toBe<string[]>();
expectTypeOf<ArrayFlat<readonly [1, [2]], 0>>().toBe<[1, [2]]>();

// Long tuples
type LongTuple<Length extends number, Accumulator extends unknown[] = []> = Accumulator['length'] extends Length ? Accumulator : LongTuple<Length, [...Accumulator, [Accumulator['length']]]>;
expectTypeOf<ArrayFlat<LongTuple<300>>['length']>().toBe<300>();

// Deep nesting
type DeeplyNested<Levels extends number, Value = 1, Counter extends unknown[] = []> = Counter['length'] extends Levels ? Value : DeeplyNested<Levels, [Value], [...Counter, unknown]>;
expectTypeOf<ArrayFlat<DeeplyNested<20>, PositiveInfinity>>().toBe<[1]>();

// A generic result is still known to be an array.
declare function flat<ArrayType extends unknown[]>(array: ArrayType): ArrayFlat<ArrayType>;

function _generic<ArrayType extends unknown[]>(array: ArrayType): unknown[] {
	return flat(array);
}

function _genericTuple<Element>(array: ArrayFlat<readonly [Element, ...Element[]]>): unknown[] {
	return array;
}

function _genericDeep<ArrayType extends unknown[]>(array: ArrayFlat<ArrayType, PositiveInfinity>): readonly unknown[] {
	return array;
}

// Edge cases
expectTypeOf<ArrayFlat<any>>().toBe<any>();
expectTypeOf<ArrayFlat<never>>().toBe<never>();
expectTypeOf<ArrayFlat<any[]>>().toBe<any[]>();
expectTypeOf<ArrayFlat<never[]>>().toBe<never[]>();
expectTypeOf<ArrayFlat<unknown[]>>().toBe<unknown[]>();
expectTypeOf<ArrayFlat<[never, [never]]>>().toBe<[never, never]>();

// `any` and `unknown` can be an array of any length, so they become a rest element.
expectTypeOf<ArrayFlat<[any, 1]>>().toBe<[...any[], 1]>();
expectTypeOf<ArrayFlat<[unknown, [2]]>>().toBe<[...unknown[], 2]>();
expectTypeOf<ArrayFlat<[unknown, 1], 0>>().toBe<[unknown, 1]>();

// `object` could be an array, but is kept as one element, like the built-in `Array#flat()` does.
expectTypeOf<ArrayFlat<[object, 1]>>().toBe<[object, 1]>();
