import type {IsMutuallyAssignable} from './is-mutually-assignable.d.ts'; // For `@link`

/**
Returns a boolean for whether the two given types are equal.

@see https://github.com/microsoft/TypeScript/issues/27024#issuecomment-421529650
@see https://stackoverflow.com/questions/68961864/how-does-the-equals-work-in-typescript/68963796#68963796

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

Note: An intersection of object types is not equal to the same type written as one object, so `IsEqual<{a: 0} & {b: 0}, {a: 0; b: 0}>` is `false`. Wrap both types in `Simplify`, or `SimplifyDeep` for nested intersections, to compare them as plain objects.

Note: Use {@link IsMutuallyAssignable} when you only need each type assignable to the other. It is weaker (it ignores `readonly` on properties) and cheaper.

@category Type Guard
@category Utilities
*/
export type IsEqual<A, B> =
	[A] extends [B]
		? [B] extends [A]
			? _IsEqual<A, B>
			: false
		: false;

/*
`IsEqual` above repeats the assignability check from `IsMutuallyAssignable` instead of calling it, because delegating fails the generic constraint in the `Assignability` test in `test-d/is-equal.ts` (issue #1305).
*/

// This version fails the `equalWrappedTupleIntersectionToBeNeverAndNeverExpanded` test in `test-d/is-equal.ts`.
type _IsEqual<A, B> =
	(<G>() => G extends A & G | G ? 1 : 2) extends
	(<G>() => G extends B & G | G ? 1 : 2)
		? true
		: false;

export {};
