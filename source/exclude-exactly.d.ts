import type {IsUnknown} from './is-unknown.d.ts';
import type {IsNever} from './is-never.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {LastOfUnion} from './last-of-union.d.ts';

/**
Return `never` if the 1st and the 2nd arguments are mutually identical.
Return the 1st if not.
(But there's a limitation about union/intersection type. See `MatchOrNever` or `_IsEqual` in `source/is-equal.d.ts` doc.)

@example
```
type A = MatchOrNever<string | number, string>; // => string | number
type B = MatchOrNever<string | number, string | number>; // => never
type C = MatchOrNever<string | number, unknown>; // => string | number
type D = MatchOrNever<string, string | number>; // => string
```

This does NOT depend on assignability.

@example
```
type RO_0 = MatchOrNever<{readonly a: 0}, {a: 0}>; // => {readonly a: 0}
type RO_1 = MatchOrNever<{a: 0}, {readonly a: 0}>; // => {a: 0}
```

`unknown` and `never` cases, which easily break equality in type level code base.

@example
```
type E = MatchOrNever<unknown, never>; // => unknown
type F = MatchOrNever<unknown, unknown>; // => never
type G = MatchOrNever<never, never>; // => never
type H = MatchOrNever<never, unknown>; // => never
```

Note that this doesn't regard the identical union/intersection type `T | T` and/or `T & T` as `T` recursively.
e.g., `{a: 0} | {a: 0}` and/or `{a: 0} & {a: 0}` as `{a: 0}`.

@example
```
type IDUnion = MatchOrNever<{a: {b: 0}} | {a: {b: 0}}, {a: {b: 0}}>; // => never
type A = {a: {b: 0} | {b: 0}};
type RecurivelyIDUnion = MatchOrNever<A, {a: {b: 0}}>; // => A
```
*/
type MatchOrNever<A, B> =
	[unknown, B] extends [A, never]
		? A
		// This equality code base below doesn't work if `A` is `unknown` and `B` is `never` case.
		// So this branch should be wrapped to take care of this.
		: (<G>() => G extends A & G | G ? 1 : 2) extends (<G>() => G extends B & G | G ? 1 : 2)
			? never
			: A;

/**
TypeScript's built-in `Exclude` and `ExcludeStrict` in `type-fest` don't distinguishes key modifiers of objects.

@example
```
import type {ExcludeStrict} from 'type-fest';

type NeverReturned_0 = Exclude<{a: 0} | {readonly a: 0}, {readonly a: 0}>; // => never
type NeverReturned_1 = ExcludeStrict<{a: 0} | {readonly a: 0}, {readonly a: 0}>; // => never
```

`ExcludeExactly` keeps the union members element if the members are not identical.

@example
```
import type {ExcludeExactly} from 'type-fest';

type ExcludeNever = ExcludeExactly<{a: 0} | {a: 0} | {readonly a: 0}, never>; // => {a: 0} | {a: 0} | {readonly a: 0}
type ExcludeReadonlyKey = ExcludeExactly<{a: 0} | {readonly a: 0}, {readonly a: 0}>; // => {a: 0}
type ExcludeKey = ExcludeExactly<{readonly a: 0}, {a: 0}>; // => {readonly a: 0}
type ExcludeReadonly = ExcludeExactly<{readonly a: 0}, {readonly a: 0}>; // => {readonly a: 0}
type ExcludeSubType = ExcludeExactly<0 | 1 | number, 1>; // => number
type ExcludeAllSet = ExcludeExactly<0 | 1 | number, number>; // => never
type ExcludeFromUnknown = ExcludeExactly<unknown, string>; // => unknown
type ExcludeFromUnknownArray = ExcludeExactly<number[] | unknown[], number[]>; // => unknown[]
```
*/
export type ExcludeExactly<UnionU, DeleteT> =
	LastOfUnion<DeleteT> extends infer D
		? true extends IsNever<D>
			? UnionU
			: ExcludeExactly<_ExcludeExactly<UnionU, D>, _ExcludeExactly<DeleteT, D>>
		: never;
type _ExcludeExactly<UnionU, DeleteT> =
	true extends IsAny<DeleteT>
		? never
		: true extends IsUnknown<DeleteT>
			? never
			: UnionU extends unknown // Only for union distribution.
				? MatchOrNever<UnionU, DeleteT>
				: never;

export {};
