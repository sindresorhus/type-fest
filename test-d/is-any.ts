import {expectTypeOf} from 'nz';
import type {IsAny} from '../index.d.ts';

declare const anything: any;
declare const something = 'something';

// `IsAny` should only be true for `any`
expectTypeOf<IsAny<any>>().toBe<true>();
expectTypeOf<IsAny<typeof anything>>().toBe<true>();
expectTypeOf<IsAny<string>>().toBe<false>();
expectTypeOf<IsAny<typeof something>>().toBe<false>();
expectTypeOf<IsAny<never>>().toBe<false>();
expectTypeOf<IsAny<unknown>>().toBe<false>();
expectTypeOf<IsAny<null>>().toBe<false>();
expectTypeOf<IsAny<undefined>>().toBe<false>();
expectTypeOf<IsAny<void>>().toBe<false>();

// Missing generic parameter
// @ts-expect-error
type A = IsAny;

// Verify that are no circular reference issues
// https://github.com/sindresorhus/type-fest/issues/846
type OnlyAny<T extends IsAny<T> extends true ? any : never> = T;
type B = OnlyAny<any>;
// @ts-expect-error
type C = OnlyAny<string>;
