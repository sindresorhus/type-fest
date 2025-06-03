import {expectType} from 'tsd';
import type {And} from '../source/and.d.ts';

expectType<And<true, true>>(true);
expectType<And<true, false>>(false);
expectType<And<false, true>>(false);
expectType<And<false, false>>(false);

expectType<And<true, boolean>>({} as boolean);
expectType<And<boolean, true>>({} as boolean);
expectType<And<false, boolean>>(false);
expectType<And<boolean, false>>(false);
expectType<And<boolean, boolean>>({} as boolean);

// Boundary cases
expectType<And<any, true>>({} as boolean);
expectType<And<true, any>>({} as boolean);
expectType<And<any, false>>(false);
expectType<And<false, any>>(false);
expectType<And<any, boolean>>({} as boolean);
expectType<And<boolean, any>>({} as boolean);
expectType<And<any, any>>({} as boolean);

expectType<And<never, true>>(false);
expectType<And<true, never>>(false);
expectType<And<never, false>>(false);
expectType<And<false, never>>(false);
expectType<And<never, boolean>>(false);
expectType<And<boolean, never>>(false);
expectType<And<never, never>>(false);
