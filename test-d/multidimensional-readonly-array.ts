import {expectType} from 'tsd';
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

type RecursiveArray<T> = ReadonlyArray<RecursiveArray<T>>;

expectType<string | undefined>(answer);

expectType<ReadonlyArray<ReadonlyArray<readonly number[]>>>(a);
expectType<RecursiveArray<boolean>>(b);
expectType<ReadonlyArray<readonly string[]>>(c);

// A union of dimensions is a dynamic dimension, so it resolves to the union of the arrays of each dimension, like `MultidimensionalArray` does.
const union: MultidimensionalReadonlyArray<number, 1 | 2 | 3> = [];

expectType<
	readonly number[]
	| ReadonlyArray<readonly number[]>
	| ReadonlyArray<ReadonlyArray<readonly number[]>>
>(union);

expectType<readonly string[] | ReadonlyArray<readonly string[]>>(createArray(1 as 1 | 2));
