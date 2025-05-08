import {expectType} from 'tsd';
import type {Or} from '../source/or.d.ts';

declare const never: never;

expectType<Or<true, true>>(true);
expectType<Or<true, false>>(true);
expectType<Or<false, true>>(true);
expectType<Or<false, false>>(false);
expectType<Or<true, boolean>>(true);
expectType<Or<false, boolean>>(never);
expectType<Or<boolean, boolean>>(never);
