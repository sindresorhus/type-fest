/**
Create a type of one or more elements.

@category Utilities
*/
export type NonEmpty<T> = [T, ...T[]]; // MinimumN<T, 1>

// Draft: FixedLengthArray has bug https://github.com/sindresorhus/type-fest/issues/284 with
// the following proposed fix.  I can verify this fix greatly simplifies MinimumN<> below.

type Helper<Element, Length extends number, Rest extends Element[]> =
	Rest['length'] extends Length ?
		Rest :
		Helper<Element, Length, [Element, ...Rest]>;

type FixedLengthArray<Element, Length extends number> =
	Length extends Length ?
	(number extends Length ?
		Element[] :
		Helper<Element, Length, []>) :
	never;

/**
Create a type of N or more elements.

@category Utilities
*/
export type MinimumN<T, N extends number> =
	N extends 0 ?
		T[] : // Zero or more
		[...FixedLengthArray<T, N>, ...T[]];
