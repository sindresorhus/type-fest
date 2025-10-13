import type {SplitOnRestElement} from './split-on-rest-element.d.ts';
import type {IsArrayReadonly} from './internal/array.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Create a tuple with the [`rest`](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types) element removed.

@example
```
import type {ExcludeRestElement} from 'type-fest';

type T1 = ExcludeRestElement<[number, ...string[], string, 'foo']>;
//=> [number, string, 'foo']

type T2 = ExcludeRestElement<[...boolean[], string]>;
//=> [string]

type T3 = ExcludeRestElement<[...'foo'[], true]>;
//=> [true]

type T4 = ExcludeRestElement<[number, string]>;
//=> [number, string]
```

@see ExtractRestElement, SplitOnRestElement
@category Array
*/
export type ExcludeRestElement<Array_ extends UnknownArray> =
	SplitOnRestElement<Array_> extends infer Result
		? Result extends readonly UnknownArray[]
			? IsArrayReadonly<Array_> extends true
				? Readonly<[...Result[0], ...Result[2]]>
				: [...Result[0], ...Result[2]]
			: Result
		: never;

export {};
