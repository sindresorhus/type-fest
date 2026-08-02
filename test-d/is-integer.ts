import {expectType} from 'tsd';
import type {IsInteger, PositiveInfinity} from '../index.d.ts';

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
