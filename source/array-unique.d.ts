import type {IfNotAnyOrNever} from './internal/type.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

/**
Remove duplicate element types from an array, preserving their first occurrence.

Use-case: Deduplicate a static tuple of selected field names without losing their order.

Types are compared exactly. This describes type identity, not runtime value or object identity: two distinct strings or objects can have the same type. Use literal primitive tuples when modeling runtime deduplication.

Arrays and rest tuples widen to arrays of their element types. Optional tuple elements are unsupported and give `never`. The readonly modifier is preserved. Distributes over unions of arrays. Returns `any` for `any` and `never` for `never`.

Tuple intersections with brands or extra properties are unsupported.

@example
```
import type {ArrayUnique} from 'type-fest';

type Fields = ArrayUnique<['id', 'name', 'id']>;
//=> ['id', 'name']

type ReadonlyFields = ArrayUnique<readonly ['id', 'id']>;
//=> readonly ['id']
```

Each element is appended only if an exact match is not already in the result.

@category Array
*/
export type ArrayUnique<ArrayType extends UnknownArray> = IfNotAnyOrNever<ArrayType, {
	ifNot: ArrayType extends unknown
		? ArrayType extends Required<ArrayType>
			? ArrayType extends unknown[] ? Unique<ArrayType> : Readonly<Unique<ArrayType>>
			: never
		: never;
}>;

/**
Accumulates the first occurrence of each exact element type.

The accumulator has only required positions, so compare them directly without the optional and rest-element handling in `Includes`.
*/
type Unique<ArrayType extends UnknownArray, Result extends unknown[] = []> = number extends ArrayType['length']
	? Array<ArrayType[number]>
	: ArrayType extends readonly [infer First, ...infer Rest]
		? Unique<
			// Skip four adjacent duplicates at once to reduce tuple slicing and repeated accumulator lookups.
			Rest extends [infer Second, infer Third, infer Fourth, infer Fifth, ...infer Remaining]
				? IsEqual<[Second, Third, Fourth, Fifth], [First, First, First, First]> extends true ? Remaining : Rest
				: Rest,
			true extends {[Index in keyof Result]: IsEqual<Result[Index], First>}[number] ? Result : [...Result, First]
		>
		: Result;

export {};
