import {expectType} from 'tsd';
import type {IsInteger, PositiveInfinity} from '../index';

expectType<true>({} as IsInteger<0>);
expectType<true>({} as IsInteger<1>);
expectType<true>({} as IsInteger<1.0>); // eslint-disable-line unicorn/no-zero-fractions
expectType<false>({} as IsInteger<1.5>);
expectType<true>({} as IsInteger<-1>);
expectType<false>({} as IsInteger<number>);
expectType<true>({} as IsInteger<0o10>);
expectType<true>({} as IsInteger<1n>);
expectType<true>({} as IsInteger<0n>);
expectType<true>({} as IsInteger<0b10>);
expectType<true>({} as IsInteger<0x10>);
expectType<true>({} as IsInteger<1e+100>);
expectType<false>({} as IsInteger<PositiveInfinity>);
expectType<false>({} as IsInteger<typeof Number.POSITIVE_INFINITY>);
