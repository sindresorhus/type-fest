import type {IsEqual} from '../is-equal.d.ts';
import type {IsUnknown} from '../is-unknown.d.ts';
import type {UnknownArray} from '../unknown-array.d.ts';

/**
Obtain the parameters of a function type in a tuple.

This works even when the parameters type is a readonly array.
*/
export type FunctionParameters<T extends (...args: any) => any> = T extends (...args: infer P extends UnknownArray) => any ? P : never;

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
export type HasExplicitThis<
	FunctionType extends (...args: any) => any,
	This, Parameters_ extends UnknownArray, Return,
> = IsUnknown<This> extends true
	? IsEqual<ThisParameterType<FunctionType & ((this: Unique, ...args: Parameters_) => Return)>, Unique>
	: true;

export {};
