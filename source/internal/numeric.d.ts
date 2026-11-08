import type {UnknownArray} from '../unknown-array.d.ts';
import type {TupleOf} from '../tuple-of.d.ts';
import type {IfNotAnyOrNever} from './type.d.ts';

/**
Check whether the given type is a number or a number string.

Supports floating-point as a string.

@example
```
type A = IsNumberLike<'1'>;
//=> true

type B = IsNumberLike<'-1.1'>;
//=> true

type C = IsNumberLike<'5e-20'>;
//=> true

type D = IsNumberLike<1>;
//=> true

type E = IsNumberLike<'a'>;
//=> false
*/
export type IsNumberLike<N> =
	IfNotAnyOrNever<N, {
		ifNot: N extends number | `${number}`
			? true
			: false;
		ifAny: boolean;
		ifNever: false;
	}>;

/**
Returns the sum of two non-negative integers.

It adds digit by digit, so it is not limited by the maximum length of a tuple. It is exact while both numbers are within `Number.MAX_SAFE_INTEGER`, and returns `number` for a result that is too large to be represented exactly.

@example
```
type A = NonNegativeIntegerSum<999_999, 1>;
//=> 1000000
```
*/
export type NonNegativeIntegerSum<A extends number, B extends number> =
	ToNumber<SumOfReversedDigits<ReverseString<`${A}`>, ReverseString<`${B}`>>>;

/**
Returns the difference of two non-negative integers, where `A` is not less than `B`.

It subtracts digit by digit, so it is not limited by the maximum length of a tuple. It is exact while both numbers are within `Number.MAX_SAFE_INTEGER`, and returns `number` for a result that is too large to be represented exactly.

@example
```
type A = NonNegativeIntegerDifference<1_000_000, 1>;
//=> 999999
```
*/
export type NonNegativeIntegerDifference<A extends number, B extends number> =
	ToNumber<TrimLeadingZeros<DifferenceOfReversedDigits<ReverseString<`${A}`>, ReverseString<`${B}`>>>>;

type ReverseString<S extends string> = S extends `${infer First}${infer Rest}` ? `${ReverseString<Rest>}${First}` : '';

// A string that is not exactly a number, like one with leading zeros or one too large to be represented exactly, becomes `number`.
type ToNumber<S extends string> = S extends `${infer N extends number}` ? N : never;

type TrimLeadingZeros<S extends string> = S extends `0${infer Rest}`
	? Rest extends ''
		? '0'
		: TrimLeadingZeros<Rest>
	: S;

// Splits off the least significant digit of the reversed digits, as a tuple of that length. When there are no digits left, the digit is `0`, so a shorter number is padded with zeros.
type SplitDigit<S extends string> = S extends `${infer Digit extends number}${infer Rest}` ? [TupleOf<Digit>, Rest] : [[], ''];

type Ten = TupleOf<10>;

// The digits are reversed, so they are added from the least significant one, and each digit of the result is put in front of the previous ones.
type SumOfReversedDigits<A extends string, B extends string, Carry extends UnknownArray = [], Result extends string = ''> =
	`${A}${B}` extends ''
		? `${Carry['length'] extends 0 ? '' : '1'}${Result}`
		: [SplitDigit<A>, SplitDigit<B>] extends [[infer DigitA extends UnknownArray, infer RestA extends string], [infer DigitB extends UnknownArray, infer RestB extends string]]
			? [...DigitA, ...DigitB, ...Carry] extends [...Ten, ...infer Digit]
				? SumOfReversedDigits<RestA, RestB, [unknown], `${Digit['length']}${Result}`>
				: SumOfReversedDigits<RestA, RestB, [], `${[...DigitA, ...DigitB, ...Carry]['length']}${Result}`>
			: never; // Should never happen

// Like `SumOfReversedDigits`, but it borrows from the next digit. `A` is not less than `B`, so nothing is borrowed after the last digit.
type DifferenceOfReversedDigits<A extends string, B extends string, Borrow extends UnknownArray = [], Result extends string = ''> =
	A extends ''
		? Result
		: [SplitDigit<A>, SplitDigit<B>] extends [[infer DigitA extends UnknownArray, infer RestA extends string], [infer DigitB extends UnknownArray, infer RestB extends string]]
			? DigitA extends [...DigitB, ...Borrow, ...infer Digit]
				? DifferenceOfReversedDigits<RestA, RestB, [], `${Digit['length']}${Result}`>
				: [...Ten, ...DigitA] extends [...DigitB, ...Borrow, ...infer Digit]
					? DifferenceOfReversedDigits<RestA, RestB, [unknown], `${Digit['length']}${Result}`>
					: never // Should never happen
			: never; // Should never happen

export {};
