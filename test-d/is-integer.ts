import {expectType} from 'tsd';
import type {IsInteger, Opaque, PositiveInfinity} from '../index.d.ts';

declare const x: unknown;

expectType<true>(x as IsInteger<0>);
expectType<true>(x as IsInteger<1>);
expectType<true>(x as IsInteger<1.0>); // eslint-disable-line unicorn/no-zero-fractions
expectType<true>(x as IsInteger<-1>);
expectType<true>(x as IsInteger<0o10>);
expectType<true>(x as IsInteger<1n>);
expectType<true>(x as IsInteger<0n>);
expectType<true>(x as IsInteger<0b10>);
expectType<true>(x as IsInteger<0x10>);
expectType<true>(x as IsInteger<1e+100>);
expectType<true>(x as IsInteger<1.23e+21>);
expectType<true>(x as IsInteger<-1.23e+21>);

expectType<false>(x as IsInteger<1.5>);
expectType<false>(x as IsInteger<-1.5>);
expectType<false>(x as IsInteger<number>);
expectType<false>(x as IsInteger<PositiveInfinity>);
expectType<false>(x as IsInteger<0.000_000_1>);
expectType<false>(x as IsInteger<-1e-7>);

// A branded literal is still a literal, so the brand is removed before the checks run. Without it, `${T}` does not reduce for a literal intersected with an object type.
declare const brandedFloat: IsInteger<Opaque<5.5, 'A'>>;
expectType<false>(brandedFloat);

declare const brandedInteger: IsInteger<Opaque<5, 'A'>>;
expectType<true>(brandedInteger);

// A brand carries no numeric information, so a branded widened `number` is the same non-integer as the number itself. The identity check that catches the widened `number` did not remove the brand first, so it missed this one and answered `true`, where `IsFloat` and `IsNumericLiteral` both answer `false` for the same type.
declare const brandedWidenedNumber: IsInteger<Opaque<number, 'A'>>;
expectType<false>(brandedWidenedNumber);

// A numeric enum member is a literal, so it is an integer unless the value it holds is not one. `number extends Enum.A` is `true`, so the widened-number check has to be an identity check.
enum NumericEnum {
	A = 1,
	B = -1,
	C = 1.5,
	D = 1e21,
	E,
}

expectType<true>(x as IsInteger<NumericEnum.A>);
expectType<true>(x as IsInteger<NumericEnum.B>);
expectType<true>(x as IsInteger<NumericEnum.E>);
expectType<true>(x as IsInteger<NumericEnum.D>);
expectType<false>(x as IsInteger<NumericEnum.C>);
