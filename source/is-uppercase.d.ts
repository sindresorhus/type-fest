/**
Returns a boolean for whether the given string literal is uppercase.

@example
```
import type {IsUppercase} from 'type-fest';

IsUppercase<'ABC'>;
//=> true

IsUppercase<'Abc'>;
//=> false

IsUppercase<string>;
//=> boolean
```
*/
export type IsUppercase<T extends string> = [T] extends [string]
	? string extends T
		? boolean
		: T extends T
			? T extends `${infer F}${infer R}`
				? F extends Uppercase<F>
					? IsUppercase<R>
					: false
				: true
			: boolean
	: never;
