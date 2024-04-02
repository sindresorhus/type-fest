import type {Primitive} from './primitive';
import type {Simplify} from './simplify';
import type {Trim} from './trim';
import type {IsAny} from './is-any';
import type {NegativeInfinity, PositiveInfinity} from './numeric';
import type {GreaterThan} from './greater-than';
import type {LessThan} from './less-than';
import type {IsLiteral} from './is-literal';
import type {UnknownRecord} from './unknown-record';
import type {IsNever} from './is-never';
import type {UnknownArray} from './unknown-array';
import type {IsEqual} from './is-equal';

// TODO: Remove for v5.
export type {UnknownRecord} from './unknown-record';

/**
Infer the length of the given array `<T>`.

@link https://itnext.io/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f
*/
type ArrayLength<T extends readonly unknown[]> = T extends {readonly length: infer L} ? L : never;

/**
Infer the length of the given tuple `<T>`.

Returns `never` if the given type is an non-fixed-length array like `Array<string>`.

@example
```
type Tuple = TupleLength<[string, number, boolean]>;
//=> 3

type Array = TupleLength<string[]>;
//=> never

// Supports union types.
type Union = TupleLength<[] | [1, 2, 3] | Array<number>>;
//=> 1 | 3
```
*/
export type TupleLength<T extends UnknownArray> =
	// `extends unknown` is used to convert `T` (if `T` is a union type) to
	// a [distributive conditionaltype](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-2-8.html#distributive-conditional-types))
	T extends unknown
		? number extends T['length']
			? never // Return never if the given type is an non-flexed-length array like `Array<string>`
			: T['length']
		: never; // Should never happen

/**
Create a tuple type of the given length `<L>` and fill it with the given type `<Fill>`.

If `<Fill>` is not provided, it will default to `unknown`.

@link https://itnext.io/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f
*/
export type BuildTuple<L extends number, Fill = unknown, T extends readonly unknown[] = []> = T['length'] extends L
	? T
	: BuildTuple<L, Fill, [...T, Fill]>;

/**
Create an object type with the given key `<Key>` and value `<Value>`.

It will copy the prefix and optional status of the same key from the given object `CopiedFrom` into the result.

@example
```
type A = BuildObject<'a', string>;
//=> {a: string}

// Copy `readonly` and `?` from the key `a` of `{readonly a?: any}`
type B = BuildObject<'a', string, {readonly a?: any}>;
//=> {readonly a?: string}
```
*/
export type BuildObject<Key extends PropertyKey, Value, CopiedFrom extends object = {}> =
	Key extends keyof CopiedFrom
		? Pick<{[_ in keyof CopiedFrom]: Value}, Key>
		: Key extends `${infer NumberKey extends number}`
			? NumberKey extends keyof CopiedFrom
				? Pick<{[_ in keyof CopiedFrom]: Value}, NumberKey>
				: {[_ in Key]: Value}
			: {[_ in Key]: Value};

/**
Return a string representation of the given string or number.

Note: This type is not the return type of the `.toString()` function.
*/
export type ToString<T> = T extends string | number ? `${T}` : never;

/**
Matches any primitive, `void`, `Date`, or `RegExp` value.
*/
export type BuiltIns = Primitive | void | Date | RegExp;

/**
Matches non-recursive types.
*/
export type NonRecursiveType = BuiltIns | Function | (new (...arguments_: any[]) => unknown);

/**
Returns a boolean for whether the given type is a plain key-value object.
*/
export type IsPlainObject<T> =
	T extends NonRecursiveType | UnknownArray | ReadonlyMap<unknown, unknown> | ReadonlySet<unknown>
		? false
		: T extends object
			? true
			: false;

/**
Converts a numeric string to a number.

@example
```
type PositiveInt = StringToNumber<'1234'>;
//=> 1234

type NegativeInt = StringToNumber<'-1234'>;
//=> -1234

type PositiveFloat = StringToNumber<'1234.56'>;
//=> 1234.56

type NegativeFloat = StringToNumber<'-1234.56'>;
//=> -1234.56

type PositiveInfinity = StringToNumber<'Infinity'>;
//=> Infinity

type NegativeInfinity = StringToNumber<'-Infinity'>;
//=> -Infinity
```

@category String
@category Numeric
@category Template literal
*/
export type StringToNumber<S extends string> = S extends `${infer N extends number}`
	? N
	: S extends 'Infinity'
		? PositiveInfinity
		: S extends '-Infinity'
			? NegativeInfinity
			: never;

/**
Returns a boolean for whether the given string `S` starts with the given string `SearchString`.

@example
```
StartsWith<'abcde', 'abc'>;
//=> true

StartsWith<'abcde', 'bc'>;
//=> false

StartsWith<string, 'bc'>;
//=> never

StartsWith<'abcde', string>;
//=> never
```

@category String
@category Template literal
*/
export type StartsWith<S extends string, SearchString extends string> = string extends S | SearchString
	? never
	: S extends `${SearchString}${infer T}`
		? true
		: false;

/**
Returns the length of the given string.

@example
```
StringLength<'abcde'>;
//=> 5

StringLength<string>;
//=> never
```

@category String
@category Template literal
*/
export type StringLength<S extends string> = string extends S
	? never
	: StringToArray<S>['length'];

/**
Returns an array of the characters of the string.

@example
```
StringToArray<'abcde'>;
//=> ['a', 'b', 'c', 'd', 'e']

StringToArray<string>;
//=> never
```

@category String
*/
export type StringToArray<S extends string, Result extends string[] = []> = string extends S
	? never
	: S extends `${infer F}${infer R}`
		? StringToArray<R, [...Result, F]>
		: Result;

export type UpperCaseCharacters = 'A' | 'B' | 'C' | 'D' | 'E' | 'F' | 'G' | 'H' | 'I' | 'J' | 'K' | 'L' | 'M' | 'N' | 'O' | 'P' | 'Q' | 'R' | 'S' | 'T' | 'U' | 'V' | 'W' | 'X' | 'Y' | 'Z';

export type StringDigit = '0' | '1' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9';

export type Whitespace =
	| '\u{9}' // '\t'
	| '\u{A}' // '\n'
	| '\u{B}' // '\v'
	| '\u{C}' // '\f'
	| '\u{D}' // '\r'
	| '\u{20}' // ' '
	| '\u{85}'
	| '\u{A0}'
	| '\u{1680}'
	| '\u{2000}'
	| '\u{2001}'
	| '\u{2002}'
	| '\u{2003}'
	| '\u{2004}'
	| '\u{2005}'
	| '\u{2006}'
	| '\u{2007}'
	| '\u{2008}'
	| '\u{2009}'
	| '\u{200A}'
	| '\u{2028}'
	| '\u{2029}'
	| '\u{202F}'
	| '\u{205F}'
	| '\u{3000}'
	| '\u{FEFF}';

export type WordSeparators = '-' | '_' | Whitespace;

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
export type ObjectValue<T, K> =
	K extends keyof T
		? T[K]
		: ToString<K> extends keyof T
			? T[ToString<K>]
			: K extends `${infer NumberK extends number}`
				? NumberK extends keyof T
					? T[NumberK]
					: never
				: never;

/**
Returns a boolean for whether the string is lowercased.
*/
export type IsLowerCase<T extends string> = T extends Lowercase<T> ? true : false;

/**
Returns a boolean for whether the string is uppercased.
*/
export type IsUpperCase<T extends string> = T extends Uppercase<T> ? true : false;

/**
Returns a boolean for whether a string is whitespace.
*/
export type IsWhitespace<T extends string> = T extends Whitespace
	? true
	: T extends `${Whitespace}${infer Rest}`
		? IsWhitespace<Rest>
		: false;

/**
Returns a boolean for whether the string is numeric.

This type is a workaround for [Microsoft/TypeScript#46109](https://github.com/microsoft/TypeScript/issues/46109#issuecomment-930307987).
*/
export type IsNumeric<T extends string> = T extends `${number}`
	? Trim<T> extends T
		? true
		: false
	: false;

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
		/*
		To prevent a problem where an object with only a `name` property is incorrectly treated as assignable to a function, we first check if the property is a record.
		This check is necessary, because without it, if we don't verify whether the property is a record, an object with a type of `{name: any}` would return `never` due to its potential assignability to a function.
		See: https://github.com/sindresorhus/type-fest/issues/657
		*/
		: Type[Key] extends Record<string, unknown>
			? Key
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
Returns a boolean for whether the given type is `null`.
*/
export type IsNull<T> = [T] extends [null] ? true : false;

/**
Disallows any of the given keys.
*/
export type RequireNone<KeysType extends PropertyKey> = Partial<Record<KeysType, never>>;

/**
Returns a boolean for whether the given type is primitive value or primitive type.

@example
```
IsPrimitive<'string'>
//=> true

IsPrimitive<string>
//=> true

IsPrimitive<Object>
//=> false
```
*/
export type IsPrimitive<T> = [T] extends [Primitive] ? true : false;

/**
Returns a boolean for whether A and B are both true.

@example
```
And<true, true>;
//=> true

And<true, false>;
//=> false
```
*/
export type And<A extends boolean, B extends boolean> = [A, B][number] extends true
	? true
	: true extends [IsEqual<A, false>, IsEqual<B, false>][number]
		? false
		: never;

/**
Returns a boolean for either A or B is true.

@example
```
Or<true, false>;
//=> true

Or<false, false>;
//=> false
```
*/
export type Or<A extends boolean, B extends boolean> = [A, B][number] extends false
	? false
	: true extends [IsEqual<A, true>, IsEqual<B, true>][number]
		? true
		: never;

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
Returns the maximum value from a tuple of integers.

Note:
- Float numbers are not supported.

@example
```
ArrayMax<[1, 2, 5, 3]>;
//=> 5

ArrayMax<[1, 2, 5, 3, 99, -1]>;
//=> 99
```
*/
export type ArrayMax<A extends number[], Result extends number = NegativeInfinity> = number extends A[number]
	? never :
	A extends [infer F extends number, ...infer R extends number[]]
		? GreaterThan<F, Result> extends true
			? ArrayMax<R, F>
			: ArrayMax<R, Result>
		: Result;

/**
Returns the minimum value from a tuple of integers.

Note:
- Float numbers are not supported.

@example
```
ArrayMin<[1, 2, 5, 3]>;
//=> 1

ArrayMin<[1, 2, 5, 3, -5]>;
//=> -5
```
*/
export type ArrayMin<A extends number[], Result extends number = PositiveInfinity> = number extends A[number]
	? never
	: A extends [infer F extends number, ...infer R extends number[]]
		? LessThan<F, Result> extends true
			? ArrayMin<R, F>
			: ArrayMin<R, Result>
		: Result;

/**
Returns the absolute value of a given value.

@example
```
NumberAbsolute<-1>;
//=> 1

NumberAbsolute<1>;
//=> 1

NumberAbsolute<NegativeInfinity>
//=> PositiveInfinity
```
*/
export type NumberAbsolute<N extends number> = `${N}` extends `-${infer StringPositiveN}` ? StringToNumber<StringPositiveN> : N;

/**
Returns a boolean for whether `A` represents a number greater than `B`, where `A` and `B` are both numeric strings and have the same length.

@example
```
SameLengthPositiveNumericStringGt<'50', '10'>;
//=> true

SameLengthPositiveNumericStringGt<'10', '10'>;
//=> false
```
*/
type SameLengthPositiveNumericStringGt<A extends string, B extends string> = A extends `${infer FirstA}${infer RestA}`
	? B extends `${infer FirstB}${infer RestB}`
		? FirstA extends FirstB
			? SameLengthPositiveNumericStringGt<RestA, RestB>
			: PositiveNumericCharacterGt<FirstA, FirstB>
		: never
	: false;

type NumericString = '0123456789';

/**
Returns a boolean for whether `A` is greater than `B`, where `A` and `B` are both positive numeric strings.

@example
```
PositiveNumericStringGt<'500', '1'>;
//=> true

PositiveNumericStringGt<'1', '1'>;
//=> false

PositiveNumericStringGt<'1', '500'>;
//=> false
```
*/
export type PositiveNumericStringGt<A extends string, B extends string> = A extends B
	? false
	: [BuildTuple<StringLength<A>, 0>, BuildTuple<StringLength<B>, 0>] extends infer R extends [readonly unknown[], readonly unknown[]]
		? R[0] extends [...R[1], ...infer Remain extends readonly unknown[]]
			? 0 extends Remain['length']
				? SameLengthPositiveNumericStringGt<A, B>
				: true
			: false
		: never;

/**
Returns a boolean for whether `A` represents a number greater than `B`, where `A` and `B` are both positive numeric characters.

@example
```
PositiveNumericCharacterGt<'5', '1'>;
//=> true

PositiveNumericCharacterGt<'1', '1'>;
//=> false
```
*/
type PositiveNumericCharacterGt<A extends string, B extends string> = NumericString extends `${infer HeadA}${A}${infer TailA}`
	? NumericString extends `${infer HeadB}${B}${infer TailB}`
		? HeadA extends `${HeadB}${infer _}${infer __}`
			? true
			: false
		: never
	: never;

/**
Utility type to retrieve only literal keys from type.
*/
export type LiteralKeyOf<T> = keyof {[K in keyof T as IsLiteral<K> extends true ? K : never]-?: never};

/**
Returns the static, fixed-length portion of the given array, excluding variable-length parts.

@example
```
type A = [string, number, boolean, ...string[]];
type B = StaticPartOfArray<A>;
//=> [string, number, boolean]
```
*/
export type StaticPartOfArray<T extends UnknownArray, Result extends UnknownArray = []> =
	T extends unknown
		? number extends T['length'] ?
			T extends readonly [infer U, ...infer V]
				? StaticPartOfArray<V, [...Result, U]>
				: Result
			: T
		: never; // Should never happen

/**
Returns the variable, non-fixed-length portion of the given array, excluding static-length parts.

@example
```
type A = [string, number, boolean, ...string[]];
type B = VariablePartOfArray<A>;
//=> string[]
```
*/
export type VariablePartOfArray<T extends UnknownArray> =
	T extends unknown
		? T extends readonly [...StaticPartOfArray<T>, ...infer U]
			? U
			: []
		: never; // Should never happen

/**
Returns the minimum number in the given union of numbers.

Note: Just supports numbers from 0 to 999.

@example
```
type A = UnionMin<3 | 1 | 2>;
//=> 1
```
*/
export type UnionMin<N extends number> = InternalUnionMin<N>;

/**
The actual implementation of `UnionMin`. It's private because it has some arguments that don't need to be exposed.
*/
type InternalUnionMin<N extends number, T extends UnknownArray = []> =
	T['length'] extends N
		? T['length']
		: InternalUnionMin<N, [...T, unknown]>;

/**
Returns the maximum number in the given union of numbers.

Note: Just supports numbers from 0 to 999.

@example
```
type A = UnionMax<1 | 3 | 2>;
//=> 3
```
*/
export type UnionMax<N extends number> = InternalUnionMax<N>;

/**
The actual implementation of `UnionMax`. It's private because it has some arguments that don't need to be exposed.
*/
type InternalUnionMax<N extends number, T extends UnknownArray = []> =
	IsNever<N> extends true
		? T['length']
		:	T['length'] extends N
			? InternalUnionMax<Exclude<N, T['length']>, T>
			: InternalUnionMax<N, [...T, unknown]>;

/**
Returns a boolean for whether the given type is a union type.

@example
```
type A = IsUnion<string | number>;
//=> true

type B = IsUnion<string>;
//=> false
```
*/
export type IsUnion<T> = InternalIsUnion<T>;

/**
The actual implementation of `IsUnion`.
*/
type InternalIsUnion<T, U = T> =
(
	// @link https://ghaiklor.github.io/type-challenges-solutions/en/medium-isunion.html
	IsNever<T> extends true
		? false
		: T extends any
			? [U] extends [T]
				? false
				: true
			: never
) extends infer Result
	// In some cases `Result` will return `false | true` which is `boolean`,
	// that means `T` has at least two types and it's a union type,
	// so we will return `true` instead of `boolean`.
	? boolean extends Result ? true
		: Result
	: never; // Should never happen

/**
Set the given array to readonly if `IsReadonly` is `true`, otherwise set the given array to normal, then return the result.

@example
```
type ReadonlyArray = readonly string[];
type NormalArray = string[];

type ReadonlyResult = SetArrayAccess<NormalArray, true>;
//=> readonly string[]

type NormalResult = SetArrayAccess<ReadonlyArray, false>;
//=> string[]
```
*/
export type SetArrayAccess<T extends UnknownArray, IsReadonly extends boolean> =
T extends readonly [...infer U] ?
	IsReadonly extends true
		? readonly [...U]
		: [...U]
	: T;

/**
Returns whether the given array `T` is readonly.
*/
export type IsArrayReadonly<T extends UnknownArray> = T extends unknown[] ? false : true;

/**
Get the exact version of the given `Key` in the given object `T`.

Use-case: You known that a number key (e.g. 10) is in an object, but you don't know how it is defined in the object, as a string or as a number (e.g. 10 or '10'). You can use this type to get the exact version of the key. See the example.

@example
```
type Object = {
	0: number;
	'1': string;
};

type Key1 = ExactKey<Object, '0'>;
//=> 0
type Key2 = ExactKey<Object, 0>;
//=> 0

type Key3 = ExactKey<Object, '1'>;
//=> '1'
type Key4 = ExactKey<Object, 1>;
//=> '1'
```

@category Object
*/
export type ExactKey<T extends object, Key extends PropertyKey> =
Key extends keyof T
	? Key
	: ToString<Key> extends keyof T
		? ToString<Key>
		: Key extends `${infer NumberKey extends number}`
			? NumberKey extends keyof T
				? NumberKey
				: never
			: never;
