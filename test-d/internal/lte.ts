import {expectType} from 'tsd';
import type {Lte} from '../../source/internal';
import type {NegativeInfinity, PositiveInfinity} from '../../source/numeric';

expectType<Lte<1, 2>>(true);
expectType<Lte<2, 1>>(false);
expectType<Lte<10, -2>>(false);
expectType<Lte<2, 2>>(true);
expectType<Lte<-2, -2>>(true);
expectType<Lte<-2, -3>>(false);
expectType<Lte<PositiveInfinity, -999>>(false);
expectType<Lte<PositiveInfinity, 999>>(false);
expectType<Lte<999, PositiveInfinity>>(true);
expectType<Lte<999, NegativeInfinity>>(false);
expectType<Lte<-999, NegativeInfinity>>(false);
expectType<Lte<PositiveInfinity, PositiveInfinity>>(true);
expectType<Lte<NegativeInfinity, NegativeInfinity>>(true);
expectType<Lte<PositiveInfinity, NegativeInfinity>>(false);
