/**
Removes spaces from the edges of a string.

@example
```
import {Trim} from 'type-fest';

Trim<' foo '> // -> 'foo';
```
*/
export type Trim<V extends string> = TrimLeft<TrimRight<V>>;

/** Removes spaces from the left side. */
type TrimLeft<V extends string> = V extends ` ${infer R}` ? TrimLeft<R> : V;

/** Removes spaces from the right side. */
type TrimRight<V extends string> = V extends `${infer R} ` ? TrimRight<R> : V;
