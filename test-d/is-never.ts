import {expectError, expectType} from 'tsd';
import type {IsNever} from '../index';

declare const _never: never;
declare const something = 'something';

// `IsNever` should only be true for `any`
expectType<IsNever<never>>(true);
expectType<IsNever<typeof _never>>(true);
expectType<IsNever<string>>(false);
expectType<IsNever<typeof something>>(false);
expectType<IsNever<any>>(false);
expectType<IsNever<unknown>>(false);
expectType<IsNever<null>>(false);
expectType<IsNever<undefined>>(false);
expectType<IsNever<void>>(false);

// Missing generic parameter
expectError<IsNever>(_never);
