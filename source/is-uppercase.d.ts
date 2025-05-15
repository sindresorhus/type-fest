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
export type IsUppercase<T extends string> = T extends Uppercase<T> ? true : false;
