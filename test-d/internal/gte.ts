import {expectType} from 'tsd';
import type {Gte} from '../../source/internal';
import type {NegativeInfinity, PositiveInfinity} from '../../source/numeric';

expectType<Gte<1, 2>>(false);
expectType<Gte<2, 1>>(true);
expectType<Gte<10, 2>>(true);
expectType<Gte<10, -2>>(true);
expectType<Gte<2, 2>>(true);
expectType<Gte<-2, -2>>(true);
expectType<Gte<-2, -3>>(true);

expectType<Gte<PositiveInfinity, -999>>(true);
expectType<Gte<PositiveInfinity, 999>>(true);
expectType<Gte<999, PositiveInfinity>>(false);
expectType<Gte<999, NegativeInfinity>>(true);
expectType<Gte<-999, NegativeInfinity>>(true);
expectType<Gte<PositiveInfinity, PositiveInfinity>>(true);
expectType<Gte<NegativeInfinity, NegativeInfinity>>(true);
expectType<Gte<PositiveInfinity, NegativeInfinity>>(true);
