import {expectType} from 'tsd';
import {MultidimensionalArray} from '../index';

function createArray<T extends number>(_dimensions: T): MultidimensionalArray<unknown, T> {
	return [];
}

const a: MultidimensionalArray<number, 3> = [];
const b: MultidimensionalArray<boolean, number> = [];
const c = createArray(2);
const d = createArray(7);

a[0] = [];
a[0][0] = [];
a[0][0][0] = 42;

type RecursiveArray<T> = Array<RecursiveArray<T>>;

expectType<number[][][]>(a);
expectType<RecursiveArray<boolean>>(b);
expectType<unknown[][]>(c);
expectType<unknown[][][][][][][]>(d);
