/**
Create a type that represents a multidimensional array of the given type and dimension.

Use-cases:
- Declaring n-dimensional array easily and declaratively.
- Creating n-dimensional array in functions.

@example
```
import {MultidimensionalArray} from 'type-fest';

function emptyMatrix<T extends number>(dimensions: T): MultiDimensionalArray<number, T> {
  // Initialize the matrix in somehow
  return [];
}

const matrix = emptyMatrix(3);

matrix[0] = [];
matrix[0][0] = [];
matrix[0][0][0] = 42;
```

@category Utilities
 */
export type MultidimensionalArray<Element, Dimensions extends number> = number extends Dimensions
	? Recursive<Element>
	: EQ<Dimensions, 0> extends true
		? Element
		: Array<MultidimensionalArray<Element, Subtract<Dimensions, 1>>>;

type Recursive<T> = Array<Recursive<T>>;

// The MultidimensionalArray depends on the following types that come from a blogpost from Ryan Dabler where he explains
// how we can implement simple arithmetic operations within types.
// https://itnext.io/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f
type Length<T extends any[]> = T extends {length: infer L}
	? L
	: never;

type BuildTuple<L extends number, T extends any[] = []> = T extends {length: L}
	? T
	: BuildTuple<L, [...T, any]>;

type Subtract<A extends number, B extends number> = BuildTuple<A> extends [...(infer U), ...BuildTuple<B>]
	? Length<U>
	: never;

type EQ<A, B> = A extends B
	? (B extends A ? true : false)
	: false;
