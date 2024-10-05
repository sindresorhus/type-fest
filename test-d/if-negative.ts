import {expectType} from 'tsd';
import type {IfNegative} from '../index';

// `IfNegative` should return `true`/`false` if only `T` is specified
expectType<IfNegative<-17.23>>(true);
expectType<IfNegative<0>>(false);
expectType<IfNegative<-100_000, 'T', 'F'>>('T');
expectType<IfNegative<20.21, 'T', 'F'>>('F');

// Missing generic parameter
// @ts-expect-error
type A = IfNegative;
