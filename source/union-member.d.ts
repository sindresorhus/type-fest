import type {UnionToIntersection} from './union-to-intersection.d.ts';
import type {IsNever} from './is-never.d.ts';

/**
Returns a member of a union type. Order is not guaranteed.

Returns `never` when the input is `never`.

@example
```
import type {UnionMember} from 'type-fest';

type Last = UnionMember<1 | 2 | 3>;
//=> 3

type LastNever = UnionMember<never>;
//=> never
```

@see https://github.com/microsoft/TypeScript/issues/13298#issuecomment-468375328

Use-cases:
- Implementing recursive type functions that accept a union type.
- Reducing a union one member at a time, for example when building tuples.

It can detect a termination case using {@link IsNever `IsNever`}.

@example
```
import type {UnionMember, IsNever} from 'type-fest';

type UnionToTuple<T, L = UnionMember<T>> =
	IsNever<T> extends false
		? [...UnionToTuple<Exclude<T, L>>, L]
		: [];
```

@category Type
*/
export type UnionMember<T> =
	IsNever<T> extends true
		? never
		: UnionToIntersection<T extends any ? () => T : never> extends () => (infer R)
			? R
			: never;

export {};
