import {expectTypeOf} from 'nz';
import type {Absolute, Opaque} from '../index.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../source/numeric.d.ts';

// Integers
expectTypeOf<Absolute<0>>().toBe<0>();
expectTypeOf<Absolute<1>>().toBe<1>();
expectTypeOf<Absolute<-1>>().toBe<1>();
expectTypeOf<Absolute<100>>().toBe<100>();
expectTypeOf<Absolute<-100>>().toBe<100>();

// Bigints
expectTypeOf<Absolute<0n>>().toBe<0n>();
expectTypeOf<Absolute<512n>>().toBe<512n>();
expectTypeOf<Absolute<-512n>>().toBe<512n>();
expectTypeOf<Absolute<9_999_999_999_999_999n>>().toBe<9_999_999_999_999_999n>();
expectTypeOf<Absolute<-9_999_999_999_999_999n>>().toBe<9_999_999_999_999_999n>();

// Infinity
expectTypeOf<PositiveInfinity>().toBe<Absolute<PositiveInfinity>>();
expectTypeOf<PositiveInfinity>().toBe<Absolute<NegativeInfinity>>();

// Decimals
expectTypeOf<Absolute<3.1428>>().toBe<3.1428>();
expectTypeOf<Absolute<-3.1428>>().toBe<3.1428>();
expectTypeOf<Absolute<0.5>>().toBe<0.5>();
expectTypeOf<Absolute<-0.5>>().toBe<0.5>();

// Numeric separators
expectTypeOf<Absolute<1_000_000>>().toBe<1_000_000>();
expectTypeOf<Absolute<-1_000_000>>().toBe<1_000_000>();
expectTypeOf<Absolute<1_000_000n>>().toBe<1_000_000n>();
expectTypeOf<Absolute<-1_000_000n>>().toBe<1_000_000n>();

// Binaries
expectTypeOf<Absolute<0b10>>().toBe<0b10>();
expectTypeOf<Absolute<-0b10>>().toBe<0b10>();
expectTypeOf<Absolute<0b11_1000n>>().toBe<0b11_1000n>();
expectTypeOf<Absolute<-0b11_1000n>>().toBe<0b11_1000n>();

// Octals
expectTypeOf<Absolute<0o70>>().toBe<0o70>();
expectTypeOf<Absolute<-0o70>>().toBe<0o70>();
expectTypeOf<Absolute<0o77_7000n>>().toBe<0o77_7000n>();
expectTypeOf<Absolute<-0o77_7000n>>().toBe<0o77_7000n>();

// Hexadecimals
expectTypeOf<Absolute<0xF0>>().toBe<0xF0>();
expectTypeOf<Absolute<-0xF0>>().toBe<0xF0>();
expectTypeOf<Absolute<0xFF_F0_00n>>().toBe<0xFF_F0_00n>();
expectTypeOf<Absolute<-0xFF_F0_00n>>().toBe<0xFF_F0_00n>();

// Scientific notations
expectTypeOf<Absolute<6.022e23>>().toBe<6.022e23>();
expectTypeOf<Absolute<-6.022e23>>().toBe<6.022e23>();
expectTypeOf<Absolute<6.626e-34>>().toBe<6.626e-34>();
expectTypeOf<Absolute<-6.626e-34>>().toBe<6.626e-34>();
expectTypeOf<Absolute<3e8>>().toBe<3e8>();
expectTypeOf<Absolute<-1.2345e2>>().toBe<1.2345e2>();

// Non literals
expectTypeOf<Absolute<number>>().toBe<number>();
expectTypeOf<Absolute<bigint>>().toBe<bigint>();
expectTypeOf<Absolute<number | bigint>>().toBe<number | bigint>();

// Unions
// 1. Literal members
expectTypeOf<0 | 1 | 2>().toBe<Absolute<0 | 1 | 2>>();
expectTypeOf<2 | 4 | 8 | 16>().toBe<Absolute<2 | 4 | 8 | 16>>();
expectTypeOf<98_765n | 12_345n>().toBe<Absolute<-98_765n | -12_345n>>();
expectTypeOf<2 | 1 | 0>().toBe<Absolute<-2 | -1 | 0>>();
expectTypeOf<Absolute<2 | -2>>().toBe<2>();
expectTypeOf<Absolute<-12_345n | 12_345n>>().toBe<12_345n>();
expectTypeOf<2 | 4 | 12_345n>().toBe<Absolute<2 | 4 | -12_345n>>();
expectTypeOf<2 | 98_765n | 9.8 | 0b11n | 0o77 | 0xFF | 3e8>().toBe<Absolute<2 | 98_765n | 9.8 | 0b11n | 0o77 | 0xFF | 3e8>>();
expectTypeOf<2 | 98_765n | 9.8 | 0b11n | 0o77 | 0xFF | 3e8>().toBe<Absolute<-2 | -98_765n | -9.8 | -0b11n | -0o77 | -0xFF | -3e8>>();
expectTypeOf<2 | 98_765n | 9.8 | 0b11n | 0o77 | 0xFF | 3e8>().toBe<Absolute<-2 | -98_765n | 9.8 | 0b11n | 0o77 | -0xFF | 3e8>>();

// 2. Literal and non-literal members
expectTypeOf<bigint | 100>().toBe<Absolute<bigint | 100>>();
expectTypeOf<bigint | 100>().toBe<Absolute<bigint | -100>>();
expectTypeOf<123_456_789n | number>().toBe<Absolute<123_456_789n | number>>();
expectTypeOf<123_456_789n | number>().toBe<Absolute<-123_456_789n | number>>();

// Boundary cases
expectTypeOf<Absolute<any>>().toBe<any>();
expectTypeOf<Absolute<never>>().toBe<never>();

// A branded literal is still a literal, so the brand is removed before `${N}` is used, because that does not reduce for a literal intersected with an object type.
declare const brandedNegative: Absolute<Opaque<-5, 'A'>>;
expectTypeOf(brandedNegative).toBe<5>();

declare const brandedPositive: Absolute<Opaque<5, 'A'>>;
expectTypeOf(brandedPositive).toBe<5>();
