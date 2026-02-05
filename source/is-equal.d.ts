import type {UniqueUnionDeep} from './internal/type.d.ts';

/**
Returns a boolean for whether the two given types are equal.

@link https://github.com/microsoft/TypeScript/issues/27024#issuecomment-421529650
@link https://stackoverflow.com/questions/68961864/how-does-the-equals-work-in-typescript/68963796#68963796

Use-cases:
- If you want to make a conditional branch based on the result of a comparison of two types.

@example
```
import type {IsEqual} from 'type-fest';

// This type returns a boolean for whether the given array includes the given item.
// `IsEqual` is used to compare the given array at position 0 and the given item and then return true if they are equal.
type Includes<Value extends readonly any[], Item> =
	Value extends readonly [Value[0], ...infer rest]
		? IsEqual<Value[0], Item> extends true
			? true
			: Includes<rest, Item>
		: false;
```

@category Type Guard
@category Utilities
*/
export type IsEqual<A, B> =
	[A, B] extends [B, A]
		? [A, B] extends [object, object]
			? _IsEqual<UniqueUnionDeep<A>, UniqueUnionDeep<B>>
			: _IsEqual<A, B>
		: false;

/**
Note that this doesn't regard the identical union/intersection type `T | T` and/or `T & T` as `T` recursively.
e.g., `{a: 0} | {a: 0}` and/or `{a: 0} & {a: 0}` as `{a: 0}`.

@example
```
type IDUnionIsTrue = _IsEqual<{a: {b: 0}} | {a: {b: 0}}, {a: {b: 0}}>;
//=> true
type RecurivelyIDUnionIsFalse = _IsEqual<{a: {b: 0} | {b: 0}}, {a: {b: 0}}>;
//=> false
```

This version fails the `equalWrappedTupleIntersectionToBeNeverAndNeverExpanded` test in `test-d/is-equal.ts`.
*/
type _IsEqual<A, B> =
	(<G>() => G extends A & G | G ? 1 : 2) extends
	(<G>() => G extends B & G | G ? 1 : 2)
		? true
		: false;

export {};
