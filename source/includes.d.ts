import type {IsEqual} from './is-equal.d.ts';

/**
Returns a boolean for whether the given array includes the given item.

This can be useful if another type wants to make a decision based on whether the array includes that item.

Note: An optional element of a fixed-length tuple counts as present, so `Includes<[1?], 1>` is `true`. An array of unknown length is compared by its element type: `true` when every element is the item, `boolean` when only some can be, and `false` when none can. A tuple that has both an optional first element and a rest element is treated as an array of unknown length.

@example
```
import type {Includes} from 'type-fest';

type hasRed<array extends any[]> = Includes<array, 'red'>;
```

@category Array
*/
export type Includes<Value extends readonly any[], Item> =
	Value extends readonly [Value[0], ...infer rest]
		? IsEqual<Value[0], Item> extends true
			? true
			: Includes<rest, Item>
		// A tuple whose first element is optional is not matched by the pattern above, because a tuple with a leading rest element is not either. Peel one element off the front by hand, but only for a tuple of a known length, so the peel cannot run away on an array.
		: number extends Value['length']
			// A tuple with a leading rest element, such as `[...string[], 1]`, has no required first element, so its required elements are searched from the other end.
			? Value extends readonly [...infer head, infer last]
				? IsEqual<last, Item> extends true
					? true
					: Includes<head, Item>
				// An array of unknown length has no elements to walk, so the item is compared against the element type: `true` when every element matches, `false` when none can, and `boolean` in between.
				: [Item] extends [Value[number]]
					? IsEqual<Item, Value[number]> extends true
						? true
						: boolean
					: false
			: Value extends readonly []
				// An empty tuple has no elements left to search, so the item is definitely not there.
				? false
				: Value extends readonly [(infer First)?, ...infer rest]
					? IsEqual<First, Item> extends true
						? true
						: Includes<rest, Item>
					: false;

export {};
