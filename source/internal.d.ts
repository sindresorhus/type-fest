import type {Primitive} from './primitive';
import type {Simplify} from './simplify';
import type {Trim} from './trim';
import type {IsAny} from './is-any';
import type {IsEqual} from './is-equal';
import type {IsNegative, NegativeInfinity, PositiveInfinity} from './numeric';
import type {StringToNumber, StartsWith, StringLength} from './string';

// TODO: Remove for v5.
export type {UnknownRecord} from './unknown-record';

/**
Infer the length of the given array `<T>`.

@link https://itnext.io/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f
*/
type TupleLength<T extends readonly unknown[]> = T extends {readonly length: infer L} ? L : never;

/**
Create a tuple type of the given length `<L>` and fill it with the given type `<Fill>`.

If `<Fill>` is not provided, it will default to `unknown`.

@link https://itnext.io/implementing-arithmetic-within-typescripts-type-system-a1ef140a6f6f
*/
export type BuildTuple<L extends number, Fill = unknown, T extends readonly unknown[] = []> = T extends {readonly length: L}
	? T
	: BuildTuple<L, Fill, [...T, Fill]>;

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
	T extends {(...arguments_: infer A): unknown; (...arguments_: any[]): unknown}
		? unknown[] extends A
			? false
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
And<true, true>
//=> true

And<true, false>
//=> false
```
*/
export type And<A extends boolean, B extends boolean> = [A, B][number] extends true
	? true
	: true extends [IsEqual<A, false>, IsEqual<B, false>][number]
		? false
		: boolean;

/**
Returns a boolean for either A or B is true.

@example
```
Or<true, false>
//=> true

Or<false, false>
//=> false
```
*/
export type Or<A extends boolean, B extends boolean> = [A, B][number] extends false
	? false
	: true extends [IsEqual<A, true>, IsEqual<B, true>][number]
		? true
		: boolean;

/**
Returns a boolean for whether A is false.

@example
```
Not<true>
//=> false

Not<false>
//=> true
```
*/
export type Not<A extends boolean> = A extends true
	? false
	: A extends false
		? true
		: boolean;

/**
Returns the maximum element in an array.

Note:
- float number is not supported.

@example
```
Max<[1, 2, 5, 3]>
//=> 5

Max<[1, 2, 5, 3, 99, -1]>
//=> 99
```
*/
export type Max<A extends number[], Result extends number = NegativeInfinity> = A extends [infer F extends number, ...infer R extends number[]]
	? Gt<F, Result> extends true
		? Max<R, F>
		: Max<R, Result>
	: Result;

/**
Returns the minimal element in an array.

@example
```
Min<[1, 2, 5, 3]>
//=> 1

Min<[1, 2, 5, 3, -5]>
//=> -5
```
*/
export type Min<A extends number[], Result extends number = PositiveInfinity> = A extends [infer F extends number, ...infer R extends number[]]
	? Lt<F & number, Result> extends true
		? Min<R, F>
		: Min<R, Result>
	: Result;

/**
Calculate the result of `A + B`

Note:
- A and B can only be small integers.
- if the result is negative, you can only get `number`.

@example
```
Add<111, 222>
//=> 333

Add<-111, 222>
//=> 111

Add<111, -222>
//=> number

Add<PositiveInfinity, -9999>
//=> PositiveInfinity

Add<PositiveInfinity, NegativeInfinity>
//=> number
```
*/
// TODO: Support big integer and negative number.
export type Add<A extends number, B extends number> = [
	IsEqual<A, PositiveInfinity>, IsEqual<A, NegativeInfinity>,
	IsEqual<B, PositiveInfinity>, IsEqual<B, NegativeInfinity>,
] extends infer R extends [boolean, boolean, boolean, boolean]
	? Or<
	And<IsEqual<R[0], true>, IsEqual<R[3], false>>,
	And<IsEqual<R[2], true>, IsEqual<R[1], false>>
	> extends true
		? PositiveInfinity
		: Or<
		And<IsEqual<R[1], true>, IsEqual<R[2], false>>,
		And<IsEqual<R[3], true>, IsEqual<R[0], false>>
		> extends true
			? NegativeInfinity
			: true extends R[number]
				? number
				: ([IsNegative<A>, IsNegative<B>] extends infer R
					? [false, false] extends R
						? [...NewArray<A>, ...NewArray<B>]['length']
						: [true, true] extends R
							? number
							: Max<[Abs<A>, Abs<B>]> extends infer Max_
								? Min<[Abs<A>, Abs<B>]> extends infer Min_ extends number
									? Max_ extends A | B
										? Sub<Max_, Min_>
										: number
									: never
								: never
					: never) & number
	: never;

/**
Calculate the result of `A - B`.

Note:
- A and B can only be small integers.
- if the result is negative, you can only get `number`.

@example
```
Sub<333, 222>
//=> 111

Sub<111, -222>
//=> 333

Sub<-111, 222>
//=> number

Sub<PositiveInfinity, 9999>
//=> PositiveInfinity

Sub<PositiveInfinity, PositiveInfinity>
//=> number
```
 */
// TODO: Support big integer and negative number.
export type Sub<A extends number, B extends number> = [
	IsEqual<A, PositiveInfinity>, IsEqual<A, NegativeInfinity>,
	IsEqual<B, PositiveInfinity>, IsEqual<B, NegativeInfinity>,
] extends infer R extends [boolean, boolean, boolean, boolean]
	? Or<
	And<IsEqual<R[0], true>, IsEqual<R[2], false>>,
	And<IsEqual<R[3], true>, IsEqual<R[1], false>>
	> extends true
		? PositiveInfinity
		: Or<
		And<IsEqual<R[1], true>, IsEqual<R[3], false>>,
		And<IsEqual<R[2], true>, IsEqual<R[0], false>>
		> extends true
			? NegativeInfinity
			: true extends R[number]
				? number
				: [IsNegative<A>, IsNegative<B>] extends infer R
					? [false, false] extends R
						? NewArray<A> extends infer R
							? R extends [...NewArray<B>, ...infer R]
								? R['length']
								: number
							: never
						: Lt<A, B> extends true
							? number
							: [false, true] extends R
								? Add<A, Abs<B>>
								: Sub<Abs<B>, Abs<A>>
					: never
	: never;

/**
Returns an array of the specified length filled with the specified value(which default to null).

@example
```
NewArray<3>
//=> [null, null, null]

NewArray<4, 0>
//=> [0, 0, 0, 0]
```
*/
export type NewArray<N extends number, Fill = null, Result extends any[] = []> = IsNegative<N> extends true
	? []
	: Result['length'] extends N
		? Result
		: NewArray<N, Fill, [Fill, ...Result]>;

/**
Returns the absolute value of a given value.

@example
```
Abs<-1>
//=> 1

Abs<1>
//=> 1

Abs<NegativeInfinity>
//=> PositiveInfinity
```
*/
export type Abs<N extends number> = `${N}` extends `-${infer StringPositiveN}` ? StringToNumber<StringPositiveN> : N;

/**
Returns a boolean for whether A > B.

@example
```
Gt<1, -5>
//=> true

Gt<1, 1>
//=> false

Gt<1, 5>
//=> false
```
*/
// TODO: Support large integer.
export type Gt<A extends number, B extends number> = number extends A | B
	? boolean
	: [IsNegative<A>, IsNegative<B>] extends infer R extends [boolean, boolean]
		? [true, false] extends R
			? false
			: [false, true] extends R
				? true
				: [false, false] extends R
					? PositiveNumericStringGt<`${A}`, `${B}`>
					: PositiveNumericStringGt<`${Abs<B>}`, `${Abs<A>}`>
		: never;

/**
Returns a boolean for whether A >= B.

@example
```
Gte<1, -5>
//=> true

Gte<1, 1>
//=> true

Gte<1, 5>
//=> false
```
*/
export type Gte<A extends number, B extends number> = number extends A | B
	? boolean
	: A extends B ? true : Gt<A, B>;

/**
Returns a boolean for whether A < B.

@example
```
Lt<1, -5>
//=> false

Lt<1, 1>
//=> false

Lt<1, 5>
//=> true
```
*/

export type Lt<A extends number, B extends number> = number extends A | B
	? boolean
	: Gte<A, B> extends true ? false : true;

/**
Returns a boolean for whether A <= B.

@example
```
Lte<1, -5>
//=> false

Lte<1, 1>
//=> true

Lte<1, 5>
//=> true
```
*/
export type Lte<A extends number, B extends number> = number extends A | B
	? boolean
	: Gt<A, B> extends true ? false : true;

/**
Returns a boolean for whether A > B(A and B are both numeric string and have the same length).

@example
```
SameLengthPositiveNumericStringGt<'50', '10'>
//=> true

SameLengthPositiveNumericStringGt<'10', '10'>
//=> false
```
*/
type SameLengthPositiveNumericStringGt<A extends string, B extends string> = A extends `${infer FirstA}${infer RestA}`
	? B extends `${infer FirstB}${infer RestB}`
		? FirstA extends FirstB
			? SameLengthPositiveNumericStringGt<RestA, RestB>
			: PositiveNumericCharGt<FirstA, FirstB>
		: never
	: false;

type NumericString = '0123456789';

/**
Returns a boolean for whether A > B(A and B are both positive numeric string).

@example
```
PositiveNumericStringGt<'500', '1'>
//=> true

PositiveNumericStringGt<'1', '1'>
//=> false

PositiveNumericStringGt<'1', '500'>
//=> false
```
*/
type PositiveNumericStringGt<A extends string, B extends string> = A extends B
	? false
	: [NewArray<StringLength<A>>, NewArray<StringLength<B>>] extends infer R extends [unknown[], unknown[]]
		? R[0] extends [...R[1], ...infer Remain]
			? [] extends Remain
				? SameLengthPositiveNumericStringGt<A, B>
				: true
			: false
		: never;

/**
Returns a boolean for whether A > B(A and B are both positive numeric char).

@example
```
PositiveNumericCharGt<'5', '1'>
//=> true

PositiveNumericCharGt<'1', '1'>
//=> false
```
*/
type PositiveNumericCharGt<A extends string, B extends string> = NumericString extends `${infer HeadA}${A}${infer TailA}`
	? NumericString extends `${infer HeadB}${B}${infer TailB}`
		? HeadA extends `${HeadB}${infer _}${infer __}`
			? true
			: false
		: never
	: never;
