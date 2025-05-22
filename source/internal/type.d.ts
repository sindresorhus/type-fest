import type {Primitive} from '../primitive.d.ts';
import type {IsNever} from '../is-never.d.ts';
import type {IsAny} from '../is-any.d.ts';
import type {And} from '../and.js';
import type {If} from '../if.js';

/**
Matches any primitive, `void`, `Date`, or `RegExp` value.
*/
export type BuiltIns = Primitive | void | Date | RegExp;

/**
Matches non-recursive types.
*/
export type NonRecursiveType = BuiltIns | Function | (new (...arguments_: any[]) => unknown);

/**
Checks if one type extends another. Note: this is not quite the same as `Left extends Right` because:
1. If either type is `never`, the result is `true` iff the other type is also `never`.
2. Types are wrapped in a 1-tuple so that union types are not distributed - instead we consider `string | number` to _not_ extend `number`. If we used `Left extends Right` directly you would get `Extends<string | number, number>` => `false | true` => `boolean`.
*/
export type Extends<Left, Right> = IsNever<Left> extends true ? IsNever<Right> : [Left] extends [Right] ? true : false;

/**
Returns a boolean for whether the two given types extends the base type.
*/
export type IsBothExtends<BaseType, FirstType, SecondType> = (
	IsNotFalse<
	And<
	Extends<FirstType, BaseType>,
	Extends<SecondType, BaseType>
	>
	>
);

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
Returns a boolean for whether A is false.

@example
```
Not<true>;
//=> false

Not<false>;
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
*/
export type IfNotAnyOrNever<T, IfNotAnyOrNever, IfAny = any, IfNever = never> =
	If<IsAny<T>, IfAny, If<IsNever<T>, IfNever, IfNotAnyOrNever>>;
