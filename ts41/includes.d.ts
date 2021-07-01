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
export type Includes<Value extends any[], Item> = {
	[P in keyof Value & number as Value[P]]: true;
}[Item] extends true
	? true
	: false;
