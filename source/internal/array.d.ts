import type {If} from '../if.d.ts';
import type {IsNever} from '../is-never.d.ts';
import type {OptionalKeysOf} from '../optional-keys-of.d.ts';
import type {IsEqual} from '../is-equal.d.ts';
import type {UnknownArray} from '../unknown-array.d.ts';
import type {IsExactOptionalPropertyTypesEnabled, IfNotAnyOrNever} from './type.d.ts';

/**
Infer the length of the given array `<T>`.

@link https://itnext.io/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f
*/
type ArrayLength<T extends readonly unknown[]> = T extends {readonly length: infer L} ? L : never;

/**
Matches any unknown array or tuple.
*/
export type UnknownArrayOrTuple = readonly [...unknown[]];
// TODO: should unknown-array be updated?

/**
Extracts the type of the first element of an array or tuple.
*/
export type FirstArrayElement<TArray extends UnknownArrayOrTuple> = TArray extends readonly [infer THead, ...unknown[]]
	? THead
	: never;

/**
Returns if the given array is a leading spread array.

@example
```
type A = [...string[], number, boolean];
type B = IsLeadingSpreadArray<A>;
//=> true
```
*/
export type IsLeadingSpreadArray<T extends UnknownArray> =
number extends ArrayLength<T>
	? T extends readonly [infer K, ...infer U, infer V]
		? false
		: T extends readonly [...infer U, infer V]
			? true
			: false
	: false;

/**
Returns if the given array is a trailing spread array.

@example
```
type A = [1, ...string[]];
type B = IsTrailingSpreadArray<A>;
//=> true
```
*/
export type IsTrailingSpreadArray<T extends UnknownArray> =
number extends ArrayLength<T>
	? T extends readonly [infer K, ...infer U, infer V]
		? false
		: T extends readonly [infer U, ...infer V]
			? true
			: false
	: false;

/**
Returns if the given array is a middle spread array.

@example
```
type A = [1, ...string[], 3];
type B = IsMiddleSpreadArray<A>;
//=> true
```
*/
export type IsMiddleSpreadArray<T extends UnknownArray> =
number extends ArrayLength<T>
	? T extends readonly [infer K, ...infer U, infer V]
		? true
		: false
	: false;

/**
Returns the required part of the given array.

@example
```
type A = [string, number, boolean?];
type B = RequiredPartOfStaticArray<A>;
//=> [string, number]
```
 */
export type RequiredPartOfStaticArray<T extends UnknownArray> =
	T extends readonly [infer U, ...infer V]
		? [U, ...RequiredPartOfStaticArray<V>]
		: [];

/**
Returns the optional part of the given array.

@example
```
type A = [string, number, boolean?];
type B = OptionalPartOfStaticArray<A>;
//=> [boolean?]
```
 */
export type OptionalPartOfStaticArray<T extends UnknownArray> =
	T extends readonly [...RequiredPartOfStaticArray<T>, ...infer U]
		? U
		: [];

/**
Returns the static, fixed-length portion of the given array, excluding variable-length parts.

@example
```
type A = [string, number, boolean, ...string[]];
type B = StaticPartOfArray<A>;
//=> [string, number, boolean]
```
*/
export type StaticPartOfArray<T extends UnknownArray, Result extends UnknownArray = []> =
	T extends unknown
		? number extends T['length']
			? T extends readonly [infer U, ...infer V]
				? StaticPartOfArray<V, [...Result, U]>
				// Handle optional spread array like `[boolean?, ...string[]]`
				: IsEqual<T[0], T[1]> extends true
					? Result
					: [...Result, Required<T>[0]?]
			: T
		: never; // Should never happen

/**
Returns the variable, non-fixed-length portion of the given array, excluding static-length parts.

@example
```
type A = [string, number, boolean, ...string[]];
type B = VariablePartOfArray<A>;
//=> string[]
```
*/
export type VariablePartOfArray<T extends UnknownArray> =
	T extends unknown
		? T extends readonly [...StaticPartOfArray<T>, ...infer U]
			? U
			: []
		: never; // Should never happen

/**
Returns the static, fixed-length portion of the given leading spread array.
@example
```
type A = [...string[], number, boolean];
type B = StaticPartOfLeadingSpreadArray<A>;
//=> [number, boolean]
```
*/
export type StaticPartOfLeadingSpreadArray<T extends UnknownArray, Result extends UnknownArray = []> =
	T extends readonly [...infer U, infer V]
		? StaticPartOfLeadingSpreadArray<U, [V, ...Result]>
		: Result;

/**
Returns the variable, non-fixed-length portion of the given leading spread array.
@example
```
type A = [...string[], number, boolean];
type B = VariablePartOfLeadingSpreadArray<A>;
//=> string[]
```
*/
export type VariablePartOfLeadingSpreadArray<T extends UnknownArray> =
	T extends readonly [...infer U, ...StaticPartOfLeadingSpreadArray<T>]
		? U
		: never;

/**
Returns the trailing static, fixed-length portion of the given middle spread array.
*/
export type TrailingStaticPartOfMiddleSpreadArray<T extends UnknownArray> = StaticPartOfLeadingSpreadArray<T>;

/**
Returns the leading static, fixed-length portion of the given middle spread array.
*/
export type LeadingStaticPartOfMiddleSpreadArray<T extends UnknownArray, Result extends UnknownArray = []> =
	T extends readonly [infer U, ...infer V]
		? LeadingStaticPartOfMiddleSpreadArray<V, [...Result, U]>
		: Result;

/**
Returns the trailing variable, non-fixed-length portion of the given middle spread array.
*/
export type VariablePartOfMiddleSpreadArray<
	T extends UnknownArray,
	LeadingStaticPart extends UnknownArray = LeadingStaticPartOfMiddleSpreadArray<T>,
	TrailingStaticPart extends UnknownArray = TrailingStaticPartOfMiddleSpreadArray<T>,
> =
	T extends readonly [...LeadingStaticPart, ...infer U, ...TrailingStaticPart]
		? U
		: never;

/**
Set the given array to readonly if `IsReadonly` is `true`, otherwise set the given array to normal, then return the result.

@example
```
type ReadonlyArray = readonly string[];
type NormalArray = string[];

type ReadonlyResult = SetArrayAccess<NormalArray, true>;
//=> readonly string[]

type NormalResult = SetArrayAccess<ReadonlyArray, false>;
//=> string[]
```
*/
export type SetArrayAccess<T extends UnknownArray, IsReadonly extends boolean> =
T extends readonly [...infer U] ?
	IsReadonly extends true
		? readonly [...U]
		: [...U]
	: T;

/**
Returns whether the given array `T` is readonly.
*/
export type IsArrayReadonly<T extends UnknownArray> = If<IsNever<T>, false, T extends unknown[] ? false : true>;

/**
Transforms a tuple type by replacing it's rest element with a single element that has the same type as the rest element, while keeping all the non-rest elements intact.

@example
```
type A = CollapseRestElement<[string, string, ...number[]]>;
//=> [string, string, number]

type B = CollapseRestElement<[...string[], number, number]>;
//=> [string, number, number]

type C = CollapseRestElement<[string, string, ...Array<number | bigint>]>;
//=> [string, string, number | bigint]

type D = CollapseRestElement<[string, number]>;
//=> [string, number]
```

Note: Optional modifiers (`?`) are removed from elements unless the `exactOptionalPropertyTypes` compiler option is disabled. When disabled, there's an additional `| undefined` for optional elements.

@example
```
// `exactOptionalPropertyTypes` enabled
type A = CollapseRestElement<[string?, string?, ...number[]]>;
//=> [string, string, number]

// `exactOptionalPropertyTypes` disabled
type B = CollapseRestElement<[string?, string?, ...number[]]>;
//=> [string | undefined, string | undefined, number]
```
*/
export type CollapseRestElement<TArray extends UnknownArray> = IfNotAnyOrNever<TArray, _CollapseRestElement<TArray>>;

type _CollapseRestElement<
	TArray extends UnknownArray,
	ForwardAccumulator extends UnknownArray = [],
	BackwardAccumulator extends UnknownArray = [],
> =
	TArray extends UnknownArray // For distributing `TArray`
		? keyof TArray & `${number}` extends never
			// Enters this branch, if `TArray` is empty (e.g., []),
			// or `TArray` contains no non-rest elements preceding the rest element (e.g., `[...string[]]` or `[...string[], string]`).
			? TArray extends readonly [...infer Rest, infer Last]
				? _CollapseRestElement<Rest, ForwardAccumulator, [Last, ...BackwardAccumulator]> // Accumulate elements that are present after the rest element.
				: TArray extends readonly []
					? [...ForwardAccumulator, ...BackwardAccumulator]
					: [...ForwardAccumulator, TArray[number], ...BackwardAccumulator] // Add the rest element between the accumulated elements.
			: TArray extends readonly [(infer First)?, ...infer Rest]
				? _CollapseRestElement<
					Rest,
					[
						...ForwardAccumulator,
						'0' extends OptionalKeysOf<TArray>
							? If<IsExactOptionalPropertyTypesEnabled, First, First | undefined> // Add `| undefined` for optional elements, if `exactOptionalPropertyTypes` is disabled.
							: First,
					],
					BackwardAccumulator
				>
				: never // Should never happen, since `[(infer First)?, ...infer Rest]` is a top-type for arrays.
		: never; // Should never happen

export {};
