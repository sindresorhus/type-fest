import {expectTypeOf} from 'nz';
import type {MultidimensionalReadonlyArray, Opaque, Tagged} from '../index.d.ts';

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

// Enum dimensions have known depths, including zero.
enum Dimensions {
	Zero = 0,
	One = 1,
	Two = 2,
}
expectTypeOf<MultidimensionalReadonlyArray<string, Dimensions.Two>>().toBe<ReadonlyArray<readonly string[]>>();
expectTypeOf<MultidimensionalReadonlyArray<string, Dimensions.Zero>>().toBe<string>();
expectTypeOf<MultidimensionalReadonlyArray<string, Dimensions.One | Dimensions.Two>>().toBe<readonly string[] | ReadonlyArray<readonly string[]>>();

declare enum RuntimeDimensions {
	Value,
}
expectTypeOf<MultidimensionalReadonlyArray<number, Dimensions>>().toBe<number | readonly number[] | ReadonlyArray<readonly number[]>>();
expectTypeOf<MultidimensionalReadonlyArray<number, Dimensions.Zero | 1>>().toBe<number | readonly number[]>();
expectTypeOf<MultidimensionalReadonlyArray<number, RuntimeDimensions.Value>>().toBe<RecursiveArray<number>>();
expectTypeOf<MultidimensionalReadonlyArray<number, any>>().toBe<RecursiveArray<number>>();
expectTypeOf<MultidimensionalReadonlyArray<never, Dimensions.One>>().toBe<readonly never[]>();
expectTypeOf<MultidimensionalReadonlyArray<unknown, Dimensions.Zero>>().toBe<unknown>();
expectTypeOf<MultidimensionalReadonlyArray<any, Dimensions.Zero>>().toBe<any>();
expectTypeOf<MultidimensionalReadonlyArray<number, never>>().toBe<never>();
// @ts-expect-error
type UnknownDimensions = MultidimensionalReadonlyArray<number, unknown>;

// A runtime dimension remains unknown when its number carries a brand.
expectTypeOf<MultidimensionalReadonlyArray<string, Tagged<number, 'Dimensions'>>>().toBe<RecursiveArray<string>>();

expectTypeOf<MultidimensionalReadonlyArray<string, Opaque<number, 'Dimensions'>>>().toBe<RecursiveArray<string>>();
expectTypeOf<MultidimensionalReadonlyArray<string, Tagged<Tagged<number, 'Dimensions'>, 'Validated'>>>().toBe<RecursiveArray<string>>();
expectTypeOf<MultidimensionalReadonlyArray<string, number & {readonly __brand: unique symbol}>>().toBe<RecursiveArray<string>>();
expectTypeOf<MultidimensionalReadonlyArray<string, Tagged<0, 'Dimensions'>>>().toBe<string>();
expectTypeOf<MultidimensionalReadonlyArray<string, Tagged<1, 'Dimensions'>>>().toBe<readonly string[]>();
expectTypeOf<MultidimensionalReadonlyArray<string, Opaque<2, 'Dimensions'>>>().toBe<ReadonlyArray<readonly string[]>>();
expectTypeOf<MultidimensionalReadonlyArray<string, Tagged<Dimensions.Two, 'Dimensions'>>>().toBe<ReadonlyArray<readonly string[]>>();
expectTypeOf<MultidimensionalReadonlyArray<string, Tagged<0 | 1, 'Dimensions'>>>().toBe<string | readonly string[]>();
expectTypeOf<MultidimensionalReadonlyArray<string, Tagged<number, 'Dimensions'> | 0>>().toBe<string | RecursiveArray<string>>();
expectTypeOf<readonly string[]>().toBeAssignableTo<MultidimensionalReadonlyArray<string, Tagged<number, 'Dimensions'>>>();
expectTypeOf<ReadonlyArray<readonly string[]>>().toBeAssignableTo<MultidimensionalReadonlyArray<string, Tagged<number, 'Dimensions'>>>();
expectTypeOf<string>().not.toBeAssignableTo<MultidimensionalReadonlyArray<string, Tagged<number, 'Dimensions'>>>();
expectTypeOf<number[]>().not.toBeAssignableTo<MultidimensionalReadonlyArray<string, Tagged<number, 'Dimensions'>>>();
expectTypeOf<MultidimensionalReadonlyArray<unknown, Tagged<0, 'Dimensions'>>>().toBe<unknown>();
expectTypeOf<MultidimensionalReadonlyArray<any, Tagged<0, 'Dimensions'>>>().toBe<any>();
expectTypeOf<MultidimensionalReadonlyArray<never, Tagged<1, 'Dimensions'>>>().toBe<readonly never[]>();
expectTypeOf<MultidimensionalReadonlyArray<Tagged<string, 'Leaf'>, Tagged<0, 'Dimensions'>>>().toBe<Tagged<string, 'Leaf'>>();
expectTypeOf(createArray(2 as Tagged<number, 'Dimensions'>)).toBe<RecursiveArray<string>>();
