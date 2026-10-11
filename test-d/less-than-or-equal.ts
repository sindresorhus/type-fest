import {expectTypeOf} from 'nz';
import type {LessThanOrEqual} from '../index.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../source/numeric.d.ts';

declare const never: never;

expectTypeOf<LessThanOrEqual<1, 2>>().toBe<true>();
expectTypeOf<LessThanOrEqual<2, 1>>().toBe<false>();
expectTypeOf<LessThanOrEqual<10, 2>>().toBe<false>();
expectTypeOf<LessThanOrEqual<10, -2>>().toBe<false>();
expectTypeOf<LessThanOrEqual<2, 2>>().toBe<true>();
expectTypeOf<LessThanOrEqual<-2, -2>>().toBe<true>();
expectTypeOf<LessThanOrEqual<-2, -3>>().toBe<false>();
expectTypeOf<LessThanOrEqual<PositiveInfinity, -999>>().toBe<false>();
expectTypeOf<LessThanOrEqual<PositiveInfinity, 999>>().toBe<false>();
expectTypeOf<LessThanOrEqual<999, PositiveInfinity>>().toBe<true>();
expectTypeOf<LessThanOrEqual<999, NegativeInfinity>>().toBe<false>();
expectTypeOf<LessThanOrEqual<-999, NegativeInfinity>>().toBe<false>();
expectTypeOf<LessThanOrEqual<PositiveInfinity, PositiveInfinity>>().toBe<true>();
expectTypeOf<LessThanOrEqual<NegativeInfinity, NegativeInfinity>>().toBe<true>();
expectTypeOf<LessThanOrEqual<PositiveInfinity, NegativeInfinity>>().toBe<false>();

// Non-literal `number`
expectTypeOf<boolean>().toBe<LessThanOrEqual<number, number>>();
expectTypeOf<boolean>().toBe<LessThanOrEqual<number, 1>>();
expectTypeOf<boolean>().toBe<LessThanOrEqual<1, number>>();

// A number in exponential notation is larger or smaller than any number in plain decimal notation.
declare const plainLessThanOrEqualExponent: LessThanOrEqual<5, 1e21>;
expectTypeOf(plainLessThanOrEqualExponent).toBe<true>();
declare const exponentLessThanOrEqualPlain: LessThanOrEqual<1e21, 5>;
expectTypeOf(exponentLessThanOrEqualPlain).toBe<false>();
declare const negativeExponentLessThanOrEqualPlain: LessThanOrEqual<1e-7, 0.5>;
expectTypeOf(negativeExponentLessThanOrEqualPlain).toBe<true>();
declare const bothExponent: LessThanOrEqual<1e21, 2e21>;
expectTypeOf(bothExponent).toBe<boolean>();
