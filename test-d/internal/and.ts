import {expectType} from 'tsd';
import type {And} from '../../source/internal';

expectType<And<true, true>>(true);
expectType<And<true, false>>(false);
expectType<And<false, true>>(false);
expectType<And<false, false>>(false);
expectType<And<true, boolean>>(Boolean());
expectType<And<false, boolean>>(false);
expectType<And<boolean, boolean>>(Boolean());
