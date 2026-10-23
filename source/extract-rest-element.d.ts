import type {SplitOnRestElement} from './split-on-rest-element.d.ts'; // For `@link`
import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {ExcludeRestElement} from './exclude-rest-element.d.ts'; // For `@link`

/**
Extract the [`rest`](https://www.typescriptlang.org/docs/handbook/2/objects.html#tuple-types) element type from an array.

@example
```
import type {ExtractRestElement} from 'type-fest';

type T1 = ExtractRestElement<[number, ...string[], string, 'foo']>;
//=> string

type T2 = ExtractRestElement<[...boolean[], string]>;
//=> boolean

type T3 = ExtractRestElement<[...Array<'foo'>, true]>;
//=> 'foo'

type T4 = ExtractRestElement<[number, string]>;
//=> never
```

@see {@link ExcludeRestElement}
@see {@link SplitOnRestElement}
@category Array
*/
export type ExtractRestElement<Array_ extends UnknownArray> = IfNotAnyOrNever<Array_, {ifNot: ExtractRestElementImplementation<Array_>}>;

/**
Peel fixed positions without building the unused tuple parts or their optional and readonly modifiers.
*/
type ExtractRestElementImplementation<Array_ extends UnknownArray> = Array_ extends unknown // For distributing `Array_`
	? '0' extends keyof Array_
		? Array_ extends readonly [unknown?, ...infer Rest]
			? ExtractRestElementImplementation<Rest>
			: never // Should never happen, since the first fixed element can always be matched.
		: Array_ extends readonly [...infer Rest, unknown]
			? ExtractRestElementImplementation<Rest>
			: Array_[number]
	: never;

export {};
