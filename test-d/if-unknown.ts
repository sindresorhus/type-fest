import {expectError, expectType} from 'tsd';
import type {IfUnknown} from '../index';

declare const _unknown: unknown;

// `IfUnknown` should return `true`/`false` if only `T` is specified
expectType<IfUnknown<unknown>>(true);
expectType<IfUnknown<string>>(false);
expectType<IfUnknown<unknown, 'T', 'F'>>('T');
expectType<IfUnknown<string, 'T', 'F'>>('F');

// Missing generic parameter
expectError<IfUnknown>(_unknown);
