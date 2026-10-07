import {expectType} from 'tsd';
import type {IsFloat, IsInteger, Opaque, PositiveInfinity} from '../index.d.ts';

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

// A branded literal is still a literal, so the brand is removed before the checks run.
declare const brandedFloat: IsFloat<Opaque<5.5, 'A'>>;
expectType<true>(brandedFloat);

declare const brandedInteger: IsFloat<Opaque<5, 'A'>>;
expectType<false>(brandedInteger);

// `any` is not a float and not the absence of one, so the answer has to be `boolean` rather than a decision either way. It used to be `false`, which contradicted `IsInteger<any>`, whose number branch is defined as `Not<IsFloat<T>>` and which answers `boolean`: the same input was a definite no and a maybe at once.
declare const topType: IsFloat<any>;
expectType<boolean>(topType);

declare const topTypeInteger: IsInteger<any>;
expectType<boolean>(topTypeInteger);
