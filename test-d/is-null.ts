import {expectTypeOf} from 'nz';
import type {IsNull} from '../source/is-null.d.ts';

// https://www.typescriptlang.org/docs/handbook/type-compatibility.html
expectTypeOf<IsNull<null>>().toBe<true>();
expectTypeOf<IsNull<any>>().toBe<true>();
// `never` is not `null`, and `IsNullable<never>` and `IsNullable<string & null>` are both `false` for the same reason, so the two must agree here too.
expectTypeOf<IsNull<never>>().toBe<false>();
expectTypeOf<IsNull<string & null>>().toBe<false>();
expectTypeOf<IsNull<undefined>>().toBe<false>(); // Depends on `strictNullChecks`
expectTypeOf<IsNull<unknown>>().toBe<false>();
expectTypeOf<IsNull<void>>().toBe<false>();
expectTypeOf<IsNull<{}>>().toBe<false>();

// A union that also contains other types is not `null`.
expectTypeOf<IsNull<string | null>>().toBe<false>();
