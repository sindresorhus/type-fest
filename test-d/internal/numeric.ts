import {expectTypeOf} from 'nz';
import type {IsEqual, NegativeInfinity, PositiveInfinity} from '../../index.d.ts';
import type {IsNumberLike, ReverseSign, UnionMin} from '../../source/internal/index.d.ts';

expectTypeOf<IsEqual<IsNumberLike<'1'>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsNumberLike<'-1.1'>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsNumberLike<'5e-20'>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsNumberLike<1>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsNumberLike<'a'>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsNumberLike<''>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsNumberLike<true>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsNumberLike<any>, boolean>>().toBe<true>();
expectTypeOf<IsEqual<IsNumberLike<never>, false>>().toBe<true>();

// The result follows TypeScript's own notion of a numeric string, which is lenient about surrounding whitespace, a leading `+`, and a hexadecimal form.
expectTypeOf<IsEqual<IsNumberLike<' 1'>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsNumberLike<'+1'>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsNumberLike<'0x10'>, true>>().toBe<true>();
expectTypeOf<IsEqual<IsNumberLike<'1_0'>, false>>().toBe<true>();
expectTypeOf<IsEqual<IsNumberLike<'Infinity'>, false>>().toBe<true>();

expectTypeOf<IsEqual<UnionMin<1 | 3 | 2>, 1>>().toBe<true>();
expectTypeOf<IsEqual<UnionMin<0 | 5>, 0>>().toBe<true>();
expectTypeOf<IsEqual<UnionMin<0>, 0>>().toBe<true>();

// The implementation counts upward one tuple element at a time, so the supported range stops at
// 998. The test stays at 998 because 999 is a compile error rather than a wrong answer.
expectTypeOf<IsEqual<UnionMin<998>, 998>>().toBe<true>();
expectTypeOf<IsEqual<UnionMin<number>, number>>().toBe<true>();
expectTypeOf<IsEqual<UnionMin<any>, any>>().toBe<true>();
expectTypeOf<IsEqual<UnionMin<never>, never>>().toBe<true>();
expectTypeOf<IsEqual<UnionMin<PositiveInfinity>, PositiveInfinity>>().toBe<true>();
expectTypeOf<IsEqual<UnionMin<NegativeInfinity>, NegativeInfinity>>().toBe<true>();
expectTypeOf<IsEqual<UnionMin<NegativeInfinity | 3>, NegativeInfinity>>().toBe<true>();
// `PositiveInfinity` only wins when nothing smaller is in the union, because it is not the minimum of `3` and `Infinity`.
expectTypeOf<IsEqual<UnionMin<PositiveInfinity | 3>, 3>>().toBe<true>();
expectTypeOf<IsEqual<UnionMin<PositiveInfinity>, PositiveInfinity>>().toBe<true>();

expectTypeOf<IsEqual<ReverseSign<-1>, 1>>().toBe<true>();
expectTypeOf<IsEqual<ReverseSign<1>, -1>>().toBe<true>();
expectTypeOf<IsEqual<ReverseSign<0>, 0>>().toBe<true>();
expectTypeOf<IsEqual<ReverseSign<-0>, 0>>().toBe<true>();
expectTypeOf<IsEqual<ReverseSign<NegativeInfinity>, PositiveInfinity>>().toBe<true>();
expectTypeOf<IsEqual<ReverseSign<PositiveInfinity>, NegativeInfinity>>().toBe<true>();
expectTypeOf<IsEqual<ReverseSign<-1.5>, 1.5>>().toBe<true>();

// `IsEqual` does not see through a nested application, so this one is asserted on the result directly rather than through `IsEqual`.
expectTypeOf<ReverseSign<ReverseSign<-42>>>().toBe<-42>();
