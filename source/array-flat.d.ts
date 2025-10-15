import type {And} from './and.d.ts';
import type {
	ArrayLength,
	IsLeadingSpreadArray,
	IsMiddleSpreadArray,
	IsTrailingSpreadArray,
	LeadingStaticPartOfMiddleSpreadArray,
	OptionalPartOfStaticArray,
	RequiredPartOfStaticArray,
	StaticPartOfArray,
	StaticPartOfLeadingSpreadArray,
	TrailingStaticPartOfMiddleSpreadArray,
	VariablePartOfArray,
	VariablePartOfLeadingSpreadArray,
	VariablePartOfMiddleSpreadArray,
} from './internal/array.d.ts';
import type {IsExactOptionalPropertyTypesEnabled, Not} from './internal/type.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {Or} from './or.d.ts';
import type {Subtract} from './subtract.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

declare const RepeatSymbol: unique symbol;

/**
Returns true if the number is 0.
*/
type IsZero<T extends number> = [T] extends [0] ? true : false;

/**
Options for the `ArrayFlat` type.
*/
type ArrayFlatOptions = {
	/**
	The number of times to repeat the array items when flattening a non-fixed length array.

	@default 5

	@example
	```
	import type {ArrayFlat} from 'type-fest';

	type FlatArr0 = ArrayFlat<Array<[number, string]>, 1, {maxRepeat: 3}>;
	//=> type FlatArr0 =
	[]
	| [number, string]
	| [number, string, number, string]
	| [number, string, number, string, number, string];
	```
	*/
	maxRepeat: number;
};

type DefaultArrayFlatOptions = {
	maxRepeat: 5;
};

/**
Creates a new array type by flattening an array to a specified depth.

Use-case: You can handle data nested at any level within arrays without worrying about the nesting structure.

Like [`Array#flat()`](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/flat) but for types.

@example
```
import type {ArrayFlat, PositiveInfinity} from 'type-fest';

type FlatArr0 = ArrayFlat<[[0, 1], [2, 3], [4, 5]]>;
//=> type FlatArr0 = [0, 1, 2, 3, 4, 5];

// Flatten to depth
type Arr1 = [[0, [1, [2, [3, [4, [5]]]]]]];
type FlatArr1 = ArrayFlat<Arr1, 1>;
//=> type FlatArr1 = [0, [1, [2, [3, [4, [5]]]]]];

type FlatArr2 = ArrayFlat<Arr1, 3>;
//=> type FlatArr2 = [0, 1, 2, [3, [4, [5]]]];

// Flatten to depth Infinity
type FlatArr3 = ArrayFlat<Arr1, PositiveInfinity>;
//=> type FlatArr3 = [0, 1, 2, 3, 4, 5];
```

@category Array
*/
export type ArrayFlat<T, Depth extends number = 1, Options extends ArrayFlatOptions = DefaultArrayFlatOptions> =
DoRepeatArrayItem<InternalArrayFlat<T, Depth>, Options['maxRepeat']>;

// Internal implementation
type InternalArrayFlat<
	T,
	Depth extends number = 1,
	Result extends UnknownArray = [],
> =
T extends UnknownArray
	? Or<IsZero<ArrayLength<T>>, IsZero<Depth>> extends true
		? [...Result, ...T]
		: number extends T['length']
			// Handle non-fixed length arrays
			? InternalNonFixedLengthArrayFlat<T, Depth, Result>
			// Handle fixed length arrays
			: InternalFixedLengthArrayFlat<T, Depth, Result>
	: [];

// Handle non-fixed length arrays
type InternalNonFixedLengthArrayFlat<
	T,
	Depth extends number = 1,
	Result extends UnknownArray = [],
> =
T extends UnknownArray
	? Or<IsZero<ArrayLength<T>>, IsZero<Depth>> extends true
		? [...Result, ...T]
		: IsTrailingSpreadArray<T> extends true
			// Handle trailing spread array
			? [
				...Result,
				...InternalFixedLengthArrayFlat<StaticPartOfArray<T>, Depth>,
				...InternalNonFixedLengthArrayFlat<VariablePartOfArray<T>, Depth>,
			]
			// Handle leading spread array
			: IsLeadingSpreadArray<T> extends true
				? [
					...Result,
					...InternalNonFixedLengthArrayFlat<VariablePartOfLeadingSpreadArray<T>, Depth>,
					...InternalFixedLengthArrayFlat<StaticPartOfLeadingSpreadArray<T>, Depth>,
				]
				// Handle middle spread array
				: IsMiddleSpreadArray<T> extends true
					? [
						...Result,
						...InternalFixedLengthArrayFlat<LeadingStaticPartOfMiddleSpreadArray<T>, Depth>,
						...InternalNonFixedLengthArrayFlat<VariablePartOfMiddleSpreadArray<T>, Depth>,
						...InternalFixedLengthArrayFlat<TrailingStaticPartOfMiddleSpreadArray<T>, Depth>,
					]
					// Handle non-spread and non-fixed-length array
					: [
						T[number] extends UnknownArray
							? InternalArrayFlat<T[number], Subtract<Depth, 1>, Result>
							: [T[number]],
					] extends [infer Item extends UnknownArray]
						? Item extends [{[RepeatSymbol]: unknown}]
							? Item
							: [{[RepeatSymbol]: Item}]
						: never // Never happens
	: T;

// Handle fixed length arrays
type InternalFixedLengthArrayFlat<
	T,
	Depth extends number = 1,
	Result extends UnknownArray = [],
> =
T extends UnknownArray
	? Or<IsZero<ArrayLength<T>>, IsZero<Depth>> extends true
		? [...Result, ...T]
		: T extends readonly [infer ArrayItem, ...infer Last]
			? [ArrayItem] extends [UnknownArray]
				? number extends ArrayLength<ArrayItem>
					? InternalFixedLengthArrayFlat<Last, Depth, [...Result, ...InternalNonFixedLengthArrayFlat<ArrayItem, Depth>]>
					: InternalArrayFlat<
						Last,
						Depth,
						[
							...Result,
							...InternalArrayFlat<RequiredPartOfStaticArray<ArrayItem>, Subtract<Depth, 1>>,
							...(InternalArrayFlat<OptionalPartOfStaticArray<ArrayItem>, Subtract<Depth, 1>> | []),
						]
					>
				: InternalInnerFixedLengthArrayFlat<Last, Depth, [...Result, ArrayItem]>
			: [...Result, ...T]
	: [];

// Handle fixed length arrays
type InternalInnerFixedLengthArrayFlat<
	T,
	Depth extends number = 1,
	Result extends UnknownArray = [],
> =
[T] extends [UnknownArray]
	? Or<IsZero<ArrayLength<T>>, IsZero<Depth>> extends true
		? [...Result, ...T]
		: [...Result, ...InternalArrayFlat<RequiredPartOfStaticArray<T>, Depth>, ...(InternalArrayFlat<OptionalPartOfStaticArray<T>, Depth> | [])]
	: [];

/**
Replaces items marked with the RepeatSymbol flag with their expanded union representations.
*/
type DoRepeatArrayItem<T, RepeatNumber extends number, hasSpreadArray extends boolean = false> =
T extends readonly [infer _Item, ...infer Last]
	? [_Item] extends [{[RepeatSymbol]: infer Item extends UnknownArray}]
		? IsZero<Item['length']> extends true
			? DoRepeatArrayItem<Last, RepeatNumber>
			: Item extends unknown
				? Item['length'] extends 1
					// If the item is a single element array, we can build [...Array<Item[number]>], but if it already has spread
					// array before, we should build [...Array<'SomeSpreadArrayBefore'>, Item[number], Item[number], Item[number], ...]
					? [
						...(
							hasSpreadArray extends true
								? BuildRepeatedUnionArray<Item, RepeatNumber, Not<hasSpreadArray>>
								: Array<Item[number]>
						),
						...DoRepeatArrayItem<Last, RepeatNumber, true>,
					]
					// If the item is not a single element array, we can only build by repeating the item, like:
					// ArrayFlat<Array<[1, 2]>> => [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, ...]
					: [
						...BuildRepeatedUnionArray<Item, RepeatNumber, Not<hasSpreadArray>>,
						...DoRepeatArrayItem<Last, RepeatNumber>,
					]
				: never // Never happens
		: [_Item, ...DoRepeatArrayItem<Last, RepeatNumber>]
	: T;

/**
Builds a union that lists all the possible combinations of the given array items and repeat times.

@example
```
type A = BuildRepeatedUnionArray<[number, string?], 2, true>;
//=> type A =
[]
| number[]
| [number]
| [number, string]
| [number, number]
| [number, string, number]
| [number, number, string]
| [number, string, number, string]
```
*/
type BuildRepeatedUnionArray<
	T extends UnknownArray,
	RepeatNumber extends number,
	CanSpread extends boolean = false,
	R extends unknown[] = [],
	RequiredPart extends UnknownArray = RequiredPartOfStaticArray<T>,
	OptionalPart extends UnknownArray = OptionalPartOfStaticArray<T>,
> =
RepeatNumber extends 0
	? R
	: IsExactOptionalPropertyTypesEnabled extends true
	// eslint-disable-next-line @stylistic/indent
	? R
	| RequiredPart
	| (And<IsEqual<RequiredPart['length'], 1>, CanSpread> extends true
		? Array<RequiredPart[number]>
		: never)
	| BuildRepeatedUnionArray<
		T,
		Subtract<RepeatNumber, 1>,
		CanSpread,
		[
			...R,
			...(
				IsExactOptionalPropertyTypesEnabled extends true
					? [
						...RequiredPart,
						...(IsZero<ArrayLength<OptionalPart>> extends true ? [] : [Exclude<OptionalPart[number], undefined>] | []),
					]
					: T
			),
		]
	>
		: never;

export {};
