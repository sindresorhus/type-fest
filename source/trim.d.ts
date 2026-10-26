import type {UnwrapBrand, Whitespace} from './internal/index.d.ts';

/**
Remove spaces from the left side.
*/
// Inspect one character instead of matching every whitespace alternative at each step.
type TrimLeft<Value extends string> = Value extends `${infer First}${infer Rest}`
	? First extends Whitespace
		? TrimLeft<Rest>
		: Value
	: Value;

/**
Remove spaces from the right side.
*/
type TrimRight<V extends string> = V extends `${infer R}${Whitespace}` ? TrimRight<R> : V;

/**
Remove leading and trailing spaces from a string.

@example
```
import type {Trim} from 'type-fest';

type Example = Trim<' foo '>;
//=> 'foo'
```

@category String
@category Template literal
*/
export type Trim<V extends string> = TrimLeft<TrimRight<V extends object ? UnwrapBrand<V> : V>>;

export {};
