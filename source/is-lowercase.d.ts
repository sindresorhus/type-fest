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
export type IsLowercase<T extends string> = T extends Lowercase<T> ? true : false;
