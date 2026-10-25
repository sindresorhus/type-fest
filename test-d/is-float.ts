import {expectTypeOf} from 'nz';
import type {IsFloat, IsInteger, Opaque, PositiveInfinity} from '../index.d.ts';

declare const x: unknown;

expectTypeOf(x as IsFloat<1.5>).toBe<true>();
expectTypeOf(x as IsFloat<999_999_999_999_999.9>).toBe<true>();
expectTypeOf(x as IsFloat<0.0000001>).toBe<true>();
expectTypeOf(x as IsFloat<-1e-7>).toBe<true>();

expectTypeOf(x as IsFloat<0>).toBe<false>();
expectTypeOf(x as IsFloat<1>).toBe<false>();
expectTypeOf(x as IsFloat<1.0>).toBe<false>(); // eslint-disable-line unicorn/no-zero-fractions
expectTypeOf(x as IsFloat<-1>).toBe<false>();
expectTypeOf(x as IsFloat<number>).toBe<false>();
expectTypeOf(x as IsFloat<0o10>).toBe<false>();
expectTypeOf(x as IsFloat<1n>).toBe<false>();
expectTypeOf(x as IsFloat<0n>).toBe<false>();
expectTypeOf(x as IsFloat<0b10>).toBe<false>();
expectTypeOf(x as IsFloat<0x10>).toBe<false>();
expectTypeOf(x as IsFloat<1e+100>).toBe<false>();
expectTypeOf(x as IsFloat<1.23e+21>).toBe<false>();
expectTypeOf(x as IsFloat<-1.23e+21>).toBe<false>();
expectTypeOf(x as IsFloat<'1.23'>).toBe<false>();
expectTypeOf(x as IsFloat<PositiveInfinity>).toBe<false>();

// A branded literal is still a literal, so the brand is removed before the checks run.
declare const brandedFloat: IsFloat<Opaque<5.5, 'A'>>;
expectTypeOf(brandedFloat).toBe<true>();

declare const brandedInteger: IsFloat<Opaque<5, 'A'>>;
expectTypeOf(brandedInteger).toBe<false>();

// `any` is not a float and not the absence of one, so the answer has to be `boolean` rather than a decision either way. It used to be `false`, which contradicted `IsInteger<any>`, whose number branch is defined as `Not<IsFloat<T>>` and which answers `boolean`: the same input was a definite no and a maybe at once.
declare const topType: IsFloat<any>;
expectTypeOf(topType).toBe<boolean>();

declare const topTypeInteger: IsInteger<any>;
expectTypeOf(topTypeInteger).toBe<boolean>();

// Fractional-value flags preserve the inferred model and distinguish numeric strings.
declare function fractionalFields<const Model extends object>(model: Model): {readonly [Key in keyof Model]: IsFloat<Model[Key]>};
const fractionalFieldFlags = fractionalFields({ratio: 1.5, retries: 3, label: '1.5', missing: undefined});
expectTypeOf(fractionalFieldFlags).toBe<{readonly ratio: true; readonly retries: false; readonly label: false; readonly missing: false}>();

function _readFractionalFlag<Value>(flag: IsFloat<Value>): boolean {
	return flag;
}

function _holdFractionalFlag<Value>(flag: IsFloat<Value>): {readonly fractional: IsFloat<Value>} {
	return {fractional: flag};
}

// The primitive shortcut preserves impossible, unknown and non-numeric inputs.
expectTypeOf<IsFloat<never>>().toBe<never>();
expectTypeOf<IsFloat<unknown>>().toBe<false>();
expectTypeOf<IsFloat<symbol>>().toBe<false>();
expectTypeOf<IsFloat<InstanceType<NumberConstructor>>>().toBe<false>();
expectTypeOf<IsFloat<2 | Opaque<2.5, 'Ratio'>>>().toBe<boolean>();
expectTypeOf<IsFloat<1.5 | Opaque<2.5, 'Ratio'>>>().toBe<true>();

enum RatioKind {
	Whole = 2,
	Fraction = 2.5,
}
expectTypeOf<IsFloat<RatioKind.Whole>>().toBe<false>();
expectTypeOf<IsFloat<RatioKind.Fraction>>().toBe<true>();
expectTypeOf<IsFloat<Opaque<RatioKind.Fraction, 'Ratio'>>>().toBe<true>();

// Numeric-looking values still need to be primitive numbers before float syntax is checked.
expectTypeOf<IsFloat<{valueOf(): 1.5}>>().toBe<false>();
expectTypeOf<IsFloat<ReadonlyArray<1.5>>>().toBe<false>();
expectTypeOf<IsFloat<() => 1.5>>().toBe<false>();
expectTypeOf<IsFloat<Opaque<'1.5', 'Text'>>>().toBe<false>();
expectTypeOf<IsFloat<1.5 | {value: 1.5}>>().toBe<boolean>();

// Exponents with a positive sign are integers even when the printed mantissa has a decimal point.
type FloatShapes<Values extends readonly number[]> = {[Index in keyof Values]: IsFloat<Values[Index]>};
expectTypeOf<FloatShapes<[-1.5, -1, 0, 0.25, 1e-7, 1e21, 1.5e21]>>().toBe<[true, false, false, true, true, false, false]>();
