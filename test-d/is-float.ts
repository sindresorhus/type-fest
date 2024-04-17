import {expectType} from 'tsd';
import type {IsFloat, PositiveInfinity} from '../index';

expectType<false>({} as IsFloat<0>);
expectType<false>({} as IsFloat<1>);
expectType<false>({} as IsFloat<1.0>); // eslint-disable-line unicorn/no-zero-fractions
expectType<true>({} as IsFloat<1.5>);
expectType<false>({} as IsFloat<-1>);
expectType<false>({} as IsFloat<number>);
expectType<false>({} as IsFloat<0o10>);
expectType<false>({} as IsFloat<1n>);
expectType<false>({} as IsFloat<0n>);
expectType<false>({} as IsFloat<0b10>);
expectType<false>({} as IsFloat<0x10>);
expectType<false>({} as IsFloat<1e+100>);
expectType<false>({} as IsFloat<PositiveInfinity>);
expectType<false>({} as IsFloat<typeof Number.POSITIVE_INFINITY>);
