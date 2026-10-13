import {expectTypeOf} from 'nz';
import type {MultidimensionalArray} from '../index.d.ts';

function createArray<T extends number>(dimensions: T): MultidimensionalArray<unknown, T> {
	const root: unknown[] = [];

	let array = root;
	for (let dimension = 1; dimension < dimensions; ++dimension) {
		array[0] = [];
		array = array[0] as unknown[];
	}

	return root as MultidimensionalArray<unknown, T>;
}

const a: MultidimensionalArray<number, 3> = [];
const b: MultidimensionalArray<boolean, number> = [];
const c = createArray(2);
const d = createArray(7);

// @ts-expect-error
a[0][0][0] = 42;

type RecursiveArray<T> = Array<T | RecursiveArray<T>>;

expectTypeOf(a).toBe<number[][][]>();
expectTypeOf(b).toBe<RecursiveArray<boolean>>();
expectTypeOf(c).toBe<unknown[][]>();
expectTypeOf(d).toBe<unknown[][][][][][][]>();

// A union of dimensions is a dynamic dimension, so it resolves to the union of the arrays of each dimension.
const union: MultidimensionalArray<number, 1 | 2 | 3> = [];

expectTypeOf(union).toBe<number[] | number[][] | number[][][]>();

expectTypeOf(createArray(1 as 1 | 2)).toBe<unknown[] | unknown[][]>();

// A runtime dimension still permits actual element values at the leaves.
expectTypeOf<number[]>().toBeAssignableTo<MultidimensionalArray<number, number>>();
expectTypeOf<number[][]>().toBeAssignableTo<MultidimensionalArray<number, number>>();
expectTypeOf<number[][][]>().toBeAssignableTo<MultidimensionalArray<number, number>>();

// Dynamic dimensions permit varying nesting depths while keeping the element type.
expectTypeOf<[number, number[], number[][]]>().toBeAssignableTo<MultidimensionalArray<number, number>>();
expectTypeOf<number[][][][][]>().toBeAssignableTo<MultidimensionalArray<number, number>>();
expectTypeOf<string[]>().not.toBeAssignableTo<MultidimensionalArray<number, number>>();
expectTypeOf<string[][][]>().not.toBeAssignableTo<MultidimensionalArray<number, number>>();
expectTypeOf<number>().not.toBeAssignableTo<MultidimensionalArray<number, number>>();
expectTypeOf<readonly number[]>().not.toBeAssignableTo<MultidimensionalArray<number, number>>();
expectTypeOf<Array<readonly number[]>>().not.toBeAssignableTo<MultidimensionalArray<number, number>>();

// Zero dimensions leave the element untouched, including in dimension unions.
expectTypeOf<MultidimensionalArray<number, 0>>().toBe<number>();
expectTypeOf<MultidimensionalArray<number, 0 | 1 | 2>>().toBe<number | number[] | number[][]>();
expectTypeOf<MultidimensionalArray<number, never>>().toBe<never>();
expectTypeOf<MultidimensionalArray<never, 1>>().toBe<never[]>();
expectTypeOf<Array<{value: number}>>().toBeAssignableTo<MultidimensionalArray<{value: number}, number>>();
expectTypeOf<Array<string | number>>().toBeAssignableTo<MultidimensionalArray<string | number, number>>();

// Widened runtime dimensions do not lose the matrix's leaves.
expectTypeOf(createArray(2 as number)).toBe<RecursiveArray<unknown>>();
expectTypeOf<unknown[][]>().toBeAssignableTo<ReturnType<typeof createArray<number>>>();

declare const dynamicArray: MultidimensionalArray<number, number>;
dynamicArray.push(1, [2], [[3]]);
// @ts-expect-error
dynamicArray[0] = 'invalid';
