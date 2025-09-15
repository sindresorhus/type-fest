/**
Returns a boolean for whether the two given types are equal.

@link https://github.com/microsoft/TypeScript/issues/27024#issuecomment-421529650
@link https://stackoverflow.com/questions/68961864/how-does-the-equals-work-in-typescript/68963796#68963796

Use-cases:
- If you want to make a conditional branch based on the result of a comparison of two types.

@example
```
import type {IsEqual} from 'type-fest';

// This type returns a boolean for whether the given array includes the given item.
// `IsEqual` is used to compare the given array at position 0 and the given item and then return true if they are equal.
type Includes<Value extends readonly any[], Item> =
	Value extends readonly [Value[0], ...infer rest]
		? IsEqual<Value[0], Item> extends true
			? true
			: Includes<rest, Item>
		: false;
```

@category Type Guard
@category Utilities
*/
export type IsEqual<A, B> =
	_NonNever<A> extends [infer HeadA, ...infer TailA]
		? _NonNever<B> extends [infer HeadB, ...infer TailB]
			? IsEqual<HeadA, HeadB> extends true
				? [] extends TailA & TailB
					? IsEqual<TailA, TailB>
					: false
				: false
			: _IsEqual<A, B>
		: _IsEqual<A, B>;

// This is used directly as `IsEqual`. In this definition, it spits an error in the case of returns of type functions taking what tuple of tuple are intersected and it should be never. See `equalWrapedTupleIntersecToBeNeverAndNeverExpanded` in `test/is-equal.ts`.
export type _IsEqual<A, B> =
	(<G>() => G extends A & G | G ? 1 : 2) extends
	(<G>() => G extends B & G | G ? 1 : 2)
		? true
		: false;

// NonNullable is not appropriate for removing only never, as it also removes undefined, which causes test/includes.ts to fail.
type _NonNever<A> = (<G>() => G extends A & G | G ? 1 : 2) extends (<G>() => G extends never & G | G ? 1 : 2) ? 0 : A;
