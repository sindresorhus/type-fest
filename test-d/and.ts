import { expectType } from 'tsd';
import type { And, AndAll } from '../source/and.d.ts';

declare const never: never;

// And
expectType<And<true, true>>(true);
expectType<And<true, false>>(false);
expectType<And<false, true>>(false);
expectType<And<false, false>>(false);
expectType<And<true, boolean>>(never);
expectType<And<false, boolean>>(false);
expectType<And<boolean, boolean>>(never);

expectType<And<boolean, never>>(never);
expectType<And<never, boolean>>(never);
expectType<And<false, never>>(false);
expectType<And<never, false>>(false);
expectType<And<never, true>>(true);
expectType<And<true, never>>(true);
expectType<And<never, never>>(never);

// AndAll
expectType<AndAll<[true, true, true]>>(true)
expectType<AndAll<[false, true, true,]>>(false)
expectType<AndAll<[false, false, true,]>>(false)
expectType<AndAll<[false, false, false,]>>(false)
expectType<AndAll<[true, false, false,]>>(false)
expectType<AndAll<[true, true, false,]>>(false)

// @ts-expect-error
expectType<And<>>(never)
expectType<AndAll<[]>>(never)
expectType<And<never, never>>(never)
expectType<And<never, any>>(never)
expectType<And<any, any>>(never)

// Test if boolean is position dependent
expectType<AndAll<[boolean, true, true, true]>>(never)
expectType<AndAll<[true, boolean, true, true]>>(never)
expectType<AndAll<[true, true, boolean, true]>>(never)
expectType<AndAll<[true, true, true, boolean]>>(never)

expectType<AndAll<[boolean, false, false, false]>>(false)
expectType<AndAll<[false, boolean, false, false]>>(false)
expectType<AndAll<[false, false, boolean, false]>>(false)
expectType<AndAll<[false, false, false, boolean]>>(false)
