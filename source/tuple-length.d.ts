import type {UnknownArray} from './unknown-array.d.ts';
import type {ArrayLength} from './array-length.d.ts'; // For `@link`

/**
Return the length of a tuple.

Returns `never` for arrays of unknown length. Useful for extracting known lengths from a union without widening the result to `number`.

Supports readonly tuples. Optional elements produce a union of possible lengths. Members whose length is `number`, including tuples with unbounded rest elements, are excluded from unions. Arrays with an explicitly narrowed length return that length type. Both `any` and `never` return `never`; non-array inputs, including `unknown`, are rejected.

Use {@link ArrayLength} to keep `number` for arrays of unknown length.

@example
```
import type {TupleLength} from 'type-fest';

type Coordinates = TupleLength<readonly [x: number, y: number, z?: number]>;
//=> 2 | 3

type VariableLength = TupleLength<[string, ...number[]]>;
//=> never

// The empty tuple has length `0`, and the array of unknown length drops out.
type KnownLengths = TupleLength<[] | [number, number] | number[]>;
//=> 0 | 2
```

@category Array
*/
export type TupleLength<Tuple extends UnknownArray> =
	// Distribute over unions before checking each member's length.
	Tuple extends unknown
		? number extends Tuple['length']
			? never // Return never if the given type is a non-fixed-length array like `Array<string>`.
			: Tuple['length']
		: never; // An empty union (`never`) stays `never`.

export {};
