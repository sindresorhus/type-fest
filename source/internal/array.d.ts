import type {If} from '../if.d.ts';
import type {IsEqual} from '../is-equal.d.ts';
import type {IsNever} from '../is-never.d.ts';
import type {UnknownArray} from '../unknown-array.d.ts';
import type {IsExactOptionalPropertyTypesEnabled, IfNotAnyOrNever} from './type.d.ts';

/**
Extracts the type of the first element of an array or tuple.
*/
export type FirstArrayElement<TArray extends UnknownArray> = TArray extends readonly [infer THead, ...unknown[]]
	? THead
	// A tuple whose elements are all optional has no required first element, but it still has a first element.
	: '0' extends keyof TArray
		? TArray extends readonly [(infer THead)?, ...unknown[]]
			? THead
			: never
		: never;

/**
Returns the static, fixed-length portion of the given array, excluding variable-length parts.

Known limitations:
- A tuple with a leading rest element, such as `[...string[], 1, 2]`, has its fixed part at the other end, which this does not reach, so the result is `[]` rather than `[1, 2]`.

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

Known limitations:
- A tuple with a leading rest element, such as `[...string[], 1, 2]`, is returned whole rather than reduced to `string[]`, because the fixed part is at the other end. See {@link StaticPartOfArray}.

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
The largest length the array can have, including its optional elements.

`T['length']` is a union such as `1 | 2` for `[string, number?]`, which breaks index arithmetic that needs a single length.

@example
```
type A = MaxLength<[string, number?]>;
//=> 2
```
*/
export type MaxLength<Array_ extends UnknownArray> = Required<Array_>['length'];

/**
Returns whether the given array has no statically known element at either end, so it can be shorter than any given index.

@example
```
type A = HasNoStaticElements<string[]>;
//=> true

type B = HasNoStaticElements<[...string[], 1, 2]>;
//=> false

type C = HasNoStaticElements<[1, 2, ...string[]]>;
//=> false
```
*/
export type HasNoStaticElements<Array_ extends UnknownArray> = Array_ extends readonly [unknown, ...unknown[]]
	? false
	: Array_ extends readonly [...unknown[], unknown]
		? false
		: true;

/**
Returns whether the given array is an array of unknown length, such as `string[]`, rather than a tuple. A tuple with a rest element still has fixed elements, so it is not one.

@example
```
type A = IsArrayOfUnknownLength<string[]>;
//=> true

type B = IsArrayOfUnknownLength<[1?, ...string[]]>;
//=> false

type C = IsArrayOfUnknownLength<[...string[], 1]>;
//=> false
```
*/
export type IsArrayOfUnknownLength<Array_ extends UnknownArray> = number extends Array_['length']
	? '0' extends keyof Array_
		? false
		: Array_ extends readonly [...unknown[], unknown]
			? false
			: true
	: false;

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
		? '0' extends keyof TArray
			// Enters this branch, if `TArray` starts with a non-rest element (e.g., `[string, number]` or `[string, ...number[]]`).
			? TArray extends readonly [(infer First)?, ...infer Rest]
				? _CollapseRestElement<
					Rest,
					[
						...ForwardAccumulator,
						// A tuple allows fewer than one element only when its first element is optional. Written in exactly this shape because equivalent ones, such as `[] extends TArray`, are several times slower.
						TArray extends readonly [unknown, ...unknown[]]
							? First
							: If<IsExactOptionalPropertyTypesEnabled, First, First | undefined>, // Add `| undefined` for optional elements, if `exactOptionalPropertyTypes` is disabled.
					],
					BackwardAccumulator
				>
				: never // Should never happen, since `[(infer First)?, ...infer Rest]` is a top-type for arrays.
			// Enters this branch, if `TArray` is empty (e.g., []),
			// or `TArray` contains no non-rest elements preceding the rest element (e.g., `[...string[]]` or `[...string[], string]`).
			: TArray extends readonly [...infer Rest, infer Last]
				? _CollapseRestElement<Rest, ForwardAccumulator, [Last, ...BackwardAccumulator]> // Accumulate elements that are present after the rest element.
				: TArray extends readonly []
					? [...ForwardAccumulator, ...BackwardAccumulator]
					: [...ForwardAccumulator, TArray[number], ...BackwardAccumulator] // Add the rest element between the accumulated elements.
		: never; // Should never happen

/**
Returns the elements of the given list that are exactly equal to the given search type.

Note: The variable part of the list and everything after it is ignored.

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
*/
export type FilterArrayExact<List extends UnknownArray, SearchType> = List extends readonly []
	? []
	: StaticPartOfArray<List> extends readonly [infer Head, ...infer Tail]
		? FilterArrayExact<Tail, SearchType> extends infer Return extends unknown[]
			? IsEqual<SearchType, Head> extends true
				? [Head, ...Return]
				: Return
			: never
		: [];

/**
Returns the count of elements in the given list that are exactly equal to the given search type.

Note: The variable part of the list and everything after it is ignored.

@example
```
type StaticList = [string, 1, 'Hello', number, 2, string, 1, boolean, 4, 1, 'bye'];

type A = CountExactInArray<StaticList, number>;
//=> 1

type B = CountExactInArray<StaticList, string>;
//=> 2

type C = CountExactInArray<StaticList, 1>;
//=> 3

type VariableList = [string, number, 1, string, ...string[], number, 1, string, 2];

type D = CountExactInArray<VariableList, string>;
//=> 2

type E = CountExactInArray<VariableList, 1>;
//=> 1

type F = CountExactInArray<VariableList, 2>;
//=> 0
```
*/
export type CountExactInArray<List extends UnknownArray, SearchType> = FilterArrayExact<List, SearchType>['length'];

export {};
