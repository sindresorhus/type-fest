import type {IsBothExtends, NonEmptyTuple, UnknownArrayOrTuple, UnknownRecord} from './internal';
import type {ConditionalSimplifyDeep} from './conditional-simplify';
import type {OmitIndexSignature} from './omit-index-signature';
import type {PickIndexSignature} from './pick-index-signature';
import type {EnforceOptional} from './enforce-optional';
import type {Merge} from './merge';

// --------------------------------------------------------------------------------------------------------------------

type MergeDeepRecordValues<
	Destination,
	Source,
	Options extends MergeDeepOptions,
> = undefined extends Source
	? MergeDeepOrReturn<Source, Exclude<Destination, undefined>, Exclude<Source, undefined>, Options> | undefined
	: MergeDeepOrReturn<Source, Destination, Source, Options>;

type DoMergeDeepRecord<
	Destination extends UnknownRecord,
	Source extends UnknownRecord,
	Options extends MergeDeepOptions,
> = EnforceOptional<{
	[Key in keyof Destination | keyof Source]: Key extends keyof Source
		? Key extends keyof Destination
			? MergeDeepRecordValues<Destination[Key], Source[Key], Options>
			: Source[Key]
		: Key extends keyof Destination
			? Destination[Key]
			: never;
}>;

type MergeDeepRecord<
	Destination extends UnknownRecord,
	Source extends UnknownRecord,
	Options extends MergeDeepOptions,
> = DoMergeDeepRecord<OmitIndexSignature<Destination>, OmitIndexSignature<Source>, Options>
& Merge<PickIndexSignature<Destination>, PickIndexSignature<Source>>;

// --------------------------------------------------------------------------------------------------------------------

type ArrayMergeMode = 'spread' | 'union' | 'replace';

type DoMergeArrayOrTuple<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepOptions,
> = Options['arrayMergeMode'] extends 'spread'
	? Array<Exclude<Destination, undefined>[number] | Exclude<Source, undefined>[number]>
	: Options['arrayMergeMode'] extends 'union'
		? Destination | Source
		: Source; // 'replace'

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

type MergeDeepTupleRecursive<Destination, Source, Options> = [Destination, Source, Options];
type MergeDeepTupleAndArrayRecursive<Destination, Source, Options> = [Destination, Source, Options];
type MergeDeepArrayAndTupleRecursive<Destination, Source, Options> = [Destination, Source, Options];

type MergeDeepArrayOrTupleRecursive<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepOptions,
> = IsBothExtends<NonEmptyTuple, Destination, Source> extends true
	? MergeDeepTupleRecursive<Destination, Source, Options>
	: Destination extends NonEmptyTuple
		? MergeDeepTupleAndArrayRecursive<Source, Destination, Options>
		: Source extends NonEmptyTuple
			? MergeDeepArrayAndTupleRecursive<Destination, Source, Options>
			: MergeDeepArrayRecursive<Destination, Source, Options>;

type MergeDeepArrayOrTuple<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepOptions,
> = Options['recurseIntoArrays'] extends true
	? MergeDeepArrayOrTupleRecursive<Destination, Source, Options>
	: DoMergeArrayOrTuple<Destination, Source, Options>;

// --------------------------------------------------------------------------------------------------------------------

type MergeDeepOrReturn<
	DefaultType,
	Destination,
	Source,
	Options extends MergeDeepOptions,
> = [undefined] extends [Destination | Source]
	? DefaultType
	: Destination extends UnknownRecord
		? Source extends UnknownRecord
			? MergeDeepRecord<Destination, Source, Options>
			: DefaultType
		: Destination extends UnknownArrayOrTuple
			? Source extends UnknownArrayOrTuple
				? MergeDeepArrayOrTuple<Destination, Source, Options>
				: DefaultType
			: DefaultType;

// --------------------------------------------------------------------------------------------------------------------

export type MergeDeepOptions = {
	arrayMergeMode?: ArrayMergeMode;
	recurseIntoArrays?: boolean;
};

type MergeDeepDefaultOptions = {
	arrayMergeMode: 'spread';
	recurseIntoArrays: false;
};

type SimplifyDeep<Type> = ConditionalSimplifyDeep<Type, Function | Iterable<unknown>, object>;

export type MergeDeep<Destination, Source, Options extends MergeDeepOptions = {}> = SimplifyDeep<
MergeDeepOrReturn<never, SimplifyDeep<Destination>, SimplifyDeep<Source>, Merge<MergeDeepDefaultOptions, Options>>
>;
