import type {If} from './if.d.ts';
import type {IsNever} from './is-never.d.ts';

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
```

@see {@link Or}
*/
export type And<A extends boolean, B extends boolean> =
	_And<If<IsNever<A>, false, A>, If<IsNever<B>, false, B>>; // `never` is treated as `false`

export type _And<A extends boolean, B extends boolean> = A extends true
	? B extends true
		? true
		: false
	: false;
