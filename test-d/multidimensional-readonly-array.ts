import {expectTypeOf} from 'nz';
import type {MultidimensionalReadonlyArray} from '../index.d.ts';

function createArray<T extends number>(dimensions: T): MultidimensionalReadonlyArray<string, T> {
	const root: unknown[] = [];

	let array = root;
	for (let dimension = 1; dimension < dimensions; ++dimension) {
		array[0] = [];
		if (dimension < dimensions - 1) {
			array = array[0] as unknown[];
		} else {
			array[0] = '42';
		}
	}

	return root as MultidimensionalReadonlyArray<unknown, T> as MultidimensionalReadonlyArray<string, T>;
}

const a: MultidimensionalReadonlyArray<number, 3> = [];
const b: MultidimensionalReadonlyArray<boolean, number> = [];
const c = createArray(2);

const answer = c?.[0]?.[0]; // '42'

type RecursiveArray<T> = ReadonlyArray<T | RecursiveArray<T>>;

expectTypeOf(answer).toBe<string | undefined>();

expectTypeOf(a).toBe<ReadonlyArray<ReadonlyArray<readonly number[]>>>();
expectTypeOf(b).toBe<RecursiveArray<boolean>>();
expectTypeOf(c).toBe<ReadonlyArray<readonly string[]>>();

// A union of dimensions is a dynamic dimension, so it resolves to the union of the arrays of each dimension, like `MultidimensionalArray` does.
const union: MultidimensionalReadonlyArray<number, 1 | 2 | 3> = [];

expectTypeOf(union).toBe<
	readonly number[]
	| ReadonlyArray<readonly number[]>
	| ReadonlyArray<ReadonlyArray<readonly number[]>>>();

expectTypeOf(createArray(1 as 1 | 2)).toBe<readonly string[] | ReadonlyArray<readonly string[]>>();

// A runtime dimension still permits actual element values at the leaves.
expectTypeOf<readonly number[]>().toBeAssignableTo<MultidimensionalReadonlyArray<number, number>>();
expectTypeOf<ReadonlyArray<readonly number[]>>().toBeAssignableTo<MultidimensionalReadonlyArray<number, number>>();
expectTypeOf<ReadonlyArray<ReadonlyArray<readonly number[]>>>().toBeAssignableTo<MultidimensionalReadonlyArray<number, number>>();

// Dynamic dimensions permit varying nesting depths while keeping the element type.
expectTypeOf<readonly [number, readonly number[], ReadonlyArray<readonly number[]>]>().toBeAssignableTo<MultidimensionalReadonlyArray<number, number>>();
expectTypeOf<ReadonlyArray<ReadonlyArray<ReadonlyArray<ReadonlyArray<readonly number[]>>>>>().toBeAssignableTo<MultidimensionalReadonlyArray<number, number>>();
expectTypeOf<readonly string[]>().not.toBeAssignableTo<MultidimensionalReadonlyArray<number, number>>();
expectTypeOf<ReadonlyArray<ReadonlyArray<readonly string[]>>>().not.toBeAssignableTo<MultidimensionalReadonlyArray<number, number>>();
expectTypeOf<number>().not.toBeAssignableTo<MultidimensionalReadonlyArray<number, number>>();
expectTypeOf<number[][][]>().toBeAssignableTo<MultidimensionalReadonlyArray<number, number>>();

// Zero dimensions leave the element untouched, including in dimension unions.
expectTypeOf<MultidimensionalReadonlyArray<number, 0>>().toBe<number>();
expectTypeOf<MultidimensionalReadonlyArray<number, 0 | 1 | 2>>().toBe<number | readonly number[] | ReadonlyArray<readonly number[]>>();
expectTypeOf<MultidimensionalReadonlyArray<number, never>>().toBe<never>();
expectTypeOf<MultidimensionalReadonlyArray<never, 1>>().toBe<readonly never[]>();
expectTypeOf<ReadonlyArray<{value: number}>>().toBeAssignableTo<MultidimensionalReadonlyArray<{value: number}, number>>();
expectTypeOf<ReadonlyArray<string | number>>().toBeAssignableTo<MultidimensionalReadonlyArray<string | number, number>>();

// Widened runtime dimensions still produce typed leaf values.
expectTypeOf(createArray(2 as number)).toBe<RecursiveArray<string>>();
expectTypeOf<readonly string[]>().toBeAssignableTo<ReturnType<typeof createArray<number>>>();

declare const dynamicArray: MultidimensionalReadonlyArray<number, number>;
// @ts-expect-error
dynamicArray[0] = 1;
