import {expectType} from 'tsd';
import type {Or} from '../source/or.d.ts';

declare const never: never;

expectType<Or<true, true>>(true);
expectType<Or<true, false>>(true);
expectType<Or<false, true>>(true);
expectType<Or<false, false>>(false);

expectType<Or<true, boolean>>(true);
expectType<Or<boolean, true>>(true);
expectType<Or<false, boolean>>({} as boolean);
expectType<Or<boolean, false>>({} as boolean);
expectType<Or<boolean, boolean>>({} as boolean);

expectType<Or<true, any>>(true);
expectType<Or<any, true>>(true);
expectType<Or<false, any>>({} as boolean);
expectType<Or<any, false>>({} as boolean);
expectType<Or<boolean, any>>({} as boolean);
expectType<Or<any, boolean>>({} as boolean);
expectType<Or<any, any>>({} as boolean);

expectType<Or<true, never>>(true);
expectType<Or<never, true>>(true);
expectType<Or<false, never>>(false);
expectType<Or<never, false>>(false);
expectType<Or<boolean, never>>({} as boolean);
expectType<Or<never, boolean>>({} as boolean);
expectType<Or<never, never>>(false);
