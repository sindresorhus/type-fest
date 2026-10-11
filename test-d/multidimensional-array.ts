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

type RecursiveArray<T> = Array<RecursiveArray<T>>;

expectTypeOf(a).toBe<number[][][]>();
expectTypeOf(b).toBe<RecursiveArray<boolean>>();
expectTypeOf(c).toBe<unknown[][]>();
expectTypeOf(d).toBe<unknown[][][][][][][]>();

// A union of dimensions is a dynamic dimension, so it resolves to the union of the arrays of each dimension.
const union: MultidimensionalArray<number, 1 | 2 | 3> = [];

expectTypeOf(union).toBe<number[] | number[][] | number[][][]>();

expectTypeOf(createArray(1 as 1 | 2)).toBe<unknown[] | unknown[][]>();
