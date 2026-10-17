import type {IsEqual} from '../is-equal.d.ts';
import type {TupleOf} from '../tuple-of.d.ts';
import type {Trim} from '../trim.d.ts';
import type {StringLength} from '../string-length.d.ts';
import type {Split} from '../split.d.ts';
import type {Whitespace} from './characters.d.ts';

/**
Return a string representation of the given string or number.

Note: This type is not the return type of the `.toString()` function.
*/
export type ToString<T> = T extends string | number ? `${T}` : never;

/**
The types that `Array#join()` can stringify, and which `Join` accepts.

The builtin `join` method supports all these natively in the same way that typescript handles them so we can safely accept all of them.
*/
export type JoinableItem = string | number | bigint | boolean | undefined | null;

/**
Returns a boolean for whether the given string `S` starts with the given string `SearchString`.

@example
```
type A = StartsWith<'abcde', 'abc'>;
//=> true

type B = StartsWith<'abcde', 'bc'>;
//=> false

type C = StartsWith<string, 'bc'>;
//=> never

type D = StartsWith<'abcde', string>;
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
Returns a boolean for whether `A` represents a number greater than `B`, where `A` and `B` are both numeric strings and have the same length.

@example
```
type A = SameLengthPositiveNumericStringGt<'50', '10'>;
//=> true

type B = SameLengthPositiveNumericStringGt<'10', '10'>;
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

TypeScript prints numbers of `1e21` and above, and positive numbers below `1e-6`, in exponential notation. Such a number is larger or smaller than any number in plain decimal notation, so a comparison with one exponential side is still decided. Returns `boolean` when both strings use exponential notation with an exponent of the same sign, because comparing digit by digit only works for plain decimal notation.

@example
```
type A = PositiveNumericStringGt<'500', '1'>;
//=> true

type B = PositiveNumericStringGt<'1', '1'>;
//=> false

type C = PositiveNumericStringGt<'1', '500'>;
//=> false

type D = PositiveNumericStringGt<'1.1', '1.05'>;
//=> true

type E = PositiveNumericStringGt<'1e+21', '1'>;
//=> true

type F = PositiveNumericStringGt<'1e-7', '0'>;
//=> true

type G = PositiveNumericStringGt<'2e+21', '1e+21'>;
//=> boolean
```
*/
export type PositiveNumericStringGt<A extends string, B extends string> = A extends B
	? false
	// A positive exponent, like `1e+21`, is larger than any plain decimal number.
	: A extends `${string}e+${string}`
		? B extends `${string}e+${string}`
			? boolean
			: true
		: B extends `${string}e+${string}`
			? false
			// A negative exponent, like `1e-7`, is smaller than any plain decimal number except `0`.
			: A extends `${string}e-${string}`
				? B extends `${string}e-${string}`
					? boolean
					: B extends '0'
						? true
						: false
				: B extends `${string}e-${string}`
					? A extends '0'
						? false
						: true
					: PositiveIntegerStringGt<IntegerPartOfNumericString<A>, IntegerPartOfNumericString<B>> extends infer IntegerResult extends boolean
						? IntegerResult extends true
							? true
							: IsEqual<IntegerPartOfNumericString<A>, IntegerPartOfNumericString<B>> extends true
								? FractionalPartGt<FractionalPartOfNumericString<A>, FractionalPartOfNumericString<B>>
								: false
						: never; // Should never happen

type IntegerPartOfNumericString<S extends string> = S extends `${infer IntegerPart}.${string}` ? IntegerPart : S;

type FractionalPartOfNumericString<S extends string> = S extends `${string}.${infer FractionalPart}` ? FractionalPart : '';

/**
Returns a boolean for whether `A` is greater than `B`, where `A` and `B` are both plain positive integer strings.

@example
```
type A = PositiveIntegerStringGt<'500', '1'>;
//=> true

type B = PositiveIntegerStringGt<'1', '1'>;
//=> false

type C = PositiveIntegerStringGt<'1', '500'>;
//=> false
```
*/
type PositiveIntegerStringGt<A extends string, B extends string> =
	[TupleOf<StringLength<A>, 0>, TupleOf<StringLength<B>, 0>] extends infer R extends [readonly unknown[], readonly unknown[]]
		? R[0] extends [...R[1], ...infer Remain extends readonly unknown[]]
			? 0 extends Remain['length']
				? SameLengthPositiveNumericStringGt<A, B>
				: true
			: false
		: never;

/**
Returns a boolean for whether the fractional part `A` is greater than `B`. The first differing character decides, and a part that runs out of characters first is the smaller one, so `'5'` is less than `'50'` while `'50'` is greater than `'5'`. TypeScript never prints a numeric literal with a trailing zero, so the two are the same value in practice and the difference cannot be reached.
*/
type FractionalPartGt<A extends string, B extends string> = A extends B
	? false
	: B extends ''
		? true
		: A extends ''
			? false
			: A extends `${infer FirstA}${infer RestA}`
				? B extends `${infer FirstB}${infer RestB}`
					? FirstA extends FirstB
						? FractionalPartGt<RestA, RestB>
						: PositiveNumericCharacterGt<FirstA, FirstB>
					: never // Should never happen
				: never; // Should never happen

/**
Returns a boolean for whether `A` represents a number greater than `B`, where `A` and `B` are both positive numeric characters.

@example
```
type A = PositiveNumericCharacterGt<'5', '1'>;
//=> true

type B = PositiveNumericCharacterGt<'1', '1'>;
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
Splits a dot-prop style path into a tuple comprised of the properties in the path. Handles square-bracket notation.

@example
```
type A = ToPath<'foo.bar.baz'>;
//=> ['foo', 'bar', 'baz']

type B = ToPath<'foo[0].bar.baz'>;
//=> ['foo', '0', 'bar', 'baz']
```
*/
export type ToPath<Path extends string> = Split<FixPathSquareBrackets<Path>, '.', {strictLiteralChecks: false}>;

/**
Replaces square-bracketed dot notation with dots, for example, `foo[0].bar` -> `foo.0.bar`.
*/
// The fixed part of the path is kept in `Result`, so the recursion is in tail position and a long path does not hit the recursion limit.
type FixPathSquareBrackets<Path extends string, Result extends string = ''> =
	Path extends `[${infer Head}]${infer Tail}`
		? Tail extends `[${string}`
			? FixPathSquareBrackets<Tail, `${Result}${Head}.`>
			: FixPathSquareBrackets<Tail, `${Result}${Head}`>
		: Path extends `${infer Head}[${infer Middle}]${infer Tail}`
			? FixPathSquareBrackets<`[${Middle}]${Tail}`, `${Result}${Head}.`>
			: `${Result}${Path}`;

export {};
