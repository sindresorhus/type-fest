import {expectType} from 'tsd';
import type {IfUnknown} from '../index.d.ts';

// `IfUnknown` should return `true`/`false` if only `T` is specified
expectType<IfUnknown<unknown>>(true);
expectType<IfUnknown<string>>(false);
expectType<IfUnknown<unknown, 'T', 'F'>>('T');
expectType<IfUnknown<string, 'T', 'F'>>('F');

// Missing generic parameter
// @ts-expect-error
type A = IfUnknown;
