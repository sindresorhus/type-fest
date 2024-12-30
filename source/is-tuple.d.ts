import type {IfAny} from './if-any';
import type {IfNever} from './if-never';
import type {UnknownArray} from './unknown-array';

/**
@see {@link IsTuple}
*/
type IsTupleOptions = {
	/**
	Consider only fixed length arrays as tuples.

	- When set to `true`, arrays with rest elements (e.g., `[1, ...number[]]`) are _not_ considered as tuples.
	- When set to `false` (default), arrays with at least one non-rest element (e.g., `[1, ...number[]]`) are considered as tuples.

	@default false

	@example
	```ts
	import type {IsTuple} from 'type-fest';

	type Example1 = IsTuple<[number, ...number[]], {includeFixedLengthTuplesOnly: false}>;
	//=> true

	type Example2 = IsTuple<[number, ...number[]], {includeFixedLengthTuplesOnly: true}>;
	//=> false
	```
	*/
	includeFixedLengthTuplesOnly?: boolean;
};

/**
Returns a boolean for whether the given array is a tuple.

Use-case:
- If you want to make a conditional branch based on the result of whether an array is a tuple or not.

Note: `IsTuple` returns `boolean` when instantiated with a union of tuple and non-tuple (e.g., `IsTuple<[1, 2] | number[]>`).

@example
```ts
import type {IsTuple} from 'type-fest';

type Tuple = IsTuple<[1, 2, 3]>;
//=> true

type NotTuple = IsTuple<number[]>;
//=> false

type TupleWithOptionalItems = IsTuple<[1?, 2?]>;
//=> true

type RestItemsAllowed = IsTuple<[1, 2, ...number[]]>;
//=> true

type RestItemsNotAllowed = IsTuple<[1, 2, ...number[]], {includeFixedLengthTuplesOnly: true}>;
//=> false
```

@see {@link IsTupleOptions}

@category Type Guard
@category Utilities
*/
export type IsTuple<
	TArray extends UnknownArray,
	Options extends IsTupleOptions = {includeFixedLengthTuplesOnly: false},
> =
	IfAny<TArray, boolean, IfNever<TArray, false,
	TArray extends unknown // For distributing `TArray`
		? number extends TArray['length']
			? Options['includeFixedLengthTuplesOnly'] extends true
				? false
				: IfNever<keyof TArray & `${number}`, false, true>
			: true
		: false
	>>;
