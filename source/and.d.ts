import type {IsTrue} from './internal/type.d.ts';
import type {Includes} from './includes.d.ts';
import type {IsAny} from './is-any.d.ts';

/**
Returns a boolean for whether two given types are both true.

Use-case: Constructing complex conditional types where multiple conditions must be satisfied.

@example
```
import type {And} from 'type-fest';

And<true, true>;
//=> true

And<true, false>;
//=> false

And<true, boolean>;
//=> never

And<false, boolean>;
//=> false

```

@see Or, AndAll
*/
export type And<A extends boolean, B extends boolean> = AndAll<[A, B]>;

/**
Returns a boolean for whether All given types are true.

Use-case: Constructing complex conditional types where multiple conditions must be satisfied.

@example
```
import type {AndAll} from 'type-fest';

AndAll<[true, true, true]>;
//=> true

AndAll<[true, false, true]>;
//=> false

AndAll<[true, boolean, true]>;
//=> never

AndAll<[false, boolean, true]>;
//=> false

```

@see And, OrAll
*/
export type AndAll<T extends boolean[]> = (
	IsAny<T[number]> extends false
		? IsTrue<T[number]> extends true
			? true
			: Includes<T, false> extends true
				? false
				: never
		: never
);
