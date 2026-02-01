import type {If} from '../if.d.ts';
import type {IsAny} from '../is-any.d.ts';
import type {IsUnknown} from '../is-unknown.d.ts';
import type {IsNever} from '../is-never.d.ts';
import type {Primitive} from '../primitive.d.ts';
import type {UnknownArray} from '../unknown-array.d.ts';
import type {UnionToIntersection} from '../union-to-intersection.d.ts';
import type {SimplifyDeep} from '../simplify-deep.d.ts';

/**
Matches any primitive, `void`, `Date`, or `RegExp` value.
*/
export type BuiltIns = Primitive | void | Date | RegExp;

/**
Matches non-recursive types.
*/
export type NonRecursiveType = BuiltIns | Function | (new (...arguments_: any[]) => unknown) | Promise<unknown>;

/**
Matches maps, sets, or arrays.
*/
export type MapsSetsOrArrays = ReadonlyMap<unknown, unknown> | WeakMap<WeakKey, unknown> | ReadonlySet<unknown> | WeakSet<WeakKey> | UnknownArray;

/**
Returns a boolean for whether the two given types extends the base type.
*/
export type IsBothExtends<BaseType, FirstType, SecondType> = FirstType extends BaseType
	? SecondType extends BaseType
		? true
		: false
	: false;

/**
Test if the given function has multiple call signatures.

Needed to handle the case of a single call signature with properties.

Multiple call signatures cannot currently be supported due to a TypeScript limitation.
@see https://github.com/microsoft/TypeScript/issues/29732
*/
export type HasMultipleCallSignatures<T extends (...arguments_: any[]) => unknown> =
	T extends {(...arguments_: infer A): unknown; (...arguments_: infer B): unknown}
		? B extends A
			? A extends B
				? false
				: true
			: true
		: false;

/**
Returns a boolean for whether the given `boolean` is not `false`.
*/
export type IsNotFalse<T extends boolean> = [T] extends [false] ? false : true;

/**
Returns a boolean for whether the given type is primitive value or primitive type.

@example
```
type A = IsPrimitive<'string'>;
//=> true

type B = IsPrimitive<string>;
//=> true

type C = IsPrimitive<Object>;
//=> false
```
*/
export type IsPrimitive<T> = [T] extends [Primitive] ? true : false;

/**
Returns a boolean for whether A is false.

@example
```
type A = Not<true>;
//=> false

type B = Not<false>;
//=> true
```
*/
export type Not<A extends boolean> = A extends true
	? false
	: A extends false
		? true
		: never;

/**
An if-else-like type that resolves depending on whether the given type is `any` or `never`.

@example
```
// When `T` is a NOT `any` or `never` (like `string`) => Returns `IfNotAnyOrNever` branch
type A = IfNotAnyOrNever<string, 'VALID', 'IS_ANY', 'IS_NEVER'>;
//=> 'VALID'

// When `T` is `any` => Returns `IfAny` branch
type B = IfNotAnyOrNever<any, 'VALID', 'IS_ANY', 'IS_NEVER'>;
//=> 'IS_ANY'

// When `T` is `never` => Returns `IfNever` branch
type C = IfNotAnyOrNever<never, 'VALID', 'IS_ANY', 'IS_NEVER'>;
//=> 'IS_NEVER'
```

Note: Wrapping a tail-recursive type with `IfNotAnyOrNever` makes the implementation non-tail-recursive. To fix this, move the recursion into a helper type. Refer to the following example:

@example
```ts
import type {StringRepeat} from 'type-fest';

type NineHundredNinetyNineSpaces = StringRepeat<' ', 999>;

// The following implementation is not tail recursive
type TrimLeft<S extends string> = IfNotAnyOrNever<S, S extends ` ${infer R}` ? TrimLeft<R> : S>;

// Hence, instantiations with long strings will fail
// @ts-expect-error
type T1 = TrimLeft<NineHundredNinetyNineSpaces>;
//        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Error: Type instantiation is excessively deep and possibly infinite.

// To fix this, move the recursion into a helper type
type TrimLeftOptimised<S extends string> = IfNotAnyOrNever<S, _TrimLeftOptimised<S>>;

type _TrimLeftOptimised<S extends string> = S extends ` ${infer R}` ? _TrimLeftOptimised<R> : S;

type T2 = TrimLeftOptimised<NineHundredNinetyNineSpaces>;
//=> ''
```
*/
export type IfNotAnyOrNever<T, IfNotAnyOrNever, IfAny = any, IfNever = never> =
	If<IsAny<T>, IfAny, If<IsNever<T>, IfNever, IfNotAnyOrNever>>;

/**
Returns a boolean for whether the given type is `any` or `never`.

This type can be better to use than {@link IfNotAnyOrNever `IfNotAnyOrNever`} in recursive types because it does not evaluate any branches.

@example
```
// When `T` is a NOT `any` or `never` (like `string`) => Returns `false`
type A = IsAnyOrNever<string>;
//=> false

// When `T` is `any` => Returns `true`
type B = IsAnyOrNever<any>;
//=> true

// When `T` is `never` => Returns `true`
type C = IsAnyOrNever<never>;
//=> true
```
*/
export type IsAnyOrNever<T> = IsNotFalse<IsAny<T> | IsNever<T>>;

/**
Indicates the value of `exactOptionalPropertyTypes` compiler option.
*/
export type IsExactOptionalPropertyTypesEnabled = [(string | undefined)?] extends [string?]
	? false
	: true;

/**
Returns the last element of a union type; otherwise `never` if `never` passed.
Note that this is non-deterministic because the order of union type is not guaranteed.

@see https://github.com/microsoft/TypeScript/issues/13298#issuecomment-468375328

This can be used to implement a recursive type function that accepts a union type.
It can detect a termination case using {@link IsNever `IsNever`}.

@example
```
type RecursionType<T, R = []> =
	LastOfUnion<T> extends infer L
		? IsNever<L> extends false
			? RecursionType<Exclude<T, L>, [...R, L]>
			: R
		: never;

type RecursionTest = RecursionType<string | number>;
//=> [string, number]
```

@example
```
export type UnionToTuple<T, L = LastOfUnion<T>> =
	IsNever<T> extends false
		? [...UnionToTuple<Exclude<T, L>>, L]
		: [];
```

@example
```
type Last = LastOfUnion<1 | 2 | 3>;
//=> 3

type LastNever = LastOfUnion<never>;
//=> never
```
*/
export type LastOfUnion<T> =
	IsNever<T> extends true
		? never
		: UnionToIntersection<T extends any ? () => T : never> extends () => (infer R)
			? R
			: never;

/**
In TypeScript, `{a: T}` and `{a: T} | {a: T}` are assignable mutually but automatically simplified.
And it disturbs a calculation of `IsEqual`.

@example
```
type NT = _IsEqual<{z: {a: 0}}, {z: {a: 0} | {a: 0}}>; // => false
```

`UniqueUnionDeep` is a helper type function: removes a duplicated type and keeps the other types recursively.
But union distribution also works as usual outside of objects.

@example
```
type UniqueUnionDeepTest = UniqueUnionDeep<{z: {a: {aa: 0} | {aa: 0}} | {a: {aa: 0} | {aa: 0}} | {b: 0}; x: '1'}>; // => {z: {a: {aa: 0}} | {b: 0}; x: '1'}
type UniqueUnionDeepKeepDistributionTest = UniqueUnionDeep<{z: {a: 0} | {a: 0}; x: '1'} | {z: {a: 0} | {a: 0}; x: '2'}>; // => {z: {a: 0}; x: '1'} | {z: {a: 0}; x: '2'}
```

To remove delayed intersection, use `SimplifyDeep`.
And use `SimplifyDeep<UniqueUnionDeep<A>>` if eliminating duplicated union and intersection.
*/
export type UniqueUnionDeep<U> = U extends object ? SimplifyDeep<_UniqueUnionDeep<U>> : U;
type _UniqueUnionDeep<U extends object> = {[K in keyof U]: U[K] extends object ? UniqueUnion<_UniqueUnionDeep<U[K]>> : U[K]};

/**
The flat version of `UniqueUnionDeep`.
*/
export type UniqueUnion<U> = _UniqueUnion<U, never>;
type _UniqueUnion<U, R> =
	LastOfUnion<U> extends infer K
		? [K] extends [never]
			? R
			: _UniqueUnion<
				ExcludeExactly<U, K>,
				(<G>() => G extends K & G | G ? 1 : 2) extends
				(<G>() => G extends R & G | G ? 1 : 2)
					? [R, unknown] extends [never, K]
						? K
						: R
					: R | K>
		: never;

/**
TypeScript's built-in `Exclude` and `ExcludeStrict` in `type-fest` don't distinguish kinds of keys of objects.

@example
```
type NeverReturned_0 = Exclude<{a: 0} | {readonly a: 0}, {readonly a: 0}>; // => never
type NeverReturned_1 = ExcludeStrict<{a: 0} | {readonly a: 0}, {readonly a: 0}>; // => never
```

This `ExcludeExactly` keeps the union objects element if the keys of the first and the second aren't identical.

@example
```
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
export type MatchOrNever<A, B> =
	[unknown, B] extends [A, never]
		? A
		// This equality code base below doesn't work if `A` is `unknown` and `B` is `never` case.
		// So this branch should be wrapped to take care of this.
		: (<G>() => G extends A & G | G ? 1 : 2) extends (<G>() => G extends B & G | G ? 1 : 2)
			? never
			: A;

export {};
