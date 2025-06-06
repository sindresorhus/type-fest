import type {SplitOnSpread} from './split-on-spread.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Returns the spread element type from an array.

@example
```
import type {ExtractSpread} from 'type-fest';

type T1 = ExtractSpread<[number, ...string[], string, 'foo']>;
// => string

type T2 = ExtractSpread<[...boolean[], string]>;
// => boolean

type T3 = ExtractSpread<[...'foo'[], true]>;
// => 'foo'

type T4 = ExtractSpread<[number, string]>;
// => never
```

@author benzaria
@see ExcludeSpread, SplitOnSpread
@category Array
*/
export type ExtractSpread<T extends UnknownArray> =
	SplitOnSpread<T>[1] extends infer Result extends UnknownArray
		? Result extends readonly []
			? never
			: Result[number]
		: never;
