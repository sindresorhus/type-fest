import {expectType} from 'tsd';
import type {NumberAbsolute} from '../../source/internal/index.d.ts';
import type {NegativeInfinity, PositiveInfinity} from '../../source/numeric.d.ts';

expectType<NumberAbsolute<3>>(3);
expectType<NumberAbsolute<-3>>(3);
expectType<NumberAbsolute<0>>(0);
expectType<NumberAbsolute<-0>>(0);
expectType<NumberAbsolute<NegativeInfinity>>(null! as PositiveInfinity);
expectType<NumberAbsolute<PositiveInfinity>>(null! as PositiveInfinity);
