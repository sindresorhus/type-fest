import type {IsArrayReadonly, MaxLength, StaticPartOfArray, VariablePartOfArray} from './internal/index.d.ts';
import type {GreaterThanOrEqual} from './greater-than-or-equal.d.ts';
import type {Subtract} from './subtract.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';
import type {TupleOf} from './tuple-of.d.ts';
import type {Absolute} from './absolute.d.ts';
import type {IsNegative} from './numeric.d.ts';

/**
The implementation of `SplitArrayByIndex` for fixed length arrays.
*/
type SplitFixedArrayByIndex<T extends UnknownArray, SplitIndex extends number> =
	SplitIndex extends 0
		? [[], T]
		// `splice` clamps an index past the end of the array to the end. Checked before the `TupleOf` match, because `TupleOf` cannot build a huge or infinite index.
		: GreaterThanOrEqual<SplitIndex, MaxLength<T>> extends true
			? [T, []]
			// `TupleOf` of a negative index is `[]`, so `splice` removing nothing for a negative index or delete count falls out of the match.
			: T extends readonly [...TupleOf<SplitIndex>, ...infer V]
				? T extends readonly [...infer U, ...V]
					? [U, V]
					: [never, never]
				// A tuple with optional elements has no single length, so the pattern above never matches; peel one element at a time instead.
				: PeelFixedArrayByIndex<T, SplitIndex>;

/**
Moves `SplitIndex` elements off the front of a tuple, keeping the `?` modifier on each one.
*/
type PeelFixedArrayByIndex<
	T extends UnknownArray,
	SplitIndex extends number,
	Head extends UnknownArray = [],
	Counter extends unknown[] = [],
> =
	Counter['length'] extends SplitIndex
		? [Head, T]
		: T extends readonly []
			? never // Only a fractional index runs past the end, since the caller clamps the index to the length
			: PeelFirstElement<T> extends [infer First extends UnknownArray, infer Rest extends UnknownArray]
				? PeelFixedArrayByIndex<Rest, SplitIndex, [...Head, ...First], [...Counter, unknown]>
				: never; // Should never happen, since `PeelFirstElement` always returns a pair

/**
Splits off the first element of a tuple, keeping its `?` modifier.
*/
type PeelFirstElement<T extends UnknownArray> =
	T extends readonly [(infer First)?, ...infer Rest]
		// A tuple allows fewer than one element only when its first element is optional.
		? [T extends readonly [unknown, ...unknown[]] ? [First] : [First?], Rest]
		: never; // Should never happen, since `[(infer F)?, ...infer R]` is a top-type for arrays

/**
The implementation of `SplitArrayByIndex` for variable length arrays.
*/
type SplitVariableArrayByIndex<T extends UnknownArray,
	SplitIndex extends number,
	T1 = Subtract<SplitIndex, StaticPartOfArray<T>['length']>,
	T2 = T1 extends number
		? TupleOf<GreaterThanOrEqual<T1, 0> extends true ? T1 : number, VariablePartOfArray<T>[number]>
		: [],
> =
	SplitIndex extends 0
		? [[], T]
		: GreaterThanOrEqual<StaticPartOfArray<T>['length'], SplitIndex> extends true
			? [
				SplitFixedArrayByIndex<StaticPartOfArray<T>, SplitIndex>[0],
				[
					...SplitFixedArrayByIndex<StaticPartOfArray<T>, SplitIndex>[1],
					...VariablePartOfArray<T>,
				],
			]
			: [
				[
					...StaticPartOfArray<T>,
					...(T2 extends UnknownArray ? T2 : []),
				],
				VariablePartOfArray<T>,
			];

/**
Split the given array `T` by the given `SplitIndex`.

@example
```
type A = SplitArrayByIndex<[1, 2, 3, 4], 2>;
//=> [[1, 2], [3, 4]];

type B = SplitArrayByIndex<[1, 2, 3, 4], 0>;
//=> [[], [1, 2, 3, 4]];
```
*/
type SplitArrayByIndex<T extends UnknownArray, SplitIndex extends number> =
	SplitIndex extends 0
		? [[], T]
		: number extends T['length']
			? SplitVariableArrayByIndex<T, SplitIndex>
			: SplitFixedArrayByIndex<T, SplitIndex>;

/**
The implementation of {@link ArraySplice} once the start index has been resolved.
*/
type ArraySpliceImplementation<
	T extends UnknownArray,
	Start extends number,
	DeleteCount extends number,
	Items extends UnknownArray,
> =
	SplitArrayByIndex<T, Start> extends [infer U extends UnknownArray, infer V extends UnknownArray]
		? SplitArrayByIndex<V, DeleteCount> extends [infer _Deleted extends UnknownArray, infer X extends UnknownArray]
			? [...U, ...Items, ...X]
			: never // Should never happen
		: never; // Should never happen

/**
Create a new array type by adding or removing elements at a specified index range in the original array.

Use-case: Replace or insert items in an array type.

Like [`Array#splice()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/splice) but for types.

Known limitations:
- A tuple with optional elements has no single length, so a start index at or past the optional element is resolved against the longest one, and the optional element is then promoted to a required one that carries `| undefined`, which is what TypeScript's own tuple spread does with it. `ArraySplice<[1, 2?], 2, 0, [9]>` is `[1, (2 | undefined), 9]`, where `splice()` gives `[1, 9]` or `[1, 2, 9]`. A start index before the optional element is unaffected, because the optional element stays last. A negative start index is resolved against the longest length too, and a fractional negative start index is not supported.
- A start index inside a rest element is resolved by materialising that many rest elements, so the result claims a minimum length the input never promised. `ArraySplice<[string, ...Array<number>], 3, 1>` is `[string, number, number, ...Array<number>]`, which rejects `[string]`, and `splice(3, 1)` on `[string]` is a no-op. The alternative of leaving the rest whole would drop the fixed elements after a rest in the middle of a tuple, which is worse.
- A tuple with a leading rest element, such as `[...string[], 1, 2]`, splits incorrectly once the start index is past `0`, because its fixed part is at the other end of the tuple.

@example
```
import type {ArraySplice} from 'type-fest';

type SomeMonths0 = ['January', 'April', 'June'];
type Months0 = ArraySplice<SomeMonths0, 1, 0, ['Feb', 'March']>;
//=> ['January', 'Feb', 'March', 'April', 'June']

type SomeMonths1 = ['January', 'April', 'June'];
type Months1 = ArraySplice<SomeMonths1, 1, 1>;
//=> ['January', 'June']

type SomeMonths2 = ['January', 'Foo', 'April'];
type Months2 = ArraySplice<SomeMonths2, 1, 1, ['Feb', 'March']>;
//=> ['January', 'Feb', 'March', 'April']
```

A negative `Start` counts backwards from the end of the array, the same way `splice()` does, and is clamped to `0` when it points before the start.

@example
```
import type {ArraySplice} from 'type-fest';

type Months3 = ArraySplice<['January', 'April', 'June'], -1, 1>;
//=> ['January', 'April']

type Months4 = ArraySplice<['January', 'April', 'June'], -10, 1>;
//=> ['April', 'June']
```

@category Array
*/
export type ArraySplice<
	T extends UnknownArray,
	Start extends number,
	DeleteCount extends number,
	Items extends UnknownArray = [],
> =
	// `splice` returns a fresh array, but a `readonly` input keeps its `readonly` modifier, so the modifier is decided per member rather than once for the whole union.
	T extends unknown // For distributing `T`
		? IsArrayReadonly<T> extends true
			? Readonly<_ArraySplice<T, Start, DeleteCount, Items>>
			: _ArraySplice<T, Start, DeleteCount, Items>
		: never; // Should never happen

type _ArraySplice<
	T extends UnknownArray,
	Start extends number,
	DeleteCount extends number,
	Items extends UnknownArray,
> =
	// The start is distributed before the sign is asked, because the sign of a union of a negative and a positive member is `boolean`, which would send the negative member down the plain-index path. `ArraySlice` distributes for the same reason.
	Start extends unknown
		// A non-literal index or delete count can be any value, so only the element types are known, the same as `ArraySlice` answers.
		? number extends Start | DeleteCount
			? Array<T[number] | Items[number]>
			// A negative start index counts backwards from the end of the array, which is only known when the length is static.
			: IsNegative<Start> extends true
				? number extends T['length']
					? Array<T[number] | Items[number]>
					// A start that points before the beginning is clamped to `0` before `Subtract` is asked, because `Subtract` has no answer for a number in exponential notation, like `-1e21`.
					: GreaterThanOrEqual<Absolute<Start>, MaxLength<T>> extends true
						? ArraySpliceImplementation<T, 0, DeleteCount, Items>
						: ArraySpliceImplementation<T, Subtract<MaxLength<T>, Absolute<Start>>, DeleteCount, Items>
				: ArraySpliceImplementation<T, Start, DeleteCount, Items>
		: never; // Should never happen, since the start is distributed just above

export {};
