import {expectTypeOf} from 'nz';
import type {MultidimensionalArray, Opaque, Tagged} from '../index.d.ts';

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

// Enum dimensions have known depths, including zero.
enum Dimensions {
	Zero = 0,
	One = 1,
	Two = 2,
}
expectTypeOf<MultidimensionalArray<string, Dimensions.Two>>().toBe<string[][]>();
expectTypeOf<MultidimensionalArray<string, Dimensions.Zero>>().toBe<string>();
expectTypeOf<MultidimensionalArray<string, Dimensions.One | Dimensions.Two>>().toBe<string[] | string[][]>();

declare enum RuntimeDimensions {
	Value,
}
expectTypeOf<MultidimensionalArray<number, Dimensions>>().toBe<number | number[] | number[][]>();
expectTypeOf<MultidimensionalArray<number, Dimensions.Zero | 1>>().toBe<number | number[]>();
expectTypeOf<MultidimensionalArray<number, RuntimeDimensions.Value>>().toBe<RecursiveArray<number>>();
expectTypeOf<MultidimensionalArray<number, any>>().toBe<RecursiveArray<number>>();
expectTypeOf<MultidimensionalArray<never, Dimensions.One>>().toBe<never[]>();
expectTypeOf<MultidimensionalArray<unknown, Dimensions.Zero>>().toBe<unknown>();
expectTypeOf<MultidimensionalArray<any, Dimensions.Zero>>().toBe<any>();
expectTypeOf<MultidimensionalArray<number, never>>().toBe<never>();
// @ts-expect-error
type UnknownDimensions = MultidimensionalArray<number, unknown>;

// A runtime dimension remains unknown when its number carries a brand.
expectTypeOf<MultidimensionalArray<string, Tagged<number, 'Dimensions'>>>().toBe<RecursiveArray<string>>();

expectTypeOf<MultidimensionalArray<string, Opaque<number, 'Dimensions'>>>().toBe<RecursiveArray<string>>();
expectTypeOf<MultidimensionalArray<string, Tagged<Tagged<number, 'Dimensions'>, 'Validated'>>>().toBe<RecursiveArray<string>>();
expectTypeOf<MultidimensionalArray<string, number & {readonly __brand: unique symbol}>>().toBe<RecursiveArray<string>>();
expectTypeOf<MultidimensionalArray<string, Tagged<0, 'Dimensions'>>>().toBe<string>();
expectTypeOf<MultidimensionalArray<string, Tagged<1, 'Dimensions'>>>().toBe<string[]>();
expectTypeOf<MultidimensionalArray<string, Opaque<2, 'Dimensions'>>>().toBe<string[][]>();
expectTypeOf<MultidimensionalArray<string, Tagged<Dimensions.Two, 'Dimensions'>>>().toBe<string[][]>();
expectTypeOf<MultidimensionalArray<string, Tagged<0 | 1, 'Dimensions'>>>().toBe<string | string[]>();
expectTypeOf<MultidimensionalArray<string, Tagged<number, 'Dimensions'> | 0>>().toBe<string | RecursiveArray<string>>();
expectTypeOf<string[]>().toBeAssignableTo<MultidimensionalArray<string, Tagged<number, 'Dimensions'>>>();
expectTypeOf<string[][]>().toBeAssignableTo<MultidimensionalArray<string, Tagged<number, 'Dimensions'>>>();
expectTypeOf<string>().not.toBeAssignableTo<MultidimensionalArray<string, Tagged<number, 'Dimensions'>>>();
expectTypeOf<number[]>().not.toBeAssignableTo<MultidimensionalArray<string, Tagged<number, 'Dimensions'>>>();
expectTypeOf<MultidimensionalArray<unknown, Tagged<0, 'Dimensions'>>>().toBe<unknown>();
expectTypeOf<MultidimensionalArray<any, Tagged<0, 'Dimensions'>>>().toBe<any>();
expectTypeOf<MultidimensionalArray<never, Tagged<1, 'Dimensions'>>>().toBe<never[]>();
expectTypeOf<MultidimensionalArray<Tagged<string, 'Leaf'>, Tagged<0, 'Dimensions'>>>().toBe<Tagged<string, 'Leaf'>>();
expectTypeOf(createArray(2 as Tagged<number, 'Dimensions'>)).toBe<RecursiveArray<unknown>>();
