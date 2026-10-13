import {expectTypeOf} from 'nz';
import type {Sum} from '../index.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../source/numeric.d.ts';

// Positive result
expectTypeOf<Sum<-999, 999>>().toBe<0>();
expectTypeOf<Sum<999, -999>>().toBe<0>();
expectTypeOf<Sum<0, 0>>().toBe<0>();
expectTypeOf<Sum<2, -2>>().toBe<0>();
expectTypeOf<Sum<-2, 2>>().toBe<0>();
expectTypeOf<Sum<1, 2>>().toBe<3>();
expectTypeOf<Sum<10, -2>>().toBe<8>();
expectTypeOf<Sum<-2, 10>>().toBe<8>();
expectTypeOf<Sum<-20, 77>>().toBe<57>();
expectTypeOf<Sum<-1, 999>>().toBe<998>();
expectTypeOf<Sum<999, 1>>().toBe<1000>();
expectTypeOf<Sum<999, 999>>().toBe<1998>();

// Negative result
expectTypeOf<Sum<-1, -2>>().toBe<-3>();
expectTypeOf<Sum<-10, 2>>().toBe<-8>();
expectTypeOf<Sum<2, -10>>().toBe<-8>();
expectTypeOf<Sum<20, -77>>().toBe<-57>();
expectTypeOf<Sum<-999, 1>>().toBe<-998>();
expectTypeOf<Sum<1, -999>>().toBe<-998>();
expectTypeOf<Sum<-999, -999>>().toBe<-1998>();

// Infinity
expectTypeOf<Sum<PositiveInfinity, -999>>().toBe<PositiveInfinity>();
expectTypeOf<Sum<-999, PositiveInfinity>>().toBe<PositiveInfinity>();
expectTypeOf<Sum<PositiveInfinity, PositiveInfinity>>().toBe<PositiveInfinity>();
expectTypeOf<Sum<NegativeInfinity, 999>>().toBe<NegativeInfinity>();
expectTypeOf<Sum<999, NegativeInfinity>>().toBe<NegativeInfinity>();
expectTypeOf<Sum<NegativeInfinity, NegativeInfinity>>().toBe<NegativeInfinity>();

// Number
expectTypeOf<Sum<number, 1>>().toBe<number>();
expectTypeOf<Sum<1, number>>().toBe<number>();
expectTypeOf<Sum<number, number>>().toBe<number>();
expectTypeOf<Sum<number, PositiveInfinity>>().toBe<number>();
expectTypeOf<Sum<NegativeInfinity, number>>().toBe<number>();
expectTypeOf<Sum<NegativeInfinity, PositiveInfinity>>().toBe<number>();
expectTypeOf<Sum<PositiveInfinity, NegativeInfinity>>().toBe<number>();

// Union
expectTypeOf<Sum<1, 2 | 3>>().toBe<3 | 4>();
expectTypeOf<Sum<1 | 2, 3>>().toBe<4 | 5>();
expectTypeOf<Sum<1 | 2 | 3, 4 | 5>>().toBe<5 | 6 | 7 | 8>();
expectTypeOf<Sum<1 | -2 | 3, 4 | -5 | 6>>().toBe<2 | 4 | 5 | 7 | 9 | -2 | -4 | -7>();

// Large numbers
expectTypeOf<Sum<1111, 2222>>().toBe<3333>();
expectTypeOf<Sum<-5000, 2000>>().toBe<-3000>();
expectTypeOf<Sum<6540, -530>>().toBe<6010>();
expectTypeOf<Sum<-8888, -12>>().toBe<-8900>();
expectTypeOf<Sum<9999, 1>>().toBe<10_000>();
expectTypeOf<Sum<999_999, 1>>().toBe<1_000_000>();
expectTypeOf<Sum<1, 999_999>>().toBe<1_000_000>();
expectTypeOf<Sum<123_456_789, 987>>().toBe<123_457_776>();
expectTypeOf<Sum<-1_000_000, 1>>().toBe<-999_999>();
expectTypeOf<Sum<1, -1_000_000>>().toBe<-999_999>();
expectTypeOf<Sum<-123_456, -654_321>>().toBe<-777_777>();
expectTypeOf<Sum<1_000_000 | 2_000_000, 5>>().toBe<1_000_005 | 2_000_005>();
expectTypeOf<Sum<9_007_199_254_740_990, 1>>().toBe<9_007_199_254_740_991>();

// A result that cannot be represented exactly is `number`.
expectTypeOf<Sum<9_007_199_254_740_991, 2>>().toBe<number>();
expectTypeOf<Sum<-9_007_199_254_740_991, -2>>().toBe<number>();
expectTypeOf<Sum<500_000_000_000_000_000_000, 500_000_000_000_000_000_000>>().toBe<number>();

// A decimal fraction is not supported, so the result is `never` rather than a silently truncated whole number.
expectTypeOf<Sum<0.5, 0.5>>().toBe<never>();
expectTypeOf<Sum<1.5, 1.5>>().toBe<never>();
expectTypeOf<Sum<0.25, 0.25>>().toBe<never>();
expectTypeOf<Sum<-0.5, -0.5>>().toBe<never>();

// A number written in exponent notation cannot be computed digit by digit either, so it resolves to `never` rather than a silently truncated whole number.
expectTypeOf<Sum<1e-7, 1>>().toBe<never>();
expectTypeOf<Sum<1e-7, 1e-7>>().toBe<never>();
expectTypeOf<Sum<1e21, 1>>().toBe<never>();
