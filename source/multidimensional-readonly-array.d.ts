import type {UnwrapBrand} from './internal/object.d.ts';

type Recursive<T> = ReadonlyArray<T | Recursive<T>>;

/**
Create a type that represents a multidimensional readonly array of the given type and dimension.

A dimension of `0` produces the element type. With `number` as the dimension, the result is an array whose elements can appear at any nesting depth.

Use-cases:
- Return a n-dimensional array from functions.
- Declare a n-dimensional array by defining its dimensions rather than declaring `[]` repetitively.
- Infer the dimensions of a n-dimensional array automatically from function arguments.
- Avoid the need to know in advance the dimensions of a n-dimensional array allowing them to be dynamic.

@example
```
import type {MultidimensionalReadonlyArray} from 'type-fest';

declare function emptyMatrix<Item = unknown>(): <Dimension extends number>(
	dimensions: Dimension,
) => MultidimensionalReadonlyArray<Item, Dimension>;

const readonlyUnknown3DMatrix = emptyMatrix()(3);
//=> readonly (readonly (readonly unknown[])[])[]

const readonlyBoolean2DMatrix = emptyMatrix<boolean>()(2);
//=> readonly (readonly boolean[])[]
```

@category Array
*/
export type MultidimensionalReadonlyArray<Element, Dimensions extends number> =
	Dimensions extends unknown // For distributing `Dimensions` before a wide branded number can erase a zero-dimension alternative.
		? MultidimensionalReadonlyArrayImplementation<Element, Dimensions extends object ? UnwrapBrand<Dimensions> : Dimensions>
		: never;

// Classify the primitive dimension once so a branded runtime number keeps every nesting depth.
// Count nesting levels directly instead of subtracting from the dimension at every level.
type MultidimensionalReadonlyArrayImplementation<Element, Dimensions extends number, Counter extends unknown[] = []> =
	`${number}` extends `${Dimensions}`
		? Recursive<Element>
		: Dimensions extends Counter['length']
			? Element
			: ReadonlyArray<MultidimensionalReadonlyArrayImplementation<Element, Dimensions, [...Counter, unknown]>>;

export {};
