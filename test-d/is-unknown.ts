import {expectType} from 'tsd';
import type {IsUnknown} from '../index.d.ts';

declare const _unknown: unknown;
declare const something = 'something';

// `IsUnknown` should only be true for `any`
expectType<IsUnknown<unknown>>(true);
expectType<IsUnknown<typeof _unknown>>(true);
expectType<IsUnknown<string>>(false);
expectType<IsUnknown<typeof something>>(false);
expectType<IsUnknown<any>>(false);
expectType<IsUnknown<never>>(false);
expectType<IsUnknown<null>>(false);
expectType<IsUnknown<undefined>>(false);
expectType<IsUnknown<void>>(false);

// Missing generic parameter
// @ts-expect-error
type A = IsUnknown;
