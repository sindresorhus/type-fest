import {expectType} from 'tsd';
import type {Or} from '../../source/internal';

expectType<Or<true, true>>(true);
expectType<Or<true, false>>(true);
expectType<Or<false, true>>(true);
expectType<Or<false, false>>(false);
expectType<Or<true, boolean>>(true);
expectType<Or<false, boolean>>(null!);
expectType<Or<boolean, boolean>>(null!);
