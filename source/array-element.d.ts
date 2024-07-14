/**
Extracts the element type of an array or union of arrays.

Returns `never` if T is not an array.

It creates a type-safe way to access the element type of `unknown` type.

@example
```
import type {ArrayElement} from 'type-fest';

declare const getMostCommonElement: <T>(array: T[]) => ArrayElement<typeof array>;

getMostCommonElement([1, 2, 3]);
//=> 1 | 2 | 3

getMostCommonElement(['foo', 'bar', 'baz'] as const);
//=> 'foo' | 'bar' | 'baz'
```

@see {@link ArrayValues} for when you know that the input is an array.

@category Array
*/
export type ArrayElement<ArrayType> = ArrayType extends readonly unknown[] ? ArrayType[0] : never;
