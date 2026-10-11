import {expectTypeOf} from 'nz';
import type {IsOptional} from '../source/is-optional.d.ts';

expectTypeOf<IsOptional<any>>().toBe<true>();
expectTypeOf<IsOptional<undefined>>().toBe<true>();
expectTypeOf<IsOptional<null | undefined>>().toBe<true>();
expectTypeOf<IsOptional<string | undefined>>().toBe<true>();
expectTypeOf<IsOptional<string | null | undefined>>().toBe<true>();

expectTypeOf<IsOptional<string>>().toBe<false>();
expectTypeOf<IsOptional<string | null>>().toBe<false>();

expectTypeOf<IsOptional<void>>().toBe<false>();
expectTypeOf<IsOptional<null>>().toBe<false>();
expectTypeOf<IsOptional<never>>().toBe<false>();
expectTypeOf<IsOptional<unknown>>().toBe<false>();
expectTypeOf<IsOptional<() => void>>().toBe<false>();
expectTypeOf<IsOptional<string & undefined>>().toBe<false>();
