import {expectTypeOf} from 'nz';
import type {Subtract} from '../index.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../source/numeric.d.ts';

// Positive result
expectTypeOf<Subtract<10, -2>>().toBe<12>();
expectTypeOf<Subtract<0, 0>>().toBe<0>();
expectTypeOf<Subtract<2, 2>>().toBe<0>();
expectTypeOf<Subtract<-1, -3>>().toBe<2>();
expectTypeOf<Subtract<12, 5>>().toBe<7>();
expectTypeOf<Subtract<69, 0>>().toBe<69>();
expectTypeOf<Subtract<999, -1>>().toBe<1000>();
expectTypeOf<Subtract<999, -999>>().toBe<1998>();

// Negative result
expectTypeOf<Subtract<1, 2>>().toBe<-1>();
expectTypeOf<Subtract<-10, -4>>().toBe<-6>();
expectTypeOf<Subtract<-10, 4>>().toBe<-14>();
expectTypeOf<Subtract<-111, 222>>().toBe<-333>();
expectTypeOf<Subtract<0, 420>>().toBe<-420>();
expectTypeOf<Subtract<-999, 1>>().toBe<-1000>();
expectTypeOf<Subtract<-999, 999>>().toBe<-1998>();

// Infinity
expectTypeOf<Subtract<PositiveInfinity, 999>>().toBe<PositiveInfinity>();
expectTypeOf<Subtract<-999, PositiveInfinity>>().toBe<NegativeInfinity>();
expectTypeOf<Subtract<NegativeInfinity, 999>>().toBe<NegativeInfinity>();
expectTypeOf<Subtract<999, NegativeInfinity>>().toBe<PositiveInfinity>();
expectTypeOf<Subtract<NegativeInfinity, PositiveInfinity>>().toBe<NegativeInfinity>();

// Number
expectTypeOf<Subtract<number, 2>>().toBe<number>();
expectTypeOf<Subtract<2, number>>().toBe<number>();
expectTypeOf<Subtract<number, number>>().toBe<number>();
expectTypeOf<Subtract<NegativeInfinity, NegativeInfinity>>().toBe<number>();
expectTypeOf<Subtract<PositiveInfinity, PositiveInfinity>>().toBe<number>();
expectTypeOf<Subtract<number, PositiveInfinity>>().toBe<number>();
expectTypeOf<Subtract<PositiveInfinity, number>>().toBe<number>();

// Union
expectTypeOf<Subtract<10, 1 | 2>>().toBe<9 | 8>();
expectTypeOf<Subtract<10 | 5, 1>>().toBe<9 | 4>();
expectTypeOf<Subtract<10 | 5, 1 | 2>>().toBe<9 | 8 | 4 | 3>();
expectTypeOf<Subtract<10 | -5, -1 | 2>>().toBe<11 | 8 | -4 | -7>();

// Large numbers
expectTypeOf<Subtract<1111, 2222>>().toBe<-1111>();
expectTypeOf<Subtract<-5000, 2000>>().toBe<-7000>();
expectTypeOf<Subtract<6540, -530>>().toBe<7070>();
expectTypeOf<Subtract<-8888, -12>>().toBe<-8876>();

// A decimal fraction is not supported, so the result is `never` rather than a silently truncated whole number.
expectTypeOf<Subtract<0.5, 0.25>>().toBe<never>();
expectTypeOf<Subtract<1.5, 1.25>>().toBe<never>();
expectTypeOf<Subtract<-0.5, -0.25>>().toBe<never>();

// A number written in exponent notation cannot be computed digit by digit either, so it resolves to `never` rather than a silently truncated whole number.
expectTypeOf<Subtract<1e-7, 1>>().toBe<never>();
expectTypeOf<Subtract<3, 1e-7>>().toBe<never>();
expectTypeOf<Subtract<1, 1e21>>().toBe<never>();
