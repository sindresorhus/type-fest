import type {Every} from './internal/array.js';

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
export type IsUppercase<S extends string> = Every<_IsUppercase<S>, true>;

type _IsUppercase<S extends string, Accumulator extends boolean[] = []> = S extends `${infer First}${infer Rest}`
	? _IsUppercase<Rest, [...Accumulator, IsUppercaseHelper<First>]>
	: [...Accumulator, IsUppercaseHelper<S>];

type IsUppercaseHelper<S extends string> = S extends Uppercase<string>
	? true
	: S extends Lowercase<string> | Uncapitalize<string> | `${string}${Lowercase<string>}${string}`
		? false
		: boolean;
