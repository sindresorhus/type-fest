import {expectError, expectType} from 'tsd';
import type {IfNever} from '../index';

declare const _never: never;

// `IfNever` should return `true`/`false` if only `T` is specified
expectType<IfNever<never>>(true);
expectType<IfNever<string>>(false);
expectType<IfNever<never, 'T', 'F'>>('T');
expectType<IfNever<string, 'T', 'F'>>('F');

// Missing generic parameter
expectError<IfNever>(_never);
