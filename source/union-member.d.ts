import type {UnionToIntersection} from './union-to-intersection.d.ts';
import type {IsNever} from './is-never.d.ts';

/**
Returns an arbitrary member of a union type.

Returns `never` when the input is `never`.

@example
```
import type {UnionMember} from 'type-fest';

type Last = UnionMember<1 | 2 | 3>;
//=> 3

type LastNever = UnionMember<never>;
//=> never
```

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
