import type {IsFalse} from './internal/type.d.ts';
import type {Includes} from './includes.d.ts';
import type {IsAny} from './is-any.d.ts';

/**
Returns a boolean for whether either of two given types are true.

Use-case: Constructing complex conditional types where multiple conditions must be satisfied.

@example
```
import type {Or} from 'type-fest';

Or<true, false>;
//=> true

Or<false, false>;
//=> false

Or<true, boolean>;
//=> true

Or<false, booelan>;
//=> never

```

@see And, OrAll
*/
export type Or<A extends boolean, B extends boolean> = OrAll<[A, B]>;

/**
Returns a boolean for whether either of All given types are true.

Use-case: Constructing complex conditional types where multiple conditions must be satisfied.

@example
```
import type {OrAll} from 'type-fest';

OrAll<[true, false, true]>;
//=> true

OrAll<[false, false, false]>;
//=> false

OrAll<[true, boolean, true]>;
//=> true

OrAll<[false, boolean, true]>;
//=> never

```

@see Or, AndAll
*/
export type OrAll<T extends boolean[]> = (
	IsAny<T[number]> extends false
		? IsFalse<T[number]> extends true
			? false
			: Includes<T, true> extends true
				? true
				: never
		: never
);
