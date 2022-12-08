import type {Primitive} from './primitive';
import type {Simplify} from './simplify';

/**
Returns a boolean for whether the two given types are equal.

@link https://github.com/microsoft/TypeScript/issues/27024#issuecomment-421529650
@link https://stackoverflow.com/questions/68961864/how-does-the-equals-work-in-typescript/68963796#68963796
*/
export type IsEqual<T, U> =
	(<G>() => G extends T ? 1 : 2) extends
	(<G>() => G extends U ? 1 : 2)
		? true
		: false;

/**
Infer the length of the given array `<T>`.

@link https://itnext.io/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f
*/
type TupleLength<T extends readonly unknown[]> = T extends {readonly length: infer L} ? L : never;

/**
Create a tuple type of the given length `<L>`.

@link https://itnext.io/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f
*/
type BuildTuple<L extends number, T extends readonly unknown[] = []> = T extends {readonly length: L}
	? T
	: BuildTuple<L, [...T, unknown]>;

/**
Create a tuple of length `A` and a tuple composed of two other tuples,
the inferred tuple `U` and a tuple of length `B`, then extracts the length of tuple `U`.

@link https://itnext.io/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f
*/
export type Subtract<A extends number, B extends number> = BuildTuple<A> extends [...(infer U), ...BuildTuple<B>]
	? TupleLength<U>
	: never;

/**
Matches any primitive, `Date`, or `RegExp` value.
*/
export type BuiltIns = Primitive | Date | RegExp;

/**
Gets keys from a type. Similar to `keyof` but this one also works for union types.

The reason a simple `keyof Union` does not work is because `keyof` always returns the accessible keys of a type. In the case of a union, that will only be the common keys.

@link https://stackoverflow.com/a/49402091
*/
export type KeysOfUnion<T> = T extends T ? keyof T : never;

export type UpperCaseCharacters = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';

export type WordSeparators = '-' | '_' | ' ';

export type StringDigit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

/**
Matches any unknown record.
*/
export type UnknownRecord = Record<PropertyKey, unknown>;

/**
Matches any unknown array or tuple.
*/
export type UnknownArrayOrTuple = readonly [...unknown[]];

/**
Matches any non empty tuple.
*/
export type NonEmptyTuple = readonly [unknown, ...unknown[]];

/**
Returns a boolean for whether the two given types extends the base type.
*/
export type IsBothExtends<BaseType, FirstType, SecondType> = FirstType extends BaseType
	? SecondType extends BaseType
		? true
		: false
	: false;

/**
Extracts the type of the first element of an array or tuple.
*/
export type FirstArrayElement<TArray extends UnknownArrayOrTuple> = TArray extends readonly [infer THead, ...unknown[]]
	? THead
	: never;

/**
Extracts the type of an array or tuple minus the first element.
*/
export type ArrayTail<TArray extends UnknownArrayOrTuple> = TArray extends readonly [unknown, ...infer TTail] ? TTail : [];

/**
Extract the element of an array that also works for array union.

Returns `never` if T is not an array.

It creates a type-safe way to access the element type of `unknown` type.
*/
export type ArrayElement<T> = T extends readonly unknown[] ? T[0] : never;

/**
Extract the object field type if T is an object and K is a key of T, return `never` otherwise.

It creates a type-safe way to access the member type of `unknown` type.
*/
export type ObjectValue<T, K> = K extends keyof T ? T[K] : never;

/**
Returns a boolean for whether the string is lowercased.
*/
export type IsLowerCase<T extends string> = T extends Lowercase<T> ? true : false;

/**
Returns a boolean for whether the string is uppercased.
*/
export type IsUpperCase<T extends string> = T extends Uppercase<T> ? true : false;

/**
Returns a boolean for whether the string is numeric.
*/
export type IsNumeric<T extends string> = T extends `${number}` ? true : false;

/**
Returns a boolean for whether the the type is `any`.

@link https://stackoverflow.com/a/49928360/1490091
*/
export type IsAny<T> = 0 extends 1 & T ? true : false;

/**
Returns a boolean for whether the the type is `never`.
*/
export type IsNever<T> = [T] extends [never] ? true : false;

/**
Returns a boolean for whether the the type is `unknown`.
*/
export type IsUnknown<T> = IsNever<T> extends false ? T extends unknown ? unknown extends T ? IsAny<T> extends false ? true : false : false : false : false;

/**
For an object T, if it has any properties that are a union with `undefined`, make those into optional properties instead.

@example
```
type User = {
	firstName: string;
	lastName: string | undefined;
};

type OptionalizedUser = UndefinedToOptional<User>;
//=> {
// 	firstName: string;
// 	lastName?: string;
// }
```
*/
export type UndefinedToOptional<T extends object> = Simplify<
{
	// Property is not a union with `undefined`, keep it as-is.
	[Key in keyof Pick<T, FilterDefinedKeys<T>>]: T[Key];
} & {
	// Property _is_ a union with defined value. Set as optional (via `?`) and remove `undefined` from the union.
	[Key in keyof Pick<T, FilterOptionalKeys<T>>]?: Exclude<T[Key], undefined>;
}
>;

// Returns `never` if the key or property is not jsonable without testing whether the property is required or optional otherwise return the key.
type BaseKeyFilter<Type, Key extends keyof Type> = Key extends symbol
	? never
	: Type[Key] extends symbol
		? never
		: [(...arguments_: any[]) => any] extends [Type[Key]]
			? never
			: Key;

/**
Returns the required keys.
*/
type FilterDefinedKeys<T extends object> = Exclude<
{
	[Key in keyof T]: IsAny<T[Key]> extends true
		? Key
		: undefined extends T[Key]
			? never
			: T[Key] extends undefined
				? never
				: BaseKeyFilter<T, Key>;
}[keyof T],
undefined
>;

/**
Returns the optional keys.
*/
type FilterOptionalKeys<T extends object> = Exclude<
{
	[Key in keyof T]: IsAny<T[Key]> extends true
		? never
		: undefined extends T[Key]
			? T[Key] extends undefined
				? never
				: BaseKeyFilter<T, Key>
			: never;
}[keyof T],
undefined
>;
