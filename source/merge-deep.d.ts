import type {ConditionalSimplifyDeep} from './conditional-simplify';
import type {OmitIndexSignature} from './omit-index-signature';
import type {PickIndexSignature} from './pick-index-signature';
import type {EnforceOptional} from './enforce-optional';
import type {Merge} from './merge';
import type {
	ArrayTail,
	IsBothExtends,
	NonEmptyTuple,
	UnknownArrayOrTuple,
	UnknownRecord,
} from './internal';

/**
Deeply smplifies an object excluding iterables and functions. Used internally to improve the UX and accept both interfaces and type aliases as inputs.
*/
type SimplifyDeep<Type> = ConditionalSimplifyDeep<Type, Function | Iterable<unknown>, object>;

/**
Try to merge two record properties or return the source property value, preserving `undefined` properties values in both cases.
*/
type MergeDeepRecordProperty<
	Destination,
	Source,
	Options extends MergeDeepOptions,
> = undefined extends Source
	? MergeDeepOrReturn<Source, Exclude<Destination, undefined>, Exclude<Source, undefined>, Options> | undefined
	: MergeDeepOrReturn<Source, Destination, Source, Options>;

/**
Walk through the union of the keys of the two objects and test in which object the properties are defined.
- If the source does not contain the key, the value of the destination is returned.
- If the source contains the key and the destination does not contain the key, the value of the source is returned.
- If both contain the key, try to merge according to the  chosen {@link MergeDeepOptions options} or return the source if unable to merge.
*/
type DoMergeDeepRecord<
	Destination extends UnknownRecord,
	Source extends UnknownRecord,
	Options extends MergeDeepOptions,
> = EnforceOptional<{
	[Key in keyof Destination | keyof Source]: Key extends keyof Source
		? Key extends keyof Destination
			? MergeDeepRecordProperty<Destination[Key], Source[Key], Options>
			: Source[Key]
		: Key extends keyof Destination
			? Destination[Key]
			: never;
}>;

/**
Wrapper around {@link DoMergeDeepRecord} which preserves index signatures.
*/
type MergeDeepRecord<
	Destination extends UnknownRecord,
	Source extends UnknownRecord,
	Options extends MergeDeepOptions,
> = DoMergeDeepRecord<OmitIndexSignature<Destination>, OmitIndexSignature<Source>, Options>
& Merge<PickIndexSignature<Destination>, PickIndexSignature<Source>>;

/**
Returns a boolean for whether the source and destination can be merged.
*/
type IsMergeable<Destination, Source> = IsBothExtends<UnknownArrayOrTuple, Destination, Source> extends true
	? true
	: IsBothExtends<UnknownRecord, Destination, Source> extends true
		? true
		: false;

/**
Try to merge two array/tuple elements.
*/
type MergeDeepArrayOrTupleElements<
	Destination,
	Source,
	Options extends MergeDeepOptions,
> = Source extends []
	? Destination
	: Destination extends []
		? Source
		: IsMergeable<Destination, Source> extends true
			? MergeDeepOrReturn<never, Destination, Source, Options>
			: Options['arrayMergeMode'] extends 'union'
				? Destination | Source
				: Source; // 'replace'

/**
Returns the first tuple element type or the array type.
*/
type FirstArrayElementOrArrayType<TArray extends UnknownArrayOrTuple> = TArray extends readonly [infer THead, ...unknown[]]
	? THead
	: TArray[number];

/**
Merge two tuple elements recursively.
*/
type MergeDeepTupleRecursive<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepOptions,
> = Destination extends []
	? Source
	: Source extends []
		? Destination
		: [
			MergeDeepArrayOrTupleElements<FirstArrayElementOrArrayType<Destination>, FirstArrayElementOrArrayType<Source>, Options>,
			...MergeDeepTupleRecursive<ArrayTail<Destination>, ArrayTail<Source>, Options>,
		];

/**
Transform an array into a variadic length tuple.
*/
type ArrayToTuple<Type extends UnknownArrayOrTuple> = [Type[number], ...Array<Type[number]>];

/**
Infer the type of the last element of the tuple even if it has a variable length.
*/
type InferRestType<Type extends UnknownArrayOrTuple> = number extends Type['length']
	? ArrayTail<Type> extends [] ? Type : InferRestType<ArrayTail<Type>>
	: [];

/**
Merge two tuples recursively.
*/
type MergeDeepTupleAndTupleRecursive<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepOptions,
> = [
	...MergeDeepTupleRecursive<Destination, Source, Options>,
	...MergeDeepArrayOrTupleElements<InferRestType<Destination>, InferRestType<Source>, Options>,
];

/**
Merge an array into a tuple recursively.
*/
type MergeDeepTupleAndArrayRecursive<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepOptions,
> = [
	...MergeDeepTupleRecursive<Destination, ArrayToTuple<Source>, Options>,
	...MergeDeepArrayOrTupleElements<InferRestType<Destination>, InferRestType<Source>, Options>,
];

/**
Merge a tuple into an array recursively.
*/
type MergeDeepArrayAndTupleRecursive<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepOptions,
> = [
	...MergeDeepTupleRecursive<ArrayToTuple<Destination>, Source, Options>,
	...MergeDeepArrayOrTupleElements<InferRestType<Destination>, InferRestType<Source>, Options>,
];

/**
Merge mode for array/tuple elements.
*/
type ArrayMergeMode = 'spread' | 'union' | 'replace';

/**
Merge two arrays/tuples according to the chosen {@link MergeDeepOptions.arrayMergeMode option}.
*/
type DoMergeArrayOrTuple<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepOptions,
> = Options['arrayMergeMode'] extends 'spread'
	? Array<Exclude<Destination, undefined>[number] | Exclude<Source, undefined>[number]>
	: Options['arrayMergeMode'] extends 'union'
		? Destination | Source
		: Source; // 'replace'

/**
Merge two arrays recursively.
*/
type MergeDeepArrayRecursive<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepOptions,
> = Destination[number] extends UnknownArrayOrTuple
	? Source[number] extends UnknownArrayOrTuple
		? Array<MergeDeepArrayOrTupleRecursive<Destination[number], Source[number], Options>>
		: DoMergeArrayOrTuple<Destination, Source, Options>
	: Destination[number] extends UnknownRecord
		? Source[number] extends UnknownRecord
			? Array<SimplifyDeep<MergeDeepRecord<Destination[number], Source[number], Options>>>
			: DoMergeArrayOrTuple<Destination, Source, Options>
		: DoMergeArrayOrTuple<Destination, Source, Options>;

/**
Merge two array/tuple recursively.
*/
type MergeDeepArrayOrTupleRecursive<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepOptions,
> = IsBothExtends<NonEmptyTuple, Destination, Source> extends true
	? MergeDeepTupleAndTupleRecursive<Destination, Source, Options>
	: Destination extends NonEmptyTuple
		? MergeDeepTupleAndArrayRecursive<Destination, Source, Options>
		: Source extends NonEmptyTuple
			? MergeDeepArrayAndTupleRecursive<Destination, Source, Options>
			: MergeDeepArrayRecursive<Destination, Source, Options>;

/**
Merge two array/tuple according to the chosen {@link MergeDeepOptions.recurseIntoArrays option}.
*/
type MergeDeepArrayOrTuple<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepOptions,
> = Options['recurseIntoArrays'] extends true
	? MergeDeepArrayOrTupleRecursive<Destination, Source, Options>
	: DoMergeArrayOrTuple<Destination, Source, Options>;

/**
Try to merge two objects or two arrays/tuples recursively into a new type or return the default value.
*/
type MergeDeepOrReturn<
	DefaultType,
	Destination,
	Source,
	Options extends MergeDeepOptions,
> = SimplifyDeep<[undefined] extends [Destination | Source]
	? DefaultType
	: Destination extends UnknownRecord
		? Source extends UnknownRecord
			? MergeDeepRecord<Destination, Source, Options>
			: DefaultType
		: Destination extends UnknownArrayOrTuple
			? Source extends UnknownArrayOrTuple
				? MergeDeepArrayOrTuple<Destination, Source, Options>
				: DefaultType
			: DefaultType>;

/**
MergeDeep options.

@see {@link MergeDeep}
*/
export type MergeDeepOptions = {
	/**
	Merge mode for array and tuple.

	When we walk through the properties of the objects and the same key is found and both are array or tuple, a merge mode must be chosen:
	- `spread`: Spreads the destination and the source values. This is the default mode.
	- `replace`: Replaces the destination value by the source value.
	- `union`: Unions the destination and source values.

	See {@link MergeDeep} for usages and examples.

	@default 'spread'
	*/
	arrayMergeMode?: ArrayMergeMode;

	/**
	Whether to affect the individual elements of arrays and tuples.

	@default false
	*/
	recurseIntoArrays?: boolean;
};

/**
Default options that will be merged with user provided options.
*/
type MergeDeepDefaultOptions = {
	arrayMergeMode: 'spread';
	recurseIntoArrays: false;
};

/**
Merge two objects or two arrays/tuples recursively into a new type.

@see {@link MergeDeepOptions}

@experimental This type is marked as experimental because it depends on {@link ConditionalSimplifyDeep} which itself is experimental.

@category Array
@category Object
@category Utilities
*/
export type MergeDeep<Destination, Source, Options extends MergeDeepOptions = {}> = MergeDeepOrReturn<
never,
SimplifyDeep<Destination>,
SimplifyDeep<Source>,
Merge<MergeDeepDefaultOptions, Options>
>;
