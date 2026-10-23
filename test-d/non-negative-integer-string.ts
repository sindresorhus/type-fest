import {expectTypeOf} from 'nz';
import type {NonNegativeIntegerString, Opaque, StringRepeat, Tagged} from '../index.d.ts';

// Valid strings are kept as is
expectTypeOf<NonNegativeIntegerString<'0'>>().toBe<'0'>();
expectTypeOf<NonNegativeIntegerString<'42'>>().toBe<'42'>();
expectTypeOf<NonNegativeIntegerString<'007'>>().toBe<'007'>();
expectTypeOf<NonNegativeIntegerString<'00'>>().toBe<'00'>();
expectTypeOf<NonNegativeIntegerString<'1234567890123456789'>>().toBe<'1234567890123456789'>();
expectTypeOf<NonNegativeIntegerString<'99999999999999999999999999999999999999'>>().toBe<'99999999999999999999999999999999999999'>();

// A long string is validated without losing any digits.
type LongDigits = '1111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111';
expectTypeOf<NonNegativeIntegerString<LongDigits>>().toBe<LongDigits>();

// Any other character is rejected
expectTypeOf<NonNegativeIntegerString<''>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'-1'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'-0'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'+1'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'--1'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'1.0'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'1.5'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'.5'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'5.'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'1e3'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'1E3'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'1e-3'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'0x10'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'0b10'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'0o10'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'1_000'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<' 42'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'42 '>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'\n42'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'4\t2'>>().toBe<never>();
// A non-breaking space and a zero-width space are not decimal digits
expectTypeOf<NonNegativeIntegerString<'\u{A0}42'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'42\u{200B}'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'42a'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'a42'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'Infinity'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'NaN'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'１'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'١'>>().toBe<never>();

// A union is kept only when every member is valid
expectTypeOf<NonNegativeIntegerString<'1' | '2'>>().toBe<'1' | '2'>();
expectTypeOf<NonNegativeIntegerString<'1' | 'a'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'1' | '2' | 'a'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'1' | '-2'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'1' | ''>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'1' | `${number}`>>().toBe<never>();

// Types that are not a single literal are rejected
expectTypeOf<NonNegativeIntegerString<string>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<Uppercase<string>>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<`${number}`>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<`1${number}`>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<`${bigint}`>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<any>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<never>>().toBe<never>();

// A tagged wide string is not a literal, so it is rejected. Pass it next to the type instead.
expectTypeOf<NonNegativeIntegerString<Tagged<string, 'UserId'>>>().toBe<never>();

// The result is assignable to `string`, but not to a different literal
expectTypeOf<NonNegativeIntegerString<'42'>>().toBeAssignableTo<string>();
expectTypeOf<NonNegativeIntegerString<'42'>>().not.toBe<'43'>();

declare function setCount<T extends string>(count: NonNegativeIntegerString<T>): void;

setCount('42');
setCount('007');
// @ts-expect-error
setCount('-1');
// @ts-expect-error
setCount('1.5');
// @ts-expect-error
setCount('');
declare const wideString: string;
// @ts-expect-error
setCount(wideString);

// A runtime check with a tagged type accepts a value that is only known at runtime
type UserId = Tagged<string, 'UserId'>;

declare function isUserId(value: string): value is UserId;
declare function getUser<T extends string>(userId: NonNegativeIntegerString<T> | UserId): void;

getUser('42');

declare const input: string;

if (isUserId(input)) {
	getUser(input);
}

// The type argument must be a string
// @ts-expect-error
type InvalidNumber = NonNegativeIntegerString<42>;
// @ts-expect-error
type InvalidUnknown = NonNegativeIntegerString<unknown>;

// Validate the underlying digits while preserving a valid string's brand.
expectTypeOf<NonNegativeIntegerString<Tagged<'123', 'Text'>>>().toBe<Tagged<'123', 'Text'>>();
expectTypeOf<NonNegativeIntegerString<Opaque<'007', 'Text'>>>().toBe<Opaque<'007', 'Text'>>();
expectTypeOf<NonNegativeIntegerString<Tagged<'', 'Text'>>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<Tagged<'-1', 'Text'>>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<Tagged<'1.5', 'Text'>>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<Tagged<'1a', 'Text'>>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<Tagged<'0' | '007', 'Text'>>>().toBe<Tagged<'0' | '007', 'Text'>>();
expectTypeOf<NonNegativeIntegerString<Tagged<'1' | 'a', 'Text'>>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<Tagged<'1' | '', 'Text'>>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<Tagged<Tagged<'42', 'Text'>, 'Validated'>>>().toBe<Tagged<Tagged<'42', 'Text'>, 'Validated'>>();
expectTypeOf<NonNegativeIntegerString<Tagged<Tagged<'', 'Text'>, 'Validated'>>>().toBe<never>();
type BrandedDigits = '42' & {readonly brand: unique symbol};
expectTypeOf<NonNegativeIntegerString<BrandedDigits>>().toBe<BrandedDigits>();
expectTypeOf<NonNegativeIntegerString<Tagged<StringRepeat<'1', 999>, 'Text'>>>().toBe<Tagged<StringRepeat<'1', 999>, 'Text'>>();

// An empty string enum member is still empty.
enum NumericText {
	Empty = '',
	Digits = '42',
}
expectTypeOf<NonNegativeIntegerString<NumericText.Empty>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<NumericText>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<NumericText.Digits>>().toBe<NumericText.Digits>();
expectTypeOf<NonNegativeIntegerString<Tagged<NumericText.Empty, 'Text'>>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<Tagged<NumericText.Digits, 'Text'>>>().toBe<Tagged<NumericText.Digits, 'Text'>>();

// Decimal spelling remains strict for syntax that belongs to other numeric tokens.
expectTypeOf<NonNegativeIntegerString<'42n'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'42\n'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'4/* comment */2'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'4\u{2028}2'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<'0X10' | '0B10' | '0O10'>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<`00${'1' | '2'}`>>().toBe<'001' | '002'>();
expectTypeOf<NonNegativeIntegerString<'42' | '42n'>>().toBe<never>();

declare function acceptDigits<const Digits extends string>(value: NonNegativeIntegerString<Digits>): Digits;
expectTypeOf(acceptDigits('00018446744073709551615')).toBe<'00018446744073709551615'>();
declare const taggedIdentifier: Tagged<'00042', 'Identifier'>;
expectTypeOf(acceptDigits(taggedIdentifier)).toBe<Tagged<'00042', 'Identifier'>>();
// @ts-expect-error A bigint suffix is not part of a decimal identifier.
acceptDigits('42n');
// @ts-expect-error An invalid union member prevents accepting the whole identifier type.
acceptDigits('42' as '42' | '4_2');

// A fixed prefix cannot make an unknown numeric substring safe: it can still contain a sign or a fraction.
expectTypeOf<NonNegativeIntegerString<`${1 | 2}${number}`>>().toBe<never>();
expectTypeOf<NonNegativeIntegerString<`${'0' | '9'}${'0' | '9'}`>>().toBe<'00' | '09' | '90' | '99'>();

// Compiler token validation does not impose a per-character type recursion limit.
type LongIdentifier = StringRepeat<'7', 1200>;
expectTypeOf<NonNegativeIntegerString<LongIdentifier>>().toBe<LongIdentifier>();
expectTypeOf<NonNegativeIntegerString<`${LongIdentifier}n`>>().toBe<never>();
declare const longIdentifier: LongIdentifier;
expectTypeOf(acceptDigits(longIdentifier)).toBe<LongIdentifier>();

function preserveIdentifier<Value extends string>(value: NonNegativeIntegerString<Value>): {value: Value} {
	return {value};
}

const preservedIdentifier = preserveIdentifier('00018446744073709551615');
expectTypeOf(preservedIdentifier.value).toBe<'00018446744073709551615'>();
// @ts-expect-error The validated identifier retains every digit, including its leading zeros.
preservedIdentifier.value = '18446744073709551615';

function _readValidatedIdentifier<Value extends string>(value: NonNegativeIntegerString<Value>): Value {
	return value;
}
