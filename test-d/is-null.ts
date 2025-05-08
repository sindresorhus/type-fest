import {expectType} from 'tsd';
import type {IsNull} from '../source/is-null.d.ts';

// https://www.typescriptlang.org/docs/handbook/type-compatibility.html
expectType<IsNull<null>>(true);
expectType<IsNull<any>>(true);
expectType<IsNull<never>>(true);
expectType<IsNull<undefined>>(false); // Depends on `strictNullChecks`
expectType<IsNull<unknown>>(false);
expectType<IsNull<void>>(false);
expectType<IsNull<{}>>(false);
