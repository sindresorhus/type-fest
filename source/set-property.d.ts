import type {FirstArrayElement, UnknownArrayOrTuple} from './internal';
import type {ConditionalSimplifyDeep} from './conditional-simplify';
import type {MergeDeep} from './merge-deep';

// Path index type shortcut
type Index = string | number;

// Used by `SplitDottedPath` to infer the type of index based on the format of the path.
type InferIndexType<
	IndexType extends Index,
	ShouldBeNumberIndex extends boolean = false,
> = ShouldBeNumberIndex extends true
	? IndexType extends `${infer NumberKey extends number}`
		? NumberKey
		: never
	: IndexType;

/**
Split a dotted path into a tuple of indexes.

- Numerical indexes are preserved when specified between `[]`.
- Indexes that contain dots can be escaped with the `\\` sequence.

@exemple
```
type Path2 = SplitDottedPath<'root'>; // ['root']
type Path3 = SplitDottedPath<'root.child'>; // ['root', 'child']
type Path4 = SplitDottedPath<'root.child.0'>; // ['root', 'child', '0']
type Path5 = SplitDottedPath<'root.child[0]'>; // ['root', 'child', 0]
type Path6 = SplitDottedPath<'root.child[0].1'>; // ['root', 'child', 0, '1']
type Path7 = SplitDottedPath<'root.dot\\.dot.child'>; // ['root', 'dot.dot', 'child']
```
*/
type SplitDottedPath<
	Path extends string,
	CurrentIndex extends Index = '',
	IsFirstIndex extends boolean = true,
	IsEscapedDot extends boolean = false,
	IsNumberIndex extends boolean = false,
> = Path extends `${infer Char}${infer Tail}`
	? Char extends ']'
		? [...SplitDottedPath<Tail, CurrentIndex, false, false, true>]
		: Char extends '\\'
			? [...SplitDottedPath<Tail, CurrentIndex, false, true>]
			: Char extends '.' | '['
				? IsEscapedDot extends false
					? [Char, true] extends ['[', IsFirstIndex]
						? [...SplitDottedPath<Tail, '', false>]
						: [InferIndexType<CurrentIndex, IsNumberIndex>, ...SplitDottedPath<Tail, '', false>]
					: [...SplitDottedPath<Tail, `${CurrentIndex}${Char}`, false>]
				: [...SplitDottedPath<Tail, `${CurrentIndex}${Char}`, false>]
	: [InferIndexType<CurrentIndex, IsNumberIndex>];

type NextIndexType<RestIndex extends Index[]> = FirstArrayElement<RestIndex> extends number ? never[] : {};

type SetPropertyFromNextIndex<PathRest extends Index[], Value> = SetPropertyFromPath<NextIndexType<PathRest>, PathRest, Value>;

type GetTypeAtIndex<
	Destination extends UnknownArrayOrTuple,
	CurrentIndex extends Index,
	RestIndex extends Index[],
	Value,
> = [
	Destination[number]
	| (CurrentIndex extends 0 ? Destination[number] : null)
	| SetPropertyFromPath<NextIndexType<RestIndex>, RestIndex, Value>,
][number];

type SetOrCreateArrayOrTupleAtIndex<
	Destination extends UnknownArrayOrTuple,
	TargetIndex extends Index,
	PathRest extends Index[],
	Value,
> = TargetIndex extends number
	? Destination extends unknown[]
		? Array<GetTypeAtIndex<Destination, TargetIndex, PathRest, Value>>
		: ReadonlyArray<GetTypeAtIndex<Destination, TargetIndex, PathRest, Value>>
	: never; // Cannot use string index;

type CreateObjectAtIndex<
	Destination extends object,
	TargetIndex extends Index,
	PathRest extends Index[],
	Value,
> = MergeDeep<Destination, {[Key in TargetIndex]: SetPropertyFromNextIndex<PathRest, Value>}>;

type SetObjectAtIndex<
	Destination extends object,
	TargetIndex extends Index,
	PathRest extends Index[],
	Value,
> = {
	[Key in keyof Destination]: `${Exclude<Key, symbol>}` extends `${TargetIndex}`
		? PathRest extends []
			? Value
			: Destination[Key] extends object
				? SetPropertyFromPath<Destination[Key], PathRest, Value>
				: SetPropertyFromNextIndex<PathRest, Value>
		: Destination[Key];
};

type SetOrCreateObjectAtIndex<
	Destination extends object,
	TargetIndex extends Index,
	PathRest extends Index[],
	Value,
> = `${TargetIndex}` extends `${Exclude<keyof Destination, symbol>}`
	? SetObjectAtIndex<Destination, TargetIndex, PathRest, Value>
	: CreateObjectAtIndex<Destination, TargetIndex, PathRest, Value>;

// Set a deeply-nested property to an object using a tuple of indexes making the difference between arrays/tuples and other object types.
type SetPropertyFromPath<
	Destination,
	Path extends Index[],
	Value,
> = Path extends [infer FirstIndex extends Index, ...infer PathRest extends Index[]]
	? Destination extends UnknownArrayOrTuple
		? SetOrCreateArrayOrTupleAtIndex<Destination, FirstIndex, PathRest, Value>
		: Destination extends object
			? SetOrCreateObjectAtIndex<Destination, FirstIndex, PathRest, Value>
			: Value
	: Value;

/**
Set a deeply-nested property to an object using a dotted path string or a tuple of indexes.

@exemple
```
```

@category Object
*/
export type SetProperty<
	Destination extends object,
	Path extends string | Index[],
	Value,
> = ConditionalSimplifyDeep<SetPropertyFromPath<Destination, Path extends string ? SplitDottedPath<Path> : Path, Value>, Function>;
