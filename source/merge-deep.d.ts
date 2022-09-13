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

// Internal shortcut
type SimplifyDeep<Type> = ConditionalSimplifyDeep<Type, Function | Iterable<unknown>, object>;

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

type IsMergeable<Destination, Source> = IsBothExtends<UnknownArrayOrTuple, Destination, Source> extends true
	? true
	: IsBothExtends<UnknownRecord, Destination, Source> extends true
		? true
		: false;

type MergeDeepArrayOrTupleValues<
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

type FirstArrayElementOrArrayType<TArray extends UnknownArrayOrTuple> = TArray extends readonly [infer THead, ...unknown[]]
	? THead
	: TArray[number];

type MergeDeepTupleRecursive<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepOptions,
> = Destination extends []
	? Source
	: Source extends []
		? Destination
		: [
			MergeDeepArrayOrTupleValues<FirstArrayElementOrArrayType<Destination>, FirstArrayElementOrArrayType<Source>, Options>,
			...MergeDeepTupleRecursive<ArrayTail<Destination>, ArrayTail<Source>, Options>,
		];

// --------------------------------------------------------------------------------------------------------------------

type ArrayToTuple<Type extends UnknownArrayOrTuple> = [Type[number], ...Array<Type[number]>];

type InferRestType<Type extends UnknownArrayOrTuple> = number extends Type['length']
	? ArrayTail<Type> extends [] ? Type : InferRestType<ArrayTail<Type>>
	: [];

type MergeDeepTupleAndArrayRecursive<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepOptions,
> = [
	...MergeDeepTupleRecursive<Destination, ArrayToTuple<Source>, Options>,
	...MergeDeepArrayOrTupleValues<InferRestType<Destination>, InferRestType<Source>, Options>,
];

type MergeDeepArrayAndTupleRecursive<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepOptions,
> = [
	...MergeDeepTupleRecursive<ArrayToTuple<Destination>, Source, Options>,
	...MergeDeepArrayOrTupleValues<InferRestType<Destination>, InferRestType<Source>, Options>,
];

type MergeDeepTupleAndTupleRecursive<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepOptions,
> = [
	...MergeDeepTupleRecursive<Destination, Source, Options>,
	...MergeDeepArrayOrTupleValues<InferRestType<Destination>, InferRestType<Source>, Options>,
];

// --------------------------------------------------------------------------------------------------------------------

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

// --------------------------------------------------------------------------------------------------------------------

export type MergeDeepOptions = {
	arrayMergeMode?: ArrayMergeMode;
	recurseIntoArrays?: boolean;
};

type MergeDeepDefaultOptions = {
	arrayMergeMode: 'spread';
	recurseIntoArrays: false;
};

export type MergeDeep<Destination, Source, Options extends MergeDeepOptions = {}> = MergeDeepOrReturn<
never,
SimplifyDeep<Destination>,
SimplifyDeep<Source>,
Merge<MergeDeepDefaultOptions, Options>
>;
