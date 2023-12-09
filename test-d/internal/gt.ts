import {expectType} from 'tsd';
import type {Gt} from '../../source/internal';
import type {NegativeInfinity, PositiveInfinity} from '../../source/numeric';

expectType<Gt<1, 2>>(false);
expectType<Gt<2, 1>>(true);
expectType<Gt<10, 2>>(true);
expectType<Gt<10, -2>>(true);
expectType<Gt<2, 2>>(false);
expectType<Gt<-2, -2>>(false);
expectType<Gt<-2, -3>>(true);

expectType<Gt<PositiveInfinity, -999>>(true);
expectType<Gt<PositiveInfinity, 999>>(true);
expectType<Gt<999, PositiveInfinity>>(false);
expectType<Gt<999, NegativeInfinity>>(true);
expectType<Gt<-999, NegativeInfinity>>(true);
expectType<Gt<PositiveInfinity, PositiveInfinity>>(false);
expectType<Gt<NegativeInfinity, NegativeInfinity>>(false);
expectType<Gt<PositiveInfinity, NegativeInfinity>>(true);
