type Index = string | number;

type InferIndexType<
	IndexType extends Index,
	IsNumberIndex extends boolean = false,
> = IsNumberIndex extends true
	? IndexType extends `${infer NumberKey extends number}`
		? NumberKey
		: never
	: IndexType;

export type SplitDottedPath<
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

export type SetProperty<
	Destination extends object,
	Path extends string,
	Value,
> = [Destination, SplitDottedPath<Path>, Value];
