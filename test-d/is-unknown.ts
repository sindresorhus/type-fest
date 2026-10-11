import {expectTypeOf} from 'nz';
import type {IsUnknown} from '../index.d.ts';

declare const _unknown: unknown;
declare const something = 'something';

// `IsUnknown` should only be true for `any`
expectTypeOf<IsUnknown<unknown>>().toBe<true>();
expectTypeOf<IsUnknown<typeof _unknown>>().toBe<true>();
expectTypeOf<IsUnknown<string>>().toBe<false>();
expectTypeOf<IsUnknown<typeof something>>().toBe<false>();
expectTypeOf<IsUnknown<any>>().toBe<false>();
expectTypeOf<IsUnknown<never>>().toBe<false>();
expectTypeOf<IsUnknown<null>>().toBe<false>();
expectTypeOf<IsUnknown<undefined>>().toBe<false>();
expectTypeOf<IsUnknown<void>>().toBe<false>();

// Missing generic parameter
// @ts-expect-error
type A = IsUnknown;
