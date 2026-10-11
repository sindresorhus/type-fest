import {expectTypeOf} from 'nz';
import type {IsNever} from '../index.d.ts';

declare const _never: never;
declare const something = 'something';

// `IsNever` should only be true for `any`
expectTypeOf<IsNever<never>>().toBe<true>();
expectTypeOf<IsNever<typeof _never>>().toBe<true>();
expectTypeOf<IsNever<string>>().toBe<false>();
expectTypeOf<IsNever<typeof something>>().toBe<false>();
expectTypeOf<IsNever<any>>().toBe<false>();
expectTypeOf<IsNever<unknown>>().toBe<false>();
expectTypeOf<IsNever<null>>().toBe<false>();
expectTypeOf<IsNever<undefined>>().toBe<false>();
expectTypeOf<IsNever<void>>().toBe<false>();

// Missing generic parameter
// @ts-expect-error
type A = IsNever;
