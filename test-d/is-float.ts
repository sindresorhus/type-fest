import {expectType} from 'tsd';
import type {IsFloat, PositiveInfinity} from '../index.d.ts';

declare const x: unknown;

expectType<true>(x as IsFloat<1.5>);
expectType<true>(x as IsFloat<999_999_999_999_999.9>);
expectType<true>(x as IsFloat<0.000_000_1>);
expectType<true>(x as IsFloat<-1e-7>);

expectType<false>(x as IsFloat<0>);
expectType<false>(x as IsFloat<1>);
expectType<false>(x as IsFloat<1.0>); // eslint-disable-line unicorn/no-zero-fractions
expectType<false>(x as IsFloat<-1>);
expectType<false>(x as IsFloat<number>);
expectType<false>(x as IsFloat<0o10>);
expectType<false>(x as IsFloat<1n>);
expectType<false>(x as IsFloat<0n>);
expectType<false>(x as IsFloat<0b10>);
expectType<false>(x as IsFloat<0x10>);
expectType<false>(x as IsFloat<1e+100>);
expectType<false>(x as IsFloat<1.23e+21>);
expectType<false>(x as IsFloat<-1.23e+21>);
expectType<false>(x as IsFloat<'1.23'>);
expectType<false>(x as IsFloat<PositiveInfinity>);
