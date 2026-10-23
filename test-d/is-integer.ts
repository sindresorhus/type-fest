import {expectTypeOf} from 'nz';
import type {Integer, IsInteger, NegativeInteger, NonNegativeInteger, Opaque, PositiveInfinity} from '../index.d.ts';

declare const x: unknown;

expectTypeOf(x as IsInteger<0>).toBe<true>();
expectTypeOf(x as IsInteger<1>).toBe<true>();
expectTypeOf(x as IsInteger<1.0>).toBe<true>(); // eslint-disable-line unicorn/no-zero-fractions
expectTypeOf(x as IsInteger<-1>).toBe<true>();
expectTypeOf(x as IsInteger<0o10>).toBe<true>();
expectTypeOf(x as IsInteger<1n>).toBe<true>();
expectTypeOf(x as IsInteger<0n>).toBe<true>();
expectTypeOf(x as IsInteger<0b10>).toBe<true>();
expectTypeOf(x as IsInteger<0x10>).toBe<true>();
expectTypeOf(x as IsInteger<1e+100>).toBe<true>();
expectTypeOf(x as IsInteger<1.23e+21>).toBe<true>();
expectTypeOf(x as IsInteger<-1.23e+21>).toBe<true>();

expectTypeOf(x as IsInteger<1.5>).toBe<false>();
expectTypeOf(x as IsInteger<-1.5>).toBe<false>();
expectTypeOf(x as IsInteger<number>).toBe<false>();
expectTypeOf(x as IsInteger<PositiveInfinity>).toBe<false>();
expectTypeOf(x as IsInteger<0.0000001>).toBe<false>();
expectTypeOf(x as IsInteger<-1e-7>).toBe<false>();

// A branded literal is still a literal, so the brand is removed before the checks run. Without it, `${T}` does not reduce for a literal intersected with an object type.
declare const brandedFloat: IsInteger<Opaque<5.5, 'A'>>;
expectTypeOf(brandedFloat).toBe<false>();

declare const brandedInteger: IsInteger<Opaque<5, 'A'>>;
expectTypeOf(brandedInteger).toBe<true>();

// A brand carries no numeric information, so a branded widened `number` is the same non-integer as the number itself. The identity check that catches the widened `number` did not remove the brand first, so it missed this one and answered `true`, where `IsFloat` and `IsNumericLiteral` both answer `false` for the same type.
declare const brandedWidenedNumber: IsInteger<Opaque<number, 'A'>>;
expectTypeOf(brandedWidenedNumber).toBe<false>();

// A numeric enum member is a literal, so it is an integer unless the value it holds is not one. `number extends Enum.A` is `true`, so the widened-number check has to be an identity check.
enum NumericEnum {
	A = 1,
	B = -1,
	C = 1.5,
	D = 1e21,
	E,
}

expectTypeOf(x as IsInteger<NumericEnum.A>).toBe<true>();
expectTypeOf(x as IsInteger<NumericEnum.B>).toBe<true>();
expectTypeOf(x as IsInteger<NumericEnum.E>).toBe<true>();
expectTypeOf(x as IsInteger<NumericEnum.D>).toBe<true>();
expectTypeOf(x as IsInteger<NumericEnum.C>).toBe<false>();

// Literal unions classify every member without widening their outcomes.
expectTypeOf<IsInteger<1 | -2 | 3n>>().toBe<true>();
expectTypeOf<IsInteger<1.5 | -2.5 | 1e-7>>().toBe<false>();
expectTypeOf<IsInteger<1 | 1.5>>().toBe<boolean>();
expectTypeOf<IsInteger<unknown>>().toBe<false>();
expectTypeOf<IsInteger<any>>().toBe<boolean>();
expectTypeOf<IsInteger<never>>().toBe<never>();
expectTypeOf<IsInteger<'42' | {value: 1}>>().toBe<false>();

function _readIntegerResult<Value>(result: IsInteger<Value>): boolean {
	return result;
}

declare function requireInteger<const Value extends number>(value: IsInteger<Value> extends true ? Value : never): Value;
expectTypeOf(requireInteger(42)).toBe<42>();
expectTypeOf(requireInteger(-42)).toBe<-42>();
expectTypeOf(requireInteger(NumericEnum.A)).toBe<NumericEnum.A>();
// @ts-expect-error Fractional values are rejected by the inferred parameter.
requireInteger(1.5);
// @ts-expect-error A runtime number is not proven to be an integer.
requireInteger(0 as number);

// Numeric filters preserve the original members after integer classification.
type MixedNumbers = -2 | -1.5 | 0 | 2 | 2.5;
expectTypeOf<Integer<MixedNumbers>>().toBe<-2 | 0 | 2>();
expectTypeOf<NonNegativeInteger<MixedNumbers>>().toBe<0 | 2>();
expectTypeOf<NegativeInteger<MixedNumbers>>().toBe<-2>();

function _readIntegerFlags<Values extends readonly unknown[]>(flags: {[Key in keyof Values]: IsInteger<Values[Key]>}): readonly boolean[] {
	return flags;
}
