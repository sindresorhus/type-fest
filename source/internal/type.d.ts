import type {IsAny} from '../is-any.d.ts';
import type {IsNever} from '../is-never.d.ts';
import type {Primitive} from '../primitive.d.ts';
import type {TypedArray} from '../typed-array.d.ts';
import type {UnknownArray} from '../unknown-array.d.ts';
import type {ExtendsStrict} from '../extends-strict.d.ts';
import type {FindGlobalInstanceType} from '../find-global-type.d.ts';

/**
Matches any primitive, `void`, `Date`, or `RegExp` value.
*/
export type BuiltIns = Primitive | void | Date | RegExp;

/**
Matches the built-ins that are a single value rather than a structure to recurse into. Recursing into any of them replaces their members with something useless, so the `*Deep` types keep them as is.

A plain construct signature is assignable to an abstract one, so the abstract form matches every class constructor.
*/
export type NonRecursiveLeaf =
	| BuiltIns
	| (abstract new (...arguments_: any[]) => unknown)
	| ArrayBuffer
	| SharedArrayBuffer
	| DataView
	| TypedArray
	// A DOM node, like `HTMLElement` or `Document`. Recursing into it walks the whole DOM. Looked up through `globalThis` so that a `lib` without `DOM` gets `never` here instead of a compile error.
	| FindGlobalInstanceType<'Node'>;

/**
Matches non-recursive types: {@link NonRecursiveLeaf} plus thenables (`PromiseLike`), which `await` unwraps rather than walks, and functions.
*/
export type NonRecursiveType = NonRecursiveLeaf | PromiseLike<unknown> | Function;

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
// When `T` is neither `any` nor `never` (like `string`) => Returns `IfNot` branch
type A = IfNotAnyOrNever<string, {ifNot: 'VALID'; ifAny: 'IS_ANY'; ifNever: 'IS_NEVER'}>;
//=> 'VALID'

// When `T` is `any` => Returns `IfAny` branch
type B = IfNotAnyOrNever<any, {ifNot: 'VALID'; ifAny: 'IS_ANY'; ifNever: 'IS_NEVER'}>;
//=> 'IS_ANY'

// When `T` is `never` => Returns `IfNever` branch
type C = IfNotAnyOrNever<never, {ifNot: 'VALID'; ifAny: 'IS_ANY'; ifNever: 'IS_NEVER'}>;
//=> 'IS_NEVER'
```

Note: Wrapping a tail-recursive type with `IfNotAnyOrNever` makes the implementation non-tail-recursive. To fix this, move the recursion into a helper type. Refer to the following example:

@example
```ts
import type {StringRepeat} from 'type-fest';

type NineHundredNinetyNineSpaces = StringRepeat<' ', 999>;

// The following implementation is not tail recursive
type TrimLeft<S extends string> = IfNotAnyOrNever<S, {ifNot: S extends ` ${infer R}` ? TrimLeft<R> : S}>;

// Hence, instantiations with long strings will fail
// @ts-expect-error
type T1 = TrimLeft<NineHundredNinetyNineSpaces>;
//        ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
// Error: Type instantiation is excessively deep and possibly infinite.

// To fix this, move the recursion into a helper type
type TrimLeftOptimised<S extends string> = IfNotAnyOrNever<S, {ifNot: _TrimLeftOptimised<S>}>;

type _TrimLeftOptimised<S extends string> = S extends ` ${infer R}` ? _TrimLeftOptimised<R> : S;

type T2 = TrimLeftOptimised<NineHundredNinetyNineSpaces>;
//=> ''
```
*/
export type IfNotAnyOrNever<T, Cases extends {ifNot: unknown; ifAny?: unknown; ifNever?: unknown}> =
	IsAny<T> extends true
		? 'ifAny' extends keyof Cases
			? Cases['ifAny']
			: any
		: IsNever<T> extends true
			? 'ifNever' extends keyof Cases
				? Cases['ifNever']
				: never
			: Cases['ifNot'];

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
The call signature of the given type, rebuilt with its `this` parameter, which `Parameters` leaves out, so the rebuilt signature does not accept any receiver. A function that declares no `this` is rebuilt without one, like `OmitThisParameter` does, because `this: unknown` would reject a function that declares a `this`. `unknown` for a type that is not callable, so it can be intersected with anything.

Note: An overloaded function keeps only its last signature, and a generic one loses its type parameters.
*/
export type CallSignatureOf<Type> = Type extends (...arguments_: never) => any
	? unknown extends ThisParameterType<Type>
		? (...arguments_: Parameters<Type>) => ReturnType<Type>
		: (this: ThisParameterType<Type>, ...arguments_: Parameters<Type>) => ReturnType<Type>
	: unknown;

/**
Returns a boolean for whether `Type` extends `Condition`, using either strict or loose comparison.

- In strict mode, {@link ExtendsStrict `ExtendsStrict`} is used, so the whole union must extend `Condition`.
- In loose mode, {@link ExtendsLoose `ExtendsLoose`} is used, so any member of the union can extend `Condition`.
*/
export type Extends<Type, Condition, Strict extends boolean = false> = {
	true: ExtendsStrict<Type, Condition>;
	false: ExtendsLoose<Type, Condition>;
}[`${Strict}`];

/**
Returns a boolean for whether any member of `Type` extends `Condition`.

Unlike `Type extends Condition ? true : false`, it returns `true` instead of `boolean` when only some members extend `Condition`.
*/
export type ExtendsLoose<Type, Condition> = IsNotFalse<Type extends Condition ? true : false>;

/**
Union of `falsy` types in TypeScript. `never` isn't included.
*/
export type Falsy = 0 | 0n | '' | false | null | undefined; // `| never`

/**
Returns a boolean for whether `T` is not {@link Falsy falsy}, like `Boolean(value)`. A union with both falsy and truthy members gives `boolean`.
*/
export type IsTruthy<T> =
	IsNever<T> extends true ? false
		: T extends Falsy ? false
			: true;

export {};
