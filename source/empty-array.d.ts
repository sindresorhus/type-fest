/**
Represents a strictly empty readonly array, the `[]` value.

When you annotate something as the type `unknown[]` or `any[]`, it can be any array, including a non-empty one. This means that you cannot use `unknown[]` or `any[]` to represent a strictly empty array.

Useful as a stable default value for props or state that must never contain items, for example, to avoid unnecessary re-renders in React caused by a fresh `[]` literal on every render, while keeping the type narrow enough to prevent items from being added by mistake.

@example
```
import type {EmptyArray} from 'type-fest';

// The following illustrates the problem with `unknown[]`.
const foo1: unknown[] = []; // Pass
const foo2: unknown[] = [1, 2, 3]; // Pass

// With `EmptyArray` only a strictly empty array is valid.
const bar1: EmptyArray = []; // Pass
// @ts-expect-error
const bar2: EmptyArray = [1, 2, 3]; // Fail
```

@example
```
import type {EmptyArray} from 'type-fest';

const DEFAULT_ITEMS: EmptyArray = [];

function getItems(items: readonly string[] = DEFAULT_ITEMS) {
	return items;
}
```

@category Array
*/
export type EmptyArray = readonly [];

/**
Returns a boolean for whether the type is strictly equal to an empty readonly array, the `[]` value.

@example
```
import type {IsEmptyArray} from 'type-fest';

type Pass = IsEmptyArray<[]>; //=> true
type Fail1 = IsEmptyArray<[1, 2, 3]>; //=> false
type Fail2 = IsEmptyArray<string[]>; //=> false
```

@see {@link EmptyArray}
@category Array
*/
export type IsEmptyArray<T> = T extends EmptyArray ? true : false;

export {};
