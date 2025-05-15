/**
Returns a boolean for whether the given string literal is lowercase.

@example
```
import type {IsLowercase} from 'type-fest';

IsLowercase<'abc'>;
//=> true

IsLowercase<'Abc'>;
//=> false

IsLowercase<string>;
//=> boolean
```
*/
export type IsLowercase<T extends string> = [T] extends [string]
	? string extends T
		? boolean
		: T extends T
			? T extends `${infer F}${infer R}`
				? F extends Lowercase<F>
					? IsLowercase<R>
					: false
				: true
			: boolean
	: never;
