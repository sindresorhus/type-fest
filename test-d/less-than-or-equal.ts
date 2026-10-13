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

// Works with `bigint`, and with a `bigint` compared to a `number`.
expectTypeOf<LessThanOrEqual<1n, 2n>>().toBe<true>();
expectTypeOf<LessThanOrEqual<1n, 2>>().toBe<true>();
expectTypeOf<LessThanOrEqual<1, 2n>>().toBe<true>();
expectTypeOf<LessThanOrEqual<-2n, -1>>().toBe<true>();
expectTypeOf<LessThanOrEqual<1n, 1>>().toBe<true>();
expectTypeOf<LessThanOrEqual<1, 1n>>().toBe<true>();
expectTypeOf<LessThanOrEqual<2n, 1n>>().toBe<false>();
expectTypeOf<LessThanOrEqual<2n, 1>>().toBe<false>();
expectTypeOf<LessThanOrEqual<2, 1n>>().toBe<false>();

expectTypeOf<LessThanOrEqual<PositiveInfinity, -999n>>().toBe<false>();
expectTypeOf<LessThanOrEqual<PositiveInfinity, 999n>>().toBe<false>();
expectTypeOf<LessThanOrEqual<999n, PositiveInfinity>>().toBe<true>();
expectTypeOf<LessThanOrEqual<999n, NegativeInfinity>>().toBe<false>();
expectTypeOf<LessThanOrEqual<-999n, NegativeInfinity>>().toBe<false>();

// Non-literal `bigint`
expectTypeOf<LessThanOrEqual<bigint, bigint>>().toBe<boolean>();
expectTypeOf<LessThanOrEqual<bigint, 1>>().toBe<boolean>();
expectTypeOf<LessThanOrEqual<1, bigint>>().toBe<boolean>();

// `any` could be any value, so the result is `boolean`, and `never` is not a value, so there is nothing to compare.
expectTypeOf<LessThanOrEqual<any, 1n>>().toBe<boolean>();
expectTypeOf<LessThanOrEqual<1n, any>>().toBe<boolean>();
expectTypeOf<LessThanOrEqual<never, 1n>>().toBe<never>();

// A union mixing `bigint` and `number` values is compared per member.
expectTypeOf<LessThanOrEqual<5n | 5, 5>>().toBe<true>();
expectTypeOf<LessThanOrEqual<1n | 10, 5n>>().toBe<boolean>();
