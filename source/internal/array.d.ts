import type {IfNever} from '../if-never';
import type {IsEqual} from '../is-equal';
import type {UnknownArray} from '../unknown-array';

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
export type IsArrayReadonly<T extends UnknownArray> = IfNever<T, false, T extends unknown[] ? false : true>;

/**
An if-else-like type that resolves depending on whether the given array is readonly.

@see {@link IsArrayReadonly}

@example
```
import type {ArrayTail} from 'type-fest';

type ReadonlyPreservingArrayTail<TArray extends readonly unknown[]> =
	ArrayTail<TArray> extends infer Tail
		? IfArrayReadonly<TArray, Readonly<Tail>, Tail>
		: never;

type ReadonlyTail = ReadonlyPreservingArrayTail<readonly [string, number, boolean]>;
//=> readonly [number, boolean]

type NonReadonlyTail = ReadonlyPreservingArrayTail<[string, number, boolean]>;
//=> [number, boolean]

type ShouldBeTrue = IfArrayReadonly<readonly unknown[]>;
//=> true

type ShouldBeBar = IfArrayReadonly<unknown[], 'foo', 'bar'>;
//=> 'bar'
```
*/
export type IfArrayReadonly<T extends UnknownArray, TypeIfArrayReadonly = true, TypeIfNotArrayReadonly = false> =
	IsArrayReadonly<T> extends infer Result
		? Result extends true ? TypeIfArrayReadonly : TypeIfNotArrayReadonly
		: never; // Should never happen

/**
Returns elements from the List that are equal to the SearchType.

@example
```
type StaticList = [string, 1, 'Hello', number, 2, 1, boolean, 4, 'bye'];
type B = FilterArrayIncludes<StaticList, number>;
//=> [1, number, 2, 1, 4]
type C = FilterArrayIncludes<StaticList, string>;
//=> [string, "Hello", "bye"]
type D = FilterArrayIncludes<StaticList, 1>;
//=> [1, 1]

// Note: Variable part in the array will discard all subsequent elements.
type VariableList = [string, 1, 'Hello', number, 2, ...string[], 1, boolean, 4, 'bye'];
type E = FilterArrayIncludes<VariableList, number>;
//=> [1, number, 2]
type F = FilterArrayIncludes<VariableList, string>;
//=> [string, "Hello"]
type G = FilterArrayIncludes<VariableList, 1>;
//=> [1]
```
@category Array
*/
export type FilterArrayIncludes<List extends unknown[], SearchType> = List extends []
	? []
	: StaticPartOfArray<List> extends [infer Head, ...infer Tail]
		? FilterArrayIncludes<Tail, SearchType> extends infer Return extends unknown[]
			? IsEqual<Head, SearchType> extends true
				? [Head, ...Return]
				: Return
			: never
		: never;

/**
Returns count of how many elements in the List are equal to the SearchType.

@uses
```
type CountInArray<...> = FilterArrayIncludes<List, SearchType>['length']
```

@example
```
type StaticList = [string, 1, 'Hello', number, 2, 1, boolean, 4, 'bye'];
type B = CountInArray<StaticList, number>;
//=> 5
type C = CountInArray<StaticList, string>;
//=> 3
type D = CountInArray<StaticList, 1>;
//=> 2

// Note: Variable part in the array will discard all subsequent elements.
type VariableList = [string, 1, 'Hello', number, 2, ...string[], 1, boolean, 4, 'bye'];
type E = CountInArray<VariableList, number>;
//=> 3
type F = CountInArray<VariableList, string>;
//=> 2
type G = CountInArray<VariableList, 1>;
//=> 1
```
@category Array
*/
export type CountInArray<List extends unknown[], SearchType> = FilterArrayIncludes<List, SearchType>['length'];
