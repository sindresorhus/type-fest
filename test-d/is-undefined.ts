import {expectTypeOf} from 'nz';
import type {IsUndefined} from '../source/is-undefined.d.ts';

expectTypeOf<IsUndefined<undefined>>().toBe<true>();
expectTypeOf<IsUndefined<any>>().toBe<true>();
// `never` is not `undefined`, and `IsOptional<never>` is `false` for the same reason, so the two must agree here too.
expectTypeOf<IsUndefined<never>>().toBe<false>();
expectTypeOf<IsUndefined<string & undefined>>().toBe<false>();
expectTypeOf<IsUndefined<null>>().toBe<false>(); // Depends on `strictNullChecks`
expectTypeOf<IsUndefined<unknown>>().toBe<false>();
expectTypeOf<IsUndefined<void>>().toBe<false>();
expectTypeOf<IsUndefined<{}>>().toBe<false>();

// A union that also contains other types is not `undefined`.
expectTypeOf<IsUndefined<string | undefined>>().toBe<false>();
