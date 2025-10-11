import {expectType} from 'tsd';
import type {Or} from '../source/or.d.ts';

declare const boolean: boolean;

expectType<Or<true, true>>(true);
expectType<Or<true, false>>(true);
expectType<Or<false, true>>(true);
expectType<Or<false, false>>(false);

expectType<Or<true, boolean>>(true);
expectType<Or<boolean, true>>(true);
expectType<Or<false, boolean>>(boolean);
expectType<Or<boolean, false>>(boolean);
expectType<Or<boolean, boolean>>(boolean);

// Boundary cases
expectType<Or<true, any>>(true);
expectType<Or<any, true>>(true);
expectType<Or<false, any>>(boolean);
expectType<Or<any, false>>(boolean);
expectType<Or<boolean, any>>(boolean);
expectType<Or<any, boolean>>(boolean);
expectType<Or<any, any>>(boolean);

expectType<Or<true, never>>(true);
expectType<Or<never, true>>(true);
expectType<Or<false, never>>(false);
expectType<Or<never, false>>(false);
expectType<Or<boolean, never>>(boolean);
expectType<Or<never, boolean>>(boolean);
expectType<Or<never, never>>(false);
