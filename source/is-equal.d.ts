/**
Returns a boolean for whether the two given types are equal.

@link https://github.com/microsoft/TypeScript/issues/27024#issuecomment-421529650
@link https://stackoverflow.com/questions/68961864/how-does-the-equals-work-in-typescript/68963796#68963796

@example
```
import type {IsEqual} from 'type-fest';

// `IsEqual` compares 1 and 1, then gets true as a result.
type ExpectTrue = IsEqual<1, 1>;
//=> true
```

@example
```
import type {IsEqual} from 'type-fest';

// `IsEqual` compares 2 and 1, then gets false as a result.
type ExpectFalse = IsEqual<2, 1>;
//=> false
```

@example
```
import type {IsEqual} from 'type-fest';

// `Includes` Returns a boolean for whether the given array includes the given item.
// `IsEqual` compares the given array of 0th and the given item, then return true if they are equal.
type Includes<Value extends readonly any[], Item> =
	Value extends readonly [Value[0], ...infer rest]
		? IsEqual<Value[0], Item> extends true
			? true
			: Includes<rest, Item>
		: false;
```

@category Utilities
*/
export type IsEqual<A, B> =
	(<G>() => G extends A ? 1 : 2) extends
	(<G>() => G extends B ? 1 : 2)
		? true
		: false;
