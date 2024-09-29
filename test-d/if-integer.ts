import {expectType} from 'tsd';
import type {IfInteger} from '../index';

// `IfInteger` should return `true`/`false` if only `T` is specified
expectType<IfInteger<100>>(true);
expectType<IfInteger<string>>(false);
expectType<IfInteger<-1, 'T', 'F'>>('T');
expectType<IfInteger<string, 'T', 'F'>>('F');

// Missing generic parameter
// @ts-expect-error
type A = IfInteger;
