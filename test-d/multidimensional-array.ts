import {expectTypeOf} from 'expect-type';
import type {MultidimensionalArray} from '../index';

function createArray<T extends number>(dimensions: T): MultidimensionalArray<unknown, T> {
	const root: unknown[] = [];

	let array = root;
	for (let dimension = 1; dimension < dimensions; ++dimension) {
		console.log(`Initializing dimension #${dimension}`);

		array[0] = [];
		array = array[0] as unknown[];
	}

	return root as MultidimensionalArray<unknown, T>;
}

const a: MultidimensionalArray<number, 3> = [];
const b: MultidimensionalArray<boolean, number> = [];
const c = createArray(2);
const d = createArray(7);

a[0][0][0] = 42;

type RecursiveArray<T> = Array<RecursiveArray<T>>;

expectTypeOf(a).toEqualTypeOf<number[][][]>();
expectTypeOf(b).toEqualTypeOf<RecursiveArray<boolean>>();
expectTypeOf(c).toEqualTypeOf<unknown[][]>();
expectTypeOf(d).toEqualTypeOf<unknown[][][][][][][]>();
