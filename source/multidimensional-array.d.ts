export type MultidimensionalArray<Element, Dimensions extends number> = number extends Dimensions
	? Recursive<Element>
	: EQ<Dimensions, 0> extends true
		? Element
		: Array<MultidimensionalArray<Element, Subtract<Dimensions, 1>>>;

type Recursive<T> = Array<Recursive<T>>;

// The idea of the following comes from Ryan Dabler:
// https://itnext.io/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f
type Length<T extends any[]> = T extends {length: infer L}
	? L
	: never;

type BuildTuple<L extends number, T extends any[] = []> = T extends {length: L}
	? T
	: BuildTuple<L, [...T, any]>;

type Subtract<A extends number, B extends number> = BuildTuple<A> extends [...(infer U), ...BuildTuple<B>]
	? Length<U>
	: never;

type EQ<A, B> = A extends B
	? (B extends A ? true : false)
	: false;
