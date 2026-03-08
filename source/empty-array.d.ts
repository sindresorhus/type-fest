/**
Represents a strictly empty array, the `[]` value.

Use-cases:
- Declaring a stable default value for an array parameter to avoid re-renders in React.
- Clearly expressing the intent of an empty array, similar to how {@link EmptyObject} is used for `{}`.

@example
```
import type {EmptyArray} from 'type-fest';

const defaultItems: EmptyArray = [];

// Prevents accidental mutation
// @ts-expect-error
defaultItems.push(1);
```

@category Array
*/
export type EmptyArray = [];

/**
Returns a `boolean` for whether the given array type is an empty array (`[]`).

@example
```
import type {IsEmptyArray} from 'type-fest';

type A = IsEmptyArray<[]>; //=> true
type B = IsEmptyArray<readonly []>; //=> true
type C = IsEmptyArray<[1, 2, 3]>; //=> false
type D = IsEmptyArray<string[]>; //=> false
```

@see {@link EmptyArray}
@category Array
*/
export type IsEmptyArray<T extends readonly unknown[]> =
	[T] extends [never]
		? false
		: T extends readonly [unknown, ...unknown[]]
			? false
			: number extends T['length']
				? [T[number]] extends [never] ? true : false
				: T['length'] extends 0
					? true
					: false;

export {};
