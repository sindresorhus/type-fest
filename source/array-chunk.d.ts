import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {IsInteger} from './is-integer.d.ts';
import type {IsNegative} from './numeric.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {UnwrapBrandedPrimitive} from './unwrap-branded-primitive.d.ts';

/**
Split an array into consecutive chunks of the given size.

Use-cases:
- Preserve exact batch contents in a static schema.
- Describe grid rows or fixed-width records.

The last chunk can be shorter. Size must be a positive integer literal; other sizes give `never`. Branded sizes are unwrapped before counting. Arrays and rest tuples produce arrays of arrays. Optional tuple elements are unsupported and give `never`. A readonly input produces a readonly outer array and readonly chunks.

Tuple intersections with brands or extra properties are unsupported.

Distributes over unions of arrays and sizes. Returns `any` if either argument is `any`; otherwise returns `never` if either argument is `never`.

@example
```
import type {ArrayChunk} from 'type-fest';

type Rows = ArrayChunk<[1, 2, 3, 4, 5], 2>;
//=> [[1, 2], [3, 4], [5]]

type Empty = ArrayChunk<[], 2>;
//=> []
```

For fixed tuples, a size of one wraps each element directly. Larger sizes accumulate elements in a chunk, which is appended to the result as soon as its length reaches the requested size.

@category Array
*/
export type ArrayChunk<ArrayType extends UnknownArray, Size extends number> = IfNotAnyOrNever<ArrayType | Size, {
	ifNot: ArrayType extends unknown
		? Size extends unknown
			? Size extends 0
				? never
				: [IsInteger<Size>, IsNegative<Size>, ArrayType] extends [true, false, Required<ArrayType>]
					? Chunk<ArrayType, UnwrapBrandedPrimitive<Size>> extends infer Result extends UnknownArray
						? ArrayType extends unknown[] ? Result : Readonly<{[Index in keyof Result]: Readonly<Result[Index]>}>
						: never
					: never
			: never
		: never;
}>;

/**
Builds fixed chunks, or widens arrays whose length is not known.

A size of one maps positions directly to avoid repeated tuple slicing and accumulator copies. For larger sizes, each step consumes one element and closes the chunk as soon as it is full, so the recursion depth matches the array length.
*/
type Chunk<ArrayType extends UnknownArray, Size extends number, Current extends unknown[] = [], Result extends unknown[] = []> = number extends ArrayType['length']
	? Array<Array<ArrayType[number]>>
	: Size extends 1
		? {-readonly [Index in keyof ArrayType]: [ArrayType[Index]]}
		: ArrayType extends readonly [infer First, ...infer Rest]
			? [...Current, First]['length'] extends Size
				? Chunk<Rest, Size, [], [...Result, [...Current, First]]>
				: Chunk<Rest, Size, [...Current, First], Result>
			: Current extends [] ? Result : [...Result, Current];

export {};
