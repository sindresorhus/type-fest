import {expectType} from 'tsd';
import type {IsNull} from '../source/is-null.d.ts';

// https://www.typescriptlang.org/docs/handbook/type-compatibility.html
expectType<IsNull<null>>(true);
expectType<IsNull<any>>(true);
// `never` is not `null`, and `IsNullable<never>` and `IsNullable<string & null>` are both `false` for the same reason, so the two must agree here too.
expectType<IsNull<never>>(false);
expectType<IsNull<string & null>>(false);
expectType<IsNull<undefined>>(false); // Depends on `strictNullChecks`
expectType<IsNull<unknown>>(false);
expectType<IsNull<void>>(false);
expectType<IsNull<{}>>(false);

// A union that also contains other types is not `null`.
expectType<IsNull<string | null>>(false);
