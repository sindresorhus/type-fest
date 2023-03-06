import {expectError, expectType} from 'tsd';
import type {IsAny, IfAny} from '../index';

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

// `IfAny` should return `true`/`false` if only `T` is specified
expectType<IfAny<any>>(true);
expectType<IfAny<any, 'T', 'F'>>('T');
expectType<IfAny<string>>(false);
expectType<IfAny<string, 'T', 'F'>>('F');

// Missing generic parameter
expectError<IsAny>(anything);
// TODO: commented temporarily due to SamVerschueren/tsd#173
// expectError<IfAny>(anything);
