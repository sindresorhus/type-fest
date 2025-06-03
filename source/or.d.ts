import type {If} from './if.d.ts';
import type {IsNever} from './is-never.d.ts';

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
```

@see {@link And}
*/
export type Or<A extends boolean, B extends boolean> =
	_Or<If<IsNever<A>, false, A>, If<IsNever<B>, false, B>>; // `never` is treated as `false`

export type _Or<A extends boolean, B extends boolean> = A extends true
	? true
	: B extends true
		? true
		: false;
