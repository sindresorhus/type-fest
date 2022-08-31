import type {Merge} from './merge';
import type {Spread} from './spread';
import type {ConditionalExcept} from './conditional-except';
import type {ConditionalSimplify, ConditionalSimplifyDeep} from './conditional-simplify';
import type {
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
type IsMergeable<Destination, Source> = IsBothExtends<UnknownArrayOrTuple, Destination, Source> extends true
	? true
	: IsBothExtends<UnknownRecord, UnknownRecord, Source> extends true
		? true
		: false;

/**
Merge two array/tuple value or return the source.
*/
type MergeArrayValue<Destination, Source, Options extends MergeDeepOptions> = IsMergeable<Destination, Source> extends true
	? MergeDeep<Destination, Source, Options>
	: Options['arrayMergeMode'] extends 'merge-or-union'
		? Destination | Source
		: // Assume arrayMergeMode = 'merge-or-replace'
		Source;

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
		? IsMergeable<Destination[number], Source[number]> extends true
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
Strips `undefined` values on first and second levels.
*/
type StripUndefinedValues<Type> = ConditionalExcept<{
	[Key in keyof Type ]: Type[Key] extends UnknownRecord ? ConditionalSimplify<StripUndefinedValues<Type[Key]>> : Type[Key];
}, undefined>;

/**
Wrapper around {@link DoMergeRecord} which defines whether or not to strip `undefined` values.
*/
type MergeDeepRecord<
	Destination,
	Source,
	Options extends MergeDeepOptions,
> = Options['stripUndefinedValues'] extends true
	? StripUndefinedValues<DoMergeRecord<Destination, Source, Options>>
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

// Merge mode for object properties.
type MergeDeepRecordMode = 'merge-or-replace' | 'merge-or-union' | 'replace' | 'union';

// Merge mode for array/tuple elements.
type MergeDeepArrayMode = MergeDeepRecordMode | 'merge-or-spread' | 'spread';

/**
MergeDeep options.

@see MergeDeep
*/
export type MergeDeepOptions = {
	/**
	Should strip `undefined` values from the resulting type.

	@default false
	*/
	stripUndefinedValues?: boolean;

	/**
	Merge mode for object properties.

	When we walk through the properties of the objects and the same key is found in both, a merge mode must be chosen:
	- `merge-or-replace`: Try to merge the values for that key, otherwise replace the destination value by the source value.
	- `merge-or-union`: Try to merge the values for that key, otherwise union the destination value and the source value.
	- `replace`: Just replace the destination value by the source value.
	- `union`: Just union the destination value and the source value.

	See {@link MergeDeep} for usages and examples.

	@default 'merge-or-replace'
	*/
	recordMergeMode?: MergeDeepRecordMode;

	/**
	Merge mode for array/tuple elements.

	When we walk through the elements of the arrays and the same key is found in both, a merge mode must be chosen:
	- `merge-or-replace`: Try to merge the values for that key, otherwise replace the destination value by the source value.
	- `merge-or-spread`: Try to merge the values for that key, otherwise spread the destination value and the source value.
	- `merge-or-union`: Try to merge the values for that key, otherwise union the destination value and the source value.
	- `replace`: Just replace the destination value by the source value.
	- `spread`: Just spread the destination value and the source value.
	- `union`: Just union the destination value and the source value.

	See {@link MergeDeep} for usages and examples.

	@default 'spread'
	*/
	arrayMergeMode?: MergeDeepArrayMode;
};

// Default options that will be merged with user provided options.
type MergeDeepDefaultOptions = {
	stripUndefinedValues: false;
	recordMergeMode: 'merge-or-replace';
	arrayMergeMode: 'spread';
} & MergeDeepOptions;

/**
Merge two objects or two arrays/tuples recursively into a new type.

@see MergeDeepOptions

@experimental This type is marked as experimental because it depends on {@link ConditionalSimplify} which itself is experimental.

@example
```
import type {MergeDeep} from 'type-fest';

type Foo = {
	life: number;
	items: string[];
	a: {b: string; c: boolean};
};

interface Bar {
	name: string;
	items: number[];
	a: {b: number};
}

type FooBar = MergeDeep<Foo, Bar>;
// FooBar = {
// 	life: number;
// 	name: string;
// 	items: (string | number)[];
// 	a: {b: number; c: boolean};
// };

type FooBarUnion = MergeDeep<Foo, Bar, {recordMergeMode: 'union'}>;
// FooBarUnion = {
// 	name: string;
// 	life: number;
// 	items: string[] | number[];
// 	a: {b: string; c: boolean} | {b: number};
// };

type FooBarReplace = MergeDeep<Foo, Bar, {recordMergeMode: 'replace'}>;
// FooBarReplace = {
// 	name: string;
// 	life: number;
// 	items: number[];
// 	a: {b: number};
// };

type FooBarMergeUnion = MergeDeep<Foo, Bar, {recordMergeMode: 'merge-or-union'}>;
// FooBarMergeUnion = {
// 	name: string;
// 	life: number;
// 	items: (string | number)[];
// 	a: {b: string | number; c: boolean};
// };

type FooBarMergeReplace = MergeDeep<Foo, Bar, {recordMergeMode: 'merge-or-replace'}>;
// FooBarMergeReplace = {
// 	name: string;
// 	life: number;
// 	items: (string | number)[];
// 	a: {b: number; c: boolean};
// };
```

@example
```
import type {MergeDeep} from 'type-fest';

// Merge two arrays
type ArrayUnion = MergeDeep<string[], number[], {arrayMergeMode: 'union'}>; // => string[] | number[]
type ArraySpread = MergeDeep<string[], number[], {arrayMergeMode: 'spread'}>; // => (string | number)[]
type ArrayReplace = MergeDeep<string[], number[], {arrayMergeMode: 'replace'}>; // => number[]
type ArrayMergeUnion = MergeDeep<string[], number[], {arrayMergeMode: 'merge-or-union'}>; // => string[] | number[]
type ArrayMergeSpread = MergeDeep<string[], number[], {arrayMergeMode: 'merge-or-spread'}>; // => (string | number)[]
type ArrayMergeReplace = MergeDeep<string[], number[], {arrayMergeMode: 'merge-or-replace'}>; // => number[]

// Merge two tuples
type TupleUnion = MergeDeep<[1, 2, 3], ['a', 'b'], {arrayMergeMode: 'union'}>; // => [1, 2, 3] | ['a', 'b']
type TupleSpread = MergeDeep<[1, 2, 3], ['a', 'b'], {arrayMergeMode: 'spread'}>; // => (1 | 2 | 3 | 'a' | 'b')[]
type TupleReplace = MergeDeep<[1, 2, 3], ['a', 'b'], {arrayMergeMode: 'replace'}>; // => ['a', 'b']
type TupleMergeUnion = MergeDeep<[1, 2, 3], ['a', 'b'], {arrayMergeMode: 'merge-or-union'}>; // => [1 | 'a', 2 | 'b', 3]
type TupleMergeSpread = MergeDeep<[1, 2, 3], ['a', 'b'], {arrayMergeMode: 'merge-or-spread'}>; // => ['a', 'b', 3]
type TupleMergeReplace = MergeDeep<[1, 2, 3], ['a', 'b'], {arrayMergeMode: 'merge-or-replace'}>; // => ['a', 'b', 3]

// Merge an array into a tuple
type TupleArrayUnion = MergeDeep<[1, 2, 3], string[], {arrayMergeMode: 'union'}>; // => string[] | [1, 2, 3]
type TupleArraySpread = MergeDeep<[1, 2, 3], string[], {arrayMergeMode: 'spread'}>; // => (string | 1 | 2 | 3)[]
type TupleArrayReplace = MergeDeep<[1, 2, 3], string[], {arrayMergeMode: 'replace'}>; // => string[]
type TupleArrayMergeUnion = MergeDeep<[1, 2, 3], string[], {arrayMergeMode: 'merge-or-union'}>; // => [string | 1, string | 2, string | 3, ...string[]]
type TupleArrayMergeSpread = MergeDeep<[1, 2, 3], string[], {arrayMergeMode: 'merge-or-spread'}>; // => [string, string, string, ...string[]]
type TupleArrayMergeReplace = MergeDeep<[1, 2, 3], string[], {arrayMergeMode: 'merge-or-replace'}>; // => [string, string, string, ...string[]]

// Merge a tuple into an array
type ArrayTupleUnion = MergeDeep<number[], ['a', 'b'], {arrayMergeMode: 'union'}>; // => number[] | ['a', 'b']
type ArrayTupleSpread = MergeDeep<number[], ['a', 'b'], {arrayMergeMode: 'spread'}>; // => (number | 'b' | 'a')[]
type ArrayTupleReplace = MergeDeep<number[], ['a', 'b'], {arrayMergeMode: 'replace'}>; // => ['a', 'b']
type ArrayTupleMergeUnion = MergeDeep<number[], ['a', 'b'], {arrayMergeMode: 'merge-or-union'}>; // => [number | 'a', number | 'b', ...number[]]
type ArrayTupleMergeSpread = MergeDeep<number[], ['a', 'b'], {arrayMergeMode: 'merge-or-spread'}>; // => ['a', 'b', ...number[]]
type ArrayTupleMergeReplace = MergeDeep<number[], ['a', 'b'], {arrayMergeMode: 'merge-or-replace'}>; // => ['a', 'b', ...number[]]
```

@example
```
import type {MergeDeep} from 'type-fest';

type Position = {
	top: number;
	left: number;
};

type Size = {
	width: number;
	height: number;
};

// Merge two arrays
type ArrayUnion = MergeDeep<Position[], Size[], {arrayMergeMode: 'union'}>; //=> Position[] | Size[]
type ArraySpread = MergeDeep<Position[], Size[], {arrayMergeMode: 'spread'}>; // => (Position | Size)[]
type ArrayReplace = MergeDeep<Position[], Size[], {arrayMergeMode: 'replace'}>; // => Size[]
type ArrayUnion = MergeDeep<Position[], Size[], {arrayMergeMode: 'merge-or-union'}>; // => Array<Position & Size>
type ArraySpread = MergeDeep<Position[], Size[], {arrayMergeMode: 'merge-or-spread'}>; // => Array<Position & Size>
type ArrayReplace = MergeDeep<Position[], Size[], {arrayMergeMode: 'merge-or-replace'}>; // => Array<Position & Size>

// Merge two tuples
type FirstTuple = [Position, 42, true];
type SecondTuple = [Size, 'life'];

type ThirdTupleUnion = MergeDeep<FirstTuple, SecondTuple, {arrayMergeMode: 'union'}>; // => FirstTuple | SecondTuple;
type ThirdTupleSpread = MergeDeep<FirstTuple, SecondTuple, {arrayMergeMode: 'spread'}>; // => Array<true | 'life' | Position | Size | 42>;
type ThirdTupleReplace = MergeDeep<FirstTuple, SecondTuple, {arrayMergeMode: 'replace'}>; // => [Size, 'life'];
type ThirdTupleMergeUnion = MergeDeep<FirstTuple, SecondTuple, {arrayMergeMode: 'merge-or-union'}>; // => [Position & Size, 'life' | 42, true];
type ThirdTupleMergeSpread = MergeDeep<FirstTuple, SecondTuple, {arrayMergeMode: 'merge-or-spread'}>; // => [Position & Size, 'life', true];
type ThirdTupleMergeReplace = MergeDeep<FirstTuple, SecondTuple, {arrayMergeMode: 'merge-or-replace'}>; // => [Position & Size, 'life', true];
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
