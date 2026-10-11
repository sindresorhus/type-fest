import {expectTypeOf} from 'nz';
import type {IsNullable} from '../source/is-nullable.d.ts';

expectTypeOf<IsNullable<any>>().toBe<true>();
expectTypeOf<IsNullable<null>>().toBe<true>();
expectTypeOf<IsNullable<null | undefined>>().toBe<true>();
expectTypeOf<IsNullable<string | null>>().toBe<true>();
expectTypeOf<IsNullable<string | null | undefined>>().toBe<true>();

expectTypeOf<IsNullable<string>>().toBe<false>();
expectTypeOf<IsNullable<string | undefined>>().toBe<false>();

expectTypeOf<IsNullable<void>>().toBe<false>();
expectTypeOf<IsNullable<undefined>>().toBe<false>();
expectTypeOf<IsNullable<never>>().toBe<false>();
expectTypeOf<IsNullable<unknown>>().toBe<false>();
expectTypeOf<IsNullable<() => void>>().toBe<false>();
expectTypeOf<IsNullable<string & null>>().toBe<false>();
