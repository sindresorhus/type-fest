import type {ConditionalSimplifyDeep} from './conditional-simplify';
import type {UnknownArrayOrTuple, UnknownRecord} from './internal';
import type {OmitIndexSignature} from './omit-index-signature';
import type {PickIndexSignature} from './pick-index-signature';
import type {EnforceOptional} from './enforce-optional';
import type {Merge} from './merge';

// --------------------------------------------------------------------------------------------------------------------

type MergeRecordValues<
	Destination,
	Source,
	Options extends MergeDeepOptions,
> = undefined extends Source
	? MergeDeepOrReturn<Source, Exclude<Destination, undefined>, Exclude<Source, undefined>, Options> | undefined
	: MergeDeepOrReturn<Source, Destination, Source, Options>;

type DoMergeRecord<
	Destination extends UnknownRecord,
	Source extends UnknownRecord,
	Options extends MergeDeepOptions,
> = EnforceOptional<{
	[Key in keyof Destination | keyof Source]: Key extends keyof Source
		? Key extends keyof Destination
			? MergeRecordValues<Destination[Key], Source[Key], Options>
			: Source[Key]
		: Key extends keyof Destination
			? Destination[Key]
			: never;
}>;

type MergeRecord<
	Destination extends UnknownRecord | undefined,
	Source extends UnknownRecord | undefined,
	Options extends MergeDeepOptions,
> = DoMergeRecord<OmitIndexSignature<Destination>, OmitIndexSignature<Source>, Options>
& Merge<PickIndexSignature<Destination>, PickIndexSignature<Source>>;

// --------------------------------------------------------------------------------------------------------------------

type ArrayMergeMode = 'spread' | 'union' | 'replace';

type MergeArray<
	Destination extends UnknownArrayOrTuple | undefined,
	Source extends UnknownArrayOrTuple | undefined,
	Options extends MergeDeepOptions,
> = Options['arrayMergeMode'] extends 'spread'
	? Array<Exclude<Destination, undefined>[number] | Exclude<Source, undefined>[number]>
	: Options['arrayMergeMode'] extends 'union'
		? Destination | Source
		: Source; // 'replace'

// --------------------------------------------------------------------------------------------------------------------

type MergeDeepOrReturn<
	DefaultType,
	Destination,
	Source,
	Options extends MergeDeepOptions,
> = [undefined] extends [Destination | Source]
	? DefaultType
	: Destination extends UnknownRecord | undefined
		? Source extends UnknownRecord | undefined
			? MergeRecord<Destination, Source, Options>
			: DefaultType
		: Destination extends UnknownArrayOrTuple | undefined
			? Source extends UnknownArrayOrTuple | undefined
				? MergeArray<Destination, Source, Options>
				: DefaultType
			: DefaultType;

// --------------------------------------------------------------------------------------------------------------------

export type MergeDeepOptions = {
	arrayMergeMode?: ArrayMergeMode;
};

type MergeDeepDefaultOptions = {
	arrayMergeMode: 'spread';
};

type SimplifyDeep<Type> = ConditionalSimplifyDeep<Type, Function | Iterable<unknown>, object>;

export type MergeDeep<Destination, Source, Options extends MergeDeepOptions = {}> = SimplifyDeep<
MergeDeepOrReturn<never, SimplifyDeep<Destination>, SimplifyDeep<Source>, Merge<MergeDeepDefaultOptions, Options>>
>;
