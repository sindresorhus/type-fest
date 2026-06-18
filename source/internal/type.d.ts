import type {If} from '../if.d.ts';
import type {IsAny} from '../is-any.d.ts';
import type {IsNever} from '../is-never.d.ts';
import type {Primitive} from '../primitive.d.ts';
import type {UnknownArray} from '../unknown-array.d.ts';
import type {UnionToTuple} from '../union-to-tuple.d.ts';

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

NOTE:
Deduplicate identical union/intersection types in overloads beforehand with `UniqueOverload` if you require a strict result.

@example
```
type A = HasMultipleCallSignatures<UniqueOverload<{(a: number): 0; (a: string): 1; (a: string): 1}>>;
//=> true
type B = HasMultipleCallSignatures<{(a: number): 0; (a: string): 1; (a: string): 1}>;
//=> false
```
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
type UniqueUnionDeepTest = SimplifyDeep<UniqueUnionDeep<{z: {a: {aa: 0} | {aa: 0}} | {a: {aa: 0} | {aa: 0}} | {b: 0}; x: '1'}>>;
//=> {z: {a: {aa: 0}} | {b: 0}; x: '1'}

type UniqueUnionDeepKeepDistributionTest = SimplifyDeep<UniqueUnionDeep<{z: {a: 0} | {a: 0}; x: '1'} | {z: {a: 0} | {a: 0}; x: '2'}>>;
//=> {z: {a: 0}; x: '1'} | {z: {a: 0}; x: '2'}

type UniqueUnionDeepArguments = SimplifyDeep<UniqueUnionDeep<(a: {a: number} | {a: number}) => {b: number} | {b: number}>>;
//=> (a: {a: number} | {a: number}) => {b: number} | {b: number}

type UniqueUnionDeepArgumentsDeep = SimplifyDeep<UniqueUnionDeep<(a: {a: number} | {a: number}) => {b: {b: number} | {b: number}}>>;
//=> (a: {a: number}) => {b: {b: number}}
```
*/
export type UniqueUnionDeep<U> =
	/** Note: Wrapping this with `SimplifyDeep`, `test-d/is-equal.ts` fails in `Branded Type with Tuple`. */
	RecurseUniqueUnionDeep<{r: U}>['r'];

/**
Note: Wrapping this with `Simplify`, `test-d/exact.ts` fails in "Spec: recursive type with union".
*/
type InternalUniqueUnionDeep<U extends object> =
	{[K in keyof U]: UniqueUnion<RecurseUniqueUnionDeep<U[K]>>};

type InternalUniqueOverloadDeep<U extends (...args_: any[]) => unknown> =
	/** `Parametes` and `ReturnType` results are possible to be object or lambda; both should be passed into `UniqueUnionDeep`. */
	HasMultipleCallSignatures<UniqueOverload<U>> extends true
		? U
		: (...args: UniqueUnionDeep<Parameters<U>> extends infer A extends any[] ? A : never) => (UniqueUnionDeep<ReturnType<U>>);

type RecurseUniqueUnionDeep<U> =
	U extends Record<PropertyKey, unknown>
		? InternalUniqueUnionDeep<U>
		: U extends UnknownArray
			? InternalUniqueUnionDeep<U>
			: U extends Lambda
				/** If `IsNever<keyof U>` returns `true`, `U` is composed only of overloads. */
				? IsNever<keyof U> extends true
					? InternalUniqueOverloadDeep<U>
					/** Separates an object into the record and the overload parts. */
					: UniqueUnionDeep<Pick<U, keyof U>> & UniqueUnionDeep<UniqueOverload<U>>
				: U;

type UniqueOverload<T extends (...args_: any[]) => unknown> =
	T extends {
		(...args_: infer Arguments0): infer Return0;
		(...args_: infer Arguments1): infer Return1;
		(...args_: infer Arguments2): infer Return2;
		(...args_: infer Arguments3): infer Return3;
	}
		? DedupeTuple<[(...args_: Arguments0) => Return0, (...args_: Arguments1) => Return1, (...args_: Arguments2) => Return2, (...args_: Arguments3) => Return3]> extends infer TupleOverload extends Lambda[]
			? TupleToOverload<TupleOverload>
			: never
		: never; // Unreacheable.

type TupleToOverload<T extends Lambda[]> = _TupleToOverload<T>;

type _TupleToOverload<T extends Lambda[]> =
	T extends [(...args_: infer Arguments0) => infer Return0, (...args_: infer Arguments1) => infer Return1, (...args_: infer Arguments2) => infer Return2, (...args_: infer Arguments3) => infer Return3]
		? {(...args_: Arguments0): Return0; (...args_: Arguments1): Return1; (...args_: Arguments2): Return2; (...args_: Arguments3): Return3}
		: T extends [(...args_: infer Arguments0) => infer Return0, (...args_: infer Arguments1) => infer Return1, (...args_: infer Arguments2) => infer Return2]
			? {(...args_: Arguments0): Return0; (...args_: Arguments1): Return1; (...args_: Arguments2): Return2}
			: T extends [(...args_: infer Arguments0) => infer Return0, (...args_: infer Arguments1) => infer Return1]
				? {(...args_: Arguments0): Return0; (...args_: Arguments1): Return1}
				: T extends [(...args_: infer Arguments0) => infer Return0]
					? (...args_: Arguments0) => Return0
					: never;

/**
@example
```
type DedupeTuple_Test0 = DedupeTuple<[]>;
//=> []
type DedupeTuple_Test1 = DedupeTuple<[0, 1]>;
//=> [0, 1]
type DedupeTuple_Test2 = DedupeTuple<[0, 1, number]>;
//=> [0, 1, number]
type DedupeTuple_Test3 = DedupeTuple<[number, 0, 1, number]>;
//=> [number, 0, 1]
type DedupeTuple_Test4 = DedupeTuple<[never, string, '9']>;
//=> [never, string, '9']
type DedupeTuple_Test5 = DedupeTuple<[string, never, string, '9']>;
//=> [string, never, '9']
type DedupeTuple_Test6 = DedupeTuple<[unknown, string, '9']>;
//=> [unknown, string, '9']
type DedupeTuple_Test7 = DedupeTuple<[string, unknown, string, '9']>;
//=> [string, unknown, '9']
```
*/
export type DedupeTuple<Tuple extends readonly unknown[]> = _DedupeTuple<Tuple>;

type _DedupeTuple<Tuple extends readonly unknown[], Return extends unknown[] = [], Compare = never> =
	Tuple['length'] extends 0
		? Return
		: Tuple extends [infer Head, ...infer Tail]
			? IsNever<Compare> extends true
				? _DedupeTuple<Tail, [...Return, Head], {_compare: Head}>
				: [Compare extends unknown // Union Distribution.
					? _IsEqual<{_compare: Head}, Compare>
					: never] extends [false]
					? _DedupeTuple<Tail, [...Return, Head], Compare | {_compare: Head}>
					: _DedupeTuple<Tail, Return, Compare>
			: never; // Unreacheable.

type _IsEqual<A, B> =
	(<G>() => G extends A & G | G ? 1 : 2) extends
	(<G>() => G extends B & G | G ? 1 : 2)
		? true
		: false;

type Lambda = ((...args: any[]) => any);

/**
The flat version of `UniqueUnionDeep`.
*/
export type UniqueUnion<U> =
	UnionToTuple<U> extends infer E extends readonly unknown[] // Improve performance.
		? E[number]
		: never; // Unreachable.

export {};
