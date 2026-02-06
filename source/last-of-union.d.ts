import type {IsNever} from './is-never.d.ts';
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
export type LastOfUnion<T> =
	true extends IsNever<T>
		? never
		: UnionToIntersection<T extends any ? () => T : never> extends () => (infer R)
			? R
			: never;

export {};
