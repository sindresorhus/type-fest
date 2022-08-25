import {Merge} from './merge';
import {Spread} from './spread';
import {ConditionalExcept} from './conditional-except';
import {ConditionalSimplify, ConditionalSimplifyDeep} from './conditional-simplify';
import {
	ArrayTail,
	FirstArrayElement,
	IsBothExtends,
	NonEmptyTuple,
	UnknownArrayOrTuple,
	UnknownRecord,
} from './internal';

/**
Returns a boolean for whether the source and destination can be merged.
*/
type isMergeable<Destination, Source> = IsBothExtends<UnknownArrayOrTuple, Destination, Source> extends true
	? true
	: IsBothExtends<UnknownRecord, UnknownRecord, Source> extends true
	? true
	: false;

/**
Merge two array/tuple value or return the source. It looks like `MergeDeepOrReturn`, but the trick is that it avoids inferring the default value twice.
*/
type MergeArrayValue<Destination, Source, Options extends MergeDeepOptions> = MergeDeepOrReturn<
	Source,
	Destination,
	Source,
	Options
>;

/**
Merge two tuples recursively.
*/
type MergeDeepTuple<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepOptions,
> = Destination extends []
	? Source
	: Source extends []
	? Destination
	: [
			MergeArrayValue<FirstArrayElement<Destination>, FirstArrayElement<Source>, Options>,
			...MergeDeepTuple<ArrayTail<Destination>, ArrayTail<Source>, Options>,
		];

/**
Merge an array type with a tuple recursively.
*/
type MergeTupleAndArrayType<
	Tuple extends UnknownArrayOrTuple,
	ArrayType,
	Options extends MergeDeepOptions,
> = Tuple extends []
	? Tuple
	: [
			MergeArrayValue<FirstArrayElement<Tuple>, ArrayType, Options>,
			...MergeTupleAndArrayType<ArrayTail<Tuple>, ArrayType, Options>,
		];

/**
Merge an array with a tuple recursively.
*/
type MergeDeepTupleAndArray<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepOptions,
> = [...MergeTupleAndArrayType<Source, Destination[number], Options>, ...Array<Destination[number]>];

/**
Merge a tuple with a array type recursively.
*/
type MergeArrayAndTupleType<
	Tuple extends UnknownArrayOrTuple,
	ArrayType,
	Options extends MergeDeepOptions,
> = Tuple extends []
	? Tuple
	: [
			MergeArrayValue<ArrayType, FirstArrayElement<Tuple>, Options>,
			...MergeArrayAndTupleType<ArrayTail<Tuple>, ArrayType, Options>,
		];

/**
Merge a tuple with a array recursively.
*/
type MergeDeepArrayAndTuple<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepOptions,
> = [...MergeArrayAndTupleType<Source, Destination[number], Options>, ...Array<Destination[number]>];

/**
Merge two arrays recursively.
*/
type MergeDeepArrayAndArray<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepOptions,
> = Options['arrayMergeMode'] extends 'merge-or-spread'
	? Array<MergeDeepOrReturn<[...Destination, ...Source][number], Destination[number], Source[number], Options>>
	: Options['arrayMergeMode'] extends 'merge-or-union'
	? isMergeable<Destination[number], Source[number]> extends true
		? Array<MergeDeep<Destination[number], Source[number], Options>>
		: Destination | Source
	: // Assume arrayMergeMode = 'merge-or-replace'
		Array<MergeDeepOrReturn<Source[number], Destination[number], Source[number], Options>>;

/**
Utility that selects the merge mode according to the provided types. For example, if it is an array to a tuple or vice versa.
*/
type DoMergeDeepArray<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepOptions,
> = IsBothExtends<NonEmptyTuple, Destination, Source> extends true
	? MergeDeepTuple<Destination, Source, Options>
	: Destination extends NonEmptyTuple
	? MergeDeepTupleAndArray<Source, Destination, Options>
	: Source extends NonEmptyTuple
	? MergeDeepArrayAndTuple<Destination, Source, Options>
	: MergeDeepArrayAndArray<Destination, Source, Options>;

/**
Wrapper around {@link DoMergeDeepArray} which selects the merge mode to be applied according to the {@link MergeDeepOptions.arrayMergeMode|arrayMergeMode} option.
*/
type MergeDeepArray<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepOptions,
> = Options['arrayMergeMode'] extends 'spread' // Default value first
	? Spread<Destination, Source>
	: Options['arrayMergeMode'] extends 'union'
	? Destination | Source
	: Options['arrayMergeMode'] extends 'replace'
	? Source
	: // Assume arrayMergeMode = 'merge-or-XXX'
		DoMergeDeepArray<Destination, Source, Options>;

/**
Walk through the union of the keys of the two objects and test in which object the properties are defined.
- If the source does not contain the key, the value of the destination is returned.
- If the source contains the key and the destination does not contain the key, the value of the source is returned.
- If both contain the key, try to merge according to the mode defined in {@link MergeDeepOptions.recordMergeMode|recordMergeMode} option or return the source if unable to merge.
*/
type DoMergeRecord<Destination, Source, Options extends MergeDeepOptions> = {
	[Key in keyof Destination | keyof Source]: Key extends keyof Source
		? // Source found, check for destination
			Key extends keyof Destination
			? // Both source and destination exists
				Options['recordMergeMode'] extends 'merge-or-replace' // Default value first
				? MergeDeepOrReturn<Source[Key], Destination[Key], Source[Key], Options>
				: Options['recordMergeMode'] extends 'merge-or-union'
				? MergeDeepOrReturn<Destination[Key] | Source[Key], Destination[Key], Source[Key], Options>
				: Options['recordMergeMode'] extends 'union'
				? Destination[Key] | Source[Key]
				: // Assume recordMergeMode = 'replace'
					Source[Key]
			: // Only the source exists
				Source[Key]
		: // No source, take the destination
		Key extends keyof Destination
		? Destination[Key]
		: never; // (this test is useless, but make TS happy, It can never be never)
};

/**
Wrapper around {@link DoMergeRecord} which defines whether or not to strip `undefined` values.
*/
type MergeDeepRecord<
	Destination,
	Source,
	Options extends MergeDeepOptions,
> = Options['stripUndefinedValues'] extends true
	? ConditionalExcept<DoMergeRecord<Destination, Source, Options>, undefined>
	: DoMergeRecord<Destination, Source, Options>;

/**
Try to merge two objects or two arrays/tuples recursively into a new type or return the default value.
*/
type MergeDeepOrReturn<DefaultValue, Destination, Source, Options> = Destination extends UnknownArrayOrTuple
	? Source extends UnknownArrayOrTuple
		? ConditionalSimplify<MergeDeepArray<Destination, Source, Merge<MergeDeepDefaultOptions, Options>>, Function>
		: DefaultValue
	: Destination extends UnknownRecord
	? Source extends UnknownRecord
		? ConditionalSimplify<MergeDeepRecord<Destination, Source, Merge<MergeDeepDefaultOptions, Options>>, Function>
		: DefaultValue
	: DefaultValue;

/**
Merge mode for object properties.

@see MergeDeepOptions.recordMergeMode
*/
export type MergeDeepRecordMode = 'merge-or-replace' | 'merge-or-union' | 'replace' | 'union';

/**
Merge mode for array/tuple items.

@see MergeDeepOptions.arrayMergeMode
*/
export type MergeDeepArrayMode = MergeDeepRecordMode | 'merge-or-spread' | 'spread' | 'merge';

/**
MergeDeep options.

@see MergeDeep
*/
export interface MergeDeepOptions {
	/**
	Should strip `undefined` values from the resulting type.

	@default false
	*/
	stripUndefinedValues?: boolean;

	/**
	Merge mode for object properties.

	See {@link MergeDeep} for usages and examples.

	@default 'merge-or-replace'
	*/
	recordMergeMode?: MergeDeepRecordMode;

	/**
	Merge mode for array/tuple items.

	See {@link MergeDeep} for usages and examples.

	@default 'spread'
	*/
	arrayMergeMode?: MergeDeepArrayMode;
}

// Default options that will be merged with user provided options.
interface MergeDeepDefaultOptions extends MergeDeepOptions {
	stripUndefinedValues: false;
	recordMergeMode: 'merge-or-replace';
	arrayMergeMode: 'spread';
}

/**
Merge two objects or two arrays/tuples recursively into a new type.

@see MergeDeepOptions

@category Array
@category Object
@category Utilities
*/
export type MergeDeep<Destination, Source, Options extends MergeDeepOptions = {}> = MergeDeepOrReturn<
	never,
	ConditionalSimplifyDeep<Destination, Function>,
	ConditionalSimplifyDeep<Source, Function>,
	Merge<MergeDeepDefaultOptions, Options>
>;
