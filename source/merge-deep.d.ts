import {Merge} from './merge';
import {Spread} from './spread';
import {Simplify} from './simplify';
import {ConditionalExcept} from './conditional-except';

// ----------------------------------------------------------------------------

type UnknownRecord = Record<PropertyKey, unknown>;
type UnknownArrayOrTuple = readonly [...unknown[]];
type NonEmptyTuple = readonly [unknown, ...unknown[]];

// ----------------------------------------------------------------------------

export type MergeDeepRecordMode = 'merge-or-replace' | 'merge-or-union' | 'replace' | 'union';
export type MergeDeepArrayMode = MergeDeepRecordMode | 'merge-or-spread' | 'spread' | 'merge';

export interface MergeDeepOptions {
	stripUndefinedValues?: boolean;
	arrayMergeMode?: MergeDeepArrayMode;
	recordMergeMode?: MergeDeepRecordMode;
}

interface MergeDeepDefaultOptions extends MergeDeepOptions {
	stripUndefinedValues: false;
	recordMergeMode: 'merge-or-replace';
	arrayMergeMode: 'spread';
}

// ----------------------------------------------------------------------------

type IsBothExtends<BaseType, FirstType, SecondType> = FirstType extends BaseType
	? SecondType extends BaseType
		? true
		: false
	: false;

type isMergeable<Destination, Source> = IsBothExtends<UnknownArrayOrTuple, Destination, Source> extends true
	? true
	: IsBothExtends<UnknownRecord, UnknownRecord, Source> extends true
	? true
	: false;

// ----------------------------------------------------------------------------

type FirstArrayElement<TArray extends UnknownArrayOrTuple> = TArray extends readonly [infer THead, ...unknown[]]
	? THead
	: never;

type ArrayTail<TArray extends UnknownArrayOrTuple> = TArray extends readonly [unknown, ...infer TTail] ? TTail : [];

// ----------------------------------------------------------------------------

type MergeArrayValue<Destination, Source, Options extends MergeDeepOptions> = MergeDeepOrReturn<
	Source,
	Destination,
	Source,
	Options
>;

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

// ----------------------------------------------------------------------------

// Tuple <= Tuple
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

// Tuple <= Array
type MergeDeepTupleAndArray<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepOptions,
> = [...MergeTupleAndArrayType<Source, Destination[number], Options>, ...Array<Destination[number]>];

// Array <= Tuple
type MergeDeepArrayAndTuple<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepOptions,
> = [...MergeArrayAndTupleType<Source, Destination[number], Options>, ...Array<Destination[number]>];

// Array <= Array
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

// ----------------------------------------------------------------------------

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

// ----------------------------------------------------------------------------

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

type MergeDeepRecord<
	Destination,
	Source,
	Options extends MergeDeepOptions,
> = Options['stripUndefinedValues'] extends true
	? ConditionalExcept<DoMergeRecord<Destination, Source, Options>, undefined>
	: DoMergeRecord<Destination, Source, Options>;

// ----------------------------------------------------------------------------

type MergeDeepOrReturn<DefaultValue, Destination, Source, Options> = Destination extends UnknownArrayOrTuple
	? Source extends UnknownArrayOrTuple
		? Simplify<MergeDeepArray<Destination, Source, Merge<MergeDeepDefaultOptions, Options>>>
		: DefaultValue
	: Destination extends UnknownRecord
	? Source extends UnknownRecord
		? Simplify<MergeDeepRecord<Destination, Source, Merge<MergeDeepDefaultOptions, Options>>>
		: DefaultValue
	: DefaultValue;

// ----------------------------------------------------------------------------

export type MergeDeep<Destination, Source, Options extends MergeDeepOptions = {}> = MergeDeepOrReturn<
	never,
	Simplify<Destination, {deep: true}>,
	Simplify<Source, {deep: true}>,
	Merge<MergeDeepDefaultOptions, Options>
>;
