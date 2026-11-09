import type {ApplyDefaultOptions} from './apply-default-options.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {IsEqual} from './is-equal.d.ts';
import type {And} from './and.d.ts';
import type {ConditionalSimplifyDeep} from './conditional-simplify-deep.d.ts'; // For `@link`
import type {OmitIndexSignature} from './omit-index-signature.d.ts';
import type {PickIndexSignature} from './pick-index-signature.d.ts';
import type {Merge} from './merge.d.ts';
import type {ModifyDeep} from './modify-deep.d.ts'; // For `@link`
import type {Except} from './except.d.ts';
import type {
	FirstArrayElement,
	SimplifyObject,
	UndefinedToOptionalObject,
	KeyAliases,
	NonRecursiveType,
	MapsSetsOrArrays,
} from './internal/index.d.ts';
import type {ArrayTail as _ArrayTail} from './array-tail.d.ts';
import type {UnknownRecord} from './unknown-record.d.ts';
import type {SimplifyDeep} from './simplify-deep.d.ts';
import type {UnknownArray} from './unknown-array.d.ts';

// Not the exported `Writable`, because its union, `Map`, `Set`, and `any` handling makes `MergeDeep` about four times as expensive to check, and only arrays reach this.
type Writable<TArray extends UnknownArray> = {-readonly [Key in keyof TArray]: TArray[Key]};

// Using the default `ArrayTail` type causes issues, refer https://github.com/sindresorhus/type-fest/pull/1175/files#r2134694728.
type ArrayTail<TArray extends UnknownArray> = TArray extends unknown // For distributing `TArray`
	? '0' extends keyof TArray
		? Writable<_ArrayTail<TArray>>
		: []
	: never; // Should never happen

type SimplifyDeepExcludeArray<T> = SimplifyDeep<T, UnknownArray>;

/**
Seal only the current record shell, so interfaces can participate without eagerly transforming nested values.
*/
type SealRecord<Value> = Value extends UnknownRecord | UnknownArray
	? Value
	: Value extends NonRecursiveType | MapsSetsOrArrays
		? Value
		: Value extends object
			? SimplifyObject<Value>
			: Value;

/**
Select a record key before recursively cleaning its value.

Testing cleaned children again can hide a known parent key when its payload is generic.
*/
type KeepKey<Key, Value> = [Value] extends [never] ? never : Key;

/**
Select a shared key from its original property types without merging its value twice.

A merge becomes `never` when the source is `never`, or the destination is `never` and the source cannot contribute `undefined`. Read the source before applying `Required`, so an optional `never` property is kept.
*/
type KeepMergedKey<Key, Destination, Source> = [Source] extends [never]
	? never
	: [Destination] extends [never]
		? undefined extends Source ? Key : never
		: Key;

/**
Simplify copied values according to the removal mode without merging them again.
*/
type SimplifyCopied<Value, RemoveNever extends boolean> = RemoveNever extends true
	? RemoveCopiedNever<Value>
	: SimplifyDeepExcludeArray<Value>;

/**
Remove `never` keys from copied plain objects, leaving array and tuple payloads unchanged.
*/
type RemoveCopiedNever<Value> = IsAny<Value> extends true
	? Value
	: Value extends Exclude<NonRecursiveType, PromiseLike<unknown>> | MapsSetsOrArrays
		// Copied arrays and tuples are terminal: this preserves recursive tuple payloads, additional properties, and brands.
		? Value
		: Value extends object
			// Remove keys before identifying thenables, so a removed `then` key cannot make a plain object look like a promise. Genuine copied thenables stay unchanged; merged records use normal key removal.
			? {[Key in keyof Value as Value[Key] extends never ? never : Key]: Value[Key]} extends PromiseLike<unknown>
				? Value
				: {[Key in keyof Value as Value[Key] extends never ? never : Key]: RemoveCopiedNever<Value[Key]>}
			: Value;

/**
Try to merge two record properties or return the source property value, preserving `undefined` properties values in both cases.
*/
type MergeDeepRecordProperty<
	Destination,
	Source,
	RemoveNever extends boolean,
	Options extends MergeDeepInternalOptions,
> = IsAny<Source> extends true
	// `any` satisfies every assignability check below, so without this guard a source of `any` looks like a source of only `undefined` and the property is narrowed to `undefined`, which no object spread can produce.
	? Source
	: undefined extends Source
		// A source of only `undefined` has nothing to merge with, so the property keeps `undefined`, like object spread does at runtime.
		? [Source] extends [undefined]
			? undefined
			: MergeDeepOrReturn<Source, Exclude<Destination, undefined>, Exclude<Source, undefined>, RemoveNever, Options> | undefined
		: MergeDeepOrReturn<Source, Destination, Source, RemoveNever, Options>;

/**
Walk through the union of the keys of the two objects and test in which object the properties are defined.
Rules:
1. If the source does not contain the key, the value of the destination is returned.
2. If the source contains the key and the destination does not contain the key, the value of the source is returned.
3. If both contain the key, try to merge according to the chosen {@link MergeDeepOptions options} or return the source if unable to merge.
*/
type DoMergeDeepRecord<
	Destination extends UnknownRecord,
	Source extends UnknownRecord,
	RemoveNever extends boolean,
	Options extends MergeDeepInternalOptions,
> =
	// Compare runtime spellings, but read through the declared destination key so enum names retain their values.
	// Select the mode outside the maps so `MergeDeep` avoids deletion checks for every key.
	RemoveNever extends true
		? ({
			// Case in rule 1: The destination contains the key but the source doesn't.
			[Key in keyof Destination as Key extends KeyAliases<keyof Source> ? never : KeepKey<Key, Destination[Key]>]: SimplifyCopied<Destination[Key], true>;
		} & {
			// Keep the two source maps separate: combining their value branches makes generic array merges exceed TypeScript's comparison depth.
			// Case in rule 2: The source contains the key but the destination doesn't.
			[Key in keyof Source as Key extends KeyAliases<keyof Destination> ? never : KeepKey<Key, Source[Key]>]: SimplifyCopied<Source[Key], true>;
		} & {
			// Case in rule 3: Both the source and the destination contain the key.
			[Key in keyof Source as Key extends KeyAliases<keyof Destination> ? KeepMergedKey<Key, Required<Destination>[Extract<keyof Destination, KeyAliases<Key>>], Source[Key]> : never]:
			MergeDeepRecordProperty<Required<Destination>[Extract<keyof Destination, KeyAliases<Key>>], Required<Source>[Key], true, Options>;
		})
		: ({
			[Key in keyof Destination as Key extends KeyAliases<keyof Source> ? never : Key]: SimplifyDeepExcludeArray<Destination[Key]>;
		} & {
			[Key in keyof Source as Key extends KeyAliases<keyof Destination> ? never : Key]: SimplifyDeepExcludeArray<Source[Key]>;
		} & {
			[Key in keyof Source as Key extends KeyAliases<keyof Destination> ? Key : never]:
			MergeDeepRecordProperty<Required<Destination>[Extract<keyof Destination, KeyAliases<Key>>], Required<Source>[Key], false, Options>;
		});

/**
Wrapper around {@link DoMergeDeepRecord} which preserves index signatures.
*/
type MergeDeepRecord<
	Destination extends UnknownRecord,
	Source extends UnknownRecord,
	RemoveNever extends boolean,
	Options extends MergeDeepInternalOptions,
> = DoMergeDeepRecord<OmitIndexSignature<Destination>, OmitIndexSignature<Source>, RemoveNever, Options>
	& MergeDeepIndexSignatures<PickIndexSignature<Destination>, PickIndexSignature<Source>, RemoveNever, Options>;

/**
Like {@link DoMergeDeepRecord}, but for index signatures. A signature describes keys that each side may not have, so a key under a signature both sides share holds the destination's value, the source's value, or the two merged.
*/
type MergeDeepIndexSignatures<
	Destination extends UnknownRecord,
	Source extends UnknownRecord,
	RemoveNever extends boolean,
	Options extends MergeDeepInternalOptions,
> = RemoveNever extends true
	? ({
		[Key in keyof Destination as Key extends keyof Source ? never : KeepKey<Key, Destination[Key]>]: SimplifyCopied<Destination[Key], true>;
	} & {
		[Key in keyof Source as Key extends keyof Destination ? never : KeepKey<Key, Source[Key]>]: SimplifyCopied<Source[Key], true>;
	} & {
		[Key in keyof Source as Key extends keyof Destination ? KeepKey<Key, Destination[Key] | Source[Key]> : never]: SimplifyCopied<Destination[Key] | Source[Key] | MergeDeepRecordProperty<Destination[Key], Source[Key], true, Options>, true>;
	})
	: ({
		[Key in keyof Destination as Key extends keyof Source ? never : Key]: SimplifyDeepExcludeArray<Destination[Key]>;
	} & {
		[Key in keyof Source as Key extends keyof Destination ? never : Key]: SimplifyDeepExcludeArray<Source[Key]>;
	} & {
		[Key in keyof Source as Key extends keyof Destination ? Key : never]: SimplifyDeepExcludeArray<Destination[Key] | Source[Key] | MergeDeepRecordProperty<Destination[Key], Source[Key], false, Options>>;
	});

// Helper to avoid computing ArrayTail twice.
type PickRestTypeHelper<Tail extends UnknownArray, Type> = Tail extends [] ? Type : PickRestType<Tail>;

/**
Get the rest element of an array type, as an array.

@example
```
type Rest1 = PickRestType<[]>; // => []
type Rest2 = PickRestType<[string]>; // => []
type Rest3 = PickRestType<[...number[]]>; // => number[]
type Rest4 = PickRestType<[string, ...number[]]>; // => number[]
type Rest5 = PickRestType<string[]>; // => string[]
```
*/
type PickRestType<Type extends UnknownArray> = number extends Type['length']
	? PickRestTypeHelper<ArrayTail<Type>, Type>
	: [];

// Helper to avoid computing ArrayTail twice.
type OmitRestTypeHelper<
	Tail extends UnknownArray,
	Type extends UnknownArray,
	Result extends UnknownArray = [],
> = Tail extends []
	? Result
	: Type extends readonly [unknown, ...unknown[]]
		? OmitRestType<Tail, [...Result, FirstArrayElement<Type>]>
		: OmitRestType<Tail, [...Result, FirstArrayElement<Type>?]>;

/**
Get the elements of an array type, without the rest element.

@example
```
type Tuple1 = OmitRestType<[]>; // => []
type Tuple2 = OmitRestType<[string]>; // => [string]
type Tuple3 = OmitRestType<[...number[]]>; // => []
type Tuple4 = OmitRestType<[string, ...number[]]>; // => [string]
type Tuple5 = OmitRestType<[string, boolean[], ...number[]]>; // => [string, boolean[]]
type Tuple6 = OmitRestType<string[]>; // => []
```
*/
type OmitRestType<Type extends UnknownArray, Result extends UnknownArray = []> = number extends Type['length']
	? OmitRestTypeHelper<ArrayTail<Type>, Type, Result>
	: Type;

/**
Try to merge two array/tuple elements, or return the source element when their types cannot be merged.

An `any` or `never` element is an actual source value, so it is handled by `MergeDeepOrReturn` rather than being interpreted as a missing rest element.
*/
type MergeDeepArrayOrTupleElements<
	Destination,
	Source,
	RemoveNever extends boolean,
	Options extends MergeDeepInternalOptions,
> = MergeDeepOrReturn<Source, Destination, Source, RemoveNever, Options>;

/**
Merge the rest arrays of two tuples. An empty rest has no indices, so the other rest is copied into a fresh mutable array instead of being passed as an element value.

The rest types are passed as arrays so they are computed once and their absence is kept distinct from an actual empty-array element.
*/
type MergeDeepRestArrays<
	Destination extends UnknownArray,
	Source extends UnknownArray,
	RemoveNever extends boolean,
	Options extends MergeDeepInternalOptions,
> = Destination extends readonly []
	? Writable<Source>
	: Source extends readonly []
		? Writable<Destination>
		: MergeDeepArrayOrTupleElements<Destination, Source, RemoveNever, Options>;

/**
Merge two tuples recursively, accumulating merged positions so the traversal stays tail-recursive.
*/
type DoMergeDeepTupleAndTupleRecursive<
	Destination extends UnknownArray,
	Source extends UnknownArray,
	DestinationRestType extends UnknownArray,
	SourceRestType extends UnknownArray,
	RemoveNever extends boolean,
	Options extends MergeDeepInternalOptions,
	Result extends UnknownArray = [],
> = Destination extends []
	? Source extends []
		? Result
		// A rest of `never[]` has no elements, the same as no rest at all, so it is not merged as an element of `never`, which would turn the merged element into `never`.
		: [...Result, ...([DestinationRestType[number]] extends [never]
			? Writable<Source>
			: MergeArrayTypeAndTuple<DestinationRestType[number], Source, RemoveNever, Options>)]
	: Source extends []
		? [...Result, ...([SourceRestType[number]] extends [never]
			? Writable<Destination>
			: MergeTupleAndArrayType<Destination, SourceRestType[number], RemoveNever, Options>)]
		: DoMergeDeepTupleAndTupleRecursive<
			ArrayTail<Destination>, ArrayTail<Source>, DestinationRestType, SourceRestType, RemoveNever, Options,
			[
				...Result,
				// The merged position is optional only when both inputs make it optional. A required element on either side guarantees the position exists.
				...And<
					Destination extends readonly [unknown, ...unknown[]] ? false : true,
					Source extends readonly [unknown, ...unknown[]] ? false : true
				> extends true
					? [MergeDeepArrayOrTupleElements<FirstArrayElement<Destination>, FirstArrayElement<Source>, RemoveNever, Options>?]
					: [MergeDeepArrayOrTupleElements<FirstArrayElement<Destination>, FirstArrayElement<Source>, RemoveNever, Options>],
			]
		>;

/**
Merge two tuples recursively taking into account a possible rest element.
*/
type MergeDeepTupleAndTupleRecursive<
	Destination extends UnknownArray,
	Source extends UnknownArray,
	RemoveNever extends boolean,
	Options extends MergeDeepInternalOptions,
> = [
	...DoMergeDeepTupleAndTupleRecursive<OmitRestType<Destination>, OmitRestType<Source>, PickRestType<Destination>, PickRestType<Source>, RemoveNever, Options>,
	...MergeDeepRestArrays<PickRestType<Destination>, PickRestType<Source>, RemoveNever, Options>,
];

/**
Merge an array type with a tuple recursively, accumulating merged positions so the traversal stays tail-recursive.
*/
type MergeTupleAndArrayType<
	Tuple extends UnknownArray,
	ArrayType,
	RemoveNever extends boolean,
	Options extends MergeDeepInternalOptions,
	Result extends UnknownArray = [],
> = Tuple extends []
	? Result
	: MergeTupleAndArrayType<
		ArrayTail<Tuple>, ArrayType, RemoveNever, Options,
		[...Result, ...Tuple extends readonly [unknown, ...unknown[]]
			? [MergeDeepArrayOrTupleElements<FirstArrayElement<Tuple>, ArrayType, RemoveNever, Options>]
			: [MergeDeepArrayOrTupleElements<FirstArrayElement<Tuple>, ArrayType, RemoveNever, Options>?]]
	>;

/**
Merge an array into a tuple recursively taking into account a possible rest element.
*/
type MergeDeepTupleAndArrayRecursive<
	Destination extends UnknownArray,
	Source extends UnknownArray,
	RemoveNever extends boolean,
	Options extends MergeDeepInternalOptions,
> = [
	...MergeTupleAndArrayType<OmitRestType<Destination>, Source[number], RemoveNever, Options>,
	...MergeDeepRestArrays<PickRestType<Destination>, PickRestType<Source>, RemoveNever, Options>,
];

/**
Merge a tuple with an array type recursively, accumulating merged positions so the traversal stays tail-recursive.
*/
type MergeArrayTypeAndTuple<
	ArrayType,
	Tuple extends UnknownArray,
	RemoveNever extends boolean,
	Options extends MergeDeepInternalOptions,
	Result extends UnknownArray = [],
> = Tuple extends []
	? Result
	: MergeArrayTypeAndTuple<
		ArrayType, ArrayTail<Tuple>, RemoveNever, Options,
		[...Result, ...Tuple extends readonly [unknown, ...unknown[]]
			? [MergeDeepArrayOrTupleElements<ArrayType, FirstArrayElement<Tuple>, RemoveNever, Options>]
			: [MergeDeepArrayOrTupleElements<ArrayType, FirstArrayElement<Tuple>, RemoveNever, Options>?]]
	>;

/**
Merge a tuple into an array recursively taking into account a possible rest element.
*/
type MergeDeepArrayAndTupleRecursive<
	Destination extends UnknownArray,
	Source extends UnknownArray,
	RemoveNever extends boolean,
	Options extends MergeDeepInternalOptions,
> = [
	...MergeArrayTypeAndTuple<Destination[number], OmitRestType<Source>, RemoveNever, Options>,
	...MergeDeepRestArrays<PickRestType<Destination>, PickRestType<Source>, RemoveNever, Options>,
];

/**
Merge mode for array/tuple elements.
*/
type ArrayMergeMode = 'spread' | 'replace';

/**
Test if it should spread top-level arrays.
*/
type ShouldSpread<Options extends MergeDeepInternalOptions> = Options['spreadTopLevelArrays'] extends false
	? Options['arrayMergeMode'] extends 'spread' ? true : false
	: true;

/**
Merge two arrays/tuples according to the chosen {@link MergeDeepOptions.arrayMergeMode arrayMergeMode} option.
*/
type DoMergeArrayOrTuple<
	Destination extends UnknownArray,
	Source extends UnknownArray,
	Options extends MergeDeepInternalOptions,
> = ShouldSpread<Options> extends true
	? Array<Exclude<Destination, undefined>[number] | Exclude<Source, undefined>[number]>
	: Source; // 'replace'

/**
Merge two arrays recursively.

If the two arrays are multi-level, we merge deeply, otherwise we merge the first level only.

Note: The `[number]` accessor is used to test the type of the second level.
*/
type MergeDeepArrayRecursive<
	Destination extends UnknownArray,
	Source extends UnknownArray,
	RemoveNever extends boolean,
	Options extends MergeDeepInternalOptions,
> = Destination[number] extends UnknownArray
	? Source[number] extends UnknownArray
		// Only the top level is always spread, so the flag is turned off before recursing, the same way it is when descending into a property.
		? Array<MergeDeepArrayOrTupleRecursive<Destination[number], Source[number], RemoveNever, UndefinedToOptionalObject<Except<Options, 'spreadTopLevelArrays'> & {spreadTopLevelArrays: false}>>>
		: DoMergeArrayOrTuple<Destination, Source, Options>
	: Destination[number] extends UnknownRecord
		? Source[number] extends UnknownRecord
			// Distribute record variants before comparing their keys, like record properties and tuple elements.
			? Array<MergeDeepOrReturn<
				Source[number],
				Destination[number],
				Source[number],
				RemoveNever,
				UndefinedToOptionalObject<Except<Options, 'spreadTopLevelArrays'> & {spreadTopLevelArrays: false}>
			>>
			: DoMergeArrayOrTuple<Destination, Source, Options>
		: DoMergeArrayOrTuple<Destination, Source, Options>;

/**
Merge two array/tuple recursively by selecting one of the four strategies according to the type of inputs.

- tuple/tuple
- tuple/array
- array/tuple
- array/array
*/
type MergeDeepArrayOrTupleRecursive<
	Destination extends UnknownArray,
	Source extends UnknownArray,
	RemoveNever extends boolean,
	Options extends MergeDeepInternalOptions,
> = Destination extends readonly []
	// An empty destination has no element to merge with, so the source elements are kept in a fresh mutable array.
	? Writable<Source>
	// An empty source has no indices to replace, so the destination elements are kept in a fresh mutable array.
	: Source extends readonly []
		? Writable<Destination>
		// A tuple has a fixed first position even when all its elements are optional. `NonEmptyTuple` only matches tuples with a required first element.
		: '0' extends keyof Destination
			? '0' extends keyof Source
				? MergeDeepTupleAndTupleRecursive<Destination, Source, RemoveNever, Options>
				: MergeDeepTupleAndArrayRecursive<Destination, Source, RemoveNever, Options>
			: '0' extends keyof Source
				? MergeDeepArrayAndTupleRecursive<Destination, Source, RemoveNever, Options>
				: MergeDeepArrayRecursive<Destination, Source, RemoveNever, Options>;

/**
Merge two array/tuple according to {@link MergeDeepOptions.recurseIntoArrays recurseIntoArrays} option.
*/
type MergeDeepArrayOrTuple<
	Destination extends UnknownArray,
	Source extends UnknownArray,
	RemoveNever extends boolean,
	Options extends MergeDeepInternalOptions,
> = Options['recurseIntoArrays'] extends true
	? MergeDeepArrayOrTupleRecursive<Destination, Source, RemoveNever, Options>
	: DoMergeArrayOrTuple<Destination, Source, Options>;

/**
Try to merge two objects or two arrays/tuples recursively, or return the simplified source variant. A merged record only needs its outer map flattened, because `DoMergeDeepRecord` already simplifies each of its values.

Distribute the source before preparation, so a fallback cannot reintroduce unrelated source variants.
*/
type MergeDeepOrReturn<
	DefaultType,
	Destination,
	Source,
	RemoveNever extends boolean,
	Options extends MergeDeepInternalOptions,
> = [undefined] extends [Destination | Source]
	? SimplifyCopied<DefaultType, RemoveNever>
	: Source extends unknown
		? RemoveNever extends true
			? DoMergeDeepOrReturn<Source, SealRecord<Destination>, SealRecord<Source>, true, Options>
			: DoMergeDeepOrReturn<Source, Destination, Source, false, Options>
		: never;

/**
Merge prepared values while preserving terminal copied values.

Keep the copied source variant separate from the prepared and narrowed source: copying the narrowed conditional type directly increases declaration-checking work.
*/
type DoMergeDeepOrReturn<
	CopiedSource,
	Destination,
	Source,
	RemoveNever extends boolean,
	Options extends MergeDeepInternalOptions,
> = Destination extends UnknownRecord
	? Source extends UnknownRecord
		? SimplifyObject<MergeDeepRecord<Destination, Source, RemoveNever, Options>>
		: SimplifyCopied<CopiedSource, RemoveNever>
	: Destination extends UnknownArray
		? Source extends UnknownArray
			? MergeDeepArrayOrTuple<Destination, Source, RemoveNever, UndefinedToOptionalObject<Except<Options, 'spreadTopLevelArrays'> & {spreadTopLevelArrays: false}>>
			: SimplifyCopied<CopiedSource, RemoveNever>
		: SimplifyCopied<CopiedSource, RemoveNever>;

/**
Options for the `MergeDeep` type.

@see {@link MergeDeep}
*/
export type MergeDeepOptions = {
	/**
	Merge mode for array and tuple.

	When we walk through the properties of the objects and the same key is found and both are array or tuple, a merge mode must be chosen:
	- `replace`: Replaces the destination value by the source value. This is the default mode.
	- `spread`: Spreads the destination and the source values.

	An optional mode uses the default mode.

	See {@link MergeDeep} for usages and examples.

	Note: Top-level arrays and tuples are always spread.

	@default 'replace'
	*/
	arrayMergeMode?: ArrayMergeMode;

	/**
	Whether to affect the individual elements of arrays and tuples.

	If this option is set to `true` the following rules are applied:
	- If the source does not contain the key, the value of the destination is returned.
	- If the source contains the key and the destination does not contain the key, the value of the source is returned.
	- If both contain the key, try to merge according to the chosen {@link MergeDeepOptions.arrayMergeMode arrayMergeMode} or return the source if unable to merge.

	@default false
	*/
	recurseIntoArrays?: boolean;
};

/**
`MergeDeepOptions` with settings that are only used internally.
*/
type MergeDeepInternalOptions = Merge<MergeDeepOptions, {spreadTopLevelArrays?: boolean}>;

/**
Merge default and internal options with user provided options.
*/
type DefaultMergeDeepOptions<Options extends MergeDeepOptions> = ApplyDefaultOptions<MergeDeepInternalOptions, {
	arrayMergeMode: 'replace';
	recurseIntoArrays: false;
	spreadTopLevelArrays: true;
}, Options>;

/**
Selects the entry point and merges default options once.
*/
type MergeDeepWithDefaultOptions<Destination, Source, RemoveNever extends boolean, Options extends MergeDeepOptions> =
	[undefined] extends [Destination | Source]
		? never
		: Destination extends UnknownRecord
			? Source extends UnknownRecord
				? SimplifyObject<MergeDeepRecord<Destination, Source, RemoveNever, DefaultMergeDeepOptions<Options>>>
				// `object` is an object whose keys are unknown, but it is not assignable to `UnknownRecord`. It contributes no known keys, so it is merged as `{}`, the way the shallow `Merge` does. It is matched only after the record checks, so for a generic input, whose constraint is read through these checks, the `object` arms drop out instead of hiding its keys.
				: IsEqual<Source, object> extends true
					? MergeDeepWithDefaultOptions<Destination, {}, RemoveNever, Options>
					: never
			: Destination extends UnknownArray
				? Source extends UnknownArray
					? MergeDeepArrayOrTuple<Destination, Source, RemoveNever, DefaultMergeDeepOptions<Options>>
					: never
				: IsEqual<Destination, object> extends true
					// Two of them answer `object`.
					? IsEqual<Source, object> extends true
						? object
						: MergeDeepWithDefaultOptions<{}, Source, RemoveNever, Options>
					: never;

/**
Shared merge implementation for `MergeDeep` and `ModifyDeep`.

Keep the removal mode separate from user options: adding it to the options regresses generic and indexed option inference.
*/
export type _MergeDeep<
	Destination,
	Source,
	RemoveNever extends boolean,
	Options extends MergeDeepOptions = {},
> =
	// `any` satisfies every assignability check, so the guard inside `MergeDeepWithDefaultOptions` that asks whether `undefined` can reach the result fires for it and narrows the whole merge to `never`, which accepts nothing at all. An `any` on either side is returned as it is, which is what `ObjectMerge` does and what the per-property guard in `MergeDeepRecordProperty` assumes.
	IsAny<Destination> extends true
		? any
		: IsAny<Source> extends true
			? any
			: MergeDeepWithDefaultOptions<
				// Removal already visits merged and copied records. An eager input walk can hide a generic parent before raw-key selection.
				RemoveNever extends true ? SealRecord<Destination> : SimplifyDeepExcludeArray<Destination>,
				RemoveNever extends true ? SealRecord<Source> : SimplifyDeepExcludeArray<Source>,
				RemoveNever,
				Options
			>;

/**
Merge two objects or two arrays/tuples recursively into a new type.

- Properties that only exist in one object are copied into the new object.
- Properties that exist in both objects are merged if possible or replaced by the one of the source if not.
- Top-level arrays and tuples are always spread.
- A `readonly` array does not keep its `readonly` modifier when it is spread, because the result is a fresh array.
- A `number` index signature and a `string` one are not merged with each other, so `MergeDeep<{[x: number]: A}, {[x: string]: B}>` is `{[x: string]: B}`.
- By default, inner arrays and tuples are replaced. See {@link MergeDeepOptions.arrayMergeMode arrayMergeMode} option to change this behaviour.
- By default, individual array/tuple elements are not affected. See {@link MergeDeepOptions.recurseIntoArrays recurseIntoArrays} option to change this behaviour.

@example
```
import type {MergeDeep} from 'type-fest';

type Foo = {
	life: number;
	items: string[];
	a: {b: string; c: boolean; d: number[]};
};

type Bar = {
	name: string;
	items: number[];
	a: {b: number; d: boolean[]};
};

type FooBar1 = MergeDeep<Foo, Bar>;
// {
// 	life: number;
// 	name: string;
// 	items: number[];
// 	a: {b: number; c: boolean; d: boolean[]};
// }

type FooBar2 = MergeDeep<Foo, Bar, {arrayMergeMode: 'spread'}>;
// {
// 	life: number;
// 	name: string;
// 	items: (string | number)[];
// 	a: {b: number; c: boolean; d: (number | boolean)[]};
// }
```

@example
```
import type {MergeDeep} from 'type-fest';

// Merge two arrays
type ArrayMerge = MergeDeep<string[], number[]>; // => (string | number)[]

// Merge two tuples
type TupleMerge = MergeDeep<[1, 2, 3], ['a', 'b']>; // => (1 | 2 | 3 | 'a' | 'b')[]

// Merge an array into a tuple
type TupleArrayMerge = MergeDeep<[1, 2, 3], string[]>; // => (string | 1 | 2 | 3)[]

// Merge a tuple into an array
type ArrayTupleMerge = MergeDeep<number[], ['a', 'b']>; // => (number | 'b' | 'a')[]
```

@example
```
import type {MergeDeep, MergeDeepOptions} from 'type-fest';

type Foo = {foo: 'foo'; fooBar: string[]};
type Bar = {bar: 'bar'; fooBar: number[]};

type FooBar = MergeDeep<Foo, Bar>;
//=> {foo: 'foo'; bar: 'bar'; fooBar: number[]}

type FooBarSpread = MergeDeep<Foo, Bar, {arrayMergeMode: 'spread'}>;
//=> {foo: 'foo'; bar: 'bar'; fooBar: (string | number)[]}

type FooBarArray = MergeDeep<Foo[], Bar[]>;
//=> (Foo | Bar)[]

type FooBarArrayDeep = MergeDeep<Foo[], Bar[], {recurseIntoArrays: true}>;
//=> {foo: 'foo'; bar: 'bar'; fooBar: number[]}[]

type FooBarArraySpreadDeep = MergeDeep<Foo[], Bar[], {recurseIntoArrays: true; arrayMergeMode: 'spread'}>;
//=> {foo: 'foo'; bar: 'bar'; fooBar: (string | number)[]}[]

type FooBarTupleDeep = MergeDeep<[Foo, true, 42], [Bar, 'life'], {recurseIntoArrays: true}>;
//=> [{foo: 'foo'; bar: 'bar'; fooBar: number[]}, 'life', 42]

type FooBarTupleWithArrayDeep = MergeDeep<[Foo[], true], [Bar[], 'life', 42], {recurseIntoArrays: true}>;
//=> [{foo: 'foo'; bar: 'bar'; fooBar: number[]}[], 'life', 42]
```

@example
```
import type {MergeDeep, MergeDeepOptions} from 'type-fest';

declare function mergeDeep<Destination, Source, Options extends MergeDeepOptions = {}>(
	destination: Destination,
	source: Source,
	options?: Options,
): MergeDeep<Destination, Source, Options>;
```

@experimental This type is marked as experimental because it depends on {@link ConditionalSimplifyDeep} which itself is experimental.

Use {@link ModifyDeep} to also remove `never` keys from processed records. Copied or replaced array elements are kept unchanged.

@see {@link MergeDeepOptions}
@see {@link ModifyDeep}

@category Array
@category Object
@category Utilities
*/
export type MergeDeep<Destination, Source, Options extends MergeDeepOptions = {}> = _MergeDeep<Destination, Source, false, Options>;

export {};
