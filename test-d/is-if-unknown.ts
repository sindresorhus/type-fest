import {expectError, expectType} from 'tsd';
import type {IsUnknown, IfUnknown} from '../index';

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

// `IfUnknown` should return `true`/`false` if only `T` is specified
expectType<IfUnknown<unknown>>(true);
expectType<IfUnknown<unknown, 'T', 'F'>>('T');
expectType<IfUnknown<string>>(false);
expectType<IfUnknown<string, 'T', 'F'>>('F');

// Missing generic parameter
expectError<IsUnknown>(_unknown);
expectError<IfUnknown>(_unknown);
