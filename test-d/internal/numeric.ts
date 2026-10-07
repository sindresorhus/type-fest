import {expectType} from 'tsd';
import type {IsEqual, NegativeInfinity, PositiveInfinity} from '../../index.d.ts';
import type {IsNumberLike, ReverseSign, UnionMin} from '../../source/internal/index.d.ts';

expectType<IsEqual<IsNumberLike<'1'>, true>>(true);
expectType<IsEqual<IsNumberLike<'-1.1'>, true>>(true);
expectType<IsEqual<IsNumberLike<'5e-20'>, true>>(true);
expectType<IsEqual<IsNumberLike<1>, true>>(true);
expectType<IsEqual<IsNumberLike<'a'>, false>>(true);
expectType<IsEqual<IsNumberLike<''>, false>>(true);
expectType<IsEqual<IsNumberLike<true>, false>>(true);
expectType<IsEqual<IsNumberLike<any>, boolean>>(true);
expectType<IsEqual<IsNumberLike<never>, false>>(true);

// The result follows TypeScript's own notion of a numeric string, which is lenient about surrounding whitespace, a leading `+`, and a hexadecimal form.
expectType<IsEqual<IsNumberLike<' 1'>, true>>(true);
expectType<IsEqual<IsNumberLike<'+1'>, true>>(true);
expectType<IsEqual<IsNumberLike<'0x10'>, true>>(true);
expectType<IsEqual<IsNumberLike<'1_0'>, false>>(true);
expectType<IsEqual<IsNumberLike<'Infinity'>, false>>(true);

expectType<IsEqual<UnionMin<1 | 3 | 2>, 1>>(true);
expectType<IsEqual<UnionMin<0 | 5>, 0>>(true);
expectType<IsEqual<UnionMin<0>, 0>>(true);

// The implementation counts upward one tuple element at a time, so the supported range stops at
// 998. The test stays at 998 because 999 is a compile error rather than a wrong answer.
expectType<IsEqual<UnionMin<998>, 998>>(true);
expectType<IsEqual<UnionMin<number>, number>>(true);
expectType<IsEqual<UnionMin<any>, any>>(true);
expectType<IsEqual<UnionMin<never>, never>>(true);
expectType<IsEqual<UnionMin<PositiveInfinity>, PositiveInfinity>>(true);
expectType<IsEqual<UnionMin<NegativeInfinity>, NegativeInfinity>>(true);
expectType<IsEqual<UnionMin<NegativeInfinity | 3>, NegativeInfinity>>(true);
// `PositiveInfinity` only wins when nothing smaller is in the union, because it is not the minimum of `3` and `Infinity`.
expectType<IsEqual<UnionMin<PositiveInfinity | 3>, 3>>(true);
expectType<IsEqual<UnionMin<PositiveInfinity>, PositiveInfinity>>(true);

expectType<IsEqual<ReverseSign<-1>, 1>>(true);
expectType<IsEqual<ReverseSign<1>, -1>>(true);
expectType<IsEqual<ReverseSign<0>, 0>>(true);
expectType<IsEqual<ReverseSign<-0>, 0>>(true);
expectType<IsEqual<ReverseSign<NegativeInfinity>, PositiveInfinity>>(true);
expectType<IsEqual<ReverseSign<PositiveInfinity>, NegativeInfinity>>(true);
expectType<IsEqual<ReverseSign<-1.5>, 1.5>>(true);

// `IsEqual` does not see through a nested application, so this one is asserted on the result directly rather than through `IsEqual`.
expectType<-42>({} as ReverseSign<ReverseSign<-42>>);
