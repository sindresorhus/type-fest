import { expectType } from 'tsd';
import type { Or, OrAll } from '../source/or.d.ts';

declare const never: never;

// Or
expectType<Or<true, true>>(true);
expectType<Or<true, false>>(true);
expectType<Or<false, true>>(true);
expectType<Or<false, false>>(false);
expectType<Or<true, boolean>>(true);
expectType<Or<false, boolean>>(never);
expectType<Or<boolean, boolean>>(never);

expectType<Or<boolean, never>>(never);
expectType<Or<never, boolean>>(never);
expectType<Or<false, never>>(false);
expectType<Or<never, false>>(false);
expectType<Or<never, true>>(true);
expectType<Or<true, never>>(true);
expectType<Or<never, never>>(never);

// OrAll
expectType<OrAll<[true, true, true]>>(true)
expectType<OrAll<[false, true, true]>>(true)
expectType<OrAll<[false, false, true]>>(true)
expectType<OrAll<[false, false, false]>>(false)
expectType<OrAll<[true, false, false]>>(true)
expectType<OrAll<[true, true, false]>>(true)

// @ts-expect-error
expectType<Or<>>({} as any)
expectType<OrAll<[]>>(never)
expectType<Or<never, any>>(never)
expectType<Or<any, any>>(never)

// Single value
expectType<OrAll<[true]>>(true)
expectType<OrAll<[false]>>(false)
expectType<OrAll<[boolean]>>(never)
expectType<OrAll<[never]>>(never)
expectType<OrAll<[any]>>(never)

// Test if boolean is position dependent
expectType<OrAll<[boolean, true, true, true]>>(true)
expectType<OrAll<[true, boolean, true, true]>>(true)
expectType<OrAll<[true, true, boolean, true]>>(true)
expectType<OrAll<[true, true, true, boolean]>>(true)

expectType<OrAll<[boolean, false, false, false]>>(never)
expectType<OrAll<[false, boolean, false, false]>>(never)
expectType<OrAll<[false, false, boolean, false]>>(never)
expectType<OrAll<[false, false, false, boolean]>>(never)
