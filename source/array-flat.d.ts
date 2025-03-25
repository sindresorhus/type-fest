import type {IsAny} from './is-any';
import type {IsNever} from './is-never';
import type {Or} from './or';
import type {Subtract} from './subtract';
import type {UnknownArray} from './unknown-array';

/**
Creates a new array type by flattening an array to a specified depth.

Use-case: Flatten an array type to a specified depth.

Like [`Array#flat()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat) but for types.

@example
```
import type {ArrayFlat, PositiveInfinity} from 'type-fest';

type FlatArr0 = ArrayFlat<[[0, 1], [2, 3], [4, 5]]>;
//=> type FlatArr0 = [0, 1, 2, 3, 4, 5];

// Flatten to depth
type Arr1 = [[0, [1, [2, [3, [4, [5]]]]]]];
type FlatArr1 = ArrayFlat<Arr1, 1>;
//=> type FlatArr1 = [0, [1, [2, [3, [4, [5]]]]]];

type FlatArr2 = ArrayFlat<Arr1, 3>;
//=> type FlatArr2 = [0, 1, 2, [3, [4, [5]]]];

// Flatten to depth Infinity
type FlatArr3 = ArrayFlat<Arr1, PositiveInfinity>;
//=> type FlatArr3 = [0, 1, 2, 3, 4, 5];
```

@category Array
*/
export type ArrayFlat<T, Depth extends number = 1> = InternalArrayFlat<T, Depth>;

// Internal implementation
type InternalArrayFlat<T, Depth extends number = 1, Result extends UnknownArray = [] > =
T extends UnknownArray
	? T['length'] extends 0
		? [...Result, ...T]
		: Depth extends 0
			? [...Result, ...T]
			: T extends readonly [infer ArrayItem, ...infer Last]
				?	ArrayItem extends UnknownArray
					? InternalArrayFlat<Last, Depth, [...Result, ...InternalArrayFlat<ArrayItem, Subtract<Depth, 1>>]>
					: InternalArrayFlat<Last, Depth, [...Result, ArrayItem]>
				: T extends Array<infer ArrayItem2>
					? Or<IsAny<ArrayItem2>, IsNever<ArrayItem2>> extends true
						? [...Result, ...ArrayItem2[]] // Return never/any[] when input is never/any[]
						: ArrayItem2 extends UnknownArray
							? InternalArrayFlat<ArrayItem2, Subtract<Depth, 1>, Result>
							: [...Result, ...ArrayItem2[]]
					: [...Result, ...T]
	: T;
