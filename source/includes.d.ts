import {IsEqual} from './internal';

/**
Returns a boolean for whether the given array includes the given item.

This can be useful if another type wants to make a decision based on whether the array includes that item.

@example
```
import {Includes} from 'type-fest';

type hasRed<array extends any[]> = Includes<array, 'red'>;
```

@category Utilities
*/
export type Includes<Value extends readonly any[], Item> =
	IsEqual<Value[0], Item> extends true
		? true
		: Value extends [Value[0], ...infer rest]
			? Includes<rest, Item>
			: false;
