import {expectTypeOf} from 'nz';
import type {IsNumberLike} from '../../source/internal/numeric.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../../index.d.ts';

// Integer
expectTypeOf<IsNumberLike<'-1'>>().toBe<true>();
expectTypeOf<IsNumberLike<-1>>().toBe<true>();
expectTypeOf<IsNumberLike<'+1'>>().toBe<true>();
expectTypeOf<IsNumberLike<'1'>>().toBe<true>();
expectTypeOf<IsNumberLike<1>>().toBe<true>();

// Float
expectTypeOf<IsNumberLike<'-1.1'>>().toBe<true>();
expectTypeOf<IsNumberLike<-1.1>>().toBe<true>();
expectTypeOf<IsNumberLike<'+1.1'>>().toBe<true>();
expectTypeOf<IsNumberLike<'1.1'>>().toBe<true>();
expectTypeOf<IsNumberLike<1.1>>().toBe<true>();

// Scientific
expectTypeOf<IsNumberLike<'+1.2e+3'>>().toBe<true>();
expectTypeOf<IsNumberLike<'1.2e+3'>>().toBe<true>();
expectTypeOf<IsNumberLike<1.2e+3>>().toBe<true>();
expectTypeOf<IsNumberLike<'+5e-3'>>().toBe<true>();
expectTypeOf<IsNumberLike<'5e-3'>>().toBe<true>();
expectTypeOf<IsNumberLike<5e-3>>().toBe<true>();

expectTypeOf<IsNumberLike<'-1.2e+3'>>().toBe<true>();
expectTypeOf<IsNumberLike<-1.2e+3>>().toBe<true>();
expectTypeOf<IsNumberLike<'-5e-3'>>().toBe<true>();
expectTypeOf<IsNumberLike<-5e-3>>().toBe<true>();

// Invalid numeric
expectTypeOf<IsNumberLike<'foo'>>().toBe<false>();
expectTypeOf<IsNumberLike<'1.2.3'>>().toBe<false>();
expectTypeOf<IsNumberLike<'5+1.2'>>().toBe<false>();
expectTypeOf<IsNumberLike<'5e-3.1'>>().toBe<false>();

// Edge cases
expectTypeOf<IsNumberLike<never>>().toBe<false>();
expectTypeOf<boolean>().toBe<IsNumberLike<any>>();
expectTypeOf<IsNumberLike<number>>().toBe<true>();
expectTypeOf<IsNumberLike<PositiveInfinity>>().toBe<true>();
expectTypeOf<IsNumberLike<NegativeInfinity>>().toBe<true>();
