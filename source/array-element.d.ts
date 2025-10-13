/**
Extracts the element type of an array or tuple.

Use-cases:
- When you need type-safe element extraction that returns `never` for non-arrays.
- When working with arrays of unknown type where `T[number]` might not be safe.
- For better readability in complex type operations.

Returns `never` if the type is not an array.

@example
```
import type {ArrayElement} from 'type-fest';

// Arrays
type StringArray = ArrayElement<string[]>;
//=> string

// Tuples
type Tuple = ArrayElement<[1, 2, 3]>;
//=> 1 | 2 | 3

// Type-safe
type NotArray = ArrayElement<{a: string}>;
//=> never

// Practical example
declare function getRandomElement<T extends readonly unknown[]>(array: T): ArrayElement<T>;

getRandomElement(['foo', 'bar', 'baz'] as const);
//=> 'foo' | 'bar' | 'baz'
```

@see {@link ArrayValues} - For directly extracting values from a constant array type.
@see {@link IterableElement} - For iterables like `Set`, `Map`, and generators (not suitable for all use cases due to different inference behavior).

@category Array
*/
export type ArrayElement<T> =
	T extends readonly unknown[]
		? T[number]
		: never;

export {};
