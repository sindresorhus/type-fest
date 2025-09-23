import {expectType} from 'tsd';
import type {IsUndefined} from '../source/is-undefined.d.ts';

expectType<IsUndefined<undefined>>(true);
expectType<IsUndefined<any>>(true);
expectType<IsUndefined<never>>(true);
expectType<IsUndefined<null>>(false); // Depends on `strictNullChecks`
expectType<IsUndefined<unknown>>(false);
expectType<IsUndefined<void>>(false);
expectType<IsUndefined<{}>>(false);
