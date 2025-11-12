import type {Subtract} from './subtract.d.ts';
import type {IsEqual} from './is-equal.d.ts';

type Recursive<T> = ReadonlyArray<Recursive<T>>;

/**
Creates a type that represents a multidimensional readonly array that of the given type and dimension.

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
[Playground Link](https://www.typescriptlang.org/play/?exactOptionalPropertyTypes=true#code/JYWwDg9gTgLgBDAnmApnA3gWQK4BsbAAmoKAdgM7ASkCGuASijYdbogIJRQ2IC+cAMygQQcAORJUAWgEpyMMQG4AUMsIoAxrhpQ0A7KQ0FqcFOCSYaMKMAAeAHgCSMM3AC8cAwGtSEAO6kAHwAFACUAFxw9gAiJBRUpKa2LqSE5HCk2CAARihQIcoAkMQgZJTU5JGxpfHUADTKoe6BcDj4RHHltAxMLKRsnNyITi4gdXDVZQmBKsoaFfC6zKyIAKqkPv6kAMzRltZ27qbmiPs2tmHB26EqAPS3bi1LfWxwwc8rbx-9iJ4bvgEANoAXVCILBwNU8woi16KwAQhAILgmKQAEx7KznI5mMAWLF2ezZJEomhBS5om7Ke6PODfV7vOE-ODE5Go8EgoA)

@category Array
*/
export type MultidimensionalReadonlyArray<Element, Dimensions extends number> = number extends Dimensions
	? Recursive<Element>
	: IsEqual<Dimensions, 0> extends true
		? Element
		: ReadonlyArray<MultidimensionalReadonlyArray<Element, Subtract<Dimensions, 1>>>;

export {};
