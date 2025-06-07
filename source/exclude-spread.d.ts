import type {IsArrayReadonly} from './internal/array.d.ts';
import type {SplitOnSpread} from './split-on-spread.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Create a tuple with the spread element removed.

@example
```
import type {ExcludeSpread} from 'type-fest';

type T1 = ExcludeSpread<[number, ...string[], string, 'foo']>;
// => [number, string, 'foo']

type T2 = ExcludeSpread<[...boolean[], string]>;
// => [string]

type T3 = ExcludeSpread<[...'foo'[], true]>;
// => [true]

type T4 = ExcludeSpread<[number, string]>;
// => [number, string]
```

@author benzaria
@see ExtractSpread, SplitOnSpread
@category Array
*/
export type ExcludeSpread<Array_ extends UnknownArray> =
	SplitOnSpread<Array_> extends infer Result
		? Result extends UnknownArray[]
			? IsArrayReadonly<Array_> extends true
				? Readonly<[...Result[0], ...Result[2]]>
				: [...Result[0], ...Result[2]]
			: Result // `never` or `any`
		: never;
