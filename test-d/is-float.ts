import {expectTypeOf} from 'nz';
import type {IsFloat, IsInteger, Opaque, PositiveInfinity} from '../index.d.ts';

declare const x: unknown;

expectTypeOf(x as IsFloat<1.5>).toBe<true>();
expectTypeOf(x as IsFloat<999_999_999_999_999.9>).toBe<true>();
expectTypeOf(x as IsFloat<0.000_000_1>).toBe<true>();
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
