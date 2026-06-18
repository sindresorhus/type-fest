import type {IsNever} from './is-never.d.ts';
import type {IsAny} from './is-any.d.ts';
import type {UnionMember} from './union-member.d.ts';

/**
Returns `never` if the 1st and 2nd arguments are identical.
Returns the 1st argument if they are not.
(Note: There are limitations regarding union/intersection types. See `MatchOrNever` or `_IsEqual` in the `source/is-equal.d.ts` documentation.)

@example
```
type A = MatchOrNever<string | number, string>;
//=> string | number

type B = MatchOrNever<string | number, string | number>;
//=> never

type C = MatchOrNever<string | number, unknown>;
//=> string | number

type D = MatchOrNever<string, string | number>;
//=> string
```

This does NOT depend on assignability.

@example
```
type RO_0 = MatchOrNever<{readonly a: 0}, {a: 0}>;
//=> {readonly a: 0}

type RO_1 = MatchOrNever<{a: 0}, {readonly a: 0}>;
//=> {a: 0}
```

Special cases for `unknown` and `never`, which can easily break equality in type-level codebases.

@example
```
type E = MatchOrNever<unknown, never>;
//=> unknown

type F = MatchOrNever<unknown, unknown>;
//=> never

type G = MatchOrNever<never, never>;
//=> never

type H = MatchOrNever<never, unknown>;
//=> never
```

Note that this does not recursively treat identical union/intersection types (e.g., `T | T` or `T & T`) as `T`.
For instance, `{a: 0} | {a: 0}` is considered identical to `{a: 0}`, but nested properties are not normalized.

@example
```
type IDUnion = MatchOrNever<{a: {b: 0}} | {a: {b: 0}}, {a: {b: 0}}>;
//=> never

type RecurivelyIDUnion = MatchOrNever<{a: {b: 0} | {b: 0}}, {a: {b: 0}}>;
//=> {a: {b: 0} | {b: 0}}
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
A stricter version of `Exclude<T, U>` that excludes types only when they are exactly identical.

@example
```
import type {ExcludeExactly} from 'type-fest';

type TestExclude1 = Exclude<'a' | 'b' | 'c' | 1 | 2 | 3, string>;
//=> 1 | 2 | 3

type TestExcludeExactly1 = ExcludeExactly<'a' | 'b' | 'c' | 1 | 2 | 3, string>;
//=> 'a' | 'b' | 'c' | 1 | 2 | 3

type TestExclude2 = Exclude<'a' | 'b' | 'c' | 1 | 2 | 3, any>;
//=> never

type TestExcludeExactly2 = ExcludeExactly<'a' | 'b' | 'c' | 1 | 2 | 3, any>;
//=> 'a' | 'b' | 'c' | 1 | 2 | 3

type TestExclude3 = Exclude<{a: string} | {a: string; b: string}, {a: string}>;
//=> never

type TestExcludeExactly3 = ExcludeExactly<{a: string} | {a: string; b: string}, {a: string}>;
//=> {a: string; b: string}
```

@category Improved Built-in
*/
export type ExcludeExactly<UnionU, DeleteT> =
	IsAny<DeleteT> extends true
		? IsAny<UnionU> extends true
			? never
			: UnionU
		: IsNever<DeleteT> extends true
			? IsNever<UnionU> extends true
				? never
				: UnionU
			: InternalExcludeExactly<UnionU, DeleteT>;

type InternalExcludeExactly<UnionU, DeleteT> =
	UnionMember<DeleteT> extends infer D
		? true extends IsNever<D>
			? UnionU
			: InternalExcludeExactly<_ExcludeExactly<UnionU, D>, _ExcludeExactly<DeleteT, D>>
		: never;

type _ExcludeExactly<UnionU, DeleteT> =
	UnionU extends unknown // Only for union distribution.
		? MatchOrNever<UnionU, DeleteT>
		: never;

export {};
