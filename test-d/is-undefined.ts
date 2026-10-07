import {expectType} from 'tsd';
import type {IsUndefined} from '../source/is-undefined.d.ts';

expectType<IsUndefined<undefined>>(true);
expectType<IsUndefined<any>>(true);
// `never` is not `undefined`, and `IsOptional<never>` is `false` for the same reason, so the two must agree here too.
expectType<IsUndefined<never>>(false);
expectType<IsUndefined<string & undefined>>(false);
expectType<IsUndefined<null>>(false); // Depends on `strictNullChecks`
expectType<IsUndefined<unknown>>(false);
expectType<IsUndefined<void>>(false);
expectType<IsUndefined<{}>>(false);

// A union that also contains other types is not `undefined`.
expectType<IsUndefined<string | undefined>>(false);
