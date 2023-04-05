import {expectError, expectType} from 'tsd';
import type {IsAny} from '../index';

declare const anything: any;
declare const something = 'something';

// `IsAny` should only be true for `any`
expectType<IsAny<any>>(true);
expectType<IsAny<typeof anything>>(true);
expectType<IsAny<string>>(false);
expectType<IsAny<typeof something>>(false);
expectType<IsAny<never>>(false);
expectType<IsAny<unknown>>(false);
expectType<IsAny<null>>(false);
expectType<IsAny<undefined>>(false);
expectType<IsAny<void>>(false);

// Missing generic parameter
expectError<IsAny>(anything);
