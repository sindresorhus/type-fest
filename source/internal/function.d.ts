import type {IntRange} from '../int-range.d.ts';
import type {IsEqual} from '../is-equal.d.ts';
import type {IsUnknown} from '../is-unknown.d.ts';
import type {Sum} from '../sum.d.ts';
import type {UnknownArray} from '../unknown-array.d.ts';

/**
Obtain the parameters of a function type in a tuple.

This works even when the parameters type is a readonly array.
*/
export type Parameters<T extends (...args: any) => any> = T extends (...args: infer P extends UnknownArray) => any ? P : never;

/*
Internal documentation: TypeScript's overload enumeration behavior
========================================================================

Understanding how TypeScript enumerates overloads from an intersection type is essential for understanding (and correctly using) `CollectOverloads`.

## Overload enumeration

Given an intersection of function types (e.g. `F1 & F2 & F3`), TypeScript builds an overload list by scanning left to right and **deduplicating**:

- Two overloads with the same (This, Parameters, Return) are considered duplicates. The first one wins; later ones are dropped.
- HOWEVER, if one or both of the overloads has **implicit `this`** (i.e. no `this` annotation), the comparison ignores `This` and only checks (Parameters, Return). This means an implicit-`this` overload and an explicit-`this` overload with the same params/return are considered duplicates, and whichever appears first wins.

Example (F1 = implicit this, F1wT<T> = explicit this: T, same params/return):

  F1 & F1wT<1> & F1wT<2>
  → Enumerated as: [F1]
    F1wT<1> has same (P,R) as F1 (implicit) → duplicate, dropped.
    F1wT<2> likewise dropped.

  F1wT<1> & F1 & F1wT<2>
  → Enumerated as: [F1wT<1>, F1wT<2>]
    F1 has same (P,R) as F1wT<1>, and F1 is implicit → duplicate, dropped.
    F1wT<2> vs F1wT<1>: both explicit, This differs → NOT duplicate, kept.

## Pattern matching: `X extends (this: T, ...args: P) => R`

TypeScript enumerates the overloads of X as above, replaces implicit `this` with `this: unknown`, then matches the **rightmost** overload satisfying the constraint on the right-hand side.
*/

declare const unique: unique symbol;
type Unique = typeof unique;

/**
Detect whether an overload with the given (This, Parameters, Return) has an explicit `this` annotation in the original function type.

Intersects `(this: Unique, ...args: Parameters) => Return` onto the function type from the right. Per TypeScript's deduplication rules (see "Overload enumeration" above), implicit `this` absorbs the sentinel (same (P,R), one implicit -- first-wins), so `ThisParameterType` stays `unknown`. Explicit `this: unknown` does not absorb it (both explicit, different `This` -- not duplicate), so the sentinel becomes the last overload and `ThisParameterType` returns `Unique`.
*/
type HasExplicitThis<
	FunctionType extends (...args: any) => any,
	This, Parameters_ extends UnknownArray, Return,
> = IsUnknown<This> extends true
	? IsEqual<ThisParameterType<FunctionType & ((this: Unique, ...args: Parameters_) => Return)>, Unique>
	: true;

type MaxOverloadPatterns = 4;
type OverloadIndex = IntRange<0, MaxOverloadPatterns>;
/**
Extract the Nth-from-last (N < MaxOverloadPatterns) overload of a function type as a standalone function, correctly preserving implicit `this` (omitted) vs explicit `this` (kept).
*/
type NthLastOverload<F extends (...args: any) => any, N extends OverloadIndex> = F extends {
	(this: infer T3, ...args: infer P3 extends UnknownArray): infer R3;
	(this: infer T2, ...args: infer P2 extends UnknownArray): infer R2;
	(this: infer T1, ...args: infer P1 extends UnknownArray): infer R1;
	(this: infer T0, ...args: infer P0 extends UnknownArray): infer R0;
}
	? ({
		3: [T3, P3, R3];
		2: [T2, P2, R2];
		1: [T1, P1, R1];
		0: [T0, P0, R0];
	}[N] extends [infer T, infer P extends UnknownArray, infer R]
		? HasExplicitThis<F, T, P, R> extends true
				? (this: T, ...args: P) => R
				: (...args: P) => R
		: never)
	: never;

/**
Extracts TypeScript's enumerated overload list into a tuple (see "Overload enumeration" above).

`AllOverloads` defaults to `(() => Unique) & F`, prepending a `() => Unique` sentinel that marks the boundary of the original overloads. Each iteration extracts `NthLastOverload<AllOverloads, N>` and then checks whether intersecting the extracted overload onto `AllOverloads` changes what position N sees:

- **Effect observed** (the two differ): the intersection advanced the view. Output `ExtractedN`, intersect it onto `AllOverloads`, and continue with the same N.
- **No effect** (they are equal): the intersection would not advance the view (e.g. aliasing generic overloads that infer to the same concrete signature). Output `ExtractedN` without intersecting, and advance N to the next position.
- **Sentinel hit** (`NthLastOverload` returns `undefined`): no original overload at this depth. Return the accumulated result.

The loop terminates when either N exceeds `OverloadIndex` or the sentinel is reached.

@see https://github.com/microsoft/TypeScript/issues/32164#issuecomment-1146737709
*/
export type CollectOverloads<
	F extends (...args: any) => any,
	AllOverloads extends (...args: any) => any = (() => Unique) & F,
	N extends OverloadIndex = 0,
	ResultOverloads extends Array<(...args: any) => any> = [],
> = NthLastOverload<AllOverloads, N> extends infer ExtractedN extends (...args: any) => any
	? IsEqual<ExtractedN, () => Unique> extends true
		? ResultOverloads
		: IsEqual<NthLastOverload<ExtractedN & AllOverloads, N>, ExtractedN> extends true
			? Sum<N, 1> extends infer NextN extends OverloadIndex
				? CollectOverloads<F, AllOverloads, NextN, [ExtractedN, ...ResultOverloads]>
				: [ExtractedN, ...ResultOverloads]
			: CollectOverloads<F, ExtractedN & AllOverloads, N, [ExtractedN, ...ResultOverloads]>
	: never;

export {};
