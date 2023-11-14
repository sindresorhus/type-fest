import {expectType} from 'tsd';
import type {Abs} from '../../source/internal';
import {type NegativeInfinity, type PositiveInfinity} from '../../source/numeric';

expectType<Abs<3>>(3);
expectType<Abs<-3>>(3);
expectType<Abs<0>>(0);
expectType<Abs<-0>>(0);
expectType<Abs<NegativeInfinity>>(null! as PositiveInfinity);
expectType<Abs<PositiveInfinity>>(null! as PositiveInfinity);
