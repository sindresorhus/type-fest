/**
Represents a strictly empty readonly array, implemented as the readonly empty tuple `readonly []`.

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

@see https://github.com/sindresorhus/type-fest/issues/929
@category Array
*/
export type EmptyArray = readonly [];

export {};
