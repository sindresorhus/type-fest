import {expectType} from 'tsd';
import type {Absolute} from '../source/absolute.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../source/numeric.d.ts';

// Integers
expectType<Absolute<0>>(0);
expectType<Absolute<1>>(1);
expectType<Absolute<-1>>(1);
expectType<Absolute<100>>(100);
expectType<Absolute<-100>>(100);

// Bigints
expectType<Absolute<0n>>(0n);
expectType<Absolute<512n>>(512n);
expectType<Absolute<-512n>>(512n);
expectType<Absolute<9_999_999_999_999_999n>>(9_999_999_999_999_999n);
expectType<Absolute<-9_999_999_999_999_999n>>(9_999_999_999_999_999n);

// Infinity
expectType<Absolute<PositiveInfinity>>({} as PositiveInfinity);
expectType<Absolute<NegativeInfinity>>({} as PositiveInfinity);

// Decimals
expectType<Absolute<3.1428>>(3.1428);
expectType<Absolute<-3.1428>>(3.1428);
expectType<Absolute<0.5>>(0.5);
expectType<Absolute<-0.5>>(0.5);

// Numeric separators
expectType<Absolute<1_000_000>>(1_000_000);
expectType<Absolute<-1_000_000>>(1_000_000);
expectType<Absolute<1_000_000n>>(1_000_000n);
expectType<Absolute<-1_000_000n>>(1_000_000n);

// Binaries
expectType<Absolute<0b10>>(0b10);
expectType<Absolute<-0b10>>(0b10);
expectType<Absolute<0b11_1000n>>(0b11_1000n);
expectType<Absolute<-0b11_1000n>>(0b11_1000n);

// Octals
expectType<Absolute<0o70>>(0o70);
expectType<Absolute<-0o70>>(0o70);
expectType<Absolute<0o77_7000n>>(0o77_7000n);
expectType<Absolute<-0o77_7000n>>(0o77_7000n);

// Hexadecimals
expectType<Absolute<0xF0>>(0xF0);
expectType<Absolute<-0xF0>>(0xF0);
expectType<Absolute<0xFF_F0_00n>>(0xFF_F0_00n);
expectType<Absolute<-0xFF_F0_00n>>(0xFF_F0_00n);

// Scientific notations
expectType<Absolute<6.022e23>>(6.022e23);
expectType<Absolute<-6.022e23>>(6.022e23);
expectType<Absolute<6.626e-34>>(6.626e-34);
expectType<Absolute<-6.626e-34>>(6.626e-34);
expectType<Absolute<3e8>>(3e8);
expectType<Absolute<-1.2345e2>>(1.2345e2);

// Non literals
expectType<number>({} as Absolute<number>);
expectType<bigint>({} as Absolute<bigint>);
expectType<number | bigint>({} as Absolute<number | bigint>);

// Unions
// 1. Literal members
expectType<Absolute<0 | 1 | 2>>({} as 0 | 1 | 2);
expectType<Absolute<2 | 4 | 8 | 16>>({} as 2 | 4 | 8 | 16);
expectType<Absolute<-98_765n | -12_345n>>({} as 98_765n | 12_345n);
expectType<Absolute<-2 | -1 | 0>>({} as 2 | 1 | 0);
expectType<Absolute<2 | -2>>(2);
expectType<Absolute<-12_345n | 12_345n>>(12_345n);
expectType<Absolute<2 | 4 | -12_345n>>({} as 2 | 4 | 12_345n);
expectType<Absolute<2 | 98_765n | 9.8 | 0b11n | 0o77 | 0xFF | 3e8>>({} as 2 | 98_765n | 9.8 | 0b11n | 0o77 | 0xFF | 3e8);
expectType<Absolute<-2 | -98_765n | -9.8 | -0b11n | -0o77 | -0xFF | -3e8>>({} as 2 | 98_765n | 9.8 | 0b11n | 0o77 | 0xFF | 3e8);
expectType<Absolute<-2 | -98_765n | 9.8 | 0b11n | 0o77 | -0xFF | 3e8>>({} as 2 | 98_765n | 9.8 | 0b11n | 0o77 | 0xFF | 3e8);

// 2. Literal and non-literal members
expectType<Absolute<bigint | 100>>({} as bigint | 100);
expectType<Absolute<bigint | -100>>({} as bigint | 100);
expectType<Absolute<123_456_789n | number>>({} as 123_456_789n | number);
expectType<Absolute<-123_456_789n | number>>({} as 123_456_789n | number);

// Boundary cases
expectType<any>({} as Absolute<any>);
expectType<never>({} as Absolute<never>);
