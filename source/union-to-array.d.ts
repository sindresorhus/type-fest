type _UnionToArray<T extends string> = {
	[K in T]: [...(Exclude<T, K> extends never ? [] : _UnionToArray<Exclude<T, K>>[Exclude<T, K>]), K]
}

/**
Creates an array of string literals that matches exactly the union type passed in.

Use-case:
- When you have a union of string literals but need an array containing all the elements of the union.

@example
```
import type {UnionToArray} from 'type-fest';

type Union = 'a' | 'b' | 'c' | 'd' | 'e' | 'f';

const array: UnionToArray<Union> = ['a', 'b', 'c', 'd', 'e', 'f'];
```

@category Array
*/
export type UnionToArray<T extends string> = _UnionToArray<T>[T]
