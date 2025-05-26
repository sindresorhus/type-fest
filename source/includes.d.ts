import type { UnknownArray } from './unknown-array.d.ts';
import type {Extends, Not} from './internal/type.d.ts';
import type {IndexOf} from './index-of.d.ts';

/**
Returns a boolean for whether the given array includes the given item.

This can be useful if another type wants to make a decision based on whether the array includes that item.

@example
```
import type {Includes} from 'type-fest';

type hasRed<array extends any[]> = Includes<array, 'red'>;
```

@category Array
*/
export type Includes<Array_ extends UnknownArray, Item, FromIndex extends number = 0> = 
	Not<Extends<IndexOf<Array_, Item, FromIndex>, -1>>
