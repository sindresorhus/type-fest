import type {Every} from './internal/array.js';

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
export type IsLowercase<S extends string> = Every<_IsLowercase<S>, true>;

type _IsLowercase<S extends string, Accumulator extends boolean[] = []> = S extends `${infer First}${infer Rest}`
	? _IsLowercase<Rest, [...Accumulator, IsLowercaseHelper<First>]>
	: [...Accumulator, IsLowercaseHelper<S>];

type IsLowercaseHelper<S extends string> = S extends Lowercase<string>
	? true
	: S extends Uppercase<string> | Capitalize<string> | `${string}${Uppercase<string>}${string}`
		? false
		: boolean;
