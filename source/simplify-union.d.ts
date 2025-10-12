import type tag from 'tagged-tag';

/**
Flattens a complex union type to make it more readable and improve editor IntelliSense.

This utility expands nested or intersected unions into a clearer, simplified form.
It’s especially helpful when dealing with inferred types or unions that include
functions, objects, or other complex members.

@example
```
import type {SimplifyUnion} from 'type-fest';

type U1 = 'a' | 0 | null | ['b', 1n];
type U2 = (() => void) | {[x: string]: number; b: number};

type UnSimplifiedUnion = U1 | U2;
//=> U1 | U2 <- obfuscated, hovering over the type doesn't show the underline types in the union.

type SimplifiedUnion = SimplifyUnion<UnSimplifiedUnion>;
//=> 0 | "a" | null | ['b', 1n] | (() => void) | {[x: string]: number; b: number}
```

@see {@link Simplify}
@category Union
*/
export type SimplifyUnion<Union> = {[Member in Union as typeof tag]: Member}[typeof tag];

export {};
