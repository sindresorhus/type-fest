import {expectTypeOf} from 'nz';
import type {If, IsNumberLike, LiteralUnion, NegativeInfinity, NonNegativeIntegerString, Opaque, Paths, PositiveInfinity, Tagged} from '../index.d.ts';

// Numbers
expectTypeOf<IsNumberLike<-1>>().toBe<true>();
expectTypeOf<IsNumberLike<1>>().toBe<true>();
expectTypeOf<IsNumberLike<0>>().toBe<true>();
expectTypeOf<IsNumberLike<-0>>().toBe<true>();
expectTypeOf<IsNumberLike<10_000>>().toBe<true>();
expectTypeOf<IsNumberLike<9_007_199_254_740_991>>().toBe<true>();
expectTypeOf<IsNumberLike<0x10>>().toBe<true>();
expectTypeOf<IsNumberLike<0xFF>>().toBe<true>();
expectTypeOf<IsNumberLike<0b101>>().toBe<true>();
expectTypeOf<IsNumberLike<0o17>>().toBe<true>();
expectTypeOf<IsNumberLike<1e21>>().toBe<true>();
expectTypeOf<IsNumberLike<1e-7>>().toBe<true>();
expectTypeOf<IsNumberLike<-1.1>>().toBe<true>();
expectTypeOf<IsNumberLike<1.1>>().toBe<true>();
expectTypeOf<IsNumberLike<1.2e+3>>().toBe<true>();
expectTypeOf<IsNumberLike<-1.2e+3>>().toBe<true>();
expectTypeOf<IsNumberLike<5e-3>>().toBe<true>();
expectTypeOf<IsNumberLike<-5e-3>>().toBe<true>();
expectTypeOf<IsNumberLike<1e3>>().toBe<true>();
expectTypeOf<IsNumberLike<number>>().toBe<true>();
// A wide `number` includes `NaN` and infinity.
expectTypeOf<IsNumberLike<typeof Number.NaN>>().toBe<true>();
expectTypeOf<IsNumberLike<PositiveInfinity>>().toBe<true>();
expectTypeOf<IsNumberLike<NegativeInfinity>>().toBe<true>();

// Integer strings
expectTypeOf<IsNumberLike<'-1'>>().toBe<true>();
expectTypeOf<IsNumberLike<'+1'>>().toBe<true>();
expectTypeOf<IsNumberLike<'1'>>().toBe<true>();
expectTypeOf<IsNumberLike<'0'>>().toBe<true>();
expectTypeOf<IsNumberLike<'-0'>>().toBe<true>();
expectTypeOf<IsNumberLike<'+0'>>().toBe<true>();
expectTypeOf<IsNumberLike<'0012'>>().toBe<true>();
expectTypeOf<IsNumberLike<'000'>>().toBe<true>();

// Float strings
expectTypeOf<IsNumberLike<'-1.1'>>().toBe<true>();
expectTypeOf<IsNumberLike<'+1.1'>>().toBe<true>();
expectTypeOf<IsNumberLike<'1.1'>>().toBe<true>();
expectTypeOf<IsNumberLike<'.5'>>().toBe<true>();
expectTypeOf<IsNumberLike<'-.5'>>().toBe<true>();
expectTypeOf<IsNumberLike<'+.5'>>().toBe<true>();
expectTypeOf<IsNumberLike<'1.'>>().toBe<true>();
expectTypeOf<IsNumberLike<'01.50'>>().toBe<true>();
expectTypeOf<IsNumberLike<'0.0'>>().toBe<true>();
expectTypeOf<IsNumberLike<'00.00'>>().toBe<true>();

// Scientific strings
expectTypeOf<IsNumberLike<'+1.2e+3'>>().toBe<true>();
expectTypeOf<IsNumberLike<'1.2e+3'>>().toBe<true>();
expectTypeOf<IsNumberLike<'+5e-3'>>().toBe<true>();
expectTypeOf<IsNumberLike<'5e-3'>>().toBe<true>();
expectTypeOf<IsNumberLike<'-1.2e+3'>>().toBe<true>();
expectTypeOf<IsNumberLike<'-5e-3'>>().toBe<true>();
expectTypeOf<IsNumberLike<'5e-20'>>().toBe<true>();
expectTypeOf<IsNumberLike<'1E3'>>().toBe<true>();
expectTypeOf<IsNumberLike<'1.e2'>>().toBe<true>();
expectTypeOf<IsNumberLike<'1.e3'>>().toBe<true>();
expectTypeOf<IsNumberLike<'-1.e3'>>().toBe<true>();
expectTypeOf<IsNumberLike<'-.5e2'>>().toBe<true>();
expectTypeOf<IsNumberLike<'1e+308'>>().toBe<true>();
expectTypeOf<IsNumberLike<'1e-400'>>().toBe<true>();
expectTypeOf<IsNumberLike<'5E-20'>>().toBe<true>();

// Radix-prefixed strings
expectTypeOf<IsNumberLike<'0x10'>>().toBe<true>();
expectTypeOf<IsNumberLike<'0Xff'>>().toBe<true>();
expectTypeOf<IsNumberLike<'0x0'>>().toBe<true>();
expectTypeOf<IsNumberLike<'0xDEADBEEF'>>().toBe<true>();
expectTypeOf<IsNumberLike<'0b101'>>().toBe<true>();
expectTypeOf<IsNumberLike<'0B10'>>().toBe<true>();
expectTypeOf<IsNumberLike<'0b0'>>().toBe<true>();
expectTypeOf<IsNumberLike<'0o17'>>().toBe<true>();
expectTypeOf<IsNumberLike<'0O10'>>().toBe<true>();
expectTypeOf<IsNumberLike<'0o0'>>().toBe<true>();

// The result follows TypeScript's own notion of a numeric string, which is lenient about surrounding whitespace, a leading `+`, and a hexadecimal form.
expectTypeOf<IsNumberLike<' 1'>>().toBe<true>();
expectTypeOf<IsNumberLike<'1 '>>().toBe<true>();
expectTypeOf<IsNumberLike<'\t-1.5\n'>>().toBe<true>();
expectTypeOf<IsNumberLike<'\u{A0}42\u{FEFF}'>>().toBe<true>();
expectTypeOf<IsNumberLike<'\u{3000}1\u{3000}'>>().toBe<true>();
expectTypeOf<IsNumberLike<'\u{FEFF}1'>>().toBe<true>();
expectTypeOf<IsNumberLike<'  +1.5e-3  '>>().toBe<true>();
expectTypeOf<IsNumberLike<'\n0x1f\t'>>().toBe<true>();
expectTypeOf<IsNumberLike<' 0x10 '>>().toBe<true>();
expectTypeOf<IsNumberLike<' 0b101 '>>().toBe<true>();
expectTypeOf<IsNumberLike<' 0o17 '>>().toBe<true>();
expectTypeOf<IsNumberLike<' '>>().toBe<true>();
expectTypeOf<IsNumberLike<'\t\n'>>().toBe<true>();
expectTypeOf<IsNumberLike<'\r1'>>().toBe<true>();
expectTypeOf<IsNumberLike<'\v1'>>().toBe<true>();
expectTypeOf<IsNumberLike<'\f1'>>().toBe<true>();
expectTypeOf<IsNumberLike<'\u{1680}1'>>().toBe<true>();
expectTypeOf<IsNumberLike<'\u{2007}1'>>().toBe<true>();
expectTypeOf<IsNumberLike<'\u{2028}1'>>().toBe<true>();
expectTypeOf<IsNumberLike<'\u{2029}1'>>().toBe<true>();

// Invalid numeric strings
expectTypeOf<IsNumberLike<''>>().toBe<false>();
expectTypeOf<IsNumberLike<'.'>>().toBe<false>();
expectTypeOf<IsNumberLike<'+'>>().toBe<false>();
expectTypeOf<IsNumberLike<'-'>>().toBe<false>();
expectTypeOf<IsNumberLike<'+.'>>().toBe<false>();
expectTypeOf<IsNumberLike<'-.'>>().toBe<false>();
expectTypeOf<IsNumberLike<'--1'>>().toBe<false>();
expectTypeOf<IsNumberLike<'++1'>>().toBe<false>();
expectTypeOf<IsNumberLike<'- 1'>>().toBe<false>();
expectTypeOf<IsNumberLike<'+ 1'>>().toBe<false>();
expectTypeOf<IsNumberLike<'foo'>>().toBe<false>();
expectTypeOf<IsNumberLike<'1.2.3'>>().toBe<false>();
expectTypeOf<IsNumberLike<'1..'>>().toBe<false>();
expectTypeOf<IsNumberLike<'..1'>>().toBe<false>();
expectTypeOf<IsNumberLike<'5+1.2'>>().toBe<false>();
expectTypeOf<IsNumberLike<'5e-3.1'>>().toBe<false>();
expectTypeOf<IsNumberLike<'1.2e3.4'>>().toBe<false>();
expectTypeOf<IsNumberLike<'1e'>>().toBe<false>();
expectTypeOf<IsNumberLike<'1e+'>>().toBe<false>();
expectTypeOf<IsNumberLike<'1e+-3'>>().toBe<false>();
expectTypeOf<IsNumberLike<'1e1e1'>>().toBe<false>();
expectTypeOf<IsNumberLike<'1ee1'>>().toBe<false>();
expectTypeOf<IsNumberLike<'e3'>>().toBe<false>();
expectTypeOf<IsNumberLike<'.e3'>>().toBe<false>();
expectTypeOf<IsNumberLike<'1e309'>>().toBe<false>();
expectTypeOf<IsNumberLike<'12px'>>().toBe<false>();
expectTypeOf<IsNumberLike<'1 2'>>().toBe<false>();
expectTypeOf<IsNumberLike<' 1 2 '>>().toBe<false>();
expectTypeOf<IsNumberLike<'1\t2'>>().toBe<false>();
expectTypeOf<IsNumberLike<'1,000'>>().toBe<false>();
expectTypeOf<IsNumberLike<'1,5'>>().toBe<false>();
expectTypeOf<IsNumberLike<'12,34'>>().toBe<false>();
expectTypeOf<IsNumberLike<'1_0'>>().toBe<false>();
expectTypeOf<IsNumberLike<'1_0.5'>>().toBe<false>();
expectTypeOf<IsNumberLike<'1.5_0'>>().toBe<false>();
expectTypeOf<IsNumberLike<'1n'>>().toBe<false>();
expectTypeOf<IsNumberLike<'Infinity'>>().toBe<false>();
expectTypeOf<IsNumberLike<'+Infinity'>>().toBe<false>();
expectTypeOf<IsNumberLike<'-Infinity'>>().toBe<false>();
expectTypeOf<IsNumberLike<' Infinity'>>().toBe<false>();
expectTypeOf<IsNumberLike<'infinity'>>().toBe<false>();
expectTypeOf<IsNumberLike<'true'>>().toBe<false>();
expectTypeOf<IsNumberLike<'null'>>().toBe<false>();
expectTypeOf<IsNumberLike<'NaN'>>().toBe<false>();
expectTypeOf<IsNumberLike<'NaN '>>().toBe<false>();
expectTypeOf<IsNumberLike<'\u{2212}1'>>().toBe<false>();
expectTypeOf<IsNumberLike<'\u{066B}'>>().toBe<false>();
expectTypeOf<IsNumberLike<'\u{2164}'>>().toBe<false>();
expectTypeOf<IsNumberLike<'\u{1D7CF}'>>().toBe<false>();
expectTypeOf<IsNumberLike<'\u{00BD}'>>().toBe<false>();
expectTypeOf<IsNumberLike<'\u{200B}'>>().toBe<false>();
expectTypeOf<IsNumberLike<'\u{200B}1'>>().toBe<false>();
expectTypeOf<IsNumberLike<'\u{0085}1'>>().toBe<false>();
expectTypeOf<IsNumberLike<'\u{180E}1'>>().toBe<false>();
expectTypeOf<IsNumberLike<'\u{0000}1'>>().toBe<false>();
expectTypeOf<IsNumberLike<'\u{0}'>>().toBe<false>();
expectTypeOf<IsNumberLike<'１２'>>().toBe<false>();

// Radix-prefixed strings have no sign, and the prefix needs at least one digit.
expectTypeOf<IsNumberLike<'0x'>>().toBe<false>();
expectTypeOf<IsNumberLike<'0xgg'>>().toBe<false>();
expectTypeOf<IsNumberLike<'0xh'>>().toBe<false>();
expectTypeOf<IsNumberLike<'0x1.5'>>().toBe<false>();
expectTypeOf<IsNumberLike<'0x1p3'>>().toBe<false>();
expectTypeOf<IsNumberLike<'0x1p-2'>>().toBe<false>();
expectTypeOf<IsNumberLike<'-0x10'>>().toBe<false>();
expectTypeOf<IsNumberLike<'-0b1'>>().toBe<false>();
expectTypeOf<IsNumberLike<'+0b10'>>().toBe<false>();
expectTypeOf<IsNumberLike<'000x10'>>().toBe<false>();
expectTypeOf<IsNumberLike<'0_x10'>>().toBe<false>();
expectTypeOf<IsNumberLike<'0b'>>().toBe<false>();
expectTypeOf<IsNumberLike<'0b2'>>().toBe<false>();
expectTypeOf<IsNumberLike<'0b1_0'>>().toBe<false>();
expectTypeOf<IsNumberLike<'0o'>>().toBe<false>();
expectTypeOf<IsNumberLike<'0o8'>>().toBe<false>();

// Template literal types use assignability, not an enumeration of their possible values.
expectTypeOf<IsNumberLike<`${number}`>>().toBe<true>();
expectTypeOf<IsNumberLike<`${bigint}`>>().toBe<false>();
expectTypeOf<IsNumberLike<`+${number}`>>().toBe<false>();
expectTypeOf<IsNumberLike<` ${number} `>>().toBe<false>();
expectTypeOf<IsNumberLike<`${number}px`>>().toBe<false>();
expectTypeOf<IsNumberLike<`x${number}`>>().toBe<false>();
expectTypeOf<IsNumberLike<`${number}x`>>().toBe<false>();
expectTypeOf<IsNumberLike<`${number}%`>>().toBe<false>();
expectTypeOf<IsNumberLike<`${number}${number}`>>().toBe<false>();
expectTypeOf<IsNumberLike<`${number}.${number}`>>().toBe<false>();
expectTypeOf<IsNumberLike<`${number}e${number}`>>().toBe<false>();
expectTypeOf<IsNumberLike<`-${number}`>>().toBe<false>();
expectTypeOf<IsNumberLike<`${number}-${number}`>>().toBe<false>();
expectTypeOf<IsNumberLike<`${boolean}`>>().toBe<false>();
expectTypeOf<IsNumberLike<`${number | bigint}`>>().toBe<boolean>();
expectTypeOf<IsNumberLike<`${number | ''}`>>().toBe<boolean>();
expectTypeOf<IsNumberLike<`${any}`>>().toBe<true>();
expectTypeOf<IsNumberLike<`${number}${string}`>>().toBe<false>();
expectTypeOf<IsNumberLike<`${string}${number}`>>().toBe<false>();
expectTypeOf<IsNumberLike<`1${number}`>>().toBe<false>();
expectTypeOf<IsNumberLike<`${number}1`>>().toBe<false>();
expectTypeOf<IsNumberLike<`${number}` | string>>().toBe<false>();
expectTypeOf<IsNumberLike<`${number}` | unknown>>().toBe<false>();
expectTypeOf<IsNumberLike<`${number}` | boolean>>().toBe<boolean>();
expectTypeOf<IsNumberLike<`${number}` | bigint>>().toBe<boolean>();
expectTypeOf<IsNumberLike<`${number}` | `-${number}`>>().toBe<boolean>();

// Intersections and brands
type Brand = {readonly brand: unique symbol};
expectTypeOf<IsNumberLike<number & Brand>>().toBe<true>();
expectTypeOf<IsNumberLike<'42' & Brand>>().toBe<true>();
expectTypeOf<IsNumberLike<string & Brand>>().toBe<false>();
expectTypeOf<IsNumberLike<string & `${number}`>>().toBe<true>();
expectTypeOf<IsNumberLike<'42' & `${number}`>>().toBe<true>();
expectTypeOf<IsNumberLike<'foo' & `${number}`>>().toBe<false>();
expectTypeOf<IsNumberLike<{} & 1>>().toBe<true>();
expectTypeOf<IsNumberLike<'1' & {}>>().toBe<true>();
expectTypeOf<IsNumberLike<unknown & 1>>().toBe<true>();
expectTypeOf<IsNumberLike<any & 1>>().toBe<boolean>();
expectTypeOf<IsNumberLike<number & {readonly brand: 'x'}>>().toBe<true>();
expectTypeOf<IsNumberLike<'42' & {readonly brand: 'x'}>>().toBe<true>();
// An intersection of template patterns is assignable to each of them.
expectTypeOf<IsNumberLike<`${number}` & `${bigint}`>>().toBe<true>();
// `number` and `${number}` intersect to `never`, because a number is not a string.
expectTypeOf<IsNumberLike<number & `${number}`>>().toBe<false>();
expectTypeOf<IsNumberLike<number & string>>().toBe<false>();
expectTypeOf<IsNumberLike<'42' & number>>().toBe<false>();
expectTypeOf<IsNumberLike<number & object>>().toBe<false>();
expectTypeOf<IsNumberLike<number & null>>().toBe<false>();
expectTypeOf<IsNumberLike<any & never>>().toBe<false>();
expectTypeOf<IsNumberLike<unknown & number>>().toBe<true>();
expectTypeOf<IsNumberLike<number & {}>>().toBe<true>();
expectTypeOf<IsNumberLike<any & string>>().toBe<boolean>();
expectTypeOf<IsNumberLike<never & 1>>().toBe<false>();
expectTypeOf<IsNumberLike<Tagged<number, 'Count'>>>().toBe<true>();
expectTypeOf<IsNumberLike<Tagged<'42', 'Port'>>>().toBe<true>();
expectTypeOf<IsNumberLike<Tagged<`${number}`, 'Port'>>>().toBe<true>();
expectTypeOf<IsNumberLike<Tagged<never, 'Port'>>>().toBe<false>();
expectTypeOf<IsNumberLike<Tagged<string, 'Port'>>>().toBe<false>();
expectTypeOf<IsNumberLike<Tagged<unknown, 'Port'>>>().toBe<false>();
expectTypeOf<IsNumberLike<Tagged<any, 'Port'>>>().toBe<boolean>();
expectTypeOf<IsNumberLike<Tagged<'invalid', 'Port'>>>().toBe<false>();
expectTypeOf<IsNumberLike<Tagged<'1e3', 'Port'>>>().toBe<true>();
expectTypeOf<IsNumberLike<Tagged<string, 'Port'> | '1'>>().toBe<boolean>();
expectTypeOf<IsNumberLike<Opaque<'42', 'Port'>>>().toBe<true>();
expectTypeOf<IsNumberLike<Opaque<number, 'Port'>>>().toBe<true>();
expectTypeOf<IsNumberLike<Opaque<string, 'Port'>>>().toBe<false>();

// An intersection of a union with a brand distributes before classification.
expectTypeOf<IsNumberLike<(number | string) & Brand>>().toBe<boolean>();
expectTypeOf<IsNumberLike<`${number}` & Brand>>().toBe<true>();
expectTypeOf<IsNumberLike<Opaque<1 | 2, 'Port'>>>().toBe<true>();
expectTypeOf<IsNumberLike<Opaque<1 | string, 'Port'>>>().toBe<boolean>();

// `LiteralUnion` keeps the literals next to the widened base type.
expectTypeOf<IsNumberLike<LiteralUnion<1 | 2, number>>>().toBe<true>();
expectTypeOf<IsNumberLike<LiteralUnion<1, string>>>().toBe<boolean>();
expectTypeOf<IsNumberLike<LiteralUnion<'1' | '2', string>>>().toBe<boolean>();
expectTypeOf<IsNumberLike<Tagged<LiteralUnion<1 | 2, number>, 'Value'>>>().toBe<true>();
expectTypeOf<IsNumberLike<Tagged<LiteralUnion<1 | 2, string>, 'Value'>>>().toBe<boolean>();
expectTypeOf<IsNumberLike<Tagged<LiteralUnion<'1' | '2', string>, 'Value'>>>().toBe<boolean>();
expectTypeOf<IsNumberLike<LiteralUnion<1 | 2, number> | object>>().toBe<boolean>();

// Unions are normalized before classification, and mixed results are `boolean`.
expectTypeOf<IsNumberLike<1 | '2' | '-3.5'>>().toBe<true>();
expectTypeOf<IsNumberLike<1 | 2 | 3>>().toBe<true>();
expectTypeOf<IsNumberLike<'1' | '2'>>().toBe<true>();
expectTypeOf<IsNumberLike<number | `${number}`>>().toBe<true>();
expectTypeOf<IsNumberLike<0 | '0'>>().toBe<true>();
expectTypeOf<IsNumberLike<'foo' | null | 1n>>().toBe<false>();
expectTypeOf<IsNumberLike<null | undefined>>().toBe<false>();
expectTypeOf<IsNumberLike<bigint | 1n>>().toBe<false>();
expectTypeOf<IsNumberLike<unknown | never>>().toBe<false>();
expectTypeOf<IsNumberLike<42 | 'unknown'>>().toBe<boolean>();
expectTypeOf<IsNumberLike<'1' | 'foo'>>().toBe<boolean>();
expectTypeOf<IsNumberLike<'1' | ''>>().toBe<boolean>();
expectTypeOf<IsNumberLike<'' | ' '>>().toBe<boolean>();
expectTypeOf<IsNumberLike<1 | 'a'>>().toBe<boolean>();
expectTypeOf<IsNumberLike<1 | '2' | true>>().toBe<boolean>();
expectTypeOf<IsNumberLike<number | bigint>>().toBe<boolean>();
expectTypeOf<IsNumberLike<bigint | '1'>>().toBe<boolean>();
expectTypeOf<IsNumberLike<object | 1>>().toBe<boolean>();
expectTypeOf<IsNumberLike<number | symbol>>().toBe<boolean>();
expectTypeOf<IsNumberLike<number | `${bigint}`>>().toBe<boolean>();
expectTypeOf<IsNumberLike<`${number}` | 'foo'>>().toBe<boolean>();
expectTypeOf<IsNumberLike<1 | null | undefined>>().toBe<boolean>();
expectTypeOf<IsNumberLike<number | undefined>>().toBe<boolean>();
expectTypeOf<IsNumberLike<number | string>>().toBe<boolean>();
expectTypeOf<IsNumberLike<PropertyKey>>().toBe<boolean>();
expectTypeOf<IsNumberLike<any | string>>().toBe<boolean>();
expectTypeOf<IsNumberLike<any | never>>().toBe<boolean>();
// A union member that subsumes the others decides the result.
expectTypeOf<IsNumberLike<'42' | string>>().toBe<false>();
expectTypeOf<IsNumberLike<string | `${number}`>>().toBe<false>();
expectTypeOf<IsNumberLike<1 | unknown>>().toBe<false>();
expectTypeOf<IsNumberLike<1 | never>>().toBe<true>();
expectTypeOf<IsNumberLike<1 | any>>().toBe<boolean>();

// Numeric enum members are numbers; string enum members are checked by their values.
enum NumericCode {
	Success = 200,
	Failure = 500,
}

enum Input {
	Port = '8080',
	Host = 'localhost',
}

enum Mixed {
	Number = 1,
	Text = 'b',
}

enum AllNumberValues {
	Number = 1,
	Text = '2',
}

enum NumericStrings {
	One = '1',
	Two = '2',
}

enum Negative {
	Minus = -1,
}

enum OneString {
	Only = 'abc',
}

expectTypeOf<IsNumberLike<NumericCode>>().toBe<true>();
expectTypeOf<IsNumberLike<NumericCode.Success>>().toBe<true>();
expectTypeOf<IsNumberLike<Negative.Minus>>().toBe<true>();
expectTypeOf<IsNumberLike<AllNumberValues>>().toBe<true>();
expectTypeOf<IsNumberLike<NumericStrings>>().toBe<true>();
expectTypeOf<IsNumberLike<Input.Port>>().toBe<true>();
expectTypeOf<IsNumberLike<Input.Host>>().toBe<false>();
expectTypeOf<IsNumberLike<OneString>>().toBe<false>();
expectTypeOf<IsNumberLike<Input>>().toBe<boolean>();
expectTypeOf<IsNumberLike<Mixed>>().toBe<boolean>();
// The enum object itself is an object, not a union of its member values.
expectTypeOf<IsNumberLike<typeof Input>>().toBe<false>();
expectTypeOf<IsNumberLike<typeof NumericCode>>().toBe<false>();
expectTypeOf<IsNumberLike<keyof typeof Input>>().toBe<false>();

const enum ConstNumeric {
	Code = 5,
}

declare enum ExternalCode {
	Known = 1,
	Computed,
}

expectTypeOf<IsNumberLike<ConstNumeric.Code>>().toBe<true>();
expectTypeOf<IsNumberLike<ExternalCode.Known>>().toBe<true>();
// An ambient member without a value is a computed member that is assignable to `number`.
expectTypeOf<IsNumberLike<ExternalCode.Computed>>().toBe<true>();
expectTypeOf<IsNumberLike<ExternalCode>>().toBe<true>();

// Special types and primitives that are not number-like
expectTypeOf<IsNumberLike<any>>().toBe<boolean>();
expectTypeOf<IsNumberLike<never>>().toBe<false>();
expectTypeOf<IsNumberLike<unknown>>().toBe<false>();
expectTypeOf<IsNumberLike<string>>().toBe<false>();
expectTypeOf<IsNumberLike<bigint>>().toBe<false>();
expectTypeOf<IsNumberLike<1n>>().toBe<false>();
expectTypeOf<IsNumberLike<boolean>>().toBe<false>();
expectTypeOf<IsNumberLike<true>>().toBe<false>();
expectTypeOf<IsNumberLike<false>>().toBe<false>();
expectTypeOf<IsNumberLike<symbol>>().toBe<false>();
expectTypeOf<IsNumberLike<null>>().toBe<false>();
expectTypeOf<IsNumberLike<undefined>>().toBe<false>();
expectTypeOf<IsNumberLike<void>>().toBe<false>();

// Values that coerce to numbers are excluded unless they are already numbers or numeric strings.
expectTypeOf<IsNumberLike<{}>>().toBe<false>();
expectTypeOf<IsNumberLike<object>>().toBe<false>();
expectTypeOf<IsNumberLike<InstanceType<typeof Number>>>().toBe<false>();
expectTypeOf<IsNumberLike<InstanceType<typeof String>>>().toBe<false>();
expectTypeOf<IsNumberLike<InstanceType<typeof Boolean>>>().toBe<false>();
expectTypeOf<IsNumberLike<typeof Number>>().toBe<false>();
expectTypeOf<IsNumberLike<Date>>().toBe<false>();
expectTypeOf<IsNumberLike<[]>>().toBe<false>();
expectTypeOf<IsNumberLike<readonly [42]>>().toBe<false>();
expectTypeOf<IsNumberLike<() => 42>>().toBe<false>();
expectTypeOf<IsNumberLike<{valueOf(): number}>>().toBe<false>();
expectTypeOf<IsNumberLike<{toString(): '42'}>>().toBe<false>();
expectTypeOf<IsNumberLike<{[Symbol.toPrimitive](): number}>>().toBe<false>();

// Other objects and functions
expectTypeOf<IsNumberLike<Map<string, number>>>().toBe<false>();
expectTypeOf<IsNumberLike<Set<number>>>().toBe<false>();
expectTypeOf<IsNumberLike<WeakMap<object, number>>>().toBe<false>();
expectTypeOf<IsNumberLike<Promise<number>>>().toBe<false>();
expectTypeOf<IsNumberLike<PromiseLike<number>>>().toBe<false>();
expectTypeOf<IsNumberLike<Uint8Array>>().toBe<false>();
expectTypeOf<IsNumberLike<RegExp>>().toBe<false>();
expectTypeOf<IsNumberLike<Error>>().toBe<false>();
expectTypeOf<IsNumberLike<Function>>().toBe<false>();
expectTypeOf<IsNumberLike<new () => object>>().toBe<false>();
expectTypeOf<IsNumberLike<abstract new () => object>>().toBe<false>();
expectTypeOf<IsNumberLike<Record<string, number>>>().toBe<false>();
expectTypeOf<IsNumberLike<Record<`${number}`, unknown>>>().toBe<false>();
expectTypeOf<IsNumberLike<{[Key in '1' | '2']: number}>>().toBe<false>();
expectTypeOf<IsNumberLike<{0: 1}>>().toBe<false>();
expectTypeOf<IsNumberLike<typeof globalThis>>().toBe<false>();

// Arrays and tuples
expectTypeOf<IsNumberLike<number[]>>().toBe<false>();
expectTypeOf<IsNumberLike<readonly number[]>>().toBe<false>();
expectTypeOf<IsNumberLike<unknown[]>>().toBe<false>();
expectTypeOf<IsNumberLike<any[]>>().toBe<false>();
expectTypeOf<IsNumberLike<readonly any[]>>().toBe<false>();
expectTypeOf<IsNumberLike<never[]>>().toBe<false>();

declare const uniqueValue: unique symbol;
expectTypeOf<IsNumberLike<typeof uniqueValue>>().toBe<false>();

// Keys use the same classification.
expectTypeOf<IsNumberLike<keyof {0: string; a: number}>>().toBe<boolean>();
expectTypeOf<IsNumberLike<keyof Record<number, unknown>>>().toBe<true>();
expectTypeOf<IsNumberLike<keyof {[key: number]: unknown}>>().toBe<true>();
expectTypeOf<IsNumberLike<keyof Record<`${number}`, unknown>>>().toBe<true>();
expectTypeOf<IsNumberLike<keyof Record<'1.5', string>>>().toBe<true>();
expectTypeOf<IsNumberLike<keyof Record<string, unknown>>>().toBe<false>();
expectTypeOf<IsNumberLike<keyof {[key: string]: unknown}>>().toBe<boolean>();
expectTypeOf<IsNumberLike<keyof {[key: `x${number}`]: string}>>().toBe<false>();

// Derived types keep the classification.
expectTypeOf<IsNumberLike<NonNullable<number | null>>>().toBe<true>();
expectTypeOf<IsNumberLike<Extract<number | string, number>>>().toBe<true>();
expectTypeOf<IsNumberLike<string['length']>>().toBe<true>();

// String helpers from the library follow the same assignability check.
expectTypeOf<IsNumberLike<NonNegativeIntegerString<'42'>>>().toBe<true>();
expectTypeOf<IsNumberLike<NonNegativeIntegerString<string>>>().toBe<false>();

// A value-based check needs a `const` type parameter to keep the literal, because a plain parameter widens it.
declare function classify<Value>(value: Value): IsNumberLike<Value>;
declare function classifyConst<const Value>(value: Value): IsNumberLike<Value>;

expectTypeOf(classify('42')).toBe<false>();
expectTypeOf(classify(42)).toBe<true>();
expectTypeOf(classifyConst('42')).toBe<true>();
expectTypeOf(classifyConst('auto')).toBe<false>();
expectTypeOf(classifyConst(42)).toBe<true>();
expectTypeOf(classifyConst(42 as number)).toBe<true>();
expectTypeOf(classifyConst('42' as string)).toBe<false>();

// An unresolved predicate still satisfies boolean constraints.
function _readClassification<Value>(classification: IsNumberLike<Value>): boolean {
	return classification;
}

// Consumers can select numeric fields without accepting optional, unknown, or mixed fields.
type NumberLikeProperties<Value> = {
	[Key in keyof Value as IsNumberLike<Value[Key]> extends true ? Key : never]: Value[Key];
};

expectTypeOf<NumberLikeProperties<{
	readonly count: number;
	port: '8080';
	price: '19.99';
	optional?: number;
	mixed: number | 'auto';
	label: string;
	unknown: unknown;
	untyped: any;
	impossible: never;
}>>().toBe<{readonly count: number; port: '8080'; price: '19.99'}>();

// Consumers can select numeric keys instead.
type NumberLikeKeys<Value> = {
	[Key in keyof Value]-?: IsNumberLike<Key> extends true ? Key : never;
}[keyof Value];

expectTypeOf<NumberLikeKeys<{0: 'first'; '1.5': 'half'; '-2': 'negative'; label: 'text'}>>().toBe<0 | '1.5' | '-2'>();
expectTypeOf<NumberLikeKeys<{label: 'text'}>>().toBe<never>();
expectTypeOf<NumberLikeKeys<{[key: number]: string; label: string}>>().toBe<number>();

// A conditional that falls back for values that are not number-like.
type CoerceToNumber<Value> = IsNumberLike<Value> extends true ? number : never;
expectTypeOf<CoerceToNumber<42>>().toBe<number>();
expectTypeOf<CoerceToNumber<'3.14'>>().toBe<number>();
expectTypeOf<CoerceToNumber<'3px'>>().toBe<never>();
expectTypeOf<CoerceToNumber<42 | 'auto'>>().toBe<never>();

// The classification can be read per property.
type ClassifyValues<Value> = {
	[Key in keyof Value]: IsNumberLike<Value[Key]>;
};

expectTypeOf<ClassifyValues<{a: 1; b: 'x'; c: '1' | 'x'}>>().toBe<{a: true; b: false; c: boolean}>();

// A mixed result is `boolean`, so a non-distributive conditional takes the false branch, while distributing over the union members first keeps both.
type Classify<Value> = IsNumberLike<Value> extends true ? 'numeric' : 'other';
type DistributedClassify<Value> = Value extends unknown ? (IsNumberLike<Value> extends true ? 'numeric' : 'other') : never;
expectTypeOf<Classify<'8080' | 'abc'>>().toBe<'other'>();
expectTypeOf<DistributedClassify<'8080' | 'abc'>>().toBe<'numeric' | 'other'>();

expectTypeOf<If<IsNumberLike<'42'>, 'numeric', 'other'>>().toBe<'numeric'>();
expectTypeOf<If<IsNumberLike<1n>, 'numeric', 'other'>>().toBe<'other'>();
expectTypeOf<If<IsNumberLike<42 | 'auto'>, 'numeric', 'other'>>().toBe<'numeric' | 'other'>();

// The existing Paths consumer still uses bracket notation for number-like keys.
expectTypeOf<Paths<{0: string; '1.5': boolean; label: number}, {bracketNotation: true}>>().toBe<'[0]' | '[1.5]' | 'label'>();
expectTypeOf<Paths<{0: {1: string}}, {bracketNotation: true}>>().toBe<'[0]' | '[0][1]'>();
expectTypeOf<Paths<{'-1': string}, {bracketNotation: true}>>().toBe<'[-1]'>();
expectTypeOf<Paths<{'+1': string}, {bracketNotation: true}>>().toBe<'[+1]'>();
