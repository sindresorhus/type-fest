import type {And} from './and';
import type {ArrayLength, ExactOptionalPropertyTypesEnable, IsLeadingSpreadArray, IsTrailingSpreadArray, Not, OptionalPartOfArray, RequiredPartOfArray, StaticPartOfArray, StaticPartOfLeadingSpreadArray, VariablePartOfArray, VariablePartOfLeadingSpreadArray} from './internal';
import type {IsEqual} from './is-equal';
import type {Or} from './or';
import type {Subtract} from './subtract';
import type {UnknownArray} from './unknown-array';

declare const RepeatSymbol: unique symbol;

/**
Return true if the number is 0
*/
type IsZero<T extends number> = [T] extends [0] ? true : false;

/**
 * Options for the `ArrayFlat` type.
 */
type ArrayFlatOptions = {
	/**
	 * The number of times to repeat the array items when flattening an non-fixed length array.
	 *
	 * @example
	 * ```
	 * type FlatArr0 = ArrayFlat<Array<number, string>, 1, { maxRepeat: 3 }>;
	 * //=> type FlatArr0 =
	 * []
	 * | [number, string]
	 * | [number, string, number, string]
	 * | [number, string, number, string, number, string];
	 * ```
	 *
	 * @default 5
	 */
	maxRepeat: number;
};

type DefaultArrayFlatOptions = {
	maxRepeat: 5;
};

/**
Creates a new array type by flattening an array to a specified depth.

Use-case: Flatten an array type to a specified depth.

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
DoRepeatArrayItem<InternalArrayFlat<T, Depth, Options>, Options['maxRepeat']>;

// Internal implementation
type InternalArrayFlat<
	T,
	Depth extends number = 1,
	Options extends ArrayFlatOptions = DefaultArrayFlatOptions,
	Result extends UnknownArray = [],
> =
T extends UnknownArray
	? Or<IsZero<ArrayLength<T>>, IsZero<Depth>> extends true
		? [...Result, ...T]
		: number extends T['length']
		// Handle non-fixed length arrays
			? InternalNonFixedLengthArrayFlat<T, Depth, Options, Result>
			// Handle fixed length arrays
			: InternalFixedLengthArrayFlat<T, Depth, Options, Result>
	: [];

// Handle non-fixed length arrays
type InternalNonFixedLengthArrayFlat<
	T,
	Depth extends number = 1,
	Options extends ArrayFlatOptions = DefaultArrayFlatOptions,
	Result extends UnknownArray = [],
> =
T extends UnknownArray
	? Or<IsZero<ArrayLength<T>>, IsZero<Depth>> extends true
		? [...Result, ...T]
		: IsTrailingSpreadArray<T> extends true
			// Handle trailing spread array
			? [StaticPartOfArray<T>, VariablePartOfArray<T>] extends [infer StaticPart, infer VariablePart]
				? InternalFixedLengthArrayFlat<StaticPart, Depth, Options> extends infer StaticPartResult extends UnknownArray
					? [StaticPartResult, InternalNonFixedLengthArrayFlat<VariablePart, Depth, Options>] extends
					[infer Result1 extends UnknownArray, infer Result2 extends UnknownArray]
						? [...Result, ...Result1, ...Result2]
						: never
					: never
				: never // Never happens
			// Handle leading spread array
			: IsLeadingSpreadArray<T> extends true
				? [VariablePartOfLeadingSpreadArray<T>, StaticPartOfLeadingSpreadArray<T>] extends [infer VariablePart, infer StaticPart]
					? [InternalNonFixedLengthArrayFlat<VariablePart, Depth, Options>, InternalFixedLengthArrayFlat<StaticPart, Depth, Options>] extends
					[infer Result1 extends UnknownArray, infer Result2 extends UnknownArray]
						? [...Result, ...Result1, ...Result2]
						: never
					: never // Never happens
				// Handle non-spread and non-fixed-length array
				: [
					T[number] extends UnknownArray
						? InternalArrayFlat<T[number], Subtract<Depth, 1>, Options, Result>
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
	Options extends ArrayFlatOptions = DefaultArrayFlatOptions,
	Result extends UnknownArray = [],
> =
T extends UnknownArray
	? Or<IsZero<ArrayLength<T>>, IsZero<Depth>> extends true
		? [...Result, ...T]
		: T extends readonly [infer ArrayItem, ...infer Last]
			?	[ArrayItem] extends [UnknownArray]
				? number extends ArrayLength<ArrayItem>
					? InternalNonFixedLengthArrayFlat<ArrayItem, Depth, Options> extends infer Item extends UnknownArray
						? InternalFixedLengthArrayFlat<Last, Depth, Options, [...Result, ...Item]>
						: never // Never happens, just for fixed ts error TS2589: Type instantiation is excessively deep and possibly infinite.
					: [RequiredPartOfArray<ArrayItem>, OptionalPartOfArray<ArrayItem>] extends [infer RequiredPart, infer OptionalPart]
						? InternalArrayFlat<
						Last,
						Depth,
						Options,
						[InternalArrayFlat<RequiredPart, Subtract<Depth, 1>, Options>, (InternalArrayFlat<OptionalPart, Subtract<Depth, 1>, Options> | [])] extends
						[infer Result1 extends UnknownArray, infer Result2 extends UnknownArray]
							? [...Result, ...Result1, ...Result2]
							: never
						>
						: never // Never happens
				: InternalInnerFixedLengthArrayFlat<Last, Depth, Options, [...Result, ArrayItem]>
			: [...Result, ...T]
	: [];

// Handle fixed length arrays
type InternalInnerFixedLengthArrayFlat<
	T,
	Depth extends number = 1,
	Options extends ArrayFlatOptions = DefaultArrayFlatOptions,
	Result extends UnknownArray = [],
> =
[T] extends [UnknownArray]
	? Or<IsZero<ArrayLength<T>>, IsZero<Depth>> extends true
		? [...Result, ...T]
		: [RequiredPartOfArray<T>, OptionalPartOfArray<T>] extends [infer RequiredPart, infer OptionalPart]
			? [InternalArrayFlat<RequiredPart, Depth, Options>, (InternalArrayFlat<OptionalPart, Depth, Options> | [])] extends
			[infer Result1 extends UnknownArray, infer Result2 extends UnknownArray]
				? [...Result, ...Result1, ...Result2]
				: never // Never happens, just for fixed ts error TS2589: Type instantiation is excessively deep and possibly infinite.
			: never // Never happens
	: [];

/**
 * Replaces items with the RepeatSymbol flag to the true result.
 */
type DoRepeatArrayItem<T, RepeatNumber extends number, hasSpreadArray extends boolean = false> =
T extends [infer _Item, ...infer Last]
	? [_Item] extends [{[RepeatSymbol]: infer Item extends UnknownArray}]
		? IsZero<Item['length']> extends true
			? [...DoRepeatArrayItem<Last, RepeatNumber>]
			: Item extends unknown
				? Item['length'] extends 1
				// If the item is a single element array, we can build [...Array<Item[number]>], but if already has spread
				// array before, we should build [...Array<'SomeSpreadArrayBefore'>, Item[number], Item[number], Item[number], ...]
					? [
						...(
							hasSpreadArray extends true
								? BuildRepeatedUnionArray<Item, RepeatNumber> extends infer Result extends UnknownArray
									? [...Result]
									: never // Never happens, just for fixed ts error TS2589: Type instantiation is excessively deep and possibly infinite.
								: Array<Item[number]>
						)
						, ...DoRepeatArrayItem<Last, RepeatNumber, true>,
					]
				// If the item is not a single element array, we only can build by repeating the item, like:
				// ArrayFlat<Array<[1, 2]>> => [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, ...]
					: [
						...(
							BuildRepeatedUnionArray<Item, RepeatNumber, Not<hasSpreadArray>> extends infer Result extends UnknownArray
								? [...Result]
								: never // Never happens, just for fixed ts error TS2589: Type instantiation is excessively deep and possibly infinite.
						)
						, ...DoRepeatArrayItem<Last, RepeatNumber, false>, // eslint-disable-line @typescript-eslint/no-unnecessary-type-arguments
					]
				: never // Never happens
		: [_Item, ...DoRepeatArrayItem<Last, RepeatNumber>]
	: T;

/**
 * Builds a union that lists all the possible combinations of the given array items and repeat times.
 *
 * @example
 * ```
 * type A = BuildRepeatedUnionArray<[number, string?], 2, true>;
 * //=> type A =
 * []
 * | number[]
 * | [number]
 * | [number, string]
 * | [number, number]
 * | [number, string, number]
 * | [number, number, string]
 * | [number, string, number, string]
 * ```
 */
type BuildRepeatedUnionArray<T extends UnknownArray, RepeatNumber extends number, CanSpread extends boolean = false, R extends unknown[] = []> =
RepeatNumber extends 0
	? R
	: [RequiredPartOfArray<T>, OptionalPartOfArray<T>] extends [infer RequiredPart extends UnknownArray, infer OptionalPart extends UnknownArray]
		? ExactOptionalPropertyTypesEnable extends true
			? R
			| [...RequiredPart]
			| (And<IsEqual<RequiredPart['length'], 1>, CanSpread> extends true
				? [...Array<RequiredPart[number]>]
				: never)
			| BuildRepeatedUnionArray<
			T,
			Subtract<RepeatNumber, 1>,
			CanSpread,
			[
				...R,
				...(
					ExactOptionalPropertyTypesEnable extends true
						? [...RequiredPart, ...([Exclude<OptionalPart[number], undefined>] | [])]
						: T
				),
			]
			>
			: never
		: never;
