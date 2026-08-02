import type {If} from '../if.d.ts';
import type {IsEqual} from '../is-equal.d.ts';
import type {IsNever} from '../is-never.d.ts';
import type {OptionalKeysOf} from '../optional-keys-of.d.ts';
import type {UnknownArray} from '../unknown-array.d.ts';
import type {IsExactOptionalPropertyTypesEnabled, IfNotAnyOrNever} from './type.d.ts';

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
type ReadonlyStringArray = readonly string[];
type NormalStringArray = string[];

type ReadonlyResult = SetArrayAccess<NormalStringArray, true>;
//=> readonly string[]

type NormalResult = SetArrayAccess<ReadonlyStringArray, false>;
//=> string[]
```
*/
export type SetArrayAccess<T extends UnknownArray, IsReadonly extends boolean> =
	T extends readonly [...infer U]
		? IsReadonly extends true
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
export type CollapseRestElement<TArray extends UnknownArray> = IfNotAnyOrNever<TArray, {ifNot: _CollapseRestElement<TArray>}>;

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

/**
Returns elements from the List that are equal to the SearchType.

@example
```
type StaticList = [string, 1, 'Hello', number, 2, string, 1, boolean, 4, 1, 'bye'];
type A = FilterArrayExact<StaticList, number>;
//=> [number]
type B = FilterArrayExact<StaticList, string>;
//=> [string, string]
type C = FilterArrayExact<StaticList, 'Hello'>;
//=> ['Hello']
type D = FilterArrayExact<StaticList, 1>;
//=> [1, 1, 1]

// Note: Variable part in the array will discard all subsequent elements.
type VariableList = [string, number, 1, string, ...string[], number, 1, string, 2];
type E = FilterArrayExact<VariableList, number>;
//=> [number]
type F = FilterArrayExact<VariableList, string>;
//=> [string, string]
type G = FilterArrayExact<VariableList, 1>;
//=> [1]
type H = FilterArrayExact<VariableList, 2>;
//=> []
```
@category Array
*/
export type FilterArrayExact<List extends unknown[], SearchType> = List extends []
	? []
	: StaticPartOfArray<List> extends [infer Head, ...infer Tail]
		? FilterArrayExact<Tail, SearchType> extends infer Return extends unknown[]
			? IsEqual<SearchType, Head> extends true
				? [Head, ...Return]
				: Return
			: never
		: never;

/**
Returns count of how many elements in the List are equal to the SearchType.

@example
```
type StaticList = [string, 1, 'Hello', number, 2, string, 1, boolean, 4, 1, 'bye'];
type A = CountInArray<StaticList, number>;
//=> 1
type B = CountInArray<StaticList, string>;
//=> 2
type C = CountInArray<StaticList, 'Hello'>;
//=> 1
type D = CountInArray<StaticList, 1>;
//=> 3

// Note: Variable part in the array will discard all subsequent elements.
type VariableList = [string, number, 1, string, ...string[], number, 1, string, 2];
type E = CountInArray<VariableList, number>;
//=> 1
type F = CountInArray<VariableList, string>;
//=> 2
type G = CountInArray<VariableList, 1>;
//=> 1
type H = CountInArray<VariableList, 2>;
//=> 0
```
@category Array
*/
export type CountInArray<List extends unknown[], SearchType> = FilterArrayExact<List, SearchType>['length'];

export {};
