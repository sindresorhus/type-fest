import type {MergeDeep} from './merge-deep';

type Index = string | number;

type UnknownArray = readonly [...unknown[]];

type InferIndexType<
	IndexType extends Index,
	IsNumberIndex extends boolean = false,
> = IsNumberIndex extends true
	? IndexType extends `${infer NumberKey extends number}`
		? NumberKey
		: never
	: IndexType;

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

type SetArrayIndex<
	Destination extends UnknownArray,
	CurrentIndex extends Index,
	RestIndex extends Index[],
	Value,
> = ['SetArrayIndex', Destination, CurrentIndex, RestIndex, Value];

type SetObjectIndex<
	Destination extends object,
	CurrentIndex extends Index,
	RestIndex extends Index[],
	Value,
> = `${CurrentIndex}` extends `${Exclude<keyof Destination, symbol>}`
	? {
		[Key in keyof Destination]: `${Exclude<Key, symbol>}` extends `${CurrentIndex}`
			? Destination[Key] extends object
				? MergeDeep<Destination[Key], SetPropertyFromPath<{}, RestIndex, Value>>
				: SetPropertyFromPath<Destination[Key], RestIndex, Value>
			: Destination[Key]
	}
	: MergeDeep<Destination, {[Key in CurrentIndex]: SetPropertyFromPath<{}, RestIndex, Value>}>;

type SetPropertyFromPath<
	Destination,
	Path extends Index[],
	Value,
> = Path extends [infer FirstIndex extends Index, ...infer RestIndex extends Index[]]
	? Destination extends UnknownArray
		? SetArrayIndex<Destination, FirstIndex, RestIndex, Value>
		: Destination extends object
			? SetObjectIndex<Destination, FirstIndex, RestIndex, Value>
			: Value
	: Value;

export type SetProperty<
	Destination extends object,
	DottedPath extends string,
	Value,
> = SetPropertyFromPath<Destination, SplitDottedPath<DottedPath>, Value>;
