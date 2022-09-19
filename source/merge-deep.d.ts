import type {ConditionalSimplifyDeep} from './conditional-simplify';
import type {OmitIndexSignature} from './omit-index-signature';
import type {PickIndexSignature} from './pick-index-signature';
import type {EnforceOptional} from './enforce-optional';
import type {Merge} from './merge';
import type {
	ArrayTail,
	FirstArrayElement,
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
- If both contain the key, try to merge according to the chosen {@link MergeDeepOptions options} or return the source if unable to merge.
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
Pick the rest type.

@example
```
type Rest1 = PickRestType<[]>; // => []
type Rest2 = PickRestType<[string]>; // => []
type Rest3 = PickRestType<[...number[]]>; // => number[]
type Rest4 = PickRestType<[string, ...number[]]>; // => number[]
type Rest5 = PickRestType<string[]>; // => string[]
```
*/
type PickRestType<Type extends UnknownArrayOrTuple> = number extends Type['length']
	? ArrayTail<Type> extends [] ? Type : PickRestType<ArrayTail<Type>>
	: [];

/**
Omit the rest type.

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
type OmitRestType<Type extends UnknownArrayOrTuple, Result extends UnknownArrayOrTuple = []> = number extends Type['length']
	? ArrayTail<Type> extends [] ? Result : OmitRestType<ArrayTail<Type>, [...Result, FirstArrayElement<Type>]>
	: Type;

// Utility to avoid picking two times the type.
type TypeNumberOrType<Type extends UnknownArrayOrTuple> = Type[number] extends never ? Type : Type[number];

// Pick the rest type (array) and try to get the intrinsic type or return the provided type.
type PickRestTypeFlat<Type extends UnknownArrayOrTuple> = TypeNumberOrType<PickRestType<Type>>;

/**
Try to merge two array/tuple elements or return the source element if the end of the destination is reached or vis-versa.
*/
type MergeDeepArrayOrTupleElements<
	Destination,
	Source,
	Options extends MergeDeepOptions,
> = Source extends []
	? Destination
	: Destination extends []
		? Source
		: MergeDeepOrReturn<Source, Destination, Source, Options>;

/**
Merge two tuples recursively.
*/
type DoMergeDeepTupleAndTupleRecursive<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	DestinationRestType,
	SourceRestType,
	Options extends MergeDeepOptions,
> = Destination extends []
	? Source extends []
		? []
		: MergeArrayTypeAndTuple<DestinationRestType, Source, Options>
	: Source extends []
		? MergeTupleAndArrayType<Destination, SourceRestType, Options>
		: [
			MergeDeepArrayOrTupleElements<FirstArrayElement<Destination>, FirstArrayElement<Source>, Options>,
			...DoMergeDeepTupleAndTupleRecursive<ArrayTail<Destination>, ArrayTail<Source>, DestinationRestType, SourceRestType, Options>,
		];

/**
Merge two tuples recursively taking into account a possible rest element.
*/
type MergeDeepTupleAndTupleRecursive<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepOptions,
> = [
	...DoMergeDeepTupleAndTupleRecursive<OmitRestType<Destination>, OmitRestType<Source>, PickRestTypeFlat<Destination>, PickRestTypeFlat<Source>, Options>,
	...MergeDeepArrayOrTupleElements<PickRestType<Destination>, PickRestType<Source>, Options>,
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
		MergeDeepArrayOrTupleElements<FirstArrayElement<Tuple>, ArrayType, Options>,
		...MergeTupleAndArrayType<ArrayTail<Tuple>, ArrayType, Options>,
	];

/**
Merge an array into a tuple recursively taking into account a possible rest element.
*/
type MergeDeepTupleAndArrayRecursive<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepOptions,
> = [
	...MergeTupleAndArrayType<OmitRestType<Destination>, Source[number], Options>,
	...MergeDeepArrayOrTupleElements<PickRestType<Destination>, PickRestType<Source>, Options>,
];

/**
Merge a tuple with an array type recursively.
*/
type MergeArrayTypeAndTuple<
	ArrayType,
	Tuple extends UnknownArrayOrTuple,
	Options extends MergeDeepOptions,
> = Tuple extends []
	? Tuple
	: [
		MergeDeepArrayOrTupleElements<ArrayType, FirstArrayElement<Tuple>, Options>,
		...MergeArrayTypeAndTuple<ArrayType, ArrayTail<Tuple>, Options>,
	];

/**
Merge a tuple into an array recursively taking into account a possible rest element.
*/
type MergeDeepArrayAndTupleRecursive<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepOptions,
> = [
	...MergeArrayTypeAndTuple<Destination[number], OmitRestType<Source>, Options>,
	...MergeDeepArrayOrTupleElements<PickRestType<Destination>, PickRestType<Source>, Options>,
];

/**
Merge mode for array/tuple elements.
*/
type ArrayMergeMode = 'spread' | 'replace';

/**
Merge two arrays/tuples according to the chosen {@link MergeDeepOptions.arrayMergeMode arrayMergeMode} option.
*/
type DoMergeArrayOrTuple<
	Destination extends UnknownArrayOrTuple,
	Source extends UnknownArrayOrTuple,
	Options extends MergeDeepOptions,
> = Options['arrayMergeMode'] extends 'spread'
	? Array<Exclude<Destination, undefined>[number] | Exclude<Source, undefined>[number]>
	: Source; // 'replace'

/**
Merge two arrays recursively.

If the two arrays are multi-level, we merge deeply, otherwise we merge the first level only.

Note: The `[number]` accessor is used to test the type of the second level.
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
Merge two array/tuple recursively by selecting one of the four strategies according to the type of inputs.

- tuple/tuple
- tuple/array
- array/tuple
- array/array
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
Merge two array/tuple according to {@link MergeDeepOptions.recurseIntoArrays recurseIntoArrays} option.
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

	See {@link MergeDeep} for usages and examples.

	@default 'spread'
	*/
	arrayMergeMode?: ArrayMergeMode;

	/**
	Whether to affect the individual elements of arrays and tuples.

	If this option is set to `true` the same merge rules as for object properties are applied:

	- Elements that only exist in one array are copied into the new array.
	- Elements that exist in both arrays are merged if possible or replaced by the one of the source if not.
	- By default, top-level arrays and tuples are spread. See {@link MergeDeepOptions.arrayMergeMode arrayMergeMode} option to change this behaviour.

	@default false
	*/
	recurseIntoArrays?: boolean;
};

/**
Merge record default options with user provided options.
*/
type MergeDeepRecordOptions<Options extends MergeDeepOptions> = Merge<{
	arrayMergeMode: 'replace';
	recurseIntoArrays: false;
}, Options>;

/**
Merge array default options with user provided options.
*/
type MergeDeepArrayOrTupleOptions<Options extends MergeDeepOptions> = Merge<{
	arrayMergeMode: 'spread';
	recurseIntoArrays: false;
}, Options>;

/**
This utility selects the correct entry point with the corresponding default options. This avoids re-merging the options at each iteration.
*/
type MergeDeepWithDefaultOptions<Destination, Source, Options extends MergeDeepOptions> = SimplifyDeep<
[undefined] extends [Destination | Source]
	? never
	: Destination extends UnknownRecord
		? Source extends UnknownRecord
			? MergeDeepRecord<Destination, Source, MergeDeepRecordOptions<Options>>
			: never
		: Destination extends UnknownArrayOrTuple
			? Source extends UnknownArrayOrTuple
				? MergeDeepArrayOrTuple<Destination, Source, MergeDeepArrayOrTupleOptions<Options>>
				: never
			: never
>;

/**
Merge two objects or two arrays/tuples recursively into a new type.

- Properties that only exist in one object are copied into the new object.
- Properties that exist in both objects are merged if possible or replaced by the one of the source if not.
- By default, top-level arrays and tuples are spread. See {@link MergeDeepOptions.arrayMergeMode arrayMergeMode} option to change this behaviour.
- By default, individual array elements are not affected. See {@link MergeDeepOptions.recurseIntoArrays recurseIntoArrays} option to change this behaviour.

@example
```
import type {MergeDeep} from 'type-fest';

type Foo = {
	life: number;
	items: string[];
	a: {b: string; c: boolean; d: number[]};
};

interface Bar {
	name: string;
	items: number[];
	a: {b: number; d: boolean[]};
}

type FooBar = MergeDeep<Foo, Bar>;
// {
// 	life: number;
// 	name: string;
// 	items: (string | number)[];
// 	a: {b: number; c: boolean; d: (number | boolean)[]};
// }

type FooBar = MergeDeep<Foo, Bar, {arrayMergeMode: 'replace'}>;
// {
// 	life: number;
// 	name: string;
// 	items: number[];
// 	a: {b: number; c: boolean; d: boolean[]};
// }
```

@example
```
import type {MergeDeep} from 'type-fest';

// Merge two arrays
type ArraySpread = MergeDeep<string[], number[], {arrayMergeMode: 'spread'}>; // => (string | number)[]
type ArrayReplace = MergeDeep<string[], number[], {arrayMergeMode: 'replace'}>; // => number[]

// Merge two tuples
type TupleSpread = MergeDeep<[1, 2, 3], ['a', 'b'], {arrayMergeMode: 'spread'}>; // => (1 | 2 | 3 | 'a' | 'b')[]
type TupleReplace = MergeDeep<[1, 2, 3], ['a', 'b'], {arrayMergeMode: 'replace'}>; // => ['a', 'b']

// Merge an array into a tuple
type TupleArraySpread = MergeDeep<[1, 2, 3], string[], {arrayMergeMode: 'spread'}>; // => (string | 1 | 2 | 3)[]
type TupleArrayReplace = MergeDeep<[1, 2, 3], string[], {arrayMergeMode: 'replace'}>; // => string[]

// Merge a tuple into an array
type ArrayTupleSpread = MergeDeep<number[], ['a', 'b'], {arrayMergeMode: 'spread'}>; // => (number | 'b' | 'a')[]
type ArrayTupleReplace = MergeDeep<number[], ['a', 'b'], {arrayMergeMode: 'replace'}>; // => ['a', 'b']
```

@example
```
import type {MergeDeep, MergeDeepOptions} from 'type-fest';

type Foo = {foo: 'foo'; fooBar: string[]};
type Bar = {bar: 'bar'; fooBar: number[]};

type FooBar = MergeDeep<Foo, Bar>;
// { foo: "foo"; bar: "bar"; fooBar: (string | number)[]}

type FooBarArray = MergeDeep<Foo[], Bar[]>;
// (Foo | Bar)[]

type FooBarArrayDeep = MergeDeep<Foo[], Bar[], {recurseIntoArrays: true}>;
// FooBar[]

type FooBarTupleDeep = MergeDeep<[Foo, true, 42], [Bar, 'life'], {recurseIntoArrays: true}>;
// [FooBar, 'life', 42]

type FooBarTupleWithArrayDeep = MergeDeep<[Foo[], true], [Bar[], 'life', 42], {recurseIntoArrays: true}>;
// [FooBar[], 'life', 42]
```

@example
```
import type {MergeDeep, MergeDeepOptions} from 'type-fest';

function mergeDeep<Destination, Source, Options extends MergeDeepOptions = {}>(
	destination: Destination,
	source: Source,
	options?: Options,
): MergeDeep<Destination, Source, Options> {
	// Make your implementation ...
}
```

@experimental This type is marked as experimental because it depends on {@link ConditionalSimplifyDeep} which itself is experimental.

@see {@link MergeDeepOptions}

@category Array
@category Object
@category Utilities
*/
export type MergeDeep<Destination, Source, Options extends MergeDeepOptions = {}> = MergeDeepWithDefaultOptions<
SimplifyDeep<Destination>,
SimplifyDeep<Source>,
Options
>;
