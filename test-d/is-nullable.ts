import {expectType} from 'tsd';
import type {IsNullable} from '../source/is-nullable.d.ts';

expectType<IsNullable<any>>(true);
expectType<IsNullable<null>>(true);
expectType<IsNullable<null | undefined>>(true);
expectType<IsNullable<string | null>>(true);
expectType<IsNullable<string | null | undefined>>(true);

expectType<IsNullable<string>>(false);
expectType<IsNullable<string | undefined>>(false);

expectType<IsNullable<void>>(false);
expectType<IsNullable<undefined>>(false);
expectType<IsNullable<never>>(false);
expectType<IsNullable<unknown>>(false);
expectType<IsNullable<() => void>>(false);
expectType<IsNullable<string & null>>(false);
