import {expectType} from 'tsd';
import type {IsAny} from '../index.d.ts';

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
// @ts-expect-error
type A = IsAny;

// Verify that are no circular reference issues
// https://github.com/sindresorhus/type-fest/issues/846
type OnlyAny<T extends IsAny<T> extends true ? any : never> = T;
type B = OnlyAny<any>;
// @ts-expect-error
type C = OnlyAny<string>;
