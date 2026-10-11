import {expectTypeOf} from 'nz';
import type {GreaterThanOrEqual} from '../index.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../source/numeric.d.ts';

declare const never: never;

expectTypeOf<GreaterThanOrEqual<1, 2>>().toBe<false>();
expectTypeOf<GreaterThanOrEqual<2, 1>>().toBe<true>();
expectTypeOf<GreaterThanOrEqual<10, 2>>().toBe<true>();
expectTypeOf<GreaterThanOrEqual<10, -2>>().toBe<true>();
expectTypeOf<GreaterThanOrEqual<2, 2>>().toBe<true>();
expectTypeOf<GreaterThanOrEqual<-2, -2>>().toBe<true>();
expectTypeOf<GreaterThanOrEqual<-2, -3>>().toBe<true>();

// === unions ===
expectTypeOf<GreaterThanOrEqual<100 | 200, 50>>().toBe<true>();
expectTypeOf<GreaterThanOrEqual<25, -100 | -15 | 2 | 21>>().toBe<true>();
expectTypeOf<GreaterThanOrEqual<10 | 15, -5 | 10>>().toBe<true>();

expectTypeOf<GreaterThanOrEqual<10, 50 | 100>>().toBe<false>();
expectTypeOf<GreaterThanOrEqual<50 | 25 | 0 | -16, 100>>().toBe<false>();
expectTypeOf<GreaterThanOrEqual<1 | 2, 3 | 4>>().toBe<false>();

expectTypeOf<boolean>().toBe<GreaterThanOrEqual<-10, -90 | 90>>();
expectTypeOf<boolean>().toBe<GreaterThanOrEqual<-16 | 16, 0>>();
expectTypeOf<boolean>().toBe<GreaterThanOrEqual<-4 | 45, 20 | 30>>();
expectTypeOf<boolean>().toBe<GreaterThanOrEqual<1 | -1 | 3, 0 | 2>>();
expectTypeOf<boolean>().toBe<GreaterThanOrEqual<1 | 2 | 3, 3 | 4>>();
expectTypeOf<boolean>().toBe<GreaterThanOrEqual<1, 1 | 2>>();

expectTypeOf<GreaterThanOrEqual<PositiveInfinity, -999>>().toBe<true>();
expectTypeOf<GreaterThanOrEqual<PositiveInfinity, 999>>().toBe<true>();
expectTypeOf<GreaterThanOrEqual<999, PositiveInfinity>>().toBe<false>();
expectTypeOf<GreaterThanOrEqual<999, NegativeInfinity>>().toBe<true>();
expectTypeOf<GreaterThanOrEqual<-999, NegativeInfinity>>().toBe<true>();
expectTypeOf<GreaterThanOrEqual<PositiveInfinity, PositiveInfinity>>().toBe<true>();
expectTypeOf<GreaterThanOrEqual<NegativeInfinity, NegativeInfinity>>().toBe<true>();
expectTypeOf<GreaterThanOrEqual<PositiveInfinity, NegativeInfinity>>().toBe<true>();

// Non-literal `number`
expectTypeOf<boolean>().toBe<GreaterThanOrEqual<number, number>>();
expectTypeOf<boolean>().toBe<GreaterThanOrEqual<number, 1>>();
expectTypeOf<boolean>().toBe<GreaterThanOrEqual<1, number>>();

// A number in exponential notation is larger or smaller than any number in plain decimal notation.
declare const exponentGreaterThanOrEqualPlain: GreaterThanOrEqual<1e21, 5>;
expectTypeOf(exponentGreaterThanOrEqualPlain).toBe<true>();
declare const plainGreaterThanOrEqualExponent: GreaterThanOrEqual<5, 1e21>;
expectTypeOf(plainGreaterThanOrEqualExponent).toBe<false>();
declare const negativeExponentGreaterThanOrEqualZero: GreaterThanOrEqual<1e-7, 0>;
expectTypeOf(negativeExponentGreaterThanOrEqualZero).toBe<true>();
declare const sameExponent: GreaterThanOrEqual<1e21, 1e21>;
expectTypeOf(sameExponent).toBe<true>();
declare const bothExponent: GreaterThanOrEqual<1e21, 2e21>;
expectTypeOf(bothExponent).toBe<boolean>();
