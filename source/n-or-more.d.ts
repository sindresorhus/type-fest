/**
Create a type of one or more items.

@category Utilities
*/
export type OneOrMore<T> = [T, ...T[]]; // NOrMore<T, 1>

// Draft: FixedLengthArray has bug https://github.com/sindresorhus/type-fest/issues/284 with
// the following proposed fix.  I can verify this fix greatly simplifies NOrMore<> below.

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
Create a type of N or more items.

@category Utilities
*/
export type NOrMore<T, N extends number> =
	N extends 0 ?
		T[] : // Zero or more
		[...FixedLengthArray<T, N>, ...T[]];
