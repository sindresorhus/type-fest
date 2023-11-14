import {expectType} from 'tsd';
import type {Not} from '../../source/internal';

expectType<Not<true>>(false);
expectType<Not<false>>(true);
expectType<Not<boolean>>(Boolean());
