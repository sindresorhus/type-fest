import type {If} from '../if.d.ts';
import type {IsAny} from '../is-any.d.ts';
import type {IsNever} from '../is-never.d.ts';
import type {UnknownArray} from '../unknown-array.d.ts';
import type {IfNotAnyOrNever} from './type.d.ts';

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
Extract the element of an array that also works for array union.

Returns `never` if T is not an array.

It creates a type-safe way to access the element type of `unknown` type.
*/
export type ArrayElement<T> = T extends readonly unknown[] ? T[0] : never;

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
		? number extends T['length'] ?
			T extends readonly [infer U, ...infer V]
				? StaticPartOfArray<V, [...Result, U]>
				: Result
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
Returns the leading variable, non-fixed-length portion of the given middle spread array.
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
Returns a boolean for whether every element in an array type extends another type.

Note:
- This type is not designed to be used with non-tuple arrays (like `number[]`), tuples with optional elements (like `[1?, 2?, 3?]`), or tuples that contain a rest element (like `[1, 2, ...number[]]`).
- The `never` type does not match the target type unless the target type is `never` or `any`. For example, `Every<[never, never], never>` returns `true`, but `Every<[never, number], number>` returns `false`.

@example
```
import type {Every} from 'type-fest';

type A = Every<[1, 2, 3], number>;
//=> true

type B = Every<[1, 2, '3'], number>;
//=> false

type C = Every<[number, number | string], number>;
//=> boolean

type D = Every<[true, boolean, true], true>;
//=> boolean
```
*/
export type Every<TArray extends UnknownArray, Type> = IfNotAnyOrNever<TArray, If<IsAny<Type>, true,
	TArray extends readonly [infer First, ...infer Rest]
		? IsNever<First> extends true
			? IsNever<Type> extends true
				? Every<Rest, Type>
				: false
			: First extends Type
				? Every<Rest, Type>
				: false
		: true
>, false, false>;
