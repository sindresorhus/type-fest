import {expectError, expectType} from 'tsd';
import type {IsNever, IfNever} from '../index';

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

// `IfNever` should return `true`/`false` if only `T` is specified
expectType<IfNever<never>>(true);
expectType<IfNever<never, 'T', 'F'>>('T');
expectType<IfNever<string>>(false);
expectType<IfNever<string, 'T', 'F'>>('F');

// Missing generic parameter
expectError<IsNever>(_never);
// TODO: commented temporarily due to SamVerschueren/tsd#173
// expectError<IfNever>(_never);
