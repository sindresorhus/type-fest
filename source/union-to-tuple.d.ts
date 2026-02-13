import type {IsNever} from './is-never.d.ts';
import type {ExcludeExactly} from './exclude-exactly.d.ts';
import type {UnionToIntersection} from './union-to-intersection.d.ts';

/**
Return a member of a union type. Order is not guaranteed.
Returns `never` when the input is `never`.

@see https://github.com/microsoft/TypeScript/issues/13298#issuecomment-468375328

Use-cases:
- Implementing recursive type functions that accept a union type.
- Reducing a union one member at a time, for example when building tuples.

It can detect a termination case using {@link IsNever `IsNever`}.

@example
```
import type {LastOfUnion, ExcludeExactly, IsNever} from 'type-fest';

export type UnionToTuple<T, L = LastOfUnion<T>> =
	IsNever<T> extends false
		? [...UnionToTuple<ExcludeExactly<T, L>>, L]
		: [];
```

@example
```
import type {LastOfUnion} from 'type-fest';

type Last = LastOfUnion<1 | 2 | 3>;
//=> 3

type LastNever = LastOfUnion<never>;
//=> never
```

@category Type
*/
type LastOfUnion<T> =
	true extends IsNever<T>
		? never
		: UnionToIntersection<T extends any ? () => T : never> extends () => (infer R)
			? R
			: never;

/**
Convert a union type into an unordered tuple type of its elements.

"Unordered" means the elements of the tuple are not guaranteed to be in the same order as in the union type. The arrangement can appear random and may change at any time.

This can be useful when you have objects with a finite set of keys and want a type defining only the allowed keys, but do not want to repeat yourself.

@example
```
import type {UnionToTuple} from 'type-fest';

type Numbers = 1 | 2 | 3;
type NumbersTuple = UnionToTuple<Numbers>;
//=> [1, 2, 3]
```

@example
```
import type {UnionToTuple} from 'type-fest';

const pets = {
	dog: '🐶',
	cat: '🐱',
	snake: '🐍',
};

type Pet = keyof typeof pets;
//=> 'dog' | 'cat' | 'snake'

const petList = Object.keys(pets) as UnionToTuple<Pet>;
//=> ['dog', 'cat', 'snake']
```

@category Array
*/
export type UnionToTuple<T, L = LastOfUnion<T>> =
IsNever<T> extends false
	? ExcludeExactly<T, L> extends infer E // Improve performance.
		? [...UnionToTuple<E>, L]
		: never // Unreachable.
	: [];

export {};
