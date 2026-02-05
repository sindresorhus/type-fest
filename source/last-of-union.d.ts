import type {IsNever} from './is-never.d.ts';
import type {UnionToIntersection} from './union-to-intersection.d.ts';

/**
Returns the last element of a union type; otherwise returns `never` if `never` is passed.
Note that this is non-deterministic because the order of union members is not guaranteed.

@see https://github.com/microsoft/TypeScript/issues/13298#issuecomment-468375328

This can be used to implement a recursive type function that accepts a union type.
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
*/
export type LastOfUnion<T> =
	true extends IsNever<T>
		? never
		: UnionToIntersection<T extends any ? () => T : never> extends () => (infer R)
			? R
			: never;

export {};
