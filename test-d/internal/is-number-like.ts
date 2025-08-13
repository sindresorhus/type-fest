import {expectType} from 'tsd';
import type {IsNumberLike} from '../../source/internal/numeric.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../../index.d.ts';

// Integer
expectType<IsNumberLike<'-1'>>(true);
expectType<IsNumberLike<-1>>(true);
expectType<IsNumberLike<'+1'>>(true);
expectType<IsNumberLike<'1'>>(true);
expectType<IsNumberLike<1>>(true);

// Float
expectType<IsNumberLike<'-1.1'>>(true);
expectType<IsNumberLike<-1.1>>(true);
expectType<IsNumberLike<'+1.1'>>(true);
expectType<IsNumberLike<'1.1'>>(true);
expectType<IsNumberLike<1.1>>(true);

// Sientific
expectType<IsNumberLike<'+1.2e+3'>>(true);
expectType<IsNumberLike<'1.2e+3'>>(true);
expectType<IsNumberLike<1.2e+3>>(true);
expectType<IsNumberLike<'+5e-3'>>(true);
expectType<IsNumberLike<'5e-3'>>(true);
expectType<IsNumberLike<5e-3>>(true);

expectType<IsNumberLike<'-1.2e+3'>>(true);
expectType<IsNumberLike<-1.2e+3>>(true);
expectType<IsNumberLike<'-5e-3'>>(true);
expectType<IsNumberLike<-5e-3>>(true);

// Non valid numeric
expectType<IsNumberLike<'foo'>>(false);
expectType<IsNumberLike<'1.2.3'>>(false);
expectType<IsNumberLike<'5+1.2'>>(false);
expectType<IsNumberLike<'5e-3.1'>>(false);

// Edge cases
expectType<IsNumberLike<never>>({} as never);
expectType<IsNumberLike<any>>({} as any);
expectType<IsNumberLike<number>>(true);
expectType<IsNumberLike<PositiveInfinity>>(true);
expectType<IsNumberLike<NegativeInfinity>>(true);
