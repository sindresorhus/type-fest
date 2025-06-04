import type {UnknownArray} from './unknown-array.d.ts';
import type {IndicesOf} from './indices-of.d.ts';

/**
Returns the count of occurrences of a value in an array, or `0` if it is not present.

@example
```
type T = CountOf<[1, 2, 1, 1], 1>;
//=> 3

declare function getCount<const T extends unknown[], const I>(array: T, item: I): CountOf<T, I>;
getCount(['a', 'b', 'a'], 'a');
//=> 2 instead of `number`
```

@author benzaria
@see Includes
@category Array
*/
export type CountOf<Array_ extends UnknownArray, Item, FromIndex extends number = 0> =
	IndicesOf<Array_, Item, FromIndex> extends infer Indices extends number[]
		? Indices['length']
		: 0;
