import {expectType} from 'tsd';
import type {NumberAbsolute} from '../../../source/internal';
import type {NegativeInfinity, PositiveInfinity} from '../../../source/numeric';

expectType<NumberAbsolute<3>>(3);
expectType<NumberAbsolute<-3>>(3);
expectType<NumberAbsolute<0>>(0);
expectType<NumberAbsolute<-0>>(0);
expectType<NumberAbsolute<NegativeInfinity>>(null! as PositiveInfinity);
expectType<NumberAbsolute<PositiveInfinity>>(null! as PositiveInfinity);
