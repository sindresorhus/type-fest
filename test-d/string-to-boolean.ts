import {expectTypeOf} from 'nz';
import type {StringToBoolean} from '../source/string-to-boolean.d.ts';
import type {Opaque, Tagged} from '../source/tagged.d.ts';

declare enum BooleanString {
	True = 'true',
	False = 'false',
	Maybe = 'maybe',
}

// True
expectTypeOf<StringToBoolean<'true'>>().toBe<true>();

// False
expectTypeOf<StringToBoolean<'false'>>().toBe<false>();

// Unions
expectTypeOf<StringToBoolean<'true' | 'false'>>().toBe<true | false>();
expectTypeOf<StringToBoolean<'true' | 'false' | 'maybe'>>().toBe<true | false>();
expectTypeOf<StringToBoolean<'true' | 'maybe'>>().toBe<true>();
expectTypeOf<StringToBoolean<'false' | 'maybe'>>().toBe<false>();
expectTypeOf<StringToBoolean<'true' | `${number}`>>().toBe<true>();
expectTypeOf<StringToBoolean<'true' | 'false' | '1' | '0'>>().toBe<true | false>();
expectTypeOf<StringToBoolean<`${number}` | 'false'>>().toBe<false>();

// Strings that look boolean-like but do not spell a boolean literal
expectTypeOf<StringToBoolean<'True'>>().toBe<never>();
expectTypeOf<StringToBoolean<'TRUE'>>().toBe<never>();
expectTypeOf<StringToBoolean<'1'>>().toBe<never>();
expectTypeOf<StringToBoolean<'0'>>().toBe<never>();
expectTypeOf<StringToBoolean<'yes'>>().toBe<never>();
expectTypeOf<StringToBoolean<'no'>>().toBe<never>();
expectTypeOf<StringToBoolean<'on'>>().toBe<never>();
expectTypeOf<StringToBoolean<''>>().toBe<never>();
expectTypeOf<StringToBoolean<'true '>>().toBe<never>();
expectTypeOf<StringToBoolean<' true'>>().toBe<never>();
expectTypeOf<StringToBoolean<'truefalse'>>().toBe<never>();
expectTypeOf<StringToBoolean<Uppercase<string>>>().toBe<never>();
expectTypeOf<StringToBoolean<'' | 'off'>>().toBe<never>();

// Template strings
expectTypeOf<StringToBoolean<`${boolean}`>>().toBe<boolean>();
expectTypeOf<StringToBoolean<`${number}`>>().toBe<never>();
expectTypeOf<StringToBoolean<`${boolean}!`>>().toBe<never>();
expectTypeOf<StringToBoolean<'true!'>>().toBe<never>();
expectTypeOf<StringToBoolean<`${number}.${number}`>>().toBe<never>();

// Open templates never spell a complete boolean
expectTypeOf<StringToBoolean<`true${string}`>>().toBe<never>();
expectTypeOf<StringToBoolean<`${string}false`>>().toBe<never>();
expectTypeOf<StringToBoolean<`${boolean}${number}`>>().toBe<never>();

// Special cases
expectTypeOf<StringToBoolean<string>>().toBe<boolean>();

// Boundary cases
expectTypeOf<StringToBoolean<never>>().toBe<never>();
expectTypeOf<StringToBoolean<any>>().toBe<boolean>();
expectTypeOf<StringToBoolean<any> | StringToBoolean<never>>().toBe<boolean>();

// String enum members parse by their string value
expectTypeOf<StringToBoolean<BooleanString.True>>().toBe<true>();
expectTypeOf<StringToBoolean<BooleanString.False>>().toBe<false>();
expectTypeOf<StringToBoolean<BooleanString.Maybe>>().toBe<never>();
expectTypeOf<StringToBoolean<BooleanString.True | BooleanString.False>>().toBe<true | false>();
expectTypeOf<StringToBoolean<BooleanString>>().toBe<true | false>();

// Parsing reads the boolean string beneath a brand and produces a plain boolean literal.
expectTypeOf<StringToBoolean<Tagged<'true', 'Text'>>>().toBe<true>();
expectTypeOf<StringToBoolean<Tagged<'false', 'Text'>>>().toBe<false>();
expectTypeOf<StringToBoolean<Opaque<'false', 'Text'>>>().toBe<false>();
expectTypeOf<StringToBoolean<Tagged<Tagged<'true', 'Text'>, 'Validated'>>>().toBe<true>();
expectTypeOf<StringToBoolean<Tagged<'true' | 'false' | 'maybe', 'Text'>>>().toBe<true | false>();
expectTypeOf<StringToBoolean<Tagged<'true' | 'maybe', 'Text'>>>().toBe<true>();
expectTypeOf<StringToBoolean<Tagged<string, 'Text'>>>().toBe<boolean>();
expectTypeOf<StringToBoolean<Tagged<`${boolean}`, 'Text'>>>().toBe<boolean>();
expectTypeOf<StringToBoolean<Tagged<`${number}`, 'Text'>>>().toBe<never>();
expectTypeOf<StringToBoolean<Tagged<Uppercase<string>, 'Text'>>>().toBe<never>();
expectTypeOf<StringToBoolean<Tagged<never, 'Text'>>>().toBe<never>();
expectTypeOf<StringToBoolean<Tagged<any, 'Text'>>>().toBe<boolean>();
expectTypeOf<StringToBoolean<Tagged<'true', 'A' | 'B'>>>().toBe<true>();
expectTypeOf<StringToBoolean<Tagged<BooleanString.True, 'Text'>>>().toBe<true>();
expectTypeOf<StringToBoolean<Opaque<'true', 'Token'>>>().toBe<true>();
expectTypeOf<StringToBoolean<'true' & {readonly brand: unique symbol}>>().toBe<true>();
expectTypeOf<StringToBoolean<'false' & {readonly brand: unique symbol}>>().toBe<false>();
expectTypeOf<StringToBoolean<'true' | Tagged<'false' | 'maybe', 'Text'>>>().toBe<true | false>();
// @ts-expect-error - Only strings can be parsed.
type UnknownString = StringToBoolean<unknown>;
// @ts-expect-error - Only strings can be parsed.
type NumberInput = StringToBoolean<number>;
// @ts-expect-error - Only strings can be parsed.
type BooleanInput = StringToBoolean<boolean>;
// @ts-expect-error - Only strings can be parsed.
type NullInput = StringToBoolean<null>;
// @ts-expect-error - Only strings can be parsed.
type UndefinedInput = StringToBoolean<undefined>;

function _readParsedBoolean<Value extends string>(value: StringToBoolean<Value>): boolean {
	return value;
}

function _rejectArbitraryParsedBoolean<Value extends string>(value: boolean): StringToBoolean<Value> {
	// @ts-expect-error A generic string might parse to a particular boolean literal or not parse at all.
	return value;
}
